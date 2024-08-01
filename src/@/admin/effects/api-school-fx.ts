import { createEffect } from "effector"

import { APIListType } from "~/api/types"
import { createRequestAuthFx } from "~/core/auth/effects/common.fx"

import { AdminType, CsvImport, SchoolDailyType, SchoolSummaryType, SchoolType } from "../types/school.type";



export const getSchoolListFx = createEffect(({ page, pageSize, search, filter }: { page?: number; pageSize?: number; search?: string, filter?: number[] }) => {
  let url = `locations/schools/school/?`
  url += `page=${page}&page_size=${pageSize}`;

  if (filter && filter.length > 0) {
    url += `&country_id__in=${filter.join(',')}`;
  }

  if (search) {
    url += `&search=${search}`;
  }

  return createRequestAuthFx({
    url: url
  }) as Promise<APIListType<SchoolType>>
})

export const createOrUpdateSchoolFx = createEffect(({ body, isEditMode, params }: any) => {
  return createRequestAuthFx({
    method: isEditMode ? 'PUT' : 'POST',
    url: `locations/schools/school/${params.id ? params.id + '/' : ''}`,
    data: body
  }) as Promise<SchoolType>
})

export const getSchoolIdFx = createEffect(({ id }: { id: number }) => {
  return createRequestAuthFx({
    url: `locations/schools/school/${id + '/'}`
  }) as Promise<SchoolType>
})

export const deleteSchoolFx = createEffect(({ body, }: any) => {
  return createRequestAuthFx({
    method: 'DELETE',
    url: `locations/schools/school/`,
    data: body
  }) as Promise<SchoolType>
})


export const getSchoolSummaryListFx = createEffect(({ page, pageSize, search, filter }: { page?: number; pageSize?: number; search?: string, filter?: number[] }) => {
  return createRequestAuthFx({
    url: `/statistics/schoolweeklystatus/?page=${page}&page_size=${pageSize}${(filter && filter.length > 0) ? `&country_id=${filter}` : ''}${search ? `&search=${search}` : ''}`
  }) as Promise<APIListType<SchoolSummaryType>>
})

export const getSchoolSummaryIdFx = createEffect(({ id }: { id: number }) => {
  return createRequestAuthFx({
    url: `/statistics/schoolweeklystatus/${id + '/'}`
  }) as Promise<SchoolSummaryType>
})

export const deleteSchoolSummaryFx = createEffect(({ body, }: any) => {
  return createRequestAuthFx({
    method: 'DELETE',
    url: `/statistics/schoolweeklystatus/`,
    data: body
  }) as Promise<SchoolType>
})

export const createOrUpdateSchoolSummaryFx = createEffect(({ body, isEditMode, params }: any) => {
  return createRequestAuthFx({
    method: isEditMode ? 'PUT' : 'POST',
    url: `/statistics/schoolweeklystatus/${params.id ? params.id + '/' : ''}`,
    data: body
  }) as Promise<SchoolType>
})

export const getSchoolDailyListFx = createEffect(({ page, pageSize, search, filter }: { page?: number; pageSize?: number; search?: string, filter?: number[] }) => {
  return createRequestAuthFx({
    url: `/statistics/schooldailystatus/?page=${page}&page_size=${pageSize}${(filter && filter.length > 0) ? `&country_id=${filter}` : ''}${search ? `&search=${search}` : ''}`
  }) as Promise<APIListType<SchoolDailyType>>
})

export const getSchoolDailyIdFx = createEffect(({ id }: { id: number }) => {
  return createRequestAuthFx({
    url: `/statistics/schooldailystatus/${id + '/'}`
  }) as Promise<SchoolSummaryType>
})

export const deleteSchoolDailyFx = createEffect(({ body, }: any) => {
  return createRequestAuthFx({
    method: 'DELETE',
    url: `statistics/schooldailystatus/`,
    data: body
  }) as Promise<SchoolSummaryType>
})

export const createOrUpdateSchoolDailyFx = createEffect(({ body, isEditMode, params }: any) => {
  return createRequestAuthFx({
    method: isEditMode ? 'PUT' : 'POST',
    url: `statistics/schooldailystatus/${params.id ? params.id + '/' : ''}`,
    data: body
  }) as Promise<SchoolType>
})


export const importCsvFx = createEffect(({ formData }: any) => {
  return createRequestAuthFx({
    method: 'POST',
    url: `/locations/schools/fileimport/`,
    body: formData
  }) as Promise<CsvImport>
})

export const getCsvImportListFx = createEffect(({ page, pageSize, search }: { page?: number; pageSize?: number; search?: string }) => {
  return createRequestAuthFx({
    url: `locations/schools/fileimport/?page=${page}&page_size=${pageSize}${search ? `&search=${search}` : ''}`
  }) as Promise<APIListType<CsvImport>>
})

export const getAdmin1ListFx = createEffect(({ layerName, countryId }: { layerName?: string; countryId?: string; }) => {
  return createRequestAuthFx({
    url: `locations/country-admin-metadata/?layer_name=${layerName}&country_id=${countryId}&ordering=description,name&expand=country,parent&page_size=500&fields=id,name,description,name_en&page=1`
  }) as Promise<APIListType<AdminType>>
})


export const getAdmin2ListFx = createEffect(({ layerName, countryId, parentId }: { layerName?: string; countryId?: string; parentId?: number }) => {
  return createRequestAuthFx({
    url: `locations/country-admin-metadata/?layer_name=${layerName}&country_id=${countryId}&ordering=description,name&expand=country,parent${parentId ? `&parent_id=${parentId}` : ''}&page_size=500&fields=id,name,description,name_en&page=1`
  }) as Promise<APIListType<AdminType>>
})