import React, { useMemo, useState } from 'react';
import { DialogClose } from '@radix-ui/react-dialog';
import { Pencil1Icon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useToast } from '@/components/ui/use-toast.ts';
import { useErrorHandler } from '@/lib/error.ts';
import { useStack } from '@/data/api';
import { useUpsertStack } from '@/data/api/mutation';
import { Input } from '@/components/ui/input.tsx';

const schema = z.object({
  config: z.object({
    codeSource: z.object({
      type: z.object({
        gitHub: z.object({
          owner: z.string(),
          repo: z.string(),
          ref: z.object({
            branch: z.string(),
          }),
        }),
      }),
    }),
  }),
});

type Values = z.infer<typeof schema>;

interface UpsertStackDialogProps {
  activator?: React.ReactNode;
  stackId?: string;
}

export function UpsertStackDialog({ activator = <Pencil1Icon aria-hidden />, stackId }: UpsertStackDialogProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync, isPending, error } = useUpsertStack();
  useErrorHandler(error, 'Error upserting stack');

  const { data, error: messageError } = useStack(isOpen && stackId ? { stackId } : undefined);
  useErrorHandler(messageError, 'Failed to load stack');
  const defaultValues = useMemo(
    () => ({
      config: {
        ...data?.state?.config,
        codeSource: {
          type: {
            gitHub: {
              owner: data?.state?.config?.codeSource?.type?.gitHub?.owner,
              repo: data?.state?.config?.codeSource?.type?.gitHub?.repo,
              branch: data?.state?.config?.codeSource?.type?.gitHub?.ref?.branch,
            },
          },
        },
      },
    }),
    [data],
  );

  const form = useForm<Values>({ defaultValues, resetOptions: { keepDefaultValues: false, keepDirtyValues: false }, resolver: zodResolver(schema) });

  async function handleEdit(values: Values) {
    try {
      const usableStackId = stackId || uuid();

      await mutateAsync({
        stackId: usableStackId,
        ...values,
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
      <Form {...form}>
        <DialogTrigger aria-label="Upsert stack">{activator}</DialogTrigger>
        <DialogContent>
          <form className="w-100 overflow-auto" onSubmit={form.handleSubmit(handleEdit)}>
            <DialogHeader>
              <DialogTitle>Upsert Stack</DialogTitle>
            </DialogHeader>

            <FormField
              control={form.control}
              name="config.codeSource.type.gitHub.owner"
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
              name="config.codeSource.type.gitHub.repo"
              render={({ field }) => (
                <FormItem className="py-2">
                  <FormLabel>GitHub Repository</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="config.codeSource.type.gitHub.ref.branch"
              render={({ field }) => (
                <FormItem className="py-2">
                  <FormLabel>Branch</FormLabel>
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
                Upsert
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Form>
    </Dialog>
  );
}
