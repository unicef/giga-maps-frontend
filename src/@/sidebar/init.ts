import { format } from 'date-fns';
import { combine, createEffect, merge, sample } from 'effector';

import {
  $admin1Id,
  $countries,
  $country,
  $countryAdminSchoolId,
  $countryCode,
  $countryDefaultNational,
  $countryId,
  $countrySearchString,
  countryReceived,
  onRecenterView,
} from '~/@/country/country.model';
import { EntityType, getEntityMapValue } from '~/@/entities';
import {
  $activeEntityTypes,
  $selectedEntityType,
  changeSelectedEntityType,
} from '~/@/entities/models/entity.model';
import {
  $activeDublicateSchoolsPopup,
  $activeSchoolPopup,
  $allowDublicateSchoolIds,
  $schoolClickedId,
  $selectedGigaLayers,
  changeSchoolConnectedOpenStatus,
  setSchoolIdsOnPopupClickDot,
} from '~/@/map/map.model';
import {
  $connectivityBenchMark,
  $connectivityBenchMarkByEntity,
  $connectivityLayers,
  $connectivitySpeedFilterByEntity,
  $coverage3g2g,
  $coverage5g4g,
  $coverageNoCoverage,
  $coverageStatusAllByEntity,
  $coverageUnknown,
  $currentDefaultLayerIdByEntity,
  $currentLayerTypeUtils,
  $getSchoolParams,
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
  changeEntityConnectivityBenchmark,
  checkConnectivityBenchmark,
  checkEntityConnectivityBenchmark,
  onSchoolUncheck,
  onSelectEntityMainLayer,
  onSelectEntityStatusLayer,
  resetCoverageFilterSelection,
  resetFilterModal,
  toggleSidebar,
} from '~/@/sidebar/sidebar.model';
import {
  fetchDublicateSchoolPopupDataFx,
  fetchEntitiesLayerInfoFx,
  fetchSchoolLayerInfoFx,
  fetchSchoolPopupDataFx,
} from '~/api/project-connect';
import { languageStore } from '~/core/i18n/store';
import { $isMobile } from '~/core/media-query';
import { $mapRoutes, mapSchools, router } from '~/core/routes';
import { IntervalUnit } from '~/lib/date-fns-kit/types';
import { debounce, getInverted } from '~/lib/effector-kit';

import { MaxAllowedDublicateSchoolIds } from '../map/map.constant';
import { publishLayersTranslationFx } from './effects/all-translation-fx';
import {
  getEntitiesAvailableDates,
  getSchoolAvailableDates,
} from './effects/search-country-fx';
import {
  $historyInterval,
  $historyIntervalByEntity,
  $historyIntervalUnit,
  $historyIntervalUnitByEntity,
  $isCheckedLastDate,
  $lastAvailableDates,
} from './history-graph.model';
import {
  ConnectivityBenchMarks,
  SCHOOL_STATUS_LAYER,
} from './sidebar.constant';
import { getEntityStatusId, isLiveLayer } from './sidebar.util';
import {
  $initialUrlParams,
  $isAppSettled,
  initializeFromUrlParams,
} from './url-params.model';

$isSidebarCollapsed.on(toggleSidebar, getInverted);
export const $selectedLayers = combine({
  schoolId: $schoolStatusSelectedLayer,
  selectedId: $selectedLayerIdByEntity.map(
    (selectedLayerIdByEntity) =>
      selectedLayerIdByEntity[EntityType.SCHOOL] ?? null,
  ),
  schoolIdByEntity: $statusLayerIdByEntity,
  selectedIdByEntity: $selectedLayerIdByEntity,
});

export const $connectivityFilter = combine(
  $historyInterval,
  $historyIntervalUnit,
  (range, interval) => ({ isWeek: interval === IntervalUnit.week, range }),
);

export const $connectivitySpeedFilter = combine(
  $connectivitySpeedFilterByEntity,
  $selectedEntityType,
  (state, selectedEntityType) => ({
    good: state[selectedEntityType]?.good ?? true,
    moderate: state[selectedEntityType]?.moderate ?? true,
    bad: state[selectedEntityType]?.bad ?? true,
    unknown: state[selectedEntityType]?.unknown ?? true,
  }),
);

export const $coverageFilter = combine({
  good: $coverage5g4g,
  moderate: $coverage3g2g,
  bad: $coverageNoCoverage,
  unknown: $coverageUnknown,
});
export const $coverageFilterByEntity = $coverageStatusAllByEntity;

// on school remove from list;
sample({
  clock: onSchoolUncheck,
  source: $schoolStats,
  fn: (schoolStats, id) => {
    return schoolStats?.filter((school) => school.id !== id) ?? null;
  },
  target: $schoolStats,
});

sample({
  clock: onSchoolUncheck,
  source: $getSchoolParams,
  fn: (schoolParams, uncheckId) => {
    const newParams = new URLSearchParams({
      country: schoolParams.country ?? '',
      school_ids:
        schoolParams?.schoolIds?.filter(
          (id) => String(id) !== String(uncheckId),
        ) ?? '',
    } as Record<string, string>).toString();
    const url = '/map/schools?' + newParams;
    router.history.replace(url);
    return url;
  },
});

// live layer effect
const sourceForInfo = combine({
  connectivityBenchMark: $connectivityBenchMark,
  connectivityBenchMarkByEntity: $connectivityBenchMarkByEntity,
  country: $country,
  interval: $historyInterval,
  intervalByEntity: $historyIntervalByEntity,
  layersUtils: $layerUtils,
  intervalUnit: $historyIntervalUnit,
  intervalUnitByEntity: $historyIntervalUnitByEntity,
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
});

export const getCurrentQueryId = ({
  countrySearch,
  interval,
  intervalByEntity,
  mapRoutes,
  schoolParams,
  lastSelectedLayers,
  intervalUnit,
  intervalUnitByEntity,
  layersUtils,
  connectivityBenchMark,
  connectivityBenchMarkByEntity,
  country,
  admin1Id,
  isSchoolClicked,
  allowDublicateSchoolIds,
  selectedLayerIdByEntity,
}: ReturnType<typeof sourceForInfo.getState> & {
  isSchoolClicked?: boolean;
}) => {
  const schoolIntervalUnit =
    intervalUnitByEntity[EntityType.SCHOOL] ?? intervalUnit;
  const schoolInterval = intervalByEntity[EntityType.SCHOOL] ?? interval;
  const isWeekly = schoolIntervalUnit === IntervalUnit.week;
  const defaultLayerId = lastSelectedLayers.layerId
    ? lastSelectedLayers.layerId
    : layersUtils.coverageLayerId;
  const selectedLayerId = getEntityMapValue(
    selectedLayerIdByEntity,
    EntityType.SCHOOL,
    defaultLayerId,
  );
  const isLive = isLiveLayer(
    layersUtils.layers.find((layer) => layer.id === selectedLayerId)?.type,
  );
  const startDate = format(schoolInterval.start, 'dd-MM-yyyy');
  const endDate = format(schoolInterval.end, 'dd-MM-yyyy');
  const params = new URLSearchParams();
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
      schoolKeys = schoolParams.schoolIds.join(',');
    }
    params.set('school_id__in', schoolKeys);
  }

  params.set('include_same_location_schools', String(allowDublicateSchoolIds));
  if (allowDublicateSchoolIds) {
    params.set(
      'limit_same_location_schools',
      String(MaxAllowedDublicateSchoolIds),
    );
  }

  let query = `?${params.toString()}`;
  if (mapRoutes.country && countrySearch) {
    query += `&${countrySearch}`;
  }
  return { query, id: selectedLayerId };
};

const getLayerIdForEntity = (
  entityType: EntityType,
  selectedLayerIdByEntity: Partial<Record<EntityType, number | null>>,
  defaultLayerId: number | null,
) => {
  return getEntityMapValue(selectedLayerIdByEntity, entityType, defaultLayerId);
};

export const getCurrentEntityLayerInfoQuery = ({
  activeEntityTypes,
  admin1Id,
  allowDublicateSchoolIds,
  connectivityBenchMark,
  connectivityBenchMarkByEntity,
  country,
  countrySearch,
  interval,
  intervalByEntity,
  intervalUnit,
  intervalUnitByEntity,
  lastSelectedLayers,
  layersUtils,
  selectedLayerIdByEntity,
}: ReturnType<typeof sourceForInfo.getState>) => {
  const defaultLayerId = lastSelectedLayers.layerId
    ? lastSelectedLayers.layerId
    : layersUtils.coverageLayerId;
  const params = new URLSearchParams();

  if (country?.id) {
    params.set('country_id', String(country.id));
  }
  if (admin1Id) {
    params.set('admin1_id', String(admin1Id));
  }

  const entityTypes = activeEntityTypes?.length
    ? activeEntityTypes
    : [EntityType.SCHOOL];
  entityTypes.forEach((entityType) => {
    const prefix = `${entityType}_`;
    const entityLayerId = getLayerIdForEntity(
      entityType,
      selectedLayerIdByEntity,
      defaultLayerId,
    );
    const isLive = isLiveLayer(
      layersUtils.layers.find((layer) => layer.id === entityLayerId)?.type,
    );

    if (isLive) {
      const entityInterval = getEntityMapValue(
        intervalByEntity,
        entityType,
        interval,
      );
      const entityIntervalUnit = getEntityMapValue(
        intervalUnitByEntity,
        entityType,
        intervalUnit,
      );
      const isWeekly = entityIntervalUnit === IntervalUnit.week;
      params.set(
        `${prefix}start_date`,
        format(entityInterval.start, 'dd-MM-yyyy'),
      );
      params.set(`${prefix}end_date`, format(entityInterval.end, 'dd-MM-yyyy'));
      params.set(`${prefix}is_weekly`, isWeekly.toString());
    }
    if (entityLayerId) {
      params.set(`${prefix}layer_id`, String(entityLayerId));
    }
    params.set(
      `${prefix}benchmark`,
      getEntityMapValue(
        connectivityBenchMarkByEntity,
        entityType,
        connectivityBenchMark,
      ),
    );
    params.set(
      `${prefix}include_same_location`,
      String(allowDublicateSchoolIds),
    );
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
  const entityTypes = activeEntityTypes?.length
    ? activeEntityTypes
    : [EntityType.SCHOOL];
  entityTypes.forEach((entityType) => {
    const layerId = getEntityMapValue(
      selectedLayerIdByEntity,
      entityType,
      null,
    );
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
  selectedLayerIdByEntity,
}: ReturnType<typeof sourceForInfo.getState>) => {
  const params = new URLSearchParams();
  const selectedLayerId = getEntityMapValue(
    selectedLayerIdByEntity,
    EntityType.SCHOOL,
    layersUtils.globalLayerId,
  );
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
  clock: merge([
    $countryId,
    $admin1Id,
    $getSchoolParams,
    $selectedLayerIdByEntity,
    $activeEntityTypes,
  ]),
  source: sourceForInfo,
  fn: getCurrentEntityConnectivityConfigQuery,
  filter: ({ country, layersUtils, mapRoutes }) => {
    return (
      mapRoutes.country &&
      !!country?.id &&
      !!layersUtils.layers?.length &&
      Object.values(layersUtils.currentLayerTypeUtilsByEntity).some(
        (layerTypeUtils) => layerTypeUtils?.isLive,
      )
    );
  },
  target: getEntitiesAvailableDates,
});

sample({
  clock: merge([
    $countryId,
    $admin1Id,
    $getSchoolParams,
    $selectedLayerIdByEntity,
  ]),
  source: sourceForInfo,
  fn: getCurrentSchoolConnectivityConfigQuery,
  filter: ({ country, layersUtils, mapRoutes }) => {
    return (
      mapRoutes.schools &&
      !!country?.id &&
      !!layersUtils.layers?.length &&
      !!layersUtils.currentLayerTypeUtils.isLive
    );
  },
  target: getSchoolAvailableDates,
});

// for all live layers;
sample({
  clock: merge([
    $countrySearchString,
    $country,
    $admin1Id,
    $selectedLayerIdByEntity,
    $activeEntityTypes,
    $connectivityBenchMarkByEntity,
    debounce($historyIntervalByEntity, { timeout: 500 }),
    $historyIntervalUnitByEntity,
  ]),
  source: sourceForInfo,
  fn: getCurrentEntityLayerInfoQuery,
  filter: ({
    mapRoutes,
    country,
    admin1Id,
    isCheckedLastDate,
    layersUtils,
  }: ReturnType<typeof sourceForInfo.getState>) => {
    return (
      mapRoutes.country &&
      (!!country?.id || !!admin1Id) &&
      !!isCheckedLastDate &&
      Object.values(layersUtils.currentLayerTypeUtilsByEntity).some(
        (layerTypeUtils) => layerTypeUtils?.isLive,
      )
    );
  },
  target: fetchEntitiesLayerInfoFx,
});

// for all static layers
sample({
  clock: merge([
    $countrySearchString,
    $countryId,
    $admin1Id,
    $connectivityBenchMarkByEntity,
    $selectedLayerIdByEntity,
    $activeEntityTypes,
  ]),
  source: sourceForInfo,
  fn: getCurrentEntityLayerInfoQuery,
  filter: ({
    mapRoutes,
    country,
    admin1Id,
    layersUtils,
  }: ReturnType<typeof sourceForInfo.getState>) => {
    return (
      mapRoutes.country &&
      (!!country?.id || !!admin1Id) &&
      Object.values(layersUtils.currentLayerTypeUtilsByEntity).some(
        (layerTypeUtils) => layerTypeUtils?.isStatic,
      )
    );
  },
  target: fetchEntitiesLayerInfoFx,
});

const schoolInfoFn = (
  props: ReturnType<typeof sourceForInfo.getState> & {
    isSchoolClicked?: boolean;
  },
) => {
  const { query, id } = getCurrentQueryId(props);
  const url = `api/accounts/layers/${id}/info/`;
  return {
    url,
    query,
  };
};
// school view info api
sample({
  clock: merge([
    mapSchools.visible,
    countryReceived,
    $isCheckedLastDate,
    $selectedLayerIdByEntity,
    $historyIntervalByEntity,
    mapSchools.router.historyUpdate,
    $connectivityBenchMarkByEntity,
  ]),
  source: sourceForInfo,
  fn: (props) => schoolInfoFn({ ...props, allowDublicateSchoolIds: true }),
  filter: ({
    mapRoutes,
    country,
    isCheckedLastDate,
  }: ReturnType<typeof sourceForInfo.getState>) => {
    return mapRoutes.schools && !!country && !!isCheckedLastDate;
  },
  target: fetchSchoolLayerInfoFx,
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
  target: fetchSchoolPopupDataFx,
});

// refetch open school popup data when user switches the live layer
sample({
  clock: merge([$selectedLayerIdByEntity, $activeEntityTypes]),
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
  target: fetchSchoolPopupDataFx,
});

// Fetch dublicate school data
sample({
  clock: setSchoolIdsOnPopupClickDot,
  source: sourceForInfo,
  filter: ({ isMobile }) => !isMobile,
  fn: (props, school) =>
    schoolInfoFn({
      ...props,
      isSchoolClicked: true,
      schoolParams: { schoolIds: school?.ids, country: null },
      allowDublicateSchoolIds: school?.allowDublicateSchoolIds ?? false,
    }),
  target: fetchDublicateSchoolPopupDataFx,
});

// refetch open duplicate-school popup data when user switches the live layer
sample({
  clock: $selectedLayerIdByEntity,
  source: combine({
    info: sourceForInfo,
    duplicateSchoolPopup: $activeDublicateSchoolsPopup,
  }),
  filter: ({ info, duplicateSchoolPopup }) =>
    !info.isMobile && !!duplicateSchoolPopup?.ids?.length,
  fn: ({ info, duplicateSchoolPopup }) =>
    schoolInfoFn({
      ...info,
      isSchoolClicked: true,
      schoolParams: { schoolIds: duplicateSchoolPopup?.ids, country: null },
      allowDublicateSchoolIds:
        duplicateSchoolPopup?.allowDublicateSchoolIds ?? false,
    }),
  target: fetchDublicateSchoolPopupDataFx,
});

// Fetch dublicate school data
sample({
  clock: setSchoolIdsOnPopupClickDot,
  source: sourceForInfo,
  filter: ({ isMobile }) => !isMobile,
  fn: (props, schoolIds) =>
    schoolInfoFn({
      ...props,
      isSchoolClicked: true,
      schoolParams: { schoolIds: schoolIds?.ids, country: null },
      allowDublicateSchoolIds: schoolIds?.allowDublicateSchoolIds ?? false,
    }),
  target: fetchDublicateSchoolPopupDataFx,
});

// update status layers when main layer changed
sample({
  clock: $selectedLayerIdByEntity,
  source: combine({
    statusLayerIdByEntity: $statusLayerIdByEntity,
    activeEntityTypes: $activeEntityTypes,
    layerUtils: $layerUtils,
    initialUrlParams: $initialUrlParams,
    isAppSettled: $isAppSettled,
    selectedLayerIdByEntity: $selectedLayerIdByEntity,
  }),
  fn: ({
    activeEntityTypes,
    statusLayerIdByEntity,
    selectedLayerIdByEntity,
    layerUtils,
    initialUrlParams,
    isAppSettled,
  }) => {
    return (
      activeEntityTypes.reduce(
        (acc, entityType) => {
          const isStatic =
            layerUtils.currentLayerTypeUtilsByEntity[entityType]?.isStatic;
          const statusLayerId = statusLayerIdByEntity[entityType] ?? null;
          let currentStatusLayer = statusLayerId;
          const selectedLayerId = selectedLayerIdByEntity[entityType] ?? null;

          //TODO: don't remove this below - fix once url params are fixed with entity layer implementation;
          // On first load, if URL has school status layer param, use it
          // if (!isAppSettled && (initialUrlParams.schoolStatusLayer || initialUrlParams.isSchoolStatusLayerNull)) {
          //   if (!isStatic) {
          //     return initialUrlParams.schoolStatusLayer;
          //   }
          // }

          if (!selectedLayerId && !statusLayerId) {
            currentStatusLayer = getEntityStatusId(entityType);
          }

          // clear status overlay (null) if the selected mai layer is static
          if (isStatic && currentStatusLayer) {
            currentStatusLayer = null;
          }

          acc[entityType] = currentStatusLayer;
          return acc;
        },
        {} as Partial<Record<EntityType, string | null>>,
      ) ?? {}
    );
  },
  target: onSelectEntityStatusLayer,
});

// set default layer on layers list load/change
const loadedLayersAndCountries = combine(
  $connectivityLayers,
  $countries,
  $currentDefaultLayerIdByEntity,
  (layers, countries, currentDefaultLayerIdByEntity) => {
    return (
      !!layers?.length &&
      !!countries?.length &&
      !!Object.keys(currentDefaultLayerIdByEntity).length
    );
  },
);

sample({
  clock: loadedLayersAndCountries,
  source: combine({
    layerUtils: $layerUtils,
    loadedLayersAndCountries,
    initialUrlParams: $initialUrlParams,
    isAppSettled: $isAppSettled,
  }),
  fn: ({ layerUtils: { currentDefaultLayerIdByEntity } }) => {
    // TODO: don't remove fix once url params are fixed with entity layer implementation;
    // If URL has layer param and it hasn't been applied yet, use it.
    // Otherwise use default layers.
    return currentDefaultLayerIdByEntity;
  },
  filter: ({ loadedLayersAndCountries: isLoaded }) => isLoaded,
  target: createEffect(() => { }), // temporary disabled
});

// On first country code update, preserve URL layer value if present
sample({
  clock: merge([$countryCode, loadedLayersAndCountries]),
  source: combine({
    activeEntityTypes: $activeEntityTypes,
    layerUtils: $layerUtils,
    countryCode: $countryCode,
    loadedLayersAndCountries,
    initialUrlParams: $initialUrlParams,
    isAppSettled: $isAppSettled,
  }),
  fn: ({
    layerUtils: {
      selectedLayerIdByEntity,
      currentLayerTypeUtilsByEntity,
      isActiveCurrentLayerByEntity,
      currentDefaultLayerIdByEntity,
    },
    activeEntityTypes,
  }) => {
    // TODO: don't remove fix once url params are fixed with entity layer implementation;
    // On first country code update, if URL has layer param, use it (if valid for country).
    const result = {} as Partial<Record<EntityType, number | null>>;
    activeEntityTypes.forEach((entityType) => {
      let nextLayerId = selectedLayerIdByEntity[entityType] ?? null;
      const currentLayerTypeUtils = currentLayerTypeUtilsByEntity[entityType];
      const isActiveCurrentLayer = isActiveCurrentLayerByEntity[entityType];
      const currentDefaultLayerId = currentDefaultLayerIdByEntity[entityType];
      if (
        (currentLayerTypeUtils?.isLive && !isActiveCurrentLayer) ||
        (currentLayerTypeUtils?.isStatic && !isActiveCurrentLayer)
      ) {
        nextLayerId = null;
      }
      if (currentLayerTypeUtils?.isLive && currentDefaultLayerId) {
        nextLayerId = currentDefaultLayerId;
      }
      result[entityType] = nextLayerId ?? currentDefaultLayerId ?? null;
    });
    return result;
  },
  filter: ({ countryCode, loadedLayersAndCountries }) => {
    return !!countryCode && loadedLayersAndCountries;
  },
  target: onSelectEntityMainLayer,
});

sample({
  clock: changeSelectedEntityType,
  source: combine({
    currentDefaultLayerIdByEntity: $currentDefaultLayerIdByEntity,
    selectedLayerIdByEntity: $selectedLayerIdByEntity,
  }),
  fn: (
    { currentDefaultLayerIdByEntity, selectedLayerIdByEntity },
    entityType,
  ) => {
    return Object.prototype.hasOwnProperty.call(
      selectedLayerIdByEntity,
      entityType,
    )
      ? selectedLayerIdByEntity
      : {
        ...selectedLayerIdByEntity,
        [entityType]: currentDefaultLayerIdByEntity[entityType] ?? null,
      };
  },
  target: $selectedLayerIdByEntity,
});

sample({
  clock: onSelectEntityMainLayer,
  filter: (selectedLayerIdByEntity) =>
    Object.keys(selectedLayerIdByEntity).length > 0,
  fn: (selectedLayerIdByEntity) =>
    Object.keys(selectedLayerIdByEntity)[0] as EntityType,
  target: changeSelectedEntityType,
});

sample({
  clock: $statusLayerIdByEntity,
  fn: (statusLayerIdByEntity) =>
    Object.values(statusLayerIdByEntity).some(Boolean),
  target: changeSchoolConnectedOpenStatus,
});

sample({
  clock: $isTimeplayer,
  target: $isSidebarCollapsed,
});

sample({
  clock: $isTimeplayer,
  filter: Boolean,
  target: onRecenterView,
});

const benchmarkSource = combine({
  connectivityBenchMark: $connectivityBenchMark,
  connectivityBenchMarkByEntity: $connectivityBenchMarkByEntity,
  countryDefaultNational: $countryDefaultNational,
  country: $country,
  currentLayerTypeUtils: $currentLayerTypeUtils,
  selectedEntityType: $selectedEntityType,
  selectedLayerIdByEntity: $selectedLayerIdByEntity,
});
const benchmarkFn =
  (isClockId: boolean) =>
    (
      {
        countryDefaultNational = {},
        selectedEntityType,
        selectedLayerIdByEntity,
        connectivityBenchMark,
        connectivityBenchMarkByEntity,
      }: ReturnType<typeof benchmarkSource.getState>,
      clockLayerId: unknown,
    ) => {
      let currentBenchmark = getEntityMapValue(
        connectivityBenchMarkByEntity,
        selectedEntityType,
        connectivityBenchMark,
      );
      const layerId =
        isClockId && typeof clockLayerId === 'number'
          ? clockLayerId
          : getEntityMapValue(selectedLayerIdByEntity, selectedEntityType, null);
      if (countryDefaultNational && countryDefaultNational[layerId ?? '']) {
        currentBenchmark = ConnectivityBenchMarks.national;
      } else {
        currentBenchmark = ConnectivityBenchMarks.global;
      }
      return currentBenchmark;
    };
const entityBenchmarkFn = (
  {
    countryDefaultNational = {},
    connectivityBenchMark,
    connectivityBenchMarkByEntity,
  }: ReturnType<typeof benchmarkSource.getState>,
  { entityType, layerId }: { entityType: EntityType; layerId: number },
) => {
  let currentBenchmark = getEntityMapValue(
    connectivityBenchMarkByEntity,
    entityType,
    connectivityBenchMark,
  );
  if (countryDefaultNational && countryDefaultNational[layerId ?? '']) {
    currentBenchmark = ConnectivityBenchMarks.national;
  } else {
    currentBenchmark = ConnectivityBenchMarks.global;
  }
  return { entityType, benchmark: currentBenchmark };
};

// default national for a country and layer
sample({
  clock: merge([$country, $layersList]),
  source: benchmarkSource,
  fn: benchmarkFn(false),
  filter: ({ country }) => !!country,
  target: changeConnectivityBenchmark,
});
// for static layer
sample({
  clock: checkConnectivityBenchmark,
  source: benchmarkSource,
  fn: benchmarkFn(true),
  filter: ({ country }) => !!country,
  target: changeConnectivityBenchmark,
});
sample({
  clock: checkEntityConnectivityBenchmark,
  source: benchmarkSource,
  fn: entityBenchmarkFn,
  filter: ({ country }) => !!country,
  target: changeEntityConnectivityBenchmark,
});

sample({
  source: combine($schoolAdminId, $schoolStats),
  fn: ([schoolAdminId, schoolStats]) => {
    if (schoolAdminId && (schoolStats?.length ?? 0) > 1) {
      return schoolAdminId;
    }
    return null;
  },
  target: $countryAdminSchoolId,
});

sample({
  clock: merge([$layersListMapping, languageStore.$language]),
  source: { mapping: $layersListMapping, lng: languageStore.$language },
  filter: ({ mapping, lng }) => {
    return !!mapping?.length && !!lng;
  },
  target: publishLayersTranslationFx,
});

// reset legends on country change
sample({
  clock: merge([$countryCode]),
  source: $isAppSettled,
  filter: (isAppSettled) => isAppSettled,
  target: [resetFilterModal, resetCoverageFilterSelection],
});
// Initialize URL params on app start
// This applies URL params to stores (connectivity speed, coverage filters, etc.)
initializeFromUrlParams();
