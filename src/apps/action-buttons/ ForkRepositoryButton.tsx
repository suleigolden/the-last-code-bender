import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { projectUrl } from "./action-helper";


export function ForkRepositoryButton() {
  return (
    <Button
      className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-mono"
      size="lg"
      onClick={() => window.open(projectUrl+"/fork", "_blank", "noopener,noreferrer")}
    >
      <Github className="w-4 h-4 mr-2" />
      Fork and Contribute
    </Button>
  );
}
