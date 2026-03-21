import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SkillInvokeModalProps {
  handle: string;
  open: boolean;
  onClose: () => void;
}

export const SkillInvokeModal = ({ handle, open, onClose }: SkillInvokeModalProps) => {
  const [copied, setCopied] = useState(false);
  const command = `@${handle}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-ide-sidebar border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm text-foreground">
            Invoke @{handle} in Claude Code
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="font-mono text-xs text-muted-foreground">
            // Add this skill to your Claude Code session
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-background rounded px-3 py-2 font-mono text-sm text-primary border border-border">
              {command}
            </code>
            <Button size="sm" variant="ghost" onClick={handleCopy} className="shrink-0">
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <p className="font-mono text-xs text-muted-foreground">
            // Paste this into any Claude Code chat to activate their skill
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
