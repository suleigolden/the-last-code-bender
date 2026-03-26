import { useState } from 'react';
import { BookOpen, GitFork, Cpu, ShieldAlert } from 'lucide-react';
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
            <Cm>{' * Claim your rank from the Dashboard, then publish via the Profile workspace.'}</Cm>
            <br />
            <Cm>{' * Once claimed, a rank is yours permanently and cannot be taken.'}</Cm>
            <br />
            <Cm>{' */'}</Cm>
          </p>
          <div>
            <Kw>const </Kw>
            <Fn>totalRanks</Fn>
            <Mut> = </Mut>
            <span className="text-syntax-number">1400</span>
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

      <Block title="disciplines.ts — 7 specializations">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-sm">
          {[
            { key: 'frontend',  color: 'text-syntax-keyword border-syntax-keyword',  label: 'Frontend Bender',  desc: '200 ranks — UI, React, CSS masters' },
            { key: 'backend',   color: 'text-syntax-function border-syntax-function', label: 'Backend Bender',   desc: '200 ranks — APIs, databases, servers' },
            { key: 'fullstack', color: 'text-syntax-string border-syntax-string',     label: 'FullStack Bender', desc: '200 ranks — end-to-end builders' },
            { key: 'security',  color: 'text-syntax-variable border-syntax-variable', label: 'Security Bender',  desc: '200 ranks — AppSec, hacking, defense' },
            { key: 'ai',        color: 'text-primary border-primary',                 label: 'AI Bender',        desc: '200 ranks — ML, LLMs, data science' },
            { key: 'devops',    color: 'text-muted-foreground border-border',         label: 'DevOps Bender',    desc: '200 ranks — infra, CI/CD, cloud' },
            { key: 'qa',        color: 'text-syntax-number border-syntax-number',     label: 'QA Bender',        desc: '200 ranks — testing, quality, reliability' },
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
            <Cm>// XP grows through workspace activity, skill reviews, challenges, and showcase publishing.</Cm>
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
            <Fn>contribute</Fn>
            <Mut>() {'{'}</Mut>
          </>
        }
        subtitle="// The modern workflow: Dashboard → Profile workspace → Save → Publish."
      />

      <Block title="overview.ts">
        <div className="space-y-2 text-sm font-mono text-muted-foreground leading-relaxed">
          <p>
            <Cm>// Claiming and editing now happens inside the in-app Dashboard.</Cm>
          </p>
          <p>
            <Cm>// Your public profile renders from the saved Profile workspace sources.</Cm>
          </p>
          <p>
            <Cm>// Saving with a commit message records activity + XP events.</Cm>
          </p>
        </div>
      </Block>

      <div className="space-y-1 mb-6">
        <Step n={1} title="Sign in with GitHub">
          <CodeBlock>{`/login → Continue with GitHub`}</CodeBlock>
          <p className="mt-2 text-muted-foreground text-xs">
            You&apos;ll be redirected to the Dashboard after auth.
          </p>
        </Step>

        <Step n={2} title="Register your rank from the Dashboard">
          <p className="mb-2 text-muted-foreground">
            Pick a discipline, type your handle prefix (the discipline suffix is appended), and submit.
          </p>
          <CodeBlock>{`/dashboard\n\n// Example\nhandle prefix:  MyHandle\nfull handle:    MyHandleFrontendBender`}</CodeBlock>
        </Step>

        <Step n={3} title="Open the Profile workspace">
          <CodeBlock>{`Dashboard → “Start editing profile”\n/dashboard/workspace`}</CodeBlock>
        </Step>

        <Step n={4} title="Edit your profile sources">
          <p className="mb-2 text-muted-foreground">
            This is where your real content lives — it&apos;s what visitors see on your profile page.
          </p>
          <CodeBlock>{`index.tsx            // your React profile entry\nsections/*.tsx        // optional components\nstyles.css            // styling\nSKILL.md              // your skill (submit for AI review)\nstack/stack.json      // your tech stack (recruiter matching)`}</CodeBlock>
        </Step>

        <Step n={5} title="Save with a commit message (XP + history)">
          <CodeBlock>{`// Example commit message\n"feat: add hero + socials"`}</CodeBlock>
          <p className="mt-2 text-muted-foreground text-xs">
            Saves create snapshots and can award XP (shown on your dashboard timeline).
          </p>
        </Step>

        <Step n={6} title="Publish your skill (optional)">
          <p className="mb-2 text-muted-foreground">
            Open the <span className="text-foreground">SKILL.md</span> tab and submit for AI review.
          </p>
          <CodeBlock>{`Profile workspace → SKILL.md → “Submit for AI Review”`}</CodeBlock>
        </Step>

        <Step n={7} title="Add your demo / project showcase (optional)">
          <CodeBlock>{`Dashboard → Showcase → Add demo URL + type + description`}</CodeBlock>
        </Step>
      </div>

      <Block title="advanced.ts — contributing to the codebase">
        <div className="space-y-2 text-sm font-mono text-muted-foreground leading-relaxed">
          <p>
            <Cm>// Want to improve the platform itself?</Cm>
          </p>
          <p>
            <Cm>// Open a PR with your changes — CI runs tests + build on every push/PR.</Cm>
          </p>
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

      <Block title="skill-fields.ts — skill + showcase fields">
        <div className="space-y-4 text-sm font-mono">
          <div className="p-3 bg-background border border-border rounded-md">
            <div className="flex items-center gap-2 mb-1">
              <Fn>skill_live</Fn>
              <Mut>: </Mut>
              <span className="text-syntax-string">boolean</span>
            </div>
            <p className="text-muted-foreground text-xs">
              Set to <span className="text-syntax-keyword">true</span> when your skill passes AI
              review and is published. This shows a{' '}
              <span className="text-foreground">Skill Live</span> indicator in the Hall of Fame.
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
              A URL to a live demo of your skill or project. Manage it from the{' '}
              <span className="text-foreground">Dashboard</span> Showcase section; it appears as an
              embedded iframe on your profile page.
            </p>
          </div>
        </div>
      </Block>

      <Block title="how-skills-earn-xp.ts">
        <div className="space-y-2 text-sm font-mono">
          <p className="text-muted-foreground"><Cm>// XP sources for your profile:</Cm></p>
          {[
            ['Workspace save',           '+10 XP',  'Saving with a commit message'],
            ['Skill approved',           '+50 XP',  'SKILL.md passes AI review'],
            ['Challenge submit',         '+10 XP',  'Per challenge submission'],
            ['Challenge win',            '+100 XP', 'Winner placement XP'],
            ['Showcase published',       '+20 XP',  'First time you add a demo URL'],
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
            ['Add SKILL.md',        'Paste your skill into the SKILL.md tab in the Profile workspace'],
            ['Submit for review',   'Click “Submit for AI Review” in the workspace UI'],
            ['Iterate',             'Fix issues, resubmit, and publish when approved'],
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
      <Block title="rules.ts — how to contribute">
        <div className="space-y-2 text-sm font-mono text-muted-foreground leading-relaxed">
          <p>
            <Cm>// Primary workflow: contribute inside the app.</Cm>
          </p>
          <p>
            <Cm>// Dashboard → Profile workspace → Save with a commit message → Publish.</Cm>
          </p>
          <p>
            <Cm>// Pull requests are for improving the platform itself.</Cm>
          </p>
        </div>
      </Block>

      {/* Don't do section */}
      <Block title="dont-do.ts — prohibited actions">
        <div className="space-y-0">
          <DontItem>
            <span className="text-foreground font-semibold">Don&apos;t edit someone else&apos;s profile.</span>{' '}
            If you&apos;re working in the Profile workspace, only publish content for your own handle.
          </DontItem>
          <DontItem>
            <span className="text-foreground font-semibold">Don&apos;t bypass the Dashboard workflow.</span>{' '}
            Your public profile is rendered from saved workspace sources — saving without a commit
            message may not award XP.
          </DontItem>
          <DontItem>
            <span className="text-foreground font-semibold">Don&apos;t claim a rank that&apos;s taken.</span>{' '}
            Use <span className="text-foreground">Hall of Fame</span> to find an open slot before
            registering on the Dashboard.
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
            <span className="text-foreground font-semibold">Don&apos;t ship platform changes casually.</span>{' '}
            If you open a PR, keep it focused and be ready to iterate on review — these paths affect
            everyone.
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
        
      {/* Do this section */}
      <Block title="do-this.ts — encouraged contributions">
        <div className="space-y-0">
          <DoItem>
            <span className="text-foreground font-semibold">Start in the Profile workspace.</span>{' '}
            Put your story, UI, and projects in <span className="text-foreground">index.tsx</span> and
            optional <span className="text-foreground">sections/</span> files, then save with a commit
            message.
          </DoItem>
          <DoItem>
            <span className="text-foreground font-semibold">Use the built-in file set.</span>{' '}
            <span className="text-foreground">SKILL.md</span> is for skill review,{' '}
            <span className="text-foreground">stack/stack.json</span> powers recruiter matching, and
            the Dashboard Showcase is for your demo URL.
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
            <span className="text-foreground font-semibold">Save often (with intent).</span>{' '}
            Workspace saves + commit messages create history and XP events — small, meaningful
            changes add up.
          </DoItem>
          <DoItem>
            <span className="text-foreground font-semibold">Preview like a visitor.</span>{' '}
            Open your public profile route and confirm your workspace content renders and your
            showcase demo loads.
          </DoItem>
          <DoItem>
            <span className="text-foreground font-semibold">Keep your profile up to date.</span>{' '}
            Use the Dashboard + Profile workspace to update your story, stack, skill, open-to-work,
            and showcase demo.
          </DoItem>
        </div>
      </Block>

      <Block title="ownership.ts — what&apos;s yours">
        <div className="space-y-2 text-sm font-mono text-muted-foreground leading-relaxed">
          <p>
            <Cm>// Your content belongs in your Profile workspace.</Cm>
          </p>
          <p>
            <Cm>// If you open a PR: only change what you intend to maintain and keep it small.</Cm>
          </p>
        </div>
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
