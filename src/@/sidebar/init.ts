import { $schoolClickedId, $selectedGigaLayers, changeSchoolConnectedOpenStatus } from '~/@/map/map.model';
import { debounce, getInverted } from '~/lib/effector-kit';
import { combine, createEffect, merge, sample } from 'effector';

import {
  $admin1Id,
  $country, $countryCode, countryReceived, onRecenterView, $countries, $countryDefaultNational, $countrySearchString, $countryAdminSchoolId
} from '~/@/country/country.model';
import {
  $connectivityBenchMark,
  $connectivitySpeedGood,
  $connectivitySpeedModerate,
  $connectivitySpeednoInternet,
  $connectivitySpeedUnknown,
  $coverage3g2g,
  $coverage5g4g,
  $coverageNoCoverage,
  $coverageUnknown,
  $selectedLayerId,
  $schoolStatusSelectedLayer,
  $isSidebarCollapsed,
  $schoolStats,
  onSchoolUncheck,
  toggleSidebar,
  $layerUtils,
  $downloadLayerId,
  onSelectMainLayer,
  onSelectSchoolStatusLayer,
  $isCurrentLayerLive,
  $layersList,
  $isTimeplayer,
  $connectivityLayers,
  $currentDefaultLayerId,
  changeConnectivityBenchmark,
  $currentLayerTypeUtils,
  $isNationalBenchmark,
  $schoolAdminId,
  $layersListMapping,
} from '~/@/sidebar/sidebar.model';
import { fetchConnectivityLayerFx, fetchCountryLiveLayerInfo, fetchCountryStaticLayerInfo, fetchCoverageLayerFx, fetchLayerListFx, fetchSchoolLayerInfoFx, fetchSchoolPopupDataFx } from '~/api/project-connect';
import { mapSchools, router, $mapRoutes, mapOverview } from '~/core/routes';
import { IntervalUnit } from '~/lib/date-fns-kit/types';

import { getSchoolAvailableDates } from './effects/search-country-fx';
import { $historyInterval, $historyIntervalUnit, $isCheckedLastDate, $lastAvailableDates } from './history-graph.model';
import { ConnectivityBenchMarks, Layers, SCHOOL_STATUS_LAYER } from './sidebar.constant';
import { format } from 'date-fns';
import { isLiveLayer } from './sidebar.util';
import { languageStore } from '~/core/i18n/store';
import { publishLayersTranslationFx } from './effects/all-translation-fx';

$isSidebarCollapsed.on(toggleSidebar, getInverted);
export const $selectedLayers = combine({
  schoolId: $schoolStatusSelectedLayer,
  selectedId: $selectedLayerId,
})

export const $connectivityFilter = combine(
  $historyInterval,
  $historyIntervalUnit,
  (range, interval) => ({ isWeek: interval === IntervalUnit.week, range })
)

export const $connectivitySpeedFilter = combine({
  good: $connectivitySpeedGood,
  moderate: $connectivitySpeedModerate,
  bad: $connectivitySpeednoInternet,
  unknown: $connectivitySpeedUnknown
})

export const $coverageFilter = combine({
  good: $coverage5g4g,
  moderate: $coverage3g2g,
  bad: $coverageNoCoverage,
  unknown: $coverageUnknown,
})

export const $getSchoolParams = sample({
  source: mapSchools.router.search,
  fn: (searchParams) => {
    const params = new URLSearchParams(searchParams)
    return {
      country: params.get('country'),
      schoolIds: params.get('school_ids')?.split(',').map(Number)
    }
  }
})

const countryIdAndSchoolIds = combine($country, $getSchoolParams, $admin1Id, (country, schoolParams, admin1Id) => ({
  countryId: country?.id,
  schoolIds: schoolParams?.schoolIds,
  admin1Id
}))

sample({
  clock: merge([countryIdAndSchoolIds, $selectedLayerId]),
  source: combine({ countryIdAndSchoolIds, isCurrentLayerLive: $isCurrentLayerLive, layers: $layersList, selectedLayerId: $selectedLayerId }),
  fn: ({ countryIdAndSchoolIds, selectedLayerId }) => {
    const { countryId, schoolIds, admin1Id } = countryIdAndSchoolIds
    return {
      query: `?layer_id=${selectedLayerId}&country_id=${countryId}${schoolIds?.length ? `&school_ids=${schoolIds?.join(',')}` : ''}${admin1Id ? `&admin1_id=${admin1Id}` : ''}`
    }
  },
  filter: ({ countryIdAndSchoolIds, isCurrentLayerLive, layers }) => {
    const { countryId, schoolIds, admin1Id } = countryIdAndSchoolIds
    if (!!countryId && layers?.length && !!isCurrentLayerLive) {
      return !!countryId || !!schoolIds?.length || !!admin1Id
    }
    return false;
  },
  target: getSchoolAvailableDates
})

// on school remove from list;
sample({
  clock: onSchoolUncheck,
  source: $schoolStats,
  fn: (schoolStats, id) => {
    return schoolStats?.filter(school => school.id !== id) ?? null;
  },
  target: $schoolStats
})

sample({
  clock: onSchoolUncheck,
  source: $getSchoolParams,
  fn: (schoolParams, uncheckId) => {
    const newParams = new URLSearchParams({
      country: schoolParams.country ?? '',
      school_ids: schoolParams?.schoolIds?.filter((id) => String(id) !== String(uncheckId)) ?? ''
    } as Record<string, string>).toString()
    const url = '/map/schools?' + newParams;
    router.history.replace(url);
    return url;
  },
});


// live layer effect
const sourceForInfo = combine({
  connectivityBenchMark: $connectivityBenchMark,
  country: $country,
  interval: $historyInterval,
  layersUtils: $layerUtils,
  intervalUnit: $historyIntervalUnit,
  admin1Id: $admin1Id,
  lastAvailableDates: $lastAvailableDates,
  mapRoutes: $mapRoutes,
  schoolParams: $getSchoolParams,
  lastSelectedLayers: $selectedGigaLayers,
  isCheckedLastDate: $isCheckedLastDate,
  countrySearch: $countrySearchString
})

export const getCurrentQueryId = ({ countrySearch, interval, mapRoutes, schoolParams, lastSelectedLayers, intervalUnit, layersUtils, connectivityBenchMark, country, admin1Id }: ReturnType<typeof sourceForInfo.getState>) => {
  const isWeekly = intervalUnit === IntervalUnit.week;
  const defaultLayerId = lastSelectedLayers.layerId ? lastSelectedLayers.layerId : layersUtils.coverageLayerId;
  const selectedLayerId = layersUtils.selectedLayerId ?? defaultLayerId;
  const isDownload = selectedLayerId === layersUtils?.downloadLayerId;
  const isCoverage = selectedLayerId === layersUtils?.coverageLayerId;
  const isLive = isLiveLayer(layersUtils.layers.find(layer => layer.id === selectedLayerId)?.type);
  const startDate = format(interval.start, 'dd-MM-yyyy');
  const endDate = format(interval.end, 'dd-MM-yyyy');
  let params = new URLSearchParams()
  if (isLive) {
    params.set('start_date', startDate);
    params.set('end_date', endDate);
    params.set('is_weekly', isWeekly.toString());
  }
  if (isDownload) {
    params.set('indicator', 'download');
  }
  if (country?.id) {
    params.set('country_id', String(country.id));
  }
  // if (!mapRoutes.map && isLive) {
  params.set('benchmark', connectivityBenchMark);
  // }
  if (admin1Id) {
    params.set('admin1_id', String(admin1Id));
  }
  if (schoolParams?.schoolIds) {
    let schoolKeys = '';
    if (typeof schoolParams.schoolIds === 'number') {
      schoolKeys = String(schoolParams.schoolIds);
    } else if (Array.isArray(schoolParams?.schoolIds)) {
      schoolKeys = schoolParams.schoolIds.join(',')
    }
    if (isDownload || isCoverage) {
      params.set('school_ids', schoolKeys);
    } else {
      params.set('school_id__in', schoolKeys);
    }
  }
  let query = `?${params.toString()}`;
  if (mapRoutes.country && countrySearch) {
    query += `&${countrySearch}`;
  }
  return { query, id: selectedLayerId };
}
// only for download layer;
sample({
  clock: merge([$countrySearchString, $country, $admin1Id, $selectedLayerId, $connectivityBenchMark, debounce($historyInterval, { timeout: 200 })]),
  source: sourceForInfo,
  fn: getCurrentQueryId,
  filter: ({ mapRoutes, country, admin1Id, isCheckedLastDate, layersUtils }: ReturnType<typeof sourceForInfo.getState>) => {
    return mapRoutes.country && (!!country?.id || !!admin1Id) && !!isCheckedLastDate && layersUtils?.selectedLayerId === layersUtils?.downloadLayerId;
  },
  target: fetchConnectivityLayerFx
})

// for all live layers;
sample({
  clock: merge([$countrySearchString, $country, $admin1Id, $selectedLayerId, $connectivityBenchMark, debounce($historyInterval, { timeout: 200 })]),
  source: sourceForInfo,
  fn: getCurrentQueryId,
  filter: ({ mapRoutes, country, admin1Id, isCheckedLastDate, layersUtils }: ReturnType<typeof sourceForInfo.getState>) => {
    return mapRoutes.country && (!!country?.id || !!admin1Id) && !!isCheckedLastDate && layersUtils?.selectedLayerId !== layersUtils?.downloadLayerId && !!layersUtils.currentLayerTypeUtils.isLive;
  },
  target: fetchCountryLiveLayerInfo
})

// for mobile coverage layer;
sample({
  clock: merge([$countrySearchString, $country, $admin1Id, $selectedLayerId]),
  source: sourceForInfo,
  fn: getCurrentQueryId,
  filter: ({ mapRoutes, country, admin1Id, layersUtils }: ReturnType<typeof sourceForInfo.getState>) => {
    return mapRoutes.country && (!!country?.id || !!admin1Id) && layersUtils?.selectedLayerId === layersUtils?.coverageLayerId;
  },
  target: fetchCoverageLayerFx
})

// for all coverage layers
sample({
  clock: merge([$countrySearchString, $country, $admin1Id, $connectivityBenchMark, $selectedLayerId]),
  source: sourceForInfo,
  fn: getCurrentQueryId,
  filter: ({ mapRoutes, country, admin1Id, layersUtils }: ReturnType<typeof sourceForInfo.getState>) => {
    return mapRoutes.country && (!!country?.id || !!admin1Id) && layersUtils?.selectedLayerId !== layersUtils?.coverageLayerId && !!layersUtils.currentLayerTypeUtils.isStatic;
  },
  target: fetchCountryStaticLayerInfo
})


const schoolInfoFn = (props: ReturnType<typeof sourceForInfo.getState>) => {
  const { downloadLayerId, coverageLayerId } = props.layersUtils;
  const { query, id } = getCurrentQueryId(props);
  let url = `api/accounts/layers/${id}/info/`
  if (downloadLayerId === id) {
    url = 'api/statistics/schoolconnectivity/'
  } else if (coverageLayerId === id) {
    url = 'api/statistics/schoolcoverage/'
  }
  return {
    url,
    query
  }
}
// school view info api
sample({
  clock: merge([mapSchools.visible, countryReceived, $isCheckedLastDate, $selectedLayerId, $historyInterval, mapSchools.router.historyUpdate, $connectivityBenchMark]),
  source: sourceForInfo,
  fn: schoolInfoFn,
  filter: ({ mapRoutes, country, isCheckedLastDate }: ReturnType<typeof sourceForInfo.getState>) => {
    return mapRoutes.schools && !!country && !!isCheckedLastDate;
  },
  target: fetchSchoolLayerInfoFx
});


// fetch click school data
sample({
  clock: $schoolClickedId,
  source: sourceForInfo,
  fn: (props, schoolIds) => schoolInfoFn({ ...props, schoolParams: { schoolIds: [Number(schoolIds)], country: null } }),
  target: fetchSchoolPopupDataFx
})


// change layer when open global view or close global view
sample({
  clock: merge([mapOverview.visible, $connectivityLayers]),
  source: combine({ downloadLayerId: $downloadLayerId, mapVisible: mapOverview.visible }),
  filter: ({ mapVisible }) => mapVisible,
  target: createEffect(({ downloadLayerId }: { downloadLayerId: number | null }) => {
    onSelectMainLayer(downloadLayerId);
    onSelectSchoolStatusLayer(SCHOOL_STATUS_LAYER.id)
    changeConnectivityBenchmark(ConnectivityBenchMarks.global)
  })
})

// update school layer when main layer changed
sample({
  clock: $selectedLayerId,
  source: combine({ schoolId: $schoolStatusSelectedLayer, layerUtils: $layerUtils }),
  fn: ({ schoolId, layerUtils }) => {
    const { selectedLayerId, currentLayerTypeUtils } = layerUtils;
    const { isStatic } = currentLayerTypeUtils;
    let currentSchoolLayer = schoolId
    if (!selectedLayerId && !schoolId) {
      currentSchoolLayer = SCHOOL_STATUS_LAYER.id
    }
    if (isStatic && currentSchoolLayer) {
      currentSchoolLayer = null;
    }
    return currentSchoolLayer;
  },
  target: onSelectSchoolStatusLayer
})


// set default layer on layers list load/change
const loadedLayersAndCountries = combine($connectivityLayers, $countries, $currentDefaultLayerId, (layers, countries, currentDefaultLayerId) => {
  return (!!layers?.length && !!countries?.length && !!currentDefaultLayerId)
});
sample({
  clock: loadedLayersAndCountries,
  source: combine({ layerUtils: $layerUtils, loadedLayersAndCountries }),
  fn: ({ layerUtils: { currentDefaultLayerId } }, loadedLayersAndCountries) => {
    return currentDefaultLayerId;
  },
  filter: ({ loadedLayersAndCountries }) => loadedLayersAndCountries,
  target: onSelectMainLayer,
})

// remove connectivity layer on country change
sample({
  clock: merge([$countryCode]),
  source: combine({ layerUtils: $layerUtils, countryCode: $countryCode }),
  fn: ({ layerUtils: { selectedLayerId, currentLayerTypeUtils, isActiveCurrentLayer, currentDefaultLayerId } }) => {
    let nextLayerId = selectedLayerId;
    if (currentLayerTypeUtils.isLive && !isActiveCurrentLayer || currentLayerTypeUtils.isStatic && !isActiveCurrentLayer) {
      nextLayerId = null;
    }
    if (currentLayerTypeUtils.isLive && currentDefaultLayerId) {
      return currentDefaultLayerId;
    }
    // select default layer 
    return nextLayerId;
  },
  filter: ({ countryCode }) => !!countryCode,
  target: onSelectMainLayer
})

sample({
  clock: $schoolStatusSelectedLayer,
  fn: Boolean,
  target: changeSchoolConnectedOpenStatus
})

sample({
  clock: $isTimeplayer,
  target: $isSidebarCollapsed
})

sample({
  clock: $isTimeplayer,
  filter: Boolean,
  target: onRecenterView
})

// default national for a country and layer
sample({
  clock: merge([$country, $connectivityLayers]),
  source: combine({ isNationalBenchmark: $isNationalBenchmark, connectivityBenchMark: $connectivityBenchMark, countryDefaultNational: $countryDefaultNational, country: $country, currentLayerTypeUtils: $currentLayerTypeUtils, selectedLayerId: $selectedLayerId }),
  fn: ({ isNationalBenchmark, countryDefaultNational = {}, selectedLayerId, connectivityBenchMark }) => {
    let currentBenchmark = connectivityBenchMark;
    if (countryDefaultNational && countryDefaultNational[selectedLayerId || 0]) {
      currentBenchmark = ConnectivityBenchMarks.national
    } else {
      currentBenchmark = ConnectivityBenchMarks.global
    }
    return currentBenchmark
  },
  filter: ({ country, currentLayerTypeUtils }) => !!country && currentLayerTypeUtils.isLive,
  target: changeConnectivityBenchmark
})

sample({
  source: combine($schoolAdminId, $schoolStats),
  fn: ([schoolAdminId, schoolStats]) => {
    if (schoolAdminId && (schoolStats?.length ?? 0) > 1) {
      return schoolAdminId;
    }
    return null;
  },
  target: $countryAdminSchoolId
})

sample({
  clock: merge([$layersListMapping, languageStore.$language]),
  source: { mapping: $layersListMapping, lng: languageStore.$language },
  filter: ({ mapping, lng }) => {
    return !!mapping?.length && !!lng
  },
  target: publishLayersTranslationFx
})

