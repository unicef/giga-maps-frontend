import { combine, createEvent, createStore, merge, restore, sample } from "effector";

import { $countries, $country, $countryCode } from "~/@/country/country.model";
import { APIListType } from "~/api/types";
import { $mapRoutes, mapCountry } from "~/core/routes";
import { debounce, setPayload, setPayloadResults } from "~/lib/effector-kit";
import { getId, getLocalStorage, setLocalStorage } from "~/lib/utils";

import { applySearchFx } from "../../../effects/search-country-fx";
import { $hasSearchInput, $isSearchFocused, $searchInput, $selectedSearchEntityTags, $showCountries, changeSearchText, clearSearchText } from "../../common-components/top-search-bar/top-search-bar.model";
import { MAX_SEARCH_HISTORY, SCHOOL_LIST_SEARCH_LENGTH, SEARCH_ADMIN_SIZE, SEARCH_COUNTRY_SIZE, SEARCH_DATA_TYPE, STORE_SEARCH_HISTORY } from "./search-result.constant";
import { fetchCountriesWithDistrictFx, fetchSchoolListFx, getSearchResultsFx } from "./search-result.fx";
import { CountryWithDistrictCount, SearchResultApi, SearchResultCollection, SearchType } from "./search-result.type";
import { makeSearchDataCollection, matchAndCollectItems } from './search-result.util';

const $query = sample({
  source: debounce<string>($searchInput, {
    timeout: 300
  })
})

export const $searchCountryList = createStore<CountryWithDistrictCount[] | []>([]);
$searchCountryList.on(fetchCountriesWithDistrictFx.doneData, (_, data) => {
  return Object.values(data ?? {});
});
export const $searchCountryAdminCollection = $searchCountryList.map(makeSearchDataCollection)
export const setSearchCountryExpand = createEvent<string>();
export const $currentExpandCountry = restore(setSearchCountryExpand, "");

export const setSearchExpandLevel1 = createEvent<string>();
export const $searchAdminLevel1 = restore(setSearchExpandLevel1, "");

export const setSearchExpandLevel2 = createEvent<string>();
export const $searchAdminLevel2 = restore(setSearchExpandLevel2, "");

export const resetSchoolSelection = createEvent();
export const setSchoolSelection = createEvent<[SearchResultApi, boolean]>();
export const $searchSchoolSelectedList = createStore<SearchResultApi[] | null>(null);
export const $searchSchoolIds = $searchSchoolSelectedList.map((items) => new Set(items?.map((item) => String(item.id))) || undefined)
export const $searchSchoolAdmin1 = $searchSchoolSelectedList.map((items) => new Set(items?.map((item) => item.admin1_name)) || undefined)
export const $searchSchoolAdmin2 = $searchSchoolSelectedList.map((items) => new Set(items?.map((item) => {
  const admin1 = item.admin1_name;
  const admin2 = item.admin2_name;;
  return `${admin1}-${admin2 ? admin2 : '_Blank'}`
})) || undefined)

$searchSchoolSelectedList.on(setSchoolSelection, (state, payload) => {
  const [school, isChecked] = payload;
  if (!state) {
    state = [];
  }
  if (isChecked) {
    state = state.filter(item => item.id !== school.id);
  } else {
    state.push(school)
  }
  const newState = [...state];
  return newState
})

export const triggerSearchApply = createEvent();
export const $searchSchoolList = createStore<APIListType<SearchResultApi> | null>(null);
export const onSchoolListCurrentPage = createEvent<number>();
export const $schoolListCurrentPage = restore<number>(onSchoolListCurrentPage, 0);
export const setSearchSchoolListValue = createEvent<string>();
export const $searchSchoolListValue = restore(setSearchSchoolListValue, '');
const $searchSchoolListMax = $searchSchoolListValue.map((value) => value.length > SCHOOL_LIST_SEARCH_LENGTH ? value : '')

// Track current search page
export const setSearchPage = createEvent<number>();
export const $searchPage = restore<number>(setSearchPage, 1);

// Track if there are more results to load
export const setHasMoreResults = createEvent<boolean>();
export const $hasMoreResults = restore(setHasMoreResults, true);

// Track if we've loaded all results for the current country
export const setHasLoadedAllForCurrentCountry = createEvent<boolean>();
export const $hasLoadedAllForCurrentCountry = restore<boolean>(setHasLoadedAllForCurrentCountry, false);

export const $searchResultResponse = createStore<SearchResultCollection[] | null>(null);
$searchResultResponse.on(getSearchResultsFx.doneData, (state, payload) => {
  // Convert the results to our format
  const results = payload.results as unknown as SearchResultApi[];
  const mappedResults = results.map(({ name, admin1_name: admin1Name, admin2_name: admin2Name, country_code: countryCode, country_id: countryId, country_name: countryName, id }) => ({
    admin1Name,
    admin2Name,
    countryCode,
    countryId,
    countryName,
    name,
    id
  })) as SearchResultCollection[];
  const count = payload.count;
  let list = mappedResults;
  const hasLoadedAllForCurrentCountry = $hasLoadedAllForCurrentCountry.getState();
  const countryId = $country.getState()?.id;
  const hasMoreData = (countryId && !hasLoadedAllForCurrentCountry) || list.length === 15;
  if (countryId && !hasLoadedAllForCurrentCountry && (list.length + (state?.length || 0)) >= count) {
    setHasLoadedAllForCurrentCountry(true);
  }
  console.log(countryId, hasLoadedAllForCurrentCountry, list.length, count, $searchPage.getState())
  if (countryId && !hasLoadedAllForCurrentCountry && list.length < 15 && $searchPage.getState() === 0) {
    loadMoreResults();
  }
  // If we have existing state and this isn't the first page, append the results
  if (state?.length) {
    list = [...state, ...mappedResults];
  }
  // Update hasMoreResults based on API response
  setHasMoreResults(hasMoreData);
  // Otherwise return just the new results
  return list;
});

export const $searchResultCollection = sample({
  source: combine({
    hasSearchInput: $hasSearchInput,
    query: $query,
    countryAdminCollection: $searchCountryAdminCollection,
    schoolCollection: $searchResultResponse
  }),
  fn: ({ hasSearchInput, query, countryAdminCollection, schoolCollection }) => {
    if (!hasSearchInput) return [];
    const { countries, admin1 } = countryAdminCollection;
    const matchCountries = matchAndCollectItems({ data: countries, type: SEARCH_DATA_TYPE.COUNTRY, query, maxCount: SEARCH_COUNTRY_SIZE })
    const matchAdmin1 = matchAndCollectItems({ data: admin1, type: SEARCH_DATA_TYPE.ADMIN1, query, maxCount: SEARCH_ADMIN_SIZE });
    const matchSchool = schoolCollection?.map((item) => ({
      ...item,
      adminName: item.admin1Name || item.admin2Name,
      schoolId: item.id,
      id: getId(),
      type: SEARCH_DATA_TYPE.SCHOOL
    })) || []
    return [
      ...matchCountries,
      ...matchAdmin1,
      ...matchSchool
    ] as unknown as SearchType;
  },
})

//temp country value;
const searchExpandCountry = sample({
  source: combine($countries, $currentExpandCountry),
  fn: ([countries, expandCountry]) => {
    return countries?.find(country => country?.id.toString() === expandCountry)?.code.toLocaleLowerCase() ?? null;
  }
})

// trigger search apply
const $applySearchSource = combine($searchSchoolIds, /*$currentExpandCountry*/searchExpandCountry, (schoolIds, countryCode) => ({
  schoolIds: Array.from(schoolIds),
  countryCode
}))
export const onSearchItemClick = createEvent<SearchType>();
export const removeSearchHistory = createEvent<number>();

export const $searchHistoryData = sample({
  clock: $showCountries,
  fn: () => {
    return getLocalStorage(STORE_SEARCH_HISTORY) as SearchType[]
  }
})

// sample
sample({
  clock: merge([onSchoolListCurrentPage, setSearchExpandLevel2, debounce($searchSchoolListMax, { timeout: 300 })]),
  source: combine({
    page: $schoolListCurrentPage,
    countryId: $currentExpandCountry,
    admin1: $searchAdminLevel1,
    admin2: $searchAdminLevel2,
    query: $searchSchoolListMax
  }, ({ admin1, admin2, ...rest }) => {
    return {
      admin1: !!admin1 ? admin1 : admin2,
      admin2: !admin1 ? '' : admin2,
      ...rest
    }
  }),
  target: fetchSchoolListFx
})

sample({
  clock: triggerSearchApply,
  source: $applySearchSource,
  target: applySearchFx
})

sample({
  clock: merge([onSearchItemClick, removeSearchHistory]),
  source: $searchHistoryData,
  fn: (searchHistoryData, updateHistoryData) => {
    let newData = searchHistoryData;
    if (!searchHistoryData || !Array.isArray(newData)) {
      newData = [];
    }
    if (typeof updateHistoryData === 'number') {
      // remove item
      newData = newData.filter((item) => item.id !== updateHistoryData)
    } else {
      newData = newData.filter(item => item.id !== updateHistoryData.id);
      if (newData.length >= MAX_SEARCH_HISTORY) {
        newData.pop();
      }
      newData.unshift(updateHistoryData);
    }
    setLocalStorage(STORE_SEARCH_HISTORY, newData);
    return newData;
  },
  target: $searchHistoryData
})

sample({
  clock: onSearchItemClick,
  fn: (item) => {
    if (item.type === SEARCH_DATA_TYPE.COUNTRY) {
      mapCountry.navigate({ code: item.countryCode.toLowerCase() });
    } else if (item.type === SEARCH_DATA_TYPE.SCHOOL) {
      void applySearchFx({ schoolIds: [item.schoolId ?? 0], countryCode: item.countryCode })
    } else {
      mapCountry.navigate({ code: item.countryCode.toLowerCase(), path: `/${item.adminCode}` });
      // district click
    }
    return '';
  },
  target: changeSearchText
})

// get country list if not loaded
sample({
  clock: merge([$searchInput, $isSearchFocused]),
  source: combine({ isLoading: fetchCountriesWithDistrictFx.pending, searchResult: $searchCountryList }),
  filter: ({ isLoading, searchResult }) => {
    return !isLoading && !searchResult.length
  },
  target: fetchCountriesWithDistrictFx
})

// Reset search page when query changes
$query.watch(() => {
  setSearchPage(1);
  setHasLoadedAllForCurrentCountry(false);
  setHasMoreResults(true);
});

$hasLoadedAllForCurrentCountry.watch((isLoaded) => {
  if (isLoaded) {
    setSearchPage(0);
  }
})

// Load more results function
export const loadMoreResults = createEvent();

// Sample for initial search
sample({
  clock: $query,
  source: combine($hasSearchInput, $query, $country, $mapRoutes, $selectedSearchEntityTags),
  filter: ([hasSearchInput]) => {
    return hasSearchInput
  },
  fn: ([_, query, country, mapRoutes, selectedSearchEntityTags]) => {
    debugger;
    let countryId = country?.id;
    if (mapRoutes.map) {
      countryId = undefined;
    }
    // Reset to page 0 for new queries
    return ({ query, countryId, page: 0, selectedSearchEntityTags })
  },
  target: getSearchResultsFx
});

$query.watch(() => {
  setSearchPage(0);
})
// Handle loading more results
loadMoreResults.watch(() => {
  debugger;
  const hasSearchInput = $hasSearchInput.getState();
  const hasMore = $hasMoreResults.getState();
  const query = $query.getState();
  const country = $country.getState();
  const mapRoutes = $mapRoutes.getState();
  const page = $searchPage.getState();
  const selectedSearchEntityTypes = $selectedSearchEntityTags.getState();
  const hasLoadedAllForCurrentCountry = $hasLoadedAllForCurrentCountry.getState();

  if (hasSearchInput && hasMore) {
    let countryId = country?.id;
    if (mapRoutes.map) {
      countryId = undefined;
    }

    // Increment page number
    setSearchPage(page + 1);

    // Fetch more results
    getSearchResultsFx({ query, countryId, excludeCountryId: hasLoadedAllForCurrentCountry, page, selectedSearchEntityTypes });
  }
});



// reset on below change
$currentExpandCountry.reset($showCountries);
$searchAdminLevel1.reset($showCountries, $currentExpandCountry);
$searchAdminLevel2.reset($showCountries, $currentExpandCountry, $searchAdminLevel1);

$searchSchoolSelectedList.reset([resetSchoolSelection, $currentExpandCountry]);

$searchResultResponse.reset($query, clearSearchText);
$hasMoreResults.reset($query, clearSearchText);
// search on get all country list

$searchSchoolList.on(fetchSchoolListFx.doneData, setPayload)
$searchSchoolListValue.reset([$searchAdminLevel2])
$schoolListCurrentPage.reset([$searchAdminLevel2])
$schoolListCurrentPage.reset(setSearchSchoolListValue)
$searchInput.reset([$countryCode]);
