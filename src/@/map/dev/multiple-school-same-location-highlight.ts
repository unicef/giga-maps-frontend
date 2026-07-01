/**
 * DEV-ONLY TEMPORARY MAP DEBUG PLUGIN.
 *
 * This file exists only to help developers/QA visually find school dots where
 * the map vector API marks `has_multiple_school_on_same_lat_lng` as true.
 * It is intentionally isolated so the whole feature can be removed by deleting
 * this file and the `registerDevMultipleSchoolSameLocationHighlight` calls.
 * Do not wire this into production UI or product configuration.
 */
import type { CirclePaint, Map } from 'mapbox-gl';

import { DEFAULT_SOURCE } from '../map.constant';
import type { ChangeLayerOptions } from '../map.types';

const multipleSchoolSameLatLngProperty = 'has_multiple_school_on_same_lat_lng';
const overlayLayerSuffix = '-dev-multiple-school-same-location-highlight';
const highlightColor = '#ffffff';
const transparentColor = 'rgba(255, 255, 255, 0)';
const defaultCircleRadius = 6;
const defaultSymbolTextSize = 14;

type DevMultipleSchoolMarkerType = 'circle' | 'symbol';

type HighlightLayer = {
  map: Map;
  id: string;
};

type GigaMapDevSettings = {
  highlightMultipleSchoolOnSameLatLng?: boolean;
  setHighlightMultipleSchoolOnSameLatLng?: (enabled?: boolean) => boolean;
  refreshMultipleSchoolOnSameLatLngHighlight?: () => void;
};

type RegisterHighlightOptions = {
  map: Map;
  id: string;
  source: string;
  mapRoute: ChangeLayerOptions['mapRoute'];
  markerType: DevMultipleSchoolMarkerType;
  options: Record<string, unknown>;
  circleRadius?: CirclePaint['circle-radius'];
  symbol?: string;
  textSize?: unknown;
};

const highlightLayers = new globalThis.Map<string, HighlightLayer>();
let highlightEnabled = false;

const getOverlayLayerId = (id: string) => `${id}${overlayLayerSuffix}`;

const getDevSettingsRoot = () =>
  globalThis as typeof globalThis & {
    GIGA_MAP_DEV?: GigaMapDevSettings;
  };

const getSameLocationCondition = (): unknown[] => [
  'any',
  ['==', multipleSchoolSameLatLngProperty, true],
  ['==', multipleSchoolSameLatLngProperty, 1],
  ['==', multipleSchoolSameLatLngProperty, '1'],
  ['==', multipleSchoolSameLatLngProperty, 'true'],
  ['==', multipleSchoolSameLatLngProperty, 'True'],
  ['==', multipleSchoolSameLatLngProperty, 'TRUE'],
];

const getOverlayFilter = (baseFilter: unknown) =>
  baseFilter ? ['all', getSameLocationCondition(), baseFilter] : getSameLocationCondition();

const getVisibility = () => (highlightEnabled ? 'visible' : 'none');

const shouldUseHighlight = (
  mapRoute: ChangeLayerOptions['mapRoute'],
  source: string,
) => source === DEFAULT_SOURCE && !mapRoute.map;

const syncOverlayLayerVisibility = () => {
  highlightLayers.forEach(({ map, id }, key) => {
    if (!map.getLayer(id)) {
      highlightLayers.delete(key);
      return;
    }
    map.setLayoutProperty(id, 'visibility', getVisibility());
  });
};

const installGigaMapDevSettings = () => {
  const root = getDevSettingsRoot();
  const settings = root.GIGA_MAP_DEV ?? {};
  highlightEnabled = Boolean(settings.highlightMultipleSchoolOnSameLatLng);

  Object.defineProperty(settings, 'highlightMultipleSchoolOnSameLatLng', {
    configurable: true,
    enumerable: true,
    get: () => highlightEnabled,
    set: (enabled: boolean) => {
      highlightEnabled = Boolean(enabled);
      syncOverlayLayerVisibility();
    },
  });

  settings.setHighlightMultipleSchoolOnSameLatLng = (enabled = true) => {
    settings.highlightMultipleSchoolOnSameLatLng = enabled;
    return settings.highlightMultipleSchoolOnSameLatLng;
  };
  settings.refreshMultipleSchoolOnSameLatLngHighlight =
    syncOverlayLayerVisibility;
  root.GIGA_MAP_DEV = settings;
};

const getSourceLayerOptions = (options: Record<string, unknown>) => {
  const sourceLayer = options['source-layer'];
  return typeof sourceLayer === 'string' ? { 'source-layer': sourceLayer } : {};
};

const createCircleOverlayLayer = ({
  circleRadius,
  id,
  map,
  options,
  source,
}: RegisterHighlightOptions & { id: string }) => {
  map.addLayer({
    id,
    type: 'circle',
    source,
    minzoom: 0,
    ...getSourceLayerOptions(options),
    filter: getOverlayFilter(options.filter),
    layout: {
      visibility: getVisibility(),
    },
    paint: {
      'circle-radius': circleRadius ?? defaultCircleRadius,
      'circle-color': transparentColor,
      'circle-stroke-color': highlightColor,
      'circle-stroke-width': 4,
      'circle-stroke-opacity': 1,
    },
  });
};

const createSymbolOverlayLayer = ({
  id,
  map,
  options,
  source,
  symbol,
  textSize,
}: RegisterHighlightOptions & { id: string }) => {
  map.addLayer({
    id,
    type: 'symbol',
    source,
    minzoom: 0,
    ...getSourceLayerOptions(options),
    filter: getOverlayFilter(options.filter),
    layout: {
      visibility: getVisibility(),
      'text-field': symbol ?? '',
      'text-size': textSize ?? defaultSymbolTextSize,
      'text-allow-overlap': true,
      'text-ignore-placement': true,
    },
    paint: {
      'text-color': transparentColor,
      'text-halo-color': highlightColor,
      'text-halo-width': 4,
      'text-halo-blur': 0,
    },
  });
};

export const registerDevMultipleSchoolSameLocationHighlight = (
  options: RegisterHighlightOptions,
) => {
  const { id, map, mapRoute, markerType, source } = options;
  const overlayLayerId = getOverlayLayerId(id);
  const layerKey = `${source}:${overlayLayerId}`;

  if (!shouldUseHighlight(mapRoute, source)) {
    highlightLayers.delete(layerKey);
    return;
  }

  if (map.getLayer(overlayLayerId)) {
    highlightLayers.set(layerKey, { map, id: overlayLayerId });
    map.setLayoutProperty(overlayLayerId, 'visibility', getVisibility());
    return;
  }

  if (markerType === 'circle') {
    createCircleOverlayLayer({ ...options, id: overlayLayerId });
  } else {
    createSymbolOverlayLayer({ ...options, id: overlayLayerId });
  }

  highlightLayers.set(layerKey, { map, id: overlayLayerId });
};

installGigaMapDevSettings();