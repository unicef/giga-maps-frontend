import { ActionableNotification } from "@carbon/react";

export default function Actionable({ onClose, onAction, title }: { onClose: () => void, onAction: () => void, title: string }) {

  return <ActionableNotification
    lowContrast
    inline
    title={title}
    subtitle="Are you sure?"
    closeOnEscape
    actionButtonLabel="Yes"
    onActionButtonClick={onAction}
    onClose={onClose}
    kind='warning-alt'
  />
}