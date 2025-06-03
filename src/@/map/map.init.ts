import { $isCheckedLastDate, $lastAvailableDates } from '~/@/sidebar/history-graph.model';
import { combine, guard, merge, sample, createEffect } from 'effector';
import { Map } from 'mapbox-gl';

import { $admin1Data, $country, countryReceived, setSchoolFocusLatLng, $admin1Id, $countrySearchString, $countryId, $countryMapping } from '~/@/country/country.model';
import { $connectivityBenchMark, $isPauseTimeplayer, $isTimeplayer, $layerUtils, $staticLegendsSelected, $selectedLayerId, onLoadTimePlayerData, onTimeoutTimePlayer, $timePlayerInfo, $isLoadedTimePlayer, $isLoadingTimeplayer, $schoolStatsMap, $schoolAdminId, schoolStatsMap, $schoolStatusSelectedLayer } from '~/@/sidebar/sidebar.model';
import {
  fetchAdvanceFilterFx,
  fetchCountriesFx,
  fetchCountryFx,
  fetchGlobalStatsFx,
  fetchLayerListFx,
  fetchSchoolPopupDataFx,
  getBaseUrl,
} from '~/api/project-connect';
import { $mapRoutes, map, mapCountry, mapOverview, router } from '~/core/routes';

import {
  changeLayersFx, changeStyleFx,
  updateCoverageFilter
} from '@/map/effects';
import { $connectivityFilter, $connectivitySpeedFilter, $coverageFilter, $selectedLayers } from '@/sidebar/init';

import { changeStaticLayerFx, updateConnectivityFilter, updateConnectivityStatus } from './effects/add-layers-fx';
import { addSchoolMarkers } from './effects/add-marker-fx';
import { stylePaintData } from './map.constant';
import {
  $activeSchoolPopup,
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
import { createLoadingPopupFx } from './popup/effects/create-school-popup-fx';
import { updateSchoolPopupFx } from './popup/effects/update-school-popup.fx';
import { $theme } from '~/core/theme.model';
import { clearTimeplayer, nextTimePlayerIteration, onLoadStartTimePlayer, onPausePlayTimeplayerFx, timePlayerFx, timePlayerSourceFx } from './effects/time-player.fx';
import { $isMobile } from '../admin/models/media-query';
import { $lng, languageStore } from '~/core/i18n/store';
import { mapLabelLayerList } from '../country/country.constant';
import { countryTranslationFx, filterTranslationFx } from '../sidebar/effects/all-translation-fx';

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
    if (routes.map) {
      void fetchGlobalStatsFx({});
    }
    if (routes.map || routes.country || routes.schools) {
      void fetchLayerListFx();
      void fetchCountriesFx();
    }
  })
})


// load global stats
sample({
  clock: merge([mapOverview.visible, mapCountry.visible, fetchCountryFx.doneData, $admin1Id, $countrySearchString]),
  source: combine({ routes: $mapRoutes, country: $country, admin1Id: $admin1Id, countrySearchString: $countrySearchString }),
  fn: ({ routes, country, admin1Id, countrySearchString }) => {
    let query = ''
    if (routes.country) {
      const queryParts = [`country_id=${country?.id}`];
      if (admin1Id) {
        queryParts.push(`admin1_id=${admin1Id}`);
      }
      if (countrySearchString) {
        queryParts.push(countrySearchString);
      }
      query = `?${queryParts.join('&')}`;
    }
    return { query }
  },
  filter: ({ routes, country, admin1Id }) => {
    return [routes.map || (routes.country && !!country) || admin1Id].some(Boolean)
  },
  target: fetchGlobalStatsFx
})

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
  target: $reloadStyle
});

// set reload style true;
sample({
  clock: onStyleLoaded,
  source: $reloadStyle,
  filter: (reload: boolean) => reload,
  target: onReloadedMap,
})

sample({
  clock: onStyleLoaded,
  fn: () => false,
  target: $reloadStyle
});

$map.watch(zoomIn, (map: Map | null) => {
  map?.zoomIn({ duration: 500 });
});

$map.watch(zoomOut, (map: Map | null) => {
  map?.zoomOut({ duration: 500 });
});

$map.watch(setCenter, (map: Map | null, center) => {
  map?.setCenter(center);
});

export const gigaLayerSource = combine({
  selectedLayerIds: $selectedLayers,
  map: $map,
  isCheckedLastDate: $isCheckedLastDate,
  connectivityFilter: $connectivityFilter,
  connectivityBenchMark: $connectivityBenchMark,
  lastAvailableDates: $lastAvailableDates,
  schoolLegends: $staticLegendsSelected,
  coverageFilter: $coverageFilter,
  layerUtils: $layerUtils,
  connectivitySpeedFilter: $connectivitySpeedFilter,
  lastSelectedLayer: $selectedGigaLayers,
  paintData: $stylePaintData,
  mapRoute: $mapRoutes,
  country: $country,
  admin1Data: $admin1Data,
  schoolStats: $schoolStatsMap,
  isMobile: $isMobile,
  schoolAdminId: $schoolAdminId,
  countrySearch: $countrySearchString,
  zoomState: $zoomState
})

const combineGigaFn = (data: { refresh?: boolean; timeout?: number; }) => (source: ReturnType<typeof gigaLayerSource.getState>) => ({
  ...source,
  ...data
})

const mapLayerFilter = ({ isCheckedLastDate, mapRoute }: ReturnType<typeof gigaLayerSource.getState>) => {
  return true; //isCheckedLastDate || mapRoute.map;
}

const timePlayerActive = sample({
  clock: $isTimeplayer,
  filter: isActive => !isActive
});

const $mapRouteVisible = guard(mapOverview.visible, { filter: Boolean });
// change giga layer on selection of layers

sample({
  clock: merge([$zoomState,
    $mapRouteVisible, $countrySearchString, onReloadedMap, $map, countryReceived, $admin1Id, $schoolAdminId, $schoolStatusSelectedLayer, $schoolStatsMap, timePlayerActive]),
  source: gigaLayerSource,
  fn: combineGigaFn({}),
  filter: ({ map }) => {
    return !!map;
  },
  target: changeStaticLayerFx
})

sample({
  clock: merge([$selectedLayerId]),
  source: gigaLayerSource,
  fn: combineGigaFn({}),
  filter: mapLayerFilter,
  target: changeLayersFx,
})
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
    $connectivityBenchMark,
    $countrySearchString,
    timePlayerActive,
    $zoomState
  ]),
  source: gigaLayerSource,
  filter: mapLayerFilter,
  fn: combineGigaFn({ refresh: true }),
  target: changeLayersFx,
})

// reset zoom state when map is loaded and map page is visible
sample({
  clock: $map,
  source: mapOverview.visible,
  fn: () => 'end',
  target: onZoomStateChange
})

sample({
  clock: $connectivityFilter,
  source: gigaLayerSource,
  fn: combineGigaFn({ refresh: true, timeout: 1000 }),
  filter: mapLayerFilter,
  target: changeLayersFx,
});

// update dots, change on coverage filter
sample({
  clock: $coverageFilter,
  source: gigaLayerSource,
  fn: combineGigaFn({}),
  target: updateCoverageFilter,
});

// update connectivity filter;
sample({
  clock: $connectivitySpeedFilter,
  source: gigaLayerSource,
  fn: combineGigaFn({}),
  target: updateConnectivityFilter,
});

sample({
  clock: $staticLegendsSelected,
  source: combine({
    map: $map,
    lastSelectedLayer: $selectedGigaLayers,
  }),
  fn: (source, lengendsSelected) => ({
    lengendsSelected,
    ...source
  }),
  target: updateConnectivityStatus,
});

export const mapMarkerSource = combine({
  map: $map,
  schoolStats: $schoolStatsMap,
  schoolMarkers: $schoolMarkers,
  multipleSchoolPopup: $multipleSchoolPopup,
  stylePaintData: $stylePaintData,
  layerUtils: $layerUtils
})

sample({
  clock: merge([$schoolStatsMap]),
  source: mapMarkerSource,
  target: addSchoolMarkers
})


sample({
  clock: $schoolClickedId,
  source: combine({
    map: $map,
    schoolPopupInfo: $activeSchoolPopup
  }),
  target: createLoadingPopupFx
})

export const $schoolPopupConnectivityMap = $schoolClickData.map((data) => data?.length ? schoolStatsMap(data[0]) : null)
export const $schoolPopupData = combine({
  feature: $schoolPopupConnectivityMap,
  stylePaintData: $stylePaintData,
  layerUtils: $layerUtils,
})

// sample({
//   clock: merge([fetchSchoolPopupDataFx.doneData]),
//   source: combine({ popup: $popup, schoolPopupData: $schoolPopupData, country: $country }),
//   target: updateSchoolPopupFx
// })

sample({
  clock: merge([router.historyUpdated, $isTimeplayer]),
  source: $popup,
  filter: (popup) => !!popup,
  fn: (popup) => {
    if (popup) {
      popup.remove();
      onCreateSchoolPopup(null);
      setSchoolCLickupPopupDiv(null)
    }
  }
})

sample({
  source: $schoolStatsMap,
  target: createEffect((schoolConnenctivity: ReturnType<typeof $schoolStatsMap.getState>) => {
    if (schoolConnenctivity?.length === 1) {
      setSchoolFocusLatLng(schoolConnenctivity[0].geopoint.coordinates)
    }
  })
})

sample({
  clock: sample({
    clock: $isTimeplayer,
    filter: Boolean
  }),
  source: combine({ country: $country, selectedLayerId: $selectedLayerId, map: $map }),
  fn: ({ map, country, selectedLayerId }) => {
    const params = `country_id=${country?.id}&layer_id=${selectedLayerId}&start_year=2020`;
    const url = getBaseUrl(`api/accounts/time-players/v2/?${params}&z={z}&x={x}&y={y}.mvt`)
    return { url, map };
  },
  target: timePlayerSourceFx
})

export const timePlayerData = combine({ map: $map, paintData: $stylePaintData, timeplayerInfo: $timePlayerInfo });
sample({
  clock: timePlayerSourceFx.doneData,
  source: timePlayerData,
  target: timePlayerFx
})

sample({
  clock: sample({
    clock: $isTimeplayer,
    filter: (isTimeplayer) => !isTimeplayer
  }),
  source: timePlayerData,
  target: clearTimeplayer
})

sample({
  clock: onLoadTimePlayerData,
  source: timePlayerData,
  target: onLoadStartTimePlayer
})

sample({
  clock: onLoadTimePlayerData,
  target: $isLoadedTimePlayer
})

sample({
  clock: onLoadTimePlayerData,
  fn: () => false,
  target: $isLoadingTimeplayer
})

sample({
  clock: onTimeoutTimePlayer,
  source: timePlayerData,
  target: nextTimePlayerIteration
})

sample({
  clock: $isPauseTimeplayer,
  target: onPausePlayTimeplayerFx
})


// call filter api on country change
sample({
  clock: $countryId,
  filter: (countryId) => !!countryId,
  fn: (countryId) => countryId ?? 0,
  target: fetchAdvanceFilterFx
})

sample({
  clock: merge([languageStore.$language, $map]),
  source: combine({ map: $map, lng: languageStore.$language }),
  target: createEffect(({ map, lng }: { map: Map, lng: string }) => {
    if (!map || !lng) return;
    for (let key in mapLabelLayerList) {
      map.setLayoutProperty(mapLabelLayerList[key], 'text-field', [
        'get',
        `name_${lng}`
      ]);
    }
  })
})

sample({
  clock: merge([$filterListMapping, languageStore.$language]),
  source: { mapping: $filterListMapping, lng: languageStore.$language },
  filter: ({ mapping, lng }) => {
    return !!mapping?.length && !!lng
  },
  target: filterTranslationFx
})

sample({
  clock: merge([$countryMapping, languageStore.$language]),
  source: { mapping: $countryMapping, lng: languageStore.$language },
  filter: ({ mapping, lng }) => {
    return !!mapping?.length && !!lng
  },
  target: countryTranslationFx
})

onLoadPage();