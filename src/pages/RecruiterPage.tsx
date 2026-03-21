import { useState } from 'react';
import { FileCode2 } from 'lucide-react';
import { IDEStatusBar } from '@/components/ide/IDEStatusBar';
import { FiltersPanel } from '@/components/recruiter/FiltersPanel';
import { BenderResultCard } from '@/components/recruiter/BenderResultCard';
import { useRecruiterFilters } from '@/hooks/useRecruiterFilters';
import { DEFAULT_FILTERS, type RecruiterFilters } from '@/types/recruiter';

export const RecruiterPage = () => {
  const [filters, setFilters] = useState<RecruiterFilters>(DEFAULT_FILTERS);
  const { filteredBenders, requiredTechs } = useRecruiterFilters(filters);

  return (
    <div className="h-screen bg-background flex flex-col noise-overlay relative overflow-hidden">
      {/* IDE Grid Background */}
      <div className="fixed inset-0 ide-grid-bg pointer-events-none opacity-30" />

      <div className="flex flex-1 flex-col relative z-10 h-full overflow-hidden">
        {/* Mini tab bar */}
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

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {/* Notice banner */}
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2">
            <p className="font-mono text-xs text-amber-400 text-center">
              // Free to browse · Contact requires a verified company account · No ads, no tracking
            </p>
          </div>

          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                {/* Filters */}
                <aside>
                  <FiltersPanel onChange={setFilters} />
                </aside>

                {/* Results */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-sm text-muted-foreground">
                      // {filteredBenders.length}{' '}
                      {filteredBenders.length === 1 ? 'Bender' : 'Benders'} match
                    </p>
                  </div>

                  {filteredBenders.length === 0 ? (
                    <div className="text-center py-16 font-mono">
                      <p className="text-muted-foreground text-sm mb-2">// no_results.ts</p>
                      <p className="text-foreground text-base font-bold mb-1">No benders match</p>
                      <p className="text-muted-foreground text-sm">
                        Try adjusting your filters to see more results.
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
