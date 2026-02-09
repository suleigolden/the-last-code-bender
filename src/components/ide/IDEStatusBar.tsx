import { GitBranch, Check, Zap, Code2 } from "lucide-react";

type IDEStatusBarProps = {
  activeFile: string;
}

const fileExtensions: Record<string, string> = {
  readme: "Markdown",
  story: "TypeScript",
  stack: "Markdown",
  socials: "JSON",
  portrait: "PNG Image",
};

export const IDEStatusBar = ({ activeFile }: IDEStatusBarProps) => {
  return (
    <footer className="flex items-center justify-between bg-ide-statusbar border-t border-border px-4 py-1 text-xs font-mono">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-primary">
          <GitBranch className="w-3.5 h-3.5" />
          <span>main</span>
        </div>
        <div className="flex items-center gap-1.5 text-syntax-string">
          <Check className="w-3.5 h-3.5" />
          <span>Status: Shipping</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-syntax-function">
          <Zap className="w-3.5 h-3.5" />
          <span>Mode: Learning</span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 text-muted-foreground">
        <span className="hidden sm:inline">Ln 42, Col 8</span>
        <span className="hidden md:inline">Spaces: 2</span>
        <span className="hidden md:inline">UTF-8</span>
        <div className="flex items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5" />
          <span>{fileExtensions[activeFile] || "Unknown"}</span>
        </div>
        <span className="text-primary">Build: v1.0</span>
      </div>
    </footer>
  );
};
