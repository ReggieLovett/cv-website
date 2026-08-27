'use client';

import { ThemeProvider } from 'next-themes';

// The portfolio is intentionally dark-only: every section hardcodes dark surfaces
// (bg-[#050b14], text-slate-100, …), so system/light themes are force-disabled.
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
      {children}
    </ThemeProvider>
  );
}
