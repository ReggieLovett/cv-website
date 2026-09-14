'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { credentials, credentialCategories } from '@/data/portfolio';
import { SectionHeading } from './section-heading';
import { CredentialGrid } from './credential-grid';
import { fadeIn, viewport } from './motion';

/**
 * Certifications on the homepage — a preview of the archive at /certificates.
 *
 * Ordering is a rule, not a hand-picked list, so it never needs re-curating:
 * credentials marked `featured` lead (the newest certifications), then the
 * ones a stranger can verify at their source, then everything else. Every card
 * opens the full record in a modal.
 */

const PREVIEW_COUNT = 5;

const rank = (c: (typeof credentials)[number]) =>
  (c.featured ? 2 : 0) + (c.verifyUrl ? 1 : 0);

const preview = [...credentials].sort((a, b) => rank(b) - rank(a)).slice(0, PREVIEW_COUNT);

const verifiable = credentials.filter((c) => c.verifyUrl).length;

export function CredentialsPreview() {
  return (
    <section id="credentials" className="rail section">
      <SectionHeading
        index="07"
        title="Certifications"
        note={`${credentials.length} credentials across ${credentialCategories.length} categories — ${verifiable} verifiable at their source. Press any card for the full record.`}
      />

      <div className="mt-12 md:mt-16">
        <CredentialGrid items={preview} />

        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="rule-top mt-10 pt-6"
        >
          <Link href="/certificates" className="action readout">
            View all {credentials.length} certifications
            <span className="action__well" aria-hidden="true">
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
