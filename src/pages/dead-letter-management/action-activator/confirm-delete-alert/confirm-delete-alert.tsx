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
import { Cross1Icon } from '@radix-ui/react-icons';
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

interface ConfirmDeleteAlertProps {
  messageId: string;
}

export function ConfirmDeleteAlert({ messageId }: ConfirmDeleteAlertProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { mutateAsync, isLoading, error } = useMessageAction();
  useErrorHandler(error, 'Error deleting message');

  const form = useForm<Values>({
    resolver: zodResolver(schema),
  });

  async function handleDelete(values: Values) {
    try {
      await mutateAsync({
        messageIds: [messageId],
        action: {
          note: values.note || undefined,
          delete: {},
        },
      });

      toast({
        title: 'Message deleted',
        description: `Message ${messageId} has been deleted.`,
      });

      setIsOpen(false);
    } catch {}
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <Form {...form}>
        <AlertDialogTrigger aria-label="Delete message">
          <Cross1Icon aria-hidden />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <form onSubmit={form.handleSubmit(handleDelete)}>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete message?</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div>
                  Deleting this message{' '}
                  <strong className="whitespace-nowrap">
                    (<UUID uuid={messageId} />)
                  </strong>{' '}
                  will prevent the message from being edited and requeued. This is permanent and cannot be undone.
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
                    <FormDescription>Optionally include a note to provide context for why you're deleting this message.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
              <Button disabled={isLoading} variant="destructive" type="submit">
                Delete
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </Form>
    </AlertDialog>
  );
}
