import { createEffect } from "effector"

import { APIListType } from "~/api/types"
import { createRequestAuthFx } from "~/core/auth/effects/common.fx"

import { ContactMessage } from "../types/contact-message.type";


export const getContactMessageListFx = createEffect(({ page, pageSize, search }: { page?: number; pageSize?: number; search?: string }) => {
  return createRequestAuthFx({
    url: `contact/contactmessage/?page=${page}&page_size=${pageSize}${search ? `&search=${search}` : ''}`
  }) as Promise<APIListType<ContactMessage>>
})

export const deleteContactMessageFx = createEffect(({ body, }: any) => {
  return createRequestAuthFx({
    method: 'DELETE',
    url: `contact/contactmessage/`,
    data: body
  }) as Promise<ContactMessage>
})

export const getContactMessageIdFx = createEffect(({ id }: { id: number }) => {
  return createRequestAuthFx({
    url: `contact/contactmessage/${id + '/'}`
  }) as Promise<ContactMessage>
})