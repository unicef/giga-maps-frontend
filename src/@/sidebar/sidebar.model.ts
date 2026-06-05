import { combine, createEvent, createStore, restore, sample } from 'effector';
import i18next from 'i18next';

import {
  $admin1Code,
  $country,
  $countryActiveLayersDataById,
  $countryBenchmark,
  $countryCode,
  $countryConnectivityNames,
  $countryIdToCode,
  $countrySearchString,
} from '~/@/country/country.model';
import {
  EntityType,
  getEntityMapValue,
  getLayerEntityTypes,
} from '~/@/entities';
import {
  $activeEntityTypes,
  $selectedEntityType,
  changeSelectedEntityType,
} from '~/@/entities/models/entity.model';
import { $stylePaintData } from '~/@/map/map.model';
import {
  fetchConnectivityLayerFx,
  fetchCountriesFx,
  fetchCountryFx,
  fetchCountryLiveLayerInfo,
  fetchCountryStaticLayerInfo,
  fetchEntitiesConnectivityStatsFx,
  fetchEntitiesLayerInfoFx,
  fetchEntityGlobalStatsFx,
  fetchLayerInfoFx,
  fetchLayerListFx,
  fetchSchoolLayerInfoFx,
} from '~/api/project-connect';
import {
  ConnectivityStat,
  CountryBasic,
  EntitiesConnectivityStatsResponse,
  EntitiesLayerInfoResponse,
  SchoolStatsType,
} from '~/api/types';
import { $lng } from '~/core/i18n/store';
import { mapOverview, mapSchools, router } from '~/core/routes';
import { setPayload, setPayloadResults } from '~/lib/effector-kit';
import { evaluateExpression } from '~/lib/utils';
import {
  extractDataWithMapping,
  reconstructJson,
} from '~/lib/utils/json-mapper.util';

import { UNKNOWN } from '../map/map.types';
import { onChangeTourStartPopup } from '../product-tour/models/product-tour.model';
import { publishLayersTranslationFx } from './effects/all-translation-fx';
import {
  getEntitiesAvailableDates,
  getSchoolAvailableDates,
} from './effects/search-country-fx';
import {
  ConnectivityBenchMarks,
  ConnectivityDistribution,
  ConnectivityStatusDistribution,
  getDefaultFormula,
  Layers,
  multiSchoolSelection,
  publishLayersListMapping,
  SCHOOL_STATUS_LAYER,
} from './sidebar.constant';
import { isLiveLayer, isStaticLayer } from './sidebar.util';
import {
  ConnectivityConfig,
  CoverageStat,
  LayerType,
  LayerTypeChoices,
  MultischoolSelectionStats,
  SelectedSchool,
} from './types';
import {
  ConnectivityDistributionNames,
  getConnectivityLogicalValues,
  LayerDistributionUnit,
} from './ui/global-and-country-view-components/container/layer-view.constant';

type EntityStoreMap<T> = Partial<Record<EntityType, T>>;

const defaultEntityStatusLayerSelection = {
  [EntityType.SCHOOL]: SCHOOL_STATUS_LAYER.id,
  [EntityType.HEALTH]: SCHOOL_STATUS_LAYER.id,
} as EntityStoreMap<number | null>;

const defaultStatusLegendsSelection = [
  ConnectivityStatusDistribution.connected,
  ConnectivityStatusDistribution.notConnected,
  ConnectivityStatusDistribution.unknown,
];

const getEntityValue = getEntityMapValue;

const getSelectedEntityLayerId = (
  selectedLayerIdByEntity: EntityStoreMap<number | null>,
  entityType: EntityType,
  fallbackLayerId: number | null,
) => {
  return getEntityValue(selectedLayerIdByEntity, entityType, fallbackLayerId);
};

export const onClickSidebar = createEvent();
export const toggleSidebar = createEvent();

export const resetFilterModal = createEvent();

export const $isSidebarCollapsed = createStore(false);
export const $countriesList = createStore<CountryBasic[]>([]);
export const $countriesPending = fetchCountriesFx.pending;

export const changeConnectivityIndicator = createEvent<Layers>();

export const changeConnectivityBenchmark =
  createEvent<ConnectivityBenchMarks>();
export const $connectivityBenchMark = restore(
  changeConnectivityBenchmark,
  ConnectivityBenchMarks.global,
);

export const $isMapTab = createStore(true);

export const $connectivityStatsByEntity =
  createStore<EntitiesConnectivityStatsResponse>({});
$connectivityStatsByEntity.on(
  fetchEntitiesConnectivityStatsFx.doneData,
  setPayload,
);
export const $countryLayerInfoByEntity = createStore<EntitiesLayerInfoResponse>(
  {},
);
$countryLayerInfoByEntity.on(fetchEntitiesLayerInfoFx.doneData, setPayload);

const toEntityConnectivityStat = (
  stat: Record<string, any> | null | undefined,
) => {
  if (!stat) return null;

  return {
    benchmark_metadata: stat.benchmark_metadata,
    countries_with_realtime_data: stat.countries_with_realtime_data ?? 0,
    entity_with_realtime_data:
      stat.entity_with_realtime_data ?? stat.school_with_realtime_data ?? 0,
    graph_data: stat.graph_data ?? [],
    is_data_synced: stat.is_data_synced ?? false,
    live_avg: stat.live_avg ?? 0,
    live_avg_connectivity: stat.live_avg_connectivity,
    no_of_entities_measure:
      stat.no_of_entities_measure ?? stat.no_of_schools_measure ?? 0,
    real_time_connected_entities:
      stat.real_time_connected_entities ??
      stat.real_time_connected_schools ??
      {},
  };
};

const hasConnectivityLayerInfo = (
  stat: Record<string, any> | null | undefined,
) => {
  return (
    !!stat &&
    [
      'live_avg',
      'no_of_entities_measure',
      'no_of_schools_measure',
      'real_time_connected_entities',
      'real_time_connected_schools',
    ].some((key) => key in stat)
  );
};

$connectivityStatsByEntity.on(
  fetchEntitiesLayerInfoFx.doneData,
  (state, payload) => {
    if (!Object.values(payload ?? {}).some(hasConnectivityLayerInfo))
      return state;

    return Object.entries(payload ?? {}).reduce((acc, [entityType, stat]) => {
      const nextStat = toEntityConnectivityStat(stat);
      if (nextStat) {
        acc[entityType as keyof EntitiesConnectivityStatsResponse] = nextStat;
      }
      return acc;
    }, {} as EntitiesConnectivityStatsResponse);
  },
);

export const $connectivityStats = createStore<ConnectivityStat | null>(null);
$connectivityStats.on(fetchConnectivityLayerFx.doneData, setPayload);
$connectivityStats.on(fetchCountryLiveLayerInfo.doneData, setPayload);

const toConnectivityStat = (
  stat: Record<string, any> | null | undefined,
): ConnectivityStat | null => {
  if (!stat) return null;

  return {
    benchmark_metadata: stat.benchmark_metadata,
    countries_with_realtime_data: stat.countries_with_realtime_data ?? 0,
    graph_data: stat.graph_data ?? [],
    is_data_synced: stat.is_data_synced ?? false,
    live_avg: stat.live_avg ?? 0,
    live_avg_connectivity: stat.live_avg_connectivity ?? UNKNOWN,
    no_of_schools_measure:
      stat.no_of_schools_measure ?? stat.no_of_entities_measure ?? 0,
    real_time_connected_schools:
      stat.real_time_connected_schools ??
      stat.real_time_connected_entities ??
      {},
    school_with_realtime_data:
      stat.school_with_realtime_data ?? stat.entity_with_realtime_data ?? 0,
  };
};

$connectivityStats.on(fetchEntitiesLayerInfoFx.doneData, (state, payload) => {
  const stat = payload?.[$selectedEntityType.getState()];
  return hasConnectivityLayerInfo(stat) ? toConnectivityStat(stat) : state;
});
$connectivityStats.on(changeSelectedEntityType, (_, entityType) => {
  return toConnectivityStat($countryLayerInfoByEntity.getState()?.[entityType]);
});

export const $coverageStats = createStore<CoverageStat | null>(null);
$coverageStats.on(fetchCountryStaticLayerInfo.doneData, setPayload);

export const $coverageStatsByEntity = createStore<
  Partial<Record<EntityType, CoverageStat>>
>({});

const toCoverageStat = (
  stat: Record<string, any> | null | undefined,
): CoverageStat | null => {
  if (!stat) return null;

  return {
    connected_schools: stat.connected_schools ?? stat.connected_entities ?? {},
    total_schools: stat.total_schools ?? stat.total_entities ?? 0,
  };
};

const hasCoverageLayerInfo = (stat: Record<string, any> | null | undefined) => {
  return (
    !!stat &&
    [
      'connected_schools',
      'connected_entities',
      'total_schools',
      'total_entities',
    ].some((key) => key in stat)
  );
};

$coverageStatsByEntity.on(
  fetchEntitiesLayerInfoFx.doneData,
  (state, payload) => {
    if (!Object.values(payload ?? {}).some(hasCoverageLayerInfo)) return state;

    return Object.entries(payload ?? {}).reduce(
      (acc, [entityType, stat]) => {
        const nextStat = toCoverageStat(stat);
        if (nextStat) {
          acc[entityType as EntityType] = nextStat;
        }
        return acc;
      },
      {} as Partial<Record<EntityType, CoverageStat>>,
    );
  },
);
$coverageStats.on(fetchEntitiesLayerInfoFx.doneData, (state, payload) => {
  const stat = payload?.[$selectedEntityType.getState()];
  return hasCoverageLayerInfo(stat) ? toCoverageStat(stat) : state;
});
$coverageStats.on(changeSelectedEntityType, (_, entityType) => {
  return toCoverageStat($coverageStatsByEntity.getState()?.[entityType]);
});

export const onChangeMenu = createEvent<boolean>();
export const $isMenuOpen = createStore(false);
$isMenuOpen.on(onChangeMenu, setPayload);

export const changeConnectivitySpeedGood = createEvent<boolean>();
export const $connectivitySpeedGood = createStore(true);
$connectivitySpeedGood.on(changeConnectivitySpeedGood, setPayload);

export const changeConnectivitySpeedModerate = createEvent<boolean>();
export const $connectivitySpeedModerate = createStore(true);
$connectivitySpeedModerate.on(changeConnectivitySpeedModerate, setPayload);

export const changeConnectivitySpeednoInternet = createEvent<boolean>();
export const $connectivitySpeednoInternet = createStore(true);
$connectivitySpeednoInternet.on(changeConnectivitySpeednoInternet, setPayload);

export const changeConnectivitySpeedUnknown = createEvent<boolean>();
export const $connectivitySpeedUnknown = createStore(true);
$connectivitySpeedUnknown.on(changeConnectivitySpeedUnknown, setPayload);

// layer model
export const $layersList = createStore<LayerType[]>([]);
$layersList.on(fetchLayerListFx.doneData, setPayloadResults);
$layersList.on(publishLayersTranslationFx.doneData, (state, payload) => {
  const { data } = payload as { data: Record<string, string> };
  const list = reconstructJson(data, { layersList: state })
    .layersList as LayerType[];
  return list.map((item) => ({
    ...item,
    legend_configs: { ...item.legend_configs },
  }));
});
export const $layersListMapping = createStore<[string, string][]>([]);
$layersListMapping.on(fetchLayerListFx.doneData, (_, payload) => {
  if (!payload?.results) return [];
  const list = Object.entries(
    extractDataWithMapping(
      { layersList: payload.results },
      publishLayersListMapping,
    ),
  ).filter(([_key, value]) => !!value);
  return list;
});

export const $layerListTranslated = createStore<LayerType[]>([]);

export const $connectivityLayers = $layersList.map(
  (layers) =>
    layers
      ?.filter((layer) => layer?.type === LayerTypeChoices.LIVE)
      .toSorted((a) => (a.created_by ? 0 : -1)) || [],
);
export const $staticLayers = $layersList.map(
  (layers) =>
    layers?.filter((layer) => layer?.type === LayerTypeChoices.STATIC) || [],
);

export const onSelectSchoolStatusLayer = createEvent<number | null>();
export const onSelectEntityStatusLayer = createEvent<{
  entityType: EntityType;
  layerId: number | null;
}>();
export const $statusLayerIdByEntity = createStore<
  EntityStoreMap<number | null>
>(defaultEntityStatusLayerSelection);
$statusLayerIdByEntity.on(onSelectSchoolStatusLayer, (state, layerId) => ({
  ...state,
  [$selectedEntityType.getState()]: layerId,
}));
$statusLayerIdByEntity.on(
  onSelectEntityStatusLayer,
  (state, { entityType, layerId }) => ({
    ...state,
    [entityType]: layerId,
  }),
);
export const $schoolStatusSelectedLayer = combine(
  $statusLayerIdByEntity,
  $selectedEntityType,
  (statusLayerIdByEntity, selectedEntityType) =>
    getEntityValue(
      statusLayerIdByEntity,
      selectedEntityType,
      SCHOOL_STATUS_LAYER.id,
    ),
);

export const onSelectMainLayer = createEvent<number | null>();
export const onSelectEntityMainLayer = createEvent<{
  entityType: EntityType;
  layerId: number | null;
}>();
export const $selectedLayerId = restore(onSelectMainLayer, null);
$selectedLayerId.on(onSelectEntityMainLayer, (_, { layerId }) => layerId);
export const $selectedLayerIdByEntity = createStore<
  EntityStoreMap<number | null>
>({});
$selectedLayerIdByEntity.on(onSelectMainLayer, (state, layerId) => ({
  ...state,
  [$selectedEntityType.getState()]: layerId,
}));
$selectedLayerIdByEntity.on(
  onSelectEntityMainLayer,
  (state, { entityType, layerId }) => ({
    ...state,
    [entityType]: layerId,
  }),
);
export const $globalLayerData = $layersList.map(
  (layers) =>
    layers?.find(
      (layer) =>
        layer?.type === LayerTypeChoices.LIVE &&
        !layer.created_by &&
        (layer as LayerType & { code?: string }).code === 'DOWNLOAD',
    ) ?? null,
);
export const $globalLayerId = $globalLayerData.map(
  (layer) => layer?.id ?? null,
);
export const $downloadLayerData = $layersList.map(
  (layers) =>
    layers?.find(
      (layer) =>
        layer?.type === LayerTypeChoices.LIVE &&
        layer.created_by &&
        Object.values(layer.data_source_column ?? {})[0].name ===
          'connectivity_speed',
    ) ?? null,
);
export const $downloadLayerId = $downloadLayerData.map(
  (layer) => layer?.id ?? null,
);
export const $coverageLayerData = $layersList.map(
  (layers) =>
    layers?.find(
      (layer) =>
        layer?.type === LayerTypeChoices.STATIC &&
        layer.created_by &&
        Object.values(layer.data_source_column ?? {})[0].name ===
          'coverage_type',
    ) ?? null,
);
export const $coverageLayerId = $coverageLayerData.map(
  (layer) => layer?.id ?? null,
);

export const $activeLayerByCountriesByEntity = combine(
  $layersList,
  $countryIdToCode,
  $activeEntityTypes,
  (layers, countryIdToCode, activeEntityTypes) => {
    const result = {} as EntityStoreMap<{
      list: Record<string, { activeCountries: string[] }>;
      countryDefaultLayerList: Record<string, number>;
    }>;
    layers?.forEach((layer) => {
      getLayerEntityTypes(layer, activeEntityTypes).forEach((entityType) => {
        const entityLayers = result[entityType] ?? {
          list: {},
          countryDefaultLayerList: {},
        };
        entityLayers.list[layer.id] = {
          activeCountries:
            layer.active_countries_list?.map(({ country, is_default }) => {
              const code = countryIdToCode[country];
              if (is_default) {
                entityLayers.countryDefaultLayerList[code] = layer.id;
              }
              return code;
            }) ?? [],
        };
        result[entityType] = entityLayers;
      });
    });
    return result;
  },
);

export const $activeLayerByCountries = combine(
  $activeLayerByCountriesByEntity,
  $selectedEntityType,
  (activeLayersByEntity, selectedEntityType) => {
    return getEntityValue(activeLayersByEntity, selectedEntityType, {
      list: {},
      countryDefaultLayerList: {},
    });
  },
);

export const $currentDefaultLayerIdByEntity = combine(
  $countryCode,
  $activeLayerByCountriesByEntity,
  $globalLayerId,
  (countryCode, activeLayersByEntity, globalLayerId) => {
    return Object.entries(activeLayersByEntity).reduce(
      (acc, [entityType, activeLayers]) => {
        const layerId =
          activeLayers.countryDefaultLayerList[countryCode?.toLowerCase()] ??
          globalLayerId;
        acc[entityType as EntityType] = activeLayers.list[
          layerId ?? ''
        ]?.activeCountries?.includes?.(countryCode?.toLowerCase())
          ? layerId
          : null;
        return acc;
      },
      {} as EntityStoreMap<number | null>,
    );
  },
);

export const $currentDefaultLayerId = combine(
  $currentDefaultLayerIdByEntity,
  $selectedEntityType,
  $globalLayerId,
  (currentDefaultLayerIdByEntity, selectedEntityType, globalLayerId) => {
    return getEntityValue(
      currentDefaultLayerIdByEntity,
      selectedEntityType,
      globalLayerId,
    );
  },
);

export const $isActiveCurrentLayerByEntity = combine(
  $activeLayerByCountriesByEntity,
  $selectedLayerIdByEntity,
  $countryCode,
  $selectedLayerId,
  (
    activeLayersByEntity,
    selectedLayerIdByEntity,
    countryCode,
    selectedLayerId,
  ) => {
    return Object.entries(activeLayersByEntity).reduce(
      (acc, [entityType, activeLayers]) => {
        const entityLayerId = getSelectedEntityLayerId(
          selectedLayerIdByEntity,
          entityType as EntityType,
          selectedLayerId,
        );
        acc[entityType as EntityType] =
          !!entityLayerId &&
          activeLayers.list[entityLayerId]?.activeCountries?.includes(
            countryCode.toLowerCase(),
          );
        return acc;
      },
      {} as EntityStoreMap<boolean>,
    );
  },
);

export const $isActiveCurrentLayer = combine(
  $isActiveCurrentLayerByEntity,
  $selectedEntityType,
  (isActiveCurrentLayerByEntity, selectedEntityType) => {
    return getEntityValue(
      isActiveCurrentLayerByEntity,
      selectedEntityType,
      false,
    );
  },
);

export const $activeLayerByCountryCodeByEntity = combine(
  $layersList,
  $activeLayerByCountriesByEntity,
  $countryCode,
  $activeEntityTypes,
  (layers, activeLayersByEntity, countryCode, activeEntityTypes) => {
    const result = {} as EntityStoreMap<Record<string, boolean>>;
    layers?.forEach((layer) => {
      getLayerEntityTypes(layer, activeEntityTypes).forEach((entityType) => {
        const activeLayers = getEntityValue(activeLayersByEntity, entityType, {
          list: {},
          countryDefaultLayerList: {},
        });
        result[entityType] = {
          ...(result[entityType] ?? {}),
          [layer.id]:
            activeLayers.list[layer.id]?.activeCountries?.includes(
              countryCode.toLowerCase(),
            ) ?? false,
        };
      });
    });
    return result;
  },
);

export const $activeLayerByCountryCode = combine(
  $activeLayerByCountryCodeByEntity,
  $selectedEntityType,
  (activeLayerByCountryCodeByEntity, selectedEntityType) => {
    return getEntityValue(
      activeLayerByCountryCodeByEntity,
      selectedEntityType,
      {},
    );
  },
);

export const $selectedLayerData = combine(
  $layersList,
  $selectedLayerId,
  (layers, selectedId) => {
    return layers?.find((item) => item.id === selectedId) ?? null;
  },
);

export const $selectedLayerDataByEntity = combine(
  $layersList,
  $selectedLayerIdByEntity,
  $currentDefaultLayerIdByEntity,
  $selectedLayerId,
  (
    layers,
    selectedLayerIdByEntity,
    currentDefaultLayerIdByEntity,
    selectedLayerId,
  ) => {
    const entityTypes = new Set<EntityType>([
      ...(Object.keys(selectedLayerIdByEntity) as EntityType[]),
      ...(Object.keys(currentDefaultLayerIdByEntity) as EntityType[]),
    ]);
    return Array.from(entityTypes).reduce(
      (acc, entityType) => {
        const entityLayerId = getEntityValue(
          selectedLayerIdByEntity,
          entityType,
          currentDefaultLayerIdByEntity[entityType] ?? selectedLayerId,
        );
        acc[entityType] =
          layers?.find((item) => item.id === entityLayerId) ?? null;
        return acc;
      },
      {} as EntityStoreMap<LayerType | null>,
    );
  },
);

export const $currentLayerCountryDataSource = combine(
  $selectedLayerData,
  $country,
  (selectedData, country) => {
    if (!selectedData || !country) return null;
    return (
      (
        selectedData?.active_countries_list?.find(
          (activeLayers) => activeLayers.country === country.id,
        ) as { data_sources?: unknown } | undefined
      )?.data_sources || null
    );
  },
);

export const $benchmarkNamesAllLayers = $layersList.map((layers) =>
  layers.reduce(
    (acc, curr) => {
      acc[curr.id ?? ''] = curr?.global_benchmark?.benchmark_name ?? '';
      return acc;
    },
    {} as Record<string, string>,
  ),
);

export const $currentLayerTypeUtilsByEntity = combine(
  $statusLayerIdByEntity,
  $selectedLayerDataByEntity,
  (statusLayerIdByEntity, selectedLayerDataByEntity) => {
    const entityTypes = new Set<EntityType>([
      ...(Object.keys(statusLayerIdByEntity) as EntityType[]),
      ...(Object.keys(selectedLayerDataByEntity) as EntityType[]),
    ]);
    return Array.from(entityTypes).reduce(
      (acc, entityType) => {
        const selectedLayer = selectedLayerDataByEntity[entityType];
        acc[entityType] = {
          isLive: isLiveLayer(selectedLayer?.type),
          isStatic: isStaticLayer(selectedLayer?.type),
          isSchoolStatus: !!statusLayerIdByEntity[entityType],
        };
        return acc;
      },
      {} as EntityStoreMap<{
        isLive: boolean;
        isStatic: boolean;
        isSchoolStatus: boolean;
      }>,
    );
  },
);

export const $currentLayerTypeUtils = combine(
  $currentLayerTypeUtilsByEntity,
  $selectedEntityType,
  (currentLayerTypeUtilsByEntity, selectedEntityType) =>
    getEntityValue(currentLayerTypeUtilsByEntity, selectedEntityType, {
      isLive: false,
      isStatic: false,
      isSchoolStatus: false,
    }),
);

export const $isCurrentLayerLive = $currentLayerTypeUtils.map(
  (layerTypeUtils) => layerTypeUtils.isLive,
);
export const $currentLayerLegends = combine(
  {
    selectedLayerData: $selectedLayerData,
    stylePaintData: $stylePaintData,
    currentLayerTypeUtils: $currentLayerTypeUtils,
    countryActiveLayersDataById: $countryActiveLayersDataById,
    connectivityBenchmark: $connectivityBenchMark,
    lng: $lng,
  },
  ({
    selectedLayerData,
    currentLayerTypeUtils,
    stylePaintData,
    connectivityBenchmark,
    countryActiveLayersDataById,
  }) => {
    let apiLegends = selectedLayerData?.legend_configs;
    if (connectivityBenchmark === ConnectivityBenchMarks.national) {
      apiLegends =
        countryActiveLayersDataById[selectedLayerData?.id ?? '']
          ?.legend_configs;
    }
    const legends = {
      colors: {
        good: stylePaintData.good,
        moderate: stylePaintData.moderate,
        bad: stylePaintData.bad,
        unknown: stylePaintData.unknown,
      },
      values: [],
      reverseMapping: {},
    } as {
      colors: Record<string, string>;
      values: { key: string; label: string; tooltip?: string }[];
      reverseMapping: Record<string, string>;
    };
    if (!Object.values(apiLegends || {}).length) {
      legends.values = LayerDistributionUnit.map((key) => ({
        key,
        label: i18next.t(ConnectivityDistributionNames[key]),
      }));
    } else {
      const reverseMapping = {} as Record<string, string>;
      legends.values = Object.entries(apiLegends ?? {}).map(
        ([key, item]: [string, any]) => {
          reverseMapping[item.labels] = key;
          return {
            key,
            label: item.labels,
            tooltip: item.tooltip,
          };
        },
      );
      legends.reverseMapping = reverseMapping;
    }
    return legends;
  },
);

const buildCurrentLayerLegends = ({
  connectivityBenchmark,
  countryActiveLayersDataById,
  currentLayerTypeUtils,
  selectedLayerData,
  stylePaintData,
}: {
  connectivityBenchmark: ConnectivityBenchMarks;
  countryActiveLayersDataById: Record<string, any>;
  currentLayerTypeUtils?: {
    isLive: boolean;
    isStatic: boolean;
    isSchoolStatus: boolean;
  };
  selectedLayerData?: LayerType | null;
  stylePaintData: typeof $stylePaintData extends { getState: () => infer T }
    ? T
    : never;
}) => {
  let apiLegends = selectedLayerData?.legend_configs;
  if (connectivityBenchmark === ConnectivityBenchMarks.national) {
    apiLegends =
      countryActiveLayersDataById[selectedLayerData?.id ?? '']?.legend_configs;
  }
  const legends = {
    colors: {
      good: stylePaintData.good,
      moderate: stylePaintData.moderate,
      bad: stylePaintData.bad,
      unknown: stylePaintData.unknown,
    },
    values: [],
    reverseMapping: {},
  } as {
    colors: Record<string, string>;
    values: { key: string; label: string; tooltip?: string }[];
    reverseMapping: Record<string, string>;
  };
  if (!Object.values(apiLegends || {}).length) {
    legends.values = LayerDistributionUnit.map((key) => ({
      key,
      label: i18next.t(ConnectivityDistributionNames[key]),
    }));
  } else {
    const reverseMapping = {} as Record<string, string>;
    legends.values = Object.entries(apiLegends ?? {}).map(
      ([key, item]: [string, any]) => {
        reverseMapping[item.labels] = key;
        return {
          key,
          label: item.labels,
          tooltip: item.tooltip,
        };
      },
    );
    legends.reverseMapping = reverseMapping;
  }
  return legends;
};

export const $currentLayerLegendsByEntity = combine(
  {
    selectedLayerDataByEntity: $selectedLayerDataByEntity,
    stylePaintData: $stylePaintData,
    currentLayerTypeUtilsByEntity: $currentLayerTypeUtilsByEntity,
    countryActiveLayersDataById: $countryActiveLayersDataById,
    connectivityBenchmark: $connectivityBenchMark,
  },
  ({
    selectedLayerDataByEntity,
    currentLayerTypeUtilsByEntity,
    stylePaintData,
    connectivityBenchmark,
    countryActiveLayersDataById,
  }) => {
    return Object.entries(selectedLayerDataByEntity).reduce(
      (acc, [entityType, selectedLayerData]) => {
        acc[entityType as EntityType] = buildCurrentLayerLegends({
          selectedLayerData,
          currentLayerTypeUtils:
            currentLayerTypeUtilsByEntity[entityType as EntityType],
          stylePaintData,
          connectivityBenchmark,
          countryActiveLayersDataById,
        });
        return acc;
      },
      {} as EntityStoreMap<ReturnType<typeof buildCurrentLayerLegends>>,
    );
  },
);

export const $benchmarkmarkUtils = combine(
  $countryBenchmark,
  $selectedLayerData,
  $connectivityBenchMark,
  $countryConnectivityNames,
  (
    countryBenchmark,
    selectedLayerData,
    connectivityBenchMark,
    countryConnectivityNames,
  ) => {
    return buildBenchmarkUtils(
      countryBenchmark,
      selectedLayerData,
      connectivityBenchMark,
      countryConnectivityNames,
    );
  },
);

export const $isNationalBenchmark = $benchmarkmarkUtils.map(
  ({ isNational }) => isNational,
);

function buildBenchmarkUtils(
  countryBenchmark: Record<string, any> | null | undefined,
  selectedLayerData: LayerType | null | undefined,
  connectivityBenchMark: ConnectivityBenchMarks,
  countryConnectivityNames: Record<string, string>,
) {
  if (!selectedLayerData || !isLiveLayer(selectedLayerData?.type)) return {};
  const {
    global_benchmark,
    is_reverse: isReverse,
    benchmark_metadata,
  } = selectedLayerData;
  const {
    convert_unit: unit,
    value,
    benchmark_name: benchmarkName,
  } = global_benchmark ?? {};
  const {
    base_benchmark: baseBenchmark,
    round_unit_value: formula = getDefaultFormula(unit),
  } = benchmark_metadata ?? {};
  const baseBenchmarkValue = Number(
    evaluateExpression(formula, baseBenchmark ?? 0),
  );
  const globalBenchmarkValue = evaluateExpression(formula, value ?? 0);
  const nationalBenchmarkValue =
    Number(
      evaluateExpression(
        formula,
        countryBenchmark?.[selectedLayerData.id] ?? 0,
      ),
    ) || 0;
  const currentBenchmarkValue =
    connectivityBenchMark === ConnectivityBenchMarks.national
      ? nationalBenchmarkValue
      : globalBenchmarkValue;
  const benchmarkLogic = getConnectivityLogicalValues(
    String(currentBenchmarkValue),
    unit,
    baseBenchmarkValue,
    isReverse,
  );
  return {
    isReverse,
    baseBenchmark,
    globalBenchmarkValue,
    nationalBenchmarkValue,
    isNational: nationalBenchmarkValue > 0,
    benchmarkLogic,
    benchmarkName,
    countryConnectivityNames,
  };
}

export const $benchmarkmarkUtilsByEntity = combine(
  $countryBenchmark,
  $selectedLayerDataByEntity,
  $connectivityBenchMark,
  $countryConnectivityNames,
  (
    countryBenchmark,
    selectedLayerDataByEntity,
    connectivityBenchMark,
    countryConnectivityNames,
  ) => {
    return Object.entries(selectedLayerDataByEntity).reduce(
      (acc, [entityType, selectedLayerData]) => {
        acc[entityType as EntityType] = buildBenchmarkUtils(
          countryBenchmark,
          selectedLayerData,
          connectivityBenchMark,
          countryConnectivityNames,
        );
        return acc;
      },
      {} as EntityStoreMap<ReturnType<typeof buildBenchmarkUtils>>,
    );
  },
);

export const $isNationalBenchmarkByEntity = $benchmarkmarkUtilsByEntity.map(
  (benchmarkmarkUtilsByEntity) => {
    return Object.entries(benchmarkmarkUtilsByEntity).reduce(
      (acc, [entityType, benchmarkmarkUtils]) => {
        acc[entityType as EntityType] = !!benchmarkmarkUtils?.isNational;
        return acc;
      },
      {} as EntityStoreMap<boolean>,
    );
  },
);

export const $staticPopupActiveLayer = combine(
  $activeLayerByCountryCode,
  $staticLayers,
  $coverageLayerData,
  (activeLayerByCountryCode, staticLayers, coverageDynamicLayerData) => {
    if (activeLayerByCountryCode[coverageDynamicLayerData?.id ?? ''])
      return coverageDynamicLayerData;
    if (staticLayers?.length > 0) {
      return (
        staticLayers.find((item) => activeLayerByCountryCode[item?.id ?? '']) ??
        null
      );
    }
    return null;
  },
);

export const $staticPopupActiveLayerByEntity = combine(
  $activeLayerByCountryCodeByEntity,
  $staticLayers,
  $coverageLayerData,
  $activeEntityTypes,
  (
    activeLayerByCountryCodeByEntity,
    staticLayers,
    coverageDynamicLayerData,
    activeEntityTypes,
  ) => {
    return activeEntityTypes.reduce(
      (acc, entityType) => {
        const activeLayerByCountryCode = getEntityValue(
          activeLayerByCountryCodeByEntity,
          entityType,
          {},
        );
        const entityStaticLayers = staticLayers.filter((layer) =>
          getLayerEntityTypes(layer, activeEntityTypes).includes(entityType),
        );
        if (activeLayerByCountryCode[coverageDynamicLayerData?.id ?? '']) {
          acc[entityType] = coverageDynamicLayerData;
          return acc;
        }
        acc[entityType] =
          entityStaticLayers.find(
            (item) => activeLayerByCountryCode[item?.id ?? ''],
          ) ?? null;
        return acc;
      },
      {} as EntityStoreMap<LayerType | null>,
    );
  },
);

export const $isSchoolBenchmark = combine(
  $selectedLayerData,
  $connectivityBenchMark,
  $country,
  (selectedLayer, conntectivityBenchmark, country) => {
    const isLive = isLiveLayer(selectedLayer?.type);
    if (!isLive) return false;
    if (conntectivityBenchmark === ConnectivityBenchMarks.global) {
      return selectedLayer?.global_benchmark?.value?.startsWith('SQL:');
    } else if (conntectivityBenchmark === ConnectivityBenchMarks.national) {
      return country?.benchmark_metadata?.live_layer?.[
        selectedLayer?.id ?? ''
      ]?.startsWith('SQL:');
    }
  },
);

export const $isSchoolBenchmarkByEntity = combine(
  $selectedLayerDataByEntity,
  $connectivityBenchMark,
  $country,
  (selectedLayerDataByEntity, conntectivityBenchmark, country) => {
    return Object.entries(selectedLayerDataByEntity).reduce(
      (acc, [entityType, selectedLayer]) => {
        const isLive = isLiveLayer(selectedLayer?.type);
        if (!isLive) {
          acc[entityType as EntityType] = false;
          return acc;
        }
        if (conntectivityBenchmark === ConnectivityBenchMarks.global) {
          acc[entityType as EntityType] =
            !!selectedLayer?.global_benchmark?.value?.startsWith('SQL:');
        } else if (conntectivityBenchmark === ConnectivityBenchMarks.national) {
          acc[entityType as EntityType] =
            !!country?.benchmark_metadata?.live_layer?.[
              selectedLayer?.id ?? ''
            ]?.startsWith('SQL:');
        }
        return acc;
      },
      {} as EntityStoreMap<boolean>,
    );
  },
);

export const $layerUtils = combine({
  layers: $layersList,
  liveLayers: $connectivityLayers,
  staticLayers: $staticLayers,
  selectedLayerId: $selectedLayerId,
  selectedLayerIdByEntity: $selectedLayerIdByEntity,
  selectedLayerData: $selectedLayerData,
  selectedLayerDataByEntity: $selectedLayerDataByEntity,
  statusLayerIdByEntity: $statusLayerIdByEntity,
  globalLayerId: $globalLayerId,
  globalLayerData: $globalLayerData,
  downloadLayerId: $downloadLayerId,
  downloadLayerData: $downloadLayerData,
  coverageLayerId: $coverageLayerId,
  coverageLayerData: $coverageLayerData,
  currentLayerTypeUtils: $currentLayerTypeUtils,
  currentLayerTypeUtilsByEntity: $currentLayerTypeUtilsByEntity,
  currentLayerLegends: $currentLayerLegends,
  currentLayerLegendsByEntity: $currentLayerLegendsByEntity,
  isActiveCurrentLayer: $isActiveCurrentLayer,
  isActiveCurrentLayerByEntity: $isActiveCurrentLayerByEntity,
  activeLayerByCountryCode: $activeLayerByCountryCode,
  activeLayerByCountryCodeByEntity: $activeLayerByCountryCodeByEntity,
  activeLayerByCountriesByEntity: $activeLayerByCountriesByEntity,
  currentDefaultLayerId: $currentDefaultLayerId,
  currentDefaultLayerIdByEntity: $currentDefaultLayerIdByEntity,
  staticPopupActiveLayer: $staticPopupActiveLayer,
  staticPopupActiveLayerByEntity: $staticPopupActiveLayerByEntity,
  isSchoolBenchmark: $isSchoolBenchmark,
  isSchoolBenchmarkByEntity: $isSchoolBenchmarkByEntity,
  benchmarkmarkUtilsByEntity: $benchmarkmarkUtilsByEntity,
  isNationalBenchmarkByEntity: $isNationalBenchmarkByEntity,
  benchmarkNamesAllLayers: $benchmarkNamesAllLayers,
  countryConnectivityNames: $countryConnectivityNames,
  connectivityBenchMarks: $connectivityBenchMark,
});

export const openHistoryChart = createEvent<boolean>();
export const $historyChartOpen = createStore(false);
$historyChartOpen.on(openHistoryChart, setPayload);

export const staticLegendsSelection = createEvent<string | string[]>();
export const entityStaticLegendsSelection = createEvent<{
  entityType: EntityType;
  legends: string | string[];
}>();
export const selectAllStaticLegendsSelection = createEvent<string[]>();
export const selectAllEntityStaticLegendsSelection = createEvent<{
  entityType: EntityType;
  legends?: string[];
}>();
export const makeEmptyStaticLegendsSelection = createEvent<string[]>();
export const makeEmptyEntityStaticLegendsSelection = createEvent<{
  entityType: EntityType;
}>();

const updateStaticLegendsSelection = (
  state: string[],
  payload: string | string[],
) => {
  const isArrayLegend = Array.isArray(payload);
  if (isArrayLegend) {
    return payload;
  }
  const isButtonSelected = state.includes(payload);
  if (isButtonSelected) {
    // If the button is already selected, remove it from the selected buttons i.e unselect it
    return state.filter((id) => id !== payload);
  }
  // If the button is not selected, check if the maximum limit of 3 buttons is reached
  if (state.length < 3) {
    // Add the button to the selected buttons
    return [...state, payload];
  }
  return state;
};

export const $staticLegendsSelectedByEntity = createStore<
  EntityStoreMap<string[]>
>({
  [EntityType.SCHOOL]: defaultStatusLegendsSelection,
  [EntityType.HEALTH]: defaultStatusLegendsSelection,
});
$staticLegendsSelectedByEntity.on(staticLegendsSelection, (state, payload) => {
  const selectedEntityType = $selectedEntityType.getState();
  return {
    ...state,
    [selectedEntityType]: updateStaticLegendsSelection(
      getEntityValue(state, selectedEntityType, defaultStatusLegendsSelection),
      payload,
    ),
  };
});
$staticLegendsSelectedByEntity.on(
  entityStaticLegendsSelection,
  (state, { entityType, legends }) => ({
    ...state,
    [entityType]: updateStaticLegendsSelection(
      getEntityValue(state, entityType, defaultStatusLegendsSelection),
      legends,
    ),
  }),
);
$staticLegendsSelectedByEntity.on(makeEmptyStaticLegendsSelection, (state) => {
  const selectedEntityType = $selectedEntityType.getState();
  return {
    ...state,
    [selectedEntityType]: [],
  };
});
$staticLegendsSelectedByEntity.on(
  makeEmptyEntityStaticLegendsSelection,
  (state, { entityType }) => ({
    ...state,
    [entityType]: [],
  }),
);
$staticLegendsSelectedByEntity.on(selectAllStaticLegendsSelection, (state) => {
  const selectedEntityType = $selectedEntityType.getState();
  const currentState = getEntityValue(
    state,
    selectedEntityType,
    defaultStatusLegendsSelection,
  );
  if (currentState.length === 3) {
    return state;
  }
  return {
    ...state,
    [selectedEntityType]: defaultStatusLegendsSelection,
  };
});
$staticLegendsSelectedByEntity.on(
  selectAllEntityStaticLegendsSelection,
  (state, { entityType, legends }) => {
    const currentState = getEntityValue(
      state,
      entityType,
      defaultStatusLegendsSelection,
    );
    if (currentState.length === 3) {
      return state;
    }
    return {
      ...state,
      [entityType]: legends ?? defaultStatusLegendsSelection,
    };
  },
);

export const $staticLegendsSelected = combine(
  $staticLegendsSelectedByEntity,
  $selectedEntityType,
  (staticLegendsSelectedByEntity, selectedEntityType) => {
    return getEntityValue(
      staticLegendsSelectedByEntity,
      selectedEntityType,
      defaultStatusLegendsSelection,
    );
  },
);

export const resetCoverageFilterSelection = createEvent();
export const checkConnectivityBenchmark = createEvent<number>();

export const changeCoverage5g4g = createEvent<boolean>();
export const $coverage5g4g = restore(changeCoverage5g4g, true);

export const changeCoverage3g2g = createEvent<boolean>();
export const $coverage3g2g = restore(changeCoverage3g2g, true);

export const changeCoverageNoCoverage = createEvent<boolean>();
export const $coverageNoCoverage = restore(changeCoverageNoCoverage, true);

export const changeCoverageUnknown = createEvent<boolean>();
export const $coverageUnknown = restore(changeCoverageUnknown, true);
export const $coverageStatusAll = combine({
  [ConnectivityDistribution.good]: $coverage5g4g,
  [ConnectivityDistribution.moderate]: $coverage3g2g,
  [ConnectivityDistribution.bad]: $coverageNoCoverage,
  [ConnectivityDistribution.unknown]: $coverageUnknown,
});
export const $coverageStatusAllByEntity = combine(
  $coverageStatusAll,
  $activeEntityTypes,
  (coverageStatusAll, activeEntityTypes) => {
    return (
      activeEntityTypes.length ? activeEntityTypes : [EntityType.SCHOOL]
    ).reduce(
      (acc, entityType) => {
        acc[entityType] = coverageStatusAll;
        return acc;
      },
      {} as EntityStoreMap<typeof coverageStatusAll>,
    );
  },
);

export const changePotentialCoverageOpenStatus = createEvent<boolean>();
export const $potentialCoverageOpenStatus = createStore<boolean>(true);
$potentialCoverageOpenStatus.on(changePotentialCoverageOpenStatus, setPayload);

export const changeMultiSelectionSchoolCheckbox = createEvent<SelectedSchool>();
export const changeDefaultMultiSelectionSchoolCheckbox =
  createEvent<MultischoolSelectionStats>();
export const $multiSelectionSchoolCheckbox =
  createStore<MultischoolSelectionStats>(multiSchoolSelection);
$multiSelectionSchoolCheckbox.on(
  changeDefaultMultiSelectionSchoolCheckbox,
  setPayload,
);

$multiSelectionSchoolCheckbox.on(
  changeMultiSelectionSchoolCheckbox,
  (state: MultischoolSelectionStats, payload: SelectedSchool) => {
    if (!payload) return state;
    const { countryId, schoolIds } = payload;

    const newState = { ...state };

    if (newState.schoolIds.includes(schoolIds)) {
      newState.schoolIds = newState.schoolIds.filter((id) => id !== schoolIds);
    } else {
      newState.schoolIds.push(schoolIds);
      newState.schoolIds.sort((a, b) => a - b);
    }

    newState.countryId = countryId;

    return newState;
  },
);
export const $multiSelectionSchoolCheckboxByEntity = combine(
  $multiSelectionSchoolCheckbox,
  (multiSelectionSchoolCheckbox) =>
    ({
      [EntityType.SCHOOL]: multiSelectionSchoolCheckbox,
    }) as EntityStoreMap<MultischoolSelectionStats>,
);

export const onSchoolUncheck = createEvent<number>();
export const $schoolStats = createStore<SchoolStatsType[] | null>([]);
$schoolStats.on(fetchSchoolLayerInfoFx.doneData, setPayload);
export const schoolStatsMap = (school: SchoolStatsType) => ({
  name: school.name,
  geopoint: school?.geopoint,
  liveAvg: school?.connectivity_speed || school?.live_avg || 0,
  staticValue: school?.field_value ?? school?.coverage_type ?? UNKNOWN,
  staticType: school?.field_status ?? school?.coverage_status,
  connectivityStatus:
    school.connectivity_status || school.statistics.connectivity_status,
  isRealTime: school.is_rt_connected,
  connectivityType: school?.week_connectivity || school?.live_avg_connectivity,
  id: school?.id,
  externalId: school?.external_id,
  schoolBenchmark: `${school?.benchmark_metadata?.rounded_benchmark_value} ${school?.benchmark_metadata?.display_unit}`,
  schoolAtSameLocation: {
    count: school.schools_at_same_location?.count,
    schoolIds: school.schools_at_same_location?.school_ids,
  },
});
export const $schoolStatsMap = $schoolStats.map((schools) => {
  return schools?.map(schoolStatsMap) ?? null;
});

export const $schoolAdminId = $schoolStats.map((schools) => {
  if (schools?.length) {
    const ids = new Set(schools?.map((school) => school.admin1_id));
    return ids.size === 1 ? (schools[0].admin1_id ?? 0) : 0;
  }
  return null;
});

export const $connectivityColorsWithBenchmark = combine(
  $stylePaintData,
  (style) => {
    return {
      connectivityColors: style.connectivity,
    };
  },
);
export const $connectivityColorsWithBenchmarkByEntity = combine(
  $connectivityColorsWithBenchmark,
  $activeEntityTypes,
  (connectivityColorsWithBenchmark, activeEntityTypes) => {
    return (
      activeEntityTypes.length ? activeEntityTypes : [EntityType.SCHOOL]
    ).reduce(
      (acc, entityType) => {
        acc[entityType] = connectivityColorsWithBenchmark;
        return acc;
      },
      {} as EntityStoreMap<typeof connectivityColorsWithBenchmark>,
    );
  },
);

export const $connectivityAvailability = createStore<ConnectivityConfig | null>(
  null,
);
export const $connectivityAvailabilityByEntity = createStore<
  Partial<Record<EntityType, ConnectivityConfig>>
>({});
export const $connectivityYears = $connectivityAvailability.map((data) => {
  if (data?.years && data.years.length >= 2) {
    return data.years;
  }
  return null;
});
$connectivityAvailability.on(getSchoolAvailableDates.doneData, setPayload);
$connectivityAvailabilityByEntity.on(
  getEntitiesAvailableDates.doneData,
  (_, payload) => {
    return payload as Partial<Record<EntityType, ConnectivityConfig>>;
  },
);
$connectivityAvailability.on(
  getEntitiesAvailableDates.doneData,
  (_, payload) => {
    return (
      (payload as Partial<Record<EntityType, ConnectivityConfig>>)?.[
        $selectedEntityType.getState()
      ] ?? null
    );
  },
);
$connectivityAvailability.on(changeSelectedEntityType, (_, entityType) => {
  return $connectivityAvailabilityByEntity.getState()?.[entityType] ?? null;
});

export const $allLoadings = combine({
  country: fetchCountryFx.pending,
  countries: fetchCountriesFx.pending,
  stats: fetchEntityGlobalStatsFx.pending,
  layers: fetchLayerListFx.pending,
  info: fetchLayerInfoFx.pending,
  entityInfo: fetchEntitiesLayerInfoFx.pending,
  lastAvailableDates: combine(
    getSchoolAvailableDates.pending,
    getEntitiesAvailableDates.pending,
    (schoolPending, entityPending) => schoolPending || entityPending,
  ),
});

export const $isLoadingSchoolView = $allLoadings.map(
  ({ country, layers, lastAvailableDates, info }) =>
    [country, layers, info, lastAvailableDates].some(Boolean),
);
export const $isLoadingCountryAdminView = $allLoadings.map(
  ({ country, lastAvailableDates, stats, info, entityInfo, layers }) =>
    [info, entityInfo, lastAvailableDates, country, stats, layers].some(
      Boolean,
    ),
);

export const onShowLegend = createEvent<boolean>();
export const $showLegend = restore(onShowLegend, true);

export const onShowThemeLayer = createEvent<boolean>();
export const $showThemeLayer = restore(onShowThemeLayer, false);

export const onShowFilterSidebar = createEvent<boolean>();
export const $showFilterSidebar = restore(onShowFilterSidebar, false);

export const onShowAdvancedFilter = createEvent<boolean>();
export const $showAdvancedFilter = restore(onShowAdvancedFilter, false);

sample({
  clock: mapOverview.visible,
  filter: (visible) => visible,
  target: onChangeTourStartPopup.prepend(() => true),
});

export const $isProductTour = sample({
  source: combine(mapOverview.router.search, mapOverview.visible),
  fn: ([searchParams]) => {
    const params = new URLSearchParams(searchParams);
    return params.get('popover') === 'tour';
  },
});

export const onToggleTimeplayer = createEvent<boolean>();
export const $isTimeplayer = restore(onToggleTimeplayer, false);
export const $isLoadedTimePlayer = createStore(false);
export const onPausePlayTimeplayer = createEvent<boolean>();
export const $isPauseTimeplayer = restore(onPausePlayTimeplayer, false);
export const onLoadTimePlayerData = createEvent<boolean>();
export const setLoaderTimePlayer = createEvent<boolean>();
export const $isLoadingTimeplayer = restore(setLoaderTimePlayer, false);
export const onSetTimePlayerCurrentYear = createEvent<number>();
export const $timePlayerCurrentYear = restore(onSetTimePlayerCurrentYear, 0);
export const onTimeoutTimePlayer = createEvent();
export const $timePlayerInfo = combine({
  years: $connectivityYears,
  activeYear: $timePlayerCurrentYear,
  isLoading: $isLoadingTimeplayer,
  isLoaded: $isLoadedTimePlayer,
});

export const setSidebarHeight = createEvent<boolean>();
export const $sidebarHeight = restore<boolean>(setSidebarHeight, false);

export const $getSchoolParams = sample({
  source: mapSchools.router.search,
  fn: (searchParams) => {
    const params = new URLSearchParams(searchParams);
    return {
      country: params.get('country'),
      schoolIds: params.get('school_ids')?.split(',').map(Number),
    };
  },
});

export const $selectedSchoolIds = $getSchoolParams.map(
  (data) => data?.schoolIds ?? null,
);

// all reset model
$staticLegendsSelectedByEntity.reset([resetFilterModal, mapOverview.visible]);
$connectivityBenchMark.reset(resetFilterModal, mapOverview.visible);
$connectivitySpeedGood.reset([resetFilterModal, mapOverview.visible]);
$connectivitySpeedModerate.reset([resetFilterModal, mapOverview.visible]);
$connectivitySpeednoInternet.reset([resetFilterModal, mapOverview.visible]);
$connectivitySpeedUnknown.reset([resetFilterModal, mapOverview.visible]);
$coverage5g4g.reset([resetCoverageFilterSelection, mapOverview.visible]);
$coverage3g2g.reset([resetCoverageFilterSelection, mapOverview.visible]);
$coverageNoCoverage.reset([resetCoverageFilterSelection, mapOverview.visible]);
$coverageUnknown.reset([resetCoverageFilterSelection, mapOverview.visible]);
$potentialCoverageOpenStatus.reset(onSelectMainLayer);
$schoolStats.reset(mapSchools.visible, $countryCode, $selectedLayerId);
$isMenuOpen.reset(router.historyUpdated);
// on history update, clear connectivity dates;
$connectivityAvailability.reset(router.historyUpdated, $selectedLayerId);
$connectivityAvailabilityByEntity.reset(
  router.historyUpdated,
  $selectedLayerId,
);
$countryLayerInfoByEntity.reset(router.historyUpdated);
$coverageStatsByEntity.reset(router.historyUpdated);

$isTimeplayer.reset(router.historyUpdated);
$timePlayerCurrentYear.reset($isTimeplayer);
$isLoadedTimePlayer.reset($isTimeplayer);
$isLoadingTimeplayer.reset($isTimeplayer);
$sidebarHeight.reset([router.historyUpdated, $showLegend]);

$showAdvancedFilter.reset([$countryCode, $admin1Code, $countrySearchString]);
