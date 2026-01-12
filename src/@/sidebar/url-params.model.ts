import { combine, createEffect, createEvent, createStore, merge, restore, sample } from 'effector';

import { fetchAdvanceFilterFx, fetchCountriesFx, fetchCountryFx, fetchLayerListFx } from '~/api/project-connect';
import { $lng, onLanguageChange } from '~/core/i18n/store';

import { $admin1Code, $country } from '../country/country.model';
import { ConnectivityStatusDistribution } from './sidebar.constant';
import {
  $connectivitySpeedGood,
  $connectivitySpeedModerate,
  $connectivitySpeednoInternet,
  $connectivitySpeedUnknown,
  $coverage3g2g,
  $coverage5g4g,
  $coverageNoCoverage,
  $coverageUnknown,
  $schoolStatusSelectedLayer,
  $selectedLayerId,
  $selectedSchoolIds,
  $staticLegendsSelected,
  changeConnectivitySpeedGood,
  changeConnectivitySpeedModerate,
  changeConnectivitySpeednoInternet,
  changeConnectivitySpeedUnknown,
  changeCoverage3g2g,
  changeCoverage5g4g,
  changeCoverageNoCoverage,
  changeCoverageUnknown,
  staticLegendsSelection,
} from './sidebar.model';
import { getUrlParams, parseBoolParam, parseNumberParam, setBoolParam, setNumberParam, URL_PARAM_KEYS } from './url-params.util';


export const setAppSettled = createEvent<boolean>();
export const $isAppSettled = restore(setAppSettled, false);

const $isCountrySettled = createStore(false);
const $isCountriesSettled = createStore(false);
const $isLayersSettled = createStore(false);
const $isFilterSettled = createStore(false);

$isCountrySettled.on(fetchCountryFx.doneData, () => true);
$isCountriesSettled.on(fetchCountriesFx.doneData, () => true);
$isLayersSettled.on(fetchLayerListFx.doneData, () => true);
$isFilterSettled.on(fetchAdvanceFilterFx.doneData, () => true);

sample({
  source: combine($isCountrySettled, $isCountriesSettled, $isLayersSettled, $isFilterSettled, (...all) => all.every(Boolean)),
  filter: (isAllDone: boolean) => isAllDone,
  target: setAppSettled
})

// Track if URL params have been consumed on initial load
export const $urlParamsConsumed = createStore(false);
export const markUrlParamsConsumed = createEvent();
$urlParamsConsumed.on(markUrlParamsConsumed, () => true);


// Check if current route is mapOverview (global map without country)
const isMapOverviewRoute = (): boolean => {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname;
  return path === '/map' || path === '/map/';
};

// Read initial URL params
export const getInitialUrlParams = () => {
  const params = getUrlParams();

  // On /map overview route, don't use URL params - return defaults
  if (isMapOverviewRoute()) {
    return {
      layerId: null,
      schoolStatusLayer: null,
      speedGood: true,
      speedModerate: true,
      speedNoInternet: true,
      speedUnknown: true,
      coverage5g4g: true,
      coverage3g2g: true,
      coverageNo: true,
      coverageUnknown: true,
      schoolStatusLegends: [
        ConnectivityStatusDistribution.connected,
        ConnectivityStatusDistribution.notConnected,
        ConnectivityStatusDistribution.unknown,
      ],
      language: params.get(URL_PARAM_KEYS.LANGUAGE), // Keep language
    };
  }

  // Parse school status legends
  const ssConnected = parseBoolParam(params.get(URL_PARAM_KEYS.SS_CONNECTED), true);
  const ssNotConnected = parseBoolParam(params.get(URL_PARAM_KEYS.SS_NOT_CONNECTED), true);
  const ssUnknown = parseBoolParam(params.get(URL_PARAM_KEYS.SS_UNKNOWN), true);

  // Build school status legends array
  const schoolStatusLegends: string[] = [];
  if (ssConnected) schoolStatusLegends.push(ConnectivityStatusDistribution.connected);
  if (ssNotConnected) schoolStatusLegends.push(ConnectivityStatusDistribution.notConnected);
  if (ssUnknown) schoolStatusLegends.push(ConnectivityStatusDistribution.unknown);

  return {
    layerId: parseNumberParam(params.get(URL_PARAM_KEYS.LAYER_ID)),
    isLayerIdNull: params.get(URL_PARAM_KEYS.LAYER_ID) === 'null',
    schoolStatusLayer: parseNumberParam(params.get(URL_PARAM_KEYS.SCHOOL_STATUS_LAYER)),
    isSchoolStatusLayerNull: params.get(URL_PARAM_KEYS.SCHOOL_STATUS_LAYER) === 'null',
    speedGood: parseBoolParam(params.get(URL_PARAM_KEYS.SPEED_GOOD), true),
    speedModerate: parseBoolParam(params.get(URL_PARAM_KEYS.SPEED_MODERATE), true),
    speedNoInternet: parseBoolParam(params.get(URL_PARAM_KEYS.SPEED_NO_INTERNET), true),
    speedUnknown: parseBoolParam(params.get(URL_PARAM_KEYS.SPEED_UNKNOWN), true),
    coverage5g4g: parseBoolParam(params.get(URL_PARAM_KEYS.COVERAGE_5G4G), true),
    coverage3g2g: parseBoolParam(params.get(URL_PARAM_KEYS.COVERAGE_3G2G), true),
    coverageNo: parseBoolParam(params.get(URL_PARAM_KEYS.COVERAGE_NO), true),
    coverageUnknown: parseBoolParam(params.get(URL_PARAM_KEYS.COVERAGE_UNKNOWN), true),
    schoolStatusLegends,
    language: params.get(URL_PARAM_KEYS.LANGUAGE),
  };
};

// Store for initial URL params (captured once on load)
export const $initialUrlParams = createStore(getInitialUrlParams());

// Combined store for all URL-tracked values
export const $urlTrackedParams = combine({
  layerId: $selectedLayerId,
  schoolStatusLayer: $schoolStatusSelectedLayer,
  speedGood: $connectivitySpeedGood,
  speedModerate: $connectivitySpeedModerate,
  speedNoInternet: $connectivitySpeednoInternet,
  speedUnknown: $connectivitySpeedUnknown,
  coverage5g4g: $coverage5g4g,
  coverage3g2g: $coverage3g2g,
  coverageNo: $coverageNoCoverage,
  coverageUnknown: $coverageUnknown,
  schoolStatusLegends: $staticLegendsSelected,
  language: $lng,
});

// Effect to update URL params
const updateUrlParamsFx = createEffect((params: ReturnType<typeof $urlTrackedParams.getState>) => {

  const url = new URL(window.location.href);
  const searchParams = url.searchParams;

  // On /map overview route, only keep language param
  if (isMapOverviewRoute()) {
    // Clear all params except language
    const keysToDelete = Array.from(searchParams.keys()).filter(key => key !== URL_PARAM_KEYS.LANGUAGE);
    keysToDelete.forEach(key => searchParams.delete(key));

    // Update language if needed
    if (params.language && params.language !== 'en') {
      searchParams.set(URL_PARAM_KEYS.LANGUAGE, params.language);
    } else {
      searchParams.delete(URL_PARAM_KEYS.LANGUAGE);
    }

    const newUrl = `${url.pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}${url.hash}`;
    window.history.replaceState(window.history.state, '', newUrl);
    return;
  }

  // For other routes, update all params
  // Update layer params
  setNumberParam(searchParams, URL_PARAM_KEYS.LAYER_ID, params.layerId ?? 'null');
  setNumberParam(searchParams, URL_PARAM_KEYS.SCHOOL_STATUS_LAYER, params.schoolStatusLayer ?? 'null');

  // Update connectivity speed params (only set if false)
  setBoolParam(searchParams, URL_PARAM_KEYS.SPEED_GOOD, params.speedGood);
  setBoolParam(searchParams, URL_PARAM_KEYS.SPEED_MODERATE, params.speedModerate);
  setBoolParam(searchParams, URL_PARAM_KEYS.SPEED_NO_INTERNET, params.speedNoInternet);
  setBoolParam(searchParams, URL_PARAM_KEYS.SPEED_UNKNOWN, params.speedUnknown);

  // Update coverage params (only set if false)
  setBoolParam(searchParams, URL_PARAM_KEYS.COVERAGE_5G4G, params.coverage5g4g);
  setBoolParam(searchParams, URL_PARAM_KEYS.COVERAGE_3G2G, params.coverage3g2g);
  setBoolParam(searchParams, URL_PARAM_KEYS.COVERAGE_NO, params.coverageNo);
  setBoolParam(searchParams, URL_PARAM_KEYS.COVERAGE_UNKNOWN, params.coverageUnknown);

  // Update school status legends (only set if unchecked)
  setBoolParam(searchParams, URL_PARAM_KEYS.SS_CONNECTED, params.schoolStatusLegends.includes(ConnectivityStatusDistribution.connected));
  setBoolParam(searchParams, URL_PARAM_KEYS.SS_NOT_CONNECTED, params.schoolStatusLegends.includes(ConnectivityStatusDistribution.notConnected));
  setBoolParam(searchParams, URL_PARAM_KEYS.SS_UNKNOWN, params.schoolStatusLegends.includes(ConnectivityStatusDistribution.unknown));

  // Update language param (only set if not default)
  if (params.language && params.language !== 'en') {
    searchParams.set(URL_PARAM_KEYS.LANGUAGE, params.language);
  } else {
    searchParams.delete(URL_PARAM_KEYS.LANGUAGE);
  }

  // Update URL without page reload using replaceState
  const newUrl = `${url.pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}${url.hash}`;
  window.history.replaceState(window.history.state, '', newUrl);
});

// Event to initialize stores from URL params
export const initializeFromUrlParams = createEvent();

// Effect to apply URL params to stores
const applyUrlParamsToStoresFx = createEffect(() => {
  const params = getInitialUrlParams();

  // Apply connectivity speed params (always apply to sync with URL)
  changeConnectivitySpeedGood(params.speedGood);
  changeConnectivitySpeedModerate(params.speedModerate);
  changeConnectivitySpeednoInternet(params.speedNoInternet);
  changeConnectivitySpeedUnknown(params.speedUnknown);

  // Apply coverage params (always apply to sync with URL)
  changeCoverage5g4g(params.coverage5g4g);
  changeCoverage3g2g(params.coverage3g2g);
  changeCoverageNoCoverage(params.coverageNo);
  changeCoverageUnknown(params.coverageUnknown);

  // Apply school status legends
  staticLegendsSelection(params.schoolStatusLegends);

  // Apply language param (i18next handles this via URL detection)
  if (params.language) {
    void onLanguageChange(params.language);
  }

  return params;
});

// Initialize from URL params on app start
sample({
  clock: initializeFromUrlParams,
  target: applyUrlParamsToStoresFx,
});

// Mark params as consumed after initialization
sample({
  clock: applyUrlParamsToStoresFx.done,
  target: markUrlParamsConsumed,
});

// Update URL when any tracked param changes (after initial load)
sample({
  clock: merge([
    $country,
    $admin1Code,
    $selectedSchoolIds,
    $selectedLayerId,
    $schoolStatusSelectedLayer,
    $connectivitySpeedGood,
    $connectivitySpeedModerate,
    $connectivitySpeednoInternet,
    $connectivitySpeedUnknown,
    $coverage5g4g,
    $coverage3g2g,
    $coverageNoCoverage,
    $coverageUnknown,
    $staticLegendsSelected,
    $lng,
  ]),
  source: combine({
    params: $urlTrackedParams,
    consumed: $urlParamsConsumed,
  }),
  filter: ({ consumed }) => consumed,
  fn: ({ params }) => params,
  target: updateUrlParamsFx,
});

