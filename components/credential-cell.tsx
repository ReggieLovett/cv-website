'use client';

import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { type Credential } from '@/data/portfolio';

/**
 * CredentialCell — one credential, compact.
 *
 * Artwork, name, issuer, state. Centred, and small enough that a dozen of them
 * read as an index rather than a wall.
 *
 * ---- On the gap-less grid ----
 * The cells sit flush against each other with no gutter, and the card surface
 * only appears under the pointer. A grid of twenty bordered boxes is a table
 * nobody reads; a grid of twenty quiet blocks that light up one at a time is a
 * list you can scan. The padding inside each cell does the separating that a
 * gutter would otherwise do.
 *
 * The whole cell is the link when there is something to verify — a bigger,
 * more forgiving target than a "verify" hyperlink, and it means the hover
 * surface and the hit area are the same shape.
 */
export function CredentialCell({ item }: { item: Credential }) {
  const isBadge = item.kind === 'Badge';
  const verifiable = Boolean(item.verifyUrl);

  const inner = (
    <>
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
      </span>

      {/* Three reserved lines: names here run from two words to eleven, and a
          gap-less grid shows every height difference as a broken row. */}
      <h3 className="line-3 mt-4 text-center text-[0.8125rem] font-semibold leading-snug text-bone">
        {item.title}
      </h3>

      <p className="tag mt-2 line-1 text-center">{item.issuer}</p>

      <span
        className={`readout mt-3 inline-flex items-center gap-1.5 ${
          verifiable ? 'text-signal' : 'text-faint'
        }`}
      >
        {verifiable ? 'Verify' : 'On file'}
        {verifiable && (
          <ArrowUpRight
            className="h-3 w-3 transition-transform duration-hover ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        )}
      </span>
    </>
  );

  if (!verifiable) {
    return <div className="cred-cell group">{inner}</div>;
  }

  return (
    <a
      href={item.verifyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="cred-cell group"
      aria-label={`${item.title}, ${item.issuer} — verify (opens in a new tab)`}
    >
      {inner}
    </a>
  );
}
