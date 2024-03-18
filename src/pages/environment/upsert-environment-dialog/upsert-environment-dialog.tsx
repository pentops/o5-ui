import React, { useState } from 'react';
import { DialogClose } from '@radix-ui/react-dialog';
import { Pencil1Icon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { v4 as uuid } from 'uuid';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useToast } from '@/components/ui/use-toast.ts';
import { useErrorHandler } from '@/lib/error.ts';
import { useUpsertEnvironment } from '@/data/api/mutation';
import { CodeEditor } from '@/components/code-editor/code-editor.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';

const schema = z.object({
  type: z.enum(['json', 'yaml']),
  config: z.string(),
});

type Values = z.infer<typeof schema>;

const defaultValues: Values = {
  type: 'json',
  config: '',
};

interface UpsertEnvironmentDialogProps {
  activator?: React.ReactNode;
  environmentId?: string;
}

export function UpsertEnvironmentDialog({ activator = <Pencil1Icon aria-hidden />, environmentId }: UpsertEnvironmentDialogProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync, isPending, error } = useUpsertEnvironment();
  useErrorHandler(error, 'Error upserting environment');

  const form = useForm<Values>({ defaultValues, resetOptions: { keepDefaultValues: false, keepDirtyValues: false }, resolver: zodResolver(schema) });
  const language = form.watch('type');

  async function handleEdit(values: Values) {
    try {
      const usableEnvironmentId = environmentId || uuid();
      await mutateAsync({
        environmentId: usableEnvironmentId,
        src: {
          configJson: values.type === 'json' ? values.config : undefined,
          configYaml: values.type === 'yaml' ? values.config : undefined,
        },
      });

      toast({
        title: 'Environment upserted',
        description: `Environment ${usableEnvironmentId} has been upserted.`,
      });

      setIsOpen(false);
    } catch {}
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Form {...form}>
        <DialogTrigger aria-label="Upsert environment">{activator}</DialogTrigger>
        <DialogContent>
          <form className="w-100 overflow-auto" onSubmit={form.handleSubmit(handleEdit)}>
            <DialogHeader>
              <DialogTitle>Upsert Environment</DialogTitle>
            </DialogHeader>

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="py-2">
                  <FormLabel>Config Type</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a config type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="yaml">YAML</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="config"
              render={({ field }) => (
                <FormItem className="py-2">
                  <FormLabel>Config</FormLabel>
                  <FormControl>
                    <CodeEditor {...field} language={language} value={field.value || ''} />
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
