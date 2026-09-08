'use client';

import { motion } from 'framer-motion';
import { type Capability, capabilities } from '@/data/portfolio';
import { SectionHeading } from './section-heading';
import { riseIn, stagger, viewport } from './motion';

/**
 * SkillsGrid — capabilities.
 *
 * Five entries on twelve tracks: two halves, then three thirds. Both rows fill
 * exactly, which is what makes the block read as a composition rather than as
 * a set of boxes that happened to wrap. The previous spans (6, 6, 4, 4, 8)
 * overflowed the second row and left the last cell stranded on a third.
 *
 * No outlines. Each entry is a hairline, a number, a title, and its tools —
 * grouped by the rule above it and the air around it.
 */
const SPANS = ['md:col-span-6', 'md:col-span-6', 'md:col-span-4', 'md:col-span-4', 'md:col-span-4'];

export function SkillsGrid() {
  return (
    <section id="skills" className="rail section">
      <SectionHeading
        index="03"
        title="Capabilities"
        note="The same person draws the mark, designs the interface, and ships the build."
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="mt-16 grid gap-x-8 gap-y-12 md:mt-24 md:grid-cols-12"
      >
        {capabilities.map((capability, i) => (
          <motion.article
            key={capability.no}
            variants={riseIn}
            className={`card p-6 md:p-7 ${SPANS[i % SPANS.length]}`}
          >
            <Cell capability={capability} />
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}

function Cell({ capability }: { capability: Capability }) {
  return (
    <>
      <span className="readout text-signal">{capability.no}</span>

      <h3 className="mt-6 text-title font-semibold tracking-tight text-bone">
        {capability.title}
      </h3>

      <p className="mt-4 max-w-[48ch] text-body text-dim">{capability.body}</p>

      <footer className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-8">
        {capability.tools.map((tool, i) => (
          <span key={tool} className="flex items-center gap-3">
            {i > 0 && <span className="h-3 w-px bg-line" aria-hidden="true" />}
            <span className="tag">{tool}</span>
          </span>
        ))}
      </footer>
    </>
  );
}
