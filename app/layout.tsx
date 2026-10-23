import './globals.css';
// After globals.css, so the Zelda palette override wins on source order.
import './zelda-theme.css';
import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Cinzel } from 'next/font/google';
import { profile, contactInfo } from '@/data/portfolio';
import { PortfolioCompanion } from '@/components/portfolio-companion';

/**
 * Cinzel — the display face for the anniversary theme.
 *
 * Inscriptional Roman capitals in the Trajan tradition: the letterform family
 * the franchise's own title lettering descends from, without borrowing any of
 * its artwork. Used for display type only; body and UI stay in Geist.
 *
 * `next/font/google` fetches at build time and self-hosts the files, so a
 * visitor's browser never contacts Google — the no-third-party-font-request
 * rule this site keeps still holds.
 */
const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://reggielovett.vercel.app';
const title = `${profile.name} — BSIT, Artificial Intelligence`;
const description =
  'Portfolio of Reggie Lovett, a 3rd-year BSIT student majoring in Artificial Intelligence at St. Paul University Philippines. Projects, experience, leadership, and certifications.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s | ${profile.name}`,
  },
  description,
  applicationName: `${profile.name} Portfolio`,
  authors: [{ name: profile.name, url: contactInfo.github }],
  creator: profile.name,
  keywords: [
    'Reggie Lovett',
    'portfolio',
    'BSIT',
    'artificial intelligence',
    'software developer',
    'St. Paul University Philippines',
    'Next.js',
    'web development',
  ],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: '/Lovett_logo-removebg-preview.png',
    shortcut: '/Lovett_logo-removebg-preview.png',
    apple: '/Lovett_logo-removebg-preview.png',
  },
  openGraph: {
    type: 'profile',
    siteName: `${profile.name} Portfolio`,
    url: '/',
    title,
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export const viewport: Viewport = {
  // The theme-color meta is repainted at runtime by the theme store; this
  // static default just voices the dark ground until that runs.
  themeColor: '#0A0D14',
  colorScheme: 'dark light',
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  url: siteUrl,
  email: `mailto:${contactInfo.email}`,
  jobTitle: 'Information Technology Student (Artificial Intelligence)',
  alumniOf: { '@type': 'CollegeOrUniversity', name: profile.school },
  sameAs: [contactInfo.github, contactInfo.linkedin],
  description: profile.bio,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${cinzel.variable}`}
      // The pre-paint script below mutates the documentElement's class and
      // data-entrance before React hydrates it, so hydration must not try to
      // reconcile attributes it no longer owns.
      suppressHydrationWarning
    >
      <head>
        {/* Runs before first paint.
            1. Marks the document as script-capable. The scroll reveals only
               hide themselves under `html.js`, so a reader without JavaScript
               gets the full page instead of an empty one.
            2. Applies the stored theme. Default is dark (the `:root` tokens),
               so a light preference is the only case that needs an attribute.
               Doing it here keeps `data-theme` consistent with the colors the
               first paint commits — no flash of the wrong ground.
            3. Decides whether the entrance curtain has already played this
               session. This has to happen here, not in React: the server HTML
               cannot know about sessionStorage, so the curtain ships in the
               markup and paints before hydration. Setting the attribute
               pre-paint lets CSS drop it, which is the difference between a
               returning visitor seeing nothing and seeing a flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js');try{if(localStorage.getItem('theme')==='light')document.documentElement.dataset.theme='light';if(localStorage.getItem('zelda-theme')==='1')document.documentElement.classList.add('zelda-theme');if(sessionStorage.getItem('entrance-played')==='1')document.documentElement.dataset.entrance='played'}catch(e){}`,
          }}
        />
      </head>
      <body className="font-sans">
        <a
          href="#top"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-bone focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-space"
        >
          Skip to content
        </a>
        {children}
        <PortfolioCompanion />
        {/* Reading position, painted by the compositor — see `.progress`. */}
        <div className="progress" aria-hidden="true" />
        {/* Print tooth over the whole document. Fixed and inert — see `.grain`
            in globals.css for why it sits below the lightbox. */}
        <div className="grain" aria-hidden="true" />
        {/* The anniversary atmosphere — washes and the watermark on one fixed
            layer. Invisible until the crest turns the Zelda theme on; see
            `.zelda-atmos` in zelda-theme.css. */}
        <div className="zelda-atmos" aria-hidden="true" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
