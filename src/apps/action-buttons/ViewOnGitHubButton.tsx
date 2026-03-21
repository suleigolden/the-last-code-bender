import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { projectUrl } from "./action-helper";



export function ViewOnGitHubButton() {
    return (
        <Button
        variant="outline"
        className="border-primary text-primary hover:bg-primary/10 font-mono"
        size="lg"
        onClick={() => window.open(projectUrl, "_blank", "noopener,noreferrer")}
      >
        <Github className="w-4 h-4 mr-2" />
        View on GitHub
      </Button>
    )
}