import { SandpackProvider, SandpackPreview } from '@codesandbox/sandpack-react';
import type { ProfileWorkspacePath } from '@/lib/profile-workspace-defaults';
import { buildWorkspaceSandpackFiles } from '@/lib/profile-workspace-sandpack';
import { profileSandpackCustomSetup } from '@/lib/sandpack-profile-deps';

interface ProfileWorkspacePreviewProps {
  files: Record<ProfileWorkspacePath, string>;
}

export function ProfileWorkspacePreview({ files }: ProfileWorkspacePreviewProps) {
  return (
    <div className="rounded-lg border border-border overflow-hidden min-h-[420px] bg-[#0c0e14]">
      <SandpackProvider
        template="react-ts"
        theme="dark"
        files={buildWorkspaceSandpackFiles(files)}
        customSetup={profileSandpackCustomSetup}
        options={{
          autorun: true,
          recompileMode: 'delayed',
          recompileDelay: 400,
        }}
      >
        <SandpackPreview showOpenInCodeSandbox={false} style={{ height: 1000 }} />
      </SandpackProvider>
    </div>
  );
}
