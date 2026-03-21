import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const CATEGORY_COLORS: Record<string, string> = {
  language:  'bg-purple-500/15 text-purple-400 border-purple-500/30',
  framework: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
  database:  'bg-blue-500/15 text-blue-400 border-blue-500/30',
  devops:    'bg-orange-500/15 text-orange-400 border-orange-500/30',
  testing:   'bg-green-500/15 text-green-400 border-green-500/30',
  css:       'bg-pink-500/15 text-pink-400 border-pink-500/30',
  other:     'bg-muted/40 text-muted-foreground border-border',
};

interface TechPillProps {
  tech: string;
  category: string;
  benderCount: number;
  selected?: boolean;
  onClick?: () => void;
}

export function TechPill({ tech, category, benderCount, selected, onClick }: TechPillProps) {
  const colorClass = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.other;

  return (
    <Badge
      variant="outline"
      onClick={onClick}
      className={cn(
        'font-mono text-sm gap-1 border',
        colorClass,
        selected && 'ring-2 ring-primary',
        onClick && 'cursor-pointer',
      )}
    >
      <span>{tech}</span>
      <span className="opacity-50">·</span>
      <span className="text-xs opacity-70">{category}</span>
      <span className="text-xs opacity-70">×{benderCount}</span>
    </Badge>
  );
}
