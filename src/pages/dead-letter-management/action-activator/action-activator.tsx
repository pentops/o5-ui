import React from 'react';
import { ReplayMessageAlert } from '@/pages/dead-letter-management/action-activator/replay-message-alert/replay-message-alert.tsx';
import { UpdateMessageDialog } from '@/pages/dead-letter-management/action-activator/update-message-dialog/update-message-dialog.tsx';
import { ConfirmRejectAlert } from '@/pages/dead-letter-management/action-activator/confirm-reject-alert/confirm-reject-alert.tsx';

interface ActionActivatorProps {
  messageId: string;
}

export function ActionActivator({ messageId }: ActionActivatorProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      <ReplayMessageAlert messageId={messageId} />
      <UpdateMessageDialog messageId={messageId} />
      <ConfirmRejectAlert messageId={messageId} />
    </div>
  );
}
