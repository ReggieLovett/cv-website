'use client';

import { skillGroups, techStack } from '../data/portfolio';
import { TechIcon, type TechIconKey } from './tech-icons';
import { Reveal } from './reveal';

/**
 * Skills & Technologies.
 *
 * Tier 1 — category cards of pill badges (logo + name), one card per discipline.
 * Tier 2 — the wider capability map, same card language, text-only chips.
 * Bootstrap's row/col grid handles the responsive columns; the glass surfaces
 * and pill shapes come from the design system in globals.css.
 */
export function SkillsSection() {
  return (
    <section id="skills" className="section section-rule">
      <div className="aurora pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

      <div className="container relative">
        <Reveal className="mb-16 max-w-3xl">
          <div className="eyebrow">TECHNICAL SYSTEMS</div>
          <h2 className="display display-lg mt-6">
            TOOLS, SKILLS,
            <br />
            <span className="gradient-ink">&amp; SYSTEMS.</span>
          </h2>
          <p className="lede mt-6">
            The stack I build with day to day — grouped by where each piece sits in a system.
          </p>
        </Reveal>

        {/* ---- Tier 1: technology cards ------------------------------------ */}
        <div className="row g-4">
          {techStack.map((category, index) => (
            <div key={category.label} className="col-12 col-md-6 col-xl-3">
              <Reveal variant="blur" delay={index * 50} className="h-100">
                <div className="bezel bezel-hover">
                <div className="skill-card">
                  <div className="d-flex align-items-baseline justify-content-between gap-3">
                    <h3 className="skill-card__label">{category.label}</h3>
                    <span className="skill-card__count">
                      {String(category.items.length).padStart(2, '0')}
                    </span>
                  </div>

                  <div
                    className="mt-3 mb-4 hairline-x"
                    style={{ height: 1 }}
                    aria-hidden="true"
                  />

                  <div className="pill-row">
                    {category.items.map((item) => (
                      <span key={`${category.label}-${item.name}`} className="tech-pill">
                        <TechIcon name={item.icon as TechIconKey} />
                        {item.name}
                      </span>
                    ))}
                  </div>

                  <p className="body-text mt-auto pt-4" style={{ fontSize: '0.8125rem' }}>
                    {category.caption}
                  </p>
                </div>
                </div>
              </Reveal>
            </div>
          ))}
        </div>

        {/* ---- Tier 2: the full capability map ----------------------------- */}
        <Reveal className="mt-5 pt-5">
          <div className="eyebrow-plain mb-4">CAPABILITY MAP</div>
        </Reveal>

        <div className="row g-4">
          {skillGroups.map((group, index) => (
            <div key={group.label} className="col-12 col-md-6 col-xl-4">
              <Reveal variant="up" delay={index * 45} className="h-100">
                <div className="bezel bezel-hover">
                <div className="skill-card" style={{ padding: '1.5rem' }}>
                  <h3 className="skill-card__label">{group.label}</h3>
                  <div
                    className={`mt-3 mb-4 rounded-full bg-gradient-to-r ${group.accent} opacity-50`}
                    style={{ height: 2, width: '3.5rem' }}
                    aria-hidden="true"
                  />
                  <div className="pill-row">
                    {group.skills.map((skill) => (
                      <span key={`${group.label}-${skill}`} className="chip">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
