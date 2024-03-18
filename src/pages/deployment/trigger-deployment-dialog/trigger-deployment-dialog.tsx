import React, { useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { DialogClose } from '@radix-ui/react-dialog';
import { RocketIcon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useToast } from '@/components/ui/use-toast.ts';
import { useErrorHandler } from '@/lib/error.ts';
import { useDeployment } from '@/data/api';
import { useTriggerDeployment } from '@/data/api/mutation';
import { Input } from '@/components/ui/input.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';

const schema = z.object({
  environment: z.string().min(1, { message: 'Environment is required (ID or full name)' }),
  source: z.object({
    github: z.object({
      owner: z.string().min(1, { message: 'Owner is required' }),
      repo: z.string().min(1, { message: 'Repo is required' }),
      commit: z.string().min(1, { message: 'Commit is required' }),
    }),
  }),
  flags: z.object({
    quickMode: z.boolean(),
    rotateCredentials: z.boolean(),
    cancelUpdates: z.boolean(),
    dbOnly: z.boolean(),
    infraOnly: z.boolean(),
  }),
});

type Values = z.infer<typeof schema>;

interface TriggerDeploymentDialogProps {
  deploymentId?: string;
}

export function TriggerDeploymentDialog({ deploymentId }: TriggerDeploymentDialogProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync, isPending, error } = useTriggerDeployment();
  useErrorHandler(error, 'Error triggering deployment');

  const { data, error: messageError } = useDeployment(isOpen && deploymentId ? { deploymentId } : undefined);
  useErrorHandler(messageError, 'Failed to load deployment');

  const defaultValues = useMemo(
    () => ({
      environment: data?.state?.spec?.environmentName || data?.state?.spec?.environmentId || '',
      source: {
        github: {
          owner: '',
          repo: data?.state?.spec?.appName || '',
          commit: data?.state?.spec?.version || '',
        },
      },
      flags: {
        quickMode: data?.state?.spec?.flags?.quickMode || false,
        rotateCredentials: data?.state?.spec?.flags?.rotateCredentials || false,
        cancelUpdates: data?.state?.spec?.flags?.cancelUpdates || false,
        dbOnly: data?.state?.spec?.flags?.dbOnly || false,
        infraOnly: data?.state?.spec?.flags?.infraOnly || false,
      },
    }),
    [data?.state?.spec],
  );

  const form = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  useEffect(() => {
    if (isOpen) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form, isOpen]);

  async function handleEdit(values: Values) {
    try {
      await mutateAsync({
        deploymentId: uuid(),
        ...values,
      });

      toast({
        title: 'Deployment triggered',
        description: `Deployment ${values.source.github.owner}/${values.source.github.repo}:${values.source.github.commit} has been triggered.`,
      });

      setIsOpen(false);
    } catch {}
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Form {...form}>
        <DialogTrigger aria-label="Trigger Deployment">
          <RocketIcon aria-hidden />
        </DialogTrigger>
        <DialogContent>
          <form className="w-100 overflow-auto flex flex-col gap-2" onSubmit={form.handleSubmit(handleEdit)}>
            <DialogHeader>
              <DialogTitle>Trigger Deployment</DialogTitle>
              <DialogDescription asChild>
                <div>
                  Initiate a deployment for <strong>{data?.state?.spec?.appName || 'your app'}</strong>.
                </div>
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="environment"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
            </div>

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

            <legend className="flex flex-col gap-2 items-start space-x-0 space-y-0">
              <h3>Flags</h3>

              <div className="grid grid-cols-3 gap-2">
                <FormField
                  control={form.control}
                  name="flags.quickMode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Quick Mode</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="flags.rotateCredentials"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Rotate Credentials</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="flags.cancelUpdates"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Cancel Updates</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="flags.dbOnly"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Database Only</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="flags.infraOnly"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Infrastructure Only</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </legend>

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
