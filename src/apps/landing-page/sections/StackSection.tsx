import { AnimatedFolder, Project } from "@/components/ui/3d-folder";

// Tech definitions with descriptions and unique colors
type TechDefinition = {
  description: string;
  color: string;
  textColor: string;
}

const techDefinitions: Record<string, TechDefinition> = {
  // Frontend
  "React": { 
    description: "Component-based UI library for building interactive interfaces", 
    color: "#0081A3",
    textColor: "#FFFFFF" 
  },
  "Next.js": { 
    description: "React framework for production with SSR and static generation", 
    color: "#000000",
    textColor: "#FFFFFF" 
  },
  "TypeScript": { 
    description: "Typed superset of JavaScript for scalable applications", 
    color: "#3178c6",
    textColor: "#FFFFFF" 
  },
  "Tailwind CSS": { 
    description: "Utility-first CSS framework for rapid UI development", 
    color: "#06b6d4",
    textColor: "#FFFFFF" 
  },
  "Chakra UI": { 
    description: "React-based UI framework for building user interfaces", 
    color: "#4fc08d",
    textColor: "#FFFFFF" 
  },
  "Bootstrap": { 
    description: "CSS framework for building responsive and mobile-first web applications", 
    color: "#dd0031",
    textColor: "#FFFFFF" 
  },
  "JavaScript": { 
    description: "Programming language for building interactive web applications", 
    color: "#ff3e00",
    textColor: "#FFFFFF" 
  },
  
  // Backend
  "Node.js": { 
    description: "JavaScript runtime for building scalable server-side applications", 
    color: "#339933",
    textColor: "#FFFFFF" 
  },
  "Express": { 
    description: "Minimal web framework for Node.js applications", 
    color: "#000000",
    textColor: "#FFFFFF" 
  },
  "NestJS": { 
    description: "Progressive Node.js framework for efficient server-side apps", 
    color: "#e0234e",
    textColor: "#FFFFFF" 
  },
  "Python": { 
    description: "High-level programming language for versatile development", 
        color: "#3776ab",
    textColor: "#FFFFFF" 
  },
  "Django": { 
    description: "High-level Python web framework for rapid development", 
    color: "#092e20",
    textColor: "#FFFFFF" 
  },
  "FastAPI": { 
    description: "Modern Python web framework for building APIs", 
    color: "#009688",
    textColor: "#FFFFFF" 
  },
  "Java": { 
    description: "Object-oriented programming language for enterprise apps", 
    color: "#ed8b00",
    textColor: "#FFFFFF" 
  },
  "Spring Boot": { 
    description: "Java framework for creating production-ready applications", 
    color: "#6db33f",
    textColor: "#FFFFFF" 
  },
  "C#": { 
    description: "Modern object-oriented language for .NET development", 
    color: "#239120",
    textColor: "#FFFFFF" 
  },
  ".NET Core": { 
    description: "Cross-platform framework for building modern applications", 
    color: "#512bd4",
    textColor: "#FFFFFF" 
  },
  "PHP": { 
    description: "Server-side scripting language for web development", 
    color: "#777bb4",
    textColor: "#FFFFFF" 
  },
  "Laravel": { 
    description: "Elegant PHP framework for web artisans", 
    color: "#ff2d20",
    textColor: "#FFFFFF" 
  },
   
  // Databases
  "PostgreSQL": { 
    description: "Advanced open-source relational database system", 
    color: "#336791",
    textColor: "#FFFFFF" 
  },
  "MySQL": { 
    description: "Popular open-source relational database management system", 
    color: "#4479a1",
    textColor: "#FFFFFF" 
  },
  "MongoDB": { 
    description: "NoSQL document database for modern applications", 
    color: "#47a248",
    textColor: "#FFFFFF" 
  },
  "Redis": { 
    description: "In-memory data structure store for caching and messaging", 
    color: "#dc382d",
    textColor: "#FFFFFF" 
  },
  "Elasticsearch": { 
    description: "Distributed search and analytics engine", 
    color: "#005571",
    textColor: "#FFFFFF" 
  },
  
  // Cloud & DevOps
  "AWS": { 
    description: "Comprehensive cloud computing platform and services", 
    color: "#ff9900",
    textColor: "#FFFFFF" 
  },
  "Docker": { 
    description: "Platform for containerizing and deploying applications", 
    color: "#2496ed",
    textColor: "#FFFFFF" 
  },
  "Kubernetes": { 
    description: "Container orchestration system for managing deployments", 
    color: "#326ce5",
    textColor: "#FFFFFF" 
  },
  "CI/CD": { 
    description: "Continuous integration and deployment practices", 
    color: "#8b5cf6",
    textColor: "#FFFFFF" 
  },
  "GitHub Actions": { 
    description: "Automation platform for CI/CD workflows", 
    color: "#2088ff",
    textColor: "#FFFFFF" 
  },
    
  // Tools & Others
  "Git": { 
    description: "Distributed version control system for tracking changes", 
    color: "#f05032",
    textColor: "#FFFFFF" 
  },
  "Agile Development": { 
    description: "Iterative approach to software development and delivery", 
    color: "#ff6b6b",
    textColor: "#FFFFFF" 
  },
  "REST APIs": { 
    description: "Architectural style for designing networked applications", 
    color: "#00d4ff",
    textColor: "#FFFFFF" 
  },
  "WebSockets": { 
    description: "Protocol for real-time bidirectional communication", 
    color: "#010101",
    textColor: "#FFFFFF" 
  },
  "Microservices": { 
    description: "Architectural approach for building distributed systems", 
    color: "#ff6b35",
    textColor: "#FFFFFF" 
  },
};

const stackFolders = [
  {
    title: "Frontend",
    gradient: "linear-gradient(135deg, #c678dd 0%, #56b6c2 100%)",
    techs: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Chakra UI", "Bootstrap", "JavaScript"],
  },
  {
    title: "Backend",
    gradient: "linear-gradient(135deg, #e5c07b 0%, #c678dd 100%)",
    techs: ["Node.js", "Express", "NestJS", "Python", "Django", "FastAPI", "Java", "Spring Boot", "C#", ".NET Core", "PHP", "Laravel"],
  },
  {
    title: "Databases",
    gradient: "linear-gradient(135deg, #56b6c2 0%, #56b6c2 100%)",
    techs: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch"],
  },
  {
    title: "Cloud & DevOps",
    gradient: "linear-gradient(135deg, #61afef 0%, #c678dd 100%)",
    techs: ["AWS", "Docker", "Kubernetes", "CI/CD", "GitHub Actions"],
  },
  {
    title: "Tools & Others",
    gradient: "linear-gradient(135deg, #e06c75 0%, #56b6c2 100%)",
    techs: ["Git", "Agile Development", "REST APIs", "WebSockets", "Microservices"],
  },
];

export const StackSection = () => {
  return (
    <section className="py-12 px-4" id="stack">
      {/* Header */}
      <div className="font-mono text-sm text-syntax-comment mb-6">
        {"// stack/technologies.md — My tech arsenal"}
      </div>

      {/* Stack Folders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {stackFolders.map((folder) => {
          const projects: Project[] = folder.techs.map((tech, index) => {
            const techDef = techDefinitions[tech] || {
              description: `${tech} technology`,
              color: "#6366f1",
              textColor: "#FFFFFF"
            };
            return {
              id: `${folder.title.toLowerCase()}-${index}`,
              title: tech,
              description: techDef.description,
              color: techDef.color,
              textColor: techDef.textColor,
            };
          });

          return (
            <AnimatedFolder
              key={folder.title}
              title={folder.title}
              projects={projects}
              gradient={folder.gradient}
              className="w-full max-w-sm"
            />
          );
        })}
      </div>

      {/* Summary */}
      <div className="ide-panel p-6 border-l-4 border-l-primary mt-12 max-w-3xl mx-auto">
        <p className="font-mono text-syntax-comment mb-2">{"// Philosophy"}</p>
        <p className="text-foreground">
          I believe in using the right tool for the job. My stack evolves with each project,
          always learning and adapting to deliver the best solutions. Hover over the folders above
          to explore the technologies I work with.
        </p>
      </div>
    </section>
  );
};
