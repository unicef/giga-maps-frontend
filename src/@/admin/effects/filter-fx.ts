import { createEffect } from "effector"
import { createRequestAuthFx } from "~/core/auth/effects/common.fx"
import { APIListType } from "~/api/types"
import { FilterConfiguration, FilterListType } from "../types/filter-list.type"
import { FilterAllValueType } from "../types/filter-list-type"

export const getFilterListFx = createEffect(({ page, pageSize, search }: { page: number, pageSize: number, search?: string }) => {
  const query = new URLSearchParams()
  query.set('page_size', String(pageSize))
  query.set('page', String(page))
  if (search) {
    query.set('search', search)
  }
  return createRequestAuthFx({
    url: `accounts/adv_filters/?${query.toString()}&ordering=-last_modified_at&expand=column_configuration,published_by`
  }) as Promise<APIListType<FilterListType>>
})

export const getFilterPublishedListFx = createEffect(() => {
  return createRequestAuthFx({
    url: `accounts/adv_filters/?status=PUBLISHED`
  }) as Promise<APIListType<FilterListType>>
})

export const filterColumnListFx = createEffect(() => {
  return createRequestAuthFx({
    url: `accounts/column_configurations/?is_filter_applicable=true`
  }) as Promise<APIListType<FilterConfiguration>>
})

export const deleteFilterFx = createEffect(({ id }: { id: number }) => {
  return createRequestAuthFx({
    url: `accounts/adv_filters/${id}/`,
    method: 'DELETE'
  }) as Promise<FilterListType>
})

export const addFilterFx = createEffect(({ body }: { body: FilterAllValueType }) => {
  return createRequestAuthFx({
    url: `accounts/adv_filters/`,
    method: 'POST',
    data: body
  }) as Promise<FilterListType>
})
export const editFilterFx = createEffect(({ id, body }: { id: number, body: FilterAllValueType | { status: string } }) => {
  return createRequestAuthFx({
    url: `accounts/adv_filters/${id + '/'}`,
    method: 'PUT',
    data: body
  }) as Promise<FilterListType>
})

export const getFilterListIdFx = createEffect(({ id }: { id: number }) => {
  return createRequestAuthFx({
    url: `accounts/adv_filters/?id=${id}`
  }) as Promise<APIListType<FilterListType>>
})

export const publishFilterFx = createEffect(({ id }: { id: number }) => {
  return createRequestAuthFx({
    method: 'PUT',
    url: `accounts/adv_filters/${id}/publish/`,
  }) as Promise<FilterListType>
})