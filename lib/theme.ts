/**
 * Theme preference.
 *
 * The same shape as the sound preference: a value that lives outside React
 * (localStorage + a module flag), read through useSyncExternalStore so no
 * component copies it into state inside an effect.
 *
 * The `<html data-theme>` attribute is what CSS repaints from. The pre-paint
 * script in layout.tsx applies the stored value before first paint, so there
 * is no flash of the wrong theme and nothing for React to reconcile.
 */

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'theme';
const CHROME_COLOR = { dark: '#08090B', light: '#F8F7F4' } as const;

let theme: Theme | null = null;

export function getTheme(): Theme {
  if (theme !== null) return theme;
  if (typeof window === 'undefined') return 'dark';
  try {
    theme = window.localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark';
  } catch {
    theme = 'dark'; // private mode, blocked storage — fall back to the default
  }
  return theme;
}

const listeners = new Set<() => void>();

export function subscribeToTheme(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

/** Server render has no storage to read; assume dark so the markup matches. */
export function getThemeServerSnapshot(): Theme {
  return 'dark';
}

export function setTheme(next: Theme): void {
  theme = next;
  document.documentElement.dataset.theme = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* storage unavailable; the module flag still holds for this visit */
  }
  syncChromeColor(next);
  listeners.forEach((listener) => listener());
}

/** Paints the mobile browser chrome to match the active theme. */
function syncChromeColor(next: Theme): void {
  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);
  }
  meta.content = CHROME_COLOR[next];
}