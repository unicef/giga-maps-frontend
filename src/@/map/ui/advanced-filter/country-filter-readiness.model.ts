import { combine, createStore } from 'effector';

import {
  $advancedFiltersByEntity,
  $country,
  $countryActiveFiltersList,
  $countryCode,
  $schoolFocusLatLng,
} from '~/@/country/country.model';
import { $activeEntityTypes } from '~/@/entities/models/entity.model';
import { fetchAdvanceFilterFx } from '~/api/project-connect';
import { mapCountry } from '~/core/routes';

import { $advanceFilterList } from '../../map.model';
import {
  $defaultAdvancedFilterSuppressedEntityTypes,
  getEntityTypesNeedingCountryDefaultFilters,
} from './advanced-filter.model';

export const $advancedFilterCountryId = createStore<number | null>(null)
  .on(fetchAdvanceFilterFx.done, (_, { params }) => params)
  .reset($countryCode);

const $failedAdvancedFilterCountryId = createStore<number | null>(null)
  .on(fetchAdvanceFilterFx.fail, (_, { params }) => params)
  .on(fetchAdvanceFilterFx.done, (failedCountryId, { params }) =>
    failedCountryId === params ? null : failedCountryId,
  )
  .reset($countryCode);

export const $countryAdvancedFiltersReady = combine(
  {
    activeEntityTypes: $activeEntityTypes,
    advancedFilterCountryId: $advancedFilterCountryId,
    advancedFiltersByEntity: $advancedFiltersByEntity,
    country: $country,
    countryActiveFiltersList: $countryActiveFiltersList,
    countryCode: $countryCode,
    defaultFilterSuppressedEntityTypes:
      $defaultAdvancedFilterSuppressedEntityTypes,
    failedAdvancedFilterCountryId: $failedAdvancedFilterCountryId,
    filters: $advanceFilterList,
    isCountryView: mapCountry.visible,
    schoolFocusLatLng: $schoolFocusLatLng,
  },
  ({
    activeEntityTypes,
    advancedFilterCountryId,
    advancedFiltersByEntity,
    country,
    countryActiveFiltersList,
    countryCode,
    defaultFilterSuppressedEntityTypes,
    failedAdvancedFilterCountryId,
    filters,
    isCountryView,
    schoolFocusLatLng,
  }) => {
    if (!isCountryView) return true;
    if (
      !country?.id ||
      country.code.toLowerCase() !== countryCode.toLowerCase()
    ) {
      return false;
    }
    // If filter metadata fails to load, keep the country usable without
    // defaults instead of leaving every country-scoped request blocked.
    if (failedAdvancedFilterCountryId === country.id) return true;
    if (advancedFilterCountryId !== country.id) return false;
    if (schoolFocusLatLng !== null) return true;

    return (
      getEntityTypesNeedingCountryDefaultFilters(
        countryActiveFiltersList ?? [],
        filters,
        advancedFiltersByEntity,
        activeEntityTypes,
        defaultFilterSuppressedEntityTypes,
      ).length === 0
    );
  },
);

/** Active entity types that have published filters, in popup display order. */
export const $entitiesWithFilters = combine(
  { activeEntityTypes: $activeEntityTypes, filters: $advanceFilterList },
  ({ activeEntityTypes, filters }) =>
    activeEntityTypes
      .filter((entityType) =>
        filters.some((item) => item.entity_type === entityType),
      )
      .sort((a, b) => (a < b ? 1 : -1)),
);

// $advanceFilterList keeps the previous country's rows until the new fetch
// lands, so availability stays unknown — not "none" — while it is in flight.
const $advancedFilterListSettled = combine(
  {
    countryId: $country.map((country) => country?.id ?? null),
    loadedCountryId: $advancedFilterCountryId,
    isPending: fetchAdvanceFilterFx.pending,
  },
  ({ countryId, loadedCountryId, isPending }) =>
    !isPending && countryId !== null && loadedCountryId === countryId,
);

export const $isAdvancedFilterUnavailable = combine(
  $advancedFilterListSettled,
  $entitiesWithFilters,
  (isSettled, entitiesWithFilters) =>
    isSettled && entitiesWithFilters.length === 0,
);
