import { GitBranch, Check, Zap, Code2 } from "lucide-react";

type IDEStatusBarProps = {
  activeFile: string;
  codeBenderName?: string;
}

const fileExtensions: Record<string, string> = {
  readme: "Markdown",
  story: "TypeScript",
  stack: "Markdown",
  socials: "JSON",
  portrait: "PNG Image",
  assets: "Assets",
};

export const IDEStatusBar = ({ activeFile, codeBenderName }: IDEStatusBarProps) => {
  // Extract the actual file type from activeFile (remove codebender prefix if present)
  const getFileType = () => {
    // Check if it's a Code Bender section (format: codebender-{id}-{section})
    if (activeFile.includes("-")) {
      const parts = activeFile.split("-");
      if (parts.length >= 3 && parts[0] === "codebender") {
        const section = parts.slice(2).join("-");
        return fileExtensions[section] || "Unknown";
      }
    }
    return fileExtensions[activeFile] || "Unknown";
  };
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
          <span>{codeBenderName ? codeBenderName : "Status: TheLastCodeBender"}</span>
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
          <span>{getFileType()}</span>
        </div>
        <span className="text-primary">Build: v1.0</span>
      </div>
    </footer>
  );
};
