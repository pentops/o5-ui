import { useLayoutEffect, useMemo, useRef, useState } from 'react';

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
