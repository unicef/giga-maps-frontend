import { combine, createEffect, merge, sample } from 'effector';
import { $activeDublicateSchoolsPopup, $activeSchoolPopup, $allowDublicateSchoolIds, $schoolClickedId, $selectedGigaLayers, changeSchoolConnectedOpenStatus, setSchoolIdsOnPopupClickDot } from '~/@/map/map.model';
import { debounce, getInverted } from '~/lib/effector-kit';

import {
  $admin1Id,
  $countries,
  $country,
  $countryAdminSchoolId,
  $countryCode,
  $countryDefaultNational,
  $countryId,
  $countrySearchString,
  countryReceived, onRecenterView
} from '~/@/country/country.model';
import { getEntityMapValue, EntityType } from '~/@/entities';
import { $activeEntityTypes, changeSelectedEntityType } from '~/@/entities/models/entity.model';
import {
  $connectivityBenchMark,
  $connectivityLayers,
  $connectivitySpeedGood,
  $connectivitySpeedModerate,
  $connectivitySpeednoInternet,
  $connectivitySpeedUnknown,
  $coverage3g2g,
  $coverage5g4g,
  $coverageNoCoverage,
  $coverageUnknown,
  $currentDefaultLayerId,
  $currentLayerTypeUtils,
  $getSchoolParams,
  $globalLayerId,
  $isSidebarCollapsed,
  $isTimeplayer,
  $layersList,
  $layersListMapping,
  $layerUtils,
  $schoolAdminId,
  $schoolStats,
  $schoolStatusSelectedLayer,
  $selectedLayerId,
  $selectedLayerIdByEntity,
  $statusLayerIdByEntity,
  changeConnectivityBenchmark,
  checkConnectivityBenchmark,
  onSchoolUncheck,
  onSelectMainLayer,
  onSelectEntityMainLayer,
  onSelectSchoolStatusLayer,
  resetCoverageFilterSelection,
  resetFilterModal,
  toggleSidebar,
} from '~/@/sidebar/sidebar.model';
import { fetchDublicateSchoolPopupDataFx, fetchEntitiesLayerInfoFx, fetchSchoolLayerInfoFx, fetchSchoolPopupDataFx } from '~/api/project-connect';
import { languageStore } from '~/core/i18n/store';
import { $isMobile } from '~/core/media-query';
import { $mapRoutes, mapOverview, mapSchools, router } from '~/core/routes';
import { IntervalUnit } from '~/lib/date-fns-kit/types';

import { format } from 'date-fns';
import { MaxAllowedDublicateSchoolIds, SCHOOL_LAYER_ID } from '../map/map.constant';
import { publishLayersTranslationFx } from './effects/all-translation-fx';
import { getEntitiesAvailableDates, getSchoolAvailableDates } from './effects/search-country-fx';
import { $historyInterval, $historyIntervalUnit, $isCheckedLastDate, $lastAvailableDates } from './history-graph.model';
import { ConnectivityBenchMarks, SCHOOL_STATUS_LAYER } from './sidebar.constant';
import { isLiveLayer } from './sidebar.util';
import { $initialUrlParams, $isAppSettled, initializeFromUrlParams } from './url-params.model';

$isSidebarCollapsed.on(toggleSidebar, getInverted);
export const $selectedLayers = combine({
  schoolId: $schoolStatusSelectedLayer,
  selectedId: $selectedLayerId,
  schoolIdByEntity: $statusLayerIdByEntity,
  selectedIdByEntity: $selectedLayerIdByEntity,
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
  countrySearch: $countrySearchString,
  isMobile: $isMobile,
  allowDublicateSchoolIds: $allowDublicateSchoolIds,
  activeEntityTypes: $activeEntityTypes,
  selectedLayerIdByEntity: $selectedLayerIdByEntity,
})

export const getCurrentQueryId = ({ countrySearch, interval, mapRoutes, schoolParams, lastSelectedLayers, intervalUnit, layersUtils, connectivityBenchMark, country, admin1Id, isSchoolClicked, allowDublicateSchoolIds }: ReturnType<typeof sourceForInfo.getState> & { isSchoolClicked?: boolean }) => {
  const isWeekly = intervalUnit === IntervalUnit.week;
  const defaultLayerId = lastSelectedLayers.layerId ? lastSelectedLayers.layerId : layersUtils.coverageLayerId;
  const selectedLayerId = layersUtils.selectedLayerId ?? defaultLayerId;
  const isLive = isLiveLayer(layersUtils.layers.find(layer => layer.id === selectedLayerId)?.type);
  const startDate = format(interval.start, 'dd-MM-yyyy');
  const endDate = format(interval.end, 'dd-MM-yyyy');
  const params = new URLSearchParams()
  if (isLive) {
    params.set('start_date', startDate);
    params.set('end_date', endDate);
    params.set('is_weekly', isWeekly.toString());
  }
  // if (isDownload) {
  //   params.set('indicator', 'download');
  // }
  if (country?.id) {
    params.set('country_id', String(country.id));
  }
  // if (!mapRoutes.map && isLive) {
  params.set('benchmark', connectivityBenchMark);
  // }
  if (admin1Id) {
    params.set('admin1_id', String(admin1Id));
  }
  if (schoolParams?.schoolIds && (mapRoutes.schools || isSchoolClicked)) {
    let schoolKeys = '';
    if (typeof schoolParams.schoolIds === 'number') {
      schoolKeys = String(schoolParams.schoolIds);
    } else if (Array.isArray(schoolParams?.schoolIds)) {
      schoolKeys = schoolParams.schoolIds.join(',')
    }
    params.set('school_id__in', schoolKeys);
  }

  params.set('include_same_location_schools', String(allowDublicateSchoolIds));
  if (allowDublicateSchoolIds) {
    params.set('limit_same_location_schools', String(MaxAllowedDublicateSchoolIds));
  }

  let query = `?${params.toString()}`;
  if (mapRoutes.country && countrySearch) {
    query += `&${countrySearch}`;
  }
  return { query, id: selectedLayerId };
}

const getLayerIdForEntity = (
  entityType: EntityType,
  selectedLayerIdByEntity: Partial<Record<EntityType, number | null>>,
  selectedLayerId: number | null,
  defaultLayerId: number | null,
) => {
  return getEntityMapValue(selectedLayerIdByEntity, entityType, defaultLayerId ?? selectedLayerId);
};

export const getCurrentEntityLayerInfoQuery = ({
  activeEntityTypes,
  admin1Id,
  allowDublicateSchoolIds,
  connectivityBenchMark,
  country,
  countrySearch,
  interval,
  intervalUnit,
  lastSelectedLayers,
  layersUtils,
  selectedLayerIdByEntity,
}: ReturnType<typeof sourceForInfo.getState>) => {
  const isWeekly = intervalUnit === IntervalUnit.week;
  const defaultLayerId = lastSelectedLayers.layerId ? lastSelectedLayers.layerId : layersUtils.coverageLayerId;
  const selectedLayerId = layersUtils.selectedLayerId ?? defaultLayerId;
  const startDate = format(interval.start, 'dd-MM-yyyy');
  const endDate = format(interval.end, 'dd-MM-yyyy');
  const params = new URLSearchParams();

  if (country?.id) {
    params.set('country_id', String(country.id));
  }
  if (admin1Id) {
    params.set('admin1_id', String(admin1Id));
  }

  const entityTypes = activeEntityTypes?.length ? activeEntityTypes : [EntityType.SCHOOL];
  entityTypes.forEach((entityType) => {
    const prefix = `${entityType}_`;
    const entityLayerId = getLayerIdForEntity(entityType, selectedLayerIdByEntity, selectedLayerId, defaultLayerId);
    const isLive = isLiveLayer(layersUtils.layers.find(layer => layer.id === entityLayerId)?.type);

    if (isLive) {
      params.set(`${prefix}start_date`, startDate);
      params.set(`${prefix}end_date`, endDate);
      params.set(`${prefix}is_weekly`, isWeekly.toString());
    }
    if (entityLayerId) {
      params.set(`${prefix}layer_id`, String(entityLayerId));
    }
    params.set(`${prefix}benchmark`, connectivityBenchMark);
    params.set(`${prefix}include_same_location`, String(allowDublicateSchoolIds));
  });

  let query = `?${params.toString()}`;
  if (countrySearch) {
    query += `&${countrySearch}`;
  }
  return { query };
};

export const getCurrentEntityConnectivityConfigQuery = ({
  activeEntityTypes,
  country,
  admin1Id,
  layersUtils,
  selectedLayerIdByEntity,
}: ReturnType<typeof sourceForInfo.getState>) => {
  const params = new URLSearchParams();
  if (country?.id) {
    params.set('country_id', String(country.id));
  }
  if (admin1Id) {
    params.set('admin1_id', String(admin1Id));
  }
  const defaultLayerId = layersUtils.selectedLayerId ?? layersUtils.globalLayerId;
  if (defaultLayerId) {
    params.set('layer_id', String(defaultLayerId));
  }
  const entityTypes = activeEntityTypes?.length ? activeEntityTypes : [EntityType.SCHOOL];
  entityTypes.forEach((entityType) => {
    const layerId = getEntityMapValue(selectedLayerIdByEntity, entityType, defaultLayerId);
    if (layerId) {
      params.set(`${entityType}_layer_id`, String(layerId));
    }
  });
  const query = params.toString();
  return { query: query ? `?${query}` : '' };
};

const getCurrentSchoolConnectivityConfigQuery = ({
  admin1Id,
  country,
  layersUtils,
  schoolParams,
}: ReturnType<typeof sourceForInfo.getState>) => {
  const params = new URLSearchParams();
  const selectedLayerId = layersUtils.selectedLayerId ?? layersUtils.globalLayerId;
  if (selectedLayerId) {
    params.set('layer_id', String(selectedLayerId));
  }
  if (country?.id) {
    params.set('country_id', String(country.id));
  }
  if (schoolParams?.schoolIds?.length) {
    params.set('school_ids', schoolParams.schoolIds.join(','));
  }
  if (admin1Id) {
    params.set('admin1_id', String(admin1Id));
  }
  const query = params.toString();
  return { query: query ? `?${query}` : '' };
};

sample({
  clock: merge([$countryId, $admin1Id, $getSchoolParams, $selectedLayerId, $selectedLayerIdByEntity, $activeEntityTypes]),
  source: sourceForInfo,
  fn: getCurrentEntityConnectivityConfigQuery,
  filter: ({ country, layersUtils, mapRoutes }) => {
    return mapRoutes.country && !!country?.id && !!layersUtils.layers?.length && !!layersUtils.currentLayerTypeUtils.isLive;
  },
  target: getEntitiesAvailableDates
})

sample({
  clock: merge([$countryId, $admin1Id, $getSchoolParams, $selectedLayerId]),
  source: sourceForInfo,
  fn: getCurrentSchoolConnectivityConfigQuery,
  filter: ({ country, layersUtils, mapRoutes }) => {
    return mapRoutes.schools && !!country?.id && !!layersUtils.layers?.length && !!layersUtils.currentLayerTypeUtils.isLive;
  },
  target: getSchoolAvailableDates
})

// for all live layers;
sample({
  clock: merge([$countrySearchString, $country, $admin1Id, $selectedLayerId, $selectedLayerIdByEntity, $activeEntityTypes, $connectivityBenchMark, debounce($historyInterval, { timeout: 500 })]),
  source: sourceForInfo,
  fn: getCurrentEntityLayerInfoQuery,
  filter: ({ mapRoutes, country, admin1Id, isCheckedLastDate, layersUtils }: ReturnType<typeof sourceForInfo.getState>) => {
    return mapRoutes.country && (!!country?.id || !!admin1Id) && !!isCheckedLastDate && !!layersUtils.currentLayerTypeUtils.isLive;
  },
  target: fetchEntitiesLayerInfoFx
})

// for all static layers
sample({
  clock: merge([$countrySearchString, $countryId, $admin1Id, $connectivityBenchMark, $selectedLayerId, $selectedLayerIdByEntity, $activeEntityTypes]),
  source: sourceForInfo,
  fn: getCurrentEntityLayerInfoQuery,
  filter: ({ mapRoutes, country, admin1Id, layersUtils }: ReturnType<typeof sourceForInfo.getState>) => {
    return mapRoutes.country && (!!country?.id || !!admin1Id) && !!layersUtils.currentLayerTypeUtils.isStatic;
  },
  target: fetchEntitiesLayerInfoFx
})


const schoolInfoFn = (props: ReturnType<typeof sourceForInfo.getState> & { isSchoolClicked?: boolean }) => {
  const { query, id } = getCurrentQueryId(props);
  const url = `api/accounts/layers/${id}/info/`
  return {
    url,
    query
  }
}
// school view info api
sample({
  clock: merge([mapSchools.visible, countryReceived, $isCheckedLastDate, $selectedLayerId, $historyInterval, mapSchools.router.historyUpdate, $connectivityBenchMark]),
  source: sourceForInfo,
  fn: (props) => schoolInfoFn({ ...props, allowDublicateSchoolIds: true }),
  filter: ({ mapRoutes, country, isCheckedLastDate }: ReturnType<typeof sourceForInfo.getState>) => {
    return mapRoutes.schools && !!country && !!isCheckedLastDate;
  },
  target: fetchSchoolLayerInfoFx
});


// fetch click school data
sample({
  clock: $schoolClickedId,
  source: combine({
    info: sourceForInfo,
    activePopup: $activeSchoolPopup,
  }),
  filter: ({ info }) => !info.isMobile,
  fn: ({ info, activePopup }, schoolIds) =>
    schoolInfoFn({
      ...info,
      isSchoolClicked: true,
      schoolParams: { schoolIds: [Number(schoolIds)], country: null },
      allowDublicateSchoolIds: activePopup?.allowDublicateSchoolIds ?? false,
    }),
  target: fetchSchoolPopupDataFx
});

// refetch open school popup data when user switches the live layer
sample({
  clock: $selectedLayerId,
  source: combine({
    info: sourceForInfo,
    activePopup: $activeSchoolPopup,
    schoolClickedId: $schoolClickedId,
  }),
  filter: ({ info, schoolClickedId }) => !info.isMobile && !!schoolClickedId,
  fn: ({ info, activePopup, schoolClickedId }) =>
    schoolInfoFn({
      ...info,
      isSchoolClicked: true,
      schoolParams: { schoolIds: [Number(schoolClickedId)], country: null },
      allowDublicateSchoolIds: activePopup?.allowDublicateSchoolIds ?? false,
    }),
  target: fetchSchoolPopupDataFx
});

// Fetch dublicate school data
sample({
  clock: setSchoolIdsOnPopupClickDot,
  source: sourceForInfo,
  filter: ({ isMobile }) => !isMobile,
  fn: (props, school) => schoolInfoFn({ ...props, isSchoolClicked: true, schoolParams: { schoolIds: school?.ids, country: null }, allowDublicateSchoolIds: school?.allowDublicateSchoolIds ?? false }),
  target: fetchDublicateSchoolPopupDataFx
});

// refetch open duplicate-school popup data when user switches the live layer
sample({
  clock: $selectedLayerId,
  source: combine({
    info: sourceForInfo,
    duplicateSchoolPopup: $activeDublicateSchoolsPopup,
  }),
  filter: ({ info, duplicateSchoolPopup }) => !info.isMobile && !!duplicateSchoolPopup?.ids?.length,
  fn: ({ info, duplicateSchoolPopup }) => schoolInfoFn({
    ...info,
    isSchoolClicked: true,
    schoolParams: { schoolIds: duplicateSchoolPopup?.ids, country: null },
    allowDublicateSchoolIds: duplicateSchoolPopup?.allowDublicateSchoolIds ?? false
  }),
  target: fetchDublicateSchoolPopupDataFx
});

// Fetch dublicate school data
sample({
  clock: setSchoolIdsOnPopupClickDot,
  source: sourceForInfo,
  filter: ({ isMobile }) => !isMobile,
  fn: (props, schoolIds) => schoolInfoFn({ ...props, isSchoolClicked: true, schoolParams: { schoolIds: schoolIds?.ids, country: null }, allowDublicateSchoolIds: schoolIds?.allowDublicateSchoolIds ?? false }),
  target: fetchDublicateSchoolPopupDataFx
})


// change layer when open global view or close global view
sample({
  clock: merge([mapOverview.visible, $connectivityLayers]),
  source: combine({ globalLayerId: $globalLayerId, mapVisible: mapOverview.visible }),
  filter: ({ mapVisible }) => mapVisible,
  target: createEffect(({ globalLayerId }: { globalLayerId: number | null }) => {
    onSelectMainLayer(globalLayerId);
    onSelectSchoolStatusLayer(SCHOOL_LAYER_ID)
    changeConnectivityBenchmark(ConnectivityBenchMarks.global)
  })
})

// update school layer when main layer changed
sample({
  clock: $selectedLayerId,
  source: combine({
    schoolId: $schoolStatusSelectedLayer,
    layerUtils: $layerUtils,
    initialUrlParams: $initialUrlParams,
    isAppSettled: $isAppSettled
  }),
  fn: ({ schoolId, layerUtils, initialUrlParams, isAppSettled }) => {
    const { selectedLayerId, currentLayerTypeUtils } = layerUtils;
    const { isStatic } = currentLayerTypeUtils;

    // On first load, if URL has school status layer param, use it
    if (!isAppSettled && (initialUrlParams.schoolStatusLayer || initialUrlParams.isSchoolStatusLayerNull)) {
      if (!isStatic) {
        return initialUrlParams.schoolStatusLayer;
      }
    }
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
  source: combine({
    layerUtils: $layerUtils,
    loadedLayersAndCountries,
    initialUrlParams: $initialUrlParams,
    isAppSettled: $isAppSettled
  }),
  fn: ({ layerUtils: { currentDefaultLayerId, activeLayerByCountryCode }, initialUrlParams, isAppSettled }) => {
    // If URL has layer param and it hasn't been applied yet, use URL value
    if (!isAppSettled && (initialUrlParams.layerId || initialUrlParams.isLayerIdNull)) {
      const isUrlLayerActive = activeLayerByCountryCode[initialUrlParams.layerId ?? ''];
      if (isUrlLayerActive || initialUrlParams.isLayerIdNull) {
        return initialUrlParams.layerId;
      }
    }
    // Otherwise use default layer
    return currentDefaultLayerId;
  },
  filter: ({ loadedLayersAndCountries: isLoaded }) => isLoaded,
  target: onSelectMainLayer,
});

// On first country code update, preserve URL layer value if present
sample({
  clock: merge([$countryCode]),
  source: combine({
    layerUtils: $layerUtils,
    countryCode: $countryCode,
    initialUrlParams: $initialUrlParams,
    isAppSettled: $isAppSettled
  }),
  fn: ({ layerUtils: { selectedLayerId, currentLayerTypeUtils, isActiveCurrentLayer, currentDefaultLayerId, activeLayerByCountryCode }, initialUrlParams, isAppSettled }) => {
    // On first country code update, if URL has layer param, use it (if valid for country)
    if (!isAppSettled && (initialUrlParams.layerId || initialUrlParams.isLayerIdNull)) {
      const isUrlLayerActive = activeLayerByCountryCode[initialUrlParams.layerId ?? ''];
      if (isUrlLayerActive || initialUrlParams.isLayerIdNull) {
        return initialUrlParams.layerId;
      }
    }
    // Normal behavior for subsequent updates
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
  clock: changeSelectedEntityType,
  source: combine({
    currentDefaultLayerId: $currentDefaultLayerId,
    selectedLayerIdByEntity: $selectedLayerIdByEntity,
    selectedLayerId: $selectedLayerId,
  }),
  fn: ({ currentDefaultLayerId, selectedLayerIdByEntity, selectedLayerId }, entityType) => {
    return Object.prototype.hasOwnProperty.call(selectedLayerIdByEntity, entityType)
      ? selectedLayerIdByEntity[entityType] ?? null
      : currentDefaultLayerId ?? selectedLayerId;
  },
  target: onSelectMainLayer
})

sample({
  clock: onSelectEntityMainLayer,
  fn: ({ entityType }) => entityType,
  target: changeSelectedEntityType
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

const benchmarkSource = combine({ connectivityBenchMark: $connectivityBenchMark, countryDefaultNational: $countryDefaultNational, country: $country, currentLayerTypeUtils: $currentLayerTypeUtils, selectedLayerId: $selectedLayerId });
const benchmarkFn = (isClockId: boolean) => ({ countryDefaultNational = {}, selectedLayerId, connectivityBenchMark }: ReturnType<typeof benchmarkSource.getState>, clockLayerId: any) => {
  let currentBenchmark = connectivityBenchMark;
  const layerId = isClockId ? clockLayerId : selectedLayerId;
  if (countryDefaultNational && countryDefaultNational[layerId ?? ""]) {
    currentBenchmark = ConnectivityBenchMarks.national
  } else {
    currentBenchmark = ConnectivityBenchMarks.global
  }
  return currentBenchmark
}

// default national for a country and layer
sample({
  clock: merge([$country, $layersList]),
  source: benchmarkSource,
  fn: benchmarkFn(false),
  filter: ({ country }) => !!country,
  target: changeConnectivityBenchmark
})
// for static layer
sample({
  clock: checkConnectivityBenchmark,
  source: benchmarkSource,
  fn: benchmarkFn(true),
  filter: ({ country }) => !!country,
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

// reset legends on country change
sample({
  clock: merge([$countryCode]),
  source: $isAppSettled,
  filter: (isAppSettled) => isAppSettled,
  target: [resetFilterModal, resetCoverageFilterSelection]
})
// Initialize URL params on app start
// This applies URL params to stores (connectivity speed, coverage filters, etc.)
initializeFromUrlParams();
