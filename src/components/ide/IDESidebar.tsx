import { ChevronDown, ChevronRight, FileCode, FileJson, FileText, Folder, Image } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getBendingSpecializationsWithRanks } from "@/lib/code-bender-names";

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

// Section names for each bender (story, stack, assets, socials)
const BENDER_SECTIONS = ["story", "stack", "assets", "socials"] as const;

// Generate Code Bender tree: code-benders -> [Specialization] -> [Rank] -> story/stack/assets/socials
const generateCodeBendersTree = (): FileItem[] => {
  const specializations = getBendingSpecializationsWithRanks();
  return specializations.map((spec) => ({
    name: spec.label,
    type: "folder" as const,
    children: spec.benders.map((bender) => ({
      name: bender.displayName,
      type: "folder" as const,
      section: `codebender-${bender.fullId}`,
      children: BENDER_SECTIONS.map((sectionName) => ({
        name: sectionName,
        type: "folder" as const,
        children: [
          {
            name: "README.md",
            type: "file" as const,
            icon:
              sectionName === "story" ? (
                <FileText className="w-4 h-4 text-syntax-keyword" />
              ) : sectionName === "stack" ? (
                <FileCode className="w-4 h-4 text-syntax-type" />
              ) : sectionName === "assets" ? (
                <Image className="w-4 h-4 text-syntax-number" />
              ) : (
                <FileJson className="w-4 h-4 text-syntax-function" />
              ),
            section: `codebender-${bender.fullId}-${sectionName}`,
          },
        ],
      })),
    })),
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
    children: generateCodeBendersTree(),
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
      // Only toggle open/closed state - no navigation on folder click
      setIsOpen(!isOpen);
    } else if (item.section) {
      // Handle Code Bender file navigation (fullId may contain hyphens, e.g. frontend-bender-firstfrontendbender)
      if (item.section.startsWith("codebender-")) {
        const match = item.section.match(/^codebender-(.+)-(story|stack|assets|socials)$/);
        if (match) {
          const [, codebenderId, sectionName] = match;
          navigate(`/codebender/${codebenderId}/${sectionName}`);
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

export const IDESidebar = ({ activeSection, onSectionChange, isOpen }: IDESidebarProps) => {
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
