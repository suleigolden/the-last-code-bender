export default function SecondFrontendBenderProfile() {
  return (
    <div className="space-y-6 font-mono">
      {/* Story / README */}
      <div className="bg-ide-sidebar border border-border rounded-lg overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
          <span className="text-xs text-muted-foreground">README.md</span>
          <span className="text-xs text-syntax-comment">— Story</span>
        </div>
        <div className="p-4 space-y-2 text-sm">
          <p className="text-syntax-comment">{'// SecondFrontendBender — John Doe'}</p>
          <div className="mt-2">
            <span className="text-syntax-keyword">const </span>
            <span className="text-foreground">tagline</span>
            <span className="text-muted-foreground"> = </span>
            <span className="text-syntax-string">&quot;Full-stack developer obsessed with clean UI and scalable APIs&quot;</span>
          </div>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            {'/**'}<br />
            {' * Frontend dev with a backend heart. I build React UIs that'}<br />
            {' * talk to Node/Express APIs and store things in MongoDB.'}<br />
            {' * Open source contributor. Always learning.'}<br />
            {' */'}
          </p>
        </div>
      </div>

      {/* Stack */}
      <div className="bg-ide-sidebar border border-border rounded-lg overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
          <span className="text-xs text-muted-foreground">stack.ts</span>
          <span className="text-xs text-syntax-comment">— Tech Stack</span>
        </div>
        <div className="p-4 space-y-3 text-sm">
          <div>
            <span className="text-syntax-keyword">const </span>
            <span className="text-syntax-function">primary</span>
            <span className="text-muted-foreground"> = [</span>
            <div className="ml-4 space-y-1 mt-1">
              {['React', 'Node.js'].map((t) => (
                <div key={t}>
                  <span className="text-syntax-string">&quot;{t}&quot;</span>
                  <span className="text-muted-foreground">,</span>
                </div>
              ))}
            </div>
            <span className="text-muted-foreground">]</span>
          </div>
          <div>
            <span className="text-syntax-keyword">const </span>
            <span className="text-syntax-function">familiar</span>
            <span className="text-muted-foreground"> = [</span>
            <div className="ml-4 space-y-1 mt-1">
              {['Express', 'MongoDB'].map((t) => (
                <div key={t}>
                  <span className="text-syntax-string">&quot;{t}&quot;</span>
                  <span className="text-muted-foreground">,</span>
                </div>
              ))}
            </div>
            <span className="text-muted-foreground">]</span>
          </div>
        </div>
      </div>

      {/* Socials */}
      <div className="bg-ide-sidebar border border-border rounded-lg overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
          <span className="text-xs text-muted-foreground">socials.json</span>
        </div>
        <div className="p-4 space-y-2 text-sm">
          <div>
            <span className="text-syntax-function">&quot;github&quot;</span>
            <span className="text-muted-foreground">: </span>
            <a
              href="https://github.com/john-doe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-syntax-string hover:underline"
            >
              &quot;github.com/john-doe&quot;
            </a>
          </div>
          <div>
            <span className="text-syntax-function">&quot;linkedin&quot;</span>
            <span className="text-muted-foreground">: </span>
            <a
              href="https://linkedin.com/in/john-doe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-syntax-string hover:underline"
            >
              &quot;linkedin.com/in/john-doe&quot;
            </a>
          </div>
          <div>
            <span className="text-syntax-function">&quot;email&quot;</span>
            <span className="text-muted-foreground">: </span>
            <a href="mailto:john.doe@example.com" className="text-syntax-string hover:underline">
              &quot;john.doe@example.com&quot;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
