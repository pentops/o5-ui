import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast.ts';

export function useErrorHandler(error: any, title: string, message?: string) {
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title,
        description: message || error.message,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, message, title]);
}
