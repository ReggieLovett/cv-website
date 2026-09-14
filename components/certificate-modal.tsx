'use client';

import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';
import { type Credential } from '@/data/portfolio';
import { play } from '@/lib/sounds';
import { EASE, MotionProvider } from './motion';

/**
 * CertificateModal — the full record of one credential.
 *
 * Controlled from outside: the parent holds the selected credential in
 * `useState` and passes it in; `null` closes the viewer.
 *
 * ---- Why it portals ----
 * The cards that open it live inside Framer Motion wrappers, which animate with
 * `transform`. Any `position: fixed` element inside a transformed ancestor is
 * positioned against that ancestor, not the viewport — the overlay would open
 * inside a 160px card. Rendering into `document.body` escapes it. React context
 * still flows through a portal, so reduced-motion settings still apply.
 *
 * ---- Accessibility ----
 * `role="dialog"` with `aria-modal`, labelled by its own title. Focus moves to
 * the close button on open, Tab is held inside the dialog, Escape closes, and
 * focus goes back to the card that opened it — a keyboard user lands exactly
 * where they left off instead of at the top of the document.
 *
 * ---- Motion ----
 * The panel rises from 96% rather than from nothing, and leaves faster than it
 * arrives: you watch it open, but you have already decided to close it.
 */

const subscribeNoop = () => () => {};

export function CertificateModal({
  item,
  onClose,
}: {
  item: Credential | null;
  onClose: () => void;
}) {
  // Portals need `document`. Reading it as an external store is the
  // hydration-safe way to know we are on the client, with no setState in an
  // effect and no mismatch on the first render.
  const isClient = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const open = item !== null;

  // Hold the latest `onClose` in a ref so `close` is stable for the life of the
  // component. Parents naturally pass an inline arrow; if `close` changed with
  // it, the open/close effect below would re-run on every render while the
  // dialog is up — replaying the open sound and yanking focus back and forth.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const close = useCallback(() => {
    play('close');
    onCloseRef.current();
  }, []);

  useEffect(() => {
    if (!open) return;

    returnFocus.current = document.activeElement as HTMLElement | null;
    play('open');

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // After the panel mounts, not before — there is nothing to focus yet.
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 30);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      // Hold focus inside the dialog.
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      returnFocus.current?.focus?.();
    };
  }, [open, close]);

  if (!isClient) return null;

  const titleId = item ? `cert-title-${item.id}` : undefined;

  return createPortal(
    <MotionProvider>
      <AnimatePresence>
        {item && (
          <motion.div
            key="cert-modal"
            className="cert-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.24, ease: EASE } }}
            exit={{ opacity: 0, transition: { duration: 0.16, ease: EASE } }}
            onClick={close}
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="cert-modal__panel"
              initial={{ opacity: 0, scale: 0.96, y: 14 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: { duration: 0.36, ease: EASE },
              }}
              exit={{
                opacity: 0,
                scale: 0.98,
                y: 6,
                transition: { duration: 0.16, ease: EASE },
              }}
              // Clicks inside the panel must not reach the backdrop's close.
              onClick={(event) => event.stopPropagation()}
            >
              {/* ---- The document ------------------------------------------ */}
              <div className="cert-modal__stage">
                {item.image ? (
                  <div className="cert-modal__frame">
                    <Image
                      key={item.image}
                      src={item.image}
                      alt={`${item.title} — issued by ${item.issuer}`}
                      fill
                      priority
                      sizes="(max-width: 1024px) 92vw, 62vw"
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <p className="readout text-faint">No scan on file</p>
                )}
              </div>

              {/* ---- The record -------------------------------------------- */}
              <div className="cert-modal__info">
                <div className="flex items-start justify-between gap-4">
                  <p className="zelda-eyebrow">
                    {item.category} · {item.kind}
                  </p>
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={close}
                    data-sound="close"
                    aria-label="Close certificate"
                    className="cert-modal__close"
                  >
                    <X className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>

                <h2 id={titleId} className="cert-modal__title mt-4">
                  {item.title}
                </h2>
                <p className="mt-3 text-body text-dim">{item.issuer}</p>

                <span className="cert-modal__divider" aria-hidden="true" />

                <dl className="space-y-0">
                  <div className="disp-row">
                    <dt className="tag">Issued</dt>
                    <dd className="readout text-bone">{item.date}</dd>
                  </div>
                  {item.credentialNo && (
                    <div className="disp-row">
                      <dt className="tag">Credential No.</dt>
                      <dd className="readout select-all text-bone">{item.credentialNo}</dd>
                    </div>
                  )}
                  <div className="disp-row">
                    <dt className="tag">Status</dt>
                    <dd className="readout text-bone">
                      {item.verifyUrl ? 'Verifiable at source' : 'Record on file'}
                    </dd>
                  </div>
                </dl>

                {item.summary && (
                  <p className="mt-6 text-body text-dim">{item.summary}</p>
                )}

                <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
                  {item.verifyUrl && (
                    <a
                      href={item.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="zelda-button"
                    >
                      Verify credential
                      <span className="zelda-button__well" aria-hidden="true">
                        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </span>
                    </a>
                  )}
                  {item.image && (
                    <a
                      href={item.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link readout"
                    >
                      Open full resolution
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionProvider>,
    document.body,
  );
}
