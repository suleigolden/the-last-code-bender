import type { SandpackFiles } from '@codesandbox/sandpack-react';
import profileWorkspaceSectionsCss from '@/components/profile/profile-workspace-sections.css?raw';
import {
  PROFILE_WORKSPACE_PATHS,
  type ProfileWorkspacePath,
} from '@/lib/profile-workspace-defaults';

/**
 * react-ts template entry is `/index.tsx` at project root (not /src/).
 * It imports `./App` from `/App.tsx`. We must override those paths — putting
 * files under /src/ leaves the template default App (e.g. "Hello world") in use.
 */
const INDEX_ENTRY_TSX = `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
`;

/** Fallback if workspace `styles.css` is empty (kept in sync with profile-workspace-sections.css) */
const DEFAULT_WORKSPACE_STYLES = profileWorkspaceSectionsCss;

export function buildWorkspaceSandpackFiles(
  files: Record<ProfileWorkspacePath, string>,
): SandpackFiles {
  const out: SandpackFiles = {
    '/index.tsx': { code: INDEX_ENTRY_TSX, hidden: true },
  };

  for (const path of PROFILE_WORKSPACE_PATHS) {
    const code = files[path] ?? '';
    if (path === 'index.tsx') {
      out['/App.tsx'] = { code };
    } else if (path === 'styles.css') {
      const trimmed = code.trim();
      out['/styles.css'] = { code: trimmed.length > 0 ? code : DEFAULT_WORKSPACE_STYLES };
    } else {
      out[`/${path}`] = { code };
    }
  }

  return out;
}

export function workspaceHasRenderableFiles(files: Record<string, unknown> | null | undefined): boolean {
  if (!files || typeof files !== 'object') return false;
  for (const path of PROFILE_WORKSPACE_PATHS) {
    const v = files[path];
    if (typeof v === 'string' && v.trim().length > 0) return true;
  }
  return false;
}
