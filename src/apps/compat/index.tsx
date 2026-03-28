import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileCode2, Loader2 } from 'lucide-react';
import { IDEStatusBar } from '@/components/ide/IDEStatusBar';
import { Button } from '@/components/ui/button';
import { BenderSelector } from '@/components/compat/BenderSelector';
import { CompatResult } from '@/components/compat/CompatResult';
import { computeCompatibility } from '@/lib/compatibility';
import { useBenderList } from '@/hooks/useBenders';
import type { Bender } from '@/types/registry';
import type { StackData } from '@/types/profile';

const STALE_TIME = 5 * 60 * 1000;

function useStack(bender: Bender | null) {
  return useQuery<StackData | null>({
    queryKey: ['stack', bender?.discipline.toLowerCase(), bender?.handle],
    queryFn: () => {
      const disc = bender!.discipline.toLowerCase();
      const handle = bender!.handle;
      return fetch(`/codebenders/${disc}/${handle}/stack/stack.json`).then(r =>
        r.ok ? (r.json() as Promise<StackData>) : null,
      );
    },
    enabled: !!bender,
    staleTime: STALE_TIME,
    retry: false,
  });
}

export function CompatibilityPage() {
  const { data: registry = [] } = useBenderList();
  const [benderA, setBenderA] = useState<Bender | null>(null);
  const [benderB, setBenderB] = useState<Bender | null>(null);

  const { data: stackA, isFetching: fetchingA } = useStack(benderA);
  const { data: stackB, isFetching: fetchingB } = useStack(benderB);

  const isFetching = fetchingA || fetchingB;

  const result = useMemo(() => {
    if (!benderA || !benderB) return null;
    if (stackA === undefined || stackB === undefined) return null;
    return computeCompatibility(benderA, benderB, registry, stackA ?? null, stackB ?? null);
  }, [benderA, benderB, stackA, stackB, registry]);

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
            <span>compat.ts</span>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-8">

            {/* Header */}
            <div>
              <h1 className="text-2xl font-mono font-bold text-foreground">
                <span className="text-syntax-keyword">const</span>{' '}
                <span className="text-syntax-function">compatibilityScorer</span>{' '}
                <span className="text-muted-foreground">=</span>{' '}
                <span className="text-syntax-string">&apos;pick two benders, see how well they pair&apos;</span>
              </h1>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                {'// language overlap · tooling compatibility · skill gap coverage'}
              </p>
            </div>

            {/* Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <BenderSelector
                label="// bender_a"
                value={benderA}
                onChange={setBenderA}
                benders={registry}
                exclude={benderB?.handle}
              />
              <BenderSelector
                label="// bender_b"
                value={benderB}
                onChange={setBenderB}
                benders={registry}
                exclude={benderA?.handle}
              />
            </div>

            {/* Score button */}
            <Button
              disabled={!benderA || !benderB || isFetching}
              className="font-mono text-sm w-full sm:w-auto"
            >
              {isFetching ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading stacks…
                </>
              ) : (
                'Score compatibility'
              )}
            </Button>

            {/* Result */}
            {result && benderA && benderB && (
              <CompatResult
                result={result}
                benderA={benderA}
                benderB={benderB}
                stackA={stackA ?? null}
                stackB={stackB ?? null}
              />
            )}

          </div>
        </main>

        <IDEStatusBar activeFile="story" />
      </div>
    </div>
  );
}
