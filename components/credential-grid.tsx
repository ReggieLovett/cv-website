'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { type Credential } from '@/data/portfolio';
import { CredentialCell } from './credential-cell';
import { CertificateModal } from './certificate-modal';
import { riseInTight, stagger, viewport } from './motion';

/**
 * CredentialGrid — a set of credential cells and the viewer they open.
 *
 * The selected credential is plain `useState` here, one level above the cells,
 * so the same grid behaves identically on the homepage preview and on the
 * /certificates index. The modal reads the selection; setting it to `null`
 * closes it.
 */
export function CredentialGrid({
  items,
  className = '',
}: {
  items: Credential[];
  className?: string;
}) {
  const [selected, setSelected] = useState<Credential | null>(null);

  return (
    <>
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className={`-mx-3.5 grid grid-cols-2 gap-0 sm:grid-cols-3 lg:grid-cols-5 ${className}`.trim()}
      >
        {items.map((item) => (
          <motion.div key={item.id} variants={riseInTight}>
            <CredentialCell item={item} onOpen={setSelected} />
          </motion.div>
        ))}
      </motion.div>

      <CertificateModal item={selected} onClose={() => setSelected(null)} />
    </>
  );
}
