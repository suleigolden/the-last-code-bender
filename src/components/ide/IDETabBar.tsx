import { FileCode, FileJson, FileText, Image, X, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { fileNames } from "@/lib/helper";

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
  isCodeBender?: boolean;
  codeBenderName?: string;
  codeBenderId?: string;
}

const landingPageTabs: Tab[] = [
  { id: fileNames.readme.toLowerCase(), name: fileNames.readme, icon: <FileText className="w-4 h-4 text-syntax-string" /> },
  { id: fileNames.story.toLowerCase(), name: fileNames.story, icon: <FileCode className="w-4 h-4 text-syntax-keyword" /> },
  { id: fileNames.stack.toLowerCase(), name: fileNames.stack, icon: <FileCode className="w-4 h-4 text-syntax-type" /> },
  { id: fileNames.socials.toLowerCase(), name: fileNames.socials, icon: <FileJson className="w-4 h-4 text-syntax-function" /> },
];

const codeBenderTabs: Tab[] = [
  { id: fileNames.story.toLowerCase(), name: fileNames.story, icon: <FileCode className="w-4 h-4 text-syntax-keyword" /> },
  { id: fileNames.stack.toLowerCase(), name: fileNames.stack, icon: <FileCode className="w-4 h-4 text-syntax-type" /> },
  { id: fileNames.assets.toLowerCase(), name: fileNames.assets, icon: <Image className="w-4 h-4 text-syntax-number" /> },
  { id: fileNames.socials.toLowerCase(), name: fileNames.socials, icon: <FileJson className="w-4 h-4 text-syntax-function" /> },
];


export const IDETabBar = ({ activeTab, onTabChange, onToggleSidebar, isSidebarOpen, isCodeBender = false, codeBenderName, codeBenderId }: IDETabBarProps) => {
  const tabs = isCodeBender ? codeBenderTabs : landingPageTabs;
  
  const handleTabClick = (tabId: string) => {
    if (isCodeBender && codeBenderId) {
      // Prefix with codebender-{id}- for Code Bender navigation
      onTabChange(`codebender-${codeBenderId.toLowerCase()}-${tabId}`);
    } else {
      onTabChange(tabId);
    }
  };

  // Extract the actual tab ID from activeTab (remove codebender prefix if present)
  const getActiveTabId = () => {
    if (isCodeBender && codeBenderId && activeTab.startsWith(`codebender-${codeBenderId.toLowerCase()}-`)) {
      return activeTab.replace(`codebender-${codeBenderId.toLowerCase()}-`, "");
    }
    return activeTab;
  };

  const currentActiveTab = getActiveTabId();

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

      {/* Code Bender Name Display */}
      {isCodeBender && codeBenderName && (
        <div className="px-4 py-2.5 border-r border-border">
          <span className="font-mono text-sm font-semibold text-foreground">
            {codeBenderName}
          </span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex-1 flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              "ide-tab flex items-center gap-2 px-4 py-2.5 font-mono text-sm whitespace-nowrap transition-colors group",
              currentActiveTab === tab.id
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
