import React from 'react';
import { ConfirmDeleteAlert } from '@/pages/dead-letter-management/action-activator/confirm-delete-alert/confirm-delete-alert.tsx';
import { RequeueMessageAlert } from '@/pages/dead-letter-management/action-activator/requeue-message-alert/requeue-message-alert.tsx';
import { UpdateMessageDialog } from '@/pages/dead-letter-management/action-activator/update-message-dialog/update-message-dialog.tsx';

interface ActionActivatorProps {
  messageId: string;
}

export function ActionActivator({ messageId }: ActionActivatorProps) {
  return (
    <div className="flex content-center items-center gap-2">
      <RequeueMessageAlert messageId={messageId} />
      <UpdateMessageDialog messageId={messageId} />
      <ConfirmDeleteAlert messageId={messageId} />
    </div>
  );
}
