'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  Briefcase,
  Building2,
  Check,
  ChevronRight,
  ExternalLink,
  Github,
  GraduationCap,
  Globe,
  Mail,
  MapPin,
  Menu,
  MessageSquareText,
  Moon,
  Network,
  Target,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
  publicSpeaking,
  skillGroups,
  timeline,
} from '../data/portfolio';
import { R2XGallery } from './r2x-gallery';

const filterOptions = ['ALL', 'AI', 'WEB DEVELOPMENT', 'DATABASE', 'HCI / UX', 'SOFTWARE', 'OTHER'] as const;

export function PortfolioPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<(typeof filterOptions)[number]>('ALL');
  const [activeSection, setActiveSection] = useState('HOME');
  const [selectedCertificate, setSelectedCertificate] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    const sectionIds = navItems.map((item) => item.toLowerCase());
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          const targetId = visible.target.id.toUpperCase();
          if (targetId === 'HOME') setActiveSection('HOME');
          else if (targetId === 'ABOUT') setActiveSection('ABOUT');
          else if (targetId === 'PROJECTS') setActiveSection('PROJECTS');
          else if (targetId === 'EXPERIENCE') setActiveSection('EXPERIENCE');
          else if (targetId === 'LEADERSHIP') setActiveSection('LEADERSHIP');
          else if (targetId === 'ACHIEVEMENTS') setActiveSection('ACHIEVEMENTS');
          else if (targetId === 'CERTIFICATES') setActiveSection('CERTIFICATES');
          else if (targetId === 'ORGANIZATIONS') setActiveSection('ORGANIZATIONS');
          else if (targetId === 'SKILLS') setActiveSection('SKILLS');
          else if (targetId === 'CONTACT') setActiveSection('CONTACT');
        }
      },
      { threshold: 0.3 },
    );

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'ALL') return projects;
    return projects.filter((project) => project.category === activeFilter);
  }, [activeFilter]);

  const latestProject = projects[0];
  const latestAchievement = achievements[0];
  const latestCertificate = certificates[0];

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id.toLowerCase());
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileNavOpen(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#050b14] text-slate-100">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),transparent_35%),radial-gradient(circle_at_bottom,_rgba(239,68,68,0.08),transparent_30%)]" />
        <div className="stars" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050b14]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-3 text-left"
          >
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-cyan-400/40 bg-[#0d2345] shadow-[0_0_24px_rgba(34,211,238,0.2)]">
              <img src="/Lovett_logo-removebg-preview.png" alt="Reggie Portfolio logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-slate-400">RL // DAToh</div>
              <div className="text-sm font-semibold text-white">Reggie Portfolio</div>
            </div>
          </button>

          <nav className="hidden items-center gap-6 lg:flex">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className={`text-[11px] font-medium uppercase tracking-[0.2em] transition-colors ${
                  activeSection === item ? 'text-cyan-300' : 'text-slate-300 hover:text-white'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Button
              variant="outline"
              className="border-cyan-400/40 bg-cyan-400/5 text-cyan-200 hover:bg-cyan-400/10"
              onClick={() => scrollToSection('projects')}
            >
              EXPLORE MY WORK
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle color theme"
            >
              {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle color theme"
            >
              {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open menu"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
            >
              {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileNavOpen && (
          <div className="border-t border-white/10 bg-[#050b14] lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className={`rounded-md px-3 py-2 text-left text-[11px] font-medium uppercase tracking-[0.2em] ${
                    activeSection === item ? 'bg-cyan-400/10 text-cyan-300' : 'text-slate-300'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <main>
        <section id="home" className="relative overflow-hidden border-b border-white/10">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.35fr_0.95fr] lg:px-8 lg:py-24">
            <div className="relative z-10">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/5 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.3em] text-cyan-200">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                MISSION CONTROL // ONLINE
              </div>

              <h1 className="max-w-4xl text-4xl font-black leading-[0.96] tracking-[-0.06em] text-white sm:text-5xl md:text-6xl lg:text-7xl">
                REGGIE LOVETT
                <span className="mt-3 block bg-gradient-to-r from-slate-200 via-cyan-200 to-sky-400 bg-clip-text text-transparent">
                  BSIT // ARTIFICIAL INTELLIGENCE
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-xl font-medium uppercase tracking-[0.18em] text-cyan-300">
                {profile.tagline}
              </p>

              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300">
                {profile.bio}
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_30px_rgba(59,130,246,0.35)] hover:opacity-95"
                  onClick={() => scrollToSection('projects')}
                >
                  EXPLORE MY PROJECTS
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/15 bg-white/5 text-white hover:bg-white/10"
                  onClick={() => scrollToSection('about')}
                >
                  ABOUT ME
                </Button>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="relative h-[420px] w-full max-w-[540px] overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.95),rgba(8,47,73,0.85),rgba(2,6,23,0.98))] shadow-[0_0_80px_rgba(14,165,233,0.12)]">
                <div className="orbital-grid" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.25),transparent_38%)]" />
                <div className="absolute left-8 top-8 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-cyan-200">
                  SIGNAL // ACTIVE
                </div>

                <div className="absolute bottom-10 left-8 right-8 rounded-2xl border border-white/10 bg-slate-950/70 p-4 backdrop-blur-sm">
                  <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-slate-400">
                    <span>CORE SYSTEM</span>
                    <span className="text-emerald-400">ONLINE</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">AI</div>
                      <div className="mt-1 text-lg font-bold text-white">R&D</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">BUILD</div>
                      <div className="mt-1 text-lg font-bold text-white">CODE</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">LEAD</div>
                      <div className="mt-1 text-lg font-bold text-white">TEAM</div>
                    </div>
                  </div>
                </div>

                <div className="absolute right-8 top-16 h-40 w-40 rounded-full border border-cyan-400/30 bg-cyan-400/5 shadow-[0_0_40px_rgba(34,211,238,0.2)]" />
                <div className="absolute right-20 top-24 h-20 w-20 rounded-full border border-white/20 bg-slate-950/60" />
                <div className="absolute left-20 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full border border-red-500/20 bg-red-500/5" />
              </div>
            </div>
          </div>
        </section>

        <R2XGallery />

        <section className="border-b border-white/10 bg-slate-950/40">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 lg:grid-cols-6 lg:px-8">
            <MissionStat label="STATUS" value={missionLabels.status} accent="text-emerald-400" />
            <MissionStat label="EDUCATION" value={missionLabels.education} accent="text-cyan-300" />
            <MissionStat label="SPECIALIZATION" value={missionLabels.specialization} accent="text-sky-300" />
            <MissionStat label="INSTITUTION" value={missionLabels.institution} accent="text-slate-200" />
            <MissionStat label="FOCUS" value={missionLabels.focus} accent="text-cyan-200" />
            <MissionStat label="MISSION" value={missionLabels.mission} accent="text-red-300" />
          </div>
        </section>

        <section id="about" className="relative border-b border-white/10 py-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div className="flex items-center justify-center">
              <div className="relative h-[420px] w-full overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,1),rgba(10,17,34,1))]">
                <img src="/new profile.jpg" alt="Reggie Lovett portrait" className="h-full w-full object-cover opacity-90 grayscale" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-cyan-400/20 bg-slate-950/70 p-4 backdrop-blur-sm">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-cyan-300">PROFILE // RL</div>
                  <div className="mt-2 text-lg font-semibold text-white">{profile.name}</div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-medium uppercase tracking-[0.3em] text-cyan-300">ABOUT THE MISSION</div>
              <h2 className="mt-6 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl">
                BUILDING TECHNOLOGY WITH PURPOSE.
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-300">
                My name is <span className="font-semibold text-white">Reggie Lovett</span>. I am a {profile.year} Bachelor of Science in Information Technology student majoring in {profile.major} at {profile.school}.
              </p>

              <p className="mt-4 text-base leading-7 text-slate-300">
                I am interested in Artificial Intelligence, software development, web development, technology, project development, leadership, and project management. I enjoy turning ideas into practical digital solutions and continuously developing both my technical and professional skills.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <InfoChip label="Current Year" value={profile.year} />
                <InfoChip label="Major" value={profile.major} />
                <InfoChip label="School" value={profile.school} />
                <InfoChip label="Degree" value={profile.degree} />
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="border-b border-white/10 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-[0.3em] text-cyan-300">MISSIONS</div>
                <h2 className="mt-3 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl">
                  SELECTED TECHNOLOGY PROJECTS.
                </h2>
              </div>
              <p className="max-w-xl text-slate-300">Explore the technology concepts, digital ideas, and system-focused work driving my growth as a future technology professional.</p>
            </div>

            <div className="mb-8 flex flex-wrap gap-3">
              {filterOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setActiveFilter(option)}
                  className={`rounded-full border px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] transition-all ${
                    activeFilter === option
                      ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-200'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/40 hover:text-white'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.title} project={project} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-[#0a1220] py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-3">
              <MissionDashCard label="CURRENT FOCUS" value="Artificial Intelligence" />
              <MissionDashCard label="LATEST PROJECT" value={latestProject.title} />
              <MissionDashCard label="LATEST ACHIEVEMENT" value={latestAchievement.title || '[ADD INFORMATION]'} />
            </div>
          </div>
        </section>

        <section id="experience" className="border-b border-white/10 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <div className="text-[11px] font-medium uppercase tracking-[0.3em] text-cyan-300">FIELD OPERATIONS</div>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl">PROFESSIONAL EXPERIENCE.</h2>
            </div>

            <div className="space-y-6">
              {experience.map((item) => (
                <Card key={item.title} className="border-white/10 bg-white/5">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.25em] text-cyan-300">{item.type}</div>
                        <h3 className="mt-3 text-2xl font-bold text-white">{item.title}</h3>
                        <div className="mt-2 text-sm text-slate-300">{item.organization}</div>
                      </div>
                      <Badge className="w-fit border-cyan-400/30 bg-cyan-400/10 text-cyan-200">{item.date || '[ADD INFORMATION]'}</Badge>
                    </div>
                    <p className="mt-6 max-w-3xl text-base leading-7 text-slate-300">{item.description}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {item.highlights.map((highlight) => (
                        <span key={highlight} className="rounded-full border border-white/10 bg-slate-900/60 px-3 py-1 text-xs uppercase tracking-[0.12em] text-slate-300">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="leadership" className="border-b border-white/10 bg-[#0b1421] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <div className="text-[11px] font-medium uppercase tracking-[0.3em] text-cyan-300">LEADERSHIP & REPRESENTATION</div>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl">LEADING WITH IMPACT.</h2>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {leadership.map((item) => (
                <Card key={item.organization} className="border-white/10 bg-white/5">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.25em] text-cyan-300">{item.position}</div>
                        <h3 className="mt-2 text-2xl font-bold text-white">{item.organization}</h3>
                        {item.chapter && <p className="mt-2 text-sm text-slate-300">{item.chapter}</p>}
                        {item.school && <p className="mt-1 text-sm text-slate-300">{item.school}</p>}
                      </div>
                      <div className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-cyan-200">
                        {item.year || '[ADD INFORMATION]'}
                      </div>
                    </div>

                    <p className="mt-6 text-base leading-7 text-slate-300">{item.description}</p>

                    <div className="mt-6">
                      <div className="mb-3 text-[10px] uppercase tracking-[0.25em] text-slate-400">KEY AREAS</div>
                      <div className="flex flex-wrap gap-2">
                        {item.skills.map((skill) => (
                          <span key={skill} className="rounded-full border border-white/10 bg-slate-900 px-3 py-1 text-xs uppercase tracking-[0.08em] text-slate-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="achievements" className="border-b border-white/10 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <div className="text-[11px] font-medium uppercase tracking-[0.3em] text-cyan-300">MISSION ACHIEVEMENTS</div>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl">GROWTH THROUGH EXPERIENCE.</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {achievements.map((achievement) => (
                <Card key={`${achievement.title}-${achievement.date}`} className="border-white/10 bg-white/5">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <Badge className="border-cyan-400/30 bg-cyan-400/10 text-cyan-200">{achievement.category}</Badge>
                      <Award className="h-5 w-5 text-cyan-300" />
                    </div>
                    <h3 className="mt-4 text-xl font-bold text-white">{achievement.title || '[ADD INFORMATION]'}</h3>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-slate-300">
                    <div>{achievement.organization || '[ADD INFORMATION]'}</div>
                    <div className="text-slate-200">{achievement.date || '[ADD INFORMATION]'}</div>
                    <p className="leading-6 text-slate-300">{achievement.description || '[ADD INFORMATION]'}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="certificates" className="border-b border-white/10 bg-[#0b1320] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <div className="text-[11px] font-medium uppercase tracking-[0.3em] text-cyan-300">CERTIFICATIONS</div>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl">VERIFIED LEARNING.</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {certificates.map((certificate, index) => (
                <Card key={`${certificate.title}-${index}`} className="group overflow-hidden border-white/10 bg-white/5">
                  <div className="h-48 border-b border-white/10 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.2),transparent_40%),linear-gradient(135deg,#0f172a,#0a1320)] p-6">
                    <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-cyan-300/30 bg-slate-900/50 text-center text-xs uppercase tracking-[0.25em] text-cyan-200">
                      {certificate.title || '[ADD INFORMATION]'}
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{certificate.issuer || '[ADD INFORMATION]'}</div>
                    <h3 className="mt-3 text-xl font-bold text-white">{certificate.title || '[ADD INFORMATION]'}</h3>
                    <div className="mt-3 text-sm text-slate-300">{certificate.date || '[ADD INFORMATION]'}</div>
                    <div className="mt-3 text-xs uppercase tracking-[0.16em] text-slate-400">{certificate.credentialId || '[ADD INFORMATION]'}</div>
                    <Button
                      variant="outline"
                      className="mt-5 w-full border-cyan-400/30 bg-cyan-400/5 text-cyan-200 hover:bg-cyan-400/10"
                      onClick={() => setSelectedCertificate(index)}
                    >
                      VIEW CERTIFICATE
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="organizations" className="border-b border-white/10 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <div className="text-[11px] font-medium uppercase tracking-[0.3em] text-cyan-300">ORGANIZATIONS & COMMUNITY</div>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl">PART OF THE COMMUNITY.</h2>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {organizations.map((organization) => (
                <Card key={organization.name} className="border-white/10 bg-white/5">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-300">{organization.type}</div>
                        <h3 className="mt-3 text-2xl font-bold text-white">{organization.name}</h3>
                        {organization.chapter && <div className="mt-2 text-sm text-slate-300">{organization.chapter}</div>}
                      </div>
                      <div className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-slate-200">
                        {organization.position}
                      </div>
                    </div>
                    <p className="mt-6 text-base leading-7 text-slate-300">{organization.description}</p>
                    <div className="mt-6 text-sm uppercase tracking-[0.18em] text-slate-400">{organization.year || '[ADD INFORMATION]'}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="skills" className="border-b border-white/10 bg-[#0a1220] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <div className="text-[11px] font-medium uppercase tracking-[0.3em] text-cyan-300">TECHNICAL SYSTEMS</div>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl">TOOLS, SKILLS, & SYSTEMS.</h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {skillGroups.map((group) => (
                <Card key={group.label} className="border-white/10 bg-white/5">
                  <CardContent className="p-6">
                    <div className={`mb-5 inline-flex rounded-full bg-gradient-to-r ${group.accent} px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white`}>
                      {group.label}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.skills.map((skill) => (
                        <span key={skill} className="rounded-full border border-white/10 bg-slate-900 px-3 py-1 text-xs uppercase tracking-[0.08em] text-slate-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-[0.3em] text-cyan-300">CONTACT MISSION CONTROL</div>
                <h2 className="mt-3 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl">LET'S BUILD WHAT'S NEXT.</h2>
                <p className="mt-6 max-w-xl text-base leading-7 text-slate-300">
                  I’m open to collaboration, internships, project opportunities, and conversations around AI, software development, and technology leadership.
                </p>

                <div className="mt-8 space-y-4">
                  <ContactRow icon={<Mail className="h-5 w-5 text-cyan-300" />} label="Email" value={contactInfo.email} href={`mailto:${contactInfo.email}`} />
                  <ContactRow icon={<Github className="h-5 w-5 text-cyan-300" />} label="GitHub" value={contactInfo.github} href={contactInfo.github === 'YOUR_GITHUB' ? '#' : contactInfo.github} />
                  <ContactRow icon={<Briefcase className="h-5 w-5 text-cyan-300" />} label="LinkedIn" value={contactInfo.linkedin} href={contactInfo.linkedin === 'YOUR_LINKEDIN' ? '#' : contactInfo.linkedin} />
                  <a
                    href="https://youtu.be/wxX6j3y0vaM?si=Q0siCI3kp430fLqf"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4 transition-colors hover:border-cyan-400/30 hover:bg-slate-950/90"
                  >
                    <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-cyan-400/30 bg-cyan-400/10">
                      <img src="/superman.jpg" alt="Hope Core" className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Hope Core</div>
                      <div className="mt-1 text-base font-medium text-white">Watch / Visit</div>
                    </div>
                  </a>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.9),rgba(2,6,23,0.98))] p-6 md:p-8">
                <div className="mb-6 text-[10px] uppercase tracking-[0.25em] text-cyan-300">MISSION STATUS</div>
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Current Focus</div>
                    <div className="mt-2 text-xl font-bold text-white">Artificial Intelligence</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Current Leadership</div>
                    <div className="mt-2 text-xl font-bold text-white">JPCS SPUP Chapter • Treasurer</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Current Student Role</div>
                    <div className="mt-2 text-xl font-bold text-white">PSG • Senator</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 bg-[#060d18] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-[0.3em] text-cyan-300">BEYOND THE CODE</div>
                <h2 className="mt-3 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl">TECHNOLOGY IS ONLY PART OF THE MISSION.</h2>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {beyondTheCode.map((item) => (
                <div key={item.id} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-cyan-300">{item.id}</div>
                  <h3 className="mt-4 text-xl font-bold text-white">{item.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-slate-300">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 bg-[#050b14] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <div className="text-[11px] font-medium uppercase tracking-[0.3em] text-cyan-300">EDUCATION</div>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl">ACADEMIC FOUNDATION.</h2>
            </div>

            <Card className="border-white/10 bg-white/5">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10">
                        <GraduationCap className="h-5 w-5 text-cyan-300" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{education.school}</div>
                        <h3 className="text-2xl font-bold text-white">{education.degree}</h3>
                      </div>
                    </div>
                    <div className="mt-4 text-base text-slate-300">Major: {education.major}</div>
                    <div className="mt-2 text-base text-slate-300">Year: {education.year}</div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm uppercase tracking-[0.15em] text-cyan-200">
                    {education.expectedGraduation || '[ADD INFORMATION]'}
                  </div>
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  <div>
                    <div className="mb-3 text-[10px] uppercase tracking-[0.2em] text-slate-400">Relevant Coursework</div>
                    <div className="flex flex-wrap gap-2">
                      {education.relevantCoursework.map((course) => (
                        <span key={course} className="rounded-full border border-white/10 bg-slate-900 px-3 py-1 text-xs uppercase tracking-[0.08em] text-slate-200">
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="mb-3 text-[10px] uppercase tracking-[0.2em] text-slate-400">Academic Achievements</div>
                    <div className="space-y-3 text-sm text-slate-300">
                      {education.achievements.map((item) => (
                        <div key={item} className="flex items-start gap-2">
                          <Check className="mt-1 h-4 w-4 text-cyan-300" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="border-t border-white/10 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <div className="text-[11px] font-medium uppercase tracking-[0.3em] text-cyan-300">MISSION TIMELINE</div>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl">THE JOURNEY SO FAR.</h2>
            </div>

            <div className="relative">
              <div className="absolute left-5 top-0 h-full w-px bg-white/10 md:left-1/2" />
              <div className="space-y-8">
                {timeline.map((item, index) => (
                  <div key={`${item.title}-${index}`} className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                    <div className="absolute left-2.5 top-5 h-5 w-5 rounded-full border-4 border-[#050b14] bg-cyan-400 md:left-1/2 md:-translate-x-1/2" />
                    <div className={`md:w-[calc(50%-2rem)] ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                      <Card className="border-white/10 bg-white/5">
                        <CardContent className="p-5">
                          <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-300">{item.year || '[ADD INFORMATION]'}</div>
                          <h3 className="mt-2 text-xl font-bold text-white">{item.title}</h3>
                          <div className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">{item.category}</div>
                          <p className="mt-3 text-sm leading-6 text-slate-300">{item.description || '[ADD INFORMATION]'}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/10 bg-[#050b14] py-12">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-cyan-300">RL // DAToh</div>
              <div className="mt-2 text-2xl font-bold text-white">REGGIE LOVETT</div>
              <div className="mt-2 text-sm uppercase tracking-[0.18em] text-slate-400">BSIT • ARTIFICIAL INTELLIGENCE</div>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
              {navItems.map((item) => (
                <button key={item} onClick={() => scrollToSection(item.toLowerCase())} className="hover:text-white">{item}</button>
              ))}
            </div>
            <div className="flex items-center gap-4 text-slate-300">
              <a href={contactInfo.linkedin === 'YOUR_LINKEDIN' ? '#' : contactInfo.linkedin} className="hover:text-white"><Globe className="h-5 w-5" /></a>
              <a href={contactInfo.github === 'YOUR_GITHUB' ? '#' : contactInfo.github} className="hover:text-white"><Github className="h-5 w-5" /></a>
              <a href={`mailto:${contactInfo.email}`} className="hover:text-white"><Mail className="h-5 w-5" /></a>
            </div>
          </div>
          <div className="mx-auto mt-8 max-w-7xl px-4 text-center text-sm text-slate-400 sm:px-6 lg:px-8">© 2026 Reggie Lovett</div>
        </footer>
      </main>

      {selectedCertificate !== null && certificateModal(selectedCertificate, setSelectedCertificate)}
    </div>
  );
}

function MissionStat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-[10px] uppercase tracking-[0.25em] text-slate-400">{label}</div>
      <div className={`mt-2 text-sm font-medium ${accent}`}>{value}</div>
    </div>
  );
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4">
      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{label}</div>
      <div className="mt-2 text-sm font-medium text-white">{value}</div>
    </div>
  );
}

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_0_30px_rgba(15,23,42,0.35)] transition-transform duration-300 hover:-translate-y-1 hover:border-cyan-400/40">
      <div className="relative h-56 overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),transparent_30%),linear-gradient(135deg,#0f172a,#0b1120,#111827)] p-5">
        {project.details?.screenshots && project.details.screenshots.length > 0 ? (
          <img
            src={project.details.screenshots[0]}
            alt={`${project.title} preview`}
            className="absolute inset-0 h-full w-full object-cover opacity-90"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.25),transparent_34%)]" />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.25),transparent_34%)]" />
        <div className="relative z-10 flex h-full items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-cyan-300">{project.category}</div>
            <div className="mt-3 text-[10px] uppercase tracking-[0.2em] text-slate-400">{project.year}</div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
            <Target className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-white">{project.title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-300">{project.description}</p>

        <div className="mt-4 space-y-2 text-sm text-slate-300">
          <div><span className="text-slate-400">ROLE:</span> {project.role}</div>
          <div><span className="text-slate-400">TECH:</span> {project.technologies.join(' • ')}</div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.technologies.slice(0, 3).map((tech) => (
            <span key={tech} className="rounded-full border border-white/10 bg-slate-900/80 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-slate-200">
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-cyan-400/30 bg-cyan-400/5 text-cyan-200 hover:bg-cyan-400/10"
            onClick={() => {
              if (project.demo) {
                window.open(project.demo, '_blank');
              }
            }}
          >
            VIEW PROJECT
          </Button>
          <Button variant="ghost" className="border-white/10 bg-white/5 text-slate-200 hover:bg-white/10" asChild>
            <a href={project.github || '#'} target="_blank" rel="noreferrer">
              <Github className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}

function ContactRow({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href: string }) {
  return (
    <a href={href} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4 transition-colors hover:border-cyan-400/30 hover:bg-slate-950/90">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10">{icon}</div>
      <div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{label}</div>
        <div className="mt-1 text-base font-medium text-white">{value}</div>
      </div>
    </a>
  );
}

function MissionDashCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d1728] p-5">
      <div className="text-[10px] uppercase tracking-[0.25em] text-slate-400">{label}</div>
      <div className="mt-3 text-lg font-semibold text-white">{value}</div>
    </div>
  );
}

function certificateModal(index: number, setSelectedCertificate: (value: number | null) => void) {
  const certificate = certificates[index];
  if (!certificate) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-[28px] border border-white/10 bg-[#07111f] p-6 shadow-[0_0_80px_rgba(14,165,233,0.12)]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-cyan-300">CERTIFICATE</div>
            <h3 className="mt-2 text-3xl font-bold text-white">{certificate.title || '[ADD INFORMATION]'}</h3>
          </div>
          <button onClick={() => setSelectedCertificate(null)} className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-200 hover:bg-white/10">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="rounded-[12px] overflow-hidden border border-white/10 bg-white/5 p-4">
          {certificate.image ? (
            <div className="relative h-64 w-full">
              <img src={certificate.image} alt={certificate.title || 'certificate'} className="h-full w-full object-contain" />
            </div>
          ) : (
            <div className="rounded-[24px] border border-dashed border-cyan-400/30 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.15),transparent_30%),linear-gradient(135deg,#0f172a,#0a1320)] p-8 text-center text-xs uppercase tracking-[0.25em] text-cyan-200">
              {certificate.title || '[ADD INFORMATION]'}
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 text-sm text-slate-300">
          <div><span className="text-slate-400">Issuer:</span> {certificate.issuer || '[ADD INFORMATION]'}</div>
          <div><span className="text-slate-400">Date:</span> {certificate.date || '[ADD INFORMATION]'}</div>
          <div><span className="text-slate-400">Credential ID:</span> {certificate.credentialId || '[ADD INFORMATION]'}</div>
          <div><span className="text-slate-400">Verification:</span> {certificate.verificationUrl ? 'Available' : '[ADD INFORMATION]'}</div>
        </div>

        {certificate.verificationUrl && (
          <div className="mt-6">
            <a href={certificate.verificationUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-cyan-200">
              VERIFY CERTIFICATE <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
