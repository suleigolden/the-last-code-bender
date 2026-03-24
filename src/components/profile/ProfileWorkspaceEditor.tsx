import { useDeferredValue, useEffect, useState } from 'react';
import { SandpackProvider, SandpackPreview } from '@codesandbox/sandpack-react';
import { toast } from 'sonner';
import { Save, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  PROFILE_WORKSPACE_PATHS,
  getDefaultProfileWorkspaceFiles,
  normalizeWorkspaceFiles,
  type ProfileWorkspacePath,
} from '@/lib/profile-workspace-defaults';
import { buildWorkspaceSandpackFiles } from '@/lib/profile-workspace-sandpack';
import {
  useProfileSnapshots,
  useProfileWorkspace,
  useSaveProfileWorkspace,
  useSnapshotFiles,
} from '@/hooks/useProfileWorkspace';

interface ProfileWorkspaceEditorProps {
  benderId: string;
}

export function ProfileWorkspaceEditor({ benderId }: ProfileWorkspaceEditorProps) {
  const { data: workspaceRow, isLoading } = useProfileWorkspace(benderId);
  const { data: snapshots = [] } = useProfileSnapshots(benderId);
  const { mutateAsync: saveWorkspace, isPending: saving } = useSaveProfileWorkspace();
  const { mutateAsync: loadSnapshot, isPending: loadingSnap } = useSnapshotFiles();

  const [files, setFiles] = useState(() => getDefaultProfileWorkspaceFiles());
  const [activePath, setActivePath] = useState<ProfileWorkspacePath>('index.tsx');
  const [saveOpen, setSaveOpen] = useState(false);
  const [commitMessage, setCommitMessage] = useState('');

  useEffect(() => {
    if (isLoading) return;
    if (workspaceRow?.files) {
      setFiles(normalizeWorkspaceFiles(workspaceRow.files));
      return;
    }
    setFiles(getDefaultProfileWorkspaceFiles());
    // Re-sync only when workspace row identity/updated_at changes (not arbitrary files reference churn).
    // eslint-disable-next-line react-hooks/exhaustive-deps -- workspaceRow.files intentionally omitted
  }, [isLoading, workspaceRow?.bender_id, workspaceRow?.updated_at]);

  const deferredFiles = useDeferredValue(files);
  const sandpackFiles = buildWorkspaceSandpackFiles(deferredFiles);

  const handleSave = async () => {
    const msg = commitMessage.trim();
    if (msg.length < 3) {
      toast.error('Commit message must be at least 3 characters.');
      return;
    }
    try {
      await saveWorkspace({ benderId, files, commitMessage: msg });
      toast.success('Profile saved.');
      setSaveOpen(false);
      setCommitMessage('');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Save failed';
      toast.error(message);
    }
  };

  const restore = async (snapshotId: string) => {
    try {
      const restored = await loadSnapshot(snapshotId);
      setFiles(restored);
      toast.success('Restored snapshot locally — save to publish.');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Could not load snapshot';
      toast.error(message);
    }
  };

  return (
    <Card className="flex min-h-0 flex-1 flex-col overflow-hidden bg-ide-sidebar border-border">
      <CardContent className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden p-4 pt-0">
     
        <ResizablePanelGroup direction="horizontal" className="min-h-0 flex-1 rounded-md border border-border">
          <ResizablePanel defaultSize={45} minSize={28}>
            <div className="flex h-full min-h-0 flex-col bg-background/60">
              <div className="flex shrink-0 flex-wrap gap-1 border-b border-border p-2">
                {PROFILE_WORKSPACE_PATHS.map((path) => (
                  <button
                    key={path}
                    type="button"
                    onClick={() => setActivePath(path)}
                    className={cn(
                      'rounded px-2 py-1 font-mono text-[10px] transition-colors',
                      activePath === path
                        ? 'bg-primary/20 text-primary'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {path === 'index.tsx' ? 'index.tsx' : path.replace('sections/', '')}
                  </button>
                ))}
              </div>
              <Textarea
                value={files[activePath]}
                onChange={(e) => setFiles((prev) => ({ ...prev, [activePath]: e.target.value }))}
                className="min-h-0 flex-1 resize-none rounded-none border-0 font-mono text-xs focus-visible:ring-0"
                spellCheck={false}
              />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle className="bg-border w-1" />
          <ResizablePanel defaultSize={55} minSize={35}>
            <div className="h-full min-h-0 bg-[#0c0e14]">
              <SandpackProvider
                template="react-ts"
                theme="dark"
                files={sandpackFiles}
                options={{
                  autorun: true,
                  recompileMode: 'delayed',
                  recompileDelay: 350,
                }}
                style={{ height: '100%', minHeight: 700, padding: '0px' }}
              >
                <SandpackPreview
                  showOpenInCodeSandbox={false}
                  style={{ height: '100%', minHeight: 700 }}
                />
              </SandpackProvider>
            </div>
          </ResizablePanel>     
        </ResizablePanelGroup>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            className="font-mono gap-1"
            onClick={() => setSaveOpen(true)}
            disabled={saving}
          >
            <Save className="h-3.5 w-3.5" />
            Save
          </Button>
          {workspaceRow?.updated_at && (
            <span className="font-mono text-[10px] text-muted-foreground self-center">
              Last saved {new Date(workspaceRow.updated_at).toLocaleString()}
            </span>
          )}
        </div>

        {snapshots.length > 0 && (
          <Accordion type="single" collapsible className="shrink-0 rounded-md border border-border bg-background/40 px-3 font-mono">
            <AccordionItem value="commit-history" className="border-0">
              <AccordionTrigger className="py-3 text-left font-mono text-xs text-foreground hover:no-underline [&[data-state=open]]:text-muted-foreground">
                <span className="flex items-center gap-2">
                  <History className="h-3.5 w-3.5 shrink-0" />
                  View commit history
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-3 pt-0">
                <p className="mb-2 font-mono text-[10px] text-muted-foreground">
                  Restore loads into the editor locally — save again to publish.
                </p>
                <ScrollArea className="h-40 pr-2">
                  <ul className="space-y-1.5 font-mono text-[10px]">
                    {snapshots.map((s) => (
                      <li key={s.id} className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground truncate">{s.commit_message}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 shrink-0 font-mono text-[10px]"
                          disabled={loadingSnap}
                          onClick={() => restore(s.id)}
                        >
                          Restore
                        </Button>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}


        <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
          <DialogContent className="font-mono sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Save profile</DialogTitle>
              <DialogDescription>
                Describe this change like a git commit. Your files are saved to the database and versioned.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 py-2">
              <Label htmlFor="commit-msg">Commit message</Label>
              <Input
                id="commit-msg"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="e.g. Refresh hero copy and stack pills"
                className="font-mono text-sm"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setSaveOpen(false)} className="font-mono">
                Cancel
              </Button>
              <Button type="button" onClick={handleSave} disabled={saving} className="font-mono">
                {saving ? 'Saving…' : 'Save'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
