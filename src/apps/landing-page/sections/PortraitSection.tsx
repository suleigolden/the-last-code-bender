import portraitImage from "@/assets/the-last-code-bender-2.png";

export const PortraitSection = () => {
  return (
    <section className="py-12 px-4" id="portrait">
      {/* Header */}
      <div className="font-mono text-sm text-syntax-comment mb-6">
        {"// assets/the-last-code-bender.png — Image Preview"}
      </div>

      {/* Image Preview Panel */}
      <div className="ide-panel max-w-2xl mx-auto overflow-hidden">
        {/* Preview header */}
        <div className="bg-ide-tab px-4 py-2 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-syntax-function/60" />
            <div className="w-3 h-3 rounded-full bg-syntax-string/60" />
            <span className="ml-2 text-xs font-mono text-muted-foreground">the-last-code-bender.png</span>
          </div>
          <span className="text-xs font-mono text-syntax-comment">768 × 1024 • PNG</span>
        </div>

        {/* Image container with checkered background */}
        <div 
          className="relative p-8 flex items-center justify-center"
          style={{
            backgroundImage: `
              linear-gradient(45deg, hsl(var(--muted)) 25%, transparent 25%),
              linear-gradient(-45deg, hsl(var(--muted)) 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, hsl(var(--muted)) 75%),
              linear-gradient(-45deg, transparent 75%, hsl(var(--muted)) 75%)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
          }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-80 h-80 bg-primary/20 blur-3xl rounded-full" />
          </div>

          {/* Image with border */}
          <div className="relative glow-primary rounded-lg overflow-hidden">
            <img
              src={portraitImage}
              alt="TheLastCodeBender"
              className="w-full max-w-md h-auto object-cover"
            />
          </div>
        </div>

        {/* Caption footer */}
        <div className="px-4 py-3 border-t border-border bg-ide-tab">
          <p className="text-center font-mono text-sm">
            <span className="text-primary">TheLastCodeBender</span>
            <span className="text-muted-foreground"> — Master of the Code Elements</span>
          </p>
        </div>
      </div>
    </section>
  );
};
