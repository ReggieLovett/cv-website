import './globals.css';
import type { Metadata, Viewport } from 'next';
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
    images: [{ url: '/new profile.jpg', width: 1200, height: 630, alt: profile.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/new profile.jpg'],
  },
};

export const viewport: Viewport = {
  themeColor: '#050b14',
  colorScheme: 'dark',
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
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <a
          href="#home"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-cyan-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-950"
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
