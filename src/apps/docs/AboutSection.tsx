import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Block, Cm, DisciplineBadge, Fn, Kw, Mut, SectionHeader, Str } from './docs-shared';

export function AboutSection() {
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
        subtitle="// An open-source developer legacy — 1,400 unique ranks, one developer per rank, forever."
      />

      <Block title="ABOUT.md — What is this?">
        <div className="space-y-4 text-sm font-mono">
          <p className="text-muted-foreground leading-relaxed">
            <Cm>{'/**'}</Cm>
            <br />
            <Cm>{' * The Last Code Bender is a developer legacy project.'}</Cm>
            <br />
            <Cm>{' * 1,400 unique ranks are available — one per developer, forever.'}</Cm>
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
            { keyName: 'frontend', color: 'text-syntax-keyword border-syntax-keyword', label: 'Frontend Bender', desc: '200 ranks — UI, React, CSS masters' },
            { keyName: 'backend', color: 'text-syntax-function border-syntax-function', label: 'Backend Bender', desc: '200 ranks — APIs, databases, servers' },
            { keyName: 'fullstack', color: 'text-syntax-string border-syntax-string', label: 'FullStack Bender', desc: '200 ranks — end-to-end builders' },
            { keyName: 'security', color: 'text-syntax-variable border-syntax-variable', label: 'Security Bender', desc: '200 ranks — AppSec, hacking, defense' },
            { keyName: 'ai', color: 'text-primary border-primary', label: 'AI Bender', desc: '200 ranks — ML, LLMs, data science' },
            { keyName: 'devops', color: 'text-muted-foreground border-border', label: 'DevOps Bender', desc: '200 ranks — infra, CI/CD, cloud' },
            { keyName: 'qa', color: 'text-syntax-number border-syntax-number', label: 'QA Bender', desc: '200 ranks — testing, quality, reliability' },
          ].map((d) => (
            <DisciplineBadge key={d.keyName} {...d} />
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
              { tier: 'Apprentice', range: '1–50', color: 'bg-muted/60 text-muted-foreground' },
              { tier: 'Journeyman', range: '51–100', color: 'text-syntax-string bg-[hsl(95_60%_55%/0.15)]' },
              { tier: 'Senior', range: '101–150', color: 'text-syntax-function bg-[hsl(35_90%_65%/0.15)]' },
              { tier: 'Master', range: '151–200', color: 'text-primary bg-primary/15' },
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
            ['Tailwind CSS 3 + shadcn/ui', 'styling'],
            ['React Router DOM 6', 'routing'],
            ['TanStack React Query 5', 'data'],
            ['Vitest + Testing Library', 'testing'],
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

