import type { BenderProfile } from './types';

export const BENDER_PROFILES: BenderProfile[] = [
  {
    handle: 'TheLastCodeBender',
    discipline: 'founder',
    rank: 'Master Bender',
    xp: 9999,
    github: 'suleigolden',
    portfolio: 'thelastcodebender.com',
    tagline: '...',
    isFounder: true,
    stack: {
      primary: [
        { tech: 'TypeScript', category: 'language' },
        { tech: 'React', category: 'framework' },
        { tech: 'Node.js', category: 'framework' },
        { tech: 'Vite', category: 'devops' },
      ],
      familiar: [
        { tech: 'Python', category: 'language' },
        { tech: 'PostgreSQL', category: 'db' },
        { tech: 'Tailwind CSS', category: 'framework' },
      ],
      aware: [
        { tech: 'Rust', category: 'language' },
        { tech: 'Go', category: 'language' },
        { tech: 'Docker', category: 'devops' },
      ],
    },
    socials: {
      linkedin: 'https://linkedin.com/in/suleigolden',
      twitter: 'https://twitter.com/suleigolden',
    },
  },
  {
    handle: 'FirstFrontendBender',
    discipline: 'frontend',
    rank: 'First Frontend Bender',
    xp: 0,
    github: '',
    isPlaceholder: true,
  },
  {
    handle: 'FirstBackendBender',
    discipline: 'backend',
    rank: 'First Backend Bender',
    xp: 0,
    github: '',
    isPlaceholder: true,
  },
  {
    handle: 'FirstFullStackBender',
    discipline: 'fullstack',
    rank: 'First FullStack Bender',
    xp: 0,
    github: '',
    isPlaceholder: true,
  },
  {
    handle: 'FirstSecurityBender',
    discipline: 'security',
    rank: 'First Security Bender',
    xp: 0,
    github: '',
    isPlaceholder: true,
  },
  {
    handle: 'FirstAIBender',
    discipline: 'ai',
    rank: 'First AI Bender',
    xp: 0,
    github: '',
    isPlaceholder: true,
  },
  {
    handle: 'FirstDevOpsBender',
    discipline: 'devops',
    rank: 'First DevOps Bender',
    xp: 0,
    github: '',
    isPlaceholder: true,
  },
];
