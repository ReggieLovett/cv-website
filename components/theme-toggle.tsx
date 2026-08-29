'use client';

import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

// The View Transitions API isn't in TypeScript's DOM lib yet.
declare global {
  interface Document {
    startViewTransition?: (callback: () => void) => {
      ready: Promise<void>;
      finished: Promise<void>;
      updateCallbackDone: Promise<void>;
      skipTransition: () => void;
    };
  }
}

/**
 * Theme switch.
 *
 * The swap itself is instant; what's animated is a circular reveal of the new
 * theme growing from the button that was pressed, via the View Transitions API.
 * That keeps the change spatially anchored to the control — the light arrives
 * *from* the switch — instead of the whole page jumping brightness, which is
 * the jarring version Apple's guidance warns about.
 *
 * Everything degrades cleanly: no View Transitions support, or reduced motion,
 * and the theme simply changes with no wipe.
 */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // The server can't know the stored theme, so the icon is only committed after
  // mount — rendering the wrong one first would flash the opposite state.
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme !== 'light';

  const toggle = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      const next = isDark ? 'light' : 'dark';
      const root = document.documentElement;

      // Bootstrap reads its own attribute; keep it in step with next-themes.
      const applyBootstrapTheme = () =>
        root.setAttribute('data-bs-theme', next);

      const reduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;
      const startViewTransition = document.startViewTransition?.bind(document);

      if (reduced || !startViewTransition) {
        setTheme(next);
        applyBootstrapTheme();
        return;
      }

      // Grow the reveal from the button, out to whichever corner is furthest.
      const { top, left, width, height } =
        event.currentTarget.getBoundingClientRect();
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
        flushSync(() => {
          setTheme(next);
          applyBootstrapTheme();
        });
      });

      // A view transition can stall indefinitely when the document isn't being
      // rendered (a backgrounded tab). Without a bound on the wait, the
      // `theme-switching` class below would never be removed and every
      // transition on the page would stay disabled for the rest of the session.
      const withTimeout = <T,>(promise: Promise<T>, ms: number) =>
        Promise.race([
          promise,
          new Promise<void>((resolve) => setTimeout(resolve, ms)),
        ]);

      try {
        await withTimeout(transition.ready, 1000);
        // `.finished` is just as unbounded as `.ready`: animations don't tick in
        // a document that isn't being rendered, so this needs the same guard.
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
        // A transition can be skipped (rapid re-clicks); the theme still applied.
      } finally {
        root.classList.remove('theme-switching');
      }
    },
    [isDark, setTheme],
  );

  return (
    <button
      type="button"
      onClick={toggle}
      className={`theme-toggle ${className}`.trim()}
      aria-label={
        mounted
          ? `Switch to ${isDark ? 'light' : 'dark'} mode`
          : 'Switch colour theme'
      }
    >
      <span
        className="theme-toggle__glyphs"
        data-dark={mounted ? isDark : true}
        aria-hidden='true'
      >
        <Sun className="h-4 w-4" />
        <Moon className="h-4 w-4" />
      </span>
    </button>
  );
}
