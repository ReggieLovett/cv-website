'use client';

import { motion } from 'framer-motion';
import { techStack } from '@/data/portfolio';
import { SectionHeading } from './section-heading';
import { TechIcon } from './tech-icons';
import { riseIn, riseInTight, stagger, viewport } from './motion';

/**
 * TechStack — "What I know already".
 *
 * Set as a credit list, not a tag cloud. Each discipline is a row on a
 * hairline: the label and its one-line caption hold a narrow left column, and
 * the tools themselves are set large in the wide column beside it.
 *
 * The brief asked for this to be visually distinct from bullet points, and
 * rounded pills are the same idea as a bullet — a small uniform token in a
 * row of small uniform tokens, which forces the eye to read every one to find
 * anything. Setting the tool names at title size makes them scannable at a
 * glance from across the page, and makes the section the typographic set
 * piece it should be: the names of the tools ARE the graphic.
 *
 * The icon is a mark, not a badge. It rests a step below the name (`dim`) and
 * takes the accent on hover, so the resting composition still reads as type.
 * It used to rest at `faint`, where the thinner marks (PHP, C++) dissolved
 * into the ground and looked like rendering faults rather than restraint.
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
            className="rule-top grid gap-x-8 gap-y-6 py-10 md:grid-cols-12 md:py-14"
          >
            {/* The left column: index, discipline, and the honest one-liner. */}
            <motion.div variants={riseIn} className="md:col-span-4">
              <div className="flex items-baseline gap-4">
                <span className="readout text-signal">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="readout text-bone">{group.label}</h3>
              </div>
              <p className="mt-4 max-w-[34ch] text-body text-dim">{group.caption}</p>
            </motion.div>

            {/* The tools, set as the display element of the row. */}
            <motion.ul
              variants={stagger}
              className="flex flex-wrap gap-x-10 gap-y-4 md:col-span-7 md:col-start-6"
            >
              {group.items.map((item) => (
                <motion.li key={item.name} variants={riseInTight}>
                  <span className="group inline-flex items-center gap-3 text-title font-medium tracking-tight text-bone transition-colors duration-hover ease-out hover:text-signal">
                    <TechIcon
                      name={item.icon}
                      aria-hidden="true"
                      className="h-[0.85em] w-[0.85em] shrink-0 text-dim transition-colors duration-hover ease-out group-hover:text-signal"
                    />
                    {item.name}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
