import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useToast } from '@/components/ui/use-toast.ts';
import { UUID } from '@/components/uuid/uuid.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useErrorHandler } from '@/lib/error.ts';
import { useO5DanteV1DeadMessageCommandServiceReplayDeadMessage } from '@/data/api/hooks/generated';

interface ReplayMessageAlertProps {
  messageId: string;
}

export function ReplayMessageAlert({ messageId }: ReplayMessageAlertProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { mutateAsync, isPending, error } = useO5DanteV1DeadMessageCommandServiceReplayDeadMessage();
  useErrorHandler(error, 'Error replaying message');

  async function handleReplay() {
    try {
      await mutateAsync({ messageId });

      toast({
        title: 'Message queued for replay',
        description: `Message ${messageId} has been queued for replay.`,
      });

      setIsOpen(false);
    } catch {}
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger aria-label="Replay message">
        <ReloadIcon aria-hidden />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Replay message?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              Replaying this message{' '}
              <strong className="whitespace-nowrap">
                (<UUID className="break-words" uuid={messageId} />)
              </strong>{' '}
              will move the message back to the queue to be processed again.
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button disabled={isPending} onClick={handleReplay}>
            Replay
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
