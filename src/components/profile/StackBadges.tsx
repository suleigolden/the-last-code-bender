import { Badge } from '@/components/ui/badge';
import type { StackData, StackItem } from '@/types/profile';

interface StackBadgesProps {
  data: StackData;
}

const CATEGORY_ORDER = ['language', 'framework', 'db', 'devops', 'other'] as const;

function groupByCategory(items: StackItem[]): Record<string, StackItem[]> {
  const groups: Record<string, StackItem[]> = {};
  for (const item of items) {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  }
  return groups;
}

interface ColumnProps {
  title: string;
  items: StackItem[];
  variant: 'default' | 'outline' | 'secondary';
}

const StackColumn = ({ title, items, variant }: ColumnProps) => {
  const groups = groupByCategory(items);
  const categories = CATEGORY_ORDER.filter((c) => groups[c]?.length);

  return (
    <div>
      <p className="text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider">{title}</p>
      {categories.length === 0 ? (
        <p className="text-xs text-muted-foreground font-mono">—</p>
      ) : (
        categories.map((cat) => (
          <div key={cat} className="mb-3">
            <p className="text-xs text-muted-foreground font-mono mb-1">{cat}</p>
            <div className="flex flex-wrap gap-1.5">
              {groups[cat].map((item) => (
                <Badge key={item.tech} variant={variant} className="font-mono text-xs">
                  {item.tech}
                </Badge>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export const StackBadges = ({ data }: StackBadgesProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StackColumn title="Primary" items={data.primary} variant="default" />
      <StackColumn title="Familiar" items={data.familiar} variant="outline" />
      <StackColumn title="Aware" items={data.aware} variant="secondary" />
    </div>
  );
};
