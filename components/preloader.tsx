'use client';

import { useEffect, useRef, useState } from 'react';
import { profile } from '@/data/portfolio';

/**
 * Preloader.
 *
 * A technical data-load, run once per session (the only thing that justifies
 * it existing). The center mark draw-in is staged with clip-path; the corner
 * readout counts to 100 on a linear timer, because this stands in for
 * telemetry and telemetry does not ease.
 *
 * Whether it has already played is decided by the pre-paint script in
 * layout.tsx, which sets `html[data-entrance='played']` for CSS to act on.
 * Doing it in React instead would mean the server ships it, it paints, and
 * hydration removes it — a flash on every navigation after the first.
 */

const STORAGE_KEY = 'entrance-played';
const HOLD_MS = 1500;
const EXIT_MS = 300; // matches --dur-overlay

export function Preloader() {
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const frame = useRef<number>(0);

  useEffect(() => {
    if (document.documentElement.dataset.entrance === 'played') return;

    // Reduced motion gets the shortest honest version: out of the way at once.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hold = reduced ? 0 : HOLD_MS;
    const tick = reduced ? 0 : 24;

    const schedule = (fn: () => void, ms: number) => {
      timers.current.push(setTimeout(fn, ms));
    };

    // One frame before flipping `ready`, so the browser commits the starting
    // clip-path and transitions out of it instead of snapping.
    frame.current = requestAnimationFrame(() => setReady(true));

    // Linear count-up — standing in for a load, so it must not ease.
    const started = Date.now();
    const count = () => {
      const elapsed = Date.now() - started;
      const ratio = Math.min(elapsed / hold, 1);
      setProgress(Math.round(ratio * 100));
      if (ratio < 1) schedule(count, tick);
    };
    count();

    schedule(() => setLeaving(true), hold);
    schedule(() => {
      setDone(true);
      document.documentElement.dataset.entrance = 'played';
      try {
        window.sessionStorage.setItem(STORAGE_KEY, '1');
      } catch {
        // Private browsing can throw. Worst case it plays again.
      }
    }, hold + EXIT_MS);

    return () => {
      cancelAnimationFrame(frame.current);
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  // Scroll lock, keyed on `done`. Setting `done` renders this component `null`,
  // which is not unmounting, so the release has to be a state change or the
  // lock would stay on the document forever.
  useEffect(() => {
    if (done) return;
    if (document.documentElement.dataset.entrance === 'played') return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [done]);

  if (done) return null;

  return (
    <div
      className="preloader"
      data-ready={ready}
      data-leaving={leaving}
      data-progress={progress}
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Loading</span>
      <div aria-hidden="true">
        <span className="preloader__mark">{profile.initials}</span>
        <div className="preloader__meter" />
        <p className="preloader__pct mt-4 text-center">{progress}%</p>
      </div>
    </div>
  );
}
