import { combine, createEffect, guard, merge, sample } from 'effector';
import type { Map as MapboxMap } from 'mapbox-gl';

import {
  $admin1Data,
  $admin1Id,
  $country,
  $countryActiveFiltersList,
  $countryId,
  $countryMapping,
  $countrySearchString,
  $schoolFocusLatLng,
  countryReceived,
  setSchoolFocusLatLng,
} from '~/@/country/country.model';
import { EntityType, getEntityMapValue } from '~/@/entities';
import {
  $activeEntityTypes,
  $entityRegistry,
  $entityTypesFiltered,
  $selectedEntityType,
} from '~/@/entities/models/entity.model';
import {
  ENTITY_TYPE_CODE_PARAM,
  getEntityTypeCodeParam,
} from '~/@/entities/utils/entity-query-params';
import {
  $connectivityBenchMark,
  $connectivityBenchMarkByEntity,
  $connectivitySpeedFilterByEntity,
  $isLoadedTimePlayer,
  $isLoadingTimeplayer,
  $isPauseTimeplayer,
  $isTimeplayer,
  $layerUtils,
  $schoolAdminId,
  $schoolStatsMap,
  $schoolStatusSelectedLayer,
  $selectedLayerIdByEntity,
  $selectedSchoolIds,
  $staticLegendsSelected,
  $staticLegendsSelectedByEntity,
  $statusLayerIdByEntity,
  $timePlayerInfo,
  onLoadTimePlayerData,
  onTimeoutTimePlayer,
  schoolStatsMap,
} from '~/@/sidebar/sidebar.model';
import {
  fetchAdvanceFilterFx,
  fetchCountriesFx,
  fetchCountryFx,
  fetchEntityGlobalStatsFx,
  fetchLayerListFx,
  fetchSchoolPopupDataFx,
  getBaseUrl,
} from '~/api/project-connect';
import { languageStore } from '~/core/i18n/store';
import {
  $mapRoutes,
  map,
  mapCountry,
  mapOverview,
  router,
} from '~/core/routes';
import { $theme } from '~/core/theme.model';

import {
  changeLayersFx,
  changeStyleFx,
  updateCoverageFilter,
} from '@/map/effects';
import {
  $connectivityFilter,
  $connectivitySpeedFilter,
  $coverageFilter,
  $coverageFilterByEntity,
  $selectedLayers,
} from '@/sidebar/init';

import { $isMobile } from '../admin/models/media-query';
import { mapLabelLayerList } from '../country/country.constant';
import {
  countryTranslationFx,
  filterTranslationFx,
} from '../sidebar/effects/all-translation-fx';
import {
  $historyInterval,
  $historyIntervalByEntity,
  $historyIntervalUnit,
  $historyIntervalUnitByEntity,
  $isCheckedLastDate,
  $lastAvailableDates,
} from '../sidebar/history-graph.model';
import {
  changeStaticLayerFx,
  updateConnectivityFilter,
  updateConnectivityStatus,
} from './effects/add-layers-fx';
import { addSchoolMarkers } from './effects/add-marker-fx';
import {
  clearTimeplayer,
  nextTimePlayerIteration,
  onLoadStartTimePlayer,
  onPausePlayTimeplayerFx,
  timePlayerFx,
  timePlayerSourceFx,
} from './effects/time-player.fx';
import { stylePaintData } from './map.constant';
import {
  $activeSchoolPopup,
  $advanceFilterList,
  $dublicateSchoolClickData,
  $filterListMapping,
  $map,
  $multipleSchoolPopup,
  $popup,
  $reloadStyle,
  $schoolClickData,
  $schoolClickedId,
  $schoolMarkers,
  $selectedGigaLayers,
  $stylePaintData,
  $zoomState,
  changeStyle,
  onCreateSchoolPopup,
  onLoadPage,
  onReloadedMap,
  onStyleLoaded,
  onZoomStateChange,
  setCenter,
  setSchoolCLickupPopupDiv,
  zoomIn,
  zoomOut,
} from './map.model';
import {
  createLoadingPopupFx,
  navigateToSchool,
} from './popup/effects/create-school-popup-fx';
import { updateSchoolPopupFx } from './popup/effects/update-school-popup.fx';
import { buildFilterQueryFromSelections } from './ui/advanced-filter/buildFilterQueryFromSelections';

sample({
  source: $theme,
  fn: (style) => stylePaintData[style],
  target: $stylePaintData,
});

// on page load
sample({
  clock: merge([onLoadPage, map.visible]),
  source: $mapRoutes,
  target: createEffect((routes: ReturnType<typeof $mapRoutes.getState>) => {
    if (routes.map || routes.country || routes.schools) {
      void fetchLayerListFx();
      void fetchCountriesFx();
    }
  }),
});

// load global stats
sample({
  clock: merge([
    onLoadPage,
    mapOverview.visible,
    mapCountry.visible,
    fetchCountryFx.doneData,
    $admin1Id,
    $countrySearchString,
    $activeEntityTypes,
    $entityTypesFiltered,
  ]),
  source: combine({
    routes: $mapRoutes,
    country: $country,
    admin1Id: $admin1Id,
    countrySearchString: $countrySearchString,
    activeEntityTypes: $activeEntityTypes,
    entityTypesFiltered: $entityTypesFiltered,
  }),
  fn: ({
    routes,
    country,
    admin1Id,
    countrySearchString,
    activeEntityTypes,
    entityTypesFiltered,
  }) => {
    const queryParts = [
      `${ENTITY_TYPE_CODE_PARAM}=${getEntityTypeCodeParam(
        activeEntityTypes,
        entityTypesFiltered,
      )}`,
    ];

    if (routes.country) {
      queryParts.unshift(`country_id=${country?.id}`);
      if (admin1Id) {
        queryParts.push(`admin1_id=${admin1Id}`);
      }
      if (countrySearchString) {
        queryParts.push(countrySearchString);
      }
    }

    return { query: `?${queryParts.join('&')}` };
  },
  filter: ({ routes, country }) => {
    return routes.map || (routes.country && !!country?.id);
  },
  target: fetchEntityGlobalStatsFx,
});

sample({
  source: guard($map, { filter: Boolean }),
  clock: changeStyle,
  fn: (map, style) => ({
    map,
    style,
  }),
  target: changeStyleFx,
});

// set reload style true;
sample({
  clock: changeStyle,
  fn: () => true,
  target: $reloadStyle,
});

// set reload style true;
sample({
  clock: onStyleLoaded,
  source: $reloadStyle,
  filter: (reload: boolean) => reload,
  target: onReloadedMap,
});

sample({
  clock: onStyleLoaded,
  fn: () => false,
  target: $reloadStyle,
});

const hasFilterParams = () => {
  const params = new URLSearchParams(window.location.search);
  return Array.from(params.keys()).some((key) => key.startsWith('filter__'));
};

const $derivedCountryActiveFilterList = combine({
  countryActiveFiltersList: $countryActiveFiltersList,
  activeFiltersList: $advanceFilterList,
  schoolFocusLatLng: $schoolFocusLatLng,
});

// guard: apply default country filters only when:
// - filter data is loaded
// - no school is focused
// - URL has no existing filter params (to avoid overriding shared URLs)
const activeFiltersListClock = guard({
  source: $derivedCountryActiveFilterList,
  clock: merge([fetchCountryFx.doneData, fetchAdvanceFilterFx.doneData]),
  filter: ({
    countryActiveFiltersList,
    activeFiltersList,
    schoolFocusLatLng,
  }) => {
    if (hasFilterParams()) return false; // 🚨 IMPORTANT FIX

    return (
      countryActiveFiltersList != null &&
      activeFiltersList != null &&
      schoolFocusLatLng === null
    );
  },
});

sample({
  source: $derivedCountryActiveFilterList,
  clock: activeFiltersListClock,
  fn: ({ countryActiveFiltersList, activeFiltersList }) =>
    buildFilterQueryFromSelections(
      countryActiveFiltersList!,
      activeFiltersList,
    ),
  target: router.navigate,
});

$map.watch(zoomIn, (map: MapboxMap | null) => {
  map?.zoomIn({ duration: 500 });
});

$map.watch(zoomOut, (map: MapboxMap | null) => {
  map?.zoomOut({ duration: 500 });
});

$map.watch(setCenter, (map: MapboxMap | null, center) => {
  map?.setCenter(center);
});

export const gigaLayerSource = combine({
  selectedLayerIds: $selectedLayers,
  map: $map,
  isCheckedLastDate: $isCheckedLastDate,
  connectivityFilter: $connectivityFilter,
  interval: $historyInterval,
  intervalByEntity: $historyIntervalByEntity,
  intervalUnit: $historyIntervalUnit,
  intervalUnitByEntity: $historyIntervalUnitByEntity,
  connectivityBenchMark: $connectivityBenchMark,
  connectivityBenchMarkByEntity: $connectivityBenchMarkByEntity,
  lastAvailableDates: $lastAvailableDates,
  schoolLegends: $staticLegendsSelected,
  schoolLegendsByEntity: $staticLegendsSelectedByEntity,
  coverageFilter: $coverageFilter,
  coverageFilterByEntity: $coverageFilterByEntity,
  layerUtils: $layerUtils,
  connectivitySpeedFilter: $connectivitySpeedFilter,
  connectivitySpeedFilterByEntity: $connectivitySpeedFilterByEntity,
  lastSelectedLayer: $selectedGigaLayers,
  paintData: $stylePaintData,
  mapRoute: $mapRoutes,
  country: $country,
  admin1Data: $admin1Data,
  schoolStats: $schoolStatsMap,
  isMobile: $isMobile,
  schoolAdminId: $schoolAdminId,
  countrySearch: $countrySearchString,
  zoomState: $zoomState,
  schoolPageIds: $selectedSchoolIds,
  activeEntityTypes: $activeEntityTypes,
  entityRegistry: $entityRegistry,
});

const combineGigaFn =
  (data: { refresh?: boolean; timeout?: number }) =>
  (source: ReturnType<typeof gigaLayerSource.getState>) => ({
    ...source,
    ...data,
  });

const mapLayerFilter = ({
  isCheckedLastDate,
  mapRoute,
}: ReturnType<typeof gigaLayerSource.getState>) => {
  return true; //isCheckedLastDate || mapRoute.map;
};

const timePlayerActive = sample({
  clock: $isTimeplayer,
  filter: (isActive) => !isActive,
});

const $mapRouteVisible = guard(mapOverview.visible, { filter: Boolean });
// change giga layer on selection of layers

sample({
  clock: merge([
    $zoomState,
    $mapRouteVisible,
    $countrySearchString,
    onReloadedMap,
    $map,
    countryReceived,
    $admin1Id,
    $schoolAdminId,
    $schoolStatusSelectedLayer,
    $statusLayerIdByEntity,
    $schoolStatsMap,
    timePlayerActive,
    $activeEntityTypes,
  ]),
  source: gigaLayerSource,
  fn: combineGigaFn({}),
  filter: ({ map }) => {
    return !!map;
  },
  target: changeStaticLayerFx,
});

sample({
  clock: merge([$selectedLayerIdByEntity]),
  source: gigaLayerSource,
  fn: combineGigaFn({}),
  filter: mapLayerFilter,
  target: changeLayersFx,
});
// change giga layer update on connectivity filter
sample({
  clock: merge([
    onReloadedMap,
    $map,
    $mapRouteVisible,
    countryReceived,
    $admin1Data,
    $schoolAdminId,
    $schoolStatsMap,
    $countrySearchString,
    $connectivityBenchMarkByEntity,
    timePlayerActive,
    $zoomState,
    $activeEntityTypes,
  ]),
  source: gigaLayerSource,
  filter: mapLayerFilter,
  fn: combineGigaFn({ refresh: true }),
  target: changeLayersFx,
});

// reset zoom state when map is loaded and map page is visible
sample({
  clock: $map,
  source: mapOverview.visible,
  fn: () => 'end',
  target: onZoomStateChange,
});

sample({
  clock: $connectivityFilter,
  source: gigaLayerSource,
  fn: combineGigaFn({ refresh: true, timeout: 1000 }),
  filter: mapLayerFilter,
  target: changeLayersFx,
});

// update dots, change on coverage filter
sample({
  clock: $coverageFilterByEntity,
  source: gigaLayerSource,
  fn: combineGigaFn({}),
  target: updateCoverageFilter,
});

// update connectivity filter;
sample({
  clock: $connectivitySpeedFilterByEntity,
  source: gigaLayerSource,
  fn: combineGigaFn({}),
  target: updateConnectivityFilter,
});

sample({
  clock: $staticLegendsSelectedByEntity,
  source: combine({
    map: $map,
    lastSelectedLayer: $selectedGigaLayers,
    activeEntityTypes: $activeEntityTypes,
    schoolLegendsByEntity: $staticLegendsSelectedByEntity,
  }),
  fn: (source, legendsSelectedByEntity) => ({
    legendsSelectedByEntity,
    ...source,
  }),
  target: updateConnectivityStatus,
});

export const mapMarkerSource = combine({
  map: $map,
  schoolStats: $schoolStatsMap,
  schoolMarkers: $schoolMarkers,
  multipleSchoolPopup: $multipleSchoolPopup,
  stylePaintData: $stylePaintData,
  layerUtils: $layerUtils,
});

sample({
  clock: merge([$schoolStatsMap]),
  source: mapMarkerSource,
  target: addSchoolMarkers,
});

sample({
  clock: $schoolClickedId,
  source: combine({
    map: $map,
    schoolPopupInfo: $activeSchoolPopup,
    isMobile: $isMobile,
  }),
  filter: ({ isMobile }) => !isMobile,
  target: createLoadingPopupFx,
});

sample({
  clock: $schoolClickedId,
  source: combine({
    isMobile: $isMobile,
  }),
  filter: ({ isMobile }, schoolId) => isMobile && schoolId?.id,
  fn: (_, schoolId) => schoolId?.id,
  target: navigateToSchool,
});

export const $schoolPopupConnectivityMap = $schoolClickData.map((data) =>
  data?.length ? schoolStatsMap(data[0]) : null,
);
export const $schoolPopupData = combine({
  feature: $schoolPopupConnectivityMap,
  stylePaintData: $stylePaintData,
  layerUtils: $layerUtils,
});

export const $dublicateSchoolPopupConnectivityMap =
  $dublicateSchoolClickData.map((data) =>
    data?.length ? data.map((item) => schoolStatsMap(item)) : null,
  );
export const $dublicateSchoolPopupData = combine({
  feature: $dublicateSchoolPopupConnectivityMap,
  stylePaintData: $stylePaintData,
  layerUtils: $layerUtils,
});

sample({
  clock: merge([fetchSchoolPopupDataFx.doneData]),
  source: combine({
    popup: $popup,
    schoolPopupData: $schoolPopupData,
    country: $country,
  }),
  target: updateSchoolPopupFx,
});

sample({
  clock: merge([router.historyUpdated, $isTimeplayer]),
  source: $popup,
  filter: (popup) => !!popup,
  fn: (popup) => {
    if (popup) {
      popup.remove();
      onCreateSchoolPopup(null);
      setSchoolCLickupPopupDiv(null);
    }
  },
});

sample({
  source: $schoolStatsMap,
  target: createEffect(
    (schoolConnenctivity: ReturnType<typeof $schoolStatsMap.getState>) => {
      if (schoolConnenctivity?.length === 1) {
        setSchoolFocusLatLng(schoolConnenctivity[0].geopoint.coordinates);
      }
    },
  ),
});

sample({
  clock: sample({
    clock: $isTimeplayer,
    filter: Boolean,
  }),
  source: combine({
    country: $country,
    selectedEntityType: $selectedEntityType,
    selectedLayerIdByEntity: $selectedLayerIdByEntity,
    map: $map,
  }),
  fn: ({ map, country, selectedEntityType, selectedLayerIdByEntity }) => {
    const selectedLayerId = getEntityMapValue(
      selectedLayerIdByEntity,
      selectedEntityType,
      selectedLayerIdByEntity[EntityType.SCHOOL] ?? null,
    );
    const params = `country_id=${country?.id}&layer_id=${selectedLayerId}&start_year=2020`;
    const url = getBaseUrl(
      `api/accounts/time-players/v2/?${params}&z={z}&x={x}&y={y}.mvt`,
    );
    return { url, map };
  },
  target: timePlayerSourceFx,
});

export const timePlayerData = combine({
  map: $map,
  paintData: $stylePaintData,
  timeplayerInfo: $timePlayerInfo,
});
sample({
  clock: timePlayerSourceFx.doneData,
  source: timePlayerData,
  target: timePlayerFx,
});

sample({
  clock: sample({
    clock: $isTimeplayer,
    filter: (isTimeplayer) => !isTimeplayer,
  }),
  source: timePlayerData,
  target: clearTimeplayer,
});

sample({
  clock: onLoadTimePlayerData,
  source: timePlayerData,
  target: onLoadStartTimePlayer,
});

sample({
  clock: onLoadTimePlayerData,
  target: $isLoadedTimePlayer,
});

sample({
  clock: onLoadTimePlayerData,
  fn: () => false,
  target: $isLoadingTimeplayer,
});

sample({
  clock: onTimeoutTimePlayer,
  source: timePlayerData,
  target: nextTimePlayerIteration,
});

sample({
  clock: $isPauseTimeplayer,
  target: onPausePlayTimeplayerFx,
});

// call filter api on country change
sample({
  clock: $countryId,
  filter: (countryId) => !!countryId,
  fn: (countryId) => countryId ?? 0,
  target: fetchAdvanceFilterFx,
});

sample({
  clock: merge([languageStore.$language, $map]),
  source: combine({ map: $map, lng: languageStore.$language }),
  target: createEffect(({ map, lng }: { map: MapboxMap; lng: string }) => {
    if (!map || !lng) return;
    for (const key in mapLabelLayerList) {
      map.setLayoutProperty(mapLabelLayerList[key], 'text-field', [
        'get',
        `name_${lng}`,
      ]);
    }
  }),
});

sample({
  clock: merge([$filterListMapping, languageStore.$language]),
  source: { mapping: $filterListMapping, lng: languageStore.$language },
  filter: ({ mapping, lng }) => {
    return !!mapping?.length && !!lng;
  },
  target: filterTranslationFx,
});

sample({
  clock: merge([$countryMapping, languageStore.$language]),
  source: { mapping: $countryMapping, lng: languageStore.$language },
  filter: ({ mapping, lng }) => {
    return !!mapping?.length && !!lng;
  },
  target: countryTranslationFx,
});

onLoadPage();
