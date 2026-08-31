import { combine, createEvent, createStore, restore } from "effector";

import { EntityType } from "~/@/entities/types/base-entity.type";
import { router } from "~/core/routes";
import { setPayload } from "~/lib/effector-kit";


const maxTextCount = 2;
export const onShowCountriesAdminList = createEvent<boolean>();
export const $showCountries = restore(onShowCountriesAdminList, false);
export const changeIsSearchFocused = createEvent<boolean>();
export const $isSearchFocused = restore(changeIsSearchFocused, false);

export const changeSearchText = createEvent<string>();
export const clearSearchText = createEvent();

export const searchTextTyped = createEvent<string>();
export const searchInputBlurred = createEvent();
export const resetSearchTextDirty = createEvent();

export const $searchInput = createStore<string>('')
  .on([changeSearchText, searchTextTyped], setPayload)
  .reset(clearSearchText);

// true -> the input shows the typed text; false -> it shows the selected place label.
export const $isSearchTextDirty = createStore(false)
  .on(searchTextTyped, () => true)
  .reset(clearSearchText, resetSearchTextDirty);

export const $hasSearchInput = $searchInput.map(text => text?.length >= maxTextCount);

export const $isActiveSearchBar = combine([$hasSearchInput, $isSearchFocused], (allInput) => allInput.some((input) => Boolean(input)))


export const setSearchInMobile = createEvent<boolean>();
export const $searchInMobile = createStore<boolean>(false);
$searchInMobile.on(setSearchInMobile, setPayload);

$showCountries.reset(router.historyUpdated, changeSearchText);

// Selected entity tags for search filtering
export const toggleSearchEntityTag = createEvent<EntityType>();

export const $selectedSearchEntityTags = createStore<EntityType[]>([]);

// Single-select for now; change handler to [...current, tag] for multi-select
$selectedSearchEntityTags.on(toggleSearchEntityTag, (current, tag) =>
  //future need
  //current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag],
  current.includes(tag) ? [] : [tag],
);

$selectedSearchEntityTags.reset(clearSearchText, router.historyUpdated);
