'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent, ReactNode } from 'react';
import { ArrowUp, ArrowUpRight, RotateCcw, Square, Trash2, X } from 'lucide-react';
import { CHAT_PERSONAS, type ChatPersona } from '@/lib/chat-persona';
import styles from './portfolio-chat.module.css';

type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  persona: ChatPersona;
};

type ChatError = {
  message: string;
};

const MAX_MESSAGE_LENGTH = 2_000;
const MAX_CONTEXT_MESSAGES = 10;
function safeHref(value: string): string | undefined {
  if (value.startsWith('#') || (value.startsWith('/') && !value.startsWith('//'))) {
    return value;
  }
  try {
    const url = new URL(value);
    if (['https:', 'http:', 'mailto:'].includes(url.protocol)) return url.href;
  } catch {
    // Unrecognized links remain readable text.
  }
  return undefined;
}

/** Small, safe formatting support; response text is never rendered as HTML. */
function MessageContent({ content, onNavigate, reveal = false }: { content: string; onNavigate: () => void; reveal?: boolean }) {
  const [revealing, setRevealing] = useState(reveal);
  useEffect(() => {
    if (!reveal) return;
    const timer = window.setTimeout(() => setRevealing(false), 650);
    return () => window.clearTimeout(timer);
  }, [reveal]);
  const tokens = content.split(/(\[[^\]\n]+\]\([^\s)]+\)|\*\*[^*\n]+\*\*|`[^`\n]+`)/g);
  let wordIndex = 0;
  const renderText = (text: string, prefix: number) => {
    if (!reveal) return text;
    return text.split(/(\s+)/).map((word, index) => {
      if (!word.trim()) return word;
      // Reveal in a quick ripple, even for long answers. All text enters the
      // accessible log at once; no repeated announcements or typing delay.
      const delay = Math.min(wordIndex++ * 14, 420);
      return <span key={`${prefix}-${index}`} className={revealing ? styles.replyWord : undefined} style={{ animationDelay: `${delay}ms` }}>{word}</span>;
    });
  };
  const parts: ReactNode[] = tokens.map((token, index) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return <strong key={index}>{renderText(token.slice(2, -2), index)}</strong>;
    }
    if (token.startsWith('`') && token.endsWith('`')) {
      return <code key={index}>{renderText(token.slice(1, -1), index)}</code>;
    }
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
    const href = link ? safeHref(link[2]) : undefined;
    if (link && href) {
      const internal = href.startsWith('#') || href.startsWith('/');
      return (
        <a
          key={index}
          href={href}
          target={internal || href.startsWith('mailto:') ? undefined : '_blank'}
          rel={internal ? undefined : 'noopener noreferrer'}
          onClick={internal ? onNavigate : undefined}
        >
          {renderText(link[1], index)}
        </a>
      );
    }
    return renderText(token, index);
  });
  return <div className={styles.messageContent}>{parts}</div>;
}

export default function PortfolioChat({ open, onClose, persona = 'portfolio' }: { open: boolean; onClose: () => void; persona?: ChatPersona }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const nextMessageId = useRef(0);
  const composingRef = useRef(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [pendingMessage, setPendingMessage] = useState<Message | null>(null);
  const [error, setError] = useState<ChatError | null>(null);
  const [notice, setNotice] = useState('');
  const id = useId();
  const pending = pendingMessage !== null;
  const hasConversation = messages.length > 0 || pending;
  const copy = CHAT_PERSONAS[persona];
  const displayedMessages = pendingMessage ? [...messages, pendingMessage] : messages;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  useEffect(() => {
    if (open && !pending) inputRef.current?.focus({ preventScroll: true });
  }, [open, pending]);

  useEffect(() => {
    if (!open) return;
    const log = logRef.current;
    if (log) log.scrollTop = messages.length > 0 || pending ? log.scrollHeight : 0;
  }, [messages, pending, open]);

  useEffect(() => () => requestRef.current?.abort(), []);

  function close() {
    onClose();
    dialogRef.current?.close();
  }

  async function sendMessage(content: string) {
    const text = content.trim();
    // The ref closes the gap before React commits the pending state.
    if (!text || text.length > MAX_MESSAGE_LENGTH || requestRef.current) return;

    const controller = new AbortController();
    requestRef.current = controller;
    const userMessage: Message = { id: nextMessageId.current++, role: 'user', content: text, persona };
    const context = [...messages.slice(-MAX_CONTEXT_MESSAGES), userMessage].map(({ role, content }) => ({
      role,
      content: content.slice(0, role === 'user' ? MAX_MESSAGE_LENGTH : 6_000),
    }));
    setPendingMessage(userMessage);
    setDraft('');
    setError(null);
    setNotice('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: context, persona }),
        signal: controller.signal,
      });
      const data: unknown = await response.json().catch(() => null);
      const result = data && typeof data === 'object' ? (data as Record<string, unknown>) : null;
      if (!response.ok) {
        throw new Error(
          typeof result?.error === 'string'
            ? result.error
            : 'The guide couldn’t reply just now. Please try again.',
        );
      }
      if (typeof result?.message !== 'string' || !result.message.trim()) {
        throw new Error('The guide returned an empty reply. Please try again.');
      }
      if (controller.signal.aborted || requestRef.current !== controller) return;
      const assistantMessage: Message = {
        id: nextMessageId.current++,
        role: 'assistant',
        content: result.message.trim(),
        persona,
      };
      setMessages((previous) => [...previous, userMessage, assistantMessage]);
    } catch (cause) {
      if (requestRef.current !== controller) return;
      if (controller.signal.aborted) {
        setNotice('Response stopped. Your message is ready to send again.');
      } else {
        setError({
          message:
            cause instanceof Error && cause.message !== 'Failed to fetch'
              ? cause.message
              : 'Couldn’t connect to the guide. Check your connection and try again.',
        });
      }
      setDraft(text);
    } finally {
      if (requestRef.current === controller) {
        requestRef.current = null;
        setPendingMessage(null);
      }
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(draft);
  }

  function stopResponse() {
    const request = requestRef.current;
    if (!request || !pendingMessage) return;
    requestRef.current = null;
    request.abort();
    setDraft(pendingMessage.content);
    setPendingMessage(null);
    setNotice('Response stopped. Your message is ready to send again.');
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && !composingRef.current) {
      event.preventDefault();
      if (!pending) void sendMessage(draft);
    }
  }

  function clearConversation() {
    if (requestRef.current) return;
    setMessages([]);
    setDraft('');
    setError(null);
    setNotice('Conversation cleared.');
    inputRef.current?.focus();
  }

  return (
    <dialog
      ref={dialogRef}
      id="portfolio-chat"
      className={styles.dialog}
      data-persona={persona}
      aria-labelledby={`${id}-title`}
      onClose={() => { if (!dialogRef.current?.open) onClose(); }}
    >
      <div className={styles.panel}>
        <header className={styles.header}>
          <div className={styles.identity}>
            <span className={styles.avatar} aria-hidden="true" />
            <div className={styles.heading}>
              <h2 id={`${id}-title`}>{copy.name}</h2>
              <p>{copy.role}{persona === 'zelda' ? ' · AI guide' : ''}</p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.iconButton}
              type="button"
              aria-label="Clear conversation"
              title="Clear conversation"
              disabled={(!hasConversation && !error && !draft) || pending}
              onClick={clearConversation}
            >
              <Trash2 size={17} strokeWidth={1.5} aria-hidden="true" />
            </button>
            <button className={styles.iconButton} type="button" aria-label="Close chat" onClick={close}>
              <X size={19} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </header>

        <div ref={logRef} className={styles.conversation} role="log" aria-live="polite" aria-relevant="additions text" aria-label="Conversation">
          {!hasConversation ? (
            <div className={styles.welcome}>
              <h3>{copy.welcome}</h3>
              <p>{copy.intro}</p>
              <div className={styles.starters} aria-label="Suggested questions">
                {copy.starters.map((prompt) => (
                  <button key={prompt} type="button" onClick={() => void sendMessage(prompt)}>
                    <span>{prompt}</span>
                    <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <ol className={styles.messages}>
              {displayedMessages.map((message) => (
                <li key={message.id} className={styles.message} data-role={message.role}>
                  <span className={styles.speaker}>{message.role === 'user' ? 'You' : CHAT_PERSONAS[message.persona].speaker}</span>
                  <MessageContent content={message.content} onNavigate={close} reveal={message.role === 'assistant'} />
                </li>
              ))}
              {pendingMessage ? (
                <li className={styles.thinking}>
                  <span className={styles.thinkingDots} aria-hidden="true">
                    <span /><span /><span />
                  </span>
                  {CHAT_PERSONAS[pendingMessage.persona].thinking}
                </li>
              ) : null}
            </ol>
          )}
        </div>

        <div className={styles.composerArea}>
          {error ? (
            <div className={styles.error} role="alert">
              <p>{error.message}</p>
              <button type="button" onClick={() => void sendMessage(draft)} disabled={!draft.trim()}>
                <RotateCcw size={13} strokeWidth={1.5} aria-hidden="true" />
                Try again
              </button>
            </div>
          ) : null}
          <p className={styles.visuallyHidden} role="status">{notice}</p>
          <form className={styles.form} onSubmit={submit}>
            <label htmlFor={`${id}-message`} className={styles.visuallyHidden}>Message {copy.name}</label>
            <textarea
              ref={inputRef}
              id={`${id}-message`}
              name="message"
              rows={2}
              maxLength={MAX_MESSAGE_LENGTH}
              placeholder={copy.placeholder}
              value={draft}
              disabled={pending}
              onChange={(event) => {
                setDraft(event.target.value);
                setError(null);
                setNotice('');
              }}
              onCompositionStart={() => { composingRef.current = true; }}
              onCompositionEnd={() => { composingRef.current = false; }}
              onKeyDown={handleKeyDown}
              aria-describedby={draft.length >= 1_800 ? `${id}-limit` : undefined}
              autoFocus
            />
            {pending ? (
              <button className={styles.sendButton} type="button" aria-label="Stop response" title="Stop response" onClick={stopResponse}>
                <Square size={14} fill="currentColor" strokeWidth={1.5} aria-hidden="true" />
              </button>
            ) : (
              <button className={styles.sendButton} type="submit" aria-label="Send message" disabled={!draft.trim()}>
                <ArrowUp size={19} strokeWidth={1.75} aria-hidden="true" />
              </button>
            )}
          </form>
          {draft.length >= 1_800 ? <p id={`${id}-limit`} className={styles.limit}>{draft.length.toLocaleString()} / 2,000 characters</p> : null}
          <p className={styles.disclosure}>AI can make mistakes. Messages are sent to Groq.</p>
        </div>
      </div>
    </dialog>
  );
}
