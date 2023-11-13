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
import { UUID } from '@/components/uuid/uuid.tsx';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useErrorHandler } from '@/lib/error.ts';

const schema = z.object({
  note: z.string().optional(),
});

type Values = z.infer<typeof schema>;

interface RequeueMessageAlertProps {
  messageId: string;
}

export function RequeueMessageAlert({ messageId }: RequeueMessageAlertProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { mutateAsync, isPending, error } = useMessageAction();
  useErrorHandler(error, 'Error requeuing message');

  const form = useForm<Values>({
    resolver: zodResolver(schema),
  });

  async function handleRequeue(values: Values) {
    try {
      await mutateAsync({
        messageIds: [messageId],
        action: {
          note: values.note || undefined,
          action: { requeue: {} },
        },
      });

      toast({
        title: 'Message requeued',
        description: `Message ${messageId} has been requeued.`,
      });

      setIsOpen(false);
    } catch {}
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <Form {...form}>
        <AlertDialogTrigger aria-label="Requeue message">
          <ReloadIcon aria-hidden />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <form onSubmit={form.handleSubmit(handleRequeue)}>
            <AlertDialogHeader>
              <AlertDialogTitle>Requeue message?</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div>
                  Requeuing this message{' '}
                  <strong className="whitespace-nowrap">
                    (<UUID className="break-words" uuid={messageId} />)
                  </strong>{' '}
                  will move the message back to the queue to be processed again.
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
                    <FormDescription>Optionally include a note to provide context for why you're requeuing this message.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
              <Button disabled={isPending} type="submit">
                Requeue
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </Form>
    </AlertDialog>
  );
}
