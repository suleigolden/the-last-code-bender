import { LineNumbers } from "@/components/ide/LineNumbers";
import { Code2, Database, Cloud, Terminal, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

const stackContent = `# My Tech Stack

## Frontend
React • Next.js • TypeScript • Tailwind CSS
Vue.js • Angular • Svelte

## Backend
Node.js • Express • NestJS
Python • Django • FastAPI
Java • Spring Boot
C# • .NET Core
PHP • Laravel • Symfony

## Databases
PostgreSQL • MySQL • MongoDB
Redis • Elasticsearch

## Cloud & DevOps
AWS • Azure • Docker • Kubernetes
CI/CD • GitHub Actions • Terraform

## Tools & Others
Git • GraphQL • REST APIs
WebSockets • Microservices
`;

const stackMarkdown = stackContent.split('\n');

const stackCategories = [
  {
    name: "Frontend",
    icon: Palette,
    techs: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vue.js", "Angular", "Svelte"],
    colorClass: "text-syntax-keyword"
  },
  {
    name: "Backend",
    icon: Code2,
    techs: ["Node.js", "Express", "NestJS", "Python", "Django", "FastAPI", "Java", "Spring Boot", "C#", ".NET Core", "PHP", "Laravel", "Symfony"],
    colorClass: "text-syntax-function"
  },
  {
    name: "Databases",
    icon: Database,
    techs: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch"],
    colorClass: "text-syntax-number"
  },
  {
    name: "Cloud & DevOps",
    icon: Cloud,
    techs: ["AWS", "Azure", "Docker", "Kubernetes", "CI/CD", "GitHub Actions", "Terraform"],
    colorClass: "text-syntax-type"
  },
  {
    name: "Tools & Others",
    icon: Terminal,
    techs: ["Git", "GraphQL", "REST APIs", "WebSockets", "Microservices"],
    colorClass: "text-syntax-variable"
  },
];

export const StackSection = () => {
  return (
    <section className="py-12 px-4" id="stack">
      {/* Header */}
      <div className="font-mono text-sm text-syntax-comment mb-6">
        {"// stack/technologies.md — My tech arsenal"}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Code Block */}
        <div className="ide-panel overflow-hidden">
          {/* Editor header */}
          <div className="bg-ide-tab px-4 py-2 flex items-center gap-2 border-b border-border">
            <span className="text-xs font-mono text-muted-foreground">technologies.md</span>
            <span className="text-xs text-muted-foreground">—</span>
            <span className="text-xs text-syntax-comment font-mono">Preview Mode</span>
          </div>

          {/* Stack content with line numbers */}
          <div className="flex overflow-x-auto">
            <LineNumbers count={stackMarkdown.length} className="py-4 hidden md:flex" />
            <div className="flex-1 p-4 font-mono text-sm leading-7 overflow-x-auto">
              {stackMarkdown.map((line, index) => (
                <div
                  key={index}
                  className={`
                    ${line.startsWith('#') ? 'text-syntax-keyword font-bold text-lg mt-4' : ''}
                    ${line.startsWith('##') ? 'text-syntax-function font-semibold text-base mt-6' : ''}
                    ${line.trim() === '' ? 'h-4' : 'text-foreground/90'}
                  `}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stack Cards */}
        <div className="space-y-6">
          <h3 className="font-mono text-sm text-syntax-comment">
            {"// Organized by Category"}
          </h3>
          
          {stackCategories.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.name} className="ide-panel p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn("p-2 bg-muted rounded-lg", category.colorClass)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className={cn("font-bold text-lg font-mono", category.colorClass)}>
                    {category.name}
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.techs.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 bg-muted rounded-md text-sm font-mono text-foreground/80 hover:bg-primary/10 hover:text-primary transition-colors cursor-default"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Summary */}
          <div className="ide-panel p-6 border-l-4 border-l-primary">
            <p className="font-mono text-syntax-comment mb-2">{"// Philosophy"}</p>
            <p className="text-foreground">
              I believe in using the right tool for the job. My stack evolves with each project,
              always learning and adapting to deliver the best solutions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
