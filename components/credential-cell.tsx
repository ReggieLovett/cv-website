'use client';

import Image from 'next/image';
import { Maximize2 } from 'lucide-react';
import { type Credential } from '@/data/portfolio';

/**
 * CredentialCell — one credential, compact. Pressing it opens the full record.
 *
 * Artwork, name, issuer, state. Centred, and small enough that a dozen of them
 * read as an index rather than a wall.
 *
 * It is a `<button>`, not a link. It used to navigate straight to the
 * verification page, which meant the certificate itself — the scan, the
 * number, the date — was only ever visible as a 72px thumbnail. Now the whole
 * record opens in CertificateModal, and the verification link lives there,
 * next to the evidence it verifies.
 *
 * ---- On the gap-less grid ----
 * Cells sit flush with no gutter, and the card surface only appears under the
 * pointer. A grid of bordered boxes is a table nobody reads; quiet blocks that
 * light up one at a time are a list you can scan.
 */
export function CredentialCell({
  item,
  onOpen,
}: {
  item: Credential;
  onOpen: (item: Credential) => void;
}) {
  const isBadge = item.kind === 'Badge';
  const verifiable = Boolean(item.verifyUrl);

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className="cred-cell group w-full"
      aria-haspopup="dialog"
      aria-label={`${item.title}, ${item.issuer} — view certificate`}
    >
      <span className="cred-cell__art">
        {item.image ? (
          <Image
            src={item.image}
            alt=""
            fill
            sizes="120px"
            className={isBadge ? 'object-contain' : 'object-cover object-top'}
          />
        ) : (
          <svg
            className="h-5 w-5 text-faint"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            aria-hidden="true"
          >
            <path d="M14 3v4a1 1 0 0 0 1 1h4" />
            <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" />
            <path d="M9 13h6M9 17h4" />
          </svg>
        )}
        <span className="cred-cell__peek" aria-hidden="true">
          <Maximize2 className="h-4 w-4" strokeWidth={1.5} />
        </span>
      </span>

      {/* Three reserved lines: names here run from two words to eleven, and a
          gap-less grid shows every height difference as a broken row. Do not
          add Tailwind's `block` here — it overrides the `-webkit-box` display
          that line-clamp needs, and the clamp silently stops working. */}
      <span className="line-3 mt-4 text-center text-[0.8125rem] font-semibold leading-snug text-bone">
        {item.title}
      </span>

      <span className="tag line-1 mt-2 text-center">{item.issuer}</span>

      <span
        className={`readout mt-3 inline-flex items-center gap-1.5 ${
          verifiable ? 'text-signal' : 'text-faint'
        }`}
      >
        {item.featured ? 'New' : verifiable ? 'Verifiable' : 'On file'}
      </span>
    </button>
  );
}
