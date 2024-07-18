import { ActionableNotification } from "@carbon/react";

export default function Actionable({ onClose, onAction, title }: { readonly onClose: () => void, readonly onAction: () => void, readonly title: string }) {

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