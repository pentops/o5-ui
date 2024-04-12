import React, { useEffect, useMemo, useState } from 'react';
import { DialogClose } from '@radix-ui/react-dialog';
import { MagicWandIcon, Pencil1Icon } from '@radix-ui/react-icons';
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
import { CodeEditor } from '@/components/code-editor/code-editor.tsx';
import { useUpdateMessage } from '@/data/api/mutation';
import { formatJSONString, getBase64StringObjectPaths } from '@/lib/json.ts';
import set from 'lodash.set';
import get from 'lodash.get';
import { O5DanteV1DeadMessageSpec } from '@/data/types';

const schema = z.object({
  message: z.object({
    payload: z.object({
      json: z.string(),
    }),
  }),
});

type Values = z.infer<typeof schema>;

function encodeValues(value: string, base64Paths: string[]) {
  const parsed = JSON.parse(value);

  for (const path of base64Paths) {
    set(parsed, path, window.btoa(get(parsed, path)));
  }

  return JSON.stringify(parsed, null, 2);
}

interface UpdateMessageDialogProps {
  messageId: string;
}

export function UpdateMessageDialog({ messageId }: UpdateMessageDialogProps) {
  const [base64Paths, setBase64Paths] = useState<string[]>([]);
  const [decodeBase64, setDecodeBase64] = useState(false);
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
          json: formatJSONString(
            data?.message?.currentSpec?.payload?.json ||
              `{
  
}`,
          ),
        },
      },
    }),
    [data?.message?.currentSpec?.payload?.json],
  );

  const form = useForm<Values>({ defaultValues, resetOptions: { keepDefaultValues: false, keepDirtyValues: false }, resolver: zodResolver(schema) });

  useEffect(() => {
    if (data?.message?.currentSpec?.payload?.json) {
      form.setValue('message.payload.json', formatJSONString(data.message.currentSpec.payload?.json, decodeBase64));

      try {
        const parsed = JSON.parse(data.message.currentSpec.payload?.json || '');
        setBase64Paths(getBase64StringObjectPaths(parsed));
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.message?.currentSpec?.payload?.json]);

  useEffect(() => {
    if (isOpen) {
      form.reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  async function handleEdit(values: Values) {
    try {
      if (data?.message?.currentSpec?.versionId) {
        let value = values.message.payload.json;

        // Re-encode base64 strings if decodeBase64 is true
        if (decodeBase64) {
          try {
            const encoded = encodeValues(value, base64Paths);
            value = encoded;
          } catch {
            toast({
              title: 'Invalid JSON',
              description: 'Please ensure the JSON is valid before attempting to edit the message.',
            });

            return;
          }
        }

        await mutateAsync({
          messageId,
          replacesVersionId: data.message.currentSpec.versionId,
          message: {
            ...data.message.currentSpec,
            ...values.message,
            payload: {
              // ...data.message.currentSpec.payload,
              json: value,
            },
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
                    <CodeEditor {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {base64Paths.length > 0 && (
              <button
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded flex gap-2 items-center text-sm"
                onClick={() => {
                  const nextDecode = !decodeBase64;
                  setDecodeBase64(nextDecode);

                  form.setValue(
                    'message.payload.json',
                    nextDecode
                      ? formatJSONString(form.getValues('message.payload.json'), true)
                      : encodeValues(form.getValues('message.payload.json'), base64Paths),
                  );
                }}
                type="button"
              >
                <MagicWandIcon />
                {decodeBase64 ? 'Encode' : 'Decode'}
              </button>
            )}

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
