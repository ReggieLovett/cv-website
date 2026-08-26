import './globals.css';
import type { Metadata } from 'next';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Reggie Portfolio',
  description: 'Portfolio website for Reggie Lovett, showcasing projects, skills, and experience.',
  icons: {
    icon: '/Lovett_logo-removebg-preview.png',
    shortcut: '/Lovett_logo-removebg-preview.png',
    apple: '/Lovett_logo-removebg-preview.png',
  },
  openGraph: {
    title: 'Reggie Portfolio',
    description: 'Portfolio website for Reggie Lovett, showcasing projects, skills, and experience.',
    images: [
      {
        url: '/Lovett_logo-removebg-preview.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reggie Portfolio',
    description: 'Portfolio website for Reggie Lovett, showcasing projects, skills, and experience.',
    images: [
      {
        url: '/Lovett_logo-removebg-preview.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
