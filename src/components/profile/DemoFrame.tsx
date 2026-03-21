interface DemoFrameProps {
  url: string;
  views: number;
}

export const DemoFrame = ({ url, views }: DemoFrameProps) => {
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
          {url}
        </span>
      </div>
      <iframe
        src={url}
        className="w-full h-96 border-0"
        sandbox="allow-scripts allow-same-origin"
        title="Demo"
      />
      <div className="px-3 py-1.5 bg-ide-sidebar border-t border-border text-xs text-muted-foreground font-mono">
        {views.toLocaleString()} views
      </div>
    </div>
  );
};
