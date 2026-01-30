import { ArrowDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import portraitImage from "@/assets/the-last-code-bender-1.png";

type HeroSectionProps = {
  onNavigate: (section: string) => void;
}

export const HeroSection = ({ onNavigate }: HeroSectionProps) => {
  return (
    <section className="min-h-[calc(100vh-120px)] flex flex-col lg:flex-row items-center gap-8 lg:gap-16 py-12 px-6">
      {/* Left side - Content */}
      <div className="flex-1 space-y-6 animate-fade-in">
        {/* Code comment header */}
        <div className="font-mono text-sm text-syntax-comment">
          {"// README.md — Welcome to my codebase"}
        </div>

        {/* Main title with glow */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="text-primary glow-text animate-glow-pulse">The</span>
            <span className="text-foreground">Last</span>
            <span className="text-primary glow-text animate-glow-pulse">Code</span>
            <span className="text-foreground">Bender</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground font-mono">
            <span className="syntax-keyword">const</span>{" "}
            <span className="syntax-variable">role</span>{" "}
            <span className="text-foreground">=</span>{" "}
            <span className="syntax-string">"Full-Stack Senior Developer"</span>
            <span className="syntax-comment"> // 12+ Years</span>
          </p>
        </div>

        {/* Tagline */}
        <div className="ide-panel p-4 border-l-4 border-l-primary">
          <p className="font-mono text-lg text-foreground">
            <span className="syntax-comment">/**</span>
            <br />
            <span className="syntax-comment"> * I bend code across stacks to ship real products.</span>
            <br />
            <span className="syntax-comment"> * Always learning. Always building.</span>
            <br />
            <span className="syntax-comment"> */</span>
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 pt-4">
          <Button
            onClick={() => onNavigate("story")}
            className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-mono"
            size="lg"
          >
            <ArrowDown className="w-4 h-4 mr-2" />
            View Story
          </Button>
          <Button
            onClick={() => onNavigate("socials")}
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10 font-mono"
            size="lg"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Connect
          </Button>
        </div>
      </div>

      {/* Right side - Portrait */}
      <div className="flex-shrink-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <div className="relative">
          {/* Glow background */}
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          
          {/* Image frame */}
          <div className="relative ide-panel p-2 glow-primary">
            <div className="bg-ide-tab px-3 py-1.5 flex items-center gap-2 border-b border-border">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-syntax-function/60" />
              <div className="w-3 h-3 rounded-full bg-syntax-string/60" />
              <span className="ml-2 text-xs font-mono text-muted-foreground">portrait.png</span>
            </div>
            <img
              src={portraitImage}
              alt="TheLastCodeBender Portrait"
              className="w-64 h-80 md:w-72 md:h-96 object-cover"
            />
            <div className="px-3 py-2 border-t border-border">
              <p className="text-xs font-mono text-muted-foreground text-center">
                TheLastCodeBender — Master of the Code Elements
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
