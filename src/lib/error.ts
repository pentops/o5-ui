import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast.ts';
import { APIError } from '@pentops/jsonapi-request';

export function useErrorHandler(error: any, title: string, message?: string) {
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      let usableMessage = message || error.message;

      if (error instanceof APIError) {
        switch (error.status) {
          case 401:
            usableMessage = 'You are not authorized to perform this action.';
            break;
          case 403:
            usableMessage = 'You are forbidden from performing this action.';
            break;
          case 503:
            usableMessage = 'Service is currently unavailable. Please try again later.';
            break;
        }
      }

      toast({
        title,
        description: usableMessage,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, message, title]);
}
