'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { credentials, credentialCategories } from '@/data/portfolio';
import { SectionHeading } from './section-heading';
import { CredentialCell } from './credential-cell';
import { fadeIn, riseInTight, stagger, viewport } from './motion';

/**
 * The credentials section on the homepage — a preview, not the archive.
 *
 * The tabbed version put all thirteen here and still only showed a third at a
 * time: 900px of homepage spent on a control the reader had to operate before
 * they could see anything. The full set now lives at /certificates, and this
 * shows the strongest evidence with a count and a way through.
 *
 * "Strongest" is defined, not curated by hand: the verifiable ones lead,
 * because a credential a stranger can check outranks one they have to take on
 * trust, and hand-picking would need re-picking every time a row is added.
 */

const PREVIEW_COUNT = 5;

const preview = [...credentials]
  .sort((a, b) => Number(Boolean(b.verifyUrl)) - Number(Boolean(a.verifyUrl)))
  .slice(0, PREVIEW_COUNT);

const verifiable = credentials.filter((c) => c.verifyUrl).length;

export function CredentialsPreview() {
  return (
    <section id="credentials" className="rail section">
      <SectionHeading
        index="07"
        title="Certificates"
        note={`${credentials.length} credentials across ${credentialCategories.length} categories — ${verifiable} verifiable at their source.`}
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="mt-12 md:mt-16"
      >
        <div className="-mx-3.5 grid grid-cols-2 gap-0 sm:grid-cols-3 lg:grid-cols-5">
          {preview.map((item) => (
            <motion.div key={item.id} variants={riseInTight}>
              <CredentialCell item={item} />
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeIn} className="rule-top mt-10 pt-6">
          <Link href="/certificates" className="action readout">
            View all {credentials.length} certificates
            <span className="action__well" aria-hidden="true">
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </span>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
