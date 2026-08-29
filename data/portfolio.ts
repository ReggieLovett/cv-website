export type ProjectCategory =
  | 'AI'
  | 'WEB DEVELOPMENT'
  | 'DATABASE'
  | 'HCI / UX'
  | 'SOFTWARE'
  | 'OTHER';

export type AchievementCategory =
  | 'Academic'
  | 'Leadership'
  | 'Public Speaking'
  | 'Professional Development'
  | 'Industry'
  | 'Organization'
  | 'Global Exposure';

export type SkillGroup = {
  label: string;
  skills: string[];
  accent: string;
};

export type Profile = {
  name: string;
  nickname: string;
  initials: string;
  school: string;
  degree: string;
  year: string;
  major: string;
  tagline: string;
  bio: string;
  headline: string;
};

export const profile: Profile = {
  name: 'Reggie Lovett',
  nickname: 'DAToh',
  initials: 'RL',
  school: 'St. Paul University Philippines (SPUP)',
  degree: 'Bachelor of Science in Information Technology (BSIT)',
  year: '3rd Year',
  major: 'Artificial Intelligence (AI)',
  tagline: 'BUILDING TECHNOLOGY FOR WHAT COMES NEXT.',
  bio: 'I am a 3rd-year BSIT student majoring in Artificial Intelligence at St. Paul University Philippines. I build practical software projects while sharpening my strengths in AI, engineering, leadership, communication, and project coordination.',
  headline: 'BSIT • ARTIFICIAL INTELLIGENCE',
};

// Reads like a resume: who he is, what he studied, what he can do, where he has
// done it, the work itself, then affiliations, evidence, and finally contact.
export const navItems = [
  'HOME',
  'ABOUT',
  'SKILLS',
  'EXPERIENCE',
  'PROJECTS',
  'LEADERSHIP',
  'ORGANIZATIONS',
  'ACHIEVEMENTS',
  'CERTIFICATES',
  'CONTACT',
] as const;

export const contactInfo = {
  email: 'reggielovett143@gmail.com',
  linkedin: 'https://www.linkedin.com/in/reggielovett/',
  github: 'https://github.com/ReggieLovett',
};

export const projects = [
  {
    title: 'Digital Twin (ECA Final Project)',
    category: 'SOFTWARE' as const,
    year: '2026',
    description: 'A team-built digital twin platform with realtime chat and Microsoft Teams integration.',
    role: 'Project Manager',
    technologies: ['Next.js', 'React', 'Realtime Chat', 'Microsoft Teams Integration', 'WebSockets'],
    image: '',
    github: '',
    demo: 'https://group-3-digital-twin.vercel.app/artemis',
    details: {
      overview:
        'A digital twin platform developed as an ECA final project. The system mirrors real-world entities and supports realtime communication and collaboration via chat and Teams integration.',
      problem: 'Demonstrate synchronized state and collaborative tooling for simulated assets.',
      solution: 'A web-based digital twin with chat features and Microsoft Teams interoperability for team collaboration.',
      myRole: 'Project manager — coordinated the team and led integration efforts.',
      features: ['Realtime chat', 'Teams deep link integration', 'Digital twin dashboard'],
      challenges: ['Realtime synchronization', 'Integrating with Teams authentication and deep links'],
      whatILearned: 'Realtime systems, API integration patterns, and collaboration workflows.',
      screenshots: ['/group-3-digital-twin.vercel.app_chat.png'],
    },
  },
  {
    title: 'HealthCare Wellness & Medical Center',
    category: 'WEB DEVELOPMENT' as const,
    year: '2026',
    description: 'A two-person build of a complete appointment booking system for a healthcare center.',
    role: 'Duo (with Rhys Christian Suyu)',
    technologies: ['PHP', 'HTML', 'CSS', 'JavaScript', 'MySQL'],
    image: '',
    github: '',
    demo: 'http://hosbiz.infinityfree.me/',
    details: {
      overview: 'An appointment booking and management system for a healthcare and wellness center developed as a two-person project.',
      problem: 'Streamline appointment booking, patient records, and provider scheduling.',
      solution: 'End-to-end booking flow with role-based access, notifications, and calendar integration.',
      myRole: 'Duo project member — worked closely with Rhys Christian Suyu on development and testing.',
      features: ['Appointment booking', 'Provider schedules', 'Patient management', 'Notifications'],
      challenges: ['Data privacy', 'Scheduling edge-cases', 'Reliable notifications'],
      whatILearned: 'Project coordination, healthcare workflows, and production readiness considerations.',
      screenshots: ['/hosbiz.infinityfree.me__i=1.png'],
    },
  },
  {
    title: 'Old Portfolio (2nd Year)',
    category: 'WEB DEVELOPMENT' as const,
    year: '2024',
    description: 'My 2nd-year personal portfolio website.',
    role: 'Creator',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    image: '',
    github: '',
    demo: 'https://l0v3tt.site',
    details: {
      overview: 'A personal portfolio showcasing early projects and learning during my 2nd year.',
      problem: 'I needed a dedicated platform to present my projects and document my growth as a technology student.',
      solution: 'I designed and built a responsive personal portfolio that organized my work, profile, and contact information in one site.',
      myRole: 'Creator',
      features: ['Project showcase', 'Contact info', 'Simple responsive layout'],
      challenges: ['Designing a clean one-page flow', 'Writing concise project summaries', 'Making the layout mobile-friendly'],
      whatILearned: 'I learned how to structure personal branding content, improve responsive UI skills, and deploy a portfolio for public access.',
      screenshots: ['/l0v3tt.site_ (2).png'],
    },
  },
];

export const achievements = [
  {
    title: 'Academic Growth in Technology',
    date: 'AY 2025-2026',
    organization: 'St. Paul University Philippines',
    category: 'Academic' as const,
    description: 'Strengthened my foundation in software engineering, AI concepts, and hands-on system development through continuous project work.',
    image: '',
  },
  {
    title: 'Public Speaking and Presentation Growth',
    date: 'August 2025',
    organization: 'CHED / St. Paul University Philippines',
    category: 'Public Speaking' as const,
    description: 'Strengthened confidence, communication, and presentation delivery through formal speaking engagements and campus representation.',
    image: '',
  },
  {
    title: 'Student Governance and Financial Stewardship',
    date: 'AY 2025-2026',
    organization: 'PSG and JPCS - SPUP Chapter',
    category: 'Leadership' as const,
    description: 'Served as PSG Senator and JPCS Treasurer, balancing student representation with accountable organization support.',
    image: '',
  },
  {
    title: 'Industry Immersion through ECA Internship',
    date: 'March 2026 - May 2026',
    organization: 'Employability Advantage (ECA)',
    category: 'Industry' as const,
    description: 'Completed a 10-week full stack and agentic AI internship with collaborative, industry-style project execution.',
    image: '',
  },
];

export const certificates = [
  {
    title: 'Technology Skills Certificate',
    issuer: 'St. Paul University Philippines - Institute of Technology and Engineering',
    date: '2025',
    credentialId: 'SPUP-ITE-TECH-2025',
    image: '/certificates/Reggie b. Lovett.png',
    verificationUrl: '',
  },
  {
    title: 'Professional Development Certificate',
    issuer: 'DICT / Philippine Startup Challenge X',
    date: '2025',
    credentialId: 'PSCX-PART-2025',
    image: '/certificates/competion participation cert.png',
    verificationUrl: '',
  },
  {
    title: '10-Week Full Stack and Agentic AI Developer Industry Project Internship',
    issuer: 'Employability Advantage',
    date: 'May 2026',
    credentialId: 'EA-2026-10WK',
    image: '/certificates/eca cert.png',
    verificationUrl: '',
  },
  {
    title: 'Philippine Startup Challenge X (PSCX) Regional Pitching Competition - Team Arche',
    issuer: 'DICT / PSCX',
    date: '2025',
    credentialId: 'PSCX-REG-2025-ARCHE',
    image: '/certificates/competion participation cert.png',
    verificationUrl: '',
  },
  {
    title: 'Presenter, ASEAN Youth Voices',
    issuer: 'CHED / St. Paul University Philippines',
    date: 'August 2025',
    credentialId: 'CHED-ASYV-2025',
    image: '/certificates/public speaking cert.JPG',
    verificationUrl: '',
  },
  {
    title: 'Mental Health Junior Coach',
    issuer: 'Project DAVID / Emotional Reset Center USA LLC',
    date: 'May 2025',
    credentialId: 'DAVID-MHJC-2025',
    image: '/certificates/project david cert junior mental coach.JPEG',
    verificationUrl: '',
  },
  {
    title: 'Junior Philippine Computer Society (JPCS) Membership - AY 2025-2026',
    issuer: 'JPCS (National & SPUP Chapter)',
    date: 'AY 2025-2026',
    credentialId: 'JPCS-AY25-26',
    image: '/certificates/jpcs member cert.png',
    verificationUrl: '',
  },
  {
    title: 'ITE Regional Summit',
    issuer: 'Institute of Technology and Engineering (ITE)',
    date: '2026',
    credentialId: 'ITE-REG-2026',
    image: '/certificates/ite-regional-2025.png',
    verificationUrl: '',
  },
];

export const experience = [
  {
    type: 'ECA',
    title: 'Employability Advantage (ECA)',
    organization: 'St. Paul University Philippines Employability Advantage',
    date: 'March 2026 - May 2026',
    description: 'Completed a 10-week internship focused on full stack and agentic AI delivery in a production-style team setup.',
    highlights: [
      '10-week internship',
      'Full stack delivery',
      'Agentic AI project work',
      'Teamwork',
      'Communication',
      'Problem solving',
      'Professional development',
    ],
  },
  {
    type: 'Public Speaking',
    title: 'Public Speaking Engagement',
    organization: 'CHED / St. Paul University Philippines - ASEAN Youth Voices',
    date: 'August 2025',
    description: 'Presented as a student speaker in ASEAN Youth Voices, strengthening delivery, audience connection, and academic representation.',
    highlights: [
      'Public speaking',
      'Communication',
      'Presentation',
      'Confidence',
      'Academic representation',
      'Professional communication',
    ],
  },
  {
    type: 'External Exposure',
    title: 'Regional and Community Tech Exposure',
    organization: 'ITE Regional Summit and PSCX Regional Pitching',
    date: '2025 - 2026',
    description: 'Joined regional events that expanded my perspective on innovation, startup thinking, and cross-team collaboration.',
    highlights: ['Innovation mindset', 'Regional networking', 'Pitch communication', 'Collaborative learning'],
  },
];

export const leadership = [
  {
    organization: 'Paulinian Student Government (PSG)',
    school: 'St. Paul University Philippines',
    position: 'SENATOR',
    year: 'AY 2025-2026',
    description: 'Represented the student body in governance discussions and initiatives while promoting student concerns and active campus participation.',
    responsibilities: [
      'Student representation',
      'Leadership',
      'Communication',
      'Collaboration',
      'Event participation',
      'Public speaking',
      'Professional interaction',
    ],
    skills: ['Leadership', 'Communication', 'Collaboration', 'Public Speaking'],
  },
  {
    organization: 'Junior Philippine Computer Society (JPCS)',
    chapter: 'St. Paul University Philippines Chapter',
    position: 'TREASURER',
    year: 'AY 2025-2026',
    description: 'Managed organization funds, supported activity planning, and ensured transparent financial coordination for chapter operations.',
    responsibilities: [
      'Leadership',
      'Organization',
      'Accountability',
      'Financial responsibility',
      'Team collaboration',
      'Communication',
      'Event support',
      'Technology community involvement',
    ],
    skills: ['Leadership', 'Organization', 'Accountability', 'Team Collaboration'],
  },
];

export const organizations = [
  {
    name: 'Paulinian Student Government',
    type: 'Student Organization Experience',
    position: 'Senator',
    chapter: '',
    year: 'AY 2025-2026',
    description: 'Contributed to student governance through representation, policy dialogue, and campus engagement initiatives.',
  },
  {
    name: 'Junior Philippine Computer Society',
    type: 'Technology Organization',
    position: 'Treasurer',
    chapter: 'St. Paul University Philippines Chapter',
    year: 'AY 2025-2026',
    description: 'Supported the student tech community through financial stewardship, event logistics, and chapter collaboration.',
  },
];

export const skillGroups: SkillGroup[] = [
  {
    label: 'ARTIFICIAL INTELLIGENCE',
    skills: ['Artificial Intelligence', 'Machine Learning', 'Prompt Engineering'],
    accent: 'from-sky-500 to-cyan-500',
  },
  {
    label: 'PROGRAMMING',
    skills: ['Python', 'Java', 'JavaScript', 'PHP'],
    accent: 'from-blue-500 to-indigo-500',
  },
  {
    label: 'WEB DEVELOPMENT',
    skills: ['HTML', 'CSS', 'Bootstrap', 'JavaScript'],
    accent: 'from-cyan-500 to-teal-500',
  },
  {
    label: 'DATABASE',
    skills: ['MySQL', 'phpMyAdmin'],
    accent: 'from-violet-500 to-indigo-500',
  },
  {
    label: 'TOOLS',
    skills: ['Git', 'GitHub', 'XAMPP'],
    accent: 'from-red-500 to-rose-500',
  },
  {
    label: 'PROFESSIONAL',
    skills: ['Project Coordination', 'Team Collaboration', 'Communication', 'Public Speaking', 'Leadership'],
    accent: 'from-emerald-500 to-teal-500',
  },
];

export const education = {
  school: 'St. Paul University Philippines',
  degree: 'Bachelor of Science in Information Technology',
  major: 'Artificial Intelligence',
  year: '3rd Year',
  format: 'Full-time Student',
  relevantCoursework: [
    'Programming',
    'Database Systems',
    'Web Development',
    'Systems Design',
    'Technology and Innovation',
  ],
  achievements: ['Student leadership and project involvement', 'Continuous growth in software and AI practice'],
  expectedGraduation: 'Expected Graduation: 2027',
  schoolProjects: ['AI-centered software project exploration', 'Database and system-focused development'],
};

export const timeline = [
  {
    year: '2024',
    title: 'Portfolio Foundation',
    category: 'Project',
    description: 'Built and deployed my first personal portfolio during my 2nd year to document my early projects and growth.',
  },
  {
    year: '2025',
    title: 'Leadership and Representation',
    category: 'Leadership',
    description: 'Expanded my voice through student leadership and public speaking, including PSG service and ASEAN Youth Voices.',
  },
  {
    year: 'AY 2025-2026',
    title: 'Technology Organization Service',
    category: 'Organization',
    description: 'Served as JPCS Treasurer while supporting chapter operations and student-focused technology initiatives.',
  },
  {
    year: '2026',
    title: 'Industry Immersion through ECA',
    category: 'Experience',
    description: 'Completed a 10-week Employability Advantage internship and co-led software delivery for real-world outcomes.',
  },
  {
    year: '2026',
    title: 'Education',
    category: 'Education',
    description: 'Currently in 3rd-year BSIT (Artificial Intelligence) at SPUP, strengthening technical depth and leadership impact.',
  },
];

export const missionLabels = {
  status: 'ACTIVE',
  education: 'BSIT — YEAR 3',
  specialization: 'ARTIFICIAL INTELLIGENCE',
  institution: 'ST. PAUL UNIVERSITY PHILIPPINES',
  focus: 'AI • SOFTWARE • TECHNOLOGY',
  mission: 'BUILD • LEARN • LEAD',
};

export const beyondTheCode = [
  {
    id: '01',
    title: 'TECHNOLOGY',
    text: 'AI • Programming • Software • Web Development',
  },
  {
    id: '02',
    title: 'LEADERSHIP',
    text: 'PSG • JPCS • Student Representation',
  },
  {
    id: '03',
    title: 'COMMUNICATION',
    text: 'Public Speaking • Collaboration • Presentation',
  },
  {
    id: '04',
    title: 'EXPOSURE',
    text: 'ECA • Regional Competitions • Industry-style Collaboration',
  },
];

export const publicSpeaking = [
  {
    eventName: 'ASEAN Youth Voices',
    date: 'August 2025',
    role: 'Student Presenter',
    topic: 'Youth Perspective on Technology and Development',
    organization: 'CHED / St. Paul University Philippines',
    description: 'Delivered a youth-centered presentation that strengthened public communication and professional confidence.',
  },
];

export const globalExposure = [
  {
    eventProgram: 'Philippine Startup Challenge X Regional Pitching',
    date: '2025',
    location: 'Region II, Philippines',
    role: 'Team Participant (Team Arche)',
    description: 'Joined competitive regional exposure opportunities that strengthened adaptability, communication, and teamwork.',
  },
];

export const r2xGallery = [
  {
    id: 'r2x-01',
    title: 'R²X Chameleon Logo',
    category: 'Brand Identity',
    image: '/r2x/Screenshot 2026-04-23 at 7.13.29 PM.png',
    alt: 'R2X Chameleon Logo',
  },
  {
    id: 'r2x-02',
    title: 'Shoot. Edit. Tell. R²X — T-shirt Mockup',
    category: 'Merchandise',
    image: '/r2x/mock up pic.png',
    alt: 'R2X T-shirt mockup',
  },
  {
    id: 'r2x-03',
    title: 'Hanin — Film Poster',
    category: 'Print Design',
    image: '/r2x/poster_film.png',
    alt: 'Hanin Film Poster',
  },
  {
    id: 'r2x-04',
    title: 'R²X Airplane Activity',
    category: 'Photo Manipulation',
    image: '/r2x/ACTIVIY_R2X MEDIA.jpg',
    alt: 'R2X Airplane photo manipulation',
  },
];

/**
 * Skills & Technologies — the category cards rendered as logo pills.
 * `icon` keys map to the inline SVG marks in components/tech-icons.tsx.
 */
export type TechItem = { name: string; icon: string };

export type TechCategory = {
  label: string;
  caption: string;
  items: TechItem[];
};

export const techStack: TechCategory[] = [
  {
    label: 'PROGRAMMING LANGUAGES',
    caption: 'The languages I build and problem-solve in.',
    items: [
      { name: 'JavaScript', icon: 'javascript' },
      { name: 'TypeScript', icon: 'typescript' },
      { name: 'Python', icon: 'python' },
      { name: 'PHP', icon: 'php' },
      { name: 'C++', icon: 'cpp' },
    ],
  },
  {
    label: 'FRONTEND',
    caption: 'Interfaces, structure, and the layer people actually touch.',
    items: [
      { name: 'HTML', icon: 'html' },
      { name: 'CSS', icon: 'css' },
      { name: 'React', icon: 'react' },
      { name: 'Next.js', icon: 'next' },
    ],
  },
  {
    label: 'BACKEND',
    caption: 'Server-side logic and application runtimes.',
    items: [
      { name: 'Node.js', icon: 'node' },
      { name: 'PHP', icon: 'php' },
    ],
  },
  {
    label: 'DATABASE',
    caption: 'Storing, querying, and modelling data.',
    items: [
      { name: 'SQL', icon: 'sql' },
      { name: 'Postgres', icon: 'postgres' },
    ],
  },
];
