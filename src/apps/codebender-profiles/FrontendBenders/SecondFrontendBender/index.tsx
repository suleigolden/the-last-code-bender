import { CodeBenderPlaceholder } from "@/apps/codebender-profile-placeholder/CodeBenderPlaceholder";

export default function SecondFrontendBenderProfile() {
  return (
    <div className="flex flex-col font-mono text-sm rounded-lg border border-border overflow-hidden">
     <CodeBenderPlaceholder codeBenderName={"SecondFrontendBender"} section={"story"} />
    </div>
  );
}
