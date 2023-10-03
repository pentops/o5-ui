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
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMessageAction } from '@/data/api/mutation';
import { useToast } from '@/components/ui/use-toast.ts';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useErrorHandler } from '@/lib/error.ts';
import { NumberFormat } from '@/components/format/number/number-format.tsx';

const schema = z.object({
  note: z.string().optional(),
});

type Values = z.infer<typeof schema>;

interface BatchRequeueAlertProps {
  messageIds: string[];
}

export function BatchRequeueAlert({ messageIds }: BatchRequeueAlertProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { mutateAsync, isLoading, error } = useMessageAction();
  useErrorHandler(error, 'Error requeuing message(s)');

  const form = useForm<Values>({
    resolver: zodResolver(schema),
  });

  async function handleRequeue(values: Values) {
    try {
      await mutateAsync({
        messageIds,
        action: {
          note: values.note || undefined,
          requeue: {},
        },
      });

      toast({
        title: `${messageIds.length} message(s) requeued`,
        description: `${messageIds.length} message(s) have been requeued.`,
      });

      setIsOpen(false);
    } catch {}
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <Form {...form}>
        <AlertDialogTrigger aria-label="Requeue messages" disabled={!messageIds.length}>
          <ReloadIcon aria-hidden />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <form onSubmit={form.handleSubmit(handleRequeue)}>
            <AlertDialogHeader>
              <AlertDialogTitle>Requeue message?</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div>
                  Requeuing the selected <NumberFormat value={messageIds.length} /> message(s) will move the message(s) back to the queue to be
                  processed again.
                </div>
              </AlertDialogDescription>

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem className="py-2">
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormDescription>Optionally include a note to provide context for why you're requeuing the selected message(s).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
              <Button disabled={isLoading} type="submit">
                Requeue
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </Form>
    </AlertDialog>
  );
}
