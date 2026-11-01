import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { credentials, profile } from '@/data/portfolio';
import { CertificateInventory } from '@/components/certificate-inventory';

/**
 * /certificates — the full credential index.
 *
 * ---- Why this is its own route ----
 * Thirteen credentials will not sit politely inside a homepage that already
 * runs nine screens. Tabs hid two thirds of them behind a click and still cost
 * the section 900px. A page costs the homepage nothing, holds every credential
 * at once with no interaction to discover, gets its own URL to hand to a
 * recruiter, and is indexed on its own terms.
 *
 * The homepage keeps a short preview and links here.
 *
 * ---- The inventory ----
 * The index is laid out like a game's inventory screen — category tabs, a
 * slot grid under a bracket cursor, and a detail band for the selection (see
 * components/certificate-inventory.tsx). Its first tab is every credential,
 * so the page still opens on the whole set; the categories only narrow it.
 *
 * The page itself is a server component. The inventory is the client island,
 * and owns the open/closed state of the certificate viewer.
 */

const verifiable = credentials.filter((c) => c.verifyUrl).length;

export const metadata: Metadata = {
  title: 'Certifications',
  description: `Every credential held by ${profile.name} — ${credentials.length} in total across technical practice, leadership, and seminars, ${verifiable} of them independently verifiable.`,
  alternates: { canonical: '/certificates' },
};

export default function CertificatesPage() {
  return (
    <main className="rail py-16 md:py-24">
      <Link href="/#credentials" className="link readout inline-flex items-center gap-2">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
        Back to portfolio
      </Link>

      <header className="mt-12 md:mt-16">
        <p className="readout text-signal">Index</p>
        <h1 className="balance mt-4 text-display font-semibold text-bone">Certifications</h1>
        <p className="mt-6 max-w-[52ch] text-lead text-dim">
          Every credential on file — {credentials.length} in total, {verifiable} of them
          verifiable at their source.
        </p>
      </header>

      <div className="mt-14 md:mt-20">
        <CertificateInventory />
      </div>
    </main>
  );
}
