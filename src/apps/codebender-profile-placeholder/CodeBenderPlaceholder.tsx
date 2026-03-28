import { FileText, LayoutDashboard, PenLine } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ForkRepositoryButton } from "../action-buttons/ ForkRepositoryButton";
import { ViewOnGitHubButton } from "../action-buttons/ViewOnGitHubButton";

type CodeBenderPlaceholderProps = {
  codeBenderName: string;
  section: string;
  /** e.g. "Frontend Bender" for path display: code-benders/Frontend Bender/FirstFrontendBender/... */
  specializationLabel?: string;
  /** When the signed-in user owns this rank — show Dashboard / workspace CTAs. */
  isOwnProfile?: boolean;
};

export const CodeBenderPlaceholder = ({
  codeBenderName,
  section,
  specializationLabel,
  isOwnProfile = false,
}: CodeBenderPlaceholderProps) => {
  const displayName = codeBenderName.replace(/([A-Z])/g, " $1").trim();
  const folderName = codeBenderName.toLowerCase();
  const sectionName = section;
  const pathPrefix = specializationLabel
    ? `code-benders/${specializationLabel}/${codeBenderName}`
    : `code-benders/${folderName}`;


  return (
    <section className="min-h-screen py-12 px-4 flex items-center justify-center">
      <div className="max-w-3xl w-full">
        <div className="font-mono text-sm text-syntax-comment mb-6">
          {`// ${pathPrefix}/${sectionName}/README.md`}
        </div>

        <div className="ide-panel overflow-hidden">
          <div className="bg-ide-tab px-4 py-2 flex items-center gap-2 border-b border-border">
            <FileText className="w-4 h-4 text-syntax-string" />
            <span className="text-xs font-mono text-muted-foreground">README.md</span>
            <span className="text-xs text-muted-foreground">—</span>
            <span className="text-xs text-syntax-comment font-mono">Placeholder</span>
          </div>

          <div className="p-8 font-mono text-sm leading-7">
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-foreground mb-2">{displayName}</h1>

              <p className="text-foreground/90">
                <span className="text-syntax-keyword">No published profile workspace yet.</span>{" "}
                Live profiles are built from your{" "}
                <span className="text-cyan-400">Profile workspace</span> (saved sources in the
                dashboard). Either nothing has been saved yet, or the workspace doesn&apos;t have
                enough content to render here.
              </p>

              {isOwnProfile ? (
                <div className="rounded-lg border border-border bg-ide-sidebar/50 p-4 space-y-3 text-left">
                  <p className="text-xs text-syntax-comment font-mono">// how to fill this page</p>
                  <h2 className="text-lg font-semibold text-foreground mb-4">Get Started</h2>
                  <ol className="list-decimal list-inside space-y-2 text-foreground/90 text-sm">
                    <li>
                      Open your <strong className="text-foreground">Dashboard</strong> (signed in with
                      GitHub).
                    </li>
                    <li>
                      Click <strong className="text-foreground">Start editing profile</strong> to open
                      the Profile workspace.
                    </li>
                    <li>
                      Edit <code className="text-syntax-string">index.tsx</code>,{'\n'}
                      <code className="text-syntax-string">HeroSection.tsx</code>,{'\n'}
                      <code className="text-syntax-string">StorySection.tsx</code>,{'\n'}
                      <code className="text-syntax-string">SocialsSection.tsx</code>,{'\n'}
                      <code className="text-syntax-string">StackSection.tsx</code>,{'\n'}
                      <code className="text-syntax-string">SKILL.md</code>,{'\n'}
                      <code className="text-syntax-string">stack/stack.json</code>,{'\n'}
                      <code className="text-syntax-string">PortraitSection.tsx</code> and{'\n'}
                      <code className="text-syntax-string">styles.css</code>.
                      <br />
                      <label className="text-foreground">Rreview updates live.</label>
                      <br />
                      <label className="text-blue-500">Build it however you want. Be creative. Be modern. Be you.</label>
                    </li>
                    <li>
                      Save each change with a <strong className="text-foreground">commit message</strong> so XP is
                      recorded; add a <strong className="text-foreground">demo URL</strong> {" "}on the
                      Dashboard showcase section when you&apos;re ready.
                    </li>
                  </ol>
                  <div className="flex flex-col gap-3 mt-8">
                    {isOwnProfile && (
                      <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                        <Button
                          size="lg"
                          className="font-mono glow-primary gap-2"
                          asChild
                        >
                          <Link to="/dashboard/workspace">
                            <PenLine className="w-4 h-4 shrink-0" />
                            Start editing profile
                          </Link>
                        </Button>
                        <Button size="lg" variant="secondary" className="font-mono gap-2" asChild>
                          <Link to="/dashboard">
                            <LayoutDashboard className="w-4 h-4 shrink-0" />
                            Open Dashboard
                          </Link>
                        </Button>
                      </div>
                    )}

                  </div>

                </div>
              ) : (
                <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                  <div className="mt-8 pt-6 border-t border-border">
                    <p className="text-muted-foreground text-sm">
                      This CodeBender hasn&apos;t published workspace content to the site yet. Check back
                      later, or view the project on GitHub below.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                    <p>Are you interested in contributing to this project, feel free to submit a PR.</p>
                    <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                      <ViewOnGitHubButton />
                      <ForkRepositoryButton />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
