import { ToastNotification, ToastNotificationProps } from "@carbon/react"
import { useStore } from "effector-react"
import { styled } from 'styled-components'

import { $notification, clearNotification } from "./toast.model";

const ToastWrapper = styled(ToastNotification)`
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 10000;
`

export default function Toast(options?: Partial<ToastNotificationProps>) {
  const notification = useStore($notification);
  if (!notification) return null;
  const { title = "", subtitle = "", kind = 'info' } = notification;

  return (
    <ToastWrapper
      role="alert"
      title={title}
      subtitle={subtitle}
      kind={kind}
      timeout={5000}
      onClose={() => clearNotification()}
      onCloseButtonClick={() => clearNotification()}
      {...options}
    />
  )
}
