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
  $entityTypesFiltered,
} from '~/@/entities/models/entity.model';
import { $stylePaintData } from '~/@/map/map.model';
import {
  fetchAdvanceFilterFx,
  fetchCountriesFx,
  fetchCountryFx,
  fetchEntitiesConnectivityStatsFx,
  fetchEntitiesLayerInfoFx,
  fetchEntityGlobalStatsFx,
  fetchLayerInfoFx,
  fetchLayerListFx,
  fetchSchoolLayerInfoFx,
} from '~/api/project-connect';
import {
  CountryBasic,
  EntitiesConnectivityStatsResponse,
  EntitiesLayerInfoResponse,
  SchoolStatsType,
} from '~/api/types';
import { $lng } from '~/core/i18n/store';
import {
  $mapRoutes,
  mapEntity,
  mapOverview,
  mapSchools,
  router,
} from '~/core/routes';
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
import { getEntityStatusId, isLiveLayer, isStaticLayer } from './sidebar.util';
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
  [EntityType.SCHOOL]: getEntityStatusId(EntityType.SCHOOL),
  [EntityType.HEALTH]: getEntityStatusId(EntityType.HEALTH),
} as EntityStoreMap<string | null>;

const defaultStatusLegendsSelection = [
  ConnectivityStatusDistribution.connected,
  ConnectivityStatusDistribution.notConnected,
  ConnectivityStatusDistribution.unknown,
];

const getEntityValue = getEntityMapValue;

const getSelectedEntityLayerId = (
  selectedLayerIdByEntity: EntityStoreMap<number | null>,
  entityType: EntityType,
) => {
  return getEntityValue(selectedLayerIdByEntity, entityType, null);
};

export const onClickSidebar = createEvent();
export const toggleSidebar = createEvent();

export const resetFilterModal = createEvent();

export const $isSidebarCollapsed = createStore(false);
export const $countriesList = createStore<CountryBasic[]>([]);
export const $countriesPending = fetchCountriesFx.pending;

export const changeConnectivityIndicator = createEvent<Layers>();

export const changeEntityConnectivityBenchmark = createEvent<{
  entityType: EntityType;
  benchmark: ConnectivityBenchMarks;
}>();
export const setConnectivityBenchmarksByEntity =
  createEvent<EntityStoreMap<ConnectivityBenchMarks>>();
const defaultConnectivityBenchmarkByEntity = {
  [EntityType.SCHOOL]: ConnectivityBenchMarks.global,
  [EntityType.HEALTH]: ConnectivityBenchMarks.global,
} as EntityStoreMap<ConnectivityBenchMarks>;
export const $connectivityBenchMarkByEntity = createStore<
  EntityStoreMap<ConnectivityBenchMarks>
>(defaultConnectivityBenchmarkByEntity);
$connectivityBenchMarkByEntity.on(
  changeEntityConnectivityBenchmark,
  (state, { entityType, benchmark }) => ({
    ...state,
    [entityType]: benchmark,
  }),
);
export const $isMapTab = createStore(true);

export const $connectivityStatsByEntity =
  createStore<EntitiesConnectivityStatsResponse>({});
$connectivityStatsByEntity.on(
  fetchEntitiesConnectivityStatsFx.doneData,
  setPayload,
);
$connectivityStatsByEntity.reset($countryCode);
export const $countryLayerInfoByEntity = createStore<EntitiesLayerInfoResponse>(
  {},
);
$countryLayerInfoByEntity.on(fetchEntitiesLayerInfoFx.doneData, setPayload);
$countryLayerInfoByEntity.reset($countryCode);

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
    total_metrics: stat.total_metrics,
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
    // if (!Object.values(payload ?? {}).some(hasCoverageLayerInfo)) return state;
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
export const onChangeMenu = createEvent<boolean>();
export const $isMenuOpen = createStore(false);
$isMenuOpen.on(onChangeMenu, setPayload);

export const changeEntityConnectivitySpeed = createEvent<{
  entityType: EntityType;
  key:
    | ConnectivityDistribution.good
    | ConnectivityDistribution.moderate
    | ConnectivityDistribution.bad
    | ConnectivityDistribution.unknown;
  value: boolean;
}>();
const defaultConnectivitySpeedFilter = {
  [ConnectivityDistribution.good]: true,
  [ConnectivityDistribution.moderate]: true,
  [ConnectivityDistribution.bad]: true,
  [ConnectivityDistribution.unknown]: true,
};
export const $connectivitySpeedFilterByEntity = createStore<
  EntityStoreMap<typeof defaultConnectivitySpeedFilter>
>({
  [EntityType.SCHOOL]: defaultConnectivitySpeedFilter,
  [EntityType.HEALTH]: defaultConnectivitySpeedFilter,
});
$connectivitySpeedFilterByEntity.on(
  changeEntityConnectivitySpeed,
  (state, { entityType, key, value }) => ({
    ...state,
    [entityType]: {
      ...getEntityValue(state, entityType, defaultConnectivitySpeedFilter),
      [key]: value,
    },
  }),
);
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

export const onSelectEntityStatusLayer =
  createEvent<EntityStoreMap<string | null>>();
export const $statusLayerIdByEntity = createStore<
  EntityStoreMap<string | null>
>(defaultEntityStatusLayerSelection);
$statusLayerIdByEntity.on(onSelectEntityStatusLayer, (state, payload) => ({
  ...state,
  ...payload,
}));
// TODO: remove onSelectMainLayer compatibility event when remaining tests move to onSelectEntityMainLayer.
export const onSelectMainLayer = createEvent<number | null>();
export const onSelectEntityMainLayer =
  createEvent<EntityStoreMap<number | null>>();

export const $selectedLayerIdByEntity = createStore<
  EntityStoreMap<number | null>
>({});

$selectedLayerIdByEntity.on(onSelectEntityMainLayer, (state, payload) => ({
  ...state,
  ...payload,
}));

// TODO: remove download code in condition when createdBy layer is fix
export const $globalLayerDataByEntity = $layersList.map((layers) => {
  const result = {} as EntityStoreMap<LayerType | null>;
  layers?.forEach((layer) => {
    getLayerEntityTypes(layer, []).forEach((entityType) => {
      if (
        layer?.type === LayerTypeChoices.LIVE &&
        (layer.code === 'DOWNLOAD' ||
          layer.code === `DOWNLOAD_${entityType?.toUpperCase()}`)
      ) {
        result[entityType] = layer;
      }
    });
  });
  return result;
});

export const $coverageLayerDataByEntity = $layersList.map((layers) => {
  const result = {} as EntityStoreMap<LayerType | null>;
  layers?.forEach((layer) => {
    getLayerEntityTypes(layer, []).forEach((entityType) => {
      if (
        layer?.type === LayerTypeChoices.STATIC &&
        Object.values(layer.data_source_column ?? {})[0].name ===
          'coverage_type'
      ) {
        result[entityType] = layer;
      }
    });
  });
  return result;
});

export const $activeLayerByCountriesByEntity = combine(
  $layersList,
  $countryIdToCode,
  $entityTypesFiltered,
  (layers, countryIdToCode, entityTypesFiltered) => {
    const result = {} as EntityStoreMap<{
      list: Record<string, { activeCountries: string[] }>;
      countryDefaultLayerList: Record<string, number>;
    }>;
    layers?.forEach((layer) => {
      getLayerEntityTypes(layer, entityTypesFiltered).forEach((entityType) => {
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

export const $currentDefaultLayerIdByEntity = combine(
  $countryCode,
  $activeLayerByCountriesByEntity,
  $globalLayerDataByEntity,
  (countryCode, activeLayerByCountriesByEntity, globalLayerDataByEntity) => {
    return Object.entries(activeLayerByCountriesByEntity).reduce(
      (acc, [entityType, activeLayers]) => {
        const layerId =
          activeLayers.countryDefaultLayerList[countryCode?.toLowerCase()] ??
          globalLayerDataByEntity[entityType as EntityType]?.id;
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

export const $isActiveCurrentLayerByEntity = combine(
  $activeLayerByCountriesByEntity,
  $selectedLayerIdByEntity,
  $countryCode,
  (activeLayersByEntity, selectedLayerIdByEntity, countryCode) => {
    return Object.entries(activeLayersByEntity).reduce(
      (acc, [entityType, activeLayers]) => {
        const entityLayerId = getSelectedEntityLayerId(
          selectedLayerIdByEntity,
          entityType as EntityType,
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
          ...result[entityType],
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

export const $selectedLayerDataByEntity = combine(
  $layersList,
  $selectedLayerIdByEntity,
  $currentDefaultLayerIdByEntity,
  (layers, selectedLayerIdByEntity, currentDefaultLayerIdByEntity) => {
    const entityTypes = new Set<EntityType>([
      ...(Object.keys(selectedLayerIdByEntity) as EntityType[]),
      ...(Object.keys(currentDefaultLayerIdByEntity) as EntityType[]),
    ]);
    return Array.from(entityTypes).reduce(
      (acc, entityType) => {
        const entityLayerId = getEntityValue(
          selectedLayerIdByEntity,
          entityType,
          currentDefaultLayerIdByEntity[entityType] ?? null,
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
  $selectedLayerDataByEntity,
  $activeEntityTypes,
  $country,
  (selectedLayerDataByEntity, activeEntityTypes, country) => {
    if (!country) return {} as EntityStoreMap<any>;
    return activeEntityTypes.reduce((acc, entityType) => {
      const selectedData = selectedLayerDataByEntity[entityType];
      acc[entityType] =
        (
          selectedData?.active_countries_list?.find(
            (activeLayers) => activeLayers.country === country.id,
          ) as { data_sources?: any } | undefined
        )?.data_sources || null;
      return acc;
    }, {} as EntityStoreMap<any>);
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
    connectivityBenchmarkByEntity: $connectivityBenchMarkByEntity,
    activeEntityTypes: $activeEntityTypes,
  },
  ({
    selectedLayerDataByEntity,
    currentLayerTypeUtilsByEntity,
    stylePaintData,
    connectivityBenchmarkByEntity,
    countryActiveLayersDataById,
    activeEntityTypes,
  }) => {
    return activeEntityTypes.reduce(
      (acc, currentEntityType) => {
        acc[currentEntityType] = buildCurrentLayerLegends({
          selectedLayerData: selectedLayerDataByEntity[currentEntityType],
          currentLayerTypeUtils:
            currentLayerTypeUtilsByEntity[currentEntityType],
          stylePaintData,
          connectivityBenchmark: getEntityValue(
            connectivityBenchmarkByEntity,
            currentEntityType,
            ConnectivityBenchMarks.global,
          ),
          countryActiveLayersDataById,
        });
        return acc;
      },
      {} as EntityStoreMap<ReturnType<typeof buildCurrentLayerLegends>>,
    );
  },
);

export function buildBenchmarkUtils(
  countryBenchmark: Record<string, any> | null | undefined,
  selectedLayerData: LayerType | null | undefined,
  connectivityBenchMark: ConnectivityBenchMarks,
  countryConnectivityNames: Record<string, string>,
  mapRoutes: typeof $mapRoutes extends { getState: () => infer T } ? T : never,
) {
  if (
    !mapRoutes.map &&
    (!selectedLayerData || !isLiveLayer(selectedLayerData?.type))
  )
    return {};
  const {
    id,
    global_benchmark,
    is_reverse: isReverse,
    benchmark_metadata,
  } = selectedLayerData ?? {
    id: 0,
    benchmark_metadata: {
      base_benchmark: '1000000',
      round_unit_value: '{val} / (1000 * 1000)',
    },
    global_benchmark: {
      value: '20000000',
      convert_unit: 'mbps',
    },
  };
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
    Number(evaluateExpression(formula, countryBenchmark?.[id] ?? 0)) || 0;
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
  $connectivityBenchMarkByEntity,
  $countryConnectivityNames,
  $mapRoutes,
  (
    countryBenchmark,
    selectedLayerDataByEntity,
    connectivityBenchMarkByEntity,
    countryConnectivityNames,
    mapRoutes,
  ) => {
    return Object.entries(selectedLayerDataByEntity).reduce(
      (acc, [entityType, selectedLayerData]) => {
        const currentEntityType = entityType as EntityType;
        acc[currentEntityType] = buildBenchmarkUtils(
          countryBenchmark,
          selectedLayerData,
          getEntityValue(
            connectivityBenchMarkByEntity,
            currentEntityType,
            ConnectivityBenchMarks.global,
          ),
          countryConnectivityNames,
          mapRoutes,
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

export const $staticPopupActiveLayerByEntity = combine(
  $activeLayerByCountryCodeByEntity,
  $staticLayers,
  $coverageLayerDataByEntity,
  $activeEntityTypes,
  (
    activeLayerByCountryCodeByEntity,
    staticLayers,
    coverageLayerDataByEntity,
    activeEntityTypes,
  ) => {
    return activeEntityTypes.reduce(
      (acc, entityType) => {
        const entityActiveLayerByCountryCode = getEntityValue(
          activeLayerByCountryCodeByEntity,
          entityType,
          {},
        );
        const entityStaticLayers = staticLayers.filter((layer) =>
          getLayerEntityTypes(layer, activeEntityTypes).includes(entityType),
        );
        const coverageDynamicLayerData = coverageLayerDataByEntity[entityType];
        if (
          entityActiveLayerByCountryCode[coverageDynamicLayerData?.id ?? '']
        ) {
          acc[entityType] = coverageDynamicLayerData;
          return acc;
        }
        acc[entityType] =
          entityStaticLayers.find(
            (item) => entityActiveLayerByCountryCode[item?.id ?? ''],
          ) ?? null;
        return acc;
      },
      {} as EntityStoreMap<LayerType | null>,
    );
  },
);

export const $isSchoolBenchmarkByEntity = combine(
  $selectedLayerDataByEntity,
  $connectivityBenchMarkByEntity,
  $country,
  (selectedLayerDataByEntity, conntectivityBenchmarkByEntity, country) => {
    return Object.entries(selectedLayerDataByEntity).reduce(
      (acc, [entityType, selectedLayer]) => {
        const currentEntityType = entityType as EntityType;
        const conntectivityBenchmark = getEntityValue(
          conntectivityBenchmarkByEntity,
          currentEntityType,
          ConnectivityBenchMarks.global,
        );
        const isLive = isLiveLayer(selectedLayer?.type);
        if (!isLive) {
          acc[currentEntityType] = false;
          return acc;
        }
        if (conntectivityBenchmark === ConnectivityBenchMarks.global) {
          acc[currentEntityType] =
            !!selectedLayer?.global_benchmark?.value?.startsWith('SQL:');
        } else if (conntectivityBenchmark === ConnectivityBenchMarks.national) {
          acc[currentEntityType] =
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
  selectedLayerIdByEntity: $selectedLayerIdByEntity,
  selectedLayerDataByEntity: $selectedLayerDataByEntity,
  statusLayerIdByEntity: $statusLayerIdByEntity,

  coverageLayerDataByEntity: $coverageLayerDataByEntity,
  globalLayerDataByEntity: $globalLayerDataByEntity,
  currentLayerTypeUtilsByEntity: $currentLayerTypeUtilsByEntity,

  currentLayerLegendsByEntity: $currentLayerLegendsByEntity,

  isActiveCurrentLayerByEntity: $isActiveCurrentLayerByEntity,

  activeLayerByCountryCodeByEntity: $activeLayerByCountryCodeByEntity,
  activeLayerByCountriesByEntity: $activeLayerByCountriesByEntity,

  currentDefaultLayerIdByEntity: $currentDefaultLayerIdByEntity,
  staticPopupActiveLayerByEntity: $staticPopupActiveLayerByEntity,

  isSchoolBenchmarkByEntity: $isSchoolBenchmarkByEntity,
  benchmarkmarkUtilsByEntity: $benchmarkmarkUtilsByEntity,
  isNationalBenchmarkByEntity: $isNationalBenchmarkByEntity,
  benchmarkNamesAllLayers: $benchmarkNamesAllLayers,
  countryConnectivityNames: $countryConnectivityNames,

  connectivityBenchMarksByEntity: $connectivityBenchMarkByEntity,
});

export const openHistoryChart = createEvent<boolean>();
export const $historyChartOpen = createStore(false);
$historyChartOpen.on(openHistoryChart, setPayload);

export const entityStaticLegendsSelection = createEvent<{
  entityType: EntityType;
  legends: string | string[];
}>();
export const selectAllEntityStaticLegendsSelection = createEvent<{
  entityType: EntityType;
  legends?: string[];
}>();
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
$staticLegendsSelectedByEntity.on(
  makeEmptyEntityStaticLegendsSelection,
  (state, { entityType }) => ({
    ...state,
    [entityType]: [],
  }),
);
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

export const resetCoverageFilterSelection = createEvent();
export const resetEntityCoverageFilterSelection = createEvent<EntityType>();
export const checkEntityConnectivityBenchmark = createEvent<{
  entityType: EntityType;
  layerId: number;
}>();

export const changeEntityCoverageStatus = createEvent<{
  entityType: EntityType;
  key:
    | ConnectivityDistribution.good
    | ConnectivityDistribution.moderate
    | ConnectivityDistribution.bad
    | ConnectivityDistribution.unknown;
  value: boolean;
}>();
const defaultCoverageStatusAll = {
  [ConnectivityDistribution.good]: true,
  [ConnectivityDistribution.moderate]: true,
  [ConnectivityDistribution.bad]: true,
  [ConnectivityDistribution.unknown]: true,
};
export const $coverageStatusAllByEntity = createStore<
  EntityStoreMap<typeof defaultCoverageStatusAll>
>({
  [EntityType.SCHOOL]: defaultCoverageStatusAll,
  [EntityType.HEALTH]: defaultCoverageStatusAll,
});
$coverageStatusAllByEntity.on(
  resetEntityCoverageFilterSelection,
  (state, entityType) => ({
    ...state,
    [entityType]: { ...defaultCoverageStatusAll },
  }),
);
$connectivityBenchMarkByEntity.on(
  setConnectivityBenchmarksByEntity,
  (state, payload) => ({ ...state, ...payload }),
);
$coverageStatusAllByEntity.on(
  changeEntityCoverageStatus,
  (state, { entityType, key, value }) => ({
    ...state,
    [entityType]: {
      ...getEntityValue(state, entityType, defaultCoverageStatusAll),
      [key]: value,
    },
  }),
);
export const changePotentialCoverageOpenStatus = createEvent<boolean>();
export const $potentialCoverageOpenStatus = createStore<boolean>(true);
$potentialCoverageOpenStatus.on(changePotentialCoverageOpenStatus, setPayload);

export const changeMultiSelectionSchoolCheckbox = createEvent<
  SelectedSchool & { entityType: EntityType }
>();
export const changeDefaultMultiSelectionSchoolCheckbox = createEvent<
  MultischoolSelectionStats & { entityType: EntityType }
>();
export const $multiSelectionSchoolCheckboxByEntity = createStore<
  EntityStoreMap<MultischoolSelectionStats>
>({
  [EntityType.SCHOOL]: multiSchoolSelection,
});
$multiSelectionSchoolCheckboxByEntity.on(
  changeDefaultMultiSelectionSchoolCheckbox,
  (state, { entityType, ...selection }) => ({
    ...state,
    [entityType]: selection,
  }),
);

$multiSelectionSchoolCheckboxByEntity.on(
  changeMultiSelectionSchoolCheckbox,
  (state, { entityType, countryId, schoolIds }) => {
    const current = state[entityType] ?? multiSchoolSelection;
    const newState = { ...current, schoolIds: [...current.schoolIds] };

    if (newState.schoolIds.includes(schoolIds)) {
      newState.schoolIds = newState.schoolIds.filter((id) => id !== schoolIds);
    } else {
      newState.schoolIds.push(schoolIds);
      newState.schoolIds.sort((a, b) => a - b);
    }

    newState.countryId = countryId;

    return { ...state, [entityType]: newState };
  },
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
    school.connectivity_status ??
    school.statistics?.connectivity_status ??
    UNKNOWN,
  isRealTime: school.is_rt_connected,
  connectivityType: school?.week_connectivity || school?.live_avg_connectivity,
  id: school?.id,
  externalId: school?.external_id,
  isVerifiedSchool: school?.is_verified_school,
  schoolBenchmark: `${school?.benchmark_metadata?.rounded_benchmark_value} ${school?.benchmark_metadata?.display_unit}`,
  schoolAtSameLocation: {
    count: school.schools_at_same_location?.count ?? 0,
    schoolIds: school.schools_at_same_location?.school_ids ?? [],
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

export const $connectivityColorsWithBenchmarkByEntity = combine(
  $stylePaintData,
  $activeEntityTypes,
  (style, activeEntityTypes) => {
    const connectivityColorsWithBenchmark = {
      connectivityColors: style.connectivity,
    };
    return activeEntityTypes.reduce(
      (acc, entityType) => {
        acc[entityType] = connectivityColorsWithBenchmark;
        return acc;
      },
      {} as EntityStoreMap<typeof connectivityColorsWithBenchmark>,
    );
  },
);

export const $connectivityAvailabilityByEntity = createStore<
  Partial<Record<EntityType, ConnectivityConfig | null>>
>({});
$connectivityAvailabilityByEntity.on(
  getSchoolAvailableDates.doneData,
  (state, payload) => ({
    ...state,
    [EntityType.SCHOOL]: payload,
  }),
);
$connectivityAvailabilityByEntity.on(
  getEntitiesAvailableDates.doneData,
  (_, payload) => {
    const payloadByEntity = payload as Partial<
      Record<EntityType, ConnectivityConfig>
    >;
    const entityTypes = new Set<EntityType>([
      ...$activeEntityTypes.getState(),
      ...(Object.keys(payloadByEntity) as EntityType[]),
    ]);
    return Array.from(entityTypes).reduce(
      (acc, entityType) => {
        acc[entityType] = payloadByEntity[entityType] ?? null;
        return acc;
      },
      {} as Partial<Record<EntityType, ConnectivityConfig | null>>,
    );
  },
);
export const $connectivityYearsByEntity = $connectivityAvailabilityByEntity.map(
  (availabilityByEntity) =>
    Object.entries(availabilityByEntity).reduce(
      (acc, [entityType, data]) => {
        acc[entityType as EntityType] =
          data?.years && data.years.length >= 2 ? data.years : null;
        return acc;
      },
      {} as EntityStoreMap<number[] | null>,
    ),
);

export const $allLoadings = combine({
  country: fetchCountryFx.pending,
  countries: fetchCountriesFx.pending,
  advanceFilter: fetchAdvanceFilterFx.pending,
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
  ({ country, advanceFilter, lastAvailableDates, stats, info, entityInfo, layers }) =>
    [info, entityInfo, lastAvailableDates, country, advanceFilter, stats, layers].some(
      Boolean,
    ),
);

export const $isGlobalLegendLoading = fetchLayerListFx.pending;

export const liveLegendLoadingStarted = createEvent();
export const liveLegendLoadingFinished = createEvent();

sample({
  clock: getEntitiesAvailableDates,
  fn: () => undefined,
  target: liveLegendLoadingStarted,
});

sample({
  clock: [
    getEntitiesAvailableDates.fail,
    fetchEntitiesLayerInfoFx.finally,
    fetchSchoolLayerInfoFx.finally,
  ],
  fn: () => undefined,
  target: liveLegendLoadingFinished,
});

const $isLiveLegendPipelineLoading = createStore(false)
  .on(liveLegendLoadingStarted, () => true)
  .on(liveLegendLoadingFinished, () => false)
  .reset([router.historyUpdated, mapOverview.visible]);

export const $isLiveLegendLoading = combine(
  $isLiveLegendPipelineLoading,
  fetchLayerListFx.pending,
  fetchCountryFx.pending,
  fetchCountriesFx.pending,
  getEntitiesAvailableDates.pending,
  fetchEntitiesLayerInfoFx.pending,
  (...pendingFlags) => pendingFlags.some(Boolean),
);

export const $isStaticLegendLoading = combine(
  fetchLayerListFx.pending,
  fetchAdvanceFilterFx.pending,
  fetchCountryFx.pending,
  fetchCountriesFx.pending,
  fetchEntitiesLayerInfoFx.pending,
  (...pendingFlags) => pendingFlags.some(Boolean),
);

export const $isStatusLegendLoading = combine(
  fetchLayerListFx.pending,
  fetchAdvanceFilterFx.pending,
  fetchCountryFx.pending,
  fetchCountriesFx.pending,
  fetchEntityGlobalStatsFx.pending,
  (...pendingFlags) => pendingFlags.some(Boolean),
);

export const onShowLegend = createEvent<boolean>();
export const $showLegend = restore(onShowLegend, true);

export const onShowThemeLayer = createEvent<boolean>();
export const $showThemeLayer = restore(onShowThemeLayer, false);

export const onShowAccessibility = createEvent<boolean>();
export const $showAccessibility = restore(onShowAccessibility, false);

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
  yearsByEntity: $connectivityYearsByEntity,
  activeYear: $timePlayerCurrentYear,
  isLoading: $isLoadingTimeplayer,
  isLoaded: $isLoadedTimePlayer,
});

export const setSidebarHeight = createEvent<boolean>();
export const $sidebarHeight = restore<boolean>(setSidebarHeight, false);

export const toggleAccordionEntity = createEvent<EntityType>();
export const $accordionExpandedEntities = createStore<
  Partial<Record<EntityType, boolean>>
>({});

$accordionExpandedEntities.on(toggleAccordionEntity, (state, entityType) => ({
  ...state,
  [entityType]: !state[entityType],
}));

sample({
  clock: $activeEntityTypes,
  source: $accordionExpandedEntities,
  fn: (expandedEntities, activeTypes) => {
    if (activeTypes.length === 1) {
      const singleType = activeTypes[0];
      return {
        ...expandedEntities,
        [singleType]: true,
      };
    }
    return expandedEntities;
  },
  target: $accordionExpandedEntities,
});

export const $getSchoolParams = combine(
  {
    entitySearch: mapEntity.router.search,
    entityVisible: mapEntity.visible,
    schoolSearch: mapSchools.router.search,
    schoolVisible: mapSchools.visible,
  },
  ({ entitySearch, entityVisible, schoolSearch, schoolVisible }) => {
    const params = new URLSearchParams(
      entityVisible ? entitySearch : schoolSearch,
    );
    const entityIdsParam = Array.from(params.entries()).find(
      ([key, value]) => key.endsWith('_ids') && key !== 'entity_ids' && !!value,
    );
    const entityTypeFromIds = entityIdsParam?.[0].replace(/_ids$/, '') as
      | EntityType
      | undefined;
    const legacyEntityTypeParam =
      params.get('entity_type') ?? params.get('entity');
    const entityType =
      entityTypeFromIds ??
      (legacyEntityTypeParam
        ? (legacyEntityTypeParam as EntityType)
        : undefined) ??
      (schoolVisible ? EntityType.SCHOOL : undefined);
    const idsParam =
      entityIdsParam?.[1] ??
      (entityType ? params.get(`${entityType}_ids`) : null) ??
      params.get('entity_ids');

    return {
      country: params.get('country'),
      entityType,
      schoolIds: idsParam?.split(',').map(Number),
    };
  },
);

export const $selectedSchoolIds = $getSchoolParams.map(
  (data) => data?.schoolIds ?? null,
);

// all reset model
$statusLayerIdByEntity.reset(mapOverview.visible);
$staticLegendsSelectedByEntity.reset([resetFilterModal, mapOverview.visible]);
$connectivityBenchMarkByEntity.reset(resetFilterModal, mapOverview.visible);
$connectivitySpeedFilterByEntity.reset([resetFilterModal, mapOverview.visible]);
$coverageStatusAllByEntity.reset([
  resetCoverageFilterSelection,
  mapOverview.visible,
]);
$potentialCoverageOpenStatus.reset(onSelectEntityMainLayer);
$schoolStats.reset(
  mapSchools.visible,
  mapEntity.visible,
  $countryCode,
  $selectedLayerIdByEntity,
);
$isMenuOpen.reset(router.historyUpdated);
// on history update, clear connectivity dates;
$connectivityAvailabilityByEntity.reset(router.historyUpdated);
$countryLayerInfoByEntity.reset(router.historyUpdated);
$coverageStatsByEntity.reset(router.historyUpdated);

$isTimeplayer.reset(router.historyUpdated);
$timePlayerCurrentYear.reset($isTimeplayer);
$isLoadedTimePlayer.reset($isTimeplayer);
$isLoadingTimeplayer.reset($isTimeplayer);
$sidebarHeight.reset([router.historyUpdated, $showLegend]);

$showAdvancedFilter.reset([$countryCode, $admin1Code, $countrySearchString]);
