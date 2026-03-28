import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronDown, ChevronRight, Folder, FolderOpen, FileCode2, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBenderList } from '@/hooks/useBenders';

const DISCIPLINES: { key: string; label: string }[] = [
  { key: 'frontend', label: 'Frontend Bender' },
  { key: 'backend', label: 'Backend Bender' },
  { key: 'fullstack', label: 'FullStack Bender' },
  { key: 'security', label: 'Security Bender' },
  { key: 'ai', label: 'AI Bender' },
  { key: 'devops', label: 'DevOps Bender' },
];

export const ProfileExplorer = () => {
  const navigate = useNavigate();
  const { discipline: currentDiscipline, handle: currentHandle } = useParams<{
    discipline: string;
    handle: string;
  }>();

  const { data: registry } = useBenderList();

  const [founderOpen, setFounderOpen] = useState(false);
  const [codeBendersOpen, setCodeBendersOpen] = useState(true);
  const [openDisciplines, setOpenDisciplines] = useState<Record<string, boolean>>({});

  const bendersByDiscipline = DISCIPLINES.reduce<Record<string, { handle: string; discipline: string }[]>>(
    (acc, d) => {
      acc[d.key] = (registry ?? []).filter(
        (b) => b.discipline.toLowerCase() === d.key,
      );
      return acc;
    },
    {},
  );

  const toggleDiscipline = (key: string) =>
    setOpenDisciplines((prev) => ({ ...prev, [key]: !prev[key] }));

  const isFounderActive =
    currentDiscipline === 'founder' &&
    currentHandle?.toLowerCase() === 'thelastcodebender';

  const isBenderActive = (discipline: string, handle: string) =>
    discipline.toLowerCase() === currentDiscipline?.toLowerCase() &&
    handle.toLowerCase() === currentHandle?.toLowerCase();

  return (
    <aside className="w-56 shrink-0 h-full bg-sidebar border-r border-border flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border shrink-0">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Explorer
        </span>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto py-2">
        {/* thelastcodebender */}
        <div>
          <div
            className="file-tree-item select-none"
            style={{ paddingLeft: '12px' }}
            onClick={() => setFounderOpen((o) => !o)}
          >
            {founderOpen ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            )}
            {founderOpen ? (
              <FolderOpen className="w-4 h-4 text-syntax-function shrink-0" />
            ) : (
              <Folder className="w-4 h-4 text-syntax-function shrink-0" />
            )}
            <span className="truncate font-mono text-xs">thelastcodebender</span>
          </div>

          {founderOpen && (
            <div
              className={cn('file-tree-item select-none', isFounderActive && 'active')}
              style={{ paddingLeft: '36px' }}
              onClick={() => navigate('/benders/founder/TheLastCodeBender')}
            >
              <span className="w-4 shrink-0" />
              <FileCode2 className="w-4 h-4 text-syntax-function shrink-0" />
              <span className="truncate font-mono text-xs">profile.ts</span>
            </div>
          )}
        </div>

        {/* code-benders */}
        <div>
          <div
            className="file-tree-item select-none"
            style={{ paddingLeft: '12px' }}
            onClick={() => setCodeBendersOpen((o) => !o)}
          >
            {codeBendersOpen ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            )}
            {codeBendersOpen ? (
              <FolderOpen className="w-4 h-4 text-syntax-function shrink-0" />
            ) : (
              <Folder className="w-4 h-4 text-syntax-function shrink-0" />
            )}
            <span className="truncate font-mono text-xs">code-benders</span>
          </div>

          {codeBendersOpen && (
            <div>
              {DISCIPLINES.map((d) => {
                const isOpen = !!openDisciplines[d.key];
                const benders = bendersByDiscipline[d.key] ?? [];
                return (
                  <div key={d.key}>
                    <div
                      className="file-tree-item select-none"
                      style={{ paddingLeft: '24px' }}
                      onClick={() => toggleDiscipline(d.key)}
                    >
                      {isOpen ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                      )}
                      {isOpen ? (
                        <FolderOpen className="w-4 h-4 text-syntax-function shrink-0" />
                      ) : (
                        <Folder className="w-4 h-4 text-syntax-function shrink-0" />
                      )}
                      <span className="truncate font-mono text-xs">{d.label}</span>
                    </div>

                    {isOpen && (
                      <div>
                        {benders.length === 0 ? (
                          <div
                            className="file-tree-item select-none pointer-events-none opacity-50"
                            style={{ paddingLeft: '48px' }}
                          >
                            <span className="w-4 shrink-0" />
                            <span className="font-mono text-xs italic">// unclaimed</span>
                          </div>
                        ) : (
                          benders.map((b) => (
                            <div
                              key={b.handle}
                              className={cn(
                                'file-tree-item select-none',
                                isBenderActive(d.key, b.handle) && 'active',
                              )}
                              style={{ paddingLeft: '48px' }}
                              onClick={() => navigate(`/benders/${d.key}/${b.handle}`)}
                            >
                              <span className="w-4 shrink-0" />
                              <User className="w-3.5 h-3.5 text-syntax-function shrink-0" />
                              <span className="truncate font-mono text-xs">{b.handle}</span>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
