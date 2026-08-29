'use client';

import { useEffect } from 'react';
import { ThemeProvider, useTheme } from 'next-themes';

/**
 * Keeps the two things outside React's control in step with the active theme:
 *
 * - `data-bs-theme`, which Bootstrap's own components read and next-themes
 *   knows nothing about.
 * - The `theme-color` meta tag, which colours the browser chrome on mobile.
 *   It can't be a static `prefers-color-scheme` pair any more, because the
 *   site no longer follows the OS — a light-OS visitor now opens in dark, and
 *   a static pair would paint their address bar the wrong colour.
 */
const CHROME_COLOR = { dark: '#04060c', light: '#f0f2f7' } as const;

function ThemeSync() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!resolvedTheme) return;

    document.documentElement.setAttribute('data-bs-theme', resolvedTheme);

    const color = CHROME_COLOR[resolvedTheme as keyof typeof CHROME_COLOR];
    if (!color) return;

    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]:not([media])');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.content = color;
  }, [resolvedTheme]);

  return null;
}

// Dark is the design's home key — the NASA deep-space palette is the point, so
// every first visit opens there rather than deferring to the operating system.
// The toggle still switches freely, and that choice is what persists.
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <ThemeSync />
      {children}
    </ThemeProvider>
  );
}
