import { cn } from "@/lib/utils";

type LineNumbersProps = {
  count: number;
  highlightedLines?: number[];
  className?: string;
}

export const LineNumbers = ({ count, highlightedLines = [], className }: LineNumbersProps) => {
  return (
    <div className={cn("flex flex-col items-end pr-4 select-none text-ide-gutter font-mono text-sm", className)}>
      {Array.from({ length: count }, (_, i) => i + 1).map((num) => (
        <span
          key={num}
          className={cn(
            "leading-7",
            highlightedLines.includes(num) && "text-foreground"
          )}
        >
          {num}
        </span>
      ))}
    </div>
  );
};
