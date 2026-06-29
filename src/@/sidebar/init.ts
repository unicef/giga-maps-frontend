import { format } from 'date-fns';
import { combine, merge, sample } from 'effector';

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
import {
  EntityType,
  getEntityMapValue,
  getLayerEntityTypes,
} from '~/@/entities';
import {
  $activeEntityTypes,
  $entityTypesFiltered,
  $selectedEntityType,
  changeSelectedEntityType,
} from '~/@/entities/models/entity.model';
import {
  ENTITY_TYPE_CODE_PARAM,
  getEntityTypeCodeParam,
} from '~/@/entities/utils/entity-query-params';
import {
  $activeDublicateSchoolsPopup,
  $activeSchoolPopup,
  $allowDublicateSchoolIds,
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
import { $mapRoutes, mapEntity, mapSchools, router } from '~/core/routes';
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
  $lastAvailableDatesByEntity,
} from './history-graph.model';
import { ConnectivityBenchMarks } from './sidebar.constant';
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
  source: combine({
    mapRoutes: $mapRoutes,
    schoolParams: $getSchoolParams,
  }),
  fn: ({ mapRoutes, schoolParams }, uncheckId) => {
    const entityType = schoolParams.entityType ?? EntityType.SCHOOL;
    const nextIds = schoolParams?.schoolIds?.filter(
      (id) => String(id) !== String(uncheckId),
    ) ?? [];
    const newParams = new URLSearchParams({
      country: schoolParams.country ?? '',
      [mapRoutes.entity ? `${entityType}_ids` : 'school_ids']: nextIds.join(','),
    } as Record<string, string>).toString();
    const url = `${mapRoutes.entity ? '/map/entity/' : '/map/schools'}?${newParams}`;
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
  lastAvailableDatesByEntity: $lastAvailableDatesByEntity,
  connectivityConfigPending: getEntitiesAvailableDates.pending,
  mapRoutes: $mapRoutes,
  schoolParams: $getSchoolParams,
  lastSelectedLayers: $selectedGigaLayers,
  isCheckedLastDate: $isCheckedLastDate,
  countrySearch: $countrySearchString,
  isMobile: $isMobile,
  allowDublicateSchoolIds: $allowDublicateSchoolIds,
  activeEntityTypes: $activeEntityTypes,
  entityTypesFiltered: $entityTypesFiltered,
  selectedLayerIdByEntity: $selectedLayerIdByEntity,
});

export const getCurrentQueryId = ({
  countrySearch,
  interval,
  intervalByEntity,
  mapRoutes,
  schoolParams,
  intervalUnit,
  intervalUnitByEntity,
  layersUtils,
  connectivityBenchMark,
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
  const selectedLayerId = getSelectedInfoLayerId(
    EntityType.SCHOOL,
    selectedLayerIdByEntity,
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
const getInfoEntityTypes = ({
  activeEntityTypes,
  entityTypesFiltered,
}: Pick<
  ReturnType<typeof sourceForInfo.getState>,
  'activeEntityTypes' | 'entityTypesFiltered'
>) => (activeEntityTypes?.length ? activeEntityTypes : entityTypesFiltered);

const getSelectedInfoLayerId = (
  entityType: EntityType,
  selectedLayerIdByEntity: Partial<Record<EntityType, number | null>>,
) => getLayerIdForEntity(entityType, selectedLayerIdByEntity, null);

const getInfoEntityTypesWithSelectedLayer = ({
  activeEntityTypes,
  entityTypesFiltered,
  selectedLayerIdByEntity,
}: Pick<
  ReturnType<typeof sourceForInfo.getState>,
  'activeEntityTypes' | 'entityTypesFiltered' | 'selectedLayerIdByEntity'
>) =>
  getInfoEntityTypes({ activeEntityTypes, entityTypesFiltered }).filter(
    (entityType) =>
      Boolean(getSelectedInfoLayerId(entityType, selectedLayerIdByEntity)),
  );

const hasSelectedInfoLayer = (
  props: ReturnType<typeof sourceForInfo.getState>,
  entityType: EntityType,
) => Boolean(getSelectedInfoLayerId(entityType, props.selectedLayerIdByEntity));

const hasSelectedInfoLayerType = (
  props: ReturnType<typeof sourceForInfo.getState>,
  checkLayerType: (layerTypeUtils: {
    isLive?: boolean;
    isStatic?: boolean;
  }) => boolean,
) =>
  getInfoEntityTypesWithSelectedLayer(props).some((entityType) =>
    checkLayerType(
      props.layersUtils.currentLayerTypeUtilsByEntity[entityType] ?? {},
    ),
  );

const getSelectedInfoEntityTypesByLayerType = (
  props: ReturnType<typeof sourceForInfo.getState>,
  checkLayerType: (layerTypeUtils: {
    isLive?: boolean;
    isStatic?: boolean;
  }) => boolean,
) =>
  getInfoEntityTypesWithSelectedLayer(props).filter((entityType) =>
    checkLayerType(
      props.layersUtils.currentLayerTypeUtilsByEntity[entityType] ?? {},
    ),
  );

const getSelectedLiveInfoEntityTypes = (
  props: ReturnType<typeof sourceForInfo.getState>,
) =>
  getSelectedInfoEntityTypesByLayerType(
    props,
    (layerTypeUtils) => !!layerTypeUtils.isLive,
  );

const getSelectedStaticInfoEntityTypes = (
  props: ReturnType<typeof sourceForInfo.getState>,
) =>
  getSelectedInfoEntityTypesByLayerType(
    props,
    (layerTypeUtils) => !!layerTypeUtils.isStatic,
  );

const areSelectedLiveInfoDatesReady = (
  props: ReturnType<typeof sourceForInfo.getState>,
) => {
  const liveEntityTypes = getSelectedLiveInfoEntityTypes(props);
  return (
    !!liveEntityTypes.length &&
    liveEntityTypes.every(
      (entityType) => !!props.lastAvailableDatesByEntity[entityType],
    )
  );
};

const hasCountryInfoScope = ({
  mapRoutes,
  country,
  admin1Id,
}: ReturnType<typeof sourceForInfo.getState>) =>
  mapRoutes.country && (!!country?.id || !!admin1Id);
type InitialUrlParams = ReturnType<typeof $initialUrlParams.getState>;
type InitialEntityValue<T> = { hasValue: boolean; value: T | null };

const hasOwnEntityValue = <T>(
  values: Partial<Record<EntityType, T>>,
  entityType: EntityType,
) => Object.prototype.hasOwnProperty.call(values, entityType);

const getInitialLayerIdForEntity = (
  initialUrlParams: InitialUrlParams,
  entityType: EntityType,
  layers: ReturnType<typeof $layerUtils.getState>['layers'],
  activeEntityTypes: EntityType[],
): InitialEntityValue<number> => {
  if (hasOwnEntityValue(initialUrlParams.layerIdByEntity, entityType)) {
    return {
      hasValue: true,
      value: initialUrlParams.layerIdByEntity[entityType] ?? null,
    };
  }

  const layerId = initialUrlParams.layerIds.find((candidate) => {
    if (candidate === null) return false;
    const layer = layers.find((item) => item.id === candidate);
    return (
      !!layer &&
      getLayerEntityTypes(layer, activeEntityTypes).includes(entityType)
    );
  });

  return layerId === undefined
    ? { hasValue: false, value: null }
    : { hasValue: true, value: layerId };
};

const getInitialStatusLayerForEntity = (
  initialUrlParams: InitialUrlParams,
  entityType: EntityType,
): InitialEntityValue<string> => {
  if (
    hasOwnEntityValue(initialUrlParams.entityStatusLayerByEntity, entityType)
  ) {
    return {
      hasValue: true,
      value: initialUrlParams.entityStatusLayerByEntity[entityType] ?? null,
    };
  }

  const statusLayerId = initialUrlParams.entityStatusLayerIds.find(
    (candidate) => candidate?.startsWith(`${entityType}_`),
  );

  return statusLayerId === undefined
    ? { hasValue: false, value: null }
    : { hasValue: true, value: statusLayerId };
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
  layersUtils,
  entityTypesFiltered,
  selectedLayerIdByEntity,
}: ReturnType<typeof sourceForInfo.getState>) => {
  const params = new URLSearchParams();

  if (country?.id) {
    params.set('country_id', String(country.id));
  }
  if (admin1Id) {
    params.set('admin1_id', String(admin1Id));
  }

  const entityTypes = getInfoEntityTypesWithSelectedLayer({
    activeEntityTypes,
    entityTypesFiltered,
    selectedLayerIdByEntity,
  });
  if (!entityTypes.length) return { query: '' };
  params.set(
    ENTITY_TYPE_CODE_PARAM,
    getEntityTypeCodeParam(entityTypes, entityTypesFiltered),
  );
  entityTypes.forEach((entityType) => {
    const prefix = `${entityType}_`;
    const entityLayerId = getSelectedInfoLayerId(
      entityType,
      selectedLayerIdByEntity,
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
    params.set(`${prefix}layer_id`, String(entityLayerId));
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
  entityTypesFiltered,
  admin1Id,
  layersUtils,
  mapRoutes,
  schoolParams,
  selectedLayerIdByEntity,
}: ReturnType<typeof sourceForInfo.getState>) => {
  const params = new URLSearchParams();
  if (country?.id) {
    params.set('country_id', String(country.id));
  }
  if (admin1Id) {
    params.set('admin1_id', String(admin1Id));
  }
  const entityTypes = mapRoutes.entity && schoolParams.entityType
    ? [schoolParams.entityType]
    : activeEntityTypes?.length
      ? activeEntityTypes
      : entityTypesFiltered;
  params.set(
    ENTITY_TYPE_CODE_PARAM,
    getEntityTypeCodeParam(entityTypes, entityTypesFiltered),
  );
  entityTypes.forEach((entityType) => {
    const layerId = getEntityMapValue(
      selectedLayerIdByEntity,
      entityType,
      null,
    );
    const isStaticLayer =
      layersUtils.currentLayerTypeUtilsByEntity[entityType]?.isStatic;
    if (layerId && !isStaticLayer) {
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
    $entityTypesFiltered,
  ]),
  source: sourceForInfo,
  fn: getCurrentEntityConnectivityConfigQuery,
  filter: (props) => {
    const {
      activeEntityTypes,
      country,
      entityTypesFiltered,
      layersUtils,
      mapRoutes,
      schoolParams,
    } = props;
    const entityTypes = mapRoutes.entity && schoolParams.entityType
      ? [schoolParams.entityType]
      : activeEntityTypes?.length
        ? activeEntityTypes
        : entityTypesFiltered;
    return (
      (mapRoutes.country || mapRoutes.entity) &&
      !!country?.id &&
      !!layersUtils.layers?.length &&
      hasSelectedInfoLayerType(
        props,
        (layerTypeUtils) => !!layerTypeUtils.isLive,
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

// for country layers that include at least one selected live layer;
// wait until connectivity configs have resolved the available dates.
sample({
  clock: merge([
    $countrySearchString,
    $selectedLayerIdByEntity,
    $activeEntityTypes,
    $entityTypesFiltered,
    $connectivityBenchMarkByEntity,
    debounce($historyIntervalByEntity, { timeout: 500 }),
    $historyIntervalUnitByEntity,
  ]),
  source: sourceForInfo,
  fn: getCurrentEntityLayerInfoQuery,
  filter: (props: ReturnType<typeof sourceForInfo.getState>) => {
    return (
      hasCountryInfoScope(props) &&
      !props.connectivityConfigPending &&
      areSelectedLiveInfoDatesReady(props)
    );
  },
  target: fetchEntitiesLayerInfoFx,
});

// for country layers where every selected layer is static;
// static layers do not need dates from connectivity configs.
sample({
  clock: merge([
    $countrySearchString,
    $countryId,
    $admin1Id,
    $connectivityBenchMarkByEntity,
    $selectedLayerIdByEntity,
    $activeEntityTypes,
    $entityTypesFiltered,
  ]),
  source: sourceForInfo,
  fn: getCurrentEntityLayerInfoQuery,
  filter: (props: ReturnType<typeof sourceForInfo.getState>) => {
    return (
      hasCountryInfoScope(props) &&
      !!getSelectedStaticInfoEntityTypes(props).length &&
      !getSelectedLiveInfoEntityTypes(props).length
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
const entityPopupInfoFn = (
  props: ReturnType<typeof sourceForInfo.getState>,
  {
    allowDublicateSchoolIds,
    entityIds,
    entityType,
  }: {
    allowDublicateSchoolIds?: boolean;
    entityIds: number[];
    entityType: EntityType;
  },
) => {
  const {
    admin1Id,
    connectivityBenchMark,
    connectivityBenchMarkByEntity,
    country,
    countrySearch,
    interval,
    intervalByEntity,
    intervalUnit,
    intervalUnitByEntity,
    layersUtils,
    selectedLayerIdByEntity,
  } = props;
  const selectedLayerId = getSelectedInfoLayerId(
    entityType,
    selectedLayerIdByEntity,
  );
  const isLive = isLiveLayer(
    layersUtils.layers.find((layer) => layer.id === selectedLayerId)?.type,
  );
  const prefix = `${entityType}_`;
  const params = new URLSearchParams();

  params.set(ENTITY_TYPE_CODE_PARAM, entityType);
  params.set(`${prefix}entity_id__in`, entityIds.join(','));

  if (country?.id) {
    params.set('country_id', String(country.id));
  }
  if (admin1Id) {
    params.set('admin1_id', String(admin1Id));
  }
  params.set(`${prefix}layer_id`, String(selectedLayerId));
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
    String(allowDublicateSchoolIds ?? false),
  );
  if (allowDublicateSchoolIds) {
    params.set(
      `${prefix}limit_same_location`,
      String(MaxAllowedDublicateSchoolIds),
    );
  }

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
    params.set(
      `${prefix}start_date`,
      format(entityInterval.start, 'dd-MM-yyyy'),
    );
    params.set(`${prefix}end_date`, format(entityInterval.end, 'dd-MM-yyyy'));
    params.set(
      `${prefix}is_weekly`,
      String(entityIntervalUnit === IntervalUnit.week),
    );
  }

  let query = `?${params.toString()}`;
  if (countrySearch) {
    query += `&${countrySearch}`;
  }
  return {
    entityType,
    query,
    url: 'api/v2/entities/layers/info/',
  };
};
// entity detail route selects the entity encoded in the *_ids URL param.
sample({
  clock: merge([
    mapEntity.visible,
    mapEntity.router.historyUpdate,
    $getSchoolParams,
  ]),
  source: combine({
    mapRoutes: $mapRoutes,
    schoolParams: $getSchoolParams,
  }),
  filter: ({ mapRoutes, schoolParams }) =>
    mapRoutes.entity && !!schoolParams.entityType,
  fn: ({ schoolParams }) => schoolParams.entityType!,
  target: changeSelectedEntityType,
});
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
  filter: (props: ReturnType<typeof sourceForInfo.getState>) => {
    const { mapRoutes, country, isCheckedLastDate } = props;
    return (
      mapRoutes.schools &&
      !!country &&
      !!isCheckedLastDate &&
      hasSelectedInfoLayer(props, EntityType.SCHOOL)
    );
  },
  target: fetchSchoolLayerInfoFx,
});

// entity detail view info api
sample({
  clock: merge([
    mapEntity.visible,
    mapEntity.router.search,
    $getSchoolParams,
    countryReceived,
    $countryId,
    $isCheckedLastDate,
    $selectedLayerIdByEntity,
    $historyIntervalByEntity,
    mapEntity.router.historyUpdate,
    $connectivityBenchMarkByEntity,
  ]),
  source: sourceForInfo,
  fn: (props) =>
    entityPopupInfoFn(props, {
      entityIds: props.schoolParams.schoolIds ?? [],
      entityType: props.schoolParams.entityType!,
      allowDublicateSchoolIds: true,
    }),
  filter: (props: ReturnType<typeof sourceForInfo.getState>) => {
    const { mapRoutes, country, isCheckedLastDate, schoolParams } = props;
    return (
      mapRoutes.entity &&
      !!country &&
      !!isCheckedLastDate &&
      !!schoolParams.entityType &&
      !!schoolParams.schoolIds?.length &&
      hasSelectedInfoLayer(props, schoolParams.entityType)
    );
  },
  target: fetchSchoolLayerInfoFx,
});

// fetch clicked entity dot data
sample({
  clock: $activeSchoolPopup,
  source: combine({
    info: sourceForInfo,
  }),
  filter: ({ info }, activePopup) =>
    !info.isMobile &&
    !!activePopup?.id &&
    !!activePopup.entityType &&
    hasSelectedInfoLayer(info, activePopup.entityType),
  fn: ({ info }, activePopup) =>
    entityPopupInfoFn(info, {
      entityIds: [Number(activePopup?.id)],
      entityType: activePopup!.entityType,
      allowDublicateSchoolIds: activePopup?.allowDublicateSchoolIds ?? false,
    }),
  target: fetchSchoolPopupDataFx,
});

// refetch open entity popup data when user switches the live layer
sample({
  clock: merge([$selectedLayerIdByEntity, $activeEntityTypes]),
  source: combine({
    info: sourceForInfo,
    activePopup: $activeSchoolPopup,
  }),
  filter: ({ info, activePopup }) =>
    !info.isMobile &&
    !!activePopup?.id &&
    !!activePopup.entityType &&
    hasSelectedInfoLayer(info, activePopup.entityType),
  fn: ({ info, activePopup }) =>
    entityPopupInfoFn(info, {
      entityIds: [Number(activePopup?.id)],
      entityType: activePopup!.entityType,
      allowDublicateSchoolIds: activePopup?.allowDublicateSchoolIds ?? false,
    }),
  target: fetchSchoolPopupDataFx,
});

// Fetch duplicate entity data
sample({
  clock: setSchoolIdsOnPopupClickDot,
  source: combine({
    info: sourceForInfo,
    activePopup: $activeSchoolPopup,
  }),
  filter: ({ info, activePopup }, entityIds) => {
    const entityType = entityIds?.entityType ?? activePopup?.entityType;
    return (
      !info.isMobile &&
      !!entityIds?.ids?.length &&
      !!entityType &&
      hasSelectedInfoLayer(info, entityType)
    );
  },
  fn: ({ info, activePopup }, entityIds) =>
    entityPopupInfoFn(info, {
      entityIds: entityIds?.ids ?? [],
      entityType: (entityIds?.entityType ?? activePopup?.entityType)!,
      allowDublicateSchoolIds: entityIds?.allowDublicateSchoolIds ?? false,
    }),
  target: fetchDublicateSchoolPopupDataFx,
});

// refetch open duplicate-entity popup data when user switches the live layer
sample({
  clock: $selectedLayerIdByEntity,
  source: combine({
    info: sourceForInfo,
    activePopup: $activeSchoolPopup,
    duplicateSchoolPopup: $activeDublicateSchoolsPopup,
  }),
  filter: ({ info, activePopup, duplicateSchoolPopup }) => {
    const entityType =
      duplicateSchoolPopup?.entityType ?? activePopup?.entityType;
    return (
      !info.isMobile &&
      !!duplicateSchoolPopup?.ids?.length &&
      !!entityType &&
      hasSelectedInfoLayer(info, entityType)
    );
  },
  fn: ({ info, activePopup, duplicateSchoolPopup }) =>
    entityPopupInfoFn(info, {
      entityIds: duplicateSchoolPopup?.ids ?? [],
      entityType: (duplicateSchoolPopup?.entityType ??
        activePopup?.entityType)!,
      allowDublicateSchoolIds:
        duplicateSchoolPopup?.allowDublicateSchoolIds ?? false,
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

          const initialStatusLayer = getInitialStatusLayerForEntity(
            initialUrlParams,
            entityType,
          );
          if (!isAppSettled && initialStatusLayer.hasValue) {
            currentStatusLayer = isStatic ? null : initialStatusLayer.value;
            acc[entityType] = currentStatusLayer;
            return acc;
          }

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
      layers,
    },
    activeEntityTypes,
    initialUrlParams,
    isAppSettled,
  }) => {
    // TODO: don't remove fix once url params are fixed with entity layer implementation;
    // On first country code update, if URL has layer param, use it (if valid for country).
    const result = {} as Partial<Record<EntityType, number | null>>;
    activeEntityTypes.forEach((entityType) => {
      let nextLayerId = selectedLayerIdByEntity[entityType] ?? null;
      const currentLayerTypeUtils = currentLayerTypeUtilsByEntity[entityType];
      const isActiveCurrentLayer = isActiveCurrentLayerByEntity[entityType];
      const currentDefaultLayerId = currentDefaultLayerIdByEntity[entityType];
      const initialLayerId = getInitialLayerIdForEntity(
        initialUrlParams,
        entityType,
        layers,
        activeEntityTypes,
      );
      if (!isAppSettled && initialLayerId.hasValue) {
        result[entityType] = initialLayerId.value;
        return;
      }
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
