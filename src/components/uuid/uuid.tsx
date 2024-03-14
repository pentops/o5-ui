import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CopyIcon } from '@radix-ui/react-icons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { clsx } from 'clsx';
import { useCopyToClipboard } from '@/lib/copy.ts';

interface UUIDProps extends React.HTMLAttributes<HTMLSpanElement> {
  canCopy?: boolean;
  short?: boolean;
  to?: string;
  uuid: string | undefined;
}

export function UUID({ canCopy, className, short, to, uuid, ...rest }: UUIDProps) {
  const [isShowingCopiedNotice, setIsShowingCopiedNotice] = useState(false);
  const [copied, copy] = useCopyToClipboard();
  const uuidToRender = short ? uuid?.slice(0, 8) : uuid;

  useEffect(() => {
    let timeout: number;

    if (copied) {
      setIsShowingCopiedNotice(true);
      timeout = window.setTimeout(() => setIsShowingCopiedNotice(false), 1000);
    }

    return () => {
      window.clearTimeout(timeout);
    };
  }, [copied]);

  return (
    <span className={clsx('inline-flex content-center gap-1 font-mono', className)} {...rest}>
      {to ? <Link to={to}>{uuidToRender}</Link> : <span>{uuidToRender}</span>}
      {canCopy && uuidToRender && (
        <TooltipProvider>
          <Tooltip open={isShowingCopiedNotice}>
            <TooltipTrigger asChild>
              <button onClick={() => copy(uuid || '')} type="button">
                <CopyIcon />
              </button>
            </TooltipTrigger>
            <TooltipContent>Copied!</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </span>
  );
}
