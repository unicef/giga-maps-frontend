
import { EntityType } from "~/@/entities/types/base-entity.type";
import { request } from "~/api/request-setup";
import { APIListType } from "~/api/types";
import { createRequestFx } from "~/lib/request-fx";
import type { Controller } from "~/lib/request-fx/types";

import { ADMIN_UNKNOWN_TYPE, SEARCH_SCHOOL_RESULT_SIZE } from "./search-result.constant";
import { CountryWithDistrictCount, SearchResultApi } from "./search-result.type";

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
      url: `api/v2/entities/gentity-search/?fields=country_id,country_name,country_code,admin1_name,admin2_name,id,name,external_id&page=${page}&page_size=${limit}&country_id__in=${countryId}&ordering=name${admin2 ? '&admin2_id__exact=' + admin2 : ''}${admin1 ? `&${admin1Abbr}=${admin1}` : ''}${query ? `&q=${query}*&search_fields=name,giga_id_school,external_id&entity_type__code=${EntityType.SCHOOL}` : ''}`,
      signal: controller?.getSignal(),
    })
  }
)

export const getSearchResultsFx = createRequestFx(
  async ({
    query,
    limit = SEARCH_SCHOOL_RESULT_SIZE,
    countryId,
    page = 0,
    excludeCountryId = false,
    selectedSearchEntityTags = []
  }: {
    query: string;
    page?: number;
    limit?: number;
    countryId?: number;
    excludeCountryId?: boolean;
    selectedSearchEntityTags?: EntityType[];
  }, controller?: Controller): Promise<APIListType<SearchResultApi[]>> => {
    debugger;
    const splitQuery = query.split(" ");
    if (query && splitQuery.length > 1) {
      query = `"${query}"`;
    }

    const selectFields = `fields=country_id,country_name,country_code,admin1_name,admin2_name,id,name`;
    const orderingFields = `ordering=-row_score,country_name,name,admin1_name,admin2_name`;
    let searchFields = `&search_fields=name,external_id,country_name`;
    if (splitQuery.some(word => word.length >= 10)) {
      searchFields += `,giga_id_school`;
    }
    let countryFilter = '';
    if (excludeCountryId && countryId) {
      countryFilter = `&country_id__notexact=${countryId}`;
    } else if (countryId) {
      countryFilter = `&country_id__exact=${countryId}`;
    }
    debugger;

    let entityFilter = '&entity_type__code=all';
    if (selectedSearchEntityTags.length > 0) {
      entityFilter = `&entity_type__code=${selectedSearchEntityTags.join(',')}`;
    }

    return request({
      url: `api/v2/entities/gentity-search/?${selectFields}&${orderingFields}&page=${page}&page_size=${limit}&q=${query}*${searchFields}${countryFilter}${entityFilter}`,
      signal: controller?.getSignal(),
    })
  }
);