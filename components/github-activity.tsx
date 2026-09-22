'use client';

import dynamic from 'next/dynamic';
import { useSyncExternalStore } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { contactInfo } from '@/data/portfolio';
import { getTheme, getThemeServerSnapshot, subscribeToTheme } from '@/lib/theme';
import { SectionHeading } from './section-heading';

/**
 * GitHubActivity — the live contribution calendar.
 *
 * Fetched client-side from the GitHub API (the calendar has no server
 * endpoint), so it loads empty and fills in. The skeleton below is a real
 * 53x7 grid at the same block size and margin as the calendar, so the arrival
 * of the data costs no layout shift.
 *
 * ---- The ramp ----
 * A single-hue scale from the page ground up to the accent. GitHub's own green
 * would be the one colour on the site that belongs to another brand; running
 * the ramp through `signal` makes the graph read as part of the system.
 *
 * The ramp itself lives in CSS (`.gh-cal` in globals.css), mixed from the live
 * `--line` and `--signal` tokens, so it follows light, dark, and the Zelda
 * theme's gold without this file knowing any of them exist. The hex values
 * passed below are the dark/light blues as a fallback for a browser without
 * `color-mix()` — CSS beats the SVG `fill` attribute, so they only show when
 * the stylesheet rule cannot apply.
 *
 * ---- The width ----
 * The SVG carries a viewBox, so from md up it is scaled to the column rather
 * than stopping two thirds of the way across it. On a phone it keeps its
 * native size and scrolls in its own track.
 *
 * ---- The theme ----
 * `react-github-calendar` picks its scheme from `prefers-color-scheme` unless
 * told otherwise, but this site's theme is driven by a `data-theme` attribute
 * the reader controls. Left alone, a reader on a dark OS who switches the page
 * to light gets a dark graph on paper. Subscribing to the theme store and
 * passing `colorScheme` explicitly keeps the two in step.
 */

const BLOCK_SIZE = 11;
const BLOCK_MARGIN = 4;
const WEEKS = 53;
const DAYS = 7;

const GitHubCalendar = dynamic(
  () => import('react-github-calendar').then((mod) => mod.GitHubCalendar),
  { ssr: false, loading: () => <CalendarSkeleton /> },
);

/**
 * Same grid as the calendar, drawn as an SVG with a viewBox so it scales to
 * the column exactly as the real one does (`.gh-cal__skeleton`).
 */
function CalendarSkeleton() {
  const step = BLOCK_SIZE + BLOCK_MARGIN;
  const width = WEEKS * step - BLOCK_MARGIN;
  const height = DAYS * step - BLOCK_MARGIN;
  return (
    <svg
      className="gh-cal__skeleton opacity-60"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
    >
      {Array.from({ length: WEEKS * DAYS }).map((_, i) => (
        <rect
          key={i}
          x={Math.floor(i / DAYS) * step}
          y={(i % DAYS) * step}
          width={BLOCK_SIZE}
          height={BLOCK_SIZE}
          rx={2}
          className="fill-line"
        />
      ))}
    </svg>
  );
}

export function GitHubActivity() {
  const theme = useSyncExternalStore(subscribeToTheme, getTheme, getThemeServerSnapshot);
  const username = contactInfo.github.replace('https://github.com/', '');

  return (
    <section id="activity" className="rail section">
      <SectionHeading
        index="05"
        title="GitHub Activity"
        note="Coding consistency is the only habit that compounds — here it is, on the record."
      />

      <div className="mt-16 md:mt-24">
        <div className="rule-top flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 pt-6">
          <span className="readout text-dim">github.com/{username}</span>
          <a
            href={contactInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="link readout inline-flex items-center gap-1.5"
          >
            Open profile
            <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} aria-hidden="true" />
          </a>
        </div>

        {/* The graph is wider than a phone; it scrolls in its own track so the
            page body never picks up a horizontal scrollbar. */}
        <div className="gh-cal -mx-5 mt-10 overflow-x-auto px-5 pb-2 md:mx-0 md:px-0">
          <GitHubCalendar
            username={username}
            colorScheme={theme}
            // The legend squares carry no level of their own; tagging them
            // lets the same CSS ramp colour the key and the graph.
            renderColorLegend={(swatch, level) => (
              <span key={level} data-level={level} className="inline-flex">
                {swatch}
              </span>
            )}
            errorMessage="Contribution graph is taking a break — check the live profile instead."
            throwOnError={false}
            fontSize={11}
            blockRadius={2}
            blockSize={BLOCK_SIZE}
            blockMargin={BLOCK_MARGIN}
            theme={{
              light: ['#dfe6ef', '#bcb5ee', '#9285e3', '#6a5bdb', '#4434d4'],
              dark: ['#222a3a', '#34457f', '#4b62b6', '#5b77dc', '#6a8dff'],
            }}
            labels={{ totalCount: '{{count}} contributions in the last year' }}
          />
        </div>
      </div>
    </section>
  );
}
