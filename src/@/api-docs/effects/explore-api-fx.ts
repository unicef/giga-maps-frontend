import { createEffect } from "effector";

import { APIListType } from "~/api/types";
import { createRequestAuthFx } from "~/core/auth/effects/common.fx";

import { CountryListType } from "../types/country-list.type";
import { DownloadDataType, ExploreApiType, SchoolListType } from "../types/explore-api-type";
import { $downloadFormData } from "../ui/components/modals/download-data-modal/download-data.model";

export const getExploreApiListFx = createEffect(() => {
  return createRequestAuthFx({
    url: 'accounts/apis/'
  }) as Promise<APIListType<ExploreApiType>>
})

export const getCountryListFx = createEffect((query: string) => {
  return createRequestAuthFx({
    url: `locations/countries/${query}`,
  }) as Promise<CountryListType[]>
})

export const getSchoolListByCountryFx = createEffect(({ countryId, query }: { countryId?: number; query?: string; }) => {
  const page = 0;
  const limit = 5;
  return createRequestAuthFx({
    url: `locations/gsearch/?fields=id,name&page_no=${page}&page_size=${limit}${countryId ? `&country_id__in=${countryId}` : ''}&ordering=name${query ? `&q=${query}*&search_fields=name,giga_id_school,external_id` : ''}`,
  }) as Promise<SchoolListType[]>
})

export const downloadSchoolDataFx = createEffect(({ pageSize, pageNo, countryId, schoolIds, apiKey }: ReturnType<typeof $downloadFormData.getState>) => {
  return createRequestAuthFx({
    url: `locations/schools-download/?page=${pageNo}&page_size=${pageSize}&ordering=name&expand=country,last_weekly_status,admin1,admin2${countryId ? "&country_id=" + countryId : ""}${schoolIds && schoolIds?.length > 0 ? "&id__in=" + schoolIds?.join(',') : ""}`,
    isDownloadable: true,
    headers: {
      'Api-Key': apiKey,
      'content-type': 'text/csv'
    },
    fn: (props) => props
  }) as Promise<string>
});

export const downloadCountryDataFx = createEffect(async ({ pageSize, pageNo, countryId, apiKey }: ReturnType<typeof $downloadFormData.getState>) => {
  return createRequestAuthFx({
    url: `locations/countries-download/?page=${pageNo}&page_size=${pageSize}&ordering=name&expand=last_weekly_status${countryId ? "&id=" + countryId : ""}`,
    isDownloadable: true,
    headers: {
      'Api-Key': apiKey,
      'content-type': 'text/csv'
    },
    fn: (props) => props
  }) as Promise<string>
});