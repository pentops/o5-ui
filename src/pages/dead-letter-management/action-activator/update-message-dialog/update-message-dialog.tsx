import React, { useEffect, useMemo, useState } from 'react';
import { DialogClose } from '@radix-ui/react-dialog';
import { Pencil1Icon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UUID } from '@/components/uuid/uuid.tsx';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useToast } from '@/components/ui/use-toast.ts';
import { useErrorHandler } from '@/lib/error.ts';
import { useMessage } from '@/data/api';
import { JSONEditor } from '@/components/json-editor/json-editor.tsx';
import { useUpdateMessage } from '@/data/api/mutation';
import { O5DanteV1DeadMessageSpec } from '@/data/types';
import { Input } from '@/components/ui/input.tsx';
import { formatJSONString } from '@/lib/json.ts';

const schema = z.object({
  message: z.object({
    payload: z.object({
      json: z.string(),
      proto: z.object({
        '@type': z.string(),
        'value': z.any(),
      }),
    }),
  }),
});

type Values = z.infer<typeof schema>;

interface UpdateMessageDialogProps {
  messageId: string;
}

export function UpdateMessageDialog({ messageId }: UpdateMessageDialogProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync, isPending, error } = useUpdateMessage();
  useErrorHandler(error, 'Error updating message');

  const { data, error: messageError } = useMessage(isOpen ? { messageId } : undefined);
  useErrorHandler(messageError, 'Failed to load dead letter message');
  const defaultValues = useMemo(
    () => ({
      message: {
        payload: {
          proto: {
            '@type': data?.message?.currentSpec?.payload?.proto?.['@type'] || '',
            'value': data?.message?.currentSpec?.payload?.proto?.value || '',
          },
          json: formatJSONString(
            data?.message?.currentSpec?.payload?.json ||
              `{
  
}`,
          ),
        },
      },
    }),
    [data?.message?.currentSpec?.payload?.json, data?.message?.currentSpec?.payload?.proto],
  );

  const form = useForm<Values>({ defaultValues, resetOptions: { keepDefaultValues: false, keepDirtyValues: false }, resolver: zodResolver(schema) });

  useEffect(() => {
    if (data?.message?.currentSpec?.payload?.json) {
      form.setValue('message.payload.json', formatJSONString(data.message.currentSpec.payload?.json));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.message?.currentSpec?.payload?.json]);

  useEffect(() => {
    if (data?.message?.currentSpec?.payload?.proto?.value) {
      form.setValue('message.payload.proto.value', data.message.currentSpec.payload.proto.value);
    }

    if (data?.message?.currentSpec?.payload?.proto?.['@type']) {
      form.setValue('message.payload.proto.@type', data.message.currentSpec.payload.proto['@type']);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.message?.currentSpec?.payload?.proto]);

  async function handleEdit(values: Values) {
    try {
      if (data?.message) {
        await mutateAsync({
          messageId,
          replacesVersionId: data?.message?.currentSpec?.versionId,
          message: {
            ...data?.message?.currentSpec,
            ...values.message,
          } as O5DanteV1DeadMessageSpec,
        });

        toast({
          title: 'Message edited',
          description: `Message ${messageId} has been edited.`,
        });

        setIsOpen(false);
      }
    } catch {}
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Form {...form}>
        <DialogTrigger aria-label="Edit message">
          <Pencil1Icon aria-hidden />
        </DialogTrigger>
        <DialogContent>
          <form className="w-100 overflow-auto" onSubmit={form.handleSubmit(handleEdit)}>
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
              name="message.payload.json"
              render={({ field }) => (
                <FormItem className="py-2">
                  <FormLabel>Message JSON</FormLabel>
                  <FormControl>
                    <JSONEditor {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message.payload.proto.@type"
              render={({ field }) => (
                <FormItem className="py-2">
                  <FormLabel>Proto Type</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message.payload.proto.value"
              render={({ field }) => (
                <FormItem className="py-2">
                  <FormLabel>Proto Value</FormLabel>
                  <FormControl>
                    <JSONEditor {...field} />
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
                Edit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Form>
    </Dialog>
  );
}
