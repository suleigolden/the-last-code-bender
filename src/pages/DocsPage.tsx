import { useState } from 'react';
import { BookOpen, GitFork, Cpu, ShieldAlert, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { IDEStatusBar } from '@/components/ide/IDEStatusBar';
import { IDEWindowControls } from '@/components/ide/IDEWindowControls';
import { cn } from '@/lib/utils';

const SECTIONS = [
  { id: 'about',        label: 'ABOUT.md',        icon: BookOpen },
  { id: 'contributing', label: 'CONTRIBUTING.md',  icon: GitFork },
  { id: 'skill',        label: 'SKILL.md',          icon: Cpu },
  { id: 'rules',        label: 'RULES.md',          icon: ShieldAlert },
] as const;

type SectionId = (typeof SECTIONS)[number]['id'];

// ─── Reusable sub-components ──────────────────────────────────────────────────

function SectionHeader({ title, subtitle }: { title: React.ReactNode; subtitle: string }) {
  return (
    <div className="mb-8 pb-4 border-b border-border">
      <h2 className="font-mono text-xl font-bold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground font-mono mt-1">{subtitle}</p>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-ide-sidebar border border-border rounded-lg overflow-hidden mb-6">
      <div className="px-4 py-2 border-b border-border">
        <span className="text-xs font-mono text-muted-foreground">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="bg-background border border-border rounded-md p-4 text-xs font-mono text-foreground overflow-x-auto leading-relaxed">
      {children}
    </pre>
  );
}

function Kw({ children }: { children: React.ReactNode }) {
  return <span className="text-syntax-keyword">{children}</span>;
}
function Fn({ children }: { children: React.ReactNode }) {
  return <span className="text-syntax-function">{children}</span>;
}
function Str({ children }: { children: React.ReactNode }) {
  return <span className="text-syntax-string">{children}</span>;
}
function Cm({ children }: { children: React.ReactNode }) {
  return <span className="text-syntax-comment">{children}</span>;
}
function Mut({ children }: { children: React.ReactNode }) {
  return <span className="text-muted-foreground">{children}</span>;
}

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 mb-6">
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center font-mono text-xs text-primary font-bold">
        {n}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-mono text-sm font-semibold text-foreground mb-2">{title}</p>
        <div className="text-sm text-muted-foreground font-mono space-y-2">{children}</div>
      </div>
    </div>
  );
}

function DontItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-sm bg-destructive/15 border border-destructive/30 flex items-center justify-center text-[10px] font-bold text-destructive">
        ✕
      </span>
      <p className="text-sm font-mono text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}

function DoItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-sm bg-[hsl(95_60%_55%/0.15)] border border-[hsl(95_60%_55%/0.4)] flex items-center justify-center text-[10px] font-bold text-syntax-string">
        ✓
      </span>
      <p className="text-sm font-mono text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}

// ─── Section content ──────────────────────────────────────────────────────────

function AboutSection() {
  return (
    <div>
      <SectionHeader
        title={
          <>
            <Kw>const </Kw>
            <Fn>project</Fn>
            <Mut> = </Mut>
            <Str>"The Last Code Bender"</Str>
          </>
        }
        subtitle="// An open-source developer legacy — 1,200 unique ranks, one developer per rank, forever."
      />

      <Block title="ABOUT.md — What is this?">
        <div className="space-y-4 text-sm font-mono">
          <p className="text-muted-foreground leading-relaxed">
            <Cm>{'/**'}</Cm>
            <br />
            <Cm>{' * The Last Code Bender is a developer legacy project.'}</Cm>
            <br />
            <Cm>{' * 1,200 unique ranks are available — one per developer, forever.'}</Cm>
            <br />
            <Cm>{' * Claim your rank by submitting a pull request with your profile.'}</Cm>
            <br />
            <Cm>{' * Once claimed, a rank is yours permanently and cannot be taken.'}</Cm>
            <br />
            <Cm>{' */'}</Cm>
          </p>
          <div>
            <Kw>const </Kw>
            <Fn>totalRanks</Fn>
            <Mut> = </Mut>
            <span className="text-syntax-number">1200</span>
            <Mut>;</Mut>
          </div>
          <div>
            <Kw>const </Kw>
            <Fn>ranksPerDiscipline</Fn>
            <Mut> = </Mut>
            <span className="text-syntax-number">200</span>
            <Mut>;</Mut>
          </div>
        </div>
      </Block>

      <Block title="disciplines.ts — 6 specializations">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-sm">
          {[
            { key: 'frontend',  color: 'text-syntax-keyword border-syntax-keyword',  label: 'Frontend Bender',  desc: '200 ranks — UI, React, CSS masters' },
            { key: 'backend',   color: 'text-syntax-function border-syntax-function', label: 'Backend Bender',   desc: '200 ranks — APIs, databases, servers' },
            { key: 'fullstack', color: 'text-syntax-string border-syntax-string',     label: 'FullStack Bender', desc: '200 ranks — end-to-end builders' },
            { key: 'security',  color: 'text-syntax-variable border-syntax-variable', label: 'Security Bender',  desc: '200 ranks — AppSec, hacking, defense' },
            { key: 'ai',        color: 'text-primary border-primary',                 label: 'AI Bender',        desc: '200 ranks — ML, LLMs, data science' },
            { key: 'devops',    color: 'text-muted-foreground border-border',         label: 'DevOps Bender',    desc: '200 ranks — infra, CI/CD, cloud' },
          ].map((d) => (
            <div key={d.key} className="flex items-start gap-3 p-3 bg-background border border-border rounded-md">
              <Badge variant="outline" className={cn('font-mono text-[10px] px-1.5 shrink-0', d.color)}>
                {d.key}
              </Badge>
              <div>
                <p className="text-foreground text-xs font-semibold">{d.label}</p>
                <p className="text-muted-foreground text-[11px] mt-0.5">{d.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Block>

      <Block title="rank-system.ts — how ranks work">
        <div className="space-y-3 text-sm font-mono">
          <p className="text-muted-foreground">
            <Cm>// Each discipline has 200 ordinal ranks.</Cm>
            <br />
            <Cm>// Rank 1 is the most prestigious — first to claim wins it.</Cm>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { tier: 'Apprentice',  range: '1–50',    color: 'bg-muted/60 text-muted-foreground' },
              { tier: 'Journeyman',  range: '51–100',  color: 'text-syntax-string bg-[hsl(95_60%_55%/0.15)]' },
              { tier: 'Senior',      range: '101–150', color: 'text-syntax-function bg-[hsl(35_90%_65%/0.15)]' },
              { tier: 'Master',      range: '151–200', color: 'text-primary bg-primary/15' },
            ].map((t) => (
              <div key={t.tier} className="p-2 bg-background border border-border rounded-md text-center">
                <Badge className={cn('font-mono text-[10px] border-0 mb-1', t.color)}>{t.tier}</Badge>
                <p className="text-[11px] text-muted-foreground">ranks {t.range}</p>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground text-xs">
            <Cm>// XP grows over time through challenges, community votes, and skill demos.</Cm>
          </p>
        </div>
      </Block>

      <Block title="stack.ts — tech">
        <div className="space-y-2 text-sm font-mono">
          {[
            ['React 18 + TypeScript 5 + Vite 5', 'framework'],
            ['Tailwind CSS 3 + shadcn/ui',         'styling'],
            ['React Router DOM 6',                  'routing'],
            ['TanStack React Query 5',              'data'],
            ['Vitest + Testing Library',            'testing'],
          ].map(([tech, cat]) => (
            <div key={tech} className="flex items-center gap-2">
              <Mut>{'  '}</Mut>
              <Str>"{tech}"</Str>
              <span className="text-muted-foreground text-[11px]">// {cat}</span>
            </div>
          ))}
        </div>
      </Block>
    </div>
  );
}

function ContributingSection() {
  return (
    <div>
      <SectionHeader
        title={
          <>
            <Kw>async function </Kw>
            <Fn>claimYourRank</Fn>
            <Mut>() {'{'}</Mut>
          </>
        }
        subtitle="// Step-by-step guide to submitting your profile via pull request."
      />

      <Block title="overview.ts">
        <div className="space-y-2 text-sm font-mono text-muted-foreground leading-relaxed">
          <p>
            <Cm>// You contribute ONE file: register-me.json inside your profile folder.</Cm>
          </p>
          <p>
            <Cm>// The system auto-picks it up — no global files to edit.</Cm>
          </p>
          <p>
            <Cm>// Your index.tsx renders your profile UI below the page header.</Cm>
          </p>
          <p>
            <Cm>// First merged PR claiming a rank wins it permanently.</Cm>
          </p>
        </div>
      </Block>

      <div className="space-y-1 mb-6">
        <Step n={1} title="Fork & clone the repository">
          <CodeBlock>{`git clone https://github.com/suleigolden/the-last-code-bender.git
cd the-last-code-bender
bun install          # or: yarn install`}</CodeBlock>
        </Step>

        <Step n={2} title="Choose your discipline and find your handle">
          <p className="mb-2 text-muted-foreground">
            Browse{' '}
            <span className="text-foreground">/hall-of-fame</span> to see which ranks are still
            unclaimed. Your handle must match the exact rank name (e.g.{' '}
            <span className="text-syntax-string">"ThirdFrontendBender"</span>).
          </p>
          <CodeBlock>{`src/apps/codebender-profiles/
├── FrontendBenders/          ← discipline folder
│   ├── FirstFrontendBender/  ← claimed
│   ├── SecondFrontendBender/ ← claimed
│   └── ThirdFrontendBender/  ← yours to claim!
├── BackendBenders/
├── FullStackBenders/
├── SecurityBenders/
├── AIBenders/
└── DevOpsBenders/`}</CodeBlock>
        </Step>

        <Step n={3} title="Create your profile folder">
          <CodeBlock>{`mkdir src/apps/codebender-profiles/FrontendBenders/ThirdFrontendBender`}</CodeBlock>
        </Step>

        <Step n={4} title='Create register-me.json — the only registry file you touch'>
          <p className="mb-2 text-muted-foreground">
            This is the <span className="text-foreground">only file</span> that registers you in
            the system. Fill in your real information — the site picks it up automatically.
          </p>
          <CodeBlock>{`// src/apps/codebender-profiles/FrontendBenders/ThirdFrontendBender/register-me.json
{
  "handle":     "ThirdFrontendBender",
  "discipline": "frontend",
  "github":     "your-github-username",
  "rank":       "Apprentice",
  "xp":         0,

  "socials": {
    "linkedin": "https://linkedin.com/in/yourprofile",  // optional
    "twitter":  "https://twitter.com/yourhandle",       // optional
    "email":    "you@example.com"                       // optional
  },

  "stack": {
    "primary":  [{ "tech": "React",      "category": "framework" }],
    "familiar": [{ "tech": "TypeScript", "category": "language"  }],
    "aware":    []
  },

  "open_to_work":    false,
  "skill_live":      false,
  "skill_version":   null,
  "challenge_wins":  0,
  "community_vote":  false,
  "demo_url":        null,
  "demo_views":      0,
  "joined":          "2026-03-23"
}`}</CodeBlock>
          <div className="mt-3">
            <p className="text-xs text-muted-foreground mb-2"><Cm>// register-me.json field reference:</Cm></p>
            <div className="overflow-x-auto">
              <table className="text-xs w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-1.5 pr-4 text-foreground">Field</th>
                    <th className="text-left py-1.5 pr-4 text-foreground">Required</th>
                    <th className="text-left py-1.5 text-foreground">Description</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {[
                    ['handle',        '✓', 'Exact PascalCase handle — must match folder name'],
                    ['discipline',    '✓', 'frontend | backend | fullstack | security | ai | devops'],
                    ['github',        '✓', 'GitHub username without @'],
                    ['rank',          '✓', 'Apprentice | Journeyman | Senior | Master'],
                    ['xp',            '✓', 'Start at 0'],
                    ['socials',       '—', 'linkedin, twitter, youtube, email — all optional'],
                    ['stack',         '—', 'primary, familiar, aware arrays of { tech, category }'],
                    ['open_to_work',  '—', 'Shown as a badge on your profile'],
                    ['skill_live',    '—', 'true when your Claude Code skill is published'],
                    ['joined',        '—', 'ISO date string YYYY-MM-DD'],
                  ].map(([field, req, desc]) => (
                    <tr key={field} className="border-b border-border/50">
                      <td className="py-1.5 pr-4 text-syntax-function">{field}</td>
                      <td className="py-1.5 pr-4 text-center">{req}</td>
                      <td className="py-1.5">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Step>

        <Step n={5} title="Create index.tsx — your profile component">
          <p className="mb-2 text-muted-foreground">
            This component renders inside the profile page below the header. Study{' '}
            <span className="text-foreground">TheLastCodeBender/index.tsx</span> as the reference
            implementation. Rules:
          </p>
          <ul className="space-y-1 text-muted-foreground text-xs mb-3 list-none">
            {[
              'Export a default function — no named exports',
              'Use font-mono for all text',
              'Use IDE design tokens only — no hardcoded hex colors',
              'IDE tokens: bg-ide-sidebar, bg-ide-tab, bg-ide-statusbar',
              'Syntax tokens: text-syntax-keyword, text-syntax-string, text-syntax-function, text-syntax-comment',
              'Do not render full-page chrome — the outer shell is provided by BenderProfilePage',
            ].map((rule) => (
              <li key={rule} className="flex items-start gap-2">
                <ChevronRight className="w-3 h-3 mt-0.5 text-syntax-function shrink-0" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
          <CodeBlock>{`// src/apps/codebender-profiles/FrontendBenders/ThirdFrontendBender/index.tsx

export default function ThirdFrontendBenderProfile() {
  return (
    <div className="space-y-6 font-mono">

      {/* Story / README */}
      <div className="bg-ide-sidebar border border-border rounded-lg overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
          <span className="text-xs text-muted-foreground">README.md</span>
        </div>
        <div className="p-4 text-sm space-y-2">
          <p className="text-syntax-comment">// ThirdFrontendBender — Your Name</p>
          <div>
            <span className="text-syntax-keyword">const </span>
            <span className="text-foreground">tagline</span>
            <span className="text-muted-foreground"> = </span>
            <span className="text-syntax-string">"your one-liner here"</span>
          </div>
        </div>
      </div>

      {/* Socials */}
      <div className="bg-ide-sidebar border border-border rounded-lg overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
          <span className="text-xs text-muted-foreground">socials.json</span>
        </div>
        <div className="p-4 text-sm space-y-1">
          <div>
            <span className="text-syntax-function">"github"</span>
            <span className="text-muted-foreground">: </span>
            <a href="https://github.com/your-handle"
               className="text-syntax-string hover:underline"
               target="_blank" rel="noopener noreferrer">
              "github.com/your-handle"
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}`}</CodeBlock>
        </Step>

        <Step n={6} title="Run the dev server to preview your profile">
          <CodeBlock>{`yarn dev
# or: bun dev

# Navigate to:
# http://localhost:3004/benders/frontend/ThirdFrontendBender`}</CodeBlock>
        </Step>

        <Step n={7} title="Submit a pull request">
          <CodeBlock>{`git checkout -b feat/profile-ThirdFrontendBender
git add src/apps/codebender-profiles/FrontendBenders/ThirdFrontendBender/
git commit -m "feat(profile): add ThirdFrontendBender"
git push origin feat/profile-ThirdFrontendBender`}</CodeBlock>
          <p className="mt-2 text-muted-foreground text-xs">
            Open a PR against <span className="text-foreground">main</span>. First merged PR wins
            the rank. Once merged, your profile is live on thelastcodebender.com.
          </p>
        </Step>
      </div>

      <Block title="stack-categories.ts">
        <div className="text-sm font-mono">
          <p className="text-muted-foreground mb-3"><Cm>// Valid category values for stack entries:</Cm></p>
          <div className="flex flex-wrap gap-2">
            {['language', 'framework', 'db', 'devops', 'other'].map((cat) => (
              <Badge key={cat} variant="outline" className="font-mono text-xs">
                <Str>"{cat}"</Str>
              </Badge>
            ))}
          </div>
        </div>
      </Block>
    </div>
  );
}

function SkillSection() {
  return (
    <div>
      <SectionHeader
        title={
          <>
            <Kw>interface </Kw>
            <Fn>ClaudeCodeSkill</Fn>
            <Mut> {'{'}</Mut>
          </>
        }
        subtitle="// How the Claude Code Skill system works on this platform."
      />

      <Block title="what-is-a-skill.ts">
        <div className="space-y-3 text-sm font-mono">
          <p className="text-muted-foreground leading-relaxed">
            <Cm>{'/**'}</Cm>
            <br />
            <Cm>{' * A Claude Code Skill is a custom prompt or workflow you publish'}</Cm>
            <br />
            <Cm>{' * that other developers can install into their Claude Code CLI.'}</Cm>
            <br />
            <Cm>{' * When your skill is live, skill_live = true on your profile.'}</Cm>
            <br />
            <Cm>{' */'}</Cm>
          </p>
        </div>
      </Block>

      <Block title="skill-fields.ts — your register-me.json skill flags">
        <div className="space-y-4 text-sm font-mono">
          <div className="p-3 bg-background border border-border rounded-md">
            <div className="flex items-center gap-2 mb-1">
              <Fn>skill_live</Fn>
              <Mut>: </Mut>
              <span className="text-syntax-string">boolean</span>
            </div>
            <p className="text-muted-foreground text-xs">
              Set to <span className="text-syntax-keyword">true</span> when your skill is
              published and usable by others. This shows a{' '}
              <span className="text-foreground">Skill Live</span> indicator on your profile card
              in the Hall of Fame.
            </p>
          </div>

          <div className="p-3 bg-background border border-border rounded-md">
            <div className="flex items-center gap-2 mb-1">
              <Fn>skill_version</Fn>
              <Mut>: </Mut>
              <span className="text-syntax-string">string | null</span>
            </div>
            <p className="text-muted-foreground text-xs">
              Semantic version of your published skill, e.g.{' '}
              <Str>"1.0.0"</Str>. Set to{' '}
              <span className="text-syntax-keyword">null</span> if not yet published.
            </p>
          </div>

          <div className="p-3 bg-background border border-border rounded-md">
            <div className="flex items-center gap-2 mb-1">
              <Fn>demo_url</Fn>
              <Mut>: </Mut>
              <span className="text-syntax-string">string | null</span>
            </div>
            <p className="text-muted-foreground text-xs">
              A URL to a live demo of your skill or project. Displayed in the Showcase tab
              of your profile page as an embedded iframe.
            </p>
          </div>
        </div>
      </Block>

      <Block title="how-skills-earn-xp.ts">
        <div className="space-y-2 text-sm font-mono">
          <p className="text-muted-foreground"><Cm>// XP sources for your profile:</Cm></p>
          {[
            ['Claiming a rank',          '+10 XP',  'Awarded when your PR is merged'],
            ['Publishing a skill',       '+25 XP',  'skill_live = true'],
            ['Winning a challenge',      '+50 XP',  'Per challenge_wins entry'],
            ['Community vote',           '+15 XP',  'community_vote = true'],
            ['Demo views milestone',     '+5 XP',   'Every 100 demo_views'],
          ].map(([action, xp, note]) => (
            <div key={action} className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
              <span className="text-syntax-function shrink-0 text-xs w-20">{xp}</span>
              <div>
                <span className="text-foreground text-xs">{action}</span>
                <span className="text-muted-foreground text-xs ml-2">— {note}</span>
              </div>
            </div>
          ))}
        </div>
      </Block>

      <Block title="skill-workflow.ts — publishing your skill">
        <div className="space-y-3 text-sm font-mono">
          <p className="text-muted-foreground"><Cm>// Steps to publish a Claude Code skill:</Cm></p>
          {[
            ['Build your skill',    'Create a .md prompt file or Claude Code workflow that solves a real developer problem'],
            ['Test it locally',     'Install it in your own Claude Code CLI and verify it works'],
            ['Publish it',          'Submit to the Claude Code skills registry or share via GitHub'],
            ['Update register-me',  'Set skill_live: true, skill_version: "1.0.0" in your register-me.json'],
            ['Submit a PR',         'The update will appear on your profile after merge'],
          ].map(([step, desc], i) => (
            <div key={step} className="flex gap-3">
              <span className="text-syntax-number shrink-0">{i + 1}.</span>
              <div>
                <span className="text-foreground">{step}</span>
                <span className="text-muted-foreground"> — {desc}</span>
              </div>
            </div>
          ))}
        </div>
      </Block>
    </div>
  );
}

function RulesSection() {
  return (
    <div>
      <SectionHeader
        title={
          <>
            <Kw>const </Kw>
            <Fn>rules</Fn>
            <Mut> = </Mut>
            <Str>"one rank, one dev, forever"</Str>
          </>
        }
        subtitle="// What you must never do — and what you are encouraged to do."
      />

      <Block title="dont-do.ts — prohibited actions">
        <div className="space-y-0">
          <DontItem>
            <span className="text-foreground font-semibold">Edit another contributor&apos;s files.</span>{' '}
            You may only modify files inside your own profile folder (
            <span className="text-syntax-function">src/apps/codebender-profiles/YourDiscipline/YourHandle/</span>
            ) and your own{' '}
            <span className="text-syntax-function">register-me.json</span>.
          </DontItem>
          <DontItem>
            <span className="text-foreground font-semibold">Edit global registry files.</span>{' '}
            Never manually edit{' '}
            <span className="text-syntax-function">registry/registry.json</span>,{' '}
            <span className="text-syntax-function">src/apps/codebender-profiles/registry.ts</span>, or any
            barrel index.ts file. These are auto-generated.
          </DontItem>
          <DontItem>
            <span className="text-foreground font-semibold">Claim a rank that is already taken.</span>{' '}
            If a handle folder already exists with a real profile, that rank is claimed. Do not
            overwrite or rename another contributor&apos;s folder.
          </DontItem>
          <DontItem>
            <span className="text-foreground font-semibold">Use hardcoded hex colors or inline styles.</span>{' '}
            All colors must use Tailwind CSS IDE design tokens. No{' '}
            <span className="text-syntax-string">#fff</span>,{' '}
            <span className="text-syntax-string">rgb()</span>, or{' '}
            <span className="text-syntax-string">style={`{{ color: '...' }}`}</span>.
          </DontItem>
          <DontItem>
            <span className="text-foreground font-semibold">Add external dependencies.</span>{' '}
            Do not install npm packages or modify <span className="text-syntax-function">package.json</span>.
            Use only what is already in the project.
          </DontItem>
          <DontItem>
            <span className="text-foreground font-semibold">Modify shared components or pages.</span>{' '}
            Do not edit files under{' '}
            <span className="text-syntax-function">src/components/</span>,{' '}
            <span className="text-syntax-function">src/pages/</span>,{' '}
            <span className="text-syntax-function">src/hooks/</span>, or{' '}
            <span className="text-syntax-function">src/lib/</span>. These are maintained by the
            project author.
          </DontItem>
          <DontItem>
            <span className="text-foreground font-semibold">Impersonate another developer.</span>{' '}
            Your handle, github username, and socials must be your real identity. Do not use
            another person&apos;s information.
          </DontItem>
          <DontItem>
            <span className="text-foreground font-semibold">Submit multiple profiles or claim multiple ranks.</span>{' '}
            One developer, one rank, one profile. Multiple PRs claiming different ranks will be
            rejected.
          </DontItem>
          <DontItem>
            <span className="text-foreground font-semibold">Include offensive, harmful, or illegal content.</span>{' '}
            Your profile will be rejected and you may be permanently blocked from contributing.
          </DontItem>
          <DontItem>
            <span className="text-foreground font-semibold">Commit generated or build artifacts.</span>{' '}
            Do not commit files from{' '}
            <span className="text-syntax-function">dist/</span>,{' '}
            <span className="text-syntax-function">node_modules/</span>, or any other build output.
          </DontItem>
        </div>
      </Block>

      <Block title="do-this.ts — encouraged contributions">
        <div className="space-y-0">
          <DoItem>
            <span className="text-foreground font-semibold">Study the reference implementation.</span>{' '}
            Read{' '}
            <span className="text-syntax-function">TheLastCodeBender/index.tsx</span> carefully before
            writing your own component. It demonstrates every pattern you should follow.
          </DoItem>
          <DoItem>
            <span className="text-foreground font-semibold">Keep your component self-contained.</span>{' '}
            All your code lives in your folder. Import only from the shared component library
            already in the project.
          </DoItem>
          <DoItem>
            <span className="text-foreground font-semibold">Use IDE design tokens consistently.</span>{' '}
            <span className="text-syntax-function">bg-ide-sidebar</span>,{' '}
            <span className="text-syntax-function">text-syntax-keyword</span>,{' '}
            <span className="text-syntax-function">text-muted-foreground</span>,{' '}
            <span className="text-syntax-function">border-border</span> — these make your
            profile look native in both light and dark themes.
          </DoItem>
          <DoItem>
            <span className="text-foreground font-semibold">Run lint before pushing.</span>{' '}
            Run <span className="text-syntax-function">yarn lint</span> or{' '}
            <span className="text-syntax-function">bun lint</span> and fix all warnings before
            opening your PR. The pre-commit hook enforces zero warnings.
          </DoItem>
          <DoItem>
            <span className="text-foreground font-semibold">Preview locally before submitting.</span>{' '}
            Run <span className="text-syntax-function">yarn dev</span>, navigate to your profile URL,
            and confirm everything renders correctly in both light and dark mode.
          </DoItem>
          <DoItem>
            <span className="text-foreground font-semibold">Keep your register-me.json up to date.</span>{' '}
            When you publish a skill, win a challenge, or want to show{' '}
            <span className="text-syntax-function">open_to_work</span>, submit a PR updating only
            your <span className="text-syntax-function">register-me.json</span>.
          </DoItem>
        </div>
      </Block>

      <Block title="file-ownership.ts — what you own">
        <CodeBlock>{`// You own ONLY:
src/apps/codebender-profiles/
  └── YourDisciplineBenders/
      └── YourHandle/
          ├── register-me.json  ← registration + metadata
          └── index.tsx         ← your profile component

// Everything else is off-limits.`}</CodeBlock>
      </Block>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const SECTION_CONTENT: Record<SectionId, React.ReactNode> = {
  about:        <AboutSection />,
  contributing: <ContributingSection />,
  skill:        <SkillSection />,
  rules:        <RulesSection />,
};

export const DocsPage = () => {
  const [active, setActive] = useState<SectionId>('about');

  return (
    <div className="h-screen bg-background flex flex-col noise-overlay relative overflow-hidden">
      <div className="fixed inset-0 ide-grid-bg pointer-events-none opacity-30" />

      <div className="flex flex-1 flex-col relative z-10 h-full overflow-hidden">
        {/* Tab bar */}
        <div className="flex items-center bg-ide-tabbar border-b border-border px-2 shrink-0">
          <IDEWindowControls />
          <div className="flex items-center gap-2 px-4 py-2.5 bg-background border-r border-l border-border text-syntax-function text-sm font-mono">
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>DOCS.md</span>
          </div>
        </div>

        {/* Sidebar + content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside className="w-52 shrink-0 bg-ide-sidebar border-r border-border overflow-y-auto hidden md:block">
            <div className="px-3 py-2 border-b border-border">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                Documentation
              </span>
            </div>
            <nav className="py-1">
              {SECTIONS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActive(id)}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-mono transition-colors',
                    active === id
                      ? 'bg-background text-foreground border-l-2 border-l-syntax-function'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50 border-l-2 border-l-transparent',
                  )}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Mobile section tabs */}
          <div className="md:hidden flex gap-1 px-4 py-2 border-b border-border bg-ide-sidebar overflow-x-auto shrink-0 w-full absolute z-10">
            {SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={cn(
                  'px-2 py-1 text-[10px] font-mono rounded whitespace-nowrap transition-colors',
                  active === id
                    ? 'bg-background text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-6 md:pt-6 pt-14">
            <div className="max-w-3xl mx-auto">{SECTION_CONTENT[active]}</div>
          </main>
        </div>

        <IDEStatusBar activeFile="docs" />
      </div>
    </div>
  );
};
