import { useParams, useNavigate } from "react-router-dom";
import { IDESidebar } from "@/components/ide/IDESidebar";
import { IDETabBar } from "@/components/ide/IDETabBar";
import { IDEStatusBar } from "@/components/ide/IDEStatusBar";
import { useState, useEffect } from "react";
import { CodeBenderPlaceholder } from "./CodeBenderPlaceholder";

const codeBenderNames: Record<string, string> = {
  "theFirstcodebender": "TheFirstCodeBender",
  "theSecondcodebender": "TheSecondCodeBender",
  "theThirdcodebender": "TheThirdCodeBender",
  "theFourthcodebender": "TheFourthCodeBender",
  "theFifthcodebender": "TheFifthCodeBender",
  "theSixthcodebender": "TheSixthCodeBender",
  "theSeventhcodebender": "TheSeventhCodeBender",
  "theEighthcodebender": "TheEighthCodeBender",
  "theNinthcodebender": "TheNinthCodeBender",
  "theTenthcodebender": "TheTenthCodeBender",
  "theEleventhcodebender": "TheEleventhCodeBender",
  "theTwelfthcodebender": "TheTwelfthCodeBender",
  "theThirteenthcodebender": "TheThirteenthCodeBender",
  "theFourteenthcodebender": "TheFourteenthCodeBender",
  "theFifteenthcodebender": "TheFifteenthCodeBender",
};

export const CodeBenderProfile = () => {
  const { codebenderId, section } = useParams<{ codebenderId: string; section?: string }>();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(section || "story");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const codeBenderName = codebenderId ? codeBenderNames[codebenderId.toLowerCase()] : null;

  useEffect(() => {
    if (section) {
      setActiveSection(section);
    }
  }, [section]);

  const handleSectionChange = (newSection: string) => {
    setSidebarOpen(false);
    
    if (codebenderId && newSection.startsWith(`codebender-${codebenderId.toLowerCase()}-`)) {
      const sectionPath = newSection.replace(`codebender-${codebenderId.toLowerCase()}-`, "");
      setActiveSection(sectionPath);
      navigate(`/codebender/${codebenderId}/${sectionPath}`, { replace: true });
    } else if (newSection.startsWith("codebender-")) {
      // Navigate to a different Code Bender
      const parts = newSection.split("-");
      if (parts.length >= 2) {
        const targetCodebenderId = parts[1];
        const section = parts.slice(2).join("-") || "story";
        navigate(`/codebender/${targetCodebenderId}/${section}`);
      }
    }
  };

  if (!codeBenderName) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Code Bender Not Found</h1>
          <button
            onClick={() => navigate("/")}
            className="text-primary hover:underline"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col noise-overlay relative overflow-hidden">
      {/* IDE Grid Background */}
      <div className="fixed inset-0 ide-grid-bg pointer-events-none opacity-30" />

      {/* Main Layout */}
      <div className="flex flex-1 relative z-10 h-full overflow-hidden">
        {/* Sidebar */}
        <IDESidebar
          activeSection={`codebender-${codebenderId?.toLowerCase()}-${activeSection}`}
          onSectionChange={handleSectionChange}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile sidebar */}
        <div
          className={`
            fixed left-0 top-0 h-full z-50 lg:hidden transform transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <IDESidebar
            activeSection={`codebender-${codebenderId?.toLowerCase()}-${activeSection}`}
            onSectionChange={handleSectionChange}
            isOpen={true}
            onToggle={() => setSidebarOpen(false)}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Tab Bar */}
          <IDETabBar
            activeTab={activeSection}
            onTabChange={handleSectionChange}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            isSidebarOpen={sidebarOpen}
          />

          {/* Editor Content - Scrollable area */}
          <main className="flex-1 overflow-y-auto scroll-smooth">
            <CodeBenderPlaceholder codeBenderName={codeBenderName} section={activeSection} />
          </main>

          {/* Status Bar */}
          <IDEStatusBar activeFile={activeSection} />
        </div>
      </div>
    </div>
  );
};
