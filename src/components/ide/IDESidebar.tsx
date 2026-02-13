import { ChevronDown, ChevronRight, FileCode, FileJson, FileText, Folder, Image } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

type FileItem = {
  name: string;
  type: "file" | "folder";
  icon?: React.ReactNode;
  children?: FileItem[];
  section?: string;
}

type IDESidebarProps = {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

// Generate Code Bender folders
const generateCodeBenderFolders = (): FileItem[] => {
  const codeBenders = [
    "TheFirstCodeBender", "TheSecondCodeBender", "TheThirdCodeBender",
    "TheFourthCodeBender", "TheFifthCodeBender", "TheSixthCodeBender",
    "TheSeventhCodeBender", "TheEighthCodeBender", "TheNinthCodeBender",
    "TheTenthCodeBender", "TheEleventhCodeBender", "TheTwelfthCodeBender",
    "TheThirteenthCodeBender", "TheFourteenthCodeBender", "TheFifteenthCodeBender"
  ];

  return codeBenders.map((benderName) => ({
    name: benderName.toLowerCase(),
    type: "folder" as const,
    section: `codebender-${benderName.toLowerCase()}`,
    children: [
      {
        name: "story",
        type: "folder" as const,
        children: [
          { 
            name: "README.md", 
            type: "file" as const, 
            icon: <FileText className="w-4 h-4 text-syntax-keyword" />, 
            section: `codebender-${benderName.toLowerCase()}-story` 
          },
        ],
      },
      {
        name: "stack",
        type: "folder" as const,
        children: [
          { 
            name: "README.md", 
            type: "file" as const, 
            icon: <FileCode className="w-4 h-4 text-syntax-type" />, 
            section: `codebender-${benderName.toLowerCase()}-stack` 
          },
        ],
      },
      {
        name: "assets",
        type: "folder" as const,
        children: [
          { 
            name: "README.md", 
            type: "file" as const, 
            icon: <Image className="w-4 h-4 text-syntax-number" />, 
            section: `codebender-${benderName.toLowerCase()}-assets` 
          },
        ],
      },
      {
        name: "socials",
        type: "folder" as const,
        children: [
          { 
            name: "README.md", 
            type: "file" as const, 
            icon: <FileJson className="w-4 h-4 text-syntax-function" />, 
            section: `codebender-${benderName.toLowerCase()}-socials` 
          },
        ],
      },
    ],
  }));
};

const fileTree: FileItem[] = [
  {
    name: "thelastcodebender",
    type: "folder",
    children: [
      { name: "README.md", type: "file", icon: <FileText className="w-4 h-4 text-syntax-string" />, section: "readme" },
      {
        name: "story",
        type: "folder",
        children: [
          { name: "TheLegend.md", type: "file", icon: <FileCode className="w-4 h-4 text-syntax-keyword" />, section: "story" },
        ],
      },
      {
        name: "socials",
        type: "folder",
        children: [
          { name: "links.json", type: "file", icon: <FileJson className="w-4 h-4 text-syntax-function" />, section: "socials" },
        ],
      },
      {
        name: "assets",
        type: "folder",
        children: [
          { name: "the-last-code-bender.png", type: "file", icon: <Image className="w-4 h-4 text-syntax-number" />, section: "portrait" },
        ],
      },
      {
        name: "stack",
        type: "folder",
        children: [
          { name: "technologies.md", type: "file", icon: <FileCode className="w-4 h-4 text-syntax-type" />, section: "stack" },
        ],
      },
    ],
  },
  {
    name: "code-benders",
    type: "folder",
    children: generateCodeBenderFolders(),
  },
];

const FileTreeItem = ({
  item,
  level = 0,
  activeSection,
  onSectionChange,
  defaultOpen = false,
}: {
  item: FileItem;
  level?: number;
  activeSection: string;
  onSectionChange: (section: string) => void;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const navigate = useNavigate();
  const isFolder = item.type === "folder";
  const isActive = item.section === activeSection;

  const handleClick = () => {
    if (isFolder) {
      // Handle Code Bender folder navigation - navigate on first click
      if (item.section && item.section.startsWith("codebender-") && !isOpen) {
        const codebenderId = item.section.replace("codebender-", "");
        navigate(`/codebender/${codebenderId}`);
        return;
      }
      setIsOpen(!isOpen);
    } else if (item.section) {
      // Handle Code Bender file navigation
      if (item.section.startsWith("codebender-")) {
        const parts = item.section.split("-");
        if (parts.length >= 3) {
          const codebenderId = parts[1];
          const section = parts.slice(2).join("-");
          navigate(`/codebender/${codebenderId}/${section}`);
        }
      } else {
        onSectionChange(item.section);
      }
    }
  };

  return (
    <div>
      <div
        className={cn(
          "file-tree-item",
          isActive && "active",
          "select-none"
        )}
        style={{ paddingLeft: `${level * 12 + 12}px` }}
        onClick={handleClick}
      >
        {isFolder ? (
          <>
            {isOpen ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
            {isOpen ? (
              <svg width="16" height="14" viewBox="0 0 16 14" fill="currentColor" className="text-syntax-function">
              <path d="M1.5 1C0.671573 1 0 1.67157 0 2.5V11.5C0 12.3284 0.671573 13 1.5 13H14.5C15.3284 13 16 12.3284 16 11.5V4.5C16 3.67157 15.3284 3 14.5 3H8L6.5 1H1.5Z" />
            </svg>
            ) : (
              <Folder className="w-4 h-4 text-syntax-function" />
            )}
          </>
        ) : (
          <>
            <span className="w-4" />
            {item.icon}
          </>
        )}
        <span className="truncate font-mono text-xs">{item.name}</span>
      </div>
      {isFolder && isOpen && item.children && (
        <div className="animate-fade-in" style={{ animationDuration: "0.15s" }}>
          {item.children.map((child, index) => (
            <FileTreeItem
              key={index}
              item={child}
              level={level + 1}
              activeSection={activeSection}
              onSectionChange={onSectionChange}
              defaultOpen={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const IDESidebar = ({ activeSection, onSectionChange, isOpen, onToggle }: IDESidebarProps) => {
  return (
    <aside
      className={cn(
        "h-full bg-sidebar border-r border-border flex flex-col transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-0 overflow-hidden",
        "lg:w-64"
      )}
    >
      {/* Explorer Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Explorer
        </span>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto py-2">
        {fileTree.map((item, index) => (
          <FileTreeItem
            key={index}
            item={item}
            activeSection={activeSection}
            onSectionChange={onSectionChange}
            defaultOpen={false}
          />
        ))}
         {/* <GenericFileTree data={fileTree} /> */}
      </div>
     

      {/* Sidebar Footer */}
      <div className="border-t border-border px-4 py-2">
        <p className="text-xs text-muted-foreground font-mono">
          5 files • 6 folders
        </p>
      </div>
    </aside>
  );
};
