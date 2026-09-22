'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { contactInfo, media, projects, profile } from '@/data/portfolio';
import { Preloader } from './preloader';
import { Gallery } from './work-gallery';
import { DesignGallery } from './design-gallery';
import { SkillsGrid } from './skills-grid';
import { TechStack } from './tech-stack';
import { GitHubActivity } from './github-activity';
import { AcademicJourney } from './academic-journey';
import { CredentialsPreview } from './credentials-preview';
import { SoundEffects, SoundToggle } from './sound-effects';
import { ThemeToggle } from './theme-toggle';
import { ZeldaCornerEmblem, ZeldaCrest, useZeldaSwitch } from './zelda-emblem';
import { SectionHeading } from './section-heading';
import { LocalTime } from './local-time';
import { MotionProvider, fadeIn, riseIn, stagger, staggerSlow, viewport } from './motion';

/**
 * The page.
 *
 * A quiet sticky rail carries the index on desktop; the main column is a
 * single strong column: the portrait opens it, then the software, then the
 * pictures made along the way, with capabilities, stack, activity, academia,
 * and certificates filling out the middle of the scroll.
 *
 * ---- On the naming ----
 * The section labels say what each section is. The previous set — Launch,
 * Ship History, Credentials — was mission-control costume, and costume is the
 * fastest way for a portfolio to read as a template with a skin on it. A
 * studio names its sections after their contents and lets the typography carry
 * the personality.
 *
 * ---- On MotionProvider ----
 * It wraps everything, because `MotionConfig` only reaches its descendants.
 * This is what makes every Framer Motion entrance on the page respect
 * `prefers-reduced-motion`; see components/motion.tsx.
 */

const SECTIONS = [
  { id: 'top', label: 'Intro' },
  { id: 'projects', label: 'Projects' },
  { id: 'media', label: 'Media & Design' },
  { id: 'skills', label: 'Capabilities' },
  { id: 'stack', label: 'Tech Stack' },
  { id: 'activity', label: 'GitHub Activity' },
  { id: 'academic', label: 'Academic Journey' },
  { id: 'credentials', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
] as const;

export function Console({ swordSoundSrc }: { swordSoundSrc: string | null }) {
  const [active, setActive] = useState<string>('top');

  useEffect(() => {
    const nodes = SECTIONS.map((section) => document.getElementById(section.id)).filter(
      (node): node is HTMLElement => node !== null,
    );

    let frame = 0;
    const update = () => {
      frame = 0;
      if (nodes.length === 0) return;
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      const current = atBottom
        ? nodes[nodes.length - 1]
        : nodes.reduce<HTMLElement | null>(
            (found, node) => (node.getBoundingClientRect().top <= 120 ? node : found),
            null,
          );
      setActive(current?.id ?? '');
    };
    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  const jump = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <MotionProvider>
      <Preloader />
      <SoundEffects />

      <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:px-8">
        {/* ===== The index rail (sticky on desktop) ==================== */}
        <aside className="hidden lg:block lg:sticky lg:top-0 lg:h-screen lg:py-12">
          <div className="flex h-full flex-col justify-between px-6">
            <div>
              <button
                type="button"
                onClick={() => jump('top')}
                className="press flex items-baseline gap-3 text-left"
              >
                <span className="text-title font-semibold tracking-tight text-bone">
                  {profile.initials}
                </span>
                <span className="readout text-faint">{profile.name}</span>
              </button>

              <nav aria-label="Sections" className="mt-14">
                <ul>
                  {SECTIONS.map((section, i) => (
                    <li key={section.id}>
                      <button
                        type="button"
                        onClick={() => jump(section.id)}
                        aria-current={active === section.id ? 'true' : undefined}
                        className="group press flex w-full items-baseline gap-3 py-2 text-left"
                      >
                        <span
                          className={`readout transition-colors duration-hover ${
                            active === section.id ? 'text-signal' : 'text-faint'
                          }`}
                        >
                          {/* Counted from 00 so each number matches the index
                              on its section heading — the intro has none. */}
                          {String(i).padStart(2, '0')}
                        </span>
                        <span
                          className={`readout transition-colors duration-hover ${
                            active === section.id
                              ? 'text-bone'
                              : 'text-dim group-hover:text-bone'
                          }`}
                        >
                          {section.label}
                        </span>
                        {/* Scales rather than animating width, so the marker
                            never asks the rail to re-lay-out on scroll. */}
                        <span
                          className={`ml-auto block h-px w-6 origin-left bg-signal transition-transform duration-panel ease-out ${
                            active === section.id
                              ? 'scale-x-100'
                              : 'scale-x-0 group-hover:scale-x-100'
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <footer>
              <p className="tag">
                © {new Date().getFullYear()} {profile.name}
              </p>
              <p className="tag mt-2 text-faint">Set in Cinzel &amp; Geist · Next.js</p>
              <p className="tag mt-2 max-w-[13rem] normal-case tracking-normal text-faint">A fan tribute to The Legend of Zelda&rsquo;s 40th anniversary. Not affiliated with or endorsed by Nintendo.</p>
            </footer>
          </div>
        </aside>

        {/* ===== The column ============================================ */}
        <main className="lg:py-12">
          <Hero swordSoundSrc={swordSoundSrc} />
          <Gallery
            id="projects"
            index="01"
            title="Projects"
            note="The software that ships — product over process, links included."
            entries={projects}
          />
          <DesignGallery
            id="media"
            index="02"
            title="Media & Design"
            note="The pictures, marks, and print made along the way."
            entries={media}
          />
          <SkillsGrid />
          <TechStack />
          <GitHubActivity />
          <AcademicJourney />
          <CredentialsPreview />
          <Contact />

          <footer className="rail mt-24 flex flex-wrap justify-between gap-4 border-t border-line py-8 lg:hidden">
            <p className="tag">
              © {new Date().getFullYear()} {profile.name}
            </p>
            <p className="tag text-faint">Set in Cinzel &amp; Geist · Next.js</p>
            <p className="tag w-full normal-case tracking-normal text-faint">A fan tribute to The Legend of Zelda&rsquo;s 40th anniversary. Not affiliated with or endorsed by Nintendo.</p>
          </footer>
        </main>
      </div>
    </MotionProvider>
  );
}

/* ---- Hero ---------------------------------------------------------------- */

function Hero({ swordSoundSrc }: { swordSoundSrc: string | null }) {
  const [given, ...family] = profile.name.split(' ');
  // One switch shared by both crests — see components/zelda-emblem.tsx.
  const zelda = useZeldaSwitch(swordSoundSrc);

  return (
    <header id="top" className="rail scroll-mt-24">
      <motion.div
        variants={staggerSlow}
        initial="hidden"
        animate="show"
        className="pt-12 md:pt-16 lg:pt-4"
      >
        {/* Top strip: identity line + controls. */}
        {/* On a phone the controls take their own row above the identity
            line — sharing one row squeezed the line into five wrapped lines
            beside them. DOM order stays identity-first for screen readers. */}
        <motion.div
          variants={fadeIn}
          className="flex flex-col-reverse gap-6 sm:flex-row sm:items-center sm:justify-between"
        >
          {/* Reserved height so the clock arriving after hydration does not
              nudge the row it sits in. */}
          <p className="readout flex min-h-[1.35em] flex-wrap items-center gap-x-4 gap-y-1 text-dim">
            <span>
              {profile.nickname} — {profile.headline}
            </span>
            <LocalTime />
          </p>
          <div className="flex items-center gap-5 self-end sm:self-auto md:gap-7">
            <ThemeToggle />
            <SoundToggle />
            {/* Theme off: the crest lives here, small, in the top-right corner. */}
            <ZeldaCornerEmblem
              active={zelda.active}
              onToggle={zelda.toggle}
              artRef={zelda.setCornerEl}
            />
          </div>
        </motion.div>

        {/* Theme on: the crest moves here — centred and large, the way Nintendo's
            anniversary pages open. Hidden by CSS while the theme is off, so the
            page does not reserve space for it. */}
        <ZeldaCrest
          active={zelda.active}
          strikes={zelda.strikes}
          onToggle={zelda.toggle}
          artRef={zelda.setCrestEl}
        />

        {/* The name. Big, unapologetic. */}
        <motion.h1
          variants={riseIn}
          className="mt-14 text-hero font-semibold uppercase text-bone md:mt-20"
        >
          <span className="block">{given}</span>
          <span className="block text-dim">{family.join(' ')}</span>
        </motion.h1>

        <motion.p
          variants={riseIn}
          className="mt-10 max-w-[24ch] text-title font-medium uppercase tracking-tight text-bone md:mt-12"
        >
          {profile.tagline}
        </motion.p>

        <div className="mt-20 grid gap-12 md:mt-28 md:grid-cols-12 md:gap-8">
          {/* Bio + meta. */}
          <motion.div variants={riseIn} className="md:col-span-6">
            <p className="prose-measure text-lead text-bone">{profile.bio}</p>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              {[
                { label: 'Email', href: `mailto:${contactInfo.email}` },
                { label: 'GitHub', href: contactInfo.github },
                { label: 'LinkedIn', href: contactInfo.linkedin },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  className="link link--ruled readout"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <dl className="mt-16">
              <div className="disp-row">
                <dt className="tag">Study</dt>
                <dd className="readout text-bone">BSIT — Artificial Intelligence</dd>
              </div>
              <div className="disp-row">
                <dt className="tag">Institution</dt>
                <dd className="readout text-bone">St. Paul University Philippines</dd>
              </div>
              <div className="disp-row">
                <dt className="tag">Based</dt>
                <dd className="readout text-bone">Philippines</dd>
              </div>
              <div className="disp-row">
                <dt className="tag">Focus</dt>
                <dd className="readout text-bone">AI · Software · Brand</dd>
              </div>
            </dl>
          </motion.div>

          {/* The portrait. */}
          <motion.div variants={riseIn} className="md:col-span-5 md:col-start-8">
            <div className="portrait aspect-[4/5]">
              <Image
                src="/new profile.jpg"
                alt={`Portrait of ${profile.name}`}
                fill
                priority
                sizes="(max-width: 768px) 92vw, 37vw"
              />
            </div>
            <p className="tag mt-4 text-faint">{profile.initials} — Portrait</p>
          </motion.div>
        </div>
      </motion.div>
    </header>
  );
}

/* ---- Contact ------------------------------------------------------------- */

/**
 * An address that wraps where a person would break it: before the `@`, after
 * each `/`. `break-all` used to split these mid-word ("reggielovett143@g" /
 * "mail.com") whenever the card was narrower than the address.
 */
function Breakable({ text }: { text: string }) {
  const parts = text.split(/(?=@)|(?<=\/)/);
  return parts.map((part, i) => (
    <span key={i}>
      {i > 0 && <wbr />}
      {part}
    </span>
  ));
}

function Contact() {
  const rows = [
    { term: 'Email', value: contactInfo.email, href: `mailto:${contactInfo.email}` },
    { term: 'GitHub', value: 'github.com/ReggieLovett', href: contactInfo.github },
    { term: 'LinkedIn', value: 'linkedin.com/in/reggielovett', href: contactInfo.linkedin },
  ];

  return (
    <section id="contact" className="rail section">
      <SectionHeading
        index="08"
        title="Contact"
        note="Send a brief — I reply with the honest version of what it takes."
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="mt-16 grid gap-x-8 gap-y-10 md:mt-24 md:grid-cols-3"
      >
        {rows.map((row) => (
          <motion.a
            key={row.term}
            variants={riseIn}
            href={row.href}
            target={row.href.startsWith('mailto:') ? undefined : '_blank'}
            rel={row.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
            className="card group p-6 md:p-7"
          >
            <span className="tag">{row.term}</span>
            <span className="mt-10 break-words text-title font-medium tracking-tight text-bone transition-colors duration-hover ease-out group-hover:text-signal">
              <Breakable text={row.value} />
            </span>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
}
