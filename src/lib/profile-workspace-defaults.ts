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
  'SKILL.md',
  'stack/stack.json',
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
    'sections/HeroSection.tsx': `import { ArrowDown, ExternalLink } from "lucide-react";

/** Swap for your own image (https URL works in the preview). */
const PORTRAIT_URL =
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80";

function go(sectionId: string) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function HeroSection() {
  return (
    <section className="section hero hero-ide" aria-label="Hero">
      <p className="hero-readme-ey">// README.md — Welcome to my codebase</p>

      <div className="hero-layout">
        <div className="hero-col hero-col--copy">
          <div className="hero-title-block">
            <h1 className="hero-title">
              <span className="hero-title-glow">TheLastCode</span>
              <span className="hero-title-plain">Bender</span>
            </h1>
            <p className="hero-role-line">
              <span className="hero-kw">const</span>{" "}
              <span className="hero-ident">role</span>{" "}
              <span className="hero-pun">=</span>{" "}
              <span className="hero-str">&quot;Full-Stack Senior Developer&quot;</span>{" "}
              <span className="hero-line-comment">// 12+ Years</span>
            </p>
          </div>

          <div className="hero-bio ide-doc-panel">
            <p className="hero-doc-line">
              <span className="hero-doc-muted">/**</span>
            </p>
            <p className="hero-doc-line hero-doc-body">
              <span className="hero-doc-muted"> * </span>
              I bend code across stacks to ship real products.
            </p>
            <p className="hero-doc-line hero-doc-body">
              <span className="hero-doc-muted"> * </span>
              Always learning. Always building.
            </p>
            <p className="hero-doc-line">
              <span className="hero-doc-muted"> */</span>
            </p>
            <p className="hero-doc-line hero-doc-accent">
              <span className="hero-doc-muted"> * </span>
              I cannot let a single day pass without bending code — it lives in my soul.
            </p>
          </div>

          <div className="hero-cta-row">
            <button type="button" className="pw-btn hero-cta-primary" onClick={() => go("story")}>
              <ArrowDown className="hero-cta-icon" aria-hidden />
              View Story
            </button>
            <button
              type="button"
              className="pw-btn pw-btn--outline hero-cta-secondary"
              onClick={() => go("socials")}
            >
              <ExternalLink className="hero-cta-icon" aria-hidden />
              Connect
            </button>
          </div>
        </div>

        <div className="hero-col hero-col--visual">
          <div className="hero-window ide-window-glow">
            <div className="hero-window-titlebar">
              <span className="hero-window-dot hero-window-dot--r" aria-hidden />
              <span className="hero-window-dot hero-window-dot--y" aria-hidden />
              <span className="hero-window-dot hero-window-dot--g" aria-hidden />
              <span className="hero-window-filename">the-last-code-bender.png</span>
            </div>
            <div className="hero-window-body">
              <img
                src={PORTRAIT_URL}
                alt="Portrait"
                className="hero-portrait-img"
                width={360}
                height={450}
              />
            </div>
            <div className="hero-window-caption">TheLastCodeBender — Master of the Code Elements</div>
          </div>
        </div>
      </div>
    </section>
  );
}
`,
    'sections/StorySection.tsx': `export function StorySection() {
  return (
    <section id="story" className="section story story-ide" aria-labelledby="story-heading">
      <p className="ey">// story/README.md</p>

      <h2 id="story-heading" className="story-heading">
        How I bend code
      </h2>

      <p className="story-subey">
        <span className="syntax-comment">/**</span> Replace the copy below with your real journey.
      </p>

      <div className="story-panel ide-panel">
        <p className="story-lead">
          I build products end-to-end: from rough idea to deployed code. I care about clear architecture,
          fast feedback loops, and shipping something people actually use.
        </p>

        <p>
          My path has wandered through <span className="syntax-string">&quot;frontend polish&quot;</span>,{" "}
          <span className="syntax-string">&quot;API design&quot;</span>, and{" "}
          <span className="syntax-string">&quot;keeping production calm&quot;</span> — always chasing that
          balance between craft and delivery.
        </p>

        <div className="story-chapter">
          <p className="story-chapter-label">// What I&apos;m focused on now</p>
          <ul className="story-list">
            <li>
              <span className="story-list-k">→</span> Shipping features with TypeScript + React ecosystems
            </li>
            <li>
              <span className="story-list-k">→</span> Owning reliability: errors, observability, and UX when things break
            </li>
            <li>
              <span className="story-list-k">→</span> Writing so the next developer isn&apos;t cursing my name
            </li>
          </ul>
        </div>

        <blockquote className="story-pullquote">
          <span className="syntax-comment">// mantra</span>
          <p>Ship small, measure, iterate — but never ship sloppy on purpose.</p>
        </blockquote>
      </div>
    </section>
  );
}
`,
    'sections/SocialsSection.tsx': `export function SocialsSection() {
  return (
    <section id="socials" className="section socials">
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
    <section id="stack" className="section stack">
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
    'SKILL.md': `# Claude Code Skill: The Last Code Bender Skill\n\nYou are a senior developer assistant.\n\n## What you do\n- Convert messy requirements into a clear plan\n- Write and explain TypeScript/React improvements\n- Help keep PRs small, consistent, and reviewable\n\n## How you work\n- Ask 1-3 clarifying questions when requirements are ambiguous\n- Prefer concrete examples over vague advice\n- End with a short checklist\n\n## Example\nGiven: \"Refactor a React component\".\nOutput: A step-by-step plan + a safe patch-style approach.\n`,
    'stack/stack.json': `{\n  \"languages\": [\"TypeScript\"],\n  \"frameworks\": [\"React\"],\n  \"tools\": [\"Vite\", \"Tailwind CSS\"],\n  \"notes\": \"Edit this to match your real stack. This is ground truth for skill review.\"\n}\n`,
    'sections/PortraitSection.tsx': `export function PortraitSection() {
  return (
    <section id="portrait" className="section portrait" aria-label="Portrait">
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
