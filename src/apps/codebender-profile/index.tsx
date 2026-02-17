import { useParams, useNavigate } from "react-router-dom";
import { IDESidebar } from "@/components/ide/IDESidebar";
import { IDETabBar } from "@/components/ide/IDETabBar";
import { IDEStatusBar } from "@/components/ide/IDEStatusBar";
import { useState, useEffect } from "react";
import { CodeBenderPlaceholder } from "./CodeBenderPlaceholder";
import { codeBenderNames } from "@/lib/code-bender-names";



export const CodeBenderProfile = () => {
  const { codebenderId, section } = useParams<{ codebenderId: string; section?: string }>();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(section || "story");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Normalize codebenderId: remove hyphens and convert to lowercase for lookup
  const normalizedId = codebenderId?.toLowerCase().replace(/-/g, '') || '';
  const codeBenderName = normalizedId ? codeBenderNames[normalizedId] || null : null;



  useEffect(() => {
    if (section) {
      setActiveSection(section);
    }
  }, [section]);

  const handleSectionChange = (newSection: string) => {
    setSidebarOpen(false);
    
    // Handle TheLastCodeBender sections (navigate to home page)
    const theLastCodeBenderSections = ["readme", "story", "socials", "portrait", "stack"];
    if (theLastCodeBenderSections.includes(newSection)) {
      navigate("/", { state: { section: newSection } });
      return;
    }
    
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

  const requestedName = codebenderId 
    ? codebenderId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'Unknown';

  return (
    <div className="h-screen bg-background flex flex-col noise-overlay relative overflow-hidden">
      {/* IDE Grid Background */}
      <div className="fixed inset-0 ide-grid-bg pointer-events-none opacity-30" />

      {/* Main Layout */}
      <div className="flex flex-1 relative z-10 h-full overflow-hidden">
        {/* Sidebar */}
        <IDESidebar
          activeSection={codeBenderName ? `codebender-${codebenderId?.toLowerCase()}-${activeSection}` : ""}
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
            activeSection={codeBenderName ? `codebender-${codebenderId?.toLowerCase()}-${activeSection}` : ""}
            onSectionChange={handleSectionChange}
            isOpen={true}
            onToggle={() => setSidebarOpen(false)}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Tab Bar */}
          <IDETabBar
            activeTab={`codebender-${codebenderId?.toLowerCase()}-${activeSection}`}
            onTabChange={handleSectionChange}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            isSidebarOpen={sidebarOpen}
            isCodeBender={true}
            codeBenderName={codeBenderName || undefined}
            codeBenderId={codebenderId}
          />

          {/* Editor Content - Scrollable area */}
          <main className="flex-1 overflow-y-auto scroll-smooth">
            {codeBenderName ? (
              <CodeBenderPlaceholder codeBenderName={codeBenderName} section={activeSection} />
            ) : (
              <section className="min-h-screen py-12 px-4 flex items-center justify-center">
                <div className="max-w-3xl w-full">
                  <div className="font-mono text-sm text-syntax-comment mb-6">
                    {`// code-benders/${codebenderId}/README.md`}
                  </div>
                  <div className="ide-panel p-8">
                    <h1 className="text-2xl font-bold mb-6 text-foreground">
                      This code bender ({requestedName}) Not Found.
                    </h1>
                    <div className="space-y-4 text-foreground/90 font-mono text-sm leading-relaxed">
                      <p>
                        Be the first to fork, clone, and contribute to the {requestedName} folder.
                      </p>
                      <p>
                        Add your story, stack, and journey — and claim your position in the CodeBenders legacy.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </main>

          {/* Status Bar */}
          <IDEStatusBar activeFile={activeSection} codeBenderName={codeBenderName || undefined} />
        </div>
      </div>
    </div>
  );
};
