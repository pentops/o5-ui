import React from 'react';
import { ConfirmBatchDeleteAlert } from './confirm-batch-delete-alert/confirm-batch-delete-alert.tsx';
import { BatchRequeueAlert } from './batch-requeue-alert/batch-requeue-alert.tsx';
import { NumberFormat } from '@/components/format/number/number-format.tsx';

interface BatchActionActivatorProps {
  messageIds: string[];
}

export function BatchActionActivator({ messageIds }: BatchActionActivatorProps) {
  return (
    <div className="flex content-center items-center gap-2 h-[20px]">
      {messageIds.length ? (
        <span className="text-sm">
          <NumberFormat value={messageIds.length} /> message(s) selected
        </span>
      ) : null}
      <BatchRequeueAlert messageIds={messageIds} />
      <ConfirmBatchDeleteAlert messageIds={messageIds} />
    </div>
  );
}
