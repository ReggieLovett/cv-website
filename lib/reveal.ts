import { flushSync } from 'react-dom';

// The View Transitions API isn't in TypeScript's DOM lib yet.
declare global {
  interface Document {
    startViewTransition?: (callback: () => void) => {
      ready: Promise<void>;
      finished: Promise<void>;
      updateCallbackDone?: Promise<void>;
      skipTransition: () => void;
    };
  }
}

/**
 * Apply a theme change as a circular reveal growing from `origin`.
 *
 * Shared by the light/dark switch and the Zelda crest. The swap itself is
 * instant; what animates is the new theme growing outward from the control
 * that was pressed, via the View Transitions API — so the change is spatially
 * anchored to the thing you touched instead of the whole page jumping at once.
 *
 * Degrades cleanly: without View Transitions support, or under reduced motion,
 * `apply` just runs and the theme changes with no wipe.
 */
export function revealFrom(
  origin: Element,
  apply: () => void,
  { duration = 560 }: { duration?: number } = {},
): void {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const startViewTransition = document.startViewTransition?.bind(document);

  if (reduced || !startViewTransition) {
    apply();
    return;
  }

  // Grow from the control's centre out to whichever corner is furthest.
  const { top, left, width, height } = origin.getBoundingClientRect();
  const x = left + width / 2;
  const y = top + height / 2;
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  // Freezes ordinary CSS transitions for the duration, so they do not reveal a
  // half-changed frame underneath the wipe. See `.theme-switching` in globals.css.
  root.classList.add('theme-switching');

  const transition = startViewTransition(() => {
    // flushSync so the DOM is already repainted in the new theme when the
    // transition snapshots it; a deferred update would capture the old one.
    flushSync(apply);
  });

  // A view transition can stall in a backgrounded tab; a bounded wait keeps the
  // `theme-switching` guard from being left on for the whole session.
  const withTimeout = <T,>(promise: Promise<T>, ms: number) =>
    Promise.race([promise, new Promise<void>((resolve) => setTimeout(resolve, ms))]);

  void (async () => {
    try {
      await withTimeout(transition.ready, 1000);
      await withTimeout(
        root.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration,
            easing: 'cubic-bezier(0.32, 0.72, 0, 1)',
            pseudoElement: '::view-transition-new(root)',
          },
        ).finished,
        duration + 1200,
      );
    } catch {
      // A transition can be skipped by a rapid re-click; the change still applied.
    } finally {
      root.classList.remove('theme-switching');
    }
  })();
}
