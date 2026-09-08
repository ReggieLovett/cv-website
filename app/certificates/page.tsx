import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { credentials, credentialCategories, profile } from '@/data/portfolio';
import { CredentialCell } from '@/components/credential-cell';

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
 * ---- Why no tabs ----
 * Categories are headings on one scroll. Tabs are for switching between things
 * you would not want side by side; these are a list, and a list wants to be
 * read top to bottom.
 *
 * This is a server component — nothing here needs state, so nothing here needs
 * JavaScript. The cells are the only client code on the page.
 */

const verifiable = credentials.filter((c) => c.verifyUrl).length;

export const metadata: Metadata = {
  title: 'Certificates',
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
        <h1 className="balance mt-4 text-display font-semibold text-bone">Certificates</h1>
        <p className="mt-6 max-w-[52ch] text-lead text-dim">
          Every credential on file — {credentials.length} in total, {verifiable} of them
          verifiable at their source.
        </p>
      </header>

      <div className="mt-16 space-y-16 md:mt-24">
        {credentialCategories.map((category) => {
          const items = credentials.filter((item) => item.category === category);
          if (items.length === 0) return null;

          return (
            <section key={category}>
              <div className="rule-top flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pt-5">
                <h2 className="readout text-bone">{category}</h2>
                <span className="tag">
                  {items.length} {items.length === 1 ? 'credential' : 'credentials'}
                </span>
              </div>

              {/* Gap-less on purpose — see `.cred-cell`. The negative inset
                  pulls the row flush with the rule above it. */}
              <div className="-mx-3.5 mt-6 grid grid-cols-2 gap-0 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {items.map((item) => (
                  <CredentialCell key={item.id} item={item} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
