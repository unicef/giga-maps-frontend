import {
  combine,
  createEffect,
  createStore,
  guard,
  merge,
  sample,
} from 'effector';
import type { Map as MapboxMap } from 'mapbox-gl';

import {
  $admin1Data,
  $admin1Id,
  $advancedFiltersByEntity,
  $country,
  $countryActiveFiltersList,
  $countryCode,
  $countryId,
  $countryMapping,
  $countrySearchString,
  $schoolFocusLatLng,
  countryReceived,
  setSchoolFocusLatLng,
} from '~/@/country/country.model';
import { EntityType } from '~/@/entities';
import {
  $activeEntityTypes,
  $entityRegistry,
  $entityTypesFiltered,
  $isGlobalMode,
} from '~/@/entities/models/entity.model';
import { navigateToEntity } from '~/@/entities/utils/entity-navigation';
import {
  ENTITY_TYPE_CODE_PARAM,
  getEntityTypeCodeParam,
} from '~/@/entities/utils/entity-query-params';
import {
  $connectivityBenchMarkByEntity,
  $connectivitySpeedFilterByEntity,
  $getSchoolParams,
  $isLoadedTimePlayer,
  $isLoadingTimeplayer,
  $isPauseTimeplayer,
  $isTimeplayer,
  $layerUtils,
  $schoolAdminId,
  $schoolStatsMap,
  $selectedLayerIdByEntity,
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
  $urlParamsConsumed,
  $isAppSettled,
} from '~/@/sidebar/url-params.model';

import {
  changeLayersFx,
  changeStyleFx,
  updateCoverageFilter,
} from '@/map/effects';
import { $coverageFilterByEntity, $selectedLayers } from '@/sidebar/init';

import { $isMobile } from '../admin/models/media-query';
import { mapLabelLayerList } from '../country/country.constant';
import {
  countryTranslationFx,
  filterTranslationFx,
} from '../sidebar/effects/all-translation-fx';
import {
  $historyIntervalByEntity,
  $historyIntervalUnitByEntity,
  $isCheckedLastDate,
  $lastAvailableDatesByEntity,
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
  $schoolClickedEntityType,
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
import { createLoadingPopupFx } from './popup/effects/create-school-popup-fx';
import { updateSchoolPopupFx } from './popup/effects/update-school-popup.fx';
import {
  $defaultAdvancedFilterSuppressedEntityTypes,
  clearDefaultAdvancedFilterSuppression,
  deleteAllAdvancedFilters,
  getEntityTypesNeedingCountryDefaultFilters,
} from './ui/advanced-filter/advanced-filter.model';
import {
  buildActiveEntityFilterUrl,
  buildFilterQueryFromSelections,
} from './ui/advanced-filter/buildFilterQueryFromSelections';
import {
  $advancedFilterCountryId,
  $countryAdvancedFiltersReady,
} from './ui/advanced-filter/country-filter-readiness.model';

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
    if (routes.map || routes.country || routes.schools || routes.entity) {
      void fetchLayerListFx();
      void fetchCountriesFx();
    }
  }),
});

// Build one stable request key. Country requests remain disabled until the
// current country's filter definitions and default URL values are settled.
const $entityGlobalStatsQuery = combine(
  {
    routes: $mapRoutes,
    country: $country,
    admin1Id: $admin1Id,
    countrySearchString: $countrySearchString,
    countryAdvancedFiltersReady: $countryAdvancedFiltersReady,
    activeEntityTypes: $activeEntityTypes,
    entityTypesFiltered: $entityTypesFiltered,
  },
  ({
    routes,
    country,
    admin1Id,
    countrySearchString,
    countryAdvancedFiltersReady,
    activeEntityTypes,
    entityTypesFiltered,
  }) => {
    if (!routes.map && !routes.country) return null;
    if (routes.country && (!country?.id || !countryAdvancedFiltersReady)) {
      return null;
    }

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

    return `?${queryParts.join('&')}`;
  },
);

// load global stats
sample({
  clock: merge([onLoadPage, $entityGlobalStatsQuery]),
  source: $entityGlobalStatsQuery,
  filter: (query) => query !== null,
  fn: (query) => ({ query: query! }),
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

sample({
  clock: $countryCode,
  fn: () => undefined,
  target: clearDefaultAdvancedFilterSuppression,
});

const initialAdvancedFilterCountryCode = $countryCode.getState() || null;
const $advancedFilterCountryScope = createStore({
  countryCode: initialAdvancedFilterCountryCode,
  didCountryChange: false,
}).on($countryCode, ({ countryCode }, nextCountryCode) => ({
  countryCode: nextCountryCode || null,
  didCountryChange: Boolean(
    countryCode &&
    nextCountryCode &&
    countryCode.toLowerCase() !== nextCountryCode.toLowerCase(),
  ),
}));

sample({
  clock: $advancedFilterCountryScope.updates,
  filter: ({ didCountryChange }) => didCountryChange,
  fn: () => {
    const params = new URLSearchParams(window.location.search);
    deleteAllAdvancedFilters(params);
    const search = params.toString();

    return search
      ? `${window.location.pathname}?${search}`
      : window.location.pathname;
  },
  target: router.navigate,
});

const $derivedCountryActiveFilterList = combine({
  advancedFilterCountryId: $advancedFilterCountryId,
  countryActiveFiltersList: $countryActiveFiltersList,
  countryId: $countryId,
  activeFiltersList: $advanceFilterList,
  advancedFiltersByEntity: $advancedFiltersByEntity,
  defaultFilterSuppressedEntityTypes:
    $defaultAdvancedFilterSuppressedEntityTypes,
  schoolFocusLatLng: $schoolFocusLatLng,
  activeEntityTypes: $activeEntityTypes,
  isAllEntitiesMode: $isGlobalMode,
  isCountryView: mapCountry.visible,
});

// Keep the entity selection in the URL while retaining every entity's cached
// filter params. UI and API consumers derive only the active entity slice.
sample({
  clock: merge([$activeEntityTypes, $isGlobalMode]),
  source: combine({
    activeEntityTypes: $activeEntityTypes,
    advancedFiltersByEntity: $advancedFiltersByEntity,
    isAllEntitiesMode: $isGlobalMode,
    isCountryView: mapCountry.visible,
  }),
  filter: ({ advancedFiltersByEntity, isCountryView }) =>
    isCountryView && Object.keys(advancedFiltersByEntity).length > 0,
  fn: ({ activeEntityTypes, isAllEntitiesMode }) =>
    buildActiveEntityFilterUrl(activeEntityTypes, isAllEntitiesMode),
  target: router.navigate,
});

// Apply country defaults to active entities that do not have saved filters.
// Explicitly reset entity slices stay empty until the country changes.
const activeFiltersListClock = guard({
  source: $derivedCountryActiveFilterList,
  clock: merge([fetchAdvanceFilterFx.done, $activeEntityTypes, $isGlobalMode]),
  filter: ({
    advancedFilterCountryId,
    countryActiveFiltersList,
    countryId,
    activeFiltersList,
    advancedFiltersByEntity,
    defaultFilterSuppressedEntityTypes,
    schoolFocusLatLng,
    activeEntityTypes,
    isCountryView,
  }) => {
    if (!isCountryView) return false;

    return (
      countryActiveFiltersList != null &&
      activeFiltersList != null &&
      advancedFilterCountryId === countryId &&
      schoolFocusLatLng === null &&
      getEntityTypesNeedingCountryDefaultFilters(
        countryActiveFiltersList,
        activeFiltersList,
        advancedFiltersByEntity,
        activeEntityTypes,
        defaultFilterSuppressedEntityTypes,
      ).length > 0
    );
  },
});

sample({
  source: $derivedCountryActiveFilterList,
  clock: activeFiltersListClock,
  fn: ({
    countryActiveFiltersList,
    activeFiltersList,
    advancedFiltersByEntity,
    defaultFilterSuppressedEntityTypes,
    activeEntityTypes,
    isAllEntitiesMode,
  }) => {
    const entityTypesNeedingDefaults =
      getEntityTypesNeedingCountryDefaultFilters(
        countryActiveFiltersList!,
        activeFiltersList,
        advancedFiltersByEntity,
        activeEntityTypes,
        defaultFilterSuppressedEntityTypes,
      );

    return buildFilterQueryFromSelections(
      countryActiveFiltersList!,
      activeFiltersList,
      entityTypesNeedingDefaults,
      isAllEntitiesMode,
      activeEntityTypes,
    );
  },
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

const $entityPageSelection = $getSchoolParams.map(
  ({ entityType, schoolIds }) => ({
    entityType,
    ids: schoolIds ?? [],
  }),
);

export const gigaLayerSource = combine({
  selectedLayerIds: $selectedLayers,
  map: $map,
  isCheckedLastDate: $isCheckedLastDate,
  intervalByEntity: $historyIntervalByEntity,
  intervalUnitByEntity: $historyIntervalUnitByEntity,
  connectivityBenchMarkByEntity: $connectivityBenchMarkByEntity,
  lastAvailableDatesByEntity: $lastAvailableDatesByEntity,
  schoolLegendsByEntity: $staticLegendsSelectedByEntity,
  coverageFilterByEntity: $coverageFilterByEntity,
  layerUtils: $layerUtils,
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
  countryAdvancedFiltersReady: $countryAdvancedFiltersReady,
  zoomState: $zoomState,
  entityPageSelection: $entityPageSelection,
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
  country,
  countryAdvancedFiltersReady,
  map: currentMap,
  mapRoute,
}: ReturnType<typeof gigaLayerSource.getState>) =>
  !!currentMap &&
  (!mapRoute.country || (!!country?.id && countryAdvancedFiltersReady));

const timePlayerActive = sample({
  clock: $isTimeplayer,
  filter: (isActive) => !isActive,
});

const $mapRouteVisible = guard(mapOverview.visible, { filter: Boolean });
// change giga layer on selection of layers

sample({
  clock: merge([
    $mapRouteVisible,
    $countrySearchString,
    $countryAdvancedFiltersReady,
    onReloadedMap,
    $map,
    countryReceived,
    $admin1Id,
    $schoolAdminId,
    $activeEntityTypes,
  ]),
  source: gigaLayerSource,
  fn: combineGigaFn({ refresh: true }),
  filter: mapLayerFilter,
  target: changeStaticLayerFx,
});

sample({
  clock: merge([
    $zoomState,
    $statusLayerIdByEntity,
    $staticLegendsSelectedByEntity,
    timePlayerActive,
  ]),
  source: gigaLayerSource,
  fn: combineGigaFn({}),
  filter: mapLayerFilter,
  target: changeStaticLayerFx,
});

sample({
  clock: merge([$selectedLayerIdByEntity]),
  source: gigaLayerSource,
  fn: combineGigaFn({}),
  filter: mapLayerFilter,
  target: changeLayersFx,
});

// Registry marker/zoom configuration updates only adjust existing layers. The
// vector sources and their API URLs stay unchanged.
sample({
  clock: $entityRegistry,
  source: gigaLayerSource,
  fn: combineGigaFn({}),
  filter: ({ map: mapInstance }) => !!mapInstance,
  target: changeLayersFx,
});

sample({
  clock: $entityRegistry,
  source: gigaLayerSource,
  fn: combineGigaFn({}),
  filter: ({ map: mapInstance }) => !!mapInstance,
  target: changeStaticLayerFx,
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
    $countryAdvancedFiltersReady,
    $connectivityBenchMarkByEntity,
    $historyIntervalByEntity,
    $lastAvailableDatesByEntity,
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
  fn: () => 'end' as const,
  target: onZoomStateChange,
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
  clock: merge([$schoolStatsMap, $map]),
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
  clock: $activeSchoolPopup,
  source: combine({
    country: $country,
    isMobile: $isMobile,
  }),
  filter: ({ country, isMobile }, activePopup) =>
    isMobile &&
    !!country?.code &&
    !!activePopup?.entityType &&
    !!activePopup.id,
  fn: ({ country }, activePopup) => ({
    countryCode: country!.code,
    entityId: activePopup!.id,
    entityType: activePopup!.entityType,
  }),
  target: createEffect(
    ({
      countryCode,
      entityId,
      entityType,
    }: {
      countryCode: string;
      entityId: number;
      entityType: EntityType;
    }) => navigateToEntity(entityType, countryCode, entityId),
  ),
});

export const $schoolPopupConnectivityMap = $schoolClickData.map((data) =>
  data?.length ? schoolStatsMap(data[0]) : null,
);
export const $schoolPopupData = combine({
  entityType: $schoolClickedEntityType,
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
    activeEntityTypes: $activeEntityTypes,
    selectedLayerIdByEntity: $selectedLayerIdByEntity,
    map: $map,
  }),
  filter: ({ map, activeEntityTypes, selectedLayerIdByEntity }) =>
    !!map &&
    activeEntityTypes.length === 1 &&
    selectedLayerIdByEntity[activeEntityTypes[0]] != null,
  fn: ({ map, country, activeEntityTypes, selectedLayerIdByEntity }) => {
    const entityType = activeEntityTypes[0];
    const selectedLayerId = selectedLayerIdByEntity[entityType];
    const params = `country_id=${country?.id}&layer_id=${selectedLayerId}&start_year=2020`;
    const url = getBaseUrl(
      `api/accounts/time-players/v2/?${params}&z={z}&x={x}&y={y}.mvt`,
    );
    return { url, map: map! };
  },
  target: timePlayerSourceFx,
});

export const timePlayerData = combine({
  map: $map,
  paintData: $stylePaintData,
  timeplayerInfo: $timePlayerInfo,
  activeEntityTypes: $activeEntityTypes,
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
