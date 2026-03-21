import type { Bender } from '@/types/registry';

interface DisciplineStatsProps {
  discipline: string;
  benders: Bender[];
  totalSlots: number;
}

export const DisciplineStats = ({ discipline, benders, totalSlots }: DisciplineStatsProps) => {
  const skillsLive = benders.filter(b => b.skill_live).length;

  return (
    <div className="font-mono text-sm text-muted-foreground py-2">
      <span className="text-syntax-keyword">{'// '}</span>
      <span className="text-syntax-function">{discipline}</span>
      {': '}
      <span className="text-foreground">{benders.length}</span>
      {' / '}
      <span className="text-foreground">{totalSlots}</span>
      {' ranks claimed · '}
      <span className="text-foreground">{skillsLive}</span>
      {' skills live'}
    </div>
  );
};
