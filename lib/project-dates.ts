/**
 * When a project was built, as people read it: "27 Oct – 16 Nov 2026", with
 * how long it took ("3 weeks"). Dates come in as ISO days ('2026-10-27'),
 * months ('2026-03') or years ('2024'); a `label` stands in where only a rough
 * time is known ("Mid 2026"). Pure, so tests can load it.
 */

export type Built = { from: string; to?: string; label?: string };

export type BuiltDisplay = {
  /** "27 Oct – 16 Nov 2026", "Mar – May 2026", "Mid 2026". */
  range: string;
  /** "3 weeks", "3 months", or null when it cannot be measured. */
  length: string | null;
  /** Machine-readable ends for <time dateTime>. */
  start: string;
  end: string | null;
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type Parts = { year: number; month?: number; day?: number };

function parse(value: string): Parts {
  const [year, month, day] = value.split('-').map(Number);
  return { year, month, day };
}

function label({ day, month }: Parts, withYear: boolean, year: number): string {
  const parts = [day ? String(day) : null, month ? MONTHS[month - 1] : null, withYear ? String(year) : null];
  return parts.filter(Boolean).join(' ');
}

function plural(count: number, unit: string): string {
  return `${count} ${unit}${count === 1 ? '' : 's'}`;
}

export function formatBuilt(built: Built): BuiltDisplay {
  const from = parse(built.from);
  const to = built.to ? parse(built.to) : null;
  const end = built.to ?? null;

  if (built.label) return { range: built.label, length: null, start: built.from, end };
  if (!to) return { range: label(from, true, from.year), length: null, start: built.from, end };

  const sameYear = from.year === to.year;
  const range = `${label(from, !sameYear, from.year)} – ${label(to, true, to.year)}`;

  let length: string | null = null;
  if (from.day && to.day && from.month && to.month) {
    const days = Math.round((Date.UTC(to.year, to.month - 1, to.day) - Date.UTC(from.year, from.month - 1, from.day)) / 86_400_000) + 1;
    length = days < 14 ? plural(days, 'day') : plural(Math.round(days / 7), 'week');
  } else if (from.month && to.month) {
    length = plural((to.year - from.year) * 12 + (to.month - from.month) + 1, 'month');
  }
  return { range, length, start: built.from, end };
}
