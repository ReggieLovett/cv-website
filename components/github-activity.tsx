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

function CalendarSkeleton() {
  return (
    <div
      className="grid w-max grid-flow-col opacity-60"
      style={{
        gridTemplateRows: `repeat(${DAYS}, ${BLOCK_SIZE}px)`,
        gap: `${BLOCK_MARGIN}px`,
      }}
      aria-hidden="true"
    >
      {Array.from({ length: WEEKS * DAYS }).map((_, i) => (
        <span
          key={i}
          className="block rounded-[2px] bg-line"
          style={{ width: BLOCK_SIZE, height: BLOCK_SIZE }}
        />
      ))}
    </div>
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
        <div className="-mx-5 mt-10 overflow-x-auto px-5 pb-2 md:mx-0 md:px-0">
          <GitHubCalendar
            username={username}
            colorScheme={theme}
            errorMessage="Contribution graph is taking a break — check the live profile instead."
            throwOnError={false}
            fontSize={11}
            blockRadius={2}
            blockSize={BLOCK_SIZE}
            blockMargin={BLOCK_MARGIN}
            theme={{
              light: ['#eeece7', '#f6dccb', '#eeae86', '#e07a41', '#d64a10'],
              dark: ['#16181c', '#3a2318', '#75381a', '#b34d1c', '#f05c26'],
            }}
            labels={{ totalCount: '{{count}} contributions in the last year' }}
          />
        </div>
      </div>
    </section>
  );
}
