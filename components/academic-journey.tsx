'use client';

import { motion } from 'framer-motion';
import { education, timeline, leadership } from '@/data/portfolio';
import { SectionHeading } from './section-heading';
import { fadeIn, riseIn, riseInTight, stagger, staggerSlow, viewport } from './motion';

/**
 * AcademicJourney.
 *
 * The brief asked for the leadership to be prominent, so it opens the section
 * rather than sitting in a sidebar beside the timeline. The two roles are set
 * as a spread: the office itself at display size, the organisation as a label
 * above it. A recruiter scanning at speed reads SENATOR and TREASURER before
 * they read anything else on the page — which is the point.
 *
 * The timeline follows as a ruled list. There is no dotted rail or connector
 * line: a column of years already reads as a sequence, and the decoration was
 * doing nothing the alignment wasn't. Education closes the section.
 */
export function AcademicJourney() {
  return (
    <section id="academic" className="rail section">
      <SectionHeading
        index="06"
        title="Academic Journey"
        note="St. Paul University Philippines — BSIT (Artificial Intelligence), 3rd Year."
      />

      {/* ---- Leadership: the prominent half ---------------------------- */}
      <motion.div
        variants={staggerSlow}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="mt-16 md:mt-24"
      >
        <motion.p variants={fadeIn} className="readout text-signal">
          Leadership
        </motion.p>

        <div className="mt-8 grid gap-x-10 gap-y-12 md:grid-cols-2">
          {leadership.map((role) => (
            <motion.article key={role.organization} variants={riseIn} className="card p-6 md:p-8">
              <p className="readout text-dim">{role.organization}</p>

              <h3 className="mt-5 text-display font-semibold tracking-tight text-bone">
                {role.position}
              </h3>

              <p className="tag mt-3">
                {role.year}
                {role.chapter && <span className="text-faint"> — {role.chapter}</span>}
              </p>

              <p className="mt-6 max-w-[46ch] text-body text-dim">{role.description}</p>

              {/* Set as a rule-separated credit line rather than pills: the
                  skills are supporting evidence, and a row of outlined
                  capsules gives them more weight than the office above. */}
              <ul className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2">
                {role.skills.map((skill, i) => (
                  <li key={skill} className="flex items-center gap-3">
                    {i > 0 && (
                      <span className="h-3 w-px bg-line" aria-hidden="true" />
                    )}
                    <span className="tag">{skill}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </motion.div>

      {/* ---- The timeline ---------------------------------------------- */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="mt-24 md:mt-32"
      >
        <motion.p variants={fadeIn} className="readout text-signal">
          Timeline
        </motion.p>

        <ul className="mt-8">
          {timeline.map((entry) => (
            <motion.li
              key={entry.year + entry.title}
              variants={riseInTight}
              className="rule-top grid gap-x-8 gap-y-3 py-8 md:grid-cols-12"
            >
              <div className="md:col-span-3">
                <span className="readout text-bone">{entry.year}</span>
                <span className="tag mt-2 block text-faint">{entry.category}</span>
              </div>

              <div className="md:col-span-8 md:col-start-5">
                <h3 className="text-title font-semibold tracking-tight text-bone">
                  {entry.title}
                </h3>
                <p className="mt-3 max-w-[58ch] text-body text-dim">{entry.description}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* ---- Education -------------------------------------------------- */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="rule-top mt-16 grid gap-x-8 gap-y-8 pt-10 md:grid-cols-12"
      >
        <motion.div variants={riseIn} className="md:col-span-5">
          <p className="readout text-signal">Education</p>
          <h3 className="mt-5 text-title font-semibold tracking-tight text-bone">
            {education.degree}
          </h3>
          <p className="mt-3 text-body text-dim">{education.major} Major</p>
        </motion.div>

        <motion.dl variants={riseIn} className="md:col-span-3">
          <div className="disp-row">
            <dt className="tag">Year</dt>
            <dd className="readout text-bone">{education.year}</dd>
          </div>
          <div className="disp-row">
            <dt className="tag">Format</dt>
            <dd className="readout text-bone">{education.format}</dd>
          </div>
          <div className="disp-row">
            <dt className="tag">Graduation</dt>
            <dd className="readout text-bone">
              {education.expectedGraduation.replace('Expected Graduation: ', '')}
            </dd>
          </div>
        </motion.dl>

        <motion.div variants={riseIn} className="md:col-span-3 md:col-start-10">
          <p className="tag">Relevant coursework</p>
          <ul className="mt-4 space-y-2">
            {education.relevantCoursework.map((course) => (
              <li key={course} className="text-body text-dim">
                {course}
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </section>
  );
}
