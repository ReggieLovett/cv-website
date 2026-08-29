import './globals.css';
import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Providers } from './providers';
import { profile, contactInfo } from '@/data/portfolio';

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
  // Matches the default theme; Providers rewrites this when the visitor toggles.
  themeColor: '#04060c',
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
      data-bs-theme="dark"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Marks the document as script-capable before first paint. The scroll
            reveals only hide themselves under `html.js`, so a reader without
            JavaScript gets the full page instead of an empty one. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body className="font-sans">
        <a
          href="#home"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-black"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
