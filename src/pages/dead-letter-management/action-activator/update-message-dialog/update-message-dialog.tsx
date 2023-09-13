import React, { useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import { DialogClose } from '@radix-ui/react-dialog';
import { Pencil1Icon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UUID } from '@/components/uuid/uuid.tsx';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { useToast } from '@/components/ui/use-toast.ts';
import { useMessageAction } from '@/data/api/mutation';
import { useErrorHandler } from '@/lib/utils.ts';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-tomorrow.css';

const schema = z.object({
  note: z.string().optional(),
  json: z.string(),
});

type Values = z.infer<typeof schema>;

const defaultValues: Values = {
  json: `{
  
}`,
};

interface UpdateMessageDialogProps {
  messageId: string;
}

export function UpdateMessageDialog({ messageId }: UpdateMessageDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { mutateAsync, isLoading, error } = useMessageAction();
  useErrorHandler(error, 'Error editing message');

  const form = useForm({ defaultValues: defaultValues, resolver: zodResolver(schema) });

  async function handleEdit(values: Values) {
    try {
      await mutateAsync({
        messageId,
        action: {
          note: values.note || undefined,
          timestamp: new Date().toISOString(),
          edit: {
            newMessageJson: JSON.parse(values.json || '{}'),
          },
        },
      });

      toast({
        title: 'Message edited',
        description: `Message ${messageId} has been edited.`,
      });

      setIsOpen(false);
    } catch {}
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Form {...form}>
        <DialogTrigger aria-label="Edit message">
          <Pencil1Icon aria-hidden />
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={form.handleSubmit(handleEdit)}>
            <DialogHeader>
              <DialogTitle>Edit Message</DialogTitle>
              <DialogDescription asChild>
                <div>
                  Edit this message{' '}
                  <strong>
                    (<UUID uuid={messageId} />)
                  </strong>{' '}
                  before attempting to replay it.
                </div>
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="json"
              render={({ field }) => (
                <FormItem className="py-2">
                  <FormLabel>Message JSON</FormLabel>
                  <FormControl>
                    <div className="scrollbars max-h-96 overflow-auto rounded-md border border-input bg-transparent shadow-sm focus-visible:outline-none focus-within:ring-1 focus-within:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                      <Editor
                        {...field}
                        className="font-mono text-xs bg-transparent"
                        value={field.value || '{}'}
                        onValueChange={(value) => {
                          try {
                            field.onChange(value);
                          } catch {}
                        }}
                        highlight={(code) => highlight(code, languages.json)}
                        padding={10}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <DialogFooter>
              <DialogClose asChild>
                <Button disabled={isLoading} variant="outline">
                  Cancel
                </Button>
              </DialogClose>

              <Button disabled={isLoading} type="submit">
                Edit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Form>
    </Dialog>
  );
}
