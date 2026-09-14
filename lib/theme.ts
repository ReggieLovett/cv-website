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
// Browser chrome colour per ground. The Zelda values apply only while that
// theme is switched on (see lib/zelda.ts).
const CHROME_COLOR = { dark: '#0A0D14', light: '#F7F9FC' } as const;
const ZELDA_CHROME_COLOR = { dark: '#000E0C', light: '#F1E9D2' } as const;

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
  syncChromeColor();
  listeners.forEach((listener) => listener());
}

/**
 * Paints the mobile browser chrome to match what is on screen. Reads the
 * document rather than taking arguments, so the light/dark switch and the Zelda
 * crest can both call it without either needing to know the other's state.
 */
export function syncChromeColor(): void {
  const root = document.documentElement;
  const mode: Theme = root.dataset.theme === 'light' ? 'light' : 'dark';
  const palette = root.classList.contains('zelda-theme') ? ZELDA_CHROME_COLOR : CHROME_COLOR;

  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);
  }
  meta.content = palette[mode];
}
