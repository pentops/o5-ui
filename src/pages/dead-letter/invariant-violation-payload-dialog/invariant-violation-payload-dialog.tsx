import React from 'react';
import { DialogClose } from '@radix-ui/react-dialog';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button.tsx';
import { CodeEditor } from '@/components/code-editor/code-editor.tsx';

interface InvariantViolationPayloadDialogProps {
  payload: string;
}

export function InvariantViolationPayloadDialog({ payload }: InvariantViolationPayloadDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">View JSON</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Error Payload</DialogTitle>
        </DialogHeader>

        <CodeEditor disabled value={payload} />

        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
