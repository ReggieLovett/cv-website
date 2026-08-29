'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Lets an overlay play an exit animation before React unmounts it.
 *
 * React removes an element the moment its state flips, so a CSS exit never
 * gets a chance to run. This holds the element in a `closing` state for the
 * length of the animation, then commits the unmount.
 *
 * Honours reduced motion by committing immediately — there is nothing to wait
 * for when the exit animation has been turned off in CSS.
 */
export function useExitTransition(durationMs = 180) {
  const [closing, setClosing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const dismiss = useCallback(
    (commit: () => void) => {
      if (timer.current) return; // already leaving

      const reduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reduced) {
        commit();
        return;
      }

      setClosing(true);
      timer.current = setTimeout(() => {
        timer.current = null;
        setClosing(false);
        commit();
      }, durationMs);
    },
    [durationMs],
  );

  return { closing, dismiss };
}
