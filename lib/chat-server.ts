import { getChatSystemPrompt } from './chat-context';
import type { ChatPersona } from './chat-persona';

export const CHAT_MODEL = 'openai/gpt-oss-120b';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MAX_BODY_BYTES = 64 * 1024;
const MAX_HISTORY = 12;
const MAX_HISTORY_CHARACTERS = 12_000;
const RATE_WINDOW_MS = 60_000;
const CLIENT_REQUEST_LIMIT = 12;
const GLOBAL_REQUEST_LIMIT = 60;
const MAX_CONCURRENT_REQUESTS = 4;

type ChatMessage = { role: 'user' | 'assistant'; content: string };
type RateBucket = { count: number; resetsAt: number };
type HandlerOptions = {
  fetchImpl?: typeof fetch;
  getApiKey?: () => string | undefined;
  now?: () => number;
  timeoutMs?: number;
};

class RequestError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

function json(body: { message: string } | { error: string }, status = 200, headers?: HeadersInit) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store', ...headers },
  });
}

function validateMessages(body: unknown): ChatMessage[] {
  if (!body || typeof body !== 'object' || !('messages' in body) || !Array.isArray(body.messages)) {
    throw new RequestError('Send a conversation with at least one message.', 400);
  }
  if (body.messages.length < 1 || body.messages.length > 40) {
    throw new RequestError('Please start a new conversation and try again.', 400);
  }

  const messages: ChatMessage[] = body.messages.map((entry: unknown) => {
    if (!entry || typeof entry !== 'object' || !('role' in entry) || !('content' in entry)
      || (entry.role !== 'user' && entry.role !== 'assistant') || typeof entry.content !== 'string') {
      throw new RequestError('Each message must have a user or assistant role and text content.', 400);
    }
    const content = entry.content.trim();
    const limit = entry.role === 'user' ? 2_000 : 6_000;
    if (!content || content.length > limit) {
      throw new RequestError(`Please keep ${entry.role} messages between 1 and ${limit.toLocaleString('en-US')} characters.`, 400);
    }
    return { role: entry.role, content };
  });

  if (messages[messages.length - 1].role !== 'user') {
    throw new RequestError('The last message must be from the visitor.', 400);
  }

  // Keep the latest complete tail, with a hard character budget as well as
  // a turn limit. The newest visitor message is always retained.
  const tail: ChatMessage[] = [];
  let characterCount = 0;
  for (let index = messages.length - 1; index >= 0 && tail.length < MAX_HISTORY; index -= 1) {
    const message = messages[index];
    if (characterCount + message.content.length > MAX_HISTORY_CHARACTERS) break;
    tail.unshift(message);
    characterCount += message.content.length;
  }
  while (tail[0]?.role === 'assistant') tail.shift();
  return tail;
}

function validatePersona(body: unknown): ChatPersona {
  if (!body || typeof body !== 'object' || !('persona' in body)) return 'portfolio';
  if (body.persona === 'portfolio' || body.persona === 'zelda') return body.persona;
  throw new RequestError('Please choose a valid portfolio guide.', 400);
}

async function readBody(request: Request): Promise<unknown> {
  const declaredLength = request.headers.get('content-length');
  if (declaredLength && Number(declaredLength) > MAX_BODY_BYTES) {
    throw new RequestError('That conversation is too large. Please start a new one.', 413);
  }
  if (!request.body) throw new RequestError('Please include a message.', 400);

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let bytesRead = 0;
  let text = '';
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytesRead += chunk.value.byteLength;
      if (bytesRead > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new RequestError('That conversation is too large. Please start a new one.', 413);
      }
      text += decoder.decode(chunk.value, { stream: true });
    }
    text += decoder.decode();
    return JSON.parse(text);
  } catch (error) {
    if (error instanceof RequestError) throw error;
    throw new RequestError('Please send a valid JSON conversation.', 400);
  } finally {
    reader.releaseLock();
  }
}

function clientKey(request: Request): string {
  // Only trust client-IP headers supplied by the configured hosting platform.
  // Generic x-forwarded-for is caller-controlled on an unconfigured Node host.
  if (process.env.NETLIFY === 'true') {
    return request.headers.get('x-nf-client-connection-ip')?.slice(0, 100) || 'shared';
  }
  if (process.env.VERCEL === '1') {
    return request.headers.get('x-vercel-forwarded-for')?.split(',')[0].trim().slice(0, 100) || 'shared';
  }
  return 'shared';
}

function matchesRequestOrigin(request: Request, origin: string): boolean {
  try {
    const requestUrl = new URL(request.url);
    const host = request.headers.get('host');
    // Next can reconstruct request.url using its listening hostname (for
    // example localhost), while Host retains the visitor's actual target
    // (127.0.0.1 or the public domain behind a proxy). Use that authority with
    // the scheme already resolved by Next. Forwarded host/proto headers are
    // not independently trusted here, since callers can supply them.
    if (host) {
      if (/[\/\\@?#\s]/.test(host)) return false;
      return origin === new URL(`${requestUrl.protocol}//${host}`).origin;
    }
    return origin === requestUrl.origin;
  } catch {
    return false;
  }
}

/** Server route handler. Kept as a factory so tests can mock Groq without a key. */
export function createChatHandler({
  fetchImpl = fetch,
  getApiKey = () => process.env.GROQ_API_KEY,
  now = Date.now,
  timeoutMs = 25_000,
}: HandlerOptions = {}) {
  // These are best-effort limits per running server instance. The host's edge
  // limits and Groq project spend limits are the durable production boundary.
  const clients = new Map<string, RateBucket>();
  let globalBucket: RateBucket = { count: 0, resetsAt: 0 };
  let activeRequests = 0;

  return async function POST(request: Request): Promise<Response> {
    const origin = request.headers.get('origin');
    if (request.headers.get('sec-fetch-site') === 'cross-site'
      || (origin && !matchesRequestOrigin(request, origin))) {
      return json({ error: 'Please open the chat from the portfolio website.' }, 403);
    }
    if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
      return json({ error: 'Please send the conversation as JSON.' }, 415);
    }

    const apiKey = getApiKey()?.trim();
    if (!apiKey) {
      return json({ error: 'The chat is not connected yet. Please contact Reggie using the contact section.' }, 503);
    }

    const timestamp = now();
    if (timestamp >= globalBucket.resetsAt) {
      globalBucket = { count: 0, resetsAt: timestamp + RATE_WINDOW_MS };
    }
    clients.forEach((bucket, key) => {
      if (timestamp >= bucket.resetsAt) clients.delete(key);
    });
    let key = clientKey(request);
    if (!clients.has(key) && clients.size >= 1_000) key = 'overflow';
    const clientBucket = clients.get(key) || { count: 0, resetsAt: timestamp + RATE_WINDOW_MS };
    if (clientBucket.count >= CLIENT_REQUEST_LIMIT || globalBucket.count >= GLOBAL_REQUEST_LIMIT) {
      const resetsAt = clientBucket.count >= CLIENT_REQUEST_LIMIT ? clientBucket.resetsAt : globalBucket.resetsAt;
      return json({ error: 'A little breather! Please try again in a minute.' }, 429, {
        'Retry-After': String(Math.max(1, Math.ceil((resetsAt - timestamp) / 1_000))),
      });
    }
    clientBucket.count += 1;
    clients.set(key, clientBucket);
    globalBucket.count += 1;

    let messages: ChatMessage[];
    let persona: ChatPersona;
    try {
      const body = await readBody(request);
      messages = validateMessages(body);
      persona = validatePersona(body);
    } catch (error) {
      if (error instanceof RequestError) return json({ error: error.message }, error.status);
      return json({ error: 'That message could not be read. Please try again.' }, 400);
    }

    if (activeRequests >= MAX_CONCURRENT_REQUESTS) {
      return json({ error: 'The chat is busy at the moment. Please try again shortly.' }, 429, { 'Retry-After': '5' });
    }

    const controller = new AbortController();
    const abortFromVisitor = () => controller.abort();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    request.signal.addEventListener('abort', abortFromVisitor, { once: true });
    if (request.signal.aborted) controller.abort();
    activeRequests += 1;
    try {
      const upstream = await fetchImpl(GROQ_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: CHAT_MODEL,
          messages: [{ role: 'system', content: getChatSystemPrompt(persona) }, ...messages],
          temperature: 0.5,
          max_completion_tokens: 1_200,
          reasoning_effort: 'low',
          include_reasoning: false,
          stream: false,
        }),
        signal: controller.signal,
        cache: 'no-store',
      });

      if (!upstream.ok) {
        // Never relay upstream bodies: they may contain account or request details.
        await upstream.body?.cancel();
        if (upstream.status === 429) {
          return json({ error: 'The chat has reached its limit for now. Please try again in a minute.' }, 429, { 'Retry-After': '60' });
        }
        if (upstream.status === 401 || upstream.status === 403) {
          return json({ error: 'The chat connection needs attention. Please use the contact section for now.' }, 503);
        }
        return json({ error: 'The chat service is temporarily unavailable. Please try again shortly.' }, 502);
      }

      const result = await upstream.json();
      const reply = result?.choices?.[0]?.message?.content;
      if (typeof reply !== 'string' || !reply.trim() || reply.length > 6_000) {
        return json({ error: 'The chat could not finish that reply. Please try again.' }, 502);
      }
      return json({ message: reply.trim() });
    } catch {
      return json({
        error: controller.signal.aborted
          ? 'That reply took too long. Please try again.'
          : 'The chat could not connect. Please try again shortly.',
      }, controller.signal.aborted ? 504 : 502);
    } finally {
      clearTimeout(timeout);
      request.signal.removeEventListener('abort', abortFromVisitor);
      activeRequests -= 1;
    }
  };
}
