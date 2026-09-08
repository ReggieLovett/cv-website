'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { flushSync } from 'react-dom';
import { Moon, Sun } from 'lucide-react';
import {
  getTheme,
  getThemeServerSnapshot,
  setTheme,
  subscribeToTheme,
  type Theme,
} from '@/lib/theme';

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
 * Theme switch.
 *
 * The swap itself is instant; what's animated is a circular reveal of the new
 * theme growing from the button that was pressed, via the View Transitions
 * API. That keeps the change spatially anchored to the control — the light
 * arrives *from* the switch — instead of the whole page jumping brightness.
 *
 * Everything degrades cleanly: no View Transitions support, or reduced
 * motion, and the theme simply changes with no wipe.
 *
 * The chime belongs to the press, so the delegated sound listener (`.theme-toggle`)
 * plays it — this component is not sound-aware.
 */

export function ThemeToggle({ className = '' }: { className?: string }) {
  const theme = useSyncExternalStore(subscribeToTheme, getTheme, getThemeServerSnapshot);
  const isDark = theme !== 'light';

  const toggle = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const next: Theme = isDark ? 'light' : 'dark';
      const root = document.documentElement;

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const startViewTransition = document.startViewTransition?.bind(document);
      const apply = () => setTheme(next);

      if (reduced || !startViewTransition) {
        apply();
        return;
      }

      // Grow the reveal from the button, out to whichever corner is furthest.
      const { top, left, width, height } = event.currentTarget.getBoundingClientRect();
      const x = left + width / 2;
      const y = top + height / 2;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );

      root.classList.add('theme-switching');

      const transition = startViewTransition(() => {
        // flushSync so the DOM is already repainted in the new theme when the
        // transition snapshots it; a deferred update would capture the old one.
        flushSync(apply);
      });

      // A view transition can stall in a backgrounded tab; a bounded wait keeps
      // the `theme-switching` guard from being left on for the whole session.
      const withTimeout = <T,>(promise: Promise<T>, ms: number) =>
        Promise.race([
          promise,
          new Promise<void>((resolve) => setTimeout(resolve, ms)),
        ]);

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
                duration: 560,
                easing: 'cubic-bezier(0.32, 0.72, 0, 1)',
                pseudoElement: '::view-transition-new(root)',
              },
            ).finished,
            1800,
          );
        } catch {
          // A transition can be skipped by a rapid re-click; the theme still applied.
        } finally {
          root.classList.remove('theme-switching');
        }
      })();
    },
    [isDark],
  );

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      className={`toggle-arm theme-toggle press ${className}`.trim()}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="toggle-arm__glyphs" aria-hidden="true">
        <Sun className="toggle-arm__on h-4 w-4" />
        <Moon className="toggle-arm__off h-4 w-4" />
      </span>
      <span className="tag">{isDark ? 'Light' : 'Dark'}</span>
    </button>
  );
}