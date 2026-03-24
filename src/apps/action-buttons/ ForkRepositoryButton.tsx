import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { useNavigate } from "react-router-dom";


export function ForkRepositoryButton() {
  const navigate = useNavigate();

  return (
    <Button
      className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-mono"
      size="lg"
      onClick={() => navigate('/login')}
    >
      <Github className="w-4 h-4 mr-2" />
      Claim Your Rank
    </Button>
  );
}
