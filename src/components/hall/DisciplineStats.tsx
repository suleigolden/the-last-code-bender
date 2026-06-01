import type { Bender } from '@/types/registry';

interface DisciplineStatsProps {
  discipline: string;
  benders: Bender[];
}

export const DisciplineStats = ({ discipline, benders }: DisciplineStatsProps) => {
  const skillsLive = benders.filter(b => b.skill_live).length;

  return (
    <div className="font-mono text-sm text-muted-foreground py-2">
      <span className="text-syntax-keyword">{'// '}</span>
      <span className="text-syntax-function">{discipline}</span>
      {': '}
      <span className="text-foreground">{benders.length}</span>
      {' ranks claimed · unlimited slots · '}
      <span className="text-foreground">{skillsLive}</span>
      {' skills live'}
    </div>
  );
};
