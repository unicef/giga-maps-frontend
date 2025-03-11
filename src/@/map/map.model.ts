import { createEvent, createStore, restore } from 'effector';

import { fetchAdvanceFilterFx, fetchGlobalStatsFx, fetchSchoolPopupDataFx } from '~/api/project-connect';
import { AdvanceFilterType, GlobalStats, SchoolStatsType } from '~/api/types';
import { GeoJSONPoint } from '~/core/global-types';
import { map } from '~/core/routes';
import { setPayload, setPayloadResults } from '~/lib/effector-kit';

import {
  defaultGigaLayers,
  defaultGlobalStats,
  defaultStyle,
  filterListMapping,
  stylePaintData,
} from './map.constant';
import { Center, Map, MapType, Marker, SchoolMarker, Style, StylePaintData } from './map.types';
import { filterTranslationFx } from '../sidebar/effects/all-translation-fx';
import { extractDataWithMapping, reconstructJson } from '~/lib/utils/json-mapper.util';

export const $reloadStyle = createStore<boolean>(false);
export const onReloadedMap = createEvent();
export const changeMapType = createEvent<MapType>();
export const onStyleLoaded = createEvent();
export const setCenter = createEvent<Center>();
export const zoomIn = createEvent();
export const zoomOut = createEvent();
export const setLoader = createEvent<Marker>();
export const onLoadPage = createEvent();
export const onZoomStateChange = createEvent<'start' | 'end' | null>();
export const $zoomState = createStore<'start' | 'end' | null>(null);
$zoomState.on(onZoomStateChange, setPayload);

export const updateSchoolMarker = createEvent<SchoolMarker[]>()
export const $schoolMarkers = createStore<SchoolMarker[]>([])
  .on(updateSchoolMarker, setPayload);

export const changeMap = createEvent<Map>();
export const $map = createStore<Map | null>(null);
$map.on(changeMap, setPayload);

export const changeStyle = createEvent<Style>();
export const $style = createStore<Style>(defaultStyle);
$style.on(changeStyle, setPayload);

export const onEnableAdminBoundaries = createEvent<boolean>();
export const $isAdminBoundaries = restore(onEnableAdminBoundaries, true);

export const onEnableTitlesAndLabels = createEvent<boolean>()
export const $isTilesAndLables = restore(onEnableTitlesAndLabels, true);

export const $stylePaintData = createStore<StylePaintData>(
  stylePaintData[defaultStyle]
);
export const $globalStats = createStore<GlobalStats>(defaultGlobalStats);
$globalStats.on(fetchGlobalStatsFx.doneData, setPayload);

export const $pending = createStore<boolean>(false);
export const $loader = createStore<Marker | null>(null);
$loader.on(setLoader, setPayload);

export const changeSchoolConnectedOpenStatus = createEvent<boolean>();
export const resetSchoolConnectedOpenStatus = createEvent<boolean>();
export const $schoolConnectedOpenStatus = createStore<boolean>(true);
$schoolConnectedOpenStatus.on(changeSchoolConnectedOpenStatus, setPayload);

export const $schoolInfoOpenStatus = createStore<boolean>(false);
export const changeSchoolInfoOpenStatus = createEvent<boolean>();
$schoolInfoOpenStatus.on(changeSchoolInfoOpenStatus, setPayload);

export const changeRealtimeSchoolConnectedOpenStatus = createEvent<boolean>();
export const $realtimeSchoolConnectedOpenStatus = createStore<boolean>(true);
$realtimeSchoolConnectedOpenStatus.on(changeRealtimeSchoolConnectedOpenStatus, setPayload);

export const changeGigaSelection = createEvent<{ layerId: number | null }>();
export const $selectedGigaLayers = restore(changeGigaSelection, defaultGigaLayers);

export const setPopupOnClickDot = createEvent<{ id: number; geopoint: GeoJSONPoint } | null>();
export const $activeSchoolPopup = restore(setPopupOnClickDot, null);

export const onCreateSchoolPopup = createEvent<null | mapboxgl.Popup>();
export const $popup = createStore<mapboxgl.Popup | null>(null);
$popup.on(onCreateSchoolPopup, setPayload);

export const $schoolClickedId = $activeSchoolPopup.map((data) => data?.id ?? 0);
export const $schoolClickData = createStore<SchoolStatsType[] | null>(null)
$schoolClickData.on(fetchSchoolPopupDataFx.doneData, setPayload);

export const $advanceFilterList = createStore<AdvanceFilterType[]>([]);
$advanceFilterList.on(fetchAdvanceFilterFx.doneData, setPayloadResults);
$advanceFilterList.on(filterTranslationFx.doneData, (state, payload) => {
  const { data } = payload as { data: Record<string, string> }
  const list = reconstructJson(data, { filterList: state }).filterList
  return [...list]
})
export const $filterListMapping = createStore<[string, string][]>([]);
$filterListMapping.on(fetchAdvanceFilterFx.doneData, (_, payload) => {
  const list = Object.entries(extractDataWithMapping({ filterList: payload.results }, filterListMapping)).filter(([_key, value]) => !!value);
  return list;
})


$map.reset(map.visible);
$schoolConnectedOpenStatus.reset(resetSchoolConnectedOpenStatus);
