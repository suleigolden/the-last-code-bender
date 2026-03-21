'use strict';
const fs   = require('fs');
const path = require('path');

// --- arg parsing (same pattern as rebuild-registry.js) ---
const args = process.argv.slice(2);
function getArg(name, def) {
  const i = args.indexOf(`--${name}`);
  return i !== -1 ? args[i + 1] : def;
}
const handle         = getArg('handle',      null);
const codebendersDir = getArg('codebenders', 'CodeBenders');
const registryFile   = getArg('registry',    'registry/registry.json');
const publicDir      = getArg('public',      'public');

if (!handle) { console.error('--handle required'); process.exit(1); }

// --- find handle folder (discipline is unknown, search all) ---
function findHandlePath(base, h) {
  if (!fs.existsSync(base)) return null;
  for (const disc of fs.readdirSync(base, { withFileTypes: true })) {
    if (!disc.isDirectory()) continue;
    const p = path.join(base, disc.name, h);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

const handlePath = findHandlePath(codebendersDir, handle);
if (!handlePath) { console.error(`Handle folder not found: ${handle}`); process.exit(1); }

const demoDir   = path.join(handlePath, 'demo');
const indexHtml = path.join(demoDir, 'index.html');
const deployYml = path.join(demoDir, 'deploy.yaml');
const iframeTxt = path.join(demoDir, 'iframe.txt');

// --- detect mode ---
let demoUrl = null;

if (!fs.existsSync(demoDir)) {
  console.error(`No demo/ folder found for ${handle}`);
  process.exit(1);
}

if (fs.existsSync(indexHtml)) {
  // Mode A — static
  const dest = path.join(publicDir, 'demos', handle);
  fs.mkdirSync(dest, { recursive: true });
  function copyDir(src, dst) {
    fs.mkdirSync(dst, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
      const s = path.join(src, entry.name);
      const d = path.join(dst, entry.name);
      if (entry.isDirectory()) copyDir(s, d);
      else fs.copyFileSync(s, d);
    }
  }
  copyDir(demoDir, dest);
  demoUrl = `/demos/${handle}/`;
  console.error(`[deploy-showcase] Mode A: copied demo/ → ${dest}`);

} else if (fs.existsSync(deployYml)) {
  // Mode B — external URL from deploy.yaml
  const content = fs.readFileSync(deployYml, 'utf8');
  const match   = content.match(/^external_url:\s*(.+)$/m);
  if (!match) { console.error('deploy.yaml missing external_url'); process.exit(1); }
  demoUrl = match[1].trim();
  console.error(`[deploy-showcase] Mode B: external_url = ${demoUrl}`);

} else if (fs.existsSync(iframeTxt)) {
  // Mode C — iframe URL from iframe.txt
  const content  = fs.readFileSync(iframeTxt, 'utf8');
  const firstUrl = content.split('\n').map(l => l.trim()).find(l => l);
  if (!firstUrl) { console.error('iframe.txt is empty'); process.exit(1); }
  demoUrl = firstUrl;
  console.error(`[deploy-showcase] Mode C: iframe url = ${demoUrl}`);

} else {
  console.error(`No recognisable demo file in demo/ for ${handle}`);
  process.exit(1);
}

// --- update registry.json ---
let registry = [];
try { registry = JSON.parse(fs.readFileSync(registryFile, 'utf8')); } catch (_) {}
const idx = registry.findIndex(b => b.handle === handle);
if (idx !== -1) {
  registry[idx].demo_url = demoUrl;
} else {
  console.error(`Warning: handle ${handle} not found in registry`);
}
fs.writeFileSync(registryFile, JSON.stringify(registry, null, 2) + '\n');
console.error(`[deploy-showcase] registry.json updated: demo_url = ${demoUrl}`);

// stdout = URL only (captured by workflow)
console.log(demoUrl);
process.exit(0);
