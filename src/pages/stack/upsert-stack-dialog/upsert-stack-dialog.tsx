import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { DialogClose } from '@radix-ui/react-dialog';
import { Pencil1Icon } from '@radix-ui/react-icons';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button.tsx';
import { useToast } from '@/components/ui/use-toast.ts';
import { useErrorHandler } from '@/lib/error.ts';
import { useO5AwsDeployerV1DeploymentCommandServiceUpsertStack } from '@/data/api/hooks/generated';

interface UpsertStackDialogProps {
  activator?: React.ReactNode;
  stackId?: string;
}

export function UpsertStackDialog({ activator = <Pencil1Icon aria-hidden />, stackId }: UpsertStackDialogProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync, isPending, error } = useO5AwsDeployerV1DeploymentCommandServiceUpsertStack();
  useErrorHandler(error, 'Error upserting stack');

  async function handleUpsert() {
    try {
      const usableStackId = stackId || uuid();

      await mutateAsync({
        stackId: usableStackId,
      });

      toast({
        title: 'Stack upserted',
        description: `Stack ${usableStackId} has been upserted.`,
      });

      setIsOpen(false);
    } catch {}
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger aria-label="Upsert stack">{activator}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upsert Stack</DialogTitle>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button disabled={isPending} variant="outline">
              Cancel
            </Button>
          </DialogClose>

          <Button disabled={isPending} onClick={handleUpsert} type="button">
            Upsert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
