import React, { useMemo, useState } from 'react';
import { DialogClose } from '@radix-ui/react-dialog';
import { Pencil1Icon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useToast } from '@/components/ui/use-toast.ts';
import { useErrorHandler } from '@/lib/error.ts';
import { useUpsertEnvironment } from '@/data/api/mutation';
import { CodeEditor } from '@/components/code-editor/code-editor.tsx';

const schema = z.object({
  src: z.object({
    configJson: z.string().optional(),
    configYaml: z.string().optional(),
  }),
});

type Values = z.infer<typeof schema>;

interface UpsertEnvironmentDialogProps {
  environmentId?: string;
}

export function UpsertEnvironmentDialog({ environmentId }: UpsertEnvironmentDialogProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync, isPending, error } = useUpsertEnvironment();
  useErrorHandler(error, 'Error upserting environment');

  const defaultValues = useMemo(
    () => ({
      src: {},
    }),
    [],
  );

  const form = useForm<Values>({ defaultValues, resetOptions: { keepDefaultValues: false, keepDirtyValues: false }, resolver: zodResolver(schema) });

  async function handleEdit(values: Values) {
    try {
      await mutateAsync({
        environmentId,
        ...values,
      });

      toast({
        title: 'Environment upserted',
        description: `Environment ${environmentId} has been upserted.`,
      });

      setIsOpen(false);
    } catch {}
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Form {...form}>
        <DialogTrigger aria-label="Upsert environment">
          <Pencil1Icon aria-hidden />
        </DialogTrigger>
        <DialogContent>
          <form className="w-100 overflow-auto" onSubmit={form.handleSubmit(handleEdit)}>
            <DialogHeader>
              <DialogTitle>Upsert Environment</DialogTitle>
            </DialogHeader>

            <FormField
              control={form.control}
              name="src.configJson"
              render={({ field }) => (
                <FormItem className="py-2">
                  <FormLabel>Config JSON</FormLabel>
                  <FormControl>
                    <CodeEditor {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="src.configYaml"
              render={({ field }) => (
                <FormItem className="py-2">
                  <FormLabel>Config YAML</FormLabel>
                  <FormControl>
                    <CodeEditor {...field} language="yaml" value={field.value || ''} />
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
