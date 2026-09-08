'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { play } from '@/lib/sounds';

/**
 * Lightbox.
 *
 * The overlay viewer shared by the work grid and the credential cards.
 *
 * ---- It browses ----
 * It takes the whole set and an index rather than a single image, so opening
 * one card lets you walk the rest with the arrow keys instead of closing and
 * reopening for each. Wrapping at both ends means there is no dead end to back
 * out of. This is the difference between a viewer and a preview.
 *
 * ---- It goes through the optimizer ----
 * This used to render a raw `<img src>`, which reached past `next/image`
 * straight to the file in `public/`. One of those files is a 15.4 MB poster,
 * so opening it downloaded 15.4 MB to fill a box roughly 900px tall. `fill`
 * plus a sized stage gets the same layout — the image scales to the box rather
 * than the box to the image — while the optimizer serves an AVIF a hundredth
 * of the size.
 */

export type LightboxItem = {
  src: string;
  alt: string;
  caption?: string;
  meta?: string;
};

export function Lightbox({
  items,
  index,
  onIndex,
  onClose,
}: {
  items: LightboxItem[];
  index: number;
  onIndex: (next: number) => void;
  onClose: () => void;
}) {
  const [closing, setClosing] = useState(false);
  const item = items[index];
  const many = items.length > 1;

  const close = useCallback(() => {
    setClosing(true);
    play('close');
    window.setTimeout(onClose, 180);
  }, [onClose]);

  const step = useCallback(
    (delta: number) => {
      if (!many) return;
      onIndex((index + delta + items.length) % items.length);
    },
    [index, items.length, many, onIndex],
  );

  useEffect(() => {
    play('open');

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        step(1);
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        step(-1);
      }
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [close, step]);

  if (!item) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.caption ?? item.alt}
      data-closing={closing}
      onClick={close}
      className="lightbox"
    >
      <div
        className="flex items-start justify-between gap-6 border-b border-line p-5 md:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="min-w-0">
          {item.meta && <p className="tag text-signal">{item.meta}</p>}
          {item.caption && (
            <p className="mt-1.5 truncate text-title font-medium text-bone">{item.caption}</p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {many && (
            <>
              <span className="tag mr-2 tabular-nums">
                {index + 1} / {items.length}
              </span>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous"
                className="lightbox__nav"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next"
                className="lightbox__nav"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </>
          )}
          <button
            type="button"
            onClick={close}
            autoFocus
            data-sound="close"
            aria-label="Close"
            className="lightbox__nav"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <figure className="lightbox__stage" onClick={(event) => event.stopPropagation()}>
        <div className="lightbox__frame">
          <Image
            // Keyed on src so stepping through the set remounts the image and
            // replays the settle, instead of swapping the pixels underneath a
            // frame that never moved.
            key={item.src}
            src={item.src}
            alt={item.alt}
            fill
            sizes="100vw"
            priority
            className="lightbox__img object-contain"
          />
        </div>
      </figure>

      <p className="tag pb-5 text-center text-faint">
        {many ? 'Arrow keys to browse · Esc to close' : 'Click the void or press Esc to close'}
      </p>
    </div>,
    document.body,
  );
}
