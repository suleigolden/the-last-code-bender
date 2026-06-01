import { useState } from 'react';
import { FileCode2, Terminal, UserSearch } from 'lucide-react';
import { IDEStatusBar } from '@/components/ide/IDEStatusBar';
import { FiltersPanel } from '@/components/recruiter/FiltersPanel';
import { BenderResultCard } from '@/components/recruiter/BenderResultCard';
import { useRecruiterFilters } from '@/hooks/useRecruiterFilters';
import { DEFAULT_FILTERS, type RecruiterFilters } from '@/types/recruiter';
import { buildSkillInstallCommand } from '@/lib/skill-install';

const EXAMPLE_HANDLE = 'TheLastCodeBender';
const EXAMPLE_INSTALL = buildSkillInstallCommand(EXAMPLE_HANDLE);

export const RecruiterPage = () => {
  const [filters, setFilters] = useState<RecruiterFilters>(DEFAULT_FILTERS);
  const { filteredBenders, requiredTechs } = useRecruiterFilters(filters);

  return (
    <div className="h-screen bg-background flex flex-col noise-overlay relative overflow-hidden">
      <div className="fixed inset-0 ide-grid-bg pointer-events-none opacity-30" />

      <div className="flex flex-1 flex-col relative z-10 h-full overflow-hidden">
        <div className="flex items-center bg-ide-tabbar border-b border-border px-2 shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 mr-4 pl-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 bg-background border-r border-l border-border text-syntax-function text-sm font-mono">
            <FileCode2 className="w-4 h-4 shrink-0" />
            <span>recruit.ts</span>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">
            <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
              {/* Recruiter value prop */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 font-mono text-sm text-cyan-400">
                  <UserSearch className="w-4 h-4 shrink-0" />
                  <span>// hire-by-skill-not-slides</span>
                </div>
                <h1 className="font-mono text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                  Understand developers before the first call
                </h1>
                <div className="space-y-3 text-sm sm:text-base text-muted-foreground leading-relaxed ">
                  <p>
                    Every CodeBender on this platform turns their real GitHub activity into a{' '}
                    <span className="text-foreground">Claude Code skill</span> — a portable
                    agent others can install and invoke. As a recruiter, you can install any live
                    skill into your Claude Code CLI and work with that developer&apos;s patterns,
                    stack, and philosophy in your own session.
                  </p>
                  <p>
                    That gives you a deeper read on the person than a résumé alone: browse their{' '}
                    <span className="text-foreground">public profile</span>, review their{' '}
                    <span className="text-foreground">skill summary</span> (generated from repos,
                    languages, and contribution style), then install the skill to see how they
                    actually think and build.
                  </p>
                  <p>
                    The platform is built so you often don&apos;t need a traditional technical
                    interview loop to gauge fit — GitHub data is already encoded into a skill/agent
                    you can try yourself. Filter candidates below, open a profile, and install
                    their skill when you&apos;re ready to evaluate them hands-on.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-ide-sidebar/80 p-4 sm:p-5 space-y-3 ">
                  <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-cyan-400">
                    <Terminal className="w-4 h-4 shrink-0" />
                    <span>Install any live skill (example)</span>
                  </div>
                  <pre className="overflow-x-auto text-[11px] sm:text-xs font-mono text-foreground/90 leading-relaxed whitespace-pre rounded-md bg-background border border-border p-3 sm:p-4">
                    {EXAMPLE_INSTALL}
                  </pre>
                  <p className="font-mono text-xs text-muted-foreground">
                    Then invoke in Claude Code:{' '}
                    <code className="text-cyan-400/90">/{EXAMPLE_HANDLE}</code>
                    {' · '}Each result card links to the full profile and install flow.
                  </p>
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,280px)_1fr] gap-6">
                <aside className="lg:sticky lg:top-0 lg:self-start">
                  <FiltersPanel onChange={setFilters} />
                </aside>

                <section className="space-y-4 min-w-0">
                  <p className="font-mono text-sm text-muted-foreground">
                    // {filteredBenders.length}{' '}
                    {filteredBenders.length === 1 ? 'bender' : 'benders'} match · profile + skill
                    summary on each card
                  </p>

                  {filteredBenders.length === 0 ? (
                    <div className="text-center py-12 sm:py-16 font-mono px-4">
                      <p className="text-muted-foreground text-sm mb-2">// no_results.ts</p>
                      <p className="text-foreground text-base font-bold mb-1">No benders match</p>
                      <p className="text-muted-foreground text-sm max-w-md mx-auto">
                        Try adjusting your filters. Candidates with live skills can be installed
                        into Claude Code from their profile or card actions.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      {filteredBenders.map(({ bender, fit, stack }) => (
                        <BenderResultCard
                          key={bender.handle}
                          bender={bender}
                          fit={fit}
                          stack={stack}
                          requiredTechs={requiredTechs}
                        />
                      ))}
                    </div>
                  )}
                </section>
              </div>
            </div>
          </div>
        </main>

        <IDEStatusBar activeFile="story" />
      </div>
    </div>
  );
};
