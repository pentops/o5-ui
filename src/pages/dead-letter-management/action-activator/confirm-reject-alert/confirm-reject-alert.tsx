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
import { useToast } from '@/components/ui/use-toast.ts';
import { UUID } from '@/components/uuid/uuid.tsx';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useErrorHandler } from '@/lib/error.ts';
import { useO5DanteV1DeadMessageCommandServiceRejectDeadMessage } from '@/data/api/hooks/generated';

const schema = z.object({
  reason: z.string().optional(),
});

type Values = z.infer<typeof schema>;

interface ConfirmRejectAlertProps {
  messageId: string;
}

export function ConfirmRejectAlert({ messageId }: ConfirmRejectAlertProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { mutateAsync, isPending, error } = useO5DanteV1DeadMessageCommandServiceRejectDeadMessage();
  useErrorHandler(error, 'Error rejecting message');

  const form = useForm<Values>({
    resolver: zodResolver(schema),
  });

  async function handleReject(values: Values) {
    try {
      await mutateAsync({
        messageId,
        reason: values.reason || undefined,
      });

      toast({
        title: 'Message rejected',
        description: `Message ${messageId} has been rejected.`,
      });

      setIsOpen(false);
    } catch {}
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <Form {...form}>
        <AlertDialogTrigger aria-label="Reject message">
          <Cross1Icon aria-hidden />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <form className="w-100 overflow-auto" onSubmit={form.handleSubmit(handleReject)}>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject message?</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div>
                  Rejecting this message{' '}
                  <strong className="whitespace-nowrap">
                    (<UUID uuid={messageId} />)
                  </strong>{' '}
                  will prevent the message from being edited and replayed. This is permanent and cannot be undone.
                </div>
              </AlertDialogDescription>

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem className="py-2">
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormDescription>Optionally include a reason to provide context for why you're rejecting this message.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
              <Button disabled={isPending} variant="destructive" type="submit">
                Reject
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </Form>
    </AlertDialog>
  );
}
