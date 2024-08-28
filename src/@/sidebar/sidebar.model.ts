import { ConnectivityDistributionNames, getConnectivityLogicalValues, LayerDistributionUnit } from './ui/global-and-country-view-components/container/layer-view.constant';
import { combine, createEvent, createStore, restore, sample } from 'effector';

import { $country, $countryBenchmark, $countryCode, $countryIdToCode, $countrySearchString, $admin1Code, $countryConnectivityNames, $countryActiveLayersDataById } from '~/@/country/country.model';
import { $stylePaintData } from '~/@/map/map.model';
import { fetchConnectivityLayerFx, fetchCountriesFx, fetchCountryFx, fetchCountryLiveLayerInfo, fetchCountryStaticLayerInfo, fetchCoverageLayerFx, fetchGlobalStatsFx, fetchLayerInfoFx, fetchLayerListFx, fetchSchoolLayerInfoFx } from '~/api/project-connect';
import { ConnectivityStat, CountryBasic, SchoolStatsType } from '~/api/types';
import { mapOverview, mapSchools, router } from '~/core/routes';
import { setPayload, setPayloadResults } from '~/lib/effector-kit';

import { getSchoolAvailableDates } from './effects/search-country-fx';
import { ConnectivityBenchMarks, ConnectivityDistribution, ConnectivityStatusDistribution, getDefaultFormula, Layers, multiSchoolSelection, SCHOOL_STATUS_LAYER } from './sidebar.constant';
import { ConnectivityConfig, CoverageStat, LayerType, LayerTypeChoices, MultischoolSelectionStats, SelectedSchool } from './types';
import { isLiveLayer, isStaticLayer } from './sidebar.util';
import { evaluateExpression } from '~/lib/utils';
import { onChangeTourStartPopup } from '../product-tour/models/product-tour.model';

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
$coverageStats.on(fetchCoverageLayerFx.doneData, setPayload);
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

// layer model 
export const $layersList = createStore<LayerType[]>([]);
$layersList.on(fetchLayerListFx.doneData, setPayloadResults)

export const $connectivityLayers = $layersList.map((layers) => layers?.filter(layer => layer?.type === LayerTypeChoices.LIVE).sort((a) => a.created_by ? 0 : -1) || [])
export const $staticLayers = $layersList.map((layers) => layers?.filter(layer => layer?.type === LayerTypeChoices.STATIC) || [])

export const onSelectSchoolStatusLayer = createEvent<number | null>();
export const $schoolStatusSelectedLayer = restore(onSelectSchoolStatusLayer, SCHOOL_STATUS_LAYER.id);

export const onSelectMainLayer = createEvent<number | null>();
export const $selectedLayerId = restore(onSelectMainLayer, null);
export const $downloadLayerData = $layersList.map(layers => layers?.find(layer => layer?.type === LayerTypeChoices.LIVE && !layer.created_by) ?? null);
export const $downloadLayerId = $downloadLayerData.map(layer => layer?.id ?? null);
export const $coverageLayerData = $layersList.map(layers => layers?.find(layer => layer?.type === LayerTypeChoices.STATIC && !layer.created_by) ?? null);
export const $coverageLayerId = $coverageLayerData.map(layer => layer?.id ?? null);
export const $downloadDynamicLayerData = $layersList.map(layers => layers?.find(layer => layer?.type === LayerTypeChoices.LIVE && layer.created_by && Object.values(layer.data_source_column ?? {})[0].name === 'connectivity_speed') ?? null);
export const $downloadDynamicLayerId = $downloadDynamicLayerData.map(layer => layer?.id ?? null);
export const $coverageDynamicLayerData = $layersList.map(layers => layers?.find(layer => layer?.type === LayerTypeChoices.STATIC && layer.created_by && Object.values(layer.data_source_column ?? {})[0].name === 'coverage_type') ?? null);
export const $coverageDynamicLayerId = $coverageDynamicLayerData.map(layer => layer?.id ?? null);

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

export const $currentDefaultLayerId = combine($countryCode, $activeLayerByCountries, $downloadLayerId, (countryCode, activeLayers, downloadLayerId) => {
  const layerId = activeLayers.countryDefaultLayerList[countryCode?.toLowerCase()] ?? null//downloadLayerId;
  return activeLayers.list[layerId]?.activeCountries?.includes?.(countryCode?.toLowerCase()) ? layerId : null;
})
export const $isActiveCurrentLayer = combine($activeLayerByCountries, $selectedLayerId, $countryCode, (activeLayers, selectedId, countryCode) => {
  return !!selectedId && activeLayers.list[selectedId]?.activeCountries.includes(countryCode.toLowerCase())
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
  connectivityBenchmark: $connectivityBenchMark
}, ({ selectedLayerData, currentLayerTypeUtils, stylePaintData, connectivityBenchmark, countryActiveLayersDataById }) => {
  let apiLegends = selectedLayerData?.legend_configs;
  console.log(apiLegends,)
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
      label: ConnectivityDistributionNames[key],
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
  const { convert_unit: unit, value, benchmark_type: globalConnectivityName } = global_benchmark;
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
    globalConnectivityName,
    countryConnectivityNames
  })
});

export const $isNationalBenchmark = $benchmarkmarkUtils.map(({ isNational }) => isNational);

export const $layerUtils = combine({
  layers: $layersList,
  liveLayers: $connectivityLayers,
  staticLayers: $staticLayers,
  selectedLayerId: $selectedLayerId,
  selectedLayerData: $selectedLayerData,
  downloadLayerId: $downloadLayerId,
  downloadLayerData: $downloadLayerData,
  downloadDynamicLayerId: $downloadDynamicLayerId,
  downloadDynamicLayerData: $downloadDynamicLayerData,
  coverageDynamicLayerId: $coverageDynamicLayerId,
  coverageDynamicLayerData: $coverageDynamicLayerData,
  coverageLayerId: $coverageLayerId,
  coverageLayerData: $coverageLayerData,
  currentLayerTypeUtils: $currentLayerTypeUtils,
  currentLayerLegends: $currentLayerLegends,
  isActiveCurrentLayer: $isActiveCurrentLayer,
  activeLayerByCountryCode: $activeLayerByCountryCode,
  currentDefaultLayerId: $currentDefaultLayerId
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
    if (payload === '') {
      return [];
    }
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

export const resetCoverageFilterSelection = createEvent();

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

export const $indicatorBenchmark = combine($country, (country) => {
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
$connectivitySpeedGood.reset([resetFilterModal, router.historyUpdated]);
$connectivitySpeedModerate.reset([resetFilterModal, router.historyUpdated]);
$connectivitySpeednoInternet.reset([resetFilterModal, router.historyUpdated]);
$connectivitySpeedUnknown.reset([resetFilterModal, router.historyUpdated]);
$coverage5g4g.reset([$selectedLayerId, resetCoverageFilterSelection]);
$coverage3g2g.reset([$selectedLayerId, resetCoverageFilterSelection]);
$coverageNoCoverage.reset([$selectedLayerId, resetCoverageFilterSelection]);
$coverageUnknown.reset([$selectedLayerId, resetCoverageFilterSelection]);
$potentialCoverageOpenStatus.reset(onSelectMainLayer);
$schoolStats.reset(mapSchools.visible, $countryCode, $selectedLayerId);
$isMenuOpen.reset(router.historyUpdated)
$staticLegendsSelected.reset(router.historyUpdated)
// on history update, clear connectivity dates;
$connectivityAvailability.reset(router.historyUpdated, $selectedLayerId);

$isTimeplayer.reset(router.historyUpdated);
$timePlayerCurrentYear.reset($isTimeplayer)
$isLoadedTimePlayer.reset($isTimeplayer)
$isLoadingTimeplayer.reset($isTimeplayer)
$sidebarHeight.reset([router.historyUpdated, $showLegend])

$showAdvancedFilter.reset([$countryCode, $admin1Code, $countrySearchString])