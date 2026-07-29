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
