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
  bio: 'I am a 3rd-year Bachelor of Science in Information Technology student majoring in Artificial Intelligence at St. Paul University Philippines. I build technology projects while developing my skills in AI, software development, leadership, communication, and project management.',
  headline: 'BSIT • ARTIFICIAL INTELLIGENCE',
};

export const navItems = [
  'HOME',
  'ABOUT',
  'PROJECTS',
  'EXPERIENCE',
  'LEADERSHIP',
  'ACHIEVEMENTS',
  'CERTIFICATES',
  'ORGANIZATIONS',
  'SKILLS',
  'CONTACT',
] as const;

export const contactInfo = {
  email: 'reggielovett143@gmail.com',
  linkedin: '[ADD INFORMATION]',
  github: 'https://github.com/ReggieLovett',
};

export const projects = [
  {
    title: 'Digital Twin (ECA Final Project)',
    category: 'SOFTWARE' as const,
    year: '2026',
    description: 'A digital twin final project built with a team — includes chat and Microsoft Teams integration.',
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
    description: 'A duo project creating a comprehensive appointment booking system for healthcare.',
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
    description: 'My personal portfolio site built during 2nd year.',
    role: 'Creator',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    image: '',
    github: '',
    demo: 'https://l0v3tt.site',
    details: {
      overview: 'A personal portfolio showcasing early projects and learning during my 2nd year.',
      problem: '[ADD_INFORMATION]',
      solution: '[ADD_INFORMATION]',
      myRole: 'Creator',
      features: ['Project showcase', 'Contact info', 'Simple responsive layout'],
      challenges: ['[ADD_INFORMATION]'],
      whatILearned: '[ADD_INFORMATION]',
      screenshots: ['/l0v3tt.site_ (2).png'],
    },
  },
];

export const achievements = [
  {
    title: 'Academic Growth in Technology',
    date: '[ADD INFORMATION]',
    organization: 'St. Paul University Philippines',
    category: 'Academic' as const,
    description: 'Focused on building a strong foundation in information technology, AI, and practical project work.',
    image: '',
  },
  {
    title: 'Public Speaking and Presentation Growth',
    date: '[ADD INFORMATION]',
    organization: '[ADD_INFORMATION]',
    category: 'Public Speaking' as const,
    description: 'Strengthened confidence, communication, and presentation skills through professional and academic engagement.',
    image: '',
  },
];

export const certificates = [
  {
    title: 'Technology Skills Certificate',
    issuer: '[ADD INFORMATION]',
    date: '[ADD INFORMATION]',
    credentialId: '[ADD INFORMATION]',
    image: '/certificates/Reggie b. Lovett.png',
    verificationUrl: '',
  },
  {
    title: 'Professional Development Certificate',
    issuer: '[ADD INFORMATION]',
    date: '[ADD INFORMATION]',
    credentialId: '[ADD INFORMATION]',
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
    image: '/certificates/ITE-REF-20250326-48 - Certificate of Participation - Regional ITE Convention 2025-1.png',
    verificationUrl: '',
  },
];

export const experience = [
  {
    type: 'ECA',
    title: 'Employability Advantage (ECA)',
    organization: 'St. Paul University Philippines Employability Advantage',
    date: '[ADD INFORMATION]',
    description: 'I participated in the Employability Advantage program involving student internship and live industry projects, gaining exposure to industry-oriented work and opportunities to apply IT knowledge in practical settings.',
    highlights: [
      'Industry exposure',
      'Practical experience',
      'Teamwork',
      'Communication',
      'Problem solving',
      'Professional development',
      'Applying technical knowledge',
    ],
  },
  {
    type: 'Public Speaking',
    title: 'Public Speaking Engagement',
    organization: '[ADD_INFORMATION]',
    date: '[ADD_INFORMATION]',
    description: 'I participated as a public speaker for a Department of Education-related event, highlighting communication, presentation, and confidence in a professional setting.',
    highlights: [
      'Public speaking',
      'Communication',
      'Presentation',
      'Confidence',
      'Representing my school',
      'Professional communication',
    ],
  },
  {
    type: 'External Exposure',
    title: 'External Exposure',
    organization: '[ADD_INFORMATION]',
    date: '[ADD_INFORMATION]',
    description: 'Participated in external events that provided broader perspectives and professional environments.',
    highlights: ['Global perspective', 'Educational exposure', 'Professional environment', 'Learning and collaboration'],
  },
];

export const leadership = [
  {
    organization: 'Paulinian Student Government (PSG)',
    school: 'St. Paul University Philippines',
    position: 'SENATOR',
    year: '[ADD_INFORMATION]',
    description: 'Represented students while developing leadership, communication, and collaboration skills through student engagement and institutional participation.',
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
    year: '[ADD_INFORMATION]',
    description: 'Contributed to technology organization involvement with leadership, accountability, communication, and event support responsibilities.',
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
    year: '[ADD_INFORMATION]',
    description: 'Student representation and leadership experience through organizational engagement.',
  },
  {
    name: 'Junior Philippine Computer Society',
    type: 'Technology Organization',
    position: 'Treasurer',
    chapter: 'St. Paul University Philippines Chapter',
    year: '[ADD_INFORMATION]',
    description: 'Technology organization involvement focused on leadership, teamwork, and organizational support.',
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
  achievements: ['Student leadership and project involvement', 'Technology and AI learning development'],
  expectedGraduation: '[ADD_INFORMATION]',
  schoolProjects: ['AI and technology project exploration', 'Database and system-focused development'],
};

export const timeline = [
  {
    year: '[ADD_INFORMATION]',
    title: 'Education',
    category: 'Education',
    description: '[ADD_INFORMATION]',
  },
  {
    year: '[ADD_INFORMATION]',
    title: 'Project Development',
    category: 'Project',
    description: '[ADD_INFORMATION]',
  },
  {
    year: '[ADD_INFORMATION]',
    title: 'Leadership Role',
    category: 'Leadership',
    description: '[ADD_INFORMATION]',
  },
  {
    year: '[ADD_INFORMATION]',
    title: 'Technology Organization Experience',
    category: 'Organization',
    description: '[ADD_INFORMATION]',
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
    text: 'ECA • DepEd-related Event • External Exposure',
  },
];

export const publicSpeaking = [
  {
    eventName: '[ADD_INFORMATION]',
    date: '[ADD_INFORMATION]',
    role: '[ADD_INFORMATION]',
    topic: '[ADD_INFORMATION]',
    organization: '[ADD_INFORMATION]',
    description: '[ADD_INFORMATION]',
  },
];

export const globalExposure = [
  {
    eventProgram: '[ADD_INFORMATION]',
    date: '[ADD_INFORMATION]',
    location: '[ADD_INFORMATION]',
    role: '[ADD_INFORMATION]',
    description: 'Participated in external events that provided broader perspectives and professional environments.',
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
