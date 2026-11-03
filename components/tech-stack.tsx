'use client';

import { motion } from 'framer-motion';
import { techStack } from '@/data/portfolio';
import { SectionHeading } from './section-heading';
import { TechIcon } from './tech-icons';
import { riseIn, riseInTight, stagger, viewport } from './motion';
import styles from './tech-stack.module.css';

/**
 * TechStack — "What I know already".
 *
 * Each discipline is a row on a hairline: the label, its one-line caption and
 * a count hold the narrow left column, and the tools fill the wide one as a
 * grid of entries. An entry is a quiet tile, not a pill: the tool's real mark,
 * its name at reading size, and what kind of tool it is in the mono tier, so
 * the eye can find a tool by its logo and still learn something by reading.
 *
 * The tiles share one footprint, so a row of three and a row of four line up
 * on the same columns. At rest the marks sit a step below the names (`dim`);
 * on a hover-capable pointer a tile lifts its hairline and the mark takes the
 * accent over a soft glow. Only colour and opacity change, nothing moves.
 */
export function TechStack() {
  return (
    <section id="stack" className="rail section">
      <SectionHeading
        index="04"
        title="What I know already"
        note="The tools in daily rotation — and the ones stretched every month."
      />

      <div className="mt-16 md:mt-24">
        {techStack.map((group, i) => (
          <motion.article
            key={group.label}
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            className="rule-top grid gap-x-8 gap-y-8 py-10 md:grid-cols-12 md:py-14"
          >
            {/* The left column: index, discipline, the honest one-liner, and a count. */}
            <motion.div variants={riseIn} className="md:col-span-4">
              <div className="flex items-baseline gap-4">
                <span className="readout text-signal">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="readout text-bone">{group.label}</h3>
              </div>
              <p className="mt-4 max-w-[34ch] text-body text-dim">{group.caption}</p>
              <p className="tag mt-5">
                {String(group.items.length).padStart(2, '0')} {group.items.length === 1 ? 'tool' : 'tools'}
              </p>
            </motion.div>

            {/* The tools, as a grid of entries on shared columns. */}
            <motion.ul
              variants={stagger}
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:col-span-8 xl:grid-cols-4"
            >
              {group.items.map((item, n) => (
                <motion.li key={item.name} variants={riseInTight} className={styles.tile}>
                  <span className={`readout ${styles.entry}`} aria-hidden="true">
                    {String(n + 1).padStart(2, '0')}
                  </span>
                  <TechIcon name={item.icon} className={styles.mark} />
                  <span className={styles.name}>{item.name}</span>
                  <span className={`tag ${styles.kind}`}>{item.kind}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
