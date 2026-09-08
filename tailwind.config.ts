import type { Config } from 'tailwindcss';

/**
 * EDITORIAL.
 *
 * One palette that flips with the theme: every semantic token is an RGB
 * triple surfaced through `var(--…)`, so a single `[data-theme]` attribute
 * repaints the whole system.
 *
 * The type scale is the design. Three tiers with real distance between them —
 * a hero that is roughly 2.5x the section titles, section titles roughly 2.5x
 * the reading size, and one small mono label beneath everything. The previous
 * scale put `display` at 4.5rem against a `hero` of 7rem, which read as two
 * versions of "big" rather than as a hierarchy.
 */
const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Grounds.
        space: 'rgb(var(--space) / <alpha-value>)',
        void: 'rgb(var(--void) / <alpha-value>)',
        panel: 'rgb(var(--panel) / <alpha-value>)',
        panel2: 'rgb(var(--panel2) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        line2: 'rgb(var(--line2) / <alpha-value>)',
        // Type.
        bone: 'rgb(var(--bone) / <alpha-value>)',
        dim: 'rgb(var(--dim) / <alpha-value>)',
        faint: 'rgb(var(--faint) / <alpha-value>)',
        // Accent. One, used sparingly.
        signal: 'rgb(var(--signal) / <alpha-value>)',
        'signal-soft': 'rgb(var(--signal-soft) / <alpha-value>)',
        telemetry: 'rgb(var(--telemetry) / <alpha-value>)',
        // Status.
        ok: 'rgb(var(--ok) / <alpha-value>)',
        warn: 'rgb(var(--warn) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        // Mono label tiers.
        tag: ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.1em' }],
        readout: ['0.6875rem', { lineHeight: '1.35', letterSpacing: '0.14em' }],
        // Reading tiers. `body` moved up from 0.9375rem — under a display
        // this large, the old size read as fine print.
        body: ['1rem', { lineHeight: '1.65' }],
        lead: ['clamp(1.125rem, 1.6vw, 1.375rem)', { lineHeight: '1.5', letterSpacing: '-0.005em' }],
        // Display tiers.
        title: ['clamp(1.375rem, 2.2vw, 1.875rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        display: ['clamp(2rem, 4.2vw, 3.25rem)', { lineHeight: '1.02', letterSpacing: '-0.032em' }],
        hero: ['clamp(3rem, 10.5vw, 8.5rem)', { lineHeight: '0.86', letterSpacing: '-0.045em' }],
      },
      maxWidth: {
        measure: '60ch',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
        'in-out': 'cubic-bezier(0.77, 0, 0.175, 1)',
      },
      transitionDuration: {
        press: '120ms',
        hover: '220ms',
        panel: '240ms',
        overlay: '300ms',
      },
    },
  },
  plugins: [],
};

export default config;
