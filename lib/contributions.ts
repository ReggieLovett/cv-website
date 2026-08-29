/**
 * GitHub contribution calendar.
 *
 * Fetched once at build time in a server component and baked into the static
 * HTML, so the published page makes no request of its own — the graph is just
 * markup by the time a visitor loads it. It refreshes on every deploy.
 *
 * GitHub's own REST API doesn't expose the calendar and the GraphQL one needs
 * a token, so this reads a public mirror. Everything is wrapped so a slow or
 * unreachable API degrades to a graceful empty state instead of failing the
 * build.
 */

export type ContributionDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export type ContributionData = {
  days: ContributionDay[];
  total: number;
  from: string;
  to: string;
};

const ENDPOINT = 'https://github-contributions-api.jogruber.de/v4';

export async function getContributions(username: string): Promise<ContributionData | null> {
  try {
    const response = await fetch(`${ENDPOINT}/${encodeURIComponent(username)}?y=last`, {
      signal: AbortSignal.timeout(8000),
      headers: { accept: 'application/json' },
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as {
      total?: Record<string, number>;
      contributions?: Array<{ date: string; count: number; level: number }>;
    };

    const raw = payload.contributions;
    if (!Array.isArray(raw) || raw.length === 0) return null;

    const days: ContributionDay[] = raw.map((day) => ({
      date: day.date,
      count: Number(day.count) || 0,
      level: (Math.min(4, Math.max(0, Number(day.level) || 0)) as ContributionDay['level']),
    }));

    // The endpoint keys the total by year; `lastYear` is the rolling window
    // that matches the day range it returns.
    const total =
      payload.total?.lastYear ?? days.reduce((sum, day) => sum + day.count, 0);

    return {
      days,
      total,
      from: days[0].date,
      to: days[days.length - 1].date,
    };
  } catch {
    // Offline build, rate limit, or a slow mirror — the section renders its
    // empty state rather than taking the whole build down with it.
    return null;
  }
}

/** `https://github.com/ReggieLovett` -> `ReggieLovett` */
export function usernameFromUrl(url: string): string {
  return url.replace(/\/+$/, '').split('/').pop() ?? '';
}
