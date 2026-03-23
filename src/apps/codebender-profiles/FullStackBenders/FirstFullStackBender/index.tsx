import { CodeBenderPlaceholder } from "@/apps/codebender-profile-placeholder/CodeBenderPlaceholder";

export default function FirstFullStackBenderProfile() {
  return (
    <div className="flex flex-col font-mono text-sm rounded-lg border border-border overflow-hidden">
     <CodeBenderPlaceholder codeBenderName={"FirstFullStackBender"} section={"story"} />
    </div>
  );
}
