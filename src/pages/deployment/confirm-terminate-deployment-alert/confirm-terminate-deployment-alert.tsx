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
import { CircleBackslashIcon } from '@radix-ui/react-icons';
import { useTerminateDeployment } from '@/data/api/mutation';
import { useToast } from '@/components/ui/use-toast.ts';
import { UUID } from '@/components/uuid/uuid.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useErrorHandler } from '@/lib/error.ts';

interface ConfirmTerminateDeploymentAlertProps {
  deploymentId: string;
}

export function ConfirmTerminateDeploymentAlert({ deploymentId }: ConfirmTerminateDeploymentAlertProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { mutateAsync, isPending, error } = useTerminateDeployment();
  useErrorHandler(error, 'Error terminating deployment');
  async function handleTerminateDeployment() {
    try {
      await mutateAsync({ deploymentId });

      toast({
        title: 'Deployment terminated',
        description: `Deployment ${deploymentId} has been terminated.`,
      });

      setIsOpen(false);
    } catch {}
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger aria-label={`Terminate deployment with the ID ${deploymentId}`}>
        <CircleBackslashIcon aria-hidden />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Terminate deployment?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              Terminating this deployment{' '}
              <strong className="whitespace-nowrap">
                (<UUID uuid={deploymentId} />)
              </strong>{' '}
              will prevent the deployment from finishing, if it hasn't already.
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button disabled={isPending} onClick={handleTerminateDeployment} variant="destructive">
            Terminate
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
