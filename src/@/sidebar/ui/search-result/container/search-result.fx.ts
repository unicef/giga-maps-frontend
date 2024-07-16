
import { request } from "~/api/request-setup";
import { APIListType } from "~/api/types";

import { ADMIN_UNKNOWN_TYPE, SEARCH_SCHOOL_RESULT_SIZE } from "./search-result.constant";
import { CountryWithDistrictCount, SearchResultApi } from "./search-result.type";
import { createRequestFx } from "~/lib/request-fx";
import Controller from "~/lib/request-fx/types";

export const fetchCountriesWithDistrictFx = createRequestFx(
  (_?: unknown, controller?: Controller): Promise<Record<string, CountryWithDistrictCount>> => request({
    url: "api/locations/search-countries/",
    signal: controller?.getSignal(),
  })
);

export const fetchSchoolListFx = createRequestFx(
  async ({ countryId, admin1, admin2, limit = 50, page = 0, query }: { countryId: string; admin1?: string; admin2?: string; limit?: number; page?: number; query?: string; }, controller?: Controller): Promise<APIListType<SearchResultApi>> => {
    let admin1Abbr = "admin1_id__exact";
    if (admin1 === ADMIN_UNKNOWN_TYPE) {
      admin1Abbr = "admin1_name__in";
      admin1 = "Unknown,null";
    }

    if (query && query.split(" ").length > 1) {
      query = `"${query}"`
    }

    return request({
      url: `api/locations/gsearch/?fields=country_id,country_name,country_code,admin1_name,admin2_name,id,name,external_id&page=${page}&page_size=${limit}&country_id__in=${countryId}&ordering=name${admin2 ? '&admin2_id__exact=' + admin2 : ''}${admin1 ? `&${admin1Abbr}=${admin1}` : ''}${query ? `&q=${query}*&search_fields=name,giga_id_school,external_id` : ''}`,
      signal: controller?.getSignal(),
    })
  }
)

export const getSearchResultsFx = createRequestFx(
  async ({ query, limit = SEARCH_SCHOOL_RESULT_SIZE }: { query: string; limit?: number; }, controller?: Controller): Promise<APIListType<SearchResultApi[]>> => {

    if (query && query.split(" ").length > 1) {
      query = `"${query}"`
    }

    return request({
      url: `api/locations/gsearch/?fields=country_id,country_name,country_code,admin1_name,admin2_name,id,name,giga_id_school,external_id&ordering=country_name,admin1_name,admin2_name,name&page=0&page_size=${limit}&q=${query}*&search_fields=name,giga_id_school,external_id`,
      signal: controller?.getSignal(),
    })
  });