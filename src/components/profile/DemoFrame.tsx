import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DemoFrameProps {
  url: string | null;
  views: number;
}

export const DemoFrame = ({ url, views }: DemoFrameProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error,  setError]  = useState(false);

  // No demo yet — CTA
  if (!url) {
    return (
      <div className="font-mono text-sm text-muted-foreground space-y-3">
        <p>// No live demo yet</p>
        <Button variant="outline" size="sm" asChild className="gap-2">
          <a
            href="https://github.com/suleigolden/the-last-code-bender"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Add your demo via PR
          </a>
        </Button>
      </div>
    );
  }

  const isStatic   = url.startsWith('/demos/');
  const isExternal = url.startsWith('http://') || url.startsWith('https://');
  const label      = isStatic ? url : isExternal ? new URL(url).hostname : url;

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-3 py-2 bg-ide-sidebar border-b border-border">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="flex-1 bg-background/50 rounded px-2 py-0.5 text-xs font-mono truncate text-muted-foreground">
          {label}
        </span>
        {isExternal && (
          <a href={url} target="_blank" rel="noopener noreferrer"
             className="text-muted-foreground hover:text-foreground shrink-0">
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Iframe area */}
      <div className="relative w-full h-96">
        {!loaded && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-ide-sidebar">
            <p className="font-mono text-xs text-muted-foreground animate-pulse">// Loading demo…</p>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-ide-sidebar">
            <p className="font-mono text-xs text-muted-foreground">// Could not load demo</p>
          </div>
        )}
        {!error && (
          <iframe
            src={url}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms"
            title="Demo"
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
          />
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-1.5 bg-ide-sidebar border-t border-border text-xs text-muted-foreground font-mono">
        {views.toLocaleString()} views
      </div>
    </div>
  );
};
