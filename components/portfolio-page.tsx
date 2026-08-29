'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Check,
  ExternalLink,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  X,
} from 'lucide-react';
import {
  achievements,
  beyondTheCode,
  certificates,
  contactInfo,
  education,
  experience,
  leadership,
  missionLabels,
  navItems,
  organizations,
  profile,
  projects,
  timeline,
} from '../data/portfolio';
import { R2XGallery } from './r2x-gallery';
import { SkillsSection } from './skills-section';
import { Reveal } from './reveal';
import { ThemeToggle } from './theme-toggle';
import { SoundEffects, SoundToggle } from './sound-effects';
import { ContributionGraph } from './contribution-graph';
import type { ContributionData } from '@/lib/contributions';
import { useExitTransition } from './use-exit-transition';

const filterOptions = ['ALL', 'AI', 'WEB DEVELOPMENT', 'DATABASE', 'HCI / UX', 'SOFTWARE', 'OTHER'] as const;

export function PortfolioPage({ contributions }: { contributions: ContributionData | null }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menuExit = useExitTransition();
  const certExit = useExitTransition();
  const [activeFilter, setActiveFilter] = useState<(typeof filterOptions)[number]>('ALL');
  const [activeSection, setActiveSection] = useState<string>('HOME');
  const [selectedCertificate, setSelectedCertificate] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Sorted by real document position rather than trusting navItems' order —
    // the reduce below walks them top-to-bottom, so a nav array that drifts out
    // of sync with the page would otherwise report the wrong active section.
    const sections = navItems
      .map((item) => document.getElementById(item.toLowerCase()))
      .filter((section): section is HTMLElement => section !== null)
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);

    // Sections are taller than the viewport, so IntersectionObserver ratios are not
    // comparable between them. Measure directly instead: the active section is the last
    // one whose top has scrolled past the sticky header.
    const HEADER_OFFSET = 96;
    let frame = 0;

    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);

      if (sections.length === 0) return;

      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      const current = atBottom
        ? sections[sections.length - 1]
        : sections.reduce(
            (found, section) => (section.getBoundingClientRect().top <= HEADER_OFFSET ? section : found),
            sections[0],
          );

      setActiveSection(current.id.toUpperCase());
    };

    const schedule = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });

    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'ALL') return projects;
    return projects.filter((project) => project.category === activeFilter);
  }, [activeFilter]);

  const latestProject = projects[0];
  const latestAchievement = achievements[0];

  const closeMobileNav = useCallback(
    () => menuExit.dismiss(() => setMobileNavOpen(false)),
    [menuExit],
  );

  const scrollToSection = useCallback(
    (id: string) => {
      document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Dismissing from inside a state updater would fire twice under
      // StrictMode's double-invoke; read the flag and act outside it.
      if (mobileNavOpen) closeMobileNav();
    },
    [mobileNavOpen, closeMobileNav],
  );

  const missionStats = [
    { label: 'STATUS', value: missionLabels.status },
    { label: 'EDUCATION', value: missionLabels.education },
    { label: 'SPECIALIZATION', value: missionLabels.specialization },
    { label: 'INSTITUTION', value: missionLabels.institution },
    { label: 'FOCUS', value: missionLabels.focus },
    { label: 'MISSION', value: missionLabels.mission },
  ];

  return (
    <div className="bg-deep relative min-h-screen">
      {/* ---- Ambient deep-space canvas ------------------------------------ */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <div className="starfield" />
        <div className="glow-primary absolute inset-0" />
        <div className="glow-warm absolute inset-0" />
      </div>
      <div className="grain z-[40]" aria-hidden="true" />
      <SoundEffects />

      {/* ---- Header -------------------------------------------------------- */}
      <header className="fixed inset-x-0 top-0 z-[70]">
        {scrolled && <div className="scroll-edge" aria-hidden="true" />}
        <div className="container">
          <div
            data-floating={scrolled}
            className="nav-island d-flex align-items-center justify-content-between gap-3"
          >
            <button
              onClick={() => scrollToSection('home')}
              className="d-flex align-items-center gap-3 shrink-0 text-left"
            >
              <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-edge-3 bg-fill-2">
                <img
                  src="/Lovett_logo-removebg-preview.png"
                  alt=""
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="d-none d-sm-block d-xl-none d-xxl-block leading-tight">
                <span className="font-mono-ui block text-[10px] tracking-[0.28em] text-dim-ink">RL // DAToh</span>
                <span className="block text-[15px] font-semibold tracking-[-0.02em] text-ink">Reggie Portfolio</span>
              </span>
            </button>

            {/* Ten wide-tracked nav items need ~1100px, so the inline nav only appears at xl. */}
            <nav aria-label="Primary" className="d-none d-xl-flex align-items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  aria-current={activeSection === item ? 'true' : undefined}
                  data-active={activeSection === item}
                  className="site-nav__link"
                >
                  <span>{item}</span>
                </button>
              ))}
            </nav>

            <div className="d-flex align-items-center gap-2">
              <SoundToggle />
              <ThemeToggle />

              <button
                className="btn-quiet d-none d-xxl-inline-flex"
                onClick={() => scrollToSection('projects')}
              >
                EXPLORE MY WORK
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>

              <button
                className="d-xl-none grid h-10 w-10 place-items-center rounded-full border border-edge-2 bg-fill-2 text-ink"
                aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileNavOpen}
                aria-controls="mobile-nav"
                onClick={() => (mobileNavOpen ? closeMobileNav() : setMobileNavOpen(true))}
              >
                <span className="burger" data-open={mobileNavOpen && !menuExit.closing} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
              </button>
            </div>
          </div>
        </div>

      </header>

      {mobileNavOpen && (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          data-closing={menuExit.closing}
          className="menu-overlay chrome-blur overlay-anim d-xl-none"
        >
          <div className="container" style={{ paddingTop: '6rem', paddingBottom: '3rem' }}>
            {navItems.map((item, index) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                aria-current={activeSection === item ? 'true' : undefined}
                data-active={activeSection === item}
                className="menu-link menu-item"
                style={{ '--menu-delay': `${index * 45}ms` } as React.CSSProperties}
              >
                {item}
              </button>
            ))}
          </div>
        </nav>
      )}

      <main className="relative z-10">
        {/* ---- Hero -------------------------------------------------------- */}
        <section id="home" className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="grid-lines" />
            <div className="hero-halo absolute left-1/2 top-[-32%] h-[620px] w-[1100px] -translate-x-1/2 rounded-full blur-2xl" />
            <div className="absolute bottom-[-10%] left-1/2 h-px w-[85%] -translate-x-1/2 hairline-x" />
          </div>

          <div className="container relative pb-20 pt-[7.5rem] text-center lg:pb-28 lg:pt-[10rem]">
            <Reveal variant="up">
              <span className="chip chip-mono chip-signal">
                <span className="animate-beacon mr-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                MISSION CONTROL // ONLINE
              </span>
            </Reveal>

            <Reveal variant="blur" delay={90}>
              <h1 className="display display-xl mx-auto mt-8 max-w-[16ch]">
                REGGIE LOVETT
              </h1>
              <p className="display display-lg gradient-ink mx-auto mt-2 max-w-[22ch]">
                BSIT // ARTIFICIAL INTELLIGENCE
              </p>
            </Reveal>

            <Reveal variant="up" delay={220}>
              <p className="font-mono-ui mx-auto mt-10 max-w-2xl text-[11px] tracking-[0.32em] text-signal sm:text-xs">
                {profile.tagline}
              </p>
              <p className="lede mx-auto mt-6 max-w-2xl">{profile.bio}</p>
            </Reveal>

            <Reveal variant="up" delay={320}>
              <div className="d-flex flex-wrap justify-content-center align-items-center gap-3 mt-10">
                <button className="btn-solid" onClick={() => scrollToSection('projects')}>
                  EXPLORE MY PROJECTS
                  <span className="btn__icon">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </button>
                <button className="btn-glass btn--plain" onClick={() => scrollToSection('about')}>
                  ABOUT ME
                </button>
              </div>
            </Reveal>
          </div>

          {/* Telemetry strip */}
          <div className="container relative pb-16 lg:pb-24">
            <Reveal variant="blur" delay={140}>
              <div className="glass overflow-hidden p-6 lg:p-8">
                <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                  <div className="animate-sweep absolute -top-px h-px w-1/3 bg-gradient-to-r from-transparent via-[rgb(var(--tint)/0.5)] to-transparent" />
                </div>

                <div className="d-flex align-items-center justify-content-between mb-6 gap-3">
                  <span className="font-mono-ui text-[10px] tracking-[0.28em] text-dim-ink">
                    SIGNAL // ACTIVE
                  </span>
                  <span className="font-mono-ui d-flex align-items-center gap-2 text-[10px] tracking-[0.28em] text-dim-ink">
                    CORE SYSTEM
                    <span className="text-emerald-400">ONLINE</span>
                  </span>
                </div>

                <div className="row g-4 text-start">
                  {[
                    { label: 'AI', value: 'R&D' },
                    { label: 'BUILD', value: 'CODE' },
                    { label: 'LEAD', value: 'TEAM' },
                  ].map((cell) => (
                    <div key={cell.label} className="col-4">
                      <div className="font-mono-ui text-[10px] tracking-[0.24em] text-dim-ink">{cell.label}</div>
                      <div className="display display-md mt-2">{cell.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---- Mission stats ---------------------------------------------- */}
        <section className="section-rule border-b border-edge py-8">
          <div className="container">
            <div className="row g-3">
              {missionStats.map((stat, index) => (
                <div key={stat.label} className="col-6 col-lg-4 col-xxl-2">
                  <Reveal delay={index * 40} className="h-100">
                    <div className="glass h-100 p-4">
                      <div className="font-mono-ui text-[9px] tracking-[0.24em] text-dim-ink">{stat.label}</div>
                      <div className="mt-2 text-[13px] font-medium leading-snug text-ink">{stat.value}</div>
                    </div>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- About ------------------------------------------------------- */}
        <section id="about" className="section section-rule">
          <div className="container">
            <div className="row g-5">
              {/* The portrait stays pinned while the biography scrolls past it, so
                  the person and the words about them stay on screen together. */}
              <div className="col-12 col-lg-5">
                <Reveal variant="scale">
                  <figure
                    className="bezel mb-0"
                    style={{ position: 'sticky', top: '7rem' }}
                  >
                    <div className="bezel__core">
                      <div className="portrait" style={{ aspectRatio: '4 / 5' }}>
                        <img
                          src="/new profile.jpg"
                          alt={`Portrait of ${profile.name}`}
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="portrait__scrim" />
                        <span className="tick tick--tl" aria-hidden="true" />
                        <span className="tick tick--tr" aria-hidden="true" />
                        <span className="tick tick--bl" aria-hidden="true" />
                        <span className="tick tick--br" aria-hidden="true" />

                        <div className="absolute inset-x-0 top-0 d-flex justify-content-between p-4 pt-5">
                          <span className="font-mono-ui text-[10px] tracking-[0.28em] text-signal">
                            PROFILE // RL
                          </span>
                          <span className="font-mono-ui text-[10px] tracking-[0.28em] text-muted-ink">
                            {profile.nickname}
                          </span>
                        </div>

                        <figcaption className="absolute inset-x-0 bottom-0 p-5">
                          <div className="display display-md">{profile.name}</div>
                          <div className="font-mono-ui mt-3 text-[10px] leading-relaxed tracking-[0.22em] text-muted-ink">
                            {profile.headline}
                          </div>
                        </figcaption>
                      </div>
                    </div>
                  </figure>
                </Reveal>
              </div>

              <div className="col-12 col-lg-7">
                <Reveal delay={120}>
                  <div className="eyebrow">ABOUT THE MISSION</div>
                  <h2 className="display display-lg mt-6">
                    BUILDING TECHNOLOGY
                    <br />
                    <span className="gradient-ink">WITH PURPOSE.</span>
                  </h2>

                  <p className="lede mt-8">
                    My name is <span className="font-semibold text-ink">Reggie Lovett</span>. I am a {profile.year}{' '}
                    Bachelor of Science in Information Technology student majoring in {profile.major} at{' '}
                    {profile.school}.
                  </p>

                  <p className="body-text mt-5">
                    I am interested in Artificial Intelligence, software development, web development, technology,
                    project development, leadership, and project management. I enjoy turning ideas into practical
                    digital solutions and continuously developing both my technical and professional skills.
                  </p>
                </Reveal>

                <Reveal delay={200}>
                  <dl className="spec mt-11">
                    {[
                      { label: 'Current Year', value: profile.year },
                      { label: 'Major', value: profile.major },
                      { label: 'School', value: profile.school },
                      { label: 'Degree', value: profile.degree },
                    ].map((item) => (
                      <div key={item.label} className="spec__row">
                        <dt className="spec__label">{item.label}</dt>
                        <dd className="spec__value mb-0">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ---- Education ---------------------------------------------------- */}
        <section className="section section-rule">
          <div className="container">
            <Reveal className="mb-11 max-w-3xl">
              <div className="eyebrow">EDUCATION</div>
              <h2 className="display display-lg mt-6">
                ACADEMIC <span className="gradient-ink">FOUNDATION.</span>
              </h2>
            </Reveal>

            <Reveal variant="blur">
              <article className="card panel p-4 p-md-5">
                <div className="row g-4 align-items-start">
                  <div className="col-12 col-lg-8">
                    <div className="d-flex align-items-center gap-3">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-edge-2 bg-fill-2">
                        <GraduationCap className="h-5 w-5 text-signal" />
                      </span>
                      <span>
                        <span className="font-mono-ui block text-[10px] tracking-[0.22em] text-dim-ink">
                          {education.school}
                        </span>
                        <span className="display display-md mt-2 block">{education.degree}</span>
                      </span>
                    </div>
                    <div className="body-text mt-4">Major: {education.major}</div>
                    <div className="body-text mt-1">Year: {education.year}</div>
                  </div>

                  <div className="col-12 col-lg-4 d-flex justify-content-lg-end">
                    <span className="chip chip-mono chip-signal">
                      {education.expectedGraduation || 'Expected graduation unavailable'}
                    </span>
                  </div>
                </div>

                <div className="row g-4 mt-4">
                  <div className="col-12 col-md-6">
                    <div className="font-mono-ui mb-3 text-[10px] tracking-[0.24em] text-dim-ink">
                      RELEVANT COURSEWORK
                    </div>
                    <div className="pill-row">
                      {education.relevantCoursework.map((course) => (
                        <span key={course} className="chip">
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="font-mono-ui mb-3 text-[10px] tracking-[0.24em] text-dim-ink">
                      ACADEMIC ACHIEVEMENTS
                    </div>
                    <div className="d-flex flex-column gap-3">
                      {education.achievements.map((item) => (
                        <div key={item} className="d-flex align-items-start gap-2">
                          <Check className="mt-1 h-4 w-4 shrink-0 text-signal" />
                          <span className="body-text" style={{ fontSize: '0.9375rem' }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          </div>
        </section>

        {/* ---- Skills & Technologies --------------------------------------- */}
        <SkillsSection />

        {/* ---- Experience -------------------------------------------------- */}
        <section id="experience" className="section section-rule">
          <div className="container">
            <Reveal className="mb-11 max-w-3xl">
              <div className="eyebrow">FIELD OPERATIONS</div>
              <h2 className="display display-lg mt-6">
                PROFESSIONAL <span className="gradient-ink">EXPERIENCE.</span>
              </h2>
            </Reveal>

            <div className="row g-4">
              {experience.map((item, index) => (
                <div key={item.title} className="col-12">
                  <Reveal variant="up" delay={index * 50}>
                    <article className="card panel glass-hover p-4 p-md-5">
                      <div className="row g-4">
                        <div className="col-12 col-lg-5">
                          <div className="font-mono-ui text-[10px] tracking-[0.26em] text-signal">{item.type}</div>
                          <h3 className="display display-md mt-4">{item.title}</h3>
                          <div className="body-text mt-3" style={{ fontSize: '0.9375rem' }}>
                            {item.organization}
                          </div>
                          <span className="chip chip-mono mt-4">{item.date || 'Date unavailable'}</span>
                        </div>

                        <div className="col-12 col-lg-7">
                          <p className="body-text">{item.description}</p>
                          <div className="pill-row mt-4">
                            {item.highlights.map((highlight) => (
                              <span key={highlight} className="chip">
                                {highlight}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Projects ---------------------------------------------------- */}
        <section id="projects" className="section section-rule">
          <div className="container">
            <div className="row g-4 align-items-end mb-11">
              <div className="col-12 col-lg-7">
                <Reveal>
                  <div className="eyebrow">MISSIONS</div>
                  <h2 className="display display-lg mt-6">
                    SELECTED TECHNOLOGY
                    <br />
                    <span className="gradient-ink">PROJECTS.</span>
                  </h2>
                </Reveal>
              </div>
              <div className="col-12 col-lg-5">
                <Reveal delay={120}>
                  <p className="body-text">
                    Explore the technology concepts, digital ideas, and system-focused work driving my growth as a
                    future technology professional.
                  </p>
                </Reveal>
              </div>
            </div>

            <Reveal>
              <div className="d-flex flex-wrap gap-2 mb-5">
                {filterOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setActiveFilter(option)}
                    data-active={activeFilter === option}
                    className="filter-pill"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </Reveal>

            <div className="row g-4">
              {filteredProjects.map((project, index) => (
                <div key={project.title} className="col-12 col-lg-4">
                  <Reveal variant="blur" delay={index * 40} className="h-100">
                    <ProjectCard project={project} />
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Mission dash ------------------------------------------------ */}
        <section className="section-rule py-10">
          <div className="container">
            <div className="row g-4">
              {[
                { label: 'CURRENT FOCUS', value: 'Artificial Intelligence' },
                { label: 'LATEST PROJECT', value: latestProject.title },
                { label: 'LATEST ACHIEVEMENT', value: latestAchievement.title || 'Latest milestone' },
              ].map((item, index) => (
                <div key={item.label} className="col-12 col-lg-4">
                  <Reveal delay={index * 50} className="h-100">
                    <div className="glass glass-hover h-100 p-5">
                      <div className="font-mono-ui text-[10px] tracking-[0.26em] text-dim-ink">{item.label}</div>
                      <div className="mt-3 text-lg font-semibold leading-snug tracking-[-0.02em] text-ink">
                        {item.value}
                      </div>
                    </div>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Contribution activity --------------------------------------- */}
        <ContributionGraph data={contributions} />

        {/* ---- R2X gallery ------------------------------------------------- */}
        <R2XGallery />

        {/* ---- Leadership -------------------------------------------------- */}
        <section id="leadership" className="section section-rule">
          <div className="container">
            <Reveal className="mb-11 max-w-3xl">
              <div className="eyebrow">LEADERSHIP &amp; REPRESENTATION</div>
              <h2 className="display display-lg mt-6">
                LEADING WITH <span className="gradient-ink">IMPACT.</span>
              </h2>
            </Reveal>

            <div className="row g-4">
              {leadership.map((item, index) => (
                <div key={item.organization} className="col-12 col-lg-6">
                  <Reveal variant="blur" delay={index * 40} className="h-100">
                    <article className="card panel glass-hover p-4 p-md-5">
                      <div className="d-flex justify-content-between align-items-start gap-3">
                        <div>
                          <div className="font-mono-ui text-[10px] tracking-[0.26em] text-signal">{item.position}</div>
                          <h3 className="display display-md mt-3">{item.organization}</h3>
                          {item.chapter && <p className="body-text mt-3" style={{ fontSize: '0.9375rem' }}>{item.chapter}</p>}
                          {item.school && <p className="body-text mt-1" style={{ fontSize: '0.9375rem' }}>{item.school}</p>}
                        </div>
                        <span className="chip chip-mono shrink-0">{item.year || 'Year unavailable'}</span>
                      </div>

                      <p className="body-text mt-4">{item.description}</p>

                      <div className="mt-4">
                        <div className="font-mono-ui mb-3 text-[10px] tracking-[0.26em] text-dim-ink">KEY AREAS</div>
                        <div className="pill-row">
                          {item.skills.map((skill) => (
                            <span key={skill} className="chip">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </article>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Organizations ----------------------------------------------- */}
        <section id="organizations" className="section section-rule">
          <div className="container">
            <Reveal className="mb-11 max-w-3xl">
              <div className="eyebrow">ORGANIZATIONS &amp; COMMUNITY</div>
              <h2 className="display display-lg mt-6">
                PART OF THE <span className="gradient-ink">COMMUNITY.</span>
              </h2>
            </Reveal>

            <div className="row g-4">
              {organizations.map((organization, index) => (
                <div key={organization.name} className="col-12 col-lg-6">
                  <Reveal variant="blur" delay={index * 40} className="h-100">
                    <article className="card panel glass-hover p-4 p-md-5">
                      <div className="d-flex justify-content-between align-items-start gap-3">
                        <div>
                          <div className="font-mono-ui text-[10px] tracking-[0.26em] text-signal">{organization.type}</div>
                          <h3 className="display display-md mt-3">{organization.name}</h3>
                          {organization.chapter && (
                            <p className="body-text mt-3" style={{ fontSize: '0.9375rem' }}>{organization.chapter}</p>
                          )}
                        </div>
                        <span className="chip chip-mono shrink-0">{organization.position}</span>
                      </div>
                      <p className="body-text mt-4">{organization.description}</p>
                      <div className="font-mono-ui mt-4 text-[10px] tracking-[0.22em] text-dim-ink">
                        {organization.year || 'Year unavailable'}
                      </div>
                    </article>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Achievements ------------------------------------------------ */}
        <section id="achievements" className="section section-rule">
          <div className="container">
            <Reveal className="mb-11 max-w-3xl">
              <div className="eyebrow">MISSION ACHIEVEMENTS</div>
              <h2 className="display display-lg mt-6">
                GROWTH THROUGH <span className="gradient-ink">EXPERIENCE.</span>
              </h2>
            </Reveal>

            <div className="row g-4">
              {achievements.map((achievement, index) => (
                <div key={`${achievement.title}-${achievement.date}`} className="col-12 col-md-6 col-xl-3">
                  <Reveal variant="blur" delay={index * 50} className="h-100">
                    <article className="bezel bezel-hover">
                      <div className="bezel__core p-4">
                      <div className="d-flex align-items-center justify-content-between gap-2">
                        <span className="chip chip-mono">{achievement.category}</span>
                        <Award className="h-4 w-4 text-signal" />
                      </div>
                      <h3 className="mt-4 text-xl font-semibold leading-tight tracking-[-0.025em] text-ink">
                        {achievement.title || 'Achievement'}
                      </h3>
                      <div className="body-text mt-4" style={{ fontSize: '0.875rem' }}>
                        {achievement.organization || 'Organization unavailable'}
                      </div>
                      <div className="font-mono-ui mt-2 text-[10px] tracking-[0.2em] text-dim-ink">
                        {achievement.date || 'Date unavailable'}
                      </div>
                      <p className="body-text mt-4" style={{ fontSize: '0.875rem' }}>
                        {achievement.description || 'Description unavailable'}
                      </p>
                      </div>
                    </article>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Certificates ------------------------------------------------ */}
        <section id="certificates" className="section section-rule">
          <div className="container">
            <Reveal className="mb-11 max-w-3xl">
              <div className="eyebrow">CERTIFICATIONS</div>
              <h2 className="display display-lg mt-6">
                VERIFIED <span className="gradient-ink">LEARNING.</span>
              </h2>
            </Reveal>

            <div className="row g-4">
              {certificates.map((certificate, index) => (
                <div key={`${certificate.title}-${index}`} className="col-12 col-md-6 col-xl-4">
                  <Reveal variant="blur" delay={(index % 3) * 50} className="h-100">
                    <article className="bezel bezel-hover group">
                      <div className="bezel__core">
                      <div className="relative overflow-hidden border-b border-edge bg-veil p-5" style={{ height: '13rem' }}>
                        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgb(77_141_255/0.18),transparent)]" />
                        {certificate.image ? (
                          <img
                            src={certificate.image}
                            alt={`${certificate.title} certificate`}
                            loading="lazy"
                            decoding="async"
                            className="relative h-full w-full rounded-xl object-contain transition-transform duration-[900ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.06]"
                          />
                        ) : (
                          <div className="font-mono-ui relative grid h-full place-items-center rounded-xl border border-dashed border-edge-3 px-4 text-center text-[10px] tracking-[0.24em] text-dim-ink">
                            {certificate.title || 'Certificate'}
                          </div>
                        )}
                      </div>

                      <div className="d-flex flex-column flex-grow-1 p-4">
                        <div className="font-mono-ui text-[10px] leading-relaxed tracking-[0.18em] text-dim-ink">
                          {certificate.issuer || 'Issuer unavailable'}
                        </div>
                        <h3 className="mt-3 text-lg font-semibold leading-snug tracking-[-0.02em] text-ink">
                          {certificate.title || 'Certificate'}
                        </h3>
                        <div className="body-text mt-3" style={{ fontSize: '0.875rem' }}>
                          {certificate.date || 'Date unavailable'}
                        </div>
                        <div className="font-mono-ui mt-2 text-[10px] tracking-[0.18em] text-dim-ink">
                          {certificate.credentialId || 'Credential unavailable'}
                        </div>
                        <button
                          className="btn-quiet mt-auto w-100"
                          style={{ marginTop: '1.25rem' }}
                          onClick={() => setSelectedCertificate(index)}
                        >
                          VIEW CERTIFICATE
                        </button>
                      </div>
                      </div>
                    </article>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Timeline ----------------------------------------------------- */}
        <section className="section section-rule">
          <div className="container">
            <Reveal className="mb-11 max-w-3xl">
              <div className="eyebrow">MISSION TIMELINE</div>
              <h2 className="display display-lg mt-6">
                THE JOURNEY <span className="gradient-ink">SO FAR.</span>
              </h2>
            </Reveal>

            <div className="relative">
              <div
                className="absolute top-0 h-full w-px bg-gradient-to-b from-transparent via-[rgb(var(--tint)/0.15)] to-transparent"
                style={{ left: '0.4375rem' }}
                aria-hidden="true"
              />
              <div className="d-flex flex-column gap-4">
                {timeline.map((item, index) => (
                  <Reveal key={`${item.title}-${index}`} delay={index * 45}>
                    <div className="d-flex gap-4">
                      <span className="relative mt-5 grid h-3.5 w-3.5 shrink-0 place-items-center">
                        <span className="absolute inset-0 rounded-full bg-[rgb(var(--tint)/0.2)]" />
                        <span className="relative h-1.5 w-1.5 rounded-full bg-[rgb(var(--ink))]" />
                      </span>
                      <div className="glass glass-hover flex-grow-1 p-4 p-md-5">
                        <div className="d-flex flex-wrap align-items-center gap-3">
                          <span className="chip chip-mono chip-signal">{item.year || 'Year unavailable'}</span>
                          <span className="font-mono-ui text-[10px] tracking-[0.24em] text-dim-ink">{item.category}</span>
                        </div>
                        <h3 className="display display-md mt-4">{item.title}</h3>
                        <p className="body-text mt-3">{item.description || 'Details unavailable'}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---- Beyond the code --------------------------------------------- */}
        <section className="section section-rule">
          <div className="container">
            <Reveal className="mb-11 max-w-4xl">
              <div className="eyebrow">BEYOND THE CODE</div>
              <h2 className="display display-lg mt-6">
                TECHNOLOGY IS ONLY PART
                <br />
                <span className="gradient-ink">OF THE MISSION.</span>
              </h2>
            </Reveal>

            <div className="row g-4">
              {beyondTheCode.map((item, index) => (
                <div key={item.id} className="col-12 col-md-6 col-xl-3">
                  <Reveal variant="blur" delay={index * 50} className="h-100">
                    <div className="bezel bezel-hover">
                      <div className="bezel__core p-5">
                        <div className="font-mono-ui text-[10px] tracking-[0.3em] text-signal">{item.id}</div>
                        <h3 className="display display-md mt-5">{item.title}</h3>
                        <p className="body-text mt-4" style={{ fontSize: '0.875rem' }}>{item.text}</p>
                      </div>
                    </div>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Contact ----------------------------------------------------- */}
        <section id="contact" className="section section-rule">
          <div className="container">
            <div className="row g-5">
              <div className="col-12 col-lg-7">
                <Reveal>
                  <div className="eyebrow">CONTACT MISSION CONTROL</div>
                  <h2 className="display display-lg mt-6">
                    LET&rsquo;S BUILD
                    <br />
                    <span className="gradient-ink">WHAT&rsquo;S NEXT.</span>
                  </h2>
                  <p className="lede mt-6" style={{ maxWidth: '36rem' }}>
                    I’m open to collaboration, internships, project opportunities, and conversations around AI,
                    software development, and technology leadership.
                  </p>
                </Reveal>

                <div className="row g-3 mt-4">
                  <div className="col-12">
                    <Reveal>
                      <ContactRow
                        icon={<Mail className="h-4 w-4" />}
                        label="Email"
                        value={contactInfo.email}
                        href={`mailto:${contactInfo.email}`}
                      />
                    </Reveal>
                  </div>
                  <div className="col-12 col-sm-6">
                    <Reveal delay={70} className="h-100">
                      <ContactRow
                        icon={<Github className="h-4 w-4" />}
                        label="GitHub"
                        value="@ReggieLovett"
                        href={contactInfo.github}
                        external
                      />
                    </Reveal>
                  </div>
                  <div className="col-12 col-sm-6">
                    <Reveal delay={140} className="h-100">
                      <ContactRow
                        icon={<Linkedin className="h-4 w-4" />}
                        label="LinkedIn"
                        value="in/reggielovett"
                        href={contactInfo.linkedin}
                        external
                      />
                    </Reveal>
                  </div>
                  <div className="col-12">
                    <Reveal delay={210}>
                      <a
                        href="https://youtu.be/wxX6j3y0vaM?si=Q0siCI3kp430fLqf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass glass-hover d-flex align-items-center gap-3 p-4"
                      >
                        <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-edge-2">
                          <img src="/superman.jpg" alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                        </span>
                        <span className="min-w-0">
                          <span className="font-mono-ui block text-[10px] tracking-[0.24em] text-dim-ink">Hope Core</span>
                          <span className="mt-1 block text-[15px] font-medium text-ink">Watch / Visit</span>
                        </span>
                        <ArrowUpRight className="ms-auto h-4 w-4 text-dim-ink" />
                      </a>
                    </Reveal>
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-5">
                <Reveal variant="blur" delay={120} className="h-100">
                  <div className="glass h-100 p-4 p-md-5">
                    <div className="font-mono-ui text-[10px] tracking-[0.28em] text-signal">MISSION STATUS</div>
                    <div className="row g-3 mt-3">
                      {[
                        { label: 'Current Focus', value: 'Artificial Intelligence' },
                        { label: 'Current Leadership', value: 'JPCS SPUP Chapter • Treasurer' },
                        { label: 'Current Student Role', value: 'PSG • Senator' },
                      ].map((item) => (
                        <div key={item.label} className="col-12">
                          <div className="rounded-2xl border border-edge bg-fill-1 p-4">
                            <div className="font-mono-ui text-[9px] tracking-[0.24em] text-dim-ink">
                              {item.label.toUpperCase()}
                            </div>
                            <div className="mt-2 text-lg font-semibold tracking-[-0.02em] text-ink">{item.value}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ---- Footer ------------------------------------------------------- */}
        <footer className="section-rule bg-void py-12">
          <div className="container">
            <div className="row g-5 align-items-start">
              <div className="col-12 col-lg-4">
                <div className="font-mono-ui text-[10px] tracking-[0.3em] text-signal">RL // DAToh</div>
                <div className="display display-md mt-4">REGGIE LOVETT</div>
                <div className="font-mono-ui mt-3 text-[10px] tracking-[0.24em] text-dim-ink">
                  BSIT • ARTIFICIAL INTELLIGENCE
                </div>
              </div>

              <div className="col-12 col-lg-5">
                <div className="row g-2">
                  {navItems.map((item) => (
                    <div key={item} className="col-6 col-sm-4">
                      <button
                        onClick={() => scrollToSection(item.toLowerCase())}
                        className="font-mono-ui text-[10px] tracking-[0.2em] text-dim-ink transition-colors hover:text-ink"
                      >
                        {item}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-12 col-lg-3 d-flex gap-2 justify-content-lg-end">
                {[
                  { href: contactInfo.linkedin, label: 'LinkedIn profile', icon: <Linkedin className="h-4 w-4" />, external: true },
                  { href: contactInfo.github, label: 'GitHub profile', icon: <Github className="h-4 w-4" />, external: true },
                  { href: `mailto:${contactInfo.email}`, label: 'Send an email', icon: <Mail className="h-4 w-4" />, external: false },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    aria-label={link.label}
                    {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="grid h-11 w-11 place-items-center rounded-full border border-edge bg-fill-1 text-muted-ink transition-colors hover:border-edge-3 hover:text-ink"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-11 border-t border-edge pt-6 text-center">
              <span className="font-mono-ui text-[10px] tracking-[0.22em] text-dim-ink">
                © {new Date().getFullYear()} {profile.name}
              </span>
            </div>
          </div>
        </footer>
      </main>

      {selectedCertificate !== null && (
        <CertificateModal
          index={selectedCertificate}
          closing={certExit.closing}
          onClose={() => certExit.dismiss(() => setSelectedCertificate(null))}
        />
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  return (
    <article className="bezel bezel-hover group">
      <div className="bezel__core">
      <div className="relative overflow-hidden border-b border-edge" style={{ aspectRatio: '16 / 10' }}>
        {project.details?.screenshots && project.details.screenshots.length > 0 ? (
          <img
            src={project.details.screenshots[0]}
            alt={`${project.title} preview`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.06]"
          />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(70%_70%_at_50%_30%,rgb(77_141_255/0.25),transparent)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
        <div className="absolute inset-x-4 bottom-4 d-flex align-items-center justify-content-between gap-2">
          <span className="chip chip-mono">{project.category}</span>
          <span className="font-mono-ui text-[10px] tracking-[0.24em] text-muted-ink">{project.year}</span>
        </div>
      </div>

      <div className="d-flex flex-column flex-grow-1 p-4 p-md-5">
        <h3 className="display display-md">{project.title}</h3>
        <p className="body-text mt-3" style={{ fontSize: '0.9375rem' }}>{project.description}</p>

        <dl className="mt-4 d-flex flex-column gap-2">
          <div className="d-flex gap-2">
            <dt className="font-mono-ui shrink-0 text-[10px] tracking-[0.2em] text-dim-ink" style={{ paddingTop: '0.2rem' }}>
              ROLE
            </dt>
            <dd className="body-text mb-0" style={{ fontSize: '0.875rem' }}>{project.role}</dd>
          </div>
          <div className="d-flex gap-2">
            <dt className="font-mono-ui shrink-0 text-[10px] tracking-[0.2em] text-dim-ink" style={{ paddingTop: '0.2rem' }}>
              TECH
            </dt>
            <dd className="body-text mb-0" style={{ fontSize: '0.875rem' }}>{project.technologies.join(' • ')}</dd>
          </div>
        </dl>

        <div className="pill-row mt-4">
          {project.technologies.slice(0, 3).map((tech) => (
            <span key={tech} className="chip">
              {tech}
            </span>
          ))}
        </div>

        <div className="d-flex gap-2 mt-auto" style={{ paddingTop: '1.5rem' }}>
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="btn-glass flex-grow-1">
              VIEW PROJECT
              <span className="btn__icon">
                <ExternalLink className="h-3.5 w-3.5" />
              </span>
              <span className="sr-only"> — {project.title} (opens in a new tab)</span>
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} source on GitHub`}
              className="btn-glass btn--plain"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
      </div>
    </article>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
  external = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="glass glass-hover d-flex align-items-center gap-3 h-100 p-4"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-edge-2 bg-fill-2 text-signal">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="font-mono-ui block text-[10px] tracking-[0.24em] text-dim-ink">{label}</span>
        <span className="mt-1 block truncate text-[15px] font-medium text-ink">{value}</span>
      </span>
      <ArrowUpRight className="ms-auto h-4 w-4 shrink-0 text-dim-ink" />
    </a>
  );
}

function CertificateModal({
  index,
  closing,
  onClose,
}: {
  index: number;
  closing: boolean;
  onClose: () => void;
}) {
  const certificate = certificates[index];

  // Close on Escape, and lock background scroll while the dialog is open.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  if (!certificate) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="certificate-modal-title"
      onClick={onClose}
      data-closing={closing}
      className="overlay-anim fixed inset-0 z-[100] overflow-y-auto bg-[rgb(var(--deep)/0.92)] p-4 backdrop-blur-xl"
    >
      <div className="container d-flex align-items-center" style={{ minHeight: '100%' }}>
        <div
          onClick={(event) => event.stopPropagation()}
          className="glass panel-anim mx-auto my-5 w-100 p-4 p-md-5"
          style={{ maxWidth: '52rem', borderRadius: '2rem' }}
        >
          <div className="d-flex justify-content-between align-items-start gap-3 mb-4">
            <div>
              <div className="font-mono-ui text-[10px] tracking-[0.28em] text-signal">CERTIFICATE</div>
              <h3 id="certificate-modal-title" className="display display-md mt-3">
                {certificate.title || 'Certificate'}
              </h3>
            </div>
            <button
              onClick={onClose}
              data-sound="close"
              aria-label="Close certificate"
              autoFocus
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-edge-2 bg-fill-2 text-ink transition-colors hover:bg-fill-3"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-edge bg-veil p-4">
            {certificate.image ? (
              <img
                src={certificate.image}
                alt={`${certificate.title} certificate`}
                className="mx-auto w-100 object-contain"
                style={{ maxHeight: '60vh' }}
              />
            ) : (
              <div className="font-mono-ui grid place-items-center rounded-xl border border-dashed border-edge-3 p-5 text-center text-[10px] tracking-[0.24em] text-dim-ink">
                {certificate.title || 'Certificate'}
              </div>
            )}
          </div>

          <div className="row g-3 mt-3">
            {[
              { label: 'Issuer', value: certificate.issuer || 'Unavailable' },
              { label: 'Date', value: certificate.date || 'Unavailable' },
              { label: 'Credential ID', value: certificate.credentialId || 'Unavailable' },
              { label: 'Verification', value: certificate.verificationUrl ? 'Available' : 'Not provided' },
            ].map((row) => (
              <div key={row.label} className="col-12 col-sm-6">
                <div className="rounded-2xl border border-edge bg-fill-1 p-3">
                  <div className="font-mono-ui text-[9px] tracking-[0.22em] text-dim-ink">
                    {row.label.toUpperCase()}
                  </div>
                  <div className="mt-2 text-sm text-ink">{row.value}</div>
                </div>
              </div>
            ))}
          </div>

          {certificate.verificationUrl && (
            <a
              href={certificate.verificationUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-quiet mt-4"
            >
              VERIFY CERTIFICATE <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
