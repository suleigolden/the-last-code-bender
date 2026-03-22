import { ForkRepositoryButton } from '@/apps/action-buttons/ ForkRepositoryButton';

export default function FirstFrontendBenderProfile() {
  return (
    <div className="flex flex-col font-mono text-sm rounded-lg border border-border overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center bg-ide-tab border-b border-border">
        <div className="flex items-center px-4 py-2.5 text-xs font-mono bg-ide-tab-active border-t-2 border-t-syntax-function border-r border-border text-foreground">
          README.md
        </div>
      </div>

      {/* Body */}
      <div className="flex min-h-[280px]">
        {/* File explorer sidebar (desktop only) */}
        <aside className="hidden lg:flex flex-col w-48 bg-file-tree-bg border-r border-border shrink-0">
          <p className="px-3 py-2 text-xs text-muted-foreground uppercase tracking-wider">
            Explorer
          </p>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 px-3 py-1 text-folder-icon">
              <span>▾</span>
              <span className="text-xs">FirstFrontendBender</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-1 text-xs bg-ide-sidebar-active text-foreground">
              <span>📄</span>
              README.md
            </div>
          </div>
        </aside>

        {/* Content area */}
        <div className="flex-1 p-4 bg-background">
          <div className="space-y-1">
            <p className="text-syntax-comment">
              {'// This rank is unclaimed — be the first to claim it'}
            </p>
            <div className="mt-3 space-y-1.5">
              <div>
                <span className="text-syntax-keyword">const </span>
                <span className="text-foreground">rank</span>
                <span className="text-muted-foreground"> = </span>
                <span className="text-syntax-keyword">&quot;FirstFrontendBender&quot;</span>
              </div>
              <div>
                <span className="text-syntax-keyword">const </span>
                <span className="text-foreground">status</span>
                <span className="text-muted-foreground"> = </span>
                <span className="text-green-400">&quot;AVAILABLE&quot;</span>
              </div>
            </div>
            <div className="mt-4 text-syntax-comment space-y-0.5">
              <p>{'/**'}</p>
              <p>{' * Fork the repo, navigate to:'}</p>
              <p>{' * CodeBenders/Frontend Bender/FirstFrontendBender/'}</p>
              <p>{' * Fill in story/, stack/, socials/, SKILL.md'}</p>
              <p>{' * Submit a PR — first merged PR wins this rank.'}</p>
              <p>{' */'}</p>
            </div>
            <div className="mt-6">
              <ForkRepositoryButton />
            </div>
          </div>
        </div>
      </div>

      {/* Status strip */}
      <div className="bg-ide-statusbar px-4 py-1 flex items-center gap-3 font-mono text-xs shrink-0">
        <span className="text-syntax-function">UNCLAIMED</span>
        <span className="text-muted-foreground">|</span>
        <span className="text-muted-foreground">FirstFrontendBender</span>
        <span className="text-muted-foreground">|</span>
        <span className="text-muted-foreground">Frontend Bender</span>
      </div>
    </div>
  );
}
