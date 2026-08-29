'use client';

import { ArrowUpRight } from 'lucide-react';
import type { ContributionData, ContributionDay } from '@/lib/contributions';
import { contactInfo } from '../data/portfolio';
import { Reveal } from './reveal';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Dates are plain YYYY-MM-DD; parsing them as UTC avoids a timezone shifting a day. */
function parseDay(date: string): Date {
  return new Date(`${date}T00:00:00Z`);
}

type Cell = ContributionDay | null;

/**
 * Lays the calendar out the way GitHub does: one column per week, seven rows
 * for the weekdays. The first column is padded so every row is a consistent
 * weekday, otherwise the whole grid is offset by however the range happens to
 * start.
 */
function buildColumns(days: ContributionDay[]): Cell[][] {
  const leading = parseDay(days[0].date).getUTCDay();
  const cells: Cell[] = [...Array<Cell>(leading).fill(null), ...days];

  const columns: Cell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    const week = cells.slice(i, i + 7);
    while (week.length < 7) week.push(null);
    columns.push(week);
  }
  return columns;
}

/** The column each month first appears in, for the labels along the top. */
function monthLabels(columns: Cell[][]): Array<{ column: number; label: string }> {
  const labels: Array<{ column: number; label: string }> = [];
  let previous = -1;

  columns.forEach((week, index) => {
    const first = week.find((day): day is ContributionDay => day !== null);
    if (!first) return;
    const month = parseDay(first.date).getUTCMonth();
    if (month === previous) return;
    previous = month;
    // Skip a label that would collide with the one before it.
    if (labels.length && index - labels[labels.length - 1].column < 3) return;
    labels.push({ column: index, label: MONTHS[month] });
  });

  return labels;
}

const formatDate = (date: string) =>
  parseDay(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });

export function ContributionGraph({ data }: { data: ContributionData | null }) {
  return (
    <section id="activity" className="section section-rule">
      <div className="container">
        <div className="row g-4 align-items-end mb-11">
          <div className="col-12 col-lg-7">
            <Reveal>
              <div className="eyebrow">BUILD LOG</div>
              <h2 className="display display-lg mt-6">
                CONTRIBUTION <span className="gradient-ink">ACTIVITY.</span>
              </h2>
            </Reveal>
          </div>
          <div className="col-12 col-lg-5">
            <Reveal delay={90}>
              <p className="body-text">
                Public commit activity on GitHub over the past year, pulled straight from my profile.
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal variant="blur">
          <div className="bezel">
            <div className="bezel__core p-4 p-md-5">
              {data ? (
                <>
                  <div className="d-flex flex-wrap align-items-baseline justify-content-between gap-3 mb-4">
                    <div className="d-flex align-items-baseline gap-3">
                      <span className="display display-md">{data.total}</span>
                      <span className="font-mono-ui text-[10px] tracking-[0.24em] text-dim-ink">
                        {/* Wrapped in an expression: a bare `//` after a JSX expression
                            parses as a comment node. */}
                        {data.total === 1 ? 'CONTRIBUTION' : 'CONTRIBUTIONS'}
                        {' // LAST 12 MONTHS'}
                      </span>
                    </div>
                    <a
                      href={contactInfo.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono-ui d-inline-flex align-items-center gap-1 text-[10px] tracking-[0.2em] text-dim-ink transition-colors hover:text-ink"
                    >
                      VIEW PROFILE
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </div>

                  <CalendarGrid days={data.days} />

                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-4">
                    <span className="font-mono-ui text-[10px] tracking-[0.2em] text-dim-ink">
                      {formatDate(data.from)} — {formatDate(data.to)}
                    </span>
                    <div className="d-flex align-items-center gap-2">
                      <span className="font-mono-ui text-[10px] tracking-[0.2em] text-dim-ink">LESS</span>
                      {[0, 1, 2, 3, 4].map((level) => (
                        <span key={level} className="contrib-cell" data-level={level} aria-hidden="true" />
                      ))}
                      <span className="font-mono-ui text-[10px] tracking-[0.2em] text-dim-ink">MORE</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-4 text-center">
                  <p className="body-text">Contribution data isn’t available right now.</p>
                  <a
                    href={contactInfo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-quiet mt-4"
                  >
                    VIEW GITHUB PROFILE
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CalendarGrid({ days }: { days: ContributionDay[] }) {
  const columns = buildColumns(days);
  const labels = monthLabels(columns);

  return (
    <figure className="contrib mb-0">
      <figcaption className="sr-only">
        GitHub contribution calendar. Each square is one day; darker squares are days with more
        commits.
      </figcaption>

      <div className="contrib__scroll">
        <div className="contrib__inner">
          <div className="contrib__months" style={{ gridTemplateColumns: `repeat(${columns.length}, var(--cell))` }}>
            {labels.map(({ column, label }) => (
              <span key={`${label}-${column}`} style={{ gridColumnStart: column + 1 }}>
                {label}
              </span>
            ))}
          </div>

          <div className="contrib__body">
            <div className="contrib__days" aria-hidden="true">
              {/* Alternate weekdays only — seven labels at this size is a wall of text. */}
              {WEEKDAYS.map((day, i) => (
                <span key={day}>{i % 2 === 1 ? day : ''}</span>
              ))}
            </div>

            <div
              className="contrib__grid"
              style={{ gridTemplateColumns: `repeat(${columns.length}, var(--cell))` }}
              role="img"
              aria-label={`Contribution calendar from ${formatDate(days[0].date)} to ${formatDate(days[days.length - 1].date)}`}
            >
              {columns.map((week, columnIndex) =>
                week.map((day, rowIndex) =>
                  day ? (
                    <span
                      key={day.date}
                      className="contrib-cell"
                      data-level={day.level}
                      style={{ gridColumn: columnIndex + 1, gridRow: rowIndex + 1 }}
                      title={`${day.count === 0 ? 'No contributions' : `${day.count} contribution${day.count === 1 ? '' : 's'}`} on ${formatDate(day.date)}`}
                    />
                  ) : (
                    <span
                      key={`pad-${columnIndex}-${rowIndex}`}
                      className="contrib-cell contrib-cell--empty"
                      style={{ gridColumn: columnIndex + 1, gridRow: rowIndex + 1 }}
                      aria-hidden="true"
                    />
                  ),
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
