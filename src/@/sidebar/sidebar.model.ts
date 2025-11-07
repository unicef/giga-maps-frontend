import { combine, createEvent, createStore, restore, sample } from 'effector';
import { ConnectivityDistributionNames, getConnectivityLogicalValues, LayerDistributionUnit } from './ui/global-and-country-view-components/container/layer-view.constant';

import { $admin1Code, $country, $countryActiveLayersDataById, $countryBenchmark, $countryCode, $countryConnectivityNames, $countryIdToCode, $countrySearchString } from '~/@/country/country.model';
import { $stylePaintData } from '~/@/map/map.model';
import { fetchConnectivityLayerFx, fetchCountriesFx, fetchCountryFx, fetchCountryLiveLayerInfo, fetchCountryStaticLayerInfo, fetchGlobalStatsFx, fetchLayerInfoFx, fetchLayerListFx, fetchSchoolLayerInfoFx } from '~/api/project-connect';
import { ConnectivityStat, CountryBasic, SchoolStatsType } from '~/api/types';
import { mapOverview, mapSchools, router } from '~/core/routes';
import { setPayload, setPayloadResults } from '~/lib/effector-kit';

import i18next from 'i18next';
import { $lng } from '~/core/i18n/store';
import { evaluateExpression } from '~/lib/utils';
import { extractDataWithMapping, reconstructJson } from '~/lib/utils/json-mapper.util';
import { UNKNOWN } from '../map/map.types';
import { onChangeTourStartPopup } from '../product-tour/models/product-tour.model';
import { publishLayersTranslationFx } from './effects/all-translation-fx';
import { getSchoolAvailableDates } from './effects/search-country-fx';
import { ConnectivityBenchMarks, ConnectivityDistribution, ConnectivityStatusDistribution, getDefaultFormula, Layers, multiSchoolSelection, publishLayersListMapping, SCHOOL_STATUS_LAYER } from './sidebar.constant';
import { isLiveLayer, isStaticLayer } from './sidebar.util';
import { ConnectivityConfig, CoverageStat, LayerType, LayerTypeChoices, MultischoolSelectionStats, SelectedSchool } from './types';

export const onClickSidebar = createEvent();
export const toggleSidebar = createEvent();

export const resetFilterModal = createEvent();

export const $isSidebarCollapsed = createStore(false);
export const $countriesList = createStore<CountryBasic[]>([]);
export const $countriesPending = fetchCountriesFx.pending;

export const changeConnectivityIndicator = createEvent<Layers>();

export const changeConnectivityBenchmark = createEvent<ConnectivityBenchMarks>();
export const $connectivityBenchMark = restore(changeConnectivityBenchmark, ConnectivityBenchMarks.global)

export const $isMapTab = createStore(true);

export const $connectivityStats = createStore<ConnectivityStat | null>(null);
$connectivityStats.on(fetchConnectivityLayerFx.doneData, setPayload);
$connectivityStats.on(fetchCountryLiveLayerInfo.doneData, setPayload);

export const $coverageStats = createStore<CoverageStat | null>(null);
$coverageStats.on(fetchCountryStaticLayerInfo.doneData, setPayload);

export const onChangeMenu = createEvent<boolean>();
export const $isMenuOpen = createStore(false)
$isMenuOpen.on(onChangeMenu, setPayload);

export const changeConnectivitySpeedGood = createEvent<boolean>();
export const $connectivitySpeedGood = createStore(true)
$connectivitySpeedGood.on(changeConnectivitySpeedGood, setPayload);

export const changeConnectivitySpeedModerate = createEvent<boolean>();
export const $connectivitySpeedModerate = createStore(true)
$connectivitySpeedModerate.on(changeConnectivitySpeedModerate, setPayload);

export const changeConnectivitySpeednoInternet = createEvent<boolean>();
export const $connectivitySpeednoInternet = createStore(true)
$connectivitySpeednoInternet.on(changeConnectivitySpeednoInternet, setPayload);

export const changeConnectivitySpeedUnknown = createEvent<boolean>();
export const $connectivitySpeedUnknown = createStore(true)
$connectivitySpeedUnknown.on(changeConnectivitySpeedUnknown, setPayload);

export const $liveLayerLegendsStatus = combine({
  [ConnectivityDistribution.good]: $connectivitySpeedGood,
  [ConnectivityDistribution.moderate]: $connectivitySpeedModerate,
  [ConnectivityDistribution.bad]: $connectivitySpeednoInternet,
  [ConnectivityDistribution.unknown]: $connectivitySpeedUnknown
})

// layer model 
export const $layersList = createStore<LayerType[]>([]);
$layersList.on(fetchLayerListFx.doneData, setPayloadResults)
$layersList.on(publishLayersTranslationFx.doneData, (state, payload) => {
  const { data } = payload as { data: Record<string, string> }
  const list = reconstructJson(data, { layersList: state }).layersList as LayerType[];
  return list.map((item) => ({ ...item, legend_configs: { ...item.legend_configs } }))
})
export const $layersListMapping = createStore<[string, string][]>([]);
$layersListMapping.on(fetchLayerListFx.doneData, (_, payload) => {
  const list = Object.entries(extractDataWithMapping({ layersList: payload.results }, publishLayersListMapping)).filter(([_key, value]) => !!value);
  return list;
})


export const $layerListTranslated = createStore<LayerType[]>([]);

export const $connectivityLayers = $layersList.map((layers) => layers?.filter(layer => layer?.type === LayerTypeChoices.LIVE).sort((a) => a.created_by ? 0 : -1) || [])
export const $staticLayers = $layersList.map((layers) => layers?.filter(layer => layer?.type === LayerTypeChoices.STATIC) || [])

export const onSelectSchoolStatusLayer = createEvent<number | null>();
export const $schoolStatusSelectedLayer = restore(onSelectSchoolStatusLayer, SCHOOL_STATUS_LAYER.id);

export const onSelectMainLayer = createEvent<number | null>();
export const $selectedLayerId = restore(onSelectMainLayer, null);
export const $globalLayerData = $layersList.map(layers => layers?.find(layer => layer?.type === LayerTypeChoices.LIVE && !layer.created_by) ?? null);
export const $globalLayerId = $globalLayerData.map(layer => layer?.id ?? null);
export const $downloadLayerData = $layersList.map(layers => layers?.find(layer => layer?.type === LayerTypeChoices.LIVE && layer.created_by && Object.values(layer.data_source_column ?? {})[0].name === 'connectivity_speed') ?? null);
export const $downloadLayerId = $downloadLayerData.map(layer => layer?.id ?? null);
export const $coverageLayerData = $layersList.map(layers => layers?.find(layer => layer?.type === LayerTypeChoices.STATIC && layer.created_by && Object.values(layer.data_source_column ?? {})[0].name === 'coverage_type') ?? null);
export const $coverageLayerId = $coverageLayerData.map(layer => layer?.id ?? null);

export const $activeLayerByCountries = combine($layersList, $countryIdToCode, (layers, countryIdToCode) => {
  const list = {} as Record<string, { activeCountries: string[] }>
  const countryDefaultLayerList = {} as Record<string, number>;
  layers?.forEach((layer) => {
    list[layer.id] = {
      activeCountries: layer.active_countries_list?.map(({ country, is_default }) => {
        const code = countryIdToCode[country];
        if (is_default) {
          countryDefaultLayerList[code] = layer.id;
        }
        return code;
      })
    }
  })
  return {
    list,
    countryDefaultLayerList
  };
})

// Store - on page load/refresh call this event which holds the layer id coming from the URL (number | null)
export const setUrlPreferredLayer = createEvent<{ layerId: number | null, hasIdInUrl: boolean } | null>();
export const clearUrlPreferredLayer = createEvent();
export const $urlPreferredLayer = createStore<{ layerId: number | null, hasIdInUrl: boolean } | null>(null)
  .on(setUrlPreferredLayer, (_, v) => v)
  .on(clearUrlPreferredLayer, () => null);

export const $currentDefaultLayerIdForUI = combine(
  $countryCode,
  $activeLayerByCountries,
  $globalLayerId,
  (countryCode, activeLayers, globalLayerId) => {
    const layerId =
      activeLayers.countryDefaultLayerList[countryCode?.toLowerCase()] ?? globalLayerId;

    return activeLayers.list[layerId]?.activeCountries?.includes?.(
      countryCode?.toLowerCase()
    )
      ? layerId
      : null;
  }
);

// combine prefers $urlPreferredLayer (which will be cleared immediately after set)
export const $currentDefaultLayerId = combine(
  $currentDefaultLayerIdForUI,
  $urlPreferredLayer,
  (fromUi, urlPreferredLayer) => {
    if (urlPreferredLayer?.hasIdInUrl) {
      return urlPreferredLayer.layerId;
    }
    return fromUi;
  }
);



export const $isActiveCurrentLayer = combine($activeLayerByCountries, $selectedLayerId, $countryCode, (activeLayers, selectedId, countryCode) => {
  return !!selectedId && activeLayers.list[selectedId]?.activeCountries?.includes(countryCode.toLowerCase())
})

export const $activeLayerByCountryCode = combine($layersList, $activeLayerByCountries, $countryCode, (layers, activeLayers, countryCode) => {
  const list = {} as Record<string, boolean>
  layers?.forEach((layer) => {
    list[layer.id] = activeLayers.list[layer.id]?.activeCountries?.includes(countryCode.toLowerCase())
  })
  return list;
});

export const $selectedLayerData = combine($layersList, $selectedLayerId, (layers, selectedId) => {
  return layers?.find(item => item.id === selectedId) ?? null;
});

export const $currentLayerCountryDataSource = combine($selectedLayerData, $country, (selectedData, country) => {
  if (!selectedData || !country) return null;
  return selectedData.active_countries_list.find(activeLayers => activeLayers.country === country.id)?.data_sources || null
})

export const $benchmarkNamesAllLayers = $layersList.map(layers => layers.reduce((acc, curr) => {
  acc[curr.id ?? ""] = curr?.global_benchmark?.benchmark_name;
  return acc
}, {} as Record<string, string>))

export const $currentLayerTypeUtils = combine(
  $schoolStatusSelectedLayer, $selectedLayerData,
  (schoolSelected, selectedLayer) => ({
    isLive: isLiveLayer(selectedLayer?.type),
    isStatic: isStaticLayer(selectedLayer?.type),
    isSchoolStatus: !!schoolSelected
  }))

export const $isCurrentLayerLive = $currentLayerTypeUtils.map(layerTypeUtils => layerTypeUtils.isLive);
export const $currentLayerLegends = combine({
  selectedLayerData: $selectedLayerData,
  stylePaintData: $stylePaintData,
  currentLayerTypeUtils: $currentLayerTypeUtils,
  countryActiveLayersDataById: $countryActiveLayersDataById,
  connectivityBenchmark: $connectivityBenchMark,
  lng: $lng
}, ({ selectedLayerData, currentLayerTypeUtils, stylePaintData, connectivityBenchmark, countryActiveLayersDataById }) => {
  let apiLegends = selectedLayerData?.legend_configs;
  if (connectivityBenchmark === ConnectivityBenchMarks.national) {
    apiLegends = countryActiveLayersDataById[selectedLayerData?.id ?? ""]?.legend_configs
  }
  const legends = {
    colors: {
      good: stylePaintData.good,
      moderate: stylePaintData.moderate,
      bad: stylePaintData.bad,
      unknown: stylePaintData.unknown,
    },
    values: [],
    reverseMapping: {}
  } as { colors: Record<string, string>; values: { key: string, label: string; tooltip?: string }[], reverseMapping: Record<string, string> };
  if (currentLayerTypeUtils.isLive && !Object.values(apiLegends || {}).length) {
    legends.values = LayerDistributionUnit.map((key) => ({
      key,
      label: i18next.t(ConnectivityDistributionNames[key]),
    }));
  } else {
    const reverseMapping = {} as Record<string, string>
    legends.values = Object.entries(apiLegends ?? {}).map(([key, item]: [string, any]) => {
      reverseMapping[item.labels] = key;
      return ({
        key,
        label: item.labels,
        tooltip: item.tooltip
      })
    }
    );
    legends.reverseMapping = reverseMapping;
  }
  return legends;
})

export const $benchmarkmarkUtils = combine($countryBenchmark, $selectedLayerData, $connectivityBenchMark, $countryConnectivityNames, (countryBenchmark, selectedLayerData, connectivityBenchMark, countryConnectivityNames) => {
  if (!selectedLayerData || !isLiveLayer(selectedLayerData?.type)) return {};
  const { global_benchmark, is_reverse: isReverse, benchmark_metadata } = selectedLayerData;
  const { convert_unit: unit, value, benchmark_name: benchmarkName } = global_benchmark;
  const { base_benchmark: baseBenchmark, round_unit_value: formula = getDefaultFormula(unit) } = benchmark_metadata ?? {};
  const baseBenchmarkValue = Number(evaluateExpression(formula, baseBenchmark ?? 0));
  const globalBenchmarkValue = evaluateExpression(formula, value ?? 0);
  const nationalBenchmarkValue = Number(evaluateExpression(formula, countryBenchmark[selectedLayerData.id] ?? 0)) || 0;
  const currentBenchmarkValue = connectivityBenchMark === ConnectivityBenchMarks.national ? nationalBenchmarkValue : globalBenchmarkValue;
  const benchmarkLogic = getConnectivityLogicalValues(String(currentBenchmarkValue), unit, baseBenchmarkValue, isReverse);
  return ({
    isReverse,
    baseBenchmark,
    globalBenchmarkValue,
    nationalBenchmarkValue,
    isNational: nationalBenchmarkValue > 0,
    benchmarkLogic,
    benchmarkName,
    countryConnectivityNames
  })
});

export const $isNationalBenchmark = $benchmarkmarkUtils.map(({ isNational }) => isNational);

export const $staticPopupActiveLayer = combine($activeLayerByCountryCode, $staticLayers, $coverageLayerData, (activeLayerByCountryCode, staticLayers, coverageDynamicLayerData) => {
  if (activeLayerByCountryCode[coverageDynamicLayerData?.id ?? ""]) return coverageDynamicLayerData;
  if (staticLayers?.length > 0) {
    return staticLayers.find(item => activeLayerByCountryCode[item?.id ?? ""]) ?? null;
  }
  return null;
})

export const $isSchoolBenchmark = combine($selectedLayerData, $connectivityBenchMark, $country, (selectedLayer, conntectivityBenchmark, country) => {
  const isLive = isLiveLayer(selectedLayer?.type);
  if (!isLive) return false;
  if (conntectivityBenchmark === ConnectivityBenchMarks.global) {
    return selectedLayer?.global_benchmark.value.startsWith('SQL:')
  } else if (conntectivityBenchmark === ConnectivityBenchMarks.national) {
    return country?.benchmark_metadata.live_layer?.[selectedLayer?.id ?? ""]?.startsWith('SQL:')
  }
})

export const $layerUtils = combine({
  layers: $layersList,
  liveLayers: $connectivityLayers,
  staticLayers: $staticLayers,
  selectedLayerId: $selectedLayerId,
  selectedLayerData: $selectedLayerData,
  globalLayerId: $globalLayerId,
  globalLayerData: $globalLayerData,
  downloadLayerId: $downloadLayerId,
  downloadLayerData: $downloadLayerData,
  coverageLayerId: $coverageLayerId,
  coverageLayerData: $coverageLayerData,
  currentLayerTypeUtils: $currentLayerTypeUtils,
  currentLayerLegends: $currentLayerLegends,
  isActiveCurrentLayer: $isActiveCurrentLayer,
  activeLayerByCountryCode: $activeLayerByCountryCode,
  currentDefaultLayerId: $currentDefaultLayerId,
  staticPopupActiveLayer: $staticPopupActiveLayer,
  isSchoolBenchmark: $isSchoolBenchmark,
  benchmarkNamesAllLayers: $benchmarkNamesAllLayers,
  countryConnectivityNames: $countryConnectivityNames,
  connectivityBenchMarks: $connectivityBenchMark
});

export const openHistoryChart = createEvent<boolean>();
export const $historyChartOpen = createStore(false)
$historyChartOpen.on(openHistoryChart, setPayload);

export const staticLegendsSelection = createEvent<string | string[]>();
export const selectAllStaticLegendsSelection = createEvent<string[]>();
export const makeEmptyStaticLegendsSelection = createEvent<string[]>();
export const $staticLegendsSelected = createStore<string[]>([ConnectivityStatusDistribution.connected, ConnectivityStatusDistribution.notConnected, ConnectivityStatusDistribution.unknown])
$staticLegendsSelected.on(staticLegendsSelection, (state, payload) => {
  const isArrayLegend = Array.isArray(payload)
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
})
$staticLegendsSelected.on(makeEmptyStaticLegendsSelection, () => {
  return []
})
$staticLegendsSelected.on(selectAllStaticLegendsSelection, (state) => {
  if (state.length === 3) {
    return state;
  }
  return [ConnectivityStatusDistribution.connected, ConnectivityStatusDistribution.notConnected, ConnectivityStatusDistribution.unknown]
})

export const resetCoverageFilterSelection = createEvent<number>();
export const checkConnectivityBenchmark = createEvent<number>();

export const changeCoverage5g4g = createEvent<boolean>();
export const $coverage5g4g = restore(changeCoverage5g4g, true)

export const changeCoverage3g2g = createEvent<boolean>();
export const $coverage3g2g = restore(changeCoverage3g2g, true)

export const changeCoverageNoCoverage = createEvent<boolean>();
export const $coverageNoCoverage = restore(changeCoverageNoCoverage, true)

export const changeCoverageUnknown = createEvent<boolean>();
export const $coverageUnknown = restore(changeCoverageUnknown, true)
export const $coverageStatusAll = combine({
  [ConnectivityDistribution.good]: $coverage5g4g,
  [ConnectivityDistribution.moderate]: $coverage3g2g,
  [ConnectivityDistribution.bad]: $coverageNoCoverage,
  [ConnectivityDistribution.unknown]: $coverageUnknown
})

export const changePotentialCoverageOpenStatus = createEvent<boolean>();
export const $potentialCoverageOpenStatus = createStore<boolean>(true);
$potentialCoverageOpenStatus.on(changePotentialCoverageOpenStatus, setPayload);

export const changeMultiSelectionSchoolCheckbox = createEvent<SelectedSchool>();
export const changeDefaultMultiSelectionSchoolCheckbox = createEvent<MultischoolSelectionStats>();
export const $multiSelectionSchoolCheckbox = createStore<MultischoolSelectionStats>(multiSchoolSelection)
$multiSelectionSchoolCheckbox.on(changeDefaultMultiSelectionSchoolCheckbox, setPayload);

$multiSelectionSchoolCheckbox.on(changeMultiSelectionSchoolCheckbox, (state: MultischoolSelectionStats, payload: SelectedSchool) => {
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
});

export const onSchoolUncheck = createEvent<number>();
export const $schoolStats = createStore<SchoolStatsType[] | null>([])
$schoolStats.on(fetchSchoolLayerInfoFx.doneData, setPayload);
export const schoolStatsMap = (school: SchoolStatsType) => ({
  name: school.name,
  geopoint: school?.geopoint,
  liveAvg: school?.connectivity_speed || school?.live_avg || 0,
  staticValue: school?.field_value ?? school?.coverage_type ?? UNKNOWN,
  staticType: school?.field_status ?? school?.coverage_status,
  connectivityStatus: school.connectivity_status || school.statistics.connectivity_status,
  isRealTime: school.is_rt_connected,
  connectivityType: school?.week_connectivity || school?.live_avg_connectivity,
  id: school?.id,
  externalId: school?.external_id,
  schoolBenchmark: `${school?.benchmark_metadata?.rounded_benchmark_value} ${school?.benchmark_metadata?.display_unit}`,
  schoolAtSameLocation: {
    count: school.schools_at_same_location?.count,
    schoolIds: school.schools_at_same_location?.school_ids,
  }
})
export const $schoolStatsMap = $schoolStats.map((schools) => {
  return schools?.map(schoolStatsMap) ?? null;
})

export const $schoolAdminId = $schoolStats.map((schools) => {
  if (schools?.length) {
    const ids = new Set(schools?.map((school) => school.admin1_id));
    return ids.size === 1 ? (schools[0].admin1_id ?? 0) : 0
  }
  return null;
})

export const $connectivityColorsWithBenchmark = combine($stylePaintData, (style) => {
  return ({
    connectivityColors: style.connectivity,
  })
});

export const $connectivityAvailability = createStore<ConnectivityConfig | null>(null)
export const $connectivityYears = $connectivityAvailability.map((data) => {
  if (data?.years && data.years.length >= 2) {
    return data.years;
  }
  return null;
});
$connectivityAvailability.on(getSchoolAvailableDates.doneData, setPayload);

export const $allLoadings = combine({
  country: fetchCountryFx.pending,
  countries: fetchCountriesFx.pending,
  stats: fetchGlobalStatsFx.pending,
  layers: fetchLayerListFx.pending,
  info: fetchLayerInfoFx.pending,
  lastAvailableDates: getSchoolAvailableDates.pending,
})

export const $isLoadingSchoolView = $allLoadings.map(({ country, layers, lastAvailableDates, info }) => [country, layers, info, lastAvailableDates].some(Boolean));
export const $isLoadingCountryAdminView = $allLoadings.map(({ country, lastAvailableDates, stats, info, layers }) => [info, lastAvailableDates, country, stats, layers].some(Boolean));

export const onShowLegend = createEvent<boolean>();
export const $showLegend = restore(onShowLegend, true);

export const onShowThemeLayer = createEvent<boolean>();
export const $showThemeLayer = restore(onShowThemeLayer, false);

export const onShowFilterSidebar = createEvent<boolean>();
export const $showFilterSidebar = restore(onShowFilterSidebar, false);

export const onShowAdvancedFilter = createEvent<boolean>();
export const $showAdvancedFilter = restore(onShowAdvancedFilter, false);

export const $isProductTour = sample({
  source: combine(mapOverview.router.search, mapOverview.visible),
  fn: ([searchParams, isVisible]) => {
    if (isVisible) {
      onChangeTourStartPopup(true)
    }
    const params = new URLSearchParams(searchParams)
    return params.get('popover') === 'tour'
  }
})

export const onToggleTimeplayer = createEvent<boolean>();
export const $isTimeplayer = restore(onToggleTimeplayer, false);
export const $isLoadedTimePlayer = createStore(false);
export const onPausePlayTimeplayer = createEvent<boolean>();
export const $isPauseTimeplayer = restore(onPausePlayTimeplayer, false);
export const onLoadTimePlayerData = createEvent<boolean>();
export const setLoaderTimePlayer = createEvent<boolean>()
export const $isLoadingTimeplayer = restore(setLoaderTimePlayer, false);
export const onSetTimePlayerCurrentYear = createEvent<number>();
export const $timePlayerCurrentYear = restore(onSetTimePlayerCurrentYear, 0);
export const onTimeoutTimePlayer = createEvent();
export const $timePlayerInfo = combine({
  years: $connectivityYears,
  activeYear: $timePlayerCurrentYear,
  isLoading: $isLoadingTimeplayer,
  isLoaded: $isLoadedTimePlayer
})

export const setSidebarHeight = createEvent<boolean>();
export const $sidebarHeight = restore<boolean>(setSidebarHeight, false);

// all reset model
$connectivityBenchMark.reset(resetFilterModal);
$connectivitySpeedGood.reset([resetFilterModal]);
$connectivitySpeedModerate.reset([resetFilterModal]);
$connectivitySpeednoInternet.reset([resetFilterModal]);
$connectivitySpeedUnknown.reset([resetFilterModal]);
$coverage5g4g.reset([$selectedLayerId, resetCoverageFilterSelection]);
$coverage3g2g.reset([$selectedLayerId, resetCoverageFilterSelection]);
$coverageNoCoverage.reset([$selectedLayerId, resetCoverageFilterSelection]);
$coverageUnknown.reset([$selectedLayerId, resetCoverageFilterSelection]);
$potentialCoverageOpenStatus.reset(onSelectMainLayer);
$schoolStats.reset(mapSchools.visible, $countryCode, $selectedLayerId);
$isMenuOpen.reset(router.historyUpdated)
// $staticLegendsSelected.reset(router.historyUpdated)
// on history update, clear connectivity dates;
$connectivityAvailability.reset(router.historyUpdated, $selectedLayerId);

$isTimeplayer.reset(router.historyUpdated);
$timePlayerCurrentYear.reset($isTimeplayer)
$isLoadedTimePlayer.reset($isTimeplayer)
$isLoadingTimeplayer.reset($isTimeplayer)
$sidebarHeight.reset([router.historyUpdated, $showLegend])

$showAdvancedFilter.reset([$countryCode, $admin1Code, $countrySearchString])

type Layer = { id?: string | number; code?: string; name?: string } | null;

/**
 * Guards for URL handling:
 * - `initialized` prevents applying URL params more than once.
 * - `urlWriteEnabled` prevents URL writes during initial hydration/apply.
 */
let initialized = false;
let urlWriteEnabled = false;

/** Sanitize a string for use in URL tokens (lowercase, alnum, dash, underscore). */
function sanitize(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-') // allow alnum, dash, underscore
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * FLAG_META maps logical flags to:
 * - a fieldName used in the combined $currentLayer output,
 * - the urlParam and optional legendUrlParam names,
 * - functions to get the actual layer and derive legends,
 * - a legendSetter to apply legend tokens (Set<string>) to your stores/events,
 * - clearOnAbsent controls whether to clear legend state when param is absent (default true).
 *
 * Keep legendSetter implementations aligned with your actual effector events/stores.
 */
const FLAG_META: Record<
  string,
  {
    fieldName: string;
    urlParam: string;
    legendUrlParam?: string;
    getLayer: (foundLayer: Layer) => Layer;
    getLegends?: (opts: {
      staticLegendsSelected: string[];
      coverageStatusAll: Record<string, boolean>;
      liveLayerLegendsStatus: Record<string, boolean>;
    }) => string[];
    legendSetter?: (tokens: Set<string>) => void;
    clearOnAbsent?: boolean;
  }
> = {
  isLive: {
    fieldName: 'liveLayer',
    urlParam: 'layer__live',
    legendUrlParam: 'layer__include_legend__connectivity_speed',
    getLayer: (f) => f,
    getLegends: ({ liveLayerLegendsStatus }) =>
      Object.keys(liveLayerLegendsStatus || {}).filter((k) => !!(liveLayerLegendsStatus as any)[k]),
    legendSetter: (set) => {
      changeConnectivitySpeedGood(Boolean(set.has('good')));
      changeConnectivitySpeedModerate(Boolean(set.has('moderate')));
      changeConnectivitySpeednoInternet(Boolean(set.has('no_internet') || set.has('no-internet') || set.has('bad')));
      changeConnectivitySpeedUnknown(Boolean(set.has('unknown')));
    },
    clearOnAbsent: false,
  },

  isStatic: {
    fieldName: 'staticLayer',
    urlParam: 'layer__static',
    legendUrlParam: 'layer__include_legend__coverage_status',
    getLayer: (f) => f,
    getLegends: ({ coverageStatusAll }) =>
      Object.keys(coverageStatusAll || {}).filter((k) => !!(coverageStatusAll as any)[k]),
    legendSetter: (set) => {
      changeCoverage5g4g(Boolean(set.has('good')));
      changeCoverage3g2g(Boolean(set.has('moderate')));
      changeCoverageNoCoverage(Boolean(set.has('bad')));
      changeCoverageUnknown(Boolean(set.has('unknown')));
    },
    clearOnAbsent: false,
  },

  isSchoolStatus: {
    fieldName: 'schoolStatusLayer',
    urlParam: 'layer__schoolStatus',
    legendUrlParam: 'layer__include_legend__school_status',
    getLayer: () => (typeof SCHOOL_STATUS_LAYER !== 'undefined' ? (SCHOOL_STATUS_LAYER as Layer) : null),
    getLegends: ({ staticLegendsSelected }) => (Array.isArray(staticLegendsSelected) ? staticLegendsSelected.slice() : []),
    legendSetter: (set) => {
      staticLegendsSelection(Array.from(set));
    },
    clearOnAbsent: false,
  },
};

/**
 * Combine $currentLayer with all legend-related stores.
 * Add legend-related stores here so $currentLayer contains both selected layer and current legend state.
 */
export const $currentLayer = combine(
  {
    layers: $layersList,
    selectedId: $selectedLayerId,
    typeUtils: $currentLayerTypeUtils,
    // legend sources:
    staticLegendsSelected: $staticLegendsSelected,
    coverageStatusAll: $coverageStatusAll,
    liveLayerLegendsStatus: $liveLayerLegendsStatus,
    activeLayerByCountryCode: $activeLayerByCountryCode,
    currentDefaultLayerIdForUI: $currentDefaultLayerIdForUI,
  },
  (payload): Record<string, any> => {
    const {
      layers,
      selectedId,
      typeUtils,
      staticLegendsSelected,
      coverageStatusAll,
      liveLayerLegendsStatus,
      activeLayerByCountryCode,
      currentDefaultLayerIdForUI,
    } = payload as {
      layers: any[];
      selectedId: string | number | null;
      typeUtils: any;
      staticLegendsSelected: string[];
      coverageStatusAll: Record<string, boolean>;
        liveLayerLegendsStatus: Record<string, boolean>;
      activeLayerByCountryCode: Record<string, boolean>;
        currentDefaultLayerIdForUI: number | null;
    };

    if (!typeUtils) return {};

    // find the selected layer object from the list
    const findLayer = (): Layer => {
      if (!selectedId || !Array.isArray(layers)) return null;
      return layers.find((l: any) => `${l?.id}` === `${selectedId}`) ?? null;
    };
    const found = findLayer();

    const result: Record<string, any> = {};

    // determine if any flag is explicitly enabled; use schoolStatus as default when none enabled
    const anyFlagEnabled = Object.keys(FLAG_META).some((flag) => Boolean((typeUtils as any)[flag]));

    Object.keys(FLAG_META).forEach((flag) => {
      const isEnabled = Boolean((typeUtils as any)[flag]) || (!anyFlagEnabled && flag === 'isSchoolStatus');
      if (!isEnabled) return;

      const meta = FLAG_META[flag];

      // set layer object for this flag
      result[meta.fieldName] = meta.getLayer(found);

      // compute and attach legend tokens for URL writing if provider exists
      if (meta.getLegends) {
        const legends = meta.getLegends({
          staticLegendsSelected,
          coverageStatusAll,
          liveLayerLegendsStatus,
        }) || [];
        result[`${meta.fieldName}Legends`] = Array.isArray(legends) ? legends.map(String) : [];
      }
    });

    return result;
  }
);

/**
 * Event that accepts an object shaped like $currentLayer's output and writes URL params.
 * The watcher will build and replace URL using history.replaceState.
 */
const updateUrlWithLayers = createEvent<Record<string, any>>();

updateUrlWithLayers.watch((layersObj) => {
  if (typeof window === 'undefined') return;
  if (!urlWriteEnabled) return;

  try {
    const url = new URL(window.location.href);
    const params = url.searchParams;

    // Write layer__ params
    Object.values(FLAG_META).forEach((meta) => {
      const layer = (layersObj as any)[meta.fieldName] as Layer | undefined;
      const key = meta.urlParam?.toLowerCase();
      if (layer && layer.id != null && key) {
        const rawCode =
          (typeof layer.code === 'string' && layer.code.trim() !== '')
            ? layer.code
            : (typeof layer.name === 'string' && layer.name.trim() !== '')
              ? layer.name
              : String(layer.id);
        params.set(key, `${String(layer.id)}_${sanitize(String(rawCode))}`);
      } else if (key) {
        params.delete(key);
      }
    });

    // Write legend params (if present)
    Object.values(FLAG_META).forEach((meta) => {
      const legendKey = meta.legendUrlParam?.toLowerCase();
      if (!legendKey) return;
      const legends = (layersObj as any)[`${meta.fieldName}Legends`] as string[] | undefined;
      if (Array.isArray(legends) && legends.length > 0) {
        const sanitized = legends
          .map((l) => String(l).trim())
          .filter(Boolean)
          .map((l) => sanitize(l))
          .filter(Boolean);
        if (sanitized.length) params.set(legendKey, sanitized.join(','));
        else params.delete(legendKey);
      } else {
        params.delete(legendKey);
      }
    });

    // global 'layer' flag exists if any layer__ params present
    const hasAnyLayerParam = Array.from(params.keys()).some((k) => k.toLowerCase().startsWith('layer__'));
    if (hasAnyLayerParam) params.set('layer', 'true');
    else params.delete('layer');

    const newUrl = url.pathname + (params.toString() ? `?${params.toString()}` : '') + url.hash;
    const currentUrl = window.location.pathname + window.location.search + window.location.hash;
    if (newUrl !== currentUrl) window.history.replaceState(null, '', newUrl);
  } catch (err) {
    // swallow errors to avoid breaking the app flow
  }
});

export const triggerUpdateUrl = createEvent<void>();

// Sample to trigger URL write when required. Keep onSelectMainLayer in the clock array if you want writes on main-layer selection.
sample({
  source: $currentLayer,
  clock: [triggerUpdateUrl, onSelectMainLayer],
  target: updateUrlWithLayers,
});

/* --------------------- URL parsing & apply (refactored) --------------------- */

/* Parse "<id>_<raw>" into parts. If underscore missing, raw is empty string. */
function parseLayerParamValue(value: string | null) {
  if (!value) return null;
  const idx = value.indexOf('_');
  if (idx === -1) return { id: value, raw: '' };
  return { id: value.slice(0, idx), raw: value.slice(idx + 1) };
}

/* Convert "a,b,c" -> ['a','b','c'] (lowercased, trimmed). */
function parseLegendParamValue(value: string | null) {
  if (!value) return [];
  return value
    .split(',')
    .map((s) => String(s).trim())
    .filter(Boolean)
    .map((s) => s.toLowerCase());
}

/* Read layer-related params from current URL when the global 'layer' flag is 'true'. */
function readLayerParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const url = new URL(window.location.href);
  const params = url.searchParams;
  const layerFlag = params.get('layer');
  if (layerFlag !== 'true') return {}; // no layer intent
  const out: Record<string, string> = {};
  params.forEach((value, key) => {
    const k = key.toLowerCase();
    if (k.startsWith('layer')) out[k] = value;
  });
  return out;
}

/* Convert raw legend param string -> Set of normalized tokens (underscores instead of dashes). */
const tokensToSet = (raw?: string) => {
  if (!raw) return new Set<string>();
  return new Set(
    parseLegendParamValue(raw)
      .map((t) => t.replace(/-/g, '_'))
      .map((t) => t.trim())
      .filter(Boolean)
  );
};

/**
 * Apply URL params to app state once during initialization:
 * - reads known layer and legend params,
 * - dispatches existing effector events to set initial selection/legend state,
 * - enables URL writer after initial hydration is complete.
 *
 * Call this once on app init (client-side) when effector stores/events are ready.
 */
export const applyUrlParams = () => {
  if (initialized) return;
  initialized = true;

  const layerParams = readLayerParams();
  if (!layerParams || Object.keys(layerParams).length === 0) {
    // no params to apply — allow URL writer to run for future changes
    urlWriteEnabled = true;
    return;
  }

  /* helper to read known params in a case-insensitive way */
  const getParam = (k: string) => layerParams[k.toLowerCase()] ?? null;

  const schoolRaw = getParam('layer__schoolstatus');
  const staticRaw = getParam('layer__static');
  const liveRaw = getParam('layer__live');

  const schoolId = schoolRaw ? Number(parseLayerParamValue(schoolRaw)?.id) : null;
  const staticId = staticRaw ? Number(parseLayerParamValue(staticRaw)?.id) : null;
  const liveId = liveRaw ? Number(parseLayerParamValue(liveRaw)?.id) : null;

  // Prefer live -> static for setting the preferred layer id for UI
  setUrlPreferredLayer({
    hasIdInUrl: String(layerParams['layer']) === 'true',
    layerId: liveId ?? staticId,
  });

  // apply school status selection (send null if invalid)
  onSelectSchoolStatusLayer(typeof schoolId === 'number' && !Number.isNaN(schoolId) && schoolId !== 0 ? schoolId : null);

  // decide preferred layer id and dispatch checks/selection
  const urlPreferredLayer = (typeof liveId === 'number' && !Number.isNaN(liveId) && liveId !== 0)
    ? liveId
    : (typeof staticId === 'number' && !Number.isNaN(staticId) && staticId !== 0)
      ? staticId
      : null;

  if (urlPreferredLayer) {
    checkConnectivityBenchmark(urlPreferredLayer);
    onSelectMainLayer(urlPreferredLayer);
  }

  // apply legend setters (call with Set of tokens) or clear when absent (unless clearOnAbsent is false)
  Object.values(FLAG_META).forEach((meta) => {
    const key = (meta.legendUrlParam || '').toLowerCase();
    if (!key) return;

    const raw = layerParams[key] ?? null;
    if (raw) {
      const set = tokensToSet(raw as string);
      if (meta.legendSetter) meta.legendSetter(set);
    } else {
      if (meta.clearOnAbsent !== false && meta.legendSetter) {
        meta.legendSetter(new Set());
      }
    }
  });

  // enable URL writer now that initial state is applied
  urlWriteEnabled = true;
};
