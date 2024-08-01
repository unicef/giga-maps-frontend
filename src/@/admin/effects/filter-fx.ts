import { createEffect } from "effector"
import { createRequestAuthFx } from "~/core/auth/effects/common.fx"
import { APIListType } from "~/api/types"
import { FilterConfiguration, FilterListType } from "../types/filter-list.type"

export const getFilterListFx = createEffect(() => {
  return createRequestAuthFx({
    url: `accounts/adv_filters/?cache=false&ordering=-last_modified_at,name&expand=column_configuration,published_by`
  }) as Promise<APIListType<FilterListType>>
})

export const filterColumnListFx = createEffect(() => {
  return createRequestAuthFx({
    url: `accounts/column_configurations/?cache=false&is_filter_applicable=true`
  }) as Promise<APIListType<FilterConfiguration>>
})

export const deleteFilterApiKeyRequestFx = createEffect(({ id }: { id: number }) => {
  return createRequestAuthFx({
    url: `filter-list/${id}/`,
    method: 'DELETE'
  }) as Promise<FilterListType>
})

export const editFilterApiKeyRequestFx = createEffect(({ id }: { id: number }) => {
  return createRequestAuthFx({
    url: `filter-list/${id + '/'}`,
    method: 'PUT'
  }) as Promise<FilterListType>
})

export const getFilterListIdFx = createEffect(({ id }: { id: number }) => {
  return createRequestAuthFx({
    url: `filter-list/${id + '/'}`
  }) as Promise<FilterListType>
})