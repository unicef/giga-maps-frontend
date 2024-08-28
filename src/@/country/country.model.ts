import { combine, createEvent, createStore, guard, merge, restore, sample } from 'effector';

import { fetchCountriesFx, fetchCountryFx } from '~/api/project-connect';
import {
  Country,
  CountryBasic
} from '~/api/types';
import { $isMobile } from '~/core/media-query';
import { mapCountry, mapOverview, mapSchools } from '~/core/routes';
import { setPayload } from '~/lib/effector-kit';

import { PointCoordinates } from "../../core/global-types";
import { defaultWorldView } from '../map/map.constant';
import { $isAdminBoundaries, $isTilesAndLables, $map, $style, $stylePaintData, onReloadedMap } from '../map/map.model';
import { getCountryAdminCode } from './country.utils';
import { addCountriesFx, zoomToCountryFx } from './effects';
import { createUpdateCountriesLayer } from './effects/create-update-countries-layer';
import { getUserCurrentCountryISOFx } from './effects/detect-country-iso';
import { updateLookupSourceForAdmin0, updateLookupSourceForAdmin1 } from './effects/update-lookup-source-map';

export const onLoadPage = createEvent();
export const changeCountryCode = createEvent<string>();
export const $countryCode = createStore<string>('');
$countryCode.on(changeCountryCode, setPayload);
export const $admin1Code = mapCountry.params.map((params) => (params?.path && getCountryAdminCode(params?.path)?.admin1) || null);

export const $countries = createStore<CountryBasic[] | null>(null);
$countries.on(fetchCountriesFx.doneData, setPayload);

export const $countryIdToCode = $countries.map((countries) => countries?.reduce((acc, country) => {
  acc[country.id] = country.code.toLowerCase()
  return acc;
}, {} as Record<string, string>) ?? {});

export const $country = createStore<Country | null>(null);
$country.on(fetchCountryFx.doneData, setPayload);
export const $dataSource = $country.map((country) => country?.data_source ?? null);
export const $isLoadinCountry = fetchCountryFx.pending;
export const $countryBenchmark = $country.map((country) => country?.benchmark_metadata?.live_layer ?? {});
export const $countryConnectivityNames = $country.map((country) => country?.benchmark_metadata?.benchmark_types ?? {});
export const $countryDefaultNational = $country.map((country) => country?.benchmark_metadata?.default_national_benchmark ?? {});
export const $countryActiveLayersDataById = $country.map((country) => country?.active_layers_list?.reduce((acc, layer) => ({ ...acc, [layer.data_layer_id]: layer }), {} as Record<string, any>) ?? {});

export const $admin1Data = sample({
  source: combine($country, $admin1Code, (country, admin1Code) => {
    if (country && admin1Code) {
      return country.admin1_metadata.find((admin) => admin.giga_id_admin === admin1Code) ?? null;
    }
    return null;
  })
});
export const $admin1Id = $admin1Data.map((data) => data?.id ?? null);
export const $admin1Name = $admin1Data.map((data) => (data?.name ?? data?.name_en) ?? null);

export const setSchoolFocusLatLng = createEvent<PointCoordinates>();
export const $schoolFocusLatLng = restore<PointCoordinates>(setSchoolFocusLatLng, null);
export const onRecenterView = createEvent();
export const $worldview = createStore<string>(defaultWorldView);
$worldview.on(getUserCurrentCountryISOFx.doneData, setPayload);

export const setZoomCountryCode = createEvent<string>();
export const $zoomedCountryCode = restore(setZoomCountryCode, '');
$zoomedCountryCode.on(zoomToCountryFx.doneData, setPayload);

export const $countrySearchParams = mapCountry.router.search.map(search => {
  const searchParams = new URLSearchParams(search);
  // iterate over all params and try to parse them to numbers
  const filterSearchParams = new URLSearchParams();
  const urlFieldList: Record<string, { field: string; filter: string; value: string }> = {};
  for (const [key, value] of searchParams.entries()) {
    try {
      const [start, field, filter] = key.split('__');
      if (start === 'filter' && field && filter) {
        filterSearchParams.set(`${field}__${filter}`, value);
        urlFieldList[field] = { field, filter, value };
      }
    } catch (e) { }
  }
  return {
    searchParams: filterSearchParams.toString(),
    urlFieldList,
    selectedCount: Object.keys(urlFieldList).length
  };
});

export const $countrySearchString = $countrySearchParams.map(params => params.searchParams);

const $mapContext = combine({
  map: $map,
  paintData: $stylePaintData,
  country: $country,
  countryCode: $countryCode,
  zoomedCountryCode: $zoomedCountryCode,
  isMobile: $isMobile,
});

// school view
sample({
  clock: merge([$map, mapSchools.router.historyUpdate, mapCountry.params]),
  source: combine({
    schoolParams: mapSchools.router.search,
    countryParams: mapCountry.params,
    isSchoolView: mapSchools.visible,
    isCountryView: mapCountry.visible,
  }),
  fn: ({ schoolParams, isCountryView, isSchoolView, countryParams }) => {
    let countryCode = '';
    if (isCountryView) {
      countryCode = countryParams?.code ?? ''
    } else if (isSchoolView) {
      const params = new URLSearchParams(schoolParams);
      countryCode = params.get('country')?.toLowerCase() ?? '';
    }
    return countryCode;
  },
  target: changeCountryCode
});

// Routing


// Fetch country data and schools data
sample({
  source: $countryCode,
  filter: (countryCode) => Boolean(countryCode),
  target: fetchCountryFx,
});

// Check received country for relevance
export const countryReceived = guard({
  source: sample({
    source: $countryCode,
    clock: fetchCountryFx.done,
    fn: (countryCode, { params }) => ({
      countryCode,
      doneCountryCode: params,
    }),
  }),
  filter: ({ countryCode, doneCountryCode }) => countryCode === doneCountryCode,
})

sample({
  source: combine($mapContext),
  clock: merge([$map, onReloadedMap]),
  fn: ([{ map, paintData, countryCode }]) => ({
    map,
    paintData,
    countryCode,
  }),
  filter: (_, clock) => {
    return Boolean(clock);
  },
  target: addCountriesFx,
});

sample({
  clock: merge([
    addCountriesFx.doneData,
    mapCountry.router.historyUpdate,
    updateLookupSourceForAdmin1.doneData,
    $isTilesAndLables, $isAdminBoundaries
  ]),
  source: combine({
    mapContext: $mapContext,
    params: mapCountry.params,
    isMobile: $isMobile,
    isAdminBoundaries: $isAdminBoundaries,
    isTilesAndLables: $isTilesAndLables,
    worldView: $worldview,
    style: $style
  }),
  fn: ({ mapContext, params, ...others }) => {
    const { admin1: admin1Code } = getCountryAdminCode(params?.path);
    const levelsCode = [mapContext.countryCode, admin1Code].filter(Boolean)
    const levelLength = levelsCode.length;
    return {
      ...mapContext,
      selectedLevel: levelLength,
      levelsCode,
      ...others
    }
  },
  target: createUpdateCountriesLayer
});

// Zoom to country bounds
sample({
  clock: merge([countryReceived, createUpdateCountriesLayer.doneData, $schoolFocusLatLng, onRecenterView]),
  source: combine({ mapContext: $mapContext, params: mapCountry.params, schoolFocusLatLng: $schoolFocusLatLng }),
  fn: ({ mapContext, params, schoolFocusLatLng }) => {
    const { admin1: admin1Code } = getCountryAdminCode(params?.path);
    const levelsCode = [mapContext.countryCode, admin1Code].filter(Boolean)
    const levelLength = levelsCode.length;
    return {
      ...mapContext,
      levelsCode,
      selectedLevel: levelLength,
      schoolFocusLatLng
    }
  },
  target: zoomToCountryFx,
});

sample({
  clock: merge([$country, $map]),
  source: combine({ map: $map, country: $country }),
  fn: ({ map, country }) => ({
    map,
    admin1List: country?.admin1_metadata
  }),
  filter: ({ map, country }) => Boolean(map && country),
  target: updateLookupSourceForAdmin1
})

sample({
  clock: merge([$map, $countries]),
  source: combine({ map: $map, countries: $countries }),
  fn: ({ map, countries }) => ({
    map,
    countries
  }),
  filter: ({ map, countries }) => Boolean(map && countries),
  target: updateLookupSourceForAdmin0
})

// call and get country iso on page load
sample({
  clock: onLoadPage,
  target: getUserCurrentCountryISOFx
})

onLoadPage();
$countryCode.reset(mapOverview.visible);
$country.reset($countryCode, fetchCountryFx.fail, mapOverview.visible);
$schoolFocusLatLng.reset(mapSchools.router.historyUpdated)
$zoomedCountryCode.reset(onRecenterView);

