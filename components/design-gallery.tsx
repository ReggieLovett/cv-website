'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { type WorkEntry } from '@/data/portfolio';
import { Lightbox, type LightboxItem } from './lightbox';
import { SectionHeading } from './section-heading';
import { fadeIn, viewport } from './motion';

/**
 * DesignGallery — the design work, hung like a gallery.
 *
 * ---- Why this is not the project grid ----
 * Software screenshots want uniformity: they are all the same kind of object,
 * and a ragged grid of them reads as sloppy rather than as composed. Design
 * work is the opposite. A 2:3 poster, a square mark and a 4:3 photograph are
 * different objects, and forcing all three into one 4:3 well either crops the
 * poster to ruin or floats it in dead space. The proportion of a piece is part
 * of the piece.
 *
 * So this is a masonry: CSS columns, each work at its own aspect ratio, packed
 * tight. Small — four columns on a wide screen puts each piece at roughly
 * 230px, which is a gallery wall rather than a slideshow.
 *
 * ---- Why there is no card ----
 * A border, a fill and a footer around a poster is a frame around a frame. The
 * work is the content here; the caption is a label beside it, set quiet and
 * small. The only chrome is a hairline that appears under the caption on hover.
 *
 * `break-inside: avoid` keeps a figure from splitting across a column, which is
 * the one thing CSS columns will do wrong if you let them.
 */

/**
 * `next/image` needs intrinsic dimensions to reserve the right box before the
 * file loads. Passing a square 800x800 for everything locked every piece to
 * 1:1 — which quietly defeated the entire point of a masonry, since a 2:3
 * poster and a 4:3 photograph came out the same height.
 *
 * The declared ratio is the source of truth, so derive the pair from it.
 */
function intrinsic(ratio: string): { width: number; height: number } {
  const [w, h] = ratio.split('/').map((n) => Number(n.trim()));
  if (!w || !h) return { width: 800, height: 800 };
  return { width: 800, height: Math.round((800 * h) / w) };
}

export function DesignGallery({
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

  const items: LightboxItem[] = entries.map((entry) => ({
    src: entry.image,
    alt: entry.alt,
    caption: entry.title,
    meta: `${entry.client} — ${entry.discipline} — ${entry.year}`,
  }));

  return (
    <section id={id} className="rail section">
      <SectionHeading index={index} title={title} note={note} />

      <motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="mt-14 gap-5 [column-fill:_balance] columns-2 md:mt-20 md:columns-3 xl:columns-4"
      >
        {entries.map((entry, i) => (
          <figure
            key={entry.id}
            id={entry.id}
            className="group mb-5 break-inside-avoid scroll-mt-24"
          >
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="frame block w-full"
              aria-label={`View ${entry.title} — ${entry.discipline} for ${entry.client}`}
            >
              <Image
                src={entry.image}
                alt={entry.alt}
                {...intrinsic(entry.ratio)}
                sizes="(max-width: 640px) 46vw, (max-width: 1280px) 30vw, 22vw"
                className="frame__img h-auto w-full"
              />
            </button>

            <figcaption className="mt-3">
              <p className="line-1 text-body font-medium text-bone transition-colors duration-hover ease-out group-hover:text-signal">
                {entry.title}
              </p>
              <p className="tag mt-1">
                {entry.discipline} — {entry.year}
              </p>
            </figcaption>
          </figure>
        ))}
      </motion.div>

      {open !== null && (
        <Lightbox items={items} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
      )}
    </section>
  );
}
