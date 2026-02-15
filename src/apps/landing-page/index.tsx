import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { IDESidebar } from "@/components/ide/IDESidebar";
import { IDETabBar } from "@/components/ide/IDETabBar";
import { IDEStatusBar } from "@/components/ide/IDEStatusBar";
import { HeroSection } from "./sections/HeroSection";
import { StorySection } from "./sections/StorySection";
import { SocialsSection } from "./sections/SocialsSection";
import { PortraitSection } from "./sections/PortraitSection";
import { StackSection } from "./sections/StackSection";

export const LandingPage = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("readme");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const readmeRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLElement>(null);

  const handleSectionChange = (section: string) => {
    // Normalize section name: remove file extensions and convert to lowercase
    // e.g., "readme.md" -> "readme", "STORY.ts" -> "story"
    const normalizedSection = section.toLowerCase().replace(/\.(md|ts|tsx|js|jsx|json)$/i, '');
    
    setActiveSection(normalizedSection);
    setSidebarOpen(false);
    
    const refMap: Record<string, React.RefObject<HTMLDivElement>> = {
      readme: readmeRef,
      story: storyRef,
      socials: socialsRef,
      portrait: portraitRef,
      stack: stackRef,
    };

    const targetRef = refMap[normalizedSection];
    // Use setTimeout to ensure DOM is ready and state is updated
    setTimeout(() => {
      if (targetRef?.current) {
        // Use the main container ref if available, otherwise find it
        const mainContainer = mainContainerRef.current || targetRef.current.closest('main');
        if (mainContainer) {
          // Get the target element's offsetTop relative to the main container
          // offsetTop gives us the position relative to the offsetParent
          const targetElement = targetRef.current;
          const containerElement = mainContainer;
          
          // Calculate the scroll position
          // Use a simpler approach: get the relative position
          const targetRect = targetElement.getBoundingClientRect();
          const containerRect = containerElement.getBoundingClientRect();
          const currentScroll = containerElement.scrollTop;
          const scrollTop = currentScroll + targetRect.top - containerRect.top;
          
          mainContainer.scrollTo({
            top: scrollTop,
            behavior: "smooth"
          });
        } else {
          // Fallback to scrollIntoView if main container not found
          targetRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }, 100);
  };

  // Handle navigation from Code Bender pages
  useEffect(() => {
    const state = location.state as { section?: string } | null;
    if (state?.section) {
      setActiveSection(state.section);
      setSidebarOpen(false);
      
      const refMap: Record<string, React.RefObject<HTMLDivElement>> = {
        readme: readmeRef,
        story: storyRef,
        socials: socialsRef,
        portrait: portraitRef,
        stack: stackRef,
      };

      const targetRef = refMap[state.section];
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        if (targetRef?.current) {
          targetRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [location.state]);

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: "readme", ref: readmeRef },
        { id: "story", ref: storyRef },
        { id: "portrait", ref: portraitRef },
        { id: "stack", ref: stackRef },
        { id: "socials", ref: socialsRef },
      ];

      const scrollPosition = window.scrollY + 200;

      for (const section of sections.reverse()) {
        if (section.ref.current) {
          const offsetTop = section.ref.current.offsetTop;
          if (scrollPosition >= offsetTop) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="h-screen bg-background flex flex-col noise-overlay relative overflow-hidden">
      {/* IDE Grid Background */}
      <div className="fixed inset-0 ide-grid-bg pointer-events-none opacity-30" />

      {/* Main Layout */}
      <div className="flex flex-1 relative z-10 h-full overflow-hidden">
        {/* Sidebar */}
        <IDESidebar
          activeSection={activeSection}
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
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            isOpen={true}
            onToggle={() => setSidebarOpen(false)}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Tab Bar */}
          <IDETabBar
            activeTab={activeSection === "portrait" ? "story" : activeSection}
            onTabChange={handleSectionChange}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            isSidebarOpen={sidebarOpen}
            isCodeBender={false}
          />

          {/* Editor Content - Scrollable area */}
          <main ref={mainContainerRef} className="flex-1 overflow-y-auto scroll-smooth">
            {/* README / Hero Section */}
            <div ref={readmeRef} className="min-h-screen">
              <HeroSection onNavigate={handleSectionChange} />
            </div>

            {/* Story Section */}
            <div ref={storyRef} className="border-t border-border">
              <StorySection />
            </div>

            {/* Portrait Section */}
            <div ref={portraitRef} className="border-t border-border">
              <PortraitSection />
            </div>

            {/* Stack Section */}
            <div ref={stackRef} className="border-t border-border">
              <StackSection />
            </div>

            {/* Socials Section */}
            <div ref={socialsRef} className="border-t border-border">
              <SocialsSection />
            </div>
          </main>

          {/* Status Bar */}
          <IDEStatusBar activeFile={activeSection} />
        </div>
      </div>
    </div>
  );
};