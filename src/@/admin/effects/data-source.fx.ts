import { createEffect } from "effector";

import { APIListType } from "~/api/types";
import { createRequestAuthFx } from "~/core/auth/effects/common.fx";

import { DataSourceType } from "../types/data-source.type";
import { CountryListType } from "~/@/api-docs/types/country-list.type";

export const getCountryDataSourceFx = createEffect((query: string) => {
  return createRequestAuthFx({
    url: `locations/countries/${query}`,
  }) as Promise<CountryListType[]>
})
export const getSchoolMasterListFx = createEffect(({ page, pageSize = 10, countryIds, ordering, statusFilter, search }: { page: number; pageSize?: number, countryIds?: string, ordering?: string, statusFilter?: string, search?: string }) => {
  return createRequestAuthFx({
    url: `sources/school_master/?expand=school,modified_by,country&page_size=${pageSize}&page=${page}${countryIds ? `&country_id__in=${countryIds}` : ''}${ordering ? `&ordering=${ordering}` : ''}${statusFilter ? `&status__in=${statusFilter}` : ''}${search ? `&search=${search}` : ''}`
  }) as Promise<APIListType<DataSourceType>>
})

export const updateSchoolMasterFx = createEffect(({ body }: { body: Partial<DataSourceType>[] }) => {
  return createRequestAuthFx({
    method: 'PUT',
    url: `sources/school_master/`,
    data: body
  }) as Promise<DataSourceType>
})

export const publishSchoolMasterFx = createEffect(({ body }: { body: Partial<DataSourceType>[] }) => {
  return createRequestAuthFx({
    method: 'PUT',
    url: `sources/school_master/publish/`,
    data: body
  }) as Promise<DataSourceType>
})

export const publishAllSchoolMasterFx = createEffect(({ body }: { body: Record<string, number>[] }) => {
  return createRequestAuthFx({
    method: 'PUT',
    url: `sources/school_master/country-publish/`,
    data: body
  }) as Promise<unknown>
})
export const deleteSchoolMasterFx = createEffect(({ body }: { body: Partial<DataSourceType>[] }) => {
  return createRequestAuthFx({
    method: 'DELETE',
    url: `sources/school_master/`,
    data: body
  }) as Promise<DataSourceType>
})

export const getByIdSchoolMasterFx = createEffect(({ params }: { params: { id: number } }) => {
  return createRequestAuthFx({
    url: `sources/school_master/${params.id ? params.id + '/' : ''}`,
  }) as Promise<DataSourceType>
})


