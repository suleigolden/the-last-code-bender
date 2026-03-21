import { cn } from '@/lib/utils';
import type { RadarEntry } from '@/types/registry';
import { TechPill } from './TechPill';

const QUADRANT_META = {
  adopt:  { label: 'Adopt',  color: 'text-green-400', dot: 'bg-green-400', desc: 'Proven, recommended for new projects' },
  trial:  { label: 'Trial',  color: 'text-blue-400',  dot: 'bg-blue-400',  desc: 'Worth exploring on low-risk projects' },
  assess: { label: 'Assess', color: 'text-amber-400', dot: 'bg-amber-400', desc: 'Keep an eye on — not ready for prime time' },
  hold:   { label: 'Hold',   color: 'text-red-400',   dot: 'bg-red-400',   desc: 'Use with caution; falling adoption' },
};

interface RadarQuadrantProps {
  position: 'adopt' | 'trial' | 'assess' | 'hold';
  techs: RadarEntry[];
  selectedTech: string | null;
  onTechClick: (tech: string) => void;
}

export function RadarQuadrant({ position, techs, selectedTech, onTechClick }: RadarQuadrantProps) {
  const meta = QUADRANT_META[position];

  return (
    <div className="bg-ide-sidebar border border-border rounded-lg p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className={cn('w-2.5 h-2.5 rounded-full', meta.dot)} />
        <h2 className={cn('font-mono text-sm font-semibold', meta.color)}>{meta.label}</h2>
      </div>
      <p className="font-mono text-xs text-muted-foreground">{meta.desc}</p>
      {techs.length === 0 ? (
        <p className="font-mono text-xs text-muted-foreground/50">// No entries yet</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {techs.map(t => (
            <TechPill
              key={t.tech}
              tech={t.tech}
              category={t.category}
              benderCount={t.bender_count}
              selected={selectedTech === t.tech}
              onClick={() => onTechClick(t.tech)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
