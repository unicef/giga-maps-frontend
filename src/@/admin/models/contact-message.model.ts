import { createStore, sample } from "effector";

import { $notification } from "~/@/common/Toast/toast.model";
import { APIListType } from "~/api/types";
import { setPayload } from "~/lib/effector-kit";

import { defaultContactMesaage } from "../constants/background-task.constant";
import { deleteContactMessageFx, getContactMessageIdFx, getContactMessageListFx } from "../effects/contact-message-fx";
import { ContactMessage } from "../types/contact-message.type";



export const $constactMessageList = createStore<APIListType<ContactMessage> | null>(null);
$constactMessageList.on(getContactMessageListFx.doneData, setPayload);

export const $formContactMessage = createStore(defaultContactMesaage);
$formContactMessage.on(getContactMessageIdFx.doneData, setPayload)


sample({
  clock: deleteContactMessageFx.done,
  fn: ({ params }) => ({
    title: `Record Deleted.`,
    kind: 'success',
    subtitle: ''
  }),
  target: $notification
})