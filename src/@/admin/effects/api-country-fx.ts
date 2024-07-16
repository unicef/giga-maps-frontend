import { createEffect } from "effector"

import { APIListType } from "~/api/types"
import { createRequestAuthFx } from "~/core/auth/effects/common.fx"

import { CountryDailySummaryType, CountrySummaryType, CountryType } from "../types/country.type";
import { DataLayer } from "../types/giga-layer.type";


export const getCountryListFx = createEffect(({ page, pageSize, search }: { page?: number; pageSize?: number; search?: string }) => {
  return createRequestAuthFx({
    url: `locations/country/?ordering=name&page=${page}&page_size=${pageSize}${search ? `&search=${search}` : ''}`
  }) as Promise<APIListType<CountryType>>
})

export const getCountrySummaryListFx = createEffect(({ page, pageSize, search, filter }: { page?: number; pageSize?: number; search?: string, filter?: number[] }) => {
  const searchParam = search ? `&search=${search}` : '';
  return createRequestAuthFx({
    url: `/statistics/countryweeklystatus/?page=${page}&page_size=${pageSize}${(filter && filter.length > 0) ? `&country_id__in=${filter}` : ''}${searchParam}`
  }) as Promise<APIListType<CountrySummaryType>>
})

export const getCountryDailySummaryListFx = createEffect(({ page, pageSize, search, filter }: { page?: number; pageSize?: number; search?: string, filter?: number[] }) => {
  const searchType = search ? `&search=${search}` : '';
  const countryIds = (filter && filter.length > 0) ? `&country_id__in=${filter}` : '';
  return createRequestAuthFx({
    url: `/statistics/countrydailystatus/?page=${page}&page_size=${pageSize}${countryIds}${searchType}`
  }) as Promise<APIListType<CountryDailySummaryType>>
})

export const createOrUpdateCountryFx = createEffect(({ formData, isEdit, countryItemId }: any) => {
  const countryId = countryItemId ? countryItemId + '/' : '';
  return createRequestAuthFx({
    method: isEdit ? 'PUT' : 'POST',
    url: `locations/country/${countryId}`,
    body: formData
  }) as Promise<CountryType>
})


export const createCountrySummaryFx = createEffect(({ body, isEditMode, params }: any) => {
  const countryId = params?.id ? params?.id + '/' : '';
  return createRequestAuthFx({
    method: isEditMode ? 'PUT' : 'POST',
    url: `statistics/countryweeklystatus/${countryId}`,
    data: body
  }) as Promise<CountrySummaryType>
})


export const getCountrySummaryIdFx = createEffect(({ id }: { id: number }) => {
  return createRequestAuthFx({
    url: `statistics/countryweeklystatus/${id + '/'}`

  }) as Promise<CountrySummaryType>
})

export const getCountryIdFx = createEffect(({ id }: { id: number }) => {
  return createRequestAuthFx({
    url: `locations/country/${id + '/'}`
  }) as Promise<CountryType>
})

export const deleteCountrySummaryFx = createEffect(({ body, }: any) => {
  return createRequestAuthFx({
    method: 'DELETE',
    url: `statistics/countryweeklystatus/`,
    data: body
  }) as Promise<CountrySummaryType>
})

export const deleteCountryFx = createEffect(({ body, }: any) => {
  return createRequestAuthFx({
    method: 'DELETE',
    url: `locations/country/`,
    data: body
  }) as Promise<CountryType>
})

export const getCountryDailySummaryIdFx = createEffect(({ id }: { id: number }) => {
  return createRequestAuthFx({
    url: `statistics/countrydailystatus/${id}`
  }) as Promise<CountryDailySummaryType>
})


export const updateCountryDailySummaryIdFx = createEffect(({ dailySummaryId, body }: { dailySummaryId: number, body: any }) => {
  return createRequestAuthFx({
    method: 'PUT',
    url: `statistics/countrydailystatus/${dailySummaryId + '/'}`,
    data: body
  }) as Promise<CountryDailySummaryType>
})


export const createCountryDailySummaryFx = createEffect(({ body }: any) => {
  return createRequestAuthFx({
    method: 'POST',
    url: `statistics/countrydailystatus/`,
    data: body
  }) as Promise<CountryDailySummaryType>
})



export const deleteCountryDailySummaryFx = createEffect(({ body, }: any) => {
  return createRequestAuthFx({
    method: 'DELETE',
    url: `statistics/countrydailystatus/`,
    data: body
  }) as Promise<CountryDailySummaryType>
})


export const getPublishDataLayerListFx = createEffect(() => {
  return createRequestAuthFx({
    url: `accounts/layers/?expand=created_by,last_modified_by,published_by&status=PUBLISHED`
  }) as Promise<APIListType<DataLayer>>
})

export const makeDataSourceValidFx = createEffect(({ body, }: any) => {
  return createRequestAuthFx({
    method: 'POST',
    url: `locations/mark-as-joined/`,
    data: body
  })
})