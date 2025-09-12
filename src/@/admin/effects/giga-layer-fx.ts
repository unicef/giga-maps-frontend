import { attach, createEffect } from "effector"

import { APIListType } from "~/api/types"
import { createRequestAuthFx } from "~/core/auth/effects/common.fx"

import { DataLayer, DataSource, LayerStatusType, PreviewDataType } from "../types/giga-layer.type"

export const commonLayerListFx = createEffect(({ page, pageSize, search }: { page: number, pageSize: number; search?: string }) => {
  return createRequestAuthFx({
    url: `accounts/layers/?expand=created_by,last_modified_by,published_by&page_size=${pageSize}&page=${page}${search ? `&search=${search}` : ''}&ordering=-last_modified_at,name`
  }) as Promise<APIListType<DataLayer>>
})

export const cacheDataLayerListFx = attach({
  effect: commonLayerListFx,
  mapParams: (props) => props,
})

export const getDataLayerListFx = attach({
  effect: commonLayerListFx,
  mapParams: (props) => props,
})


export const getDataLayerByIdFx = createEffect(({ id }: { id: number }) => {
  return createRequestAuthFx({
    url: `accounts/layers/?id=${id}&expand=created_by,last_modified_by,published_by`
  }) as Promise<APIListType<DataLayer>>
})

export const createDataLayerFx = createEffect(({ body, isEditMode, params }: any) => {
  return createRequestAuthFx({
    method: isEditMode ? 'PUT' : 'POST',
    url: `accounts/layers/${params.id ? params.id + '/' : ''}`,
    data: body
  }) as Promise<DataLayer>
})

export const getApiSourceValuesFx = createEffect(({ type }: { type: string }) => {
  return createRequestAuthFx({
    url: `accounts/data_sources/?data_source_type__in=${type}&status=PUBLISHED`
  }) as Promise<APIListType<DataSource>>
})

export const publishDataLayerFx = createEffect(({ id, status }: { id: number, status: LayerStatusType }) => {
  return createRequestAuthFx({
    method: 'PUT',
    data: { status },
    url: `accounts/layers/${id}/publish/`,
  }) as Promise<DataLayer>
})

export const getDataPreviewFx = createEffect(({ id }: { id: number }) => {
  return createRequestAuthFx({
    url: `/accounts/layers/${id}/preview/`,
  }) as Promise<PreviewDataType>
})
