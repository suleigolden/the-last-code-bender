import { ChevronDown, ChevronRight, FileCode, FileJson, FileText, Folder, FolderOpen, Image } from "lucide-react";
import { useState } from "react";
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
];

const FileTreeItem = ({
  item,
  level = 0,
  activeSection,
  onSectionChange,
  defaultOpen = true,
}: {
  item: FileItem;
  level?: number;
  activeSection: string;
  onSectionChange: (section: string) => void;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const isFolder = item.type === "folder";
  const isActive = item.section === activeSection;

  const handleClick = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    } else if (item.section) {
      onSectionChange(item.section);
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
              <FolderOpen className="w-4 h-4 text-syntax-function" />
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
              defaultOpen={level < 1}
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
          />
        ))}
         {/* <GenericFileTree data={fileTree} /> */}
      </div>
     

      {/* Sidebar Footer */}
      <div className="border-t border-border px-4 py-2">
        <p className="text-xs text-muted-foreground font-mono">
          5 files • 5 folders
        </p>
      </div>
    </aside>
  );
};
