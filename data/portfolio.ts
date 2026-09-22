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

/**
 * Credentials.
 *
 * Every entry carries an explicit `category`. Keyword-sniffing the title to
 * guess a category looks clever and then quietly files something under the
 * wrong tab the first time a name does not contain the expected word — the
 * data is the right place to be certain.
 */
/**
 * Credentials — one list.
 *
 * Badges and paper certificates used to live in two arrays rendered by two
 * components in two places, which meant the reader met the same idea twice and
 * had to work out how the halves related. They are one thing: evidence, sorted
 * by what it evidences. `kind` is the only difference that survives, and it
 * exists so a card can show the right artwork and say whether the claim can be
 * checked by a stranger.
 *
 * Ordering inside a category is deliberate: verifiable badges first, then the
 * scanned records. The strongest evidence leads.
 */
export type CredentialCategory = 'Technical' | 'Leadership' | 'Seminars';

export const credentialCategories = [
  'Technical',
  'Leadership',
  'Seminars',
] as const satisfies readonly CredentialCategory[];

export type CredentialKind = 'Badge' | 'Certificate';

export type Credential = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  category: CredentialCategory;
  kind: CredentialKind;
  /** Artwork. Empty when there is no scan or badge image on file. */
  image: string;
  /** A public record anyone can check. Empty when the credential has none. */
  verifyUrl: string;
  /** One factual line on what the credential covers, taken from the document. */
  summary?: string;
  /** The number printed on the certificate itself, shown in the viewer. */
  credentialNo?: string;
  /** Leads the homepage preview regardless of verifiability. */
  featured?: boolean;
};

const credly = (id: string) => `https://www.credly.com/badges/${id}`;

export const credentials: Credential[] = [
  // ---- Technical ----------------------------------------------------------
  {
    id: 'asean-ai-career-readiness-2026',
    title: 'AI Career Readiness Training',
    issuer: 'ASEAN Foundation',
    date: 'September 17, 2026',
    category: 'Technical',
    kind: 'Certificate',
    image: '/certs/asean-ai-career-readiness.png',
    verifyUrl: '',
    summary: 'Career readiness training in AI, completed on ada.aseanfoundation.org.',
    featured: true,
  },
  {
    id: 'mapua-ai-literacy-2026',
    title: 'Introduction to AI Literacy and Responsible Use',
    issuer: 'Mapúa University with Arizona State University — CHED ACHIEVE',
    date: 'September 14, 2026',
    category: 'Technical',
    kind: 'Certificate',
    image: '/certs/mapua-ai-literacy.png',
    verifyUrl: '',
    credentialNo: '64GRL43BNKWW0',
    summary: 'Micro-credentials course on AI literacy and the responsible use of AI.',
    featured: true,
  },
  {
    id: 'tesda-azure-ai-fundamentals-2026',
    title: 'Microsoft Artificial Intelligence Course: Azure AI Fundamentals',
    issuer: 'TESDA Online Program',
    date: 'September 10, 2026',
    category: 'Technical',
    kind: 'Certificate',
    image: '/certs/tesda-azure-ai-fundamentals.png',
    verifyUrl: '',
    credentialNo: 'BAG8M9zyqH',
    summary: 'Completed the Microsoft Azure AI Fundamentals course through the TESDA Online Program.',
    featured: true,
  },
  {
    id: 'simplilearn-genai-literacy-2026',
    title: 'SkillQuest — Generative AI Literacy',
    issuer: 'Simplilearn SkillUP',
    date: 'September 12, 2026',
    category: 'Technical',
    kind: 'Certificate',
    image: '/certs/simplilearn-genai-literacy.png',
    verifyUrl: '',
    credentialNo: '67612874',
    summary: 'Passed the SkillQuest assessment in generative AI literacy.',
    featured: true,
  },
  {
    id: '2ca928e6-c77b-45ae-a358-59aade74c6af',
    title: 'Building RAG Apps Using MongoDB',
    issuer: 'MongoDB',
    date: 'September 2026',
    category: 'Technical',
    kind: 'Badge',
    image: '/badges/mongodb-rag-apps.png',
    verifyUrl: credly('2ca928e6-c77b-45ae-a358-59aade74c6af'),
    summary: 'Retrieval-augmented generation end to end — chunking, embedding, and grounding answers in real data.',
  },
  {
    id: '408df2c2-1045-42e6-b332-428955eaccff',
    title: 'Building AI-Powered Search with MongoDB Vector Search',
    issuer: 'MongoDB',
    date: 'September 2026',
    category: 'Technical',
    kind: 'Badge',
    image: '/badges/mongodb-vector-search.png',
    verifyUrl: credly('408df2c2-1045-42e6-b332-428955eaccff'),
    summary: 'Semantic search on Atlas Vector Search: embeddings, indexes, and relevance that survives real queries.',
  },
  {
    id: '92ba988c-e735-4c99-b012-44084a6b7fbe',
    title: 'Building AI Agents with MongoDB',
    issuer: 'MongoDB',
    date: 'September 2026',
    category: 'Technical',
    kind: 'Badge',
    image: '/badges/mongodb-ai-agents.png',
    verifyUrl: credly('92ba988c-e735-4c99-b012-44084a6b7fbe'),
    summary: 'Agents that plan and act — multi-step tool use with memory backed by MongoDB.',
  },
  {
    id: 'neo4j-certified-professional',
    title: 'Neo4j Certified Professional',
    issuer: 'Neo4j GraphAcademy',
    date: '2026',
    category: 'Technical',
    kind: 'Badge',
    image: '/certificates/neo4j cert.png',
    verifyUrl: 'https://graphacademy.neo4j.com/c/20aaa4fa-29ee-48fc-931a-d7c1f0d82795/',
  },
  {
    id: 'codecred-javascript',
    title: 'JavaScript Developer Certification',
    issuer: 'CodeCred',
    date: '2026',
    category: 'Technical',
    kind: 'Badge',
    image: '/certificates/codecred.png',
    verifyUrl: 'https://codecred.dev/verify/f58a57bd-7070-4f2f-8138-fca095f1b3a6',
  },
  {
    id: 'EA-2026-10WK',
    title: 'SPUP FullStack and Agentic AI Industry Project',
    issuer: 'Employability Advantage / St. Paul University Philippines',
    date: 'May 2026',
    category: 'Technical',
    kind: 'Certificate',
    image: '/certificates/eca cert.png',
    verifyUrl: '',
  },
  {
    id: 'SPUP-ITE-TECH-2025',
    title: 'Technology Skills Certificate',
    issuer: 'St. Paul University Philippines — Institute of Technology and Engineering',
    date: '2025',
    category: 'Technical',
    kind: 'Certificate',
    image: '/certificates/Reggie b. Lovett.png',
    verifyUrl: '',
  },
  {
    id: 'ITE-REG-2026',
    title: 'Regional ITE Convention',
    issuer: 'Institute of Technology and Engineering (ITE)',
    date: '2026',
    category: 'Technical',
    kind: 'Certificate',
    image: '/certificates/ite-regional-2025.png',
    verifyUrl: '',
  },

  // ---- Leadership ---------------------------------------------------------
  {
    id: 'PSCX-REG-2025-ARCHE',
    title: 'Philippine Startup Challenge X — Regional Pitching, Team Arche',
    issuer: 'DICT / PSCX',
    date: '2025',
    category: 'Leadership',
    kind: 'Certificate',
    image: '/certificates/competion participation cert.png',
    verifyUrl: '',
  },
  {
    id: 'CHED-ASYV-2025',
    title: 'Presenter, ASEAN Youth Voices',
    issuer: 'CHED / St. Paul University Philippines',
    date: 'August 2025',
    category: 'Leadership',
    kind: 'Certificate',
    image: '/certificates/public speaking cert.JPG',
    verifyUrl: '',
  },
  {
    id: 'JPCS-AY25-26',
    title: 'Junior Philippine Computer Society Membership',
    issuer: 'JPCS (National & SPUP Chapter)',
    date: 'AY 2025–2026',
    category: 'Leadership',
    kind: 'Certificate',
    image: '/certificates/jpcs member cert.png',
    verifyUrl: '',
  },

  // ---- Seminars -----------------------------------------------------------
  {
    id: 'DAVID-MHJC-2025',
    title: 'Mental Health Junior Coach',
    issuer: 'Project DAVID / Emotional Reset Center USA LLC',
    date: 'May 2025',
    category: 'Seminars',
    kind: 'Certificate',
    image: '/certificates/project david cert junior mental coach.JPEG',
    verifyUrl: '',
  },
  {
    id: 'UNESCO-NCS',
    title: 'UNESCO National Capability Seminar',
    issuer: 'UNESCO',
    date: '2026',
    category: 'Seminars',
    kind: 'Certificate',
    image: '',
    verifyUrl: '',
  },
  {
    id: 'hp-life-social-media-marketing-2026',
    title: 'Social Media Marketing',
    issuer: 'HP LIFE — HP Foundation',
    date: 'September 16, 2026',
    category: 'Seminars',
    kind: 'Certificate',
    image: '/certs/hp-life-social-media-marketing.png',
    verifyUrl: '',
    summary: 'Using advertising across social platforms, creating effective social media marketing campaigns, and building targeted social media adverts.',
    credentialNo: '838c93b4-bbf8-434f-a658-27c09cd2153e',
    featured: true,
  },
  {
    id: 'hp-life-strategic-planning-ai-age-2026',
    title: 'Strategic Planning in the AI Age',
    issuer: 'HP LIFE — HP Foundation',
    date: 'September 16, 2026',
    category: 'Seminars',
    kind: 'Certificate',
    image: '/certs/hp-life-strategic-planning-ai-age.png',
    verifyUrl: '',
    summary: 'Strategic planning for better business decisions in an AI-driven world — core plan components, practical frameworks, and AI tools that support strategic thinking.',
    credentialNo: 'caef76db-122e-448c-a5ad-d5216446cd42',
    featured: true,
  },
  {
    id: 'aws-sbg-kiro-workshop-2026',
    title: 'Learn. Build. Launch: Kiro and Amazon Quick Workshop',
    issuer: 'AWS Student Builders Club — USLT Chapter',
    date: 'September 5, 2026',
    category: 'Seminars',
    kind: 'Certificate',
    image: '/certs/aws-sbg-kiro-workshop.png',
    verifyUrl: '',
    summary: 'Certificate of appreciation for active participation in the workshop and for exploring new technologies.',
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


/**
 * Capabilities.
 *
 * Deliberately a flat list of what the work is, not a taxonomy of tools. The
 * tool names live in `tools` as supporting evidence — a client hires the
 * capability and only then asks what it was made in.
 */
export type Capability = {
  no: string;
  title: string;
  body: string;
  tools: string[];
  /** Bento column span at the lg breakpoint. Drives the composition. */
  span: 4 | 6 | 8 | 12;
};

export const capabilities: Capability[] = [
  {
    no: '01',
    title: 'Fullstack Development',
    body: 'End-to-end delivery: data model, API, interface, deploy. Ten weeks of it under industry supervision on the SPUP project.',
    tools: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PHP', 'Postgres', 'MySQL'],
    span: 6,
  },
  {
    no: '02',
    title: 'Agentic AI',
    body: 'Systems that plan and act rather than only answer — tool use, retrieval, and the evaluation loop that keeps them honest.',
    tools: ['Python', 'Prompt engineering', 'Retrieval', 'Neo4j'],
    span: 6,
  },
  {
    no: '03',
    title: 'UI / UX Design',
    body: 'Interface work from wireframe to build, with the motion and state detail that decides whether a product feels finished.',
    tools: ['Bootstrap 5', 'Uizard', 'Figma'],
    span: 4,
  },
  {
    no: '04',
    title: 'Graphic Design',
    body: 'Layout, typography, and print. Posters, decks, and campaign assets that hold their structure at any size.',
    tools: ['Layout', 'Typography', 'Print production'],
    span: 4,
  },
  {
    no: '05',
    title: 'Brand Identity',
    body: 'Marks and the systems around them: R²X and Lovett Cafe, both built to stay recognisable across every surface they land on.',
    tools: ['Logo systems', 'Art direction', 'Brand guidelines'],
    span: 6,
  },
];

/**
 * Projects & media.
 *
 * Two lists, kept apart on purpose: `projects` is the software that ships
 * (with a link the reader can open), `media` is the design and photography —
 * the pictures made along the way. Every entry is backed by a file in
 * `public/`. There are no placeholder rows: an index that lists work it
 * cannot show is a worse impression than a shorter index.
 */
export type WorkDiscipline =
  | 'Brand Identity'
  | 'Print'
  | 'Merchandise'
  | 'Photography'
  | 'Product Design'
  | 'Web';

export type WorkEntry = {
  id: string;
  index: string;
  title: string;
  client: string;
  discipline: WorkDiscipline;
  year: string;
  summary: string;
  image: string;
  alt: string;
  /** Sets the plate proportion, so the grid reads as a composition. */
  ratio: string;
  href?: string;
};

/**
 * Projects — the software builds, shipped. These lead the page.
 */
export const projects: WorkEntry[] = [
  {
    id: 'flowstate',
    index: '01',
    title: 'FlowState',
    client: 'Personal',
    discipline: 'Product Design',
    year: '2026',
    summary:
      'A multi-user scheduling app for students and working professionals. It plans study sessions around every deadline and exam, then lets you drag them into place on a week calendar.',
    image: '/flowstate-bay-zeta.vercel.app_schedule.png',
    alt: 'The FlowState week calendar with lectures, lab sessions, and deep work blocks',
    ratio: '16 / 10',
    href: 'https://flowstate-bay-zeta.vercel.app',
  },
  {
    id: 'digital-twin',
    index: '02',
    title: 'Digital Twin',
    client: 'ECA Final Project',
    discipline: 'Product Design',
    year: '2026',
    summary:
      'A team-built digital twin platform with realtime chat and Microsoft Teams integration. I led the build as project manager.',
    image: '/group-3-digital-twin.vercel.app_chat.png',
    alt: 'The Digital Twin platform chat interface',
    ratio: '16 / 10',
    href: 'https://group-3-digital-twin.vercel.app/artemis',
  },
  {
    id: 'healthcare',
    index: '03',
    title: 'Wellness & Medical Center',
    client: 'HealthCare',
    discipline: 'Product Design',
    year: '2026',
    summary:
      'A complete appointment booking system for a healthcare centre, built as a duo with Rhys Christian Suyu.',
    image: '/hosbiz.infinityfree.me__i=1.png',
    alt: 'The HealthCare Wellness and Medical Center booking interface',
    ratio: '16 / 10',
    href: 'http://hosbiz.infinityfree.me/',
  },
  {
    id: 'portfolio-2024',
    index: '04',
    title: 'Portfolio, 2nd year',
    client: 'Personal',
    discipline: 'Web',
    year: '2024',
    summary: 'The first version of this site. Kept because the distance is the point.',
    image: '/l0v3tt.site_ (2).png',
    alt: 'The 2024 version of the personal portfolio site',
    ratio: '16 / 10',
    href: 'https://l0v3tt.site',
  },
];

/**
 * Media & Design — the pictures, marks, and print made along the way.
 */
export const media: WorkEntry[] = [
  {
    id: 'r2x-mark',
    index: '01',
    title: 'Chameleon mark',
    client: 'R²X',
    discipline: 'Brand Identity',
    year: '2026',
    summary:
      'A student media collective. One shape that changes surface without changing silhouette — which is what the group does across film, photo, and print.',
    image: '/r2x/r2x-chameleon-mark.png',
    alt: 'The R²X chameleon logo mark',
    ratio: '4 / 3',
  },
  {
    id: 'r2x-poster',
    index: '02',
    title: 'Hanin',
    client: 'R²X',
    discipline: 'Print',
    year: '2026',
    summary: 'One-sheet film poster. Title, credit block, and a single image doing all the work.',
    image: '/r2x/poster_film.png',
    alt: 'Poster for the film Hanin',
    ratio: '2 / 3',
  },
  {
    id: 'r2x-tee',
    index: '03',
    title: 'Shoot. Edit. Tell.',
    client: 'R²X',
    discipline: 'Merchandise',
    year: '2026',
    summary: 'The mark and tagline applied to apparel — the identity at its least controlled scale.',
    image: '/r2x/mock up pic.png',
    alt: 'R²X t-shirt carrying the Shoot Edit Tell tagline',
    ratio: '1 / 1',
  },
  {
    id: 'r2x-airplane',
    index: '04',
    title: 'Airplane',
    client: 'R²X',
    discipline: 'Photography',
    year: '2026',
    summary: 'Composite built for a campus activity campaign.',
    image: '/r2x/ACTIVIY_R2X MEDIA.jpg',
    alt: 'Composited photograph produced for an R²X campus activity',
    ratio: '4 / 3',
  },
];
