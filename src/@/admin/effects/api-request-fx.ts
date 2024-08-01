import { createEffect } from "effector";

import { APIListType } from "~/api/types";
import { createRequestAuthFx } from "~/core/auth/effects/common.fx";

import { ApiKeysAdminRequestType } from "../types/api-request.type";

export const getAllApiKeyRequest = createEffect(({ page, pageSize }: { page: number; pageSize: number }) => {
  return createRequestAuthFx({
    url: `accounts/api_keys/?page_size=${pageSize}&page=${page}&expand=user,api&ordering=-status`
  }) as Promise<APIListType<ApiKeysAdminRequestType>>
})

export const changeApiKeyRequestFx = createEffect(({ body, id }: { body: any; id: number }) => {
  return createRequestAuthFx({
    url: `accounts/api_keys/${id}/`,
    data: body,
    method: 'PUT'
  }) as Promise<ApiKeysAdminRequestType>
})

export const deleteApiKeyRequestFx = createEffect(({ id }: { id: number }) => {
  return createRequestAuthFx({
    url: `accounts/api_keys/${id}/`,
    method: 'DELETE'
  }) as Promise<ApiKeysAdminRequestType>
})

export const updateApiKeyExtensionFx = createEffect(({ id, body }: { id: number, body: any; }) => {
  return createRequestAuthFx({
    url: `accounts/api_keys/${id}/`,
    method: 'PUT',
    data: body
  }) as Promise<ApiKeysAdminRequestType>
});