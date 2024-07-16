import { createEffect } from "effector";

import { APIListType } from "~/api/types";
import { createRequestAuthFx } from "~/core/auth/effects/common.fx";

import { ApiKeysType } from "../types/api-keys.type";
import { ExploreApiType } from "../types/explore-api-type";

export const requestForApiKeyFx = createEffect((body: any) => {
  return createRequestAuthFx({
    url: 'accounts/api_keys/',
    method: 'POST',
    data: body,
  }) as Promise<APIListType<ExploreApiType>>
});

export const getApiKeyListFx = createEffect(({ userId, page, pageSize }: { userId?: number, page?: number; pageSize?: number; }) => {
  return createRequestAuthFx({
    url: `accounts/api_keys/?page=${page}&page_size=${pageSize}&expand=api&ordering=-last_modified_at&user_id=${userId}`,
    method: 'GET',
  }) as Promise<APIListType<ApiKeysType>>
});

export const validateApiKeyFx = createEffect((body: any) => {
  return createRequestAuthFx({
    url: `accounts/validate_api_key/`,
    method: 'PUT',
    data: body
  }) as Promise<ApiKeysType>
});

export const requestForExtensionFx = createEffect(({ id, body }: { id?: number, body: any; }) => {
  return createRequestAuthFx({
    url: `/accounts/api_keys/${id}/request_extension/`,
    method: 'PUT',
    data: body
  }) as Promise<ApiKeysType>
});
