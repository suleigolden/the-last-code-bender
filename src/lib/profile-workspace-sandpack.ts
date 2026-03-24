import type { SandpackFiles } from '@codesandbox/sandpack-react';
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

const STYLES_CSS = `* { box-sizing: border-box; }
body { margin: 0; font-family: ui-sans-serif, system-ui, sans-serif; background: #0c0e14; color: #e6edf3; }
.profile-root { max-width: 42rem; margin: 0 auto; padding: 1.5rem; }
.section { padding: 2rem 0; border-top: 1px solid #30363d; }
.section:first-child { border-top: none; }
.hero { padding-top: 0; }
.ey { font-family: ui-monospace, monospace; font-size: 0.75rem; color: #8b949e; margin: 0 0 0.5rem; }
h1 { font-size: 1.75rem; margin: 0 0 0.5rem; }
h2 { font-size: 1.25rem; margin: 0 0 0.75rem; }
.lede { color: #8b949e; margin: 0; line-height: 1.5; }
.links { margin: 0; padding-left: 1.25rem; }
.links a { color: #58a6ff; }
.pill-list { display: flex; flex-wrap: wrap; gap: 0.5rem; list-style: none; margin: 0; padding: 0; }
.pill { background: #21262d; border: 1px solid #30363d; border-radius: 999px; padding: 0.25rem 0.65rem; font-size: 0.8rem; }
.portrait .avatar { width: 4rem; height: 4rem; border-radius: 999px; background: #238636; display: flex; align-items: center; justify-content: center; font-weight: 700; margin-bottom: 0.75rem; }
`;

export function buildWorkspaceSandpackFiles(
  files: Record<ProfileWorkspacePath, string>,
): SandpackFiles {
  const out: SandpackFiles = {
    '/index.tsx': { code: INDEX_ENTRY_TSX, hidden: true },
    '/styles.css': { code: STYLES_CSS, hidden: true },
  };

  for (const path of PROFILE_WORKSPACE_PATHS) {
    const code = files[path] ?? '';
    if (path === 'index.tsx') {
      out['/App.tsx'] = { code };
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
