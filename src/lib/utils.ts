import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useToast } from '@/components/ui/use-toast.ts';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface IntersectionObserverOptions extends IntersectionObserverInit {
  disabled?: boolean;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function useIntersectionObserverAction(intersectionAction: Function | undefined, options?: IntersectionObserverOptions) {
  const { disabled, ...intersectionObserverOptions } = options || {};
  const [parentRef, setParentRef] = useState<HTMLElement | null>(null);
  const [observedItemRef, setObservedItemRef] = useState<HTMLElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  useLayoutEffect(() => {
    let localObserver: IntersectionObserver;

    if (!disabled && intersectionAction && observedItemRef) {
      localObserver = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            intersectionAction();
          }
        },
        { root: parentRef || window.document, rootMargin: '200px', threshold: 0.1, ...intersectionObserverOptions },
      );

      localObserver.observe(observedItemRef);

      observer.current = localObserver;
    }

    return () => {
      localObserver?.disconnect();
      observer.current = null;
    };
  }, [observedItemRef, parentRef, disabled, intersectionAction, intersectionObserverOptions]);

  return useMemo(() => [setObservedItemRef, setParentRef], []);
}

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

type CopiedText = string | null;
type CopyFn = (text: string) => Promise<boolean>;

export function useCopyToClipboard(): [CopiedText, CopyFn] {
  const [copied, setCopied] = useState<CopiedText>(null);
  const copy: CopyFn = async (text) => {
    setCopied(null);

    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      setCopied(null);
      return false;
    }
  };

  return [copied, copy];
}
