import { CodeBenderPlaceholder } from "@/apps/codebender-profile-placeholder/CodeBenderPlaceholder";

export default function FirstBackendBenderProfile() {
  return (
    <div className="flex flex-col font-mono text-sm rounded-lg border border-border overflow-hidden">
     <CodeBenderPlaceholder codeBenderName={"FirstBackendBender"} section={"story"} />
    </div>
  );
}
