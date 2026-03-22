import { useState, useMemo } from 'react';
import { Search, Trophy } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { IDEStatusBar } from '@/components/ide/IDEStatusBar';
import { BenderCard } from '@/components/hall/BenderCard';
import { UnclaimedCard } from '@/components/hall/UnclaimedCard';
import { DisciplineStats } from '@/components/hall/DisciplineStats';
import { FounderCard } from '@/components/hall/FounderCard';
import { BENDER_PROFILES } from '@/codebender-profiles/registry';
import { useRegistry, useRegistryStats } from '@/hooks/useRegistry';
import { getBendingSpecializationsWithRanks } from '@/lib/code-bender-names';
import type { Bender } from '@/types/registry';
import { IDEWindowControls } from '@/components/ide/IDEWindowControls';

const SPEC_ID_TO_DISCIPLINE: Record<string, string> = {
  'frontend-bender': 'Frontend',
  'backend-bender': 'Backend',
  'fullstack-bender': 'FullStack',
  'security-bender': 'Security',
  'ai-bender': 'AI',
  'devops-bender': 'DevOps',
};

const DISCIPLINES = ['All', 'Frontend', 'Backend', 'FullStack', 'Security', 'AI', 'DevOps'];
const TOTAL_SLOTS = 1200;
const SLOTS_PER_DISCIPLINE = 200;

type SortBy = 'tier' | 'xp' | 'recent' | 'wins';

type RankedSlot = {
  displayName: string;
  discipline: string;
  bender: Bender | null;
};

const STAT_CARDS = [
  { key: 'totalBenders', label: 'Total Benders' },
  { key: 'skillsLive', label: 'Skills Live' },
  { key: 'openToWork', label: 'Open to Work' },
  { key: 'slotsRemaining', label: 'Slots Remaining' },
] as const;

export const HallOfFamePage = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('tier');

  const { data: registry, isLoading } = useRegistry();
  const { data: stats } = useRegistryStats();

  const showFounder =
    activeTab === 'All' &&
    (!search.trim() || BENDER_PROFILES[0].handle.toLowerCase().includes(search.toLowerCase()));

  const statValues: Record<string, number | undefined> = {
    totalBenders: stats?.totalBenders,
    skillsLive: stats?.skillsLive,
    openToWork: stats?.openToWork,
    slotsRemaining: stats !== undefined ? TOTAL_SLOTS - stats.totalBenders : undefined,
  };

  // O(1) lookup map keyed by handle lowercase
  const benderMap = useMemo(
    () => new Map((registry ?? []).map(b => [b.handle.toLowerCase(), b])),
    [registry],
  );

  // All 1200 slots — built once when benderMap stabilises
  const allSlots = useMemo((): RankedSlot[] => {
    const specs = getBendingSpecializationsWithRanks();
    const slots: RankedSlot[] = [];
    for (const spec of specs) {
      const discipline = SPEC_ID_TO_DISCIPLINE[spec.id] ?? spec.label;
      for (const benderRank of spec.benders) {
        const bender = benderMap.get(benderRank.displayName.toLowerCase()) ?? null;
        slots.push({ displayName: benderRank.displayName, discipline, bender });
      }
    }
    return slots;
  }, [benderMap]);

  // Benders for the active discipline tab (drives DisciplineStats)
  const disciplineBenders = useMemo(() => {
    if (activeTab === 'All') return registry ?? [];
    return (registry ?? []).filter(b => b.discipline === activeTab);
  }, [registry, activeTab]);

  // Filter → search → sort pipeline
  const visibleSlots = useMemo(() => {
    let slots = activeTab === 'All' ? allSlots : allSlots.filter(s => s.discipline === activeTab);

    if (search.trim()) {
      const q = search.toLowerCase();
      slots = slots.filter(s => s.displayName.toLowerCase().includes(q));
    }

    const claimed = slots.filter(s => s.bender !== null);
    const unclaimed = slots.filter(s => s.bender === null);

    if (sortBy === 'xp') {
      claimed.sort((a, b) => b.bender!.xp - a.bender!.xp);
    } else if (sortBy === 'recent') {
      claimed.sort(
        (a, b) =>
          new Date(b.bender!.last_active).getTime() -
          new Date(a.bender!.last_active).getTime(),
      );
    } else if (sortBy === 'wins') {
      claimed.sort((a, b) => b.bender!.challenge_wins - a.bender!.challenge_wins);
    }
    // 'tier' sort: no-op; preserves original tier position within each group

    slots = [...claimed, ...unclaimed];

    return slots;
  }, [allSlots, activeTab, search, sortBy]);

  return (
    <div className="h-screen bg-background flex flex-col noise-overlay relative overflow-hidden">
      {/* IDE Grid Background */}
      <div className="fixed inset-0 ide-grid-bg pointer-events-none opacity-30" />

      <div className="flex flex-1 flex-col relative z-10 h-full overflow-hidden">
        {/* IDE Tab Bar */}
        <div className="flex items-center bg-ide-tabbar border-b border-border px-2 shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 mr-4 pl-2">
            <IDEWindowControls url="/" />
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 bg-background border-r border-l border-border text-syntax-function text-sm font-mono">
            <Trophy className="w-4 h-4 shrink-0" />
            <span>HALL_OF_FAME.ts</span>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page header */}
            <div>
              <h1 className="text-2xl font-mono font-bold text-foreground">
                <span className="text-syntax-keyword">const</span>{' '}
                <span className="text-syntax-function">hallOfFame</span>{' '}
                <span className="text-muted-foreground">=</span>{' '}
                <span className="text-syntax-string">"1,200 ranks · one developer each · forever"</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1 font-mono">
                Claim your rank. Build your legacy.
              </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {STAT_CARDS.map(({ key, label }) => (
                <Card key={key} className="bg-ide-sidebar border-border">
                  <CardContent className="p-4">
                    <p className="font-mono text-xs text-muted-foreground mb-1">{label}</p>
                    {statValues[key] === undefined ? (
                      <Skeleton className="h-7 w-16" />
                    ) : (
                      <p className="font-mono text-2xl font-bold text-foreground">
                        {statValues[key]!.toLocaleString()}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Filters */}
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
                  placeholder="Search ranks..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 font-mono text-sm"
                />
              </div>
            </div>

            {/* DisciplineStats strip */}
            {activeTab !== 'All' && !isLoading && (
              <DisciplineStats
                discipline={activeTab}
                benders={disciplineBenders}
                totalSlots={SLOTS_PER_DISCIPLINE}
              />
            )}

            {/* Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 24 }).map((_, i) => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>
            ) : visibleSlots.length === 0 ? (
              <p className="font-mono text-sm text-muted-foreground">
                // No ranks match your search.
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {showFounder && <FounderCard />}
                {visibleSlots.map(slot =>
                  slot.bender ? (
                    <BenderCard key={slot.displayName} bender={slot.bender} />
                  ) : (
                    <UnclaimedCard
                      key={slot.displayName}
                      rankName={slot.displayName}
                      discipline={slot.discipline}
                    />
                  ),
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
