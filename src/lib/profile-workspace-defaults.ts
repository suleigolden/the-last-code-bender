import defaultSectionsStyles from '@/components/profile/profile-workspace-sections.css?raw';

/**
 * Canonical paths for hosted profile sources (dashboard + Supabase).
 * `index.tsx` → `/App.tsx`; sections → `/sections/…`; `styles.css` → `/styles.css` (live preview).
 */
export const PROFILE_WORKSPACE_PATHS = [
  'index.tsx',
  'sections/HeroSection.tsx',
  'sections/StorySection.tsx',
  'sections/SocialsSection.tsx',
  'sections/StackSection.tsx',
  'sections/PortraitSection.tsx',
  'styles.css',
] as const;

export type ProfileWorkspacePath = (typeof PROFILE_WORKSPACE_PATHS)[number];

export function getDefaultProfileWorkspaceFiles(): Record<ProfileWorkspacePath, string> {
  return {
    'index.tsx': `import { HeroSection } from "./sections/HeroSection";
import { StorySection } from "./sections/StorySection";
import { PortraitSection } from "./sections/PortraitSection";
import { StackSection } from "./sections/StackSection";
import { SocialsSection } from "./sections/SocialsSection";

export default function App() {
  return (
    <div className="profile-root">
      <HeroSection />
      <StorySection />
      <PortraitSection />
      <StackSection />
      <SocialsSection />
    </div>
  );
}
`,
    'sections/HeroSection.tsx': `export function HeroSection() {
  return (
    <section className="section hero">
      <p className="ey">// hero</p>
      <h1>Your alias</h1>
      <p className="lede">Edit this file in the dashboard to introduce yourself.</p>
    </section>
  );
}
`,
    'sections/StorySection.tsx': `export function StorySection() {
  return (
    <section className="section story">
      <p className="ey">// story</p>
      <h2>How I bend code</h2>
      <p>Tell visitors your journey, stack, and what you are building.</p>
    </section>
  );
}
`,
    'sections/SocialsSection.tsx': `export function SocialsSection() {
  return (
    <section className="section socials">
      <p className="ey">// socials</p>
      <h2>Links</h2>
      <ul className="links">
        <li><a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a></li>
        <li><a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a></li>
      </ul>
    </section>
  );
}
`,
    'sections/StackSection.tsx': `export function StackSection() {
  const items = ["TypeScript", "React", "Vite"];
  return (
    <section className="section stack">
      <p className="ey">// stack</p>
      <h2>Tech I use</h2>
      <ul className="pill-list">
        {items.map((t) => (
          <li key={t} className="pill">{t}</li>
        ))}
      </ul>
    </section>
  );
}
`,
    'sections/PortraitSection.tsx': `export function PortraitSection() {
  return (
    <section className="section portrait" aria-label="Portrait">
      <p className="ey">// portrait</p>
      <div className="avatar" aria-hidden>CB</div>
      <p>Swap the placeholder for an image URL or your own markup.</p>
    </section>
  );
}
`,
    'styles.css': defaultSectionsStyles,
  };
}

export function normalizeWorkspaceFiles(
  raw: Record<string, unknown> | null | undefined,
): Record<ProfileWorkspacePath, string> {
  const defaults = getDefaultProfileWorkspaceFiles();
  if (!raw || typeof raw !== 'object') return defaults;
  const next = { ...defaults };
  for (const path of PROFILE_WORKSPACE_PATHS) {
    const v = raw[path];
    if (typeof v === 'string' && v.length > 0) next[path] = v;
  }
  return next;
}
