import { combine, createEvent, createStore, merge, restore, sample } from "effector";

import { $notification } from "~/@/common/Toast/toast.model";
import { APIListType } from "~/api/types";
import { errorToasterHandler, errorToastFilter } from "~/api/utils";
import { setPayload } from "~/lib/effector-kit";

import { downloadExcelFx } from "../effects/download-excel.fx";
import { downloadCountryDataFx, downloadSchoolDataFx, getCountryListFx, getExploreApiListFx, getSchoolListByCountryFx } from "../effects/explore-api-fx";
import { CountryListType } from "../types/country-list.type";
import { ExploreApiType } from "../types/explore-api-type";


export const onLoadApiList = createEvent();
export const $exploreApiListResp = createStore<APIListType<ExploreApiType> | null>(null);
export const $exploreApiData = $exploreApiListResp.map((resp) => resp?.results || []);
$exploreApiListResp.on(getExploreApiListFx.doneData, setPayload);

export const setExploreApiCategory = createEvent<string>();
export const $filterExploreApiCategory = restore(setExploreApiCategory, "");

export const setSearchExploreApi = createEvent<string>();
export const $searchFilterByName = restore(setSearchExploreApi, "");

export const setCurrentExploreApi = createEvent<number>();
export const $currentSelectedApi = restore(setCurrentExploreApi, null);

export const getCountryList = createEvent<boolean>();
export const $countryList = createStore<CountryListType[]>([]);
$countryList.on(getCountryListFx.doneData, setPayload);

export const getSchoolListByCountry = createEvent<string>();

export const setCurrentApiKey = createEvent<string>();
export const $currentApiKey = restore(setCurrentApiKey, "");


export const $currentSelectedApiData = sample({
  source: combine({ exploreData: $exploreApiData, selectedId: $currentSelectedApi }),
  fn: ({ exploreData, selectedId }) => {
    return exploreData?.find((item: ExploreApiType) => item.id === selectedId) || null;
  }
})

export const $exploreDataWithFilter = sample({
  source: combine({
    exploreData: $exploreApiData,
    filterCategory: $filterExploreApiCategory,
    search: $searchFilterByName
  }),
  fn: ({ exploreData, filterCategory, search }) => {
    return exploreData.filter((item) => {
      const name = item.name.toLowerCase();
      const description = item.description.toLocaleLowerCase();
      let isFilterCategory = !filterCategory;
      let isSearch = !search;
      if (filterCategory) {
        isFilterCategory = item.category === filterCategory
      }
      if (search) {
        isSearch = name.includes(search) || description.includes(search);
      }
      return isFilterCategory && isSearch;
    })
  }
})

sample({
  clock: onLoadApiList,
  source: $exploreApiListResp,
  target: getExploreApiListFx
})

sample({
  clock: getCountryList,
  fn: (hasSchool) => {
    if (hasSchool) {
      return `?has_schools=true`
    }
    return ''
  },
  target: getCountryListFx
})

sample({
  clock: getSchoolListByCountry,
  fn: (code) => ({ code }),
  target: getSchoolListByCountryFx
})

sample({
  source: downloadCountryDataFx.done,
  target: downloadExcelFx
})

sample({
  source: downloadSchoolDataFx.done,
  target: downloadExcelFx
})

sample({
  source: merge([downloadSchoolDataFx.failData, downloadCountryDataFx.failData]),
  fn: errorToasterHandler,
  filter: errorToastFilter,
  target: $notification
})