import { combine, createEvent, createStore, restore, sample } from "effector";

import { getSchoolListByCountryFx } from "~/@/api-docs/effects/explore-api-fx";
import { $currentApiKey, $currentSelectedApi, $currentSelectedApiData } from "~/@/api-docs/models/explore-api.model";
import { $downloadDataPopup } from '~/@/api-docs/models/popup.model';
import { CountryListType } from "~/@/api-docs/types/country-list.type";
import { SchoolListType } from "~/@/api-docs/types/explore-api-type";
import { getCardAllProps } from "~/@/api-docs/utils";
import { debounce, setPayloadResults } from "~/lib/effector-kit";

const defaultFormPick = {
  pageNo: 1,
  pageSize: 10,
}

export const setCountryItem = createEvent<CountryListType>();
export const $selectedCountry = restore(setCountryItem, null);
export const setSelectedSchool = createEvent<SchoolListType[]>()
export const $selectedSchools = restore(setSelectedSchool, []);
export const setSearchSchool = createEvent<string>()
export const $filterByName = restore<string>(setSearchSchool, '');
export const $searchSchoolQuery = $filterByName.map((value) => value.length >= 2 ? value : '')

export const $searchSchoolList = createStore<SchoolListType[]>([]);
$searchSchoolList.on(getSchoolListByCountryFx.doneData, setPayloadResults);


export const setPageNo = createEvent<number>();
export const $pageNo = restore(setPageNo, 1);

export const setPageSize = createEvent<number>();
export const $pageSize = restore(setPageSize, 100);

export const $filterSchoolList = sample({
  source: combine({
    schools: $searchSchoolList,
    selectedSchools: $selectedSchools
  }),
  fn: ({ schools, selectedSchools }) => {
    const ignoreIds = selectedSchools.map((school) => school.id);
    const filterSchoolList = schools.filter(school => {
      if (ignoreIds.includes(school.id)) {
        return false;
      }
      return true
    }).slice(0, 10)
    return [
      ...selectedSchools,
      ...filterSchoolList
    ]
  }
})

// export const $filterSchoolList = sample({
//   source: combine({
//     schools: $searchSchoolList,
//     selectedSchools: $selectedSchools
//   }),
//   fn: ({ schools, selectedSchools }) => {
//     return [
//       ...selectedSchools,
//       ...schools
//     ]
//   }
// })

export const $formFields = sample({
  source: combine({
    exploreApiData: $currentSelectedApiData
  }),
  fn: ({ exploreApiData }) => {
    const { isCountry, isIndicator, isDate, isSchool } = getCardAllProps(exploreApiData);
    return {
      ...defaultFormPick,
      ...(isCountry && { countryId: '' }),
      ...(isSchool && { schoolIds: [] }),
      ...(isIndicator && { indicator: '' }),
    }
  }

})

export const $downloadFormData = sample({
  source: combine({
    countryId: $selectedCountry.map((country) => country?.id ?? null),
    schoolIds: $selectedSchools.map(schools => schools?.map(list => list.id) || []),
    pageSize: $pageSize,
    pageNo: $pageNo,
    api: $currentSelectedApi,
    apiKey: $currentApiKey
  })
})

sample({
  clock: debounce($searchSchoolQuery, { timeout: 300 }),
  source: combine({
    query: $searchSchoolQuery,
    country: $selectedCountry,
    selectedSchools: $selectedSchools
  }),
  fn: ({ query, country }) => {
    return {
      query,
      countryId: country?.id
    }
  },
  filter: ({ query, selectedSchools }) => {
    const lastschool = selectedSchools[selectedSchools.length - 1];
    if (!query || query === lastschool?.name) return false;
    return true;
  },
  target: getSchoolListByCountryFx
})

// reset data;
$selectedCountry.reset($downloadDataPopup)
$selectedSchools.reset($downloadDataPopup)
$filterByName.reset([$downloadDataPopup])
$pageNo.reset($downloadDataPopup)
$pageSize.reset($downloadDataPopup)
$searchSchoolList.reset($downloadDataPopup, setCountryItem);
// $searchSchoolQuery.reset($searchSchoolLessThan)