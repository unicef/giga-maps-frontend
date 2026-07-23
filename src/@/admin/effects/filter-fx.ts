import { createEffect } from "effector"

import { APIListType } from "~/api/types"
import { createRequestAuthFx } from "~/core/auth/effects/common.fx"

import { ColumnDBChoicesType, FilterConfiguration, FilterListType, FilterListWithOptionsTypes } from "../types/filter-list.type"
import { FilterAllValueType } from "../types/filter-list-type"

export const getFilterListFx = createEffect(({ page, pageSize, search }: { page: number, pageSize: number, search?: string }) => {
  const query = new URLSearchParams()
  query.set('page_size', String(pageSize))
  query.set('page', String(page))
  if (search) {
    query.set('search', search)
  }
  return createRequestAuthFx({
    url: `v2/entities/filters/?${query.toString()}&ordering=-last_modified_at&expand=column_configuration,published_by`
  }) as Promise<APIListType<FilterListType>>
})

export const getFilterPublishedListFx = createEffect(() => {
  return createRequestAuthFx({
    // page_size must cover the full published catalog; default pagination
    // only returns the first page and breaks country active-filter selection.
    url: `v2/entities/filters/?status=PUBLISHED&page_size=1000`
  }) as Promise<APIListType<FilterListType>>
})

export const filterColumnListFx = createEffect(() => {
  return createRequestAuthFx({
    url: `v2/entities/column_configurations/?is_filter_applicable=true`
  }) as Promise<APIListType<FilterConfiguration>>
})

export const getFilterListWithOptionsFx = createEffect((countryId: number) => {
  return createRequestAuthFx({
    url: `accounts/adv_filters/${countryId}/all/?expand=column_configuration`
  }) as Promise<APIListType<FilterListWithOptionsTypes>>
});

export const deleteFilterFx = createEffect(({ id }: { id: number }) => {
  return createRequestAuthFx({
    url: `v2/entities/filters/${id}/`,
    method: 'DELETE'
  }) as Promise<FilterListType>
})

export const addFilterFx = createEffect(({ body }: { body: FilterAllValueType }) => {
  return createRequestAuthFx({
    url: `v2/entities/filters/`,
    method: 'POST',
    data: body
  }) as Promise<FilterListType>
})
export const editFilterFx = createEffect(({ id, body }: { id: number, body: FilterAllValueType | { status: string } }) => {
  return createRequestAuthFx({
    url: `v2/entities/filters/${id + '/'}`,
    method: 'PUT',
    data: body
  }) as Promise<FilterListType>
})

export const getFilterListIdFx = createEffect(({ id }: { id: number }) => {
  return createRequestAuthFx({
    url: `v2/entities/filters/?id=${id}`
  }) as Promise<APIListType<FilterListType>>
})

export const publishFilterFx = createEffect(({ id }: { id: number }) => {
  return createRequestAuthFx({
    method: 'PUT',
    url: `v2/entities/filters/${id}/publish/`,
  }) as Promise<FilterListType>
})

export const getFilterChoicesFx = createEffect(({ id }: { id: number }) => {
  return createRequestAuthFx({
    url: `v2/entities/column_configurations/${id}/choices/`,
  }) as Promise<ColumnDBChoicesType>
})