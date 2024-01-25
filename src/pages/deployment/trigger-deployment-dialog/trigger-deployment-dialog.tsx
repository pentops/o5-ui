import React, { useMemo, useState } from 'react';
import { DialogClose } from '@radix-ui/react-dialog';
import { RocketIcon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UUID } from '@/components/uuid/uuid.tsx';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useToast } from '@/components/ui/use-toast.ts';
import { useErrorHandler } from '@/lib/error.ts';
import { useDeployment } from '@/data/api';
import { useTriggerDeployment } from '@/data/api/mutation';
import { Input } from '@/components/ui/input.tsx';

const schema = z.object({
  environmentName: z.string().min(1, { message: 'Environment Name is required' }),
  source: z.object({
    github: z.object({
      owner: z.string().min(1, { message: 'Owner is required' }),
      repo: z.string().min(1, { message: 'Repo is required' }),
      commit: z.string().min(1, { message: 'Commit is required' }),
    }),
  }),
});

type Values = z.infer<typeof schema>;

interface TriggerDeploymentDialogProps {
  deploymentId: string;
}

export function TriggerDeploymentDialog({ deploymentId }: TriggerDeploymentDialogProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync, isPending, error } = useTriggerDeployment();
  useErrorHandler(error, 'Error triggering deployment');

  const { data, error: messageError } = useDeployment(isOpen ? { deploymentId } : undefined);
  useErrorHandler(messageError, 'Failed to load deployment');
  const defaultValues = useMemo(
    () => ({
      deploymentId,
      environmentName: data?.state?.spec?.environmentName || '',
      source: {
        github: {
          owner: '',
          repo: '',
          commit: '',
        },
      },
    }),
    [data?.state?.spec?.environmentName, deploymentId],
  );

  const form = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  async function handleEdit(values: Values) {
    try {
      if (deploymentId) {
        await mutateAsync({
          deploymentId,
          ...values,
        });

        toast({
          title: 'Deployment triggered',
          description: `Deployment ${deploymentId} has been triggered.`,
        });

        setIsOpen(false);
      }
    } catch {}
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Form {...form}>
        <DialogTrigger aria-label="Trigger Deployment">
          <RocketIcon aria-hidden />
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={form.handleSubmit(handleEdit)}>
            <DialogHeader>
              <DialogTitle>Trigger Deployment</DialogTitle>
              <DialogDescription asChild>
                <div>
                  Trigger deployment for deployment{' '}
                  <strong>
                    (<UUID uuid={deploymentId} />)
                  </strong>
                  .
                </div>
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="environmentName"
              render={({ field }) => (
                <FormItem className="py-2">
                  <FormLabel>Environment Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="source.github.owner"
              render={({ field }) => (
                <FormItem className="py-2">
                  <FormLabel>GitHub Owner</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="source.github.repo"
              render={({ field }) => (
                <FormItem className="py-2">
                  <FormLabel>Repository</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="source.github.commit"
              render={({ field }) => (
                <FormItem className="py-2">
                  <FormLabel>Commit</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button disabled={isPending} variant="outline">
                  Cancel
                </Button>
              </DialogClose>

              <Button disabled={isPending} type="submit">
                Trigger
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Form>
    </Dialog>
  );
}
