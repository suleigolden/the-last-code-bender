import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Github, GitFork } from "lucide-react";

type CodeBenderPlaceholderProps = {
  codeBenderName: string;
  section: string;
};

const placeholderContent = `Be the first to fork, clone, and contribute to the {codeBenderName} folder.
Add your story, stack, and journey — and claim your position in the CodeBenders legacy.`;

export const CodeBenderPlaceholder = ({ codeBenderName, section }: CodeBenderPlaceholderProps) => {
  const displayName = codeBenderName.replace(/([A-Z])/g, " $1").trim();
  const folderName = codeBenderName.toLowerCase();
  const sectionName = section.replace(`codebender-${folderName}-`, "");

  return (
    <section className="min-h-screen py-12 px-4 flex items-center justify-center">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="font-mono text-sm text-syntax-comment mb-6">
          {`// code-benders/${folderName}/${sectionName}/README.md`}
        </div>

        {/* IDE Panel */}
        <div className="ide-panel overflow-hidden">
          {/* Editor header */}
          <div className="bg-ide-tab px-4 py-2 flex items-center gap-2 border-b border-border">
            <FileText className="w-4 h-4 text-syntax-string" />
            <span className="text-xs font-mono text-muted-foreground">README.md</span>
            <span className="text-xs text-muted-foreground">—</span>
            <span className="text-xs text-syntax-comment font-mono">Placeholder</span>
          </div>

          {/* Content */}
          <div className="p-8 font-mono text-sm leading-7">
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-foreground mb-6">
                {displayName}
              </h1>
              
              <div className="text-foreground/90 whitespace-pre-line">
                {placeholderContent.replace("{codeBenderName}", displayName)}
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Get Started
                </h2>
                <div className="space-y-3 text-foreground/80">
                  <p>
                    <span className="syntax-keyword">1.</span> Fork this repository
                  </p>
                  <p>
                    <span className="syntax-keyword">2.</span> Clone your fork
                  </p>
                  <p>
                    <span className="syntax-keyword">3.</span> Navigate to <code className="syntax-string">code-benders/{folderName}/</code>
                  </p>
                  <p>
                    <span className="syntax-keyword">4.</span> Add your content to the <code className="syntax-string">{sectionName}</code> folder
                  </p>
                  <p>
                    <span className="syntax-keyword">5.</span> Submit a pull request
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mt-8">
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-mono"
                  size="lg"
                >
                  <Github className="w-4 h-4 mr-2" />
                  Fork Repository
                </Button>
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10 font-mono"
                  size="lg"
                >
                  <GitFork className="w-4 h-4 mr-2" />
                  View on GitHub
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
