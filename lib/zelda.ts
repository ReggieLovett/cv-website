import { syncChromeColor } from './theme';

/**
 * The Zelda 40th-anniversary theme — opt-in.
 *
 * The site ships in its normal theme. Pressing the crest adds `zelda-theme` to
 * <html>; pressing it again removes it. The class, not React state, is the
 * source of truth, because the theme has to reach `body`, the fixed overlays,
 * and anything portalled to `document.body` — a React wrapper would miss them.
 *
 * Same shape as lib/theme.ts: a value outside React, read through
 * useSyncExternalStore, so components never copy it into state in an effect.
 *
 * The visitor's choice persists in localStorage. The pre-paint script in
 * app/layout.tsx re-applies it before first paint, so a returning visitor who
 * left it on never sees a flash of the normal theme.
 */

export const ZELDA_CLASS = 'zelda-theme';
const STORAGE_KEY = 'zelda-theme';

const listeners = new Set<() => void>();

export function subscribeToZelda(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

export function isZeldaOn(): boolean {
  return document.documentElement.classList.contains(ZELDA_CLASS);
}

/**
 * The server has no document, and the site ships with the theme off. React
 * hydrates against `false`, then immediately re-reads the real class and
 * corrects if a stored preference had already switched it on.
 */
export function getZeldaServerSnapshot(): boolean {
  return false;
}

export function setZelda(on: boolean): void {
  document.documentElement.classList.toggle(ZELDA_CLASS, on);
  try {
    if (on) window.localStorage.setItem(STORAGE_KEY, '1');
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Private browsing can throw. The theme still applies for this visit.
  }
  syncChromeColor();
  // forEach rather than for...of: tsconfig targets ES5, where iterating a Set
  // needs downlevelIteration.
  listeners.forEach((listener) => listener());
}
