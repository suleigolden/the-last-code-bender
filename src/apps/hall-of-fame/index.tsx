import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Trophy } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { IDEStatusBar } from '@/components/ide/IDEStatusBar';
import { BenderCard } from '@/components/hall/BenderCard';
import { DisciplineStats } from '@/components/hall/DisciplineStats';
import { FounderCard } from '@/components/hall/FounderCard';
import { useAllBenders, useBenderStats } from '@/hooks/useBenders';
import { rowToBender } from '@/lib/bender-adapter';
import { IDEWindowControls } from '@/components/ide/IDEWindowControls';

const FOUNDER_HANDLE = 'TheLastCodeBender';

const DISCIPLINES = ['All', 'Frontend', 'Backend', 'FullStack', 'Security', 'AI', 'DevOps', 'QA'];
const PAGE_SIZE = 40;

type SortBy = 'tier' | 'xp' | 'recent' | 'wins';

const TIER_ORDER: Record<string, number> = {
  TheLastCodeBender: 0,
  Master: 1,
  Senior: 2,
  Journeyman: 3,
  Apprentice: 4,
};

const STAT_CARDS = [
  { key: 'totalBenders', label: 'Total Benders' },
  { key: 'skillsLive', label: 'Skills Live' },
  { key: 'openToWork', label: 'Open to Work' },
  { key: 'rankSlots', label: 'Rank Slots', value: 'Unlimited' },
] as const;

export const HallOfFamePage = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('tier');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadMoreInView, setLoadMoreInView] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const loadMoreSentinelRef = useRef<HTMLDivElement>(null);

  const { data: rows, isLoading, error } = useAllBenders();
  const { data: stats } = useBenderStats();

  const registry = useMemo(() => (rows ?? []).map(rowToBender), [rows]);

  const showFounder =
    activeTab === 'All' &&
    (!search.trim() || FOUNDER_HANDLE.toLowerCase().includes(search.toLowerCase()));

  const statValues: Record<string, number | string | undefined> = {
    totalBenders: stats?.totalBenders,
    skillsLive: stats?.skillsLive,
    openToWork: stats?.openToWork,
    rankSlots: 'Unlimited',
  };

  const disciplineBenders = useMemo(() => {
    if (activeTab === 'All') return registry;
    return registry.filter(b => b.discipline === activeTab);
  }, [registry, activeTab]);

  const visibleBenders = useMemo(() => {
    let list =
      activeTab === 'All' ? registry : registry.filter(b => b.discipline === activeTab);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        b =>
          b.handle.toLowerCase().includes(q) ||
          b.github.toLowerCase().includes(q) ||
          b.discipline.toLowerCase().includes(q),
      );
    }

    const sorted = [...list];

    if (sortBy === 'xp') {
      sorted.sort((a, b) => b.xp - a.xp);
    } else if (sortBy === 'recent') {
      sorted.sort(
        (a, b) =>
          new Date(b.last_active).getTime() - new Date(a.last_active).getTime(),
      );
    } else if (sortBy === 'wins') {
      sorted.sort((a, b) => b.challenge_wins - a.challenge_wins);
    } else {
      sorted.sort(
        (a, b) =>
          (TIER_ORDER[a.rank] ?? 99) - (TIER_ORDER[b.rank] ?? 99) ||
          b.xp - a.xp,
      );
    }

    return sorted;
  }, [registry, activeTab, search, sortBy]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeTab, search, sortBy]);

  const displayedBenders = useMemo(
    () => visibleBenders.slice(0, visibleCount),
    [visibleBenders, visibleCount],
  );

  const hasMore = visibleCount < visibleBenders.length;
  const remaining = Math.max(0, visibleBenders.length - visibleCount);

  useEffect(() => {
    const root = mainRef.current;
    const target = loadMoreSentinelRef.current;
    if (!root || !target || !hasMore) {
      setLoadMoreInView(false);
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        setLoadMoreInView(Boolean(entry?.isIntersecting));
      },
      { root, rootMargin: '120px', threshold: 0 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, visibleCount, visibleBenders.length, isLoading]);

  return (
    <div className="h-screen bg-background flex flex-col noise-overlay relative overflow-hidden">
      <div className="fixed inset-0 ide-grid-bg pointer-events-none opacity-30" />

      <div className="flex flex-1 flex-col relative z-10 h-full overflow-hidden">
        <div className="flex items-center bg-ide-tabbar border-b border-border px-2 shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 mr-4 pl-2">
            <IDEWindowControls url="/" />
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 bg-background border-r border-l border-border text-syntax-function text-sm font-mono">
            <Trophy className="w-4 h-4 shrink-0" />
            <span>HALL_OF_FAME.ts</span>
          </div>
        </div>

        <main ref={mainRef} className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-mono font-bold text-foreground">
                <span className="text-syntax-keyword">const</span>{' '}
                <span className="text-syntax-function">hallOfFame</span>{' '}
                <span className="text-muted-foreground">=</span>{' '}
                <span className="text-syntax-string">
                  &quot;Unlimited ranks · every discipline · one developer each · forever&quot;
                </span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1 font-mono">
                Claim your rank. Build your legacy.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {STAT_CARDS.map(({ key, label, ...rest }) => (
                <Card key={key} className="bg-ide-sidebar border-border">
                  <CardContent className="p-4">
                    <p className="font-mono text-xs text-muted-foreground mb-1">{label}</p>
                    {'value' in rest ? (
                      <p className="font-mono text-2xl font-bold text-foreground">{rest.value}</p>
                    ) : statValues[key] === undefined ? (
                      <Skeleton className="h-7 w-16" />
                    ) : (
                      <p className="font-mono text-2xl font-bold text-foreground">
                        {typeof statValues[key] === 'number'
                          ? statValues[key]!.toLocaleString()
                          : statValues[key]}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 min-w-0">
                  <TabsList className="font-mono flex-wrap h-auto gap-1">
                    {DISCIPLINES.map(d => (
                      <TabsTrigger key={d} value={d} className="text-xs">
                        {d}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
                <Select value={sortBy} onValueChange={v => setSortBy(v as SortBy)}>
                  <SelectTrigger className="w-36 font-mono text-xs shrink-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="font-mono text-xs">
                    <SelectItem value="tier">Sort: Tier</SelectItem>
                    <SelectItem value="xp">Sort: XP</SelectItem>
                    <SelectItem value="recent">Sort: Recent</SelectItem>
                    <SelectItem value="wins">Sort: Wins</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search benders..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 font-mono text-sm"
                />
              </div>
            </div>

            {activeTab !== 'All' && !isLoading && (
              <DisciplineStats discipline={activeTab} benders={disciplineBenders} />
            )}

            {error && (
              <p className="font-mono text-sm text-red-500">
                // Error loading benders: {error.message}
              </p>
            )}

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 24 }).map((_, i) => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>
            ) : visibleBenders.length === 0 ? (
              <p className="font-mono text-sm text-muted-foreground">
                // No benders match your filters yet — ranks are unlimited, claim yours from the
                dashboard.
              </p>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {showFounder && <FounderCard />}
                  {displayedBenders.map(bender => (
                    <div key={bender.handle} className="relative">
                      <BenderCard bender={bender} isPublished={bender.isPublished} />
                    </div>
                  ))}
                </div>

                {hasMore && (
                  <>
                    <div
                      ref={loadMoreSentinelRef}
                      className="h-px w-full shrink-0"
                      aria-hidden
                    />
                    {loadMoreInView && (
                      <div className="flex flex-col items-center gap-2 pb-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="font-mono text-sm"
                          onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                        >
                          Load more ({Math.min(PAGE_SIZE, remaining)} more
                          {remaining > PAGE_SIZE ? ` · ${remaining} left` : ''})
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </main>

        <IDEStatusBar activeFile="story" />
      </div>
    </div>
  );
};
