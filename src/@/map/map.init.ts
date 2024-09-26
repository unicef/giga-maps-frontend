import { $isCheckedLastDate, $lastAvailableDates } from '~/@/sidebar/history-graph.model';
import { combine, guard, merge, sample, createEffect } from 'effector';
import { Map } from 'mapbox-gl';

import { $admin1Data, $country, countryReceived, setSchoolFocusLatLng, $admin1Id, $countrySearchString } from '~/@/country/country.model';
import { $connectivityBenchMark, $isPauseTimeplayer, $isTimeplayer, $layerUtils, $schoolStats, $staticLegendsSelected, $selectedLayerId, onLoadTimePlayerData, onTimeoutTimePlayer, $timePlayerInfo, $isLoadedTimePlayer, $isLoadingTimeplayer } from '~/@/sidebar/sidebar.model';
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

import { updateConnectivityFilter, updateConnectivityStatus } from './effects/add-layers-fx';
import { addSchoolMarkers } from './effects/add-marker-fx';
import { stylePaintData } from './map.constant';
import {
  $activeSchoolPopup,
  $map,
  $popup,
  $reloadStyle,
  $schoolClickData,
  $schoolClickedId,
  $schoolMarkers,
  $selectedGigaLayers,
  $stylePaintData,
  changeStyle,
  onCreateSchoolPopup,
  onLoadPage,
  onReloadedMap,
  onStyleLoaded,
  setCenter,
  zoomIn,
  zoomOut,
} from './map.model';
import { createLoadingPopupFx } from './popup/effects/create-school-popup-fx';
import { updateSchoolPopupFx } from './popup/effects/update-school-popup.fx';
import { SchoolStatsType } from '~/api/types';
import { $theme } from '~/core/theme.model';
import { clearTimeplayer, nextTimePlayerIteration, onLoadStartTimePlayer, onPausePlayTimeplayerFx, timePlayerFx, timePlayerSourceFx } from './effects/time-player.fx';
import { $isMobile } from '../admin/models/media-query';

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

const schoolStatsMap = (school: SchoolStatsType) => ({
  name: school.name,
  geopoint: school?.geopoint,
  liveAvg: school?.connectivity_speed || school?.live_avg || 0,
  staticValue: school?.field_value ?? school?.coverage_type ?? school?.statistics?.coverage_type,
  staticType: school?.field_status ?? school?.coverage_status,
  connectivityStatus: school.connectivity_status || school.statistics.connectivity_status,
  isRealTime: school.is_rt_connected,
  connectivityType: school?.week_connectivity || school?.live_avg_connectivity,
  id: school?.id,
  externalId: school?.external_id,
})
export const $schoolStatsMap = $schoolStats.map((schools) => {
  return schools?.map(schoolStatsMap) ?? null;
})

export const $schoolAdminId = $schoolStats.map((schools) => {
  if (schools?.length) {
    const ids = new Set(schools?.map((school) => school.admin1_id));
    console.log(ids.size === 1 ? schools[0].admin1_id : 0, ids)
    return ids.size === 1 ? schools[0].admin1_id : 0
  }
  return null;
})

const schoolConnectivityLength = $schoolStatsMap.map((data) => data?.length);
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
  countrySearch: $countrySearchString
})

const combineGigaFn = (data: { refresh?: boolean; timeout?: number; }) => (source: ReturnType<typeof gigaLayerSource.getState>) => ({
  ...source,
  ...data
})

const mapLayerFilter = ({ isCheckedLastDate, mapRoute }: ReturnType<typeof gigaLayerSource.getState>) => {
  return isCheckedLastDate || mapRoute.map;
}

const $mapRouteVisible = guard(mapOverview.visible, { filter: Boolean });
// change giga layer on selection of layers
sample({
  clock: merge([$selectedLayers, $map]),
  source: gigaLayerSource,
  fn: combineGigaFn({}),
  filter: mapLayerFilter,
  target: changeLayersFx,
})
// change giga layer update on connectivity filter
sample({
  clock: merge([
    onReloadedMap,
    $mapRouteVisible,
    $map,
    countryReceived,
    $admin1Data,
    $schoolAdminId,
    // schoolConnectivityLength,
    $schoolStatsMap,
    $connectivityBenchMark,
    $countrySearchString,
    sample({
      clock: $isTimeplayer,
      filter: isActive => !isActive
    })
  ]),
  source: gigaLayerSource,
  filter: mapLayerFilter,
  fn: combineGigaFn({ refresh: true }),
  target: changeLayersFx,
})

// sample({
//   clock: merge([
//     $selectedLayers, $map, $connectivityFilter, onReloadedMap,
//     $mapRouteVisible,
//     $map,
//     countryReceived,
//     $admin1Data,
//     // schoolConnectivityLength,
//     // $schoolStatsMap,
//     $connectivityBenchMark,
//     $countrySearchString,
//   ]), fn: (value) => console.log(value)
// })
// clear map data on country change;

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
  stylePaintData: $stylePaintData,
  layerUtils: $layerUtils
})

sample({
  clock: $schoolStatsMap,
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

sample({
  clock: fetchSchoolPopupDataFx.doneData,
  source: combine({ popup: $popup, schoolPopupData: $schoolPopupData, country: $country }),
  target: updateSchoolPopupFx
})

sample({
  clock: merge([router.historyUpdated, $isTimeplayer]),
  source: $popup,
  filter: (popup) => !!popup,
  fn: (popup) => {
    if (popup) {
      popup.remove();
      onCreateSchoolPopup(null);
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
  clock: $country,
  filter: (country) => !!country?.id,
  fn: (country) => country?.id ?? 0,
  target: fetchAdvanceFilterFx
})
onLoadPage();