'use client';

import { motion } from 'framer-motion';
import { riseIn, stagger, viewport } from './motion';

/**
 * SectionHeading — the masthead.
 *
 * A hairline, a numbered index, the title, and an optional note set against
 * the title's baseline on the right. The note is the editorial move: it gives
 * the spread a second column of type so the heading reads as a magazine
 * opener rather than a heading tag with a rule above it.
 *
 * The index sits in the accent because it is the only place a number needs to
 * be found quickly; everything else in the masthead is ink.
 */
export function SectionHeading({
  index,
  title,
  note,
}: {
  index: string;
  title: string;
  note?: string;
}) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      className="rule-top grid gap-x-8 gap-y-6 pt-6 md:grid-cols-12"
    >
      <motion.div variants={riseIn} className="md:col-span-7">
        <p className="readout text-signal">{index}</p>
        <h2 className="balance mt-4 text-display font-semibold text-bone">{title}</h2>
      </motion.div>

      {note && (
        <motion.p
          variants={riseIn}
          className="max-w-[38ch] text-body text-dim md:col-span-4 md:col-start-9 md:self-end md:pb-2"
        >
          {note}
        </motion.p>
      )}
    </motion.div>
  );
}
