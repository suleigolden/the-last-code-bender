interface StoryRendererProps {
  markdown: string;
}

function applyInlineStyles(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-primary font-semibold">$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="text-syntax-number bg-muted px-1 rounded text-sm">$1</code>')
    .replace(/\*([^*]+)\*/g, '<em class="text-syntax-string">$1</em>');
}


export function StoryRenderer({ markdown }: StoryRendererProps) {
  const lines = markdown.split('\n');
  const blocks: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeLines: string[] = [];

  lines.forEach((line, i) => {
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        blocks.push(
          <div
            key={i}
            className="bg-ide-sidebar border border-border rounded-lg p-4 font-mono text-sm text-syntax-comment my-3 overflow-x-auto"
          >
            {codeLines.join('\n')}
          </div>,
        );
        codeLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      return;
    }

    if (line.startsWith('### ')) {
      blocks.push(
        <p key={i} className="text-syntax-type font-medium text-base mt-4">
          {line.slice(4)}
        </p>,
      );
    } else if (line.startsWith('## ')) {
      blocks.push(
        <p key={i} className="text-syntax-function font-semibold text-lg mt-5">
          {line.slice(3)}
        </p>,
      );
    } else if (line.startsWith('# ')) {
      blocks.push(
        <p key={i} className="text-syntax-keyword font-bold text-xl mt-6">
          {line.slice(2)}
        </p>,
      );
    } else if (line.startsWith('> ')) {
      blocks.push(
        <p
          key={i}
          className="text-primary pl-4 border-l-2 border-cyan-400 my-2 italic"
          dangerouslySetInnerHTML={{ __html: applyInlineStyles(line.slice(2)) }}
        />,
      );
    } else if (line.startsWith('---')) {
      blocks.push(<hr key={i} className="border-border my-6" />);
    } else if (line.trim() === '') {
      blocks.push(<div key={i} className="h-3" />);
    } else {
      blocks.push(
        <p
          key={i}
          className="text-foreground/90 leading-7"
          dangerouslySetInnerHTML={{ __html: applyInlineStyles(line) }}
        />,
      );
    }
  });

  return <div className="space-y-0.5 font-mono text-sm leading-7">{blocks}</div>;
}
