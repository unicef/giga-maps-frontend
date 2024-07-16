import { combine, createEvent, createStore, restore } from "effector";
import { router } from "~/core/routes";

import { setPayload } from "~/lib/effector-kit";


const maxTextCount = 2;
export const onShowCountriesAdminList = createEvent<boolean>();
export const $showCountries = restore(onShowCountriesAdminList, false);
export const changeIsSearchFocused = createEvent<boolean>();
export const $isSearchFocused = restore(changeIsSearchFocused, false);

export const changeSearchText = createEvent<string>();
export const clearSearchText = createEvent();
export const $searchInput = restore(changeSearchText, '');
export const $hasSearchInput = $searchInput.map(text => text?.length >= maxTextCount);

export const $isActiveSearchBar = combine([$hasSearchInput, $isSearchFocused], (allInput) => allInput.some((input) => Boolean(input)))


export const setSearchInMobile = createEvent<boolean>();
export const $searchInMobile = createStore<boolean>(false);
$searchInMobile.on(setSearchInMobile, setPayload);

$showCountries.reset(router.historyUpdated, changeSearchText);

