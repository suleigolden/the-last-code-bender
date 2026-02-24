import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Github, GitFork } from "lucide-react";
import { fileNames } from "@/lib/helper";

type CodeBenderPlaceholderProps = {
  codeBenderName: string;
  section: string;
  /** e.g. "Frontend Bender" for path display: code-benders/Frontend Bender/FirstFrontendBender/... */
  specializationLabel?: string;
};

const placeholderContent = `Be the first to fork, clone, and contribute to the {codeBenderName} folder.
Add your story, stack, and journey — and claim your position in the CodeBenders legacy.`;

export const CodeBenderPlaceholder = ({ codeBenderName, section, specializationLabel }: CodeBenderPlaceholderProps) => {
  const displayName = codeBenderName.replace(/([A-Z])/g, " $1").trim();
  const folderName = codeBenderName.toLowerCase();
  const sectionName = section;
  const pathPrefix = specializationLabel
    ? `code-benders/${specializationLabel}/${codeBenderName}`
    : `code-benders/${folderName}`;
  const foldersToContribute = [
    { name: "story", file: fileNames.readme },
    { name: "stack", file: fileNames.readme },
    { name: "socials", file: fileNames.readme },
    { name: "assets", file: fileNames.readme },
  ];
  const projectUrl = "https://github.com/suleigolden/the-last-code-bender";

  return (
    <section className="min-h-screen py-12 px-4 flex items-center justify-center">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="font-mono text-sm text-syntax-comment mb-6">
          {`// ${pathPrefix}/${sectionName}/README.md`}
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
                <div className="space-y-3 text-foreground/80 mb-6">
                  <p>
                    <span className="syntax-keyword">1.</span> Fork this repository
                  </p>
                  <p>
                    <span className="syntax-keyword">2.</span> Clone your fork
                  </p>
                  <p>
                    <span className="syntax-keyword">3.</span> Navigate to <code className="syntax-string">{pathPrefix}/</code>
                  </p>
                  <p>
                    <span className="syntax-keyword">4.</span> Add your content to the folders and files:
                  </p>
                </div>
                
                {/* Folders and Files List */}
                <div className="ml-4 space-y-2 text-foreground/80 font-mono text-sm">
                  {foldersToContribute.map((folder) => (
                    <div key={folder.name} className="flex items-start gap-2">
                      <span className="text-syntax-keyword">-</span>
                      <div className="flex-1">
                        <span className="text-syntax-function">{folder.name}/</span>
                        <div className="ml-4 mt-1">
                          <span className="text-syntax-string">{folder.file}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-foreground/80">
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
                  onClick={() => window.open(`${projectUrl}/fork`, "_blank", "noopener,noreferrer")}
                >
                  <Github className="w-4 h-4 mr-2" />
                  Fork Repository
                </Button>
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10 font-mono"
                  size="lg"
                  onClick={() => window.open(projectUrl, "_blank", "noopener,noreferrer")}
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
