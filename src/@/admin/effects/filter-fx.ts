import { createEffect } from "effector"
import { createRequestAuthFx } from "~/core/auth/effects/common.fx"
import { APIListType } from "~/api/types"
import { FilterListType } from "../types/filter-list.type"

export const getFilterListFx = createEffect(() => {
  return createRequestAuthFx({
    url: `filter-list/`
  }) as Promise<APIListType<FilterListType>>
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