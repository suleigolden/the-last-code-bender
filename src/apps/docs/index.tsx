import { useState } from 'react';
import { IDEStatusBar } from '@/components/ide/IDEStatusBar';
import { IDEWindowControls } from '@/components/ide/IDEWindowControls';
import { cn } from '@/lib/utils';
import { AboutSection } from './/AboutSection';
import { ContributingSection } from './ContributingSection';
import { SkillSection } from './SkillSection';
import { RulesSection } from './RulesSection';
import { BookOpen } from 'lucide-react';
import { SectionId, SECTIONS } from './docs-shared';

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
