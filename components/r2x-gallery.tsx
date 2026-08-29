'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Expand, X } from 'lucide-react';
import { r2xGallery } from '../data/portfolio';
import { Reveal } from './reveal';
import { useExitTransition } from './use-exit-transition';

/**
 * Editorial gallery.
 *
 * The tiles are deliberately unequal — a lead piece and three supporting ones —
 * so the eye is given an order to read them in rather than a uniform contact
 * sheet. Opening a piece uses an in-page lightbox; the previous build linked
 * straight to the raw file, which dropped the visitor onto a bare image URL with
 * no way back into the site.
 */

// Column spans per position, cycling. Sums to 12 across each pair of rows.
const SPANS = ['col-lg-7', 'col-lg-5', 'col-lg-5', 'col-lg-7'];
const RATIOS = ['16 / 10', '4 / 5', '4 / 5', '16 / 10'];

export function R2XGallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { closing, dismiss } = useExitTransition();

  const close = useCallback(() => dismiss(() => setOpenIndex(null)), [dismiss]);
  const step = useCallback(
    (delta: number) =>
      setOpenIndex((current) =>
        current === null ? current : (current + delta + r2xGallery.length) % r2xGallery.length,
      ),
    [],
  );

  return (
    <section id="r2x" className="section section-rule">
      <div className="container">
        <Reveal className="mb-11 max-w-3xl">
          <div className="eyebrow">R²X AGENCY</div>
          <h2 className="display display-lg mt-6">
            MEDIA &amp; DESIGN <span className="gradient-ink">GALLERY</span>
          </h2>
        </Reveal>

        <div className="row g-4">
          {r2xGallery.map((item, index) => (
            <div key={item.id} className={`col-12 col-sm-6 ${SPANS[index % SPANS.length]}`}>
              <Reveal variant="blur" delay={index * 45} className="h-100">
                <button
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  className="tile"
                  aria-label={`View ${item.title}`}
                >
                  <span className="tile__frame" style={{ aspectRatio: RATIOS[index % RATIOS.length] }}>
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      loading="lazy"
                      sizes="(max-width: 576px) 100vw, (max-width: 992px) 50vw, 58vw"
                      className="tile__img"
                    />
                    <span className="tile__scrim" />

                    <span className="tile__expand" aria-hidden="true">
                      <Expand className="h-4 w-4" />
                    </span>

                    <span className="tile__meta">
                      <span className="font-mono-ui block text-[10px] tracking-[0.24em] text-signal">
                        {item.category}
                      </span>
                      <span className="tile__title">{item.title}</span>
                    </span>
                  </span>
                </button>
              </Reveal>
            </div>
          ))}
        </div>
      </div>

      {openIndex !== null && (
        <Lightbox index={openIndex} closing={closing} onClose={close} onStep={step} />
      )}

    </section>
  );
}

function Lightbox({
  index,
  closing,
  onClose,
  onStep,
}: {
  index: number;
  closing: boolean;
  onClose: () => void;
  onStep: (delta: number) => void;
}) {
  const item = r2xGallery[index];

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') onStep(1);
      if (event.key === 'ArrowLeft') onStep(-1);
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, onStep]);

  if (!item) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={onClose}
      data-closing={closing}
      className="lightbox chrome-blur overlay-anim"
    >
      <div className="lightbox__bar" onClick={(event) => event.stopPropagation()}>
        <div className="min-w-0">
          <div className="font-mono-ui text-[10px] tracking-[0.24em] text-signal">{item.category}</div>
          <div className="mt-2 truncate text-base font-medium text-ink">{item.title}</div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="font-mono-ui me-2 d-none d-sm-inline text-[10px] tracking-[0.2em] text-dim-ink">
            {String(index + 1).padStart(2, '0')} / {String(r2xGallery.length).padStart(2, '0')}
          </span>
          <button className="icon-btn" onClick={() => onStep(-1)} aria-label="Previous image">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button className="icon-btn" onClick={() => onStep(1)} aria-label="Next image">
            <ArrowRight className="h-4 w-4" />
          </button>
          <button className="icon-btn" onClick={onClose} data-sound="close" aria-label="Close gallery" autoFocus>
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <figure className="lightbox__stage mb-0">
        {/* Keyed so switching images replays the entrance instead of hard-cutting. */}
        <img
          key={item.id}
          src={item.image}
          alt={item.alt}
          className="lightbox__img panel-anim"
          onClick={(event) => event.stopPropagation()}
        />
      </figure>

      <p className="lightbox__hint">Click anywhere or press Esc to close</p>
    </div>,
    document.body,
  );
}
