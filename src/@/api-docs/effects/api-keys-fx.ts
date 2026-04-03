import { createEffect } from "effector";

import { APIListType } from "~/api/types";
import { createRequestAuthFx, createRequestFx } from "~/core/auth/effects/common.fx";

import { ApiKeysType } from "../types/api-keys.type";
import { ExploreApiType } from "../types/explore-api-type";
import { GIGA_MERTER_API_HOST } from "~/env";

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
  }) as Promise<ApiKeysType['active_api_categories_list']>
});

export const requestForExtensionFx = createEffect(({ id, body }: { id?: number, body: any; }) => {
  return createRequestAuthFx({
    url: `/accounts/api_keys/${id}/request_extension/`,
    method: 'PUT',
    data: body
  }) as Promise<ApiKeysType>
});


type GigaMeterCountriesType = {
  id: string;
  code: string;
  code_iso3: string;
  name: string;
  country_id: string;
  created_at: null | string;
}

export const getGigaMeterCountriesFx = createEffect(() => {
  return createRequestFx({
    baseUrl: `${GIGA_MERTER_API_HOST}/api/v1`,
    url: `/dailycheckapp_countries/all`,
    method: 'GET',
  }) as Promise<{
    data: GigaMeterCountriesType[]
  }>
});
