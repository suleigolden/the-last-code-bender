import { LineNumbers } from "@/components/ide/LineNumbers";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const storyContent = `# The Legend of TheLastCodeBender

## Origins

In the ancient times of software, when the web was young and
technologies were scattered like stars across the digital sky,
there arose a developer who would master them all.

They began their journey in the realm of **Java** — learning
the ways of structure, discipline, and object-oriented wisdom.
The verbose incantations taught patience and precision.

## The Path of the Five Elements

### ☕ Java — The Foundation (Structure)
\`\`\`
// The first element: learning to build with discipline
public class TheBeginning {
    private final Passion passion = new Passion();
    public void writeCode() { /* with structure */ }
}
\`\`\`

From Java, the journey led to the kingdom of **C#** where
precision was refined. The .NET realm offered new powers:
elegant syntax, powerful frameworks, enterprise mastery.

### 🔷 C# — The Refinement (Precision)
\`\`\`
// The second element: precision in every line
public class Evolution : IDeveloper
{
    public async Task<Wisdom> LearnAsync() => await Study();
}
\`\`\`

Then came the wild lands of **PHP** — where adaptability
was born. The web's backbone demanded flexibility, rapid
iteration, and the humility to work with legacy code.

### 🐘 PHP — The Survivor (Adaptability)
\`\`\`
// The third element: bending to any challenge
<?php
class Adaptability {
    public function overcome($challenge) {
        return $this->find_a_way($challenge);
    }
}
\`\`\`

The path continued to the serene gardens of **Python**,
where clarity reigned supreme. Here, data spoke in clean
tongues, and automation became second nature.

### 🐍 Python — The Enlightened (Clarity)
\`\`\`
# The fourth element: seeing truth in simplicity
class Clarity:
    def __init__(self):
        self.wisdom = "Readable code is maintainable code"
    
    def solve(self, problem):
        return elegant_solution(problem)
\`\`\`

Finally, the mastery of **JavaScript** unlocked the fifth
element — the power of speed, creativity, and boundless
possibility. From Node to React, from pixels to servers.

### ⚡ JavaScript — The Infinite (Speed + Creativity)
\`\`\`
// The fifth element: unlimited potential
const TheLastCodeBender = {
  skills: ['frontend', 'backend', 'fullstack', 'beyond'],
  philosophy: 'Ship fast. Learn faster. Never stop.',
  
  async bend(code) {
    return await this.masterAnyLanguage(code);
  }
};
\`\`\`

## The Philosophy

> "A true developer does not fear new languages.
> They embrace them. They learn them. They bend them."

The LastCodeBender walks the path of perpetual learning.
Every new framework is an opportunity. Every challenge
is a chance to grow. Every line of code is a brushstroke
on the canvas of digital creation.

**The journey never ends. The code never stops flowing.**

---

*Status: Always Learning | Always Building | Always Shipping*
`;

const storyMarkdown = storyContent.split('\n');

export const StorySection = () => {
  const handleDownload = () => {
    const blob = new Blob([storyContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'TheLastCodeBender-Story.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="py-12 px-4" id="story">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="font-mono text-sm text-syntax-comment">
          {"// story/TheLegend.md — The journey through code elements"}
        </div>
        <Button
          onClick={handleDownload}
          variant="outline"
          size="sm"
          className="border-primary text-primary hover:bg-primary/10 font-mono"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Story
        </Button>
      </div>

      {/* Editor Panel */}
      <div className="ide-panel overflow-hidden">
        {/* Editor header */}
        <div className="bg-ide-tab px-4 py-2 flex items-center gap-2 border-b border-border">
          <span className="text-xs font-mono text-muted-foreground">TheLegend.md</span>
          <span className="text-xs text-muted-foreground">—</span>
          <span className="text-xs text-syntax-comment font-mono">Preview Mode</span>
        </div>

        {/* Story content with line numbers */}
        <div className="flex overflow-x-auto">
          <LineNumbers count={storyMarkdown.length} className="py-4 hidden md:flex" />
          <div className="flex-1 p-4 font-mono text-sm leading-7 overflow-x-auto">
            {storyMarkdown.map((line, index) => (
              <div
                key={index}
                className={`
                  ${line.startsWith('#') ? 'text-syntax-keyword font-bold text-lg mt-4' : ''}
                  ${line.startsWith('##') ? 'text-syntax-function font-semibold text-base mt-6' : ''}
                  ${line.startsWith('###') ? 'text-syntax-type font-medium mt-4' : ''}
                  ${line.startsWith('```') ? 'text-syntax-comment' : ''}
                  ${line.startsWith('//') || line.startsWith('#') && line.includes('element') ? 'text-syntax-comment' : ''}
                  ${line.startsWith('>') ? 'text-primary italic border-l-2 border-primary pl-4 my-2' : ''}
                  ${line.startsWith('*') && line.endsWith('*') ? 'text-syntax-string italic' : ''}
                  ${line.includes('**') ? '' : ''}
                  ${line.includes('\`\`\`') ? 'bg-ide-line-highlight -mx-4 px-4' : ''}
                  ${line.trim() === '' ? 'h-4' : 'text-foreground/90'}
                `}
                dangerouslySetInnerHTML={{
                  __html: line
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary">$1</strong>')
                    .replace(/`([^`]+)`/g, '<code class="text-syntax-number bg-muted px-1 rounded">$1</code>')
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tech Elements Cards */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 font-mono text-syntax-comment">
          {"// Tech Elements Mastered"}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { name: "Java", element: "Structure", color: "syntax-variable", emoji: "☕" },
            { name: "C#", element: "Precision", color: "syntax-keyword", emoji: "🔷" },
            { name: "PHP", element: "Adaptability", color: "syntax-type", emoji: "🐘" },
            { name: "Python", element: "Clarity", color: "syntax-function", emoji: "🐍" },
            { name: "JavaScript", element: "Speed", color: "syntax-number", emoji: "⚡" },
          ].map((tech) => (
            <div
              key={tech.name}
              className="ide-panel p-4 text-center hover:border-primary transition-colors group"
            >
              <div className="text-3xl mb-2">{tech.emoji}</div>
              <h4 className={`font-bold text-${tech.color} font-mono group-hover:glow-text transition-all`}>
                {tech.name}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">{tech.element}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
