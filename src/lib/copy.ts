import { useState } from 'react';

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
