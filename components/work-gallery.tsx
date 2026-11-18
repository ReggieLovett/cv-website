'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight, Github, Maximize2 } from 'lucide-react';
import { type WorkEntry } from '@/data/portfolio';
import { formatBuilt } from '@/lib/project-dates';
import { Lightbox, type LightboxItem } from './lightbox';
import GlareHover from './react-bits/GlareHover';
import { SectionHeading } from './section-heading';
import { riseInTight, stagger, viewport } from './motion';
import styles from './work-gallery.module.css';

/**
 * Projects — the software, each with when it was built, what I did on it, and
 * what it is made with.
 *
 * ---- Layout ----
 * The newest project leads as one full-width card: the list is in date order,
 * so the first card is the latest work, and that is the one a visitor should
 * meet first. Its screenshot runs the full width and its story sits in two
 * columns beneath (a container query, so it follows the card's width, not the
 * window's). The rest share a two-column grid of identical cards, so nothing
 * below the lead claims more attention than another. When the grid would
 * strand a single card on its last row, that card spans the row instead.
 *
 * ---- Facts ----
 * Dates, roles and highlights come from each project's git history, README
 * and live site (data/portfolio.ts). Nothing on a card is decoration copy.
 */

/** "A", "A and B", "A, B and C": each name links to its GitHub profile when there is one. */
function Team({ people }: { people: NonNullable<WorkEntry['team']> }) {
  return people.map((person, i) => (
    <span key={person.name}>
      {i === 0 ? null : i === people.length - 1 ? ' and ' : ', '}
      {person.github ? (
        <a
          href={`https://github.com/${person.github}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.person}
          aria-label={`${person.name} on GitHub (opens in a new tab)`}
        >
          {person.name}
        </a>
      ) : (
        person.name
      )}
    </span>
  ));
}

function isVercel(href?: string): boolean {
  if (!href) return false;
  try {
    return new URL(href).hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
}

export function Gallery({
  id,
  index,
  title,
  note,
  entries,
}: {
  id: string;
  index: string;
  title: string;
  note: string;
  entries: WorkEntry[];
}) {
  const [open, setOpen] = useState<number | null>(null);
  const [lead, ...rest] = entries;
  // An odd remainder would strand the last card; it takes the wide layout.
  const lastIsWide = rest.length % 2 === 1;

  // The whole set is browsable from whichever screenshot was opened.
  const lightboxItems: LightboxItem[] = entries.map((entry) => ({
    src: entry.image,
    alt: entry.alt,
    caption: entry.title,
    meta: [entry.role ?? entry.client, entry.built ? formatBuilt(entry.built).range : entry.year].join(' — '),
  }));

  return (
    <section id={id} className="rail section">
      <SectionHeading index={index} title={title} note={note} />

      <motion.ul
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className={`mt-14 md:mt-20 ${styles.grid}`}
      >
        {lead ? (
          <motion.li variants={riseInTight} className={styles.wide}>
            <Project entry={lead} wide latest onOpen={() => setOpen(0)} />
          </motion.li>
        ) : null}
        {rest.map((entry, i) => {
          const wide = lastIsWide && i === rest.length - 1;
          return (
            <motion.li key={entry.id} variants={riseInTight} className={wide ? styles.wide : undefined}>
              <Project entry={entry} wide={wide} onOpen={() => setOpen(i + 1)} />
            </motion.li>
          );
        })}
      </motion.ul>

      {open !== null && (
        <Lightbox items={lightboxItems} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
      )}
    </section>
  );
}

function Project({
  entry,
  wide = false,
  latest = false,
  onOpen,
}: {
  entry: WorkEntry;
  wide?: boolean;
  latest?: boolean;
  onOpen: () => void;
}) {
  const built = entry.built ? formatBuilt(entry.built) : null;
  const vercel = isVercel(entry.href);
  const titleId = `${entry.id}-title`;
  const didId = `${entry.id}-did`;

  return (
    <article id={entry.id} aria-labelledby={titleId} className={`card scroll-mt-24 ${styles.project}`}>
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        className={styles.media}
        aria-label={`View the ${entry.title} screenshot full size`}
      >
        {/* One pass of light across the screenshot as the pointer arrives —
            the plate reads as glass over the work. */}
        <GlareHover
          width="100%"
          height="100%"
          glareColor="#ffffff"
          glareOpacity={0.22}
          glareAngle={-35}
          glareSize={40}
          softness={0.85}
          variant="sheen"
          rimGlint={false}
          transitionDuration={850}
          playOnce
        >
          <Image
            src={entry.image}
            alt={entry.alt}
            fill
            sizes={wide ? '(max-width: 1024px) 92vw, 70vw' : '(max-width: 640px) 92vw, 46vw'}
            className="object-cover object-top"
            priority={latest}
          />
        </GlareHover>
      </button>

      <div className={styles.body}>
        <div>
          {/* The title leads; what is true of it right now (newest, where it
              runs) rides on the same line instead of stacking above it. */}
          <div className={styles.heading}>
            <h3 id={titleId} className={`font-semibold tracking-tight text-bone ${styles.title}`}>{entry.title}</h3>
            {latest || vercel ? (
              <p className={styles.status}>
                {latest ? <span className="chip chip--verified"><span className="chip__dot" aria-hidden="true" />Latest</span> : null}
                {vercel ? <span className="chip">Vercel</span> : null}
              </p>
            ) : null}
          </div>
          {entry.role ? (
            <p className={`mt-1.5 text-dim ${styles.role}`}>
              {entry.role}
              {entry.team?.length ? <>, with <Team people={entry.team} /></> : null}
            </p>
          ) : null}

          {built ? (
            <p className={styles.built}>
              <span className="readout">Built</span>
              <span className={styles.range}>
                <time dateTime={built.start}>{built.range}</time>
                {built.length ? <span className="text-faint"> · {built.length}</span> : null}
              </span>
            </p>
          ) : null}

          <p className={`text-dim ${styles.summary}`}>{entry.summary}</p>
        </div>

        <div className={styles.details}>
          {entry.highlights?.length ? (
            <div className={styles.did}>
              <p id={didId} className="readout">What I did</p>
              <ul aria-labelledby={didId}>
                {entry.highlights.map((line) => <li key={line}>{line}</li>)}
              </ul>
            </div>
          ) : null}

          {entry.stack?.length ? (
            <ul className={styles.stack} aria-label={`${entry.title} is built with`}>
              {entry.stack.map((tool) => <li key={tool} className="chip">{tool}</li>)}
            </ul>
          ) : null}

          {/* One action row on every card, always: the live site where there
              is one, the full-size screenshot where there is not, and the
              source beside it where the repository is public. */}
          <div className={styles.actions}>
            {entry.href ? (
              <a
                href={entry.href}
                target="_blank"
                rel="noopener noreferrer"
                className="action readout"
                aria-label={`Visit ${entry.title} (opens in a new tab)`}
              >
                Visit site
                <span className="action__well" aria-hidden="true">
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                </span>
              </a>
            ) : (
              <button type="button" onClick={onOpen} aria-haspopup="dialog" className="action readout">
                View full size
                <span className="action__well" aria-hidden="true">
                  <Maximize2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                </span>
              </button>
            )}
            {entry.repo ? (
              <a
                href={entry.repo}
                target="_blank"
                rel="noopener noreferrer"
                className={`action readout ${styles.secondary}`}
                aria-label={`${entry.title} source code on GitHub (opens in a new tab)`}
              >
                Source code
                <span className="action__well" aria-hidden="true">
                  <Github className="h-3.5 w-3.5" strokeWidth={1.5} />
                </span>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
