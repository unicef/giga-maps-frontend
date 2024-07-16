// eslint-disable-next-line import/named
import { ToastNotificationProps } from "@carbon/react";
import { createEvent, createStore } from "effector";

import { setPayload } from "~/lib/effector-kit";

export const $notification = createStore<Partial<ToastNotificationProps> | null>(null);
export const onCreateNotification = createEvent<Partial<ToastNotificationProps>>();
export const clearNotification = createEvent();
$notification.on(onCreateNotification, setPayload);
$notification.reset(clearNotification);
