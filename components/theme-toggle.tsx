'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';
import {
  getTheme,
  getThemeServerSnapshot,
  setTheme,
  subscribeToTheme,
  type Theme,
} from '@/lib/theme';
import { revealFrom } from '@/lib/reveal';

/**
 * Theme switch.
 *
 * The new theme grows outward from this button as a circular reveal — see
 * lib/reveal.ts, which the Zelda crest shares. No View Transitions support, or
 * reduced motion, and the theme simply changes with no wipe.
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
      revealFrom(event.currentTarget, () => setTheme(next));
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
