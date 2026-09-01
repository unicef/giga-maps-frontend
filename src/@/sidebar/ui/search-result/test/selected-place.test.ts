import { EntityType } from '~/@/entities/types/base-entity.type';
import { fetchCountriesFx } from '~/api/project-connect';
import { mapCountry, mapOverview, router } from '~/core/routes';

import {
  $isSearchTextDirty,
  $searchInput,
  changeSearchText,
  clearSearchText,
  searchInputBlurred,
  searchTextTyped,
} from '../../common-components/top-search-bar/top-search-bar.model';
import {
  $selectedPlace,
  $selectedPlaceKey,
} from '../container/search-result.model';

const countries = [
  { id: 1, name: 'Brazil', code: 'BR' },
  { id: 2, name: 'Kenya', code: 'KE' },
];

// synchronous fallback used before the country request lands
const loadCountries = () => {
  fetchMock.mockResponseOnce(JSON.stringify(countries));
  return fetchCountriesFx();
};

describe('selected place in the search bar', () => {
  beforeEach(async () => {
    clearSearchText();
    mapOverview.navigate();
    await loadCountries();
  });

  describe('$selectedPlaceKey', () => {
    test('is empty on the global view', () => {
      expect($selectedPlaceKey.getState()).toBe('');
      expect($selectedPlace.getState()).toBeNull();
    });

    test('identifies a country', () => {
      mapCountry.navigate({ code: 'br' });
      expect($selectedPlaceKey.getState()).toBe('country:br');
    });

    test('identifies a region', () => {
      mapCountry.navigate({ code: 'br', path: '/BRA016' });
      expect($selectedPlaceKey.getState()).toBe('region:br:BRA016');
    });

    test('is stable when the entity ids are reordered', () => {
      router.navigate('/map/entity/?country=br&school_ids=1,2');
      const ascending = $selectedPlaceKey.getState();
      router.navigate('/map/entity/?country=br&school_ids=2,1');

      expect($selectedPlaceKey.getState()).toBe(ascending);
    });
  });

  describe('$selectedPlace', () => {
    test('falls back to the country list while the country request is pending', () => {
      mapCountry.navigate({ code: 'br' });

      expect($selectedPlace.getState()).toEqual({
        kind: 'country',
        countryName: 'Brazil',
      });
    });

    test('reports how many entities are selected, and of which type', () => {
      router.navigate('/map/entity/?country=br&school_ids=1,2,3');

      expect($selectedPlace.getState()).toEqual({
        kind: 'entities',
        count: 3,
        countryName: 'Brazil',
        entityType: EntityType.SCHOOL,
      });
    });

    test('keeps the entity type of a health selection', () => {
      router.navigate('/map/entity/?country=br&health_ids=1,2');

      expect($selectedPlace.getState()).toEqual({
        kind: 'entities',
        count: 2,
        countryName: 'Brazil',
        entityType: EntityType.HEALTH,
      });
    });

    test('has no entity type for a generic entity_ids selection', () => {
      router.navigate('/map/entity/?country=br&entity_ids=1,2');

      expect($selectedPlace.getState()).toEqual({
        kind: 'entities',
        count: 2,
        countryName: 'Brazil',
        entityType: undefined,
      });
    });

    test('shows the country while a single entity name is not available yet', () => {
      router.navigate('/map/entity/?country=ke&school_ids=7');

      expect($selectedPlace.getState()).toEqual({
        kind: 'entity-pending',
        countryName: 'Kenya',
      });
    });
  });

  describe('typed text vs. selected place', () => {
    test('only typing marks the input as dirty', () => {
      searchTextTyped('abc');
      expect($searchInput.getState()).toBe('abc');
      expect($isSearchTextDirty.getState()).toBe(true);

      clearSearchText();
      changeSearchText('abc');
      expect($searchInput.getState()).toBe('abc');
      expect($isSearchTextDirty.getState()).toBe(false);
    });

    test('changing the selection clears the typed text', () => {
      mapCountry.navigate({ code: 'br' });
      searchTextTyped('abc');

      mapCountry.navigate({ code: 'ke' });

      expect($searchInput.getState()).toBe('');
      expect($isSearchTextDirty.getState()).toBe(false);
    });

    test('emptying the input and blurring brings the label back', () => {
      mapCountry.navigate({ code: 'br' });
      searchTextTyped('abc');
      searchTextTyped('');

      searchInputBlurred();

      expect($isSearchTextDirty.getState()).toBe(false);
    });

    test('blurring with text still typed keeps the typed text', () => {
      mapCountry.navigate({ code: 'br' });
      searchTextTyped('abc');

      searchInputBlurred();

      expect($isSearchTextDirty.getState()).toBe(true);
    });
  });
});
