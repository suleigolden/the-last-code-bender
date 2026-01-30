import { FileCode, FileJson, FileText, X, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = {
  id: string;
  name: string;
  icon: React.ReactNode;
}

type IDETabBarProps = {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const tabs: Tab[] = [
  { id: "readme", name: "README.md", icon: <FileText className="w-4 h-4 text-syntax-string" /> },
  { id: "story", name: "STORY.ts", icon: <FileCode className="w-4 h-4 text-syntax-keyword" /> },
  { id: "socials", name: "SOCIALS.json", icon: <FileJson className="w-4 h-4 text-syntax-function" /> },
];

export const IDETabBar = ({ activeTab, onTabChange, onToggleSidebar, isSidebarOpen }: IDETabBarProps) => {
  return (
    <div className="flex items-center bg-ide-tab border-b border-border">
      {/* Mobile menu button */}
      <button
        onClick={onToggleSidebar}
        className="lg:hidden p-3 hover:bg-muted transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-5 h-5 text-muted-foreground" />
      </button>

      {/* Tabs */}
      <div className="flex-1 flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "ide-tab flex items-center gap-2 px-4 py-2.5 font-mono text-sm whitespace-nowrap transition-colors group",
              activeTab === tab.id
                ? "bg-background text-foreground active"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
            )}
          >
            {tab.icon}
            <span>{tab.name}</span>
            <X
              className={cn(
                "w-3.5 h-3.5 ml-1 opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity",
                "cursor-pointer"
              )}
            />
          </button>
        ))}
      </div>

      {/* Window controls (decorative) */}
      <div className="hidden md:flex items-center gap-2 px-4">
        <div className="w-3 h-3 rounded-full bg-destructive/60" />
        <div className="w-3 h-3 rounded-full bg-syntax-function/60" />
        <div className="w-3 h-3 rounded-full bg-syntax-string/60" />
      </div>
    </div>
  );
};
