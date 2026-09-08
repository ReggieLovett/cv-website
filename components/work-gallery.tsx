'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight, Maximize2 } from 'lucide-react';
import { type WorkEntry } from '@/data/portfolio';
import { Lightbox, type LightboxItem } from './lightbox';
import { SectionHeading } from './section-heading';
import { riseInTight, stagger, viewport } from './motion';

/**
 * Gallery — the work, as a uniform card grid.
 *
 * `projects` and `media` both render through this.
 *
 * ---- Why every card is the same size ----
 * This used to be a weighted composition: entries alternated 7 and 5 columns
 * with a full-width closer, and each plate kept its own aspect ratio. It made
 * a handsome spread and a bad index — the first project read as three times
 * more important than the third purely because of where it fell in the array,
 * and the plates ran so large that a single screenshot filled the viewport.
 *
 * Three equal columns instead. Same width, same media well, same card. Nothing
 * claims more attention than it earned, and each image lands at roughly a
 * third of its former size, which is the size a thumbnail should be.
 *
 * ---- Fitting mixed artwork ----
 * The well is a fixed ratio, so a portrait poster and a landscape screenshot
 * still produce identical cards. Landscape art covers the well; portrait and
 * square art is contained inside it with padding, because cropping a poster to
 * landscape destroys the composition that made it worth showing.
 */

/** True when the entry's own ratio is taller than it is wide, or square. */
function isUpright(ratio: string): boolean {
  const [w, h] = ratio.split('/').map((n) => Number(n.trim()));
  if (!w || !h) return false;
  return w / h <= 1.05;
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

  // The whole set is browsable from whichever card was opened.
  const lightboxItems: LightboxItem[] = entries.map((entry) => ({
    src: entry.image,
    alt: entry.alt,
    caption: entry.title,
    meta: `${entry.client} — ${entry.discipline} — ${entry.year}`,
  }));

  return (
    <section id={id} className="rail section">
      <SectionHeading index={index} title={title} note={note} />

      <motion.ul
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:mt-20"
      >
        {entries.map((entry, i) => (
          <motion.li key={entry.id} variants={riseInTight} className="flex">
            <Plate entry={entry} onOpen={() => setOpen(i)} />
          </motion.li>
        ))}
      </motion.ul>

      {open !== null && (
        <Lightbox
          items={lightboxItems}
          index={open}
          onIndex={setOpen}
          onClose={() => setOpen(null)}
        />
      )}
    </section>
  );
}

function Plate({
  entry,
  onOpen,
}: {
  entry: WorkEntry;
  onOpen: () => void;
}) {
  const upright = isUpright(entry.ratio);

  return (
    <figure id={entry.id} className="card h-full w-full scroll-mt-24 overflow-hidden">
      <button
        type="button"
        onClick={onOpen}
        className="card__media"
        aria-label={`View ${entry.title} — ${entry.discipline} for ${entry.client}`}
      >
        <Image
          src={entry.image}
          alt={entry.alt}
          fill
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
          className={upright ? 'object-contain p-6' : 'object-cover object-top'}
        />
      </button>

      <figcaption className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="readout text-signal">{entry.discipline}</span>
          <span className="tag">{entry.year}</span>
        </div>

        <h3 className="mt-4 line-clamp-2 text-title font-semibold tracking-tight text-bone">
          {entry.title}
        </h3>
        <p className="mt-2 line-clamp-1 text-body text-dim">{entry.client}</p>

        {/* One action row on every card, always — a live link where there is
            one, the full-size image where there is not. Without this the cards
            with a `href` stand taller than the ones without, and the grid goes
            ragged for a reason that has nothing to do with the work. */}
        <div className="mt-auto pt-6">
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
            <button type="button" onClick={onOpen} className="action readout">
              View full size
              <span className="action__well" aria-hidden="true">
                <Maximize2 className="h-3.5 w-3.5" strokeWidth={1.5} />
              </span>
            </button>
          )}
        </div>
      </figcaption>
    </figure>
  );
}
