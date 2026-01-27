import { format } from "date-fns";
import { CircleLayer, CirclePaint, Map, MapboxGeoJSONFeature, MapLayerMouseEvent, VectorSource } from "mapbox-gl";

import { getBaseUrl } from "~/api/project-connect";
import { GeoJSONFeatureCollection, GeoJSONPoint, PointCoordinates } from '~/core/global-types';

import { gigaThemeList, ThemeType } from "~/core/theme.model";
import { $countryCode, setSchoolFocusLatLng } from "../country/country.model";
import { ConnectivityDistribution, ConnectivityStatusDistribution, Layers, SCHOOL_STATUS_LAYER } from "../sidebar/sidebar.constant";
import { animateCircleConfig, Colors, CONNECTIVITY_STATUS_SOURCE, CONNECTIVITY_STATUS_URL, CONNECTIVITY_URL, CountryPaintData, DEFAULT_SOURCE, defaultWorldView, LayerDataProps, mapPaintData, PLUS_SIGN_SYMBOL, SCHOOL_LAYER_ID } from './map.constant';
import { $schoolClickedId, resetDublicateSchoolClickData, setPopupOnClickDot } from "./map.model";
import { ChangeLayerOptions, StylePaintData } from "./map.types";

interface CreateSourceType {
  source?: string;
  minzoom?: number;
  url: string;
  map: Map;
  schoolData?: GeoJSONFeatureCollection
}

export const isDefaultStyle = (style: string) => {
  return gigaThemeList.includes(style as ThemeType)
};

export const mapDotsClickIdsAndHandler = {
  [CONNECTIVITY_STATUS_SOURCE]: {},
  [DEFAULT_SOURCE]: {}
} as Record<string, Record<string, (event: MapLayerMouseEvent) => void>>;

export const isConnectivity = (id: string) => id === `${Layers.connectivity}_layer`;
export const isCoverage = (id: string) => id === `${Layers.coverage}_layer`;

export const removePreviewsMapClickHandlers = (map: Map, source: string) => {
  const ids = Object.keys(mapDotsClickIdsAndHandler[source]);
  if (!ids?.length) return;
  ids?.forEach((id) => {
    map.off('click', id, mapDotsClickIdsAndHandler[source][id]);
    delete mapDotsClickIdsAndHandler?.[source]?.[id];
    resetDublicateSchoolClickData();
  })
}

export const onClickOnSchoolDots = (map: Map, id: string, source: string) => {
  mapDotsClickIdsAndHandler[source][id] = (e: MapLayerMouseEvent) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: [...Object.keys(mapDotsClickIdsAndHandler[DEFAULT_SOURCE]), ...Object.keys(mapDotsClickIdsAndHandler[CONNECTIVITY_STATUS_SOURCE])],
    });
    if (!features.length) return;
    const ids = new Set(features.map((feature) => {
      return feature.layer.id;
    }));
    if (ids.size === 2 && getMapId(SCHOOL_STATUS_LAYER.id) === id) {
      return;
    }
    const feature = features[0];
    const feature2 = features[1];
    if ($schoolClickedId.getState() === feature?.properties?.id) {
      setPopupOnClickDot(null)
      return;
    }
    const schoolId = feature?.properties?.id ?? feature2?.properties?.id;
    if (feature?.layer?.id?.includes('_layer') && schoolId) {
      console.log("schoolId", schoolId, feature.geometry)
      setSchoolFocusLatLng(feature?.geometry?.coordinates as PointCoordinates);
      setPopupOnClickDot({
        id: schoolId,
        geopoint: feature.geometry as GeoJSONPoint,
        allowDublicateSchoolIds: true
      });
    }
  }
  map.on('click', id, mapDotsClickIdsAndHandler[source][id]);
}

const getZoomDivisible = (zoom: number, zoomDivisible?: [number, number][]): number => {
  if (!zoomDivisible?.length) return zoom;
  const divisibleValue = getInterpolatedValue(zoomDivisible, zoom);
  return divisibleValue ? zoom / divisibleValue : zoom;
}

const getAnimateConfig = () => {
  const countryAnimatedCircle = CountryPaintData[$countryCode.getState()?.toLowerCase() as keyof typeof CountryPaintData]?.animatedCircle;
  return {
    ...animateCircleConfig,
    ...countryAnimatedCircle
  }
}

const setCurrentRadius = () => {
  let lastZoom = 0;
  let radiusValue = [0, 0];
  const { maxRadius, maxRadiusPortion, startRadiusPortion, zoomDivisible } = getAnimateConfig();
  return (currentZoom: number) => {
    const value = getZoomDivisible(currentZoom, zoomDivisible);
    currentZoom = Math.min(value, maxRadius);
    if (currentZoom === lastZoom) {
      return radiusValue;
    }
    lastZoom = currentZoom;
    const zoomThird = currentZoom / maxRadiusPortion;
    const start = currentZoom - currentZoom / startRadiusPortion;
    const max = currentZoom + zoomThird;
    radiusValue = [start, max];
    return radiusValue;
  }
}

export function animateCircles({ map, id: layer }: { map: Map; id: string }) {
  const animationFrameData = { requestId: 0 };
  const { duration, opacityMax, opacityMin } = animateCircleConfig;
  let startTime = performance.now();
  let isGrowing = true;
  const getMaxRadius = setCurrentRadius();
  function animateFrame(time: number) {
    if (!map.getLayer(layer)) {
      return; // reset value if require;
    }
    const zoom = Number(map.getZoom().toFixed(1));
    const [startRadius, maxRadius] = getMaxRadius(zoom);
    let progress = time - startTime;
    if (progress >= duration) {
      progress = duration;
    }
    let radius = (progress / duration) * (maxRadius - startRadius) + startRadius;
    let opacity = opacityMax - (progress / duration) * (opacityMax - opacityMin);
    if (!isGrowing) {
      radius = maxRadius - (progress / duration) * (maxRadius - startRadius);
      opacity = (progress / duration) * (opacityMax - opacityMin) + opacityMin;
    }
    map.setPaintProperty(layer, 'circle-radius', radius);
    map.setPaintProperty(layer, 'circle-opacity', opacity > opacityMax ? opacityMax : opacity);
    if (progress >= duration) {
      // await waitFor(300)
      startTime = performance.now();
      isGrowing = !isGrowing;
    }
    animationFrameData.requestId = requestAnimationFrame(animateFrame);
  }
  // set handler to reset
  setTimeout(() => animateFrame(performance.now()), 1000);
  return animationFrameData;
}

// Animate symbol layers (text-based plus signs) - similar to animateCircles
export function animateSymbols({ map, id: layer }: { map: Map; id: string }) {
  const animationFrameData = { requestId: 0 };
  const { duration, opacityMax, opacityMin } = animateCircleConfig;
  let startTime = performance.now();
  let isGrowing = true;
  const getMaxSize = setCurrentRadius(); // Reuse same size calculation

  console.log('🎬 Starting symbol animation for layer:', layer);

  let successCount = 0;
  let errorCount = 0;

  function animateFrame(time: number) {
    // Check if layer exists
    const layerExists = map.getLayer(layer);
    if (!layerExists) {
      console.error('❌ Symbol layer not found:', layer);
      return; // layer was removed
    }

    const zoom = Number(map.getZoom().toFixed(1));
    const [startSize, maxSize] = getMaxSize(zoom);

    // Reduced pulse expansion - smaller range for more subtle animation
    const baseTextSize = startSize * 4;
    const startTextSize = baseTextSize;
    const maxTextSize = baseTextSize * 2.5; // Only 30% expansion instead of full maxSize

    let progress = time - startTime;
    if (progress >= duration) {
      progress = duration;
    }

    let textSize = (progress / duration) * (maxTextSize - startTextSize) + startTextSize;
    let opacity = opacityMax - (progress / duration) * (opacityMax - opacityMin);

    if (!isGrowing) {
      textSize = maxTextSize - (progress / duration) * (maxTextSize - startTextSize);
      opacity = (progress / duration) * (opacityMax - opacityMin) + opacityMin;
    }

    // Try to set paint properties - if it fails, retry next frame
    try {
      // text-size is a LAYOUT property, not a paint property!
      map.setLayoutProperty(layer, 'text-size', textSize);
      // text-opacity is a PAINT property
      map.setPaintProperty(layer, 'text-opacity', opacity > opacityMax ? opacityMax : opacity);

      successCount++;
      if (successCount === 1) {
        console.log('✅ Animation started successfully! textSize:', textSize.toFixed(2), 'opacity:', opacity.toFixed(2));
      } else if (successCount === 60) {
        console.log('✅ Animation running smoothly (60 frames succeeded)');
      }
    } catch (e) {
      errorCount++;
      if (errorCount <= 5) {
        console.warn(`⚠️ Error #${errorCount} setting properties (will retry):`, e.message);
      } else if (errorCount === 100) {
        console.error('❌ Animation failed after 100 retries. Error:', e);
      }
      // Paint properties not ready yet or error setting them
      // Silently retry on next frame
      animationFrameData.requestId = requestAnimationFrame(animateFrame);
      return;
    }

    if (progress >= duration) {
      startTime = performance.now();
      isGrowing = !isGrowing;
      if (successCount <= 10) {
        console.log('🔄 Animation cycle complete, direction:', isGrowing ? 'growing' : 'shrinking');
      }
    }
    animationFrameData.requestId = requestAnimationFrame(animateFrame);
  }

  // set handler to reset
  setTimeout(() => animateFrame(performance.now()), 1000);
  return animationFrameData;
}


export const getDynamicUrl = (layerId: string) => `api/accounts/layers/${layerId}/map`

export const generateMapParams = ({ connectivityFilter, mapRoute, connectivityBenchMark, isLive, countrySearch, schoolPageIds }: Pick<ChangeLayerOptions, "countrySearch" | "connectivityFilter" | "mapRoute" | "connectivityBenchMark" | "schoolPageIds"> & { isLive?: boolean }): string => {
  const { isWeek, range } = connectivityFilter;
  const startDate = format(range.start, 'dd-MM-yyyy');
  const endDate = format(range.end, 'dd-MM-yyyy');
  let params = `${mapRoute.map ? 'limit=14000' : ''}`
  if (isLive) {
    params += `&indicator=${'download'}&benchmark=${connectivityBenchMark}&start_date=${startDate}&end_date=${endDate}&is_weekly=${isWeek.toString()}`;
  }
  if (mapRoute.country && countrySearch) {
    params += `&${countrySearch}`
  }
  if (schoolPageIds?.length === 1) {
    params += `&exclude_schools_same_coords_except_id=${schoolPageIds[0]}`
  }
  return params;
}


export const getCountryParams = (country: boolean, countryId?: number, admin1Id?: number | null) => {
  let params = country && countryId ? `country_id=${countryId}` : ''
  if (admin1Id) {
    params += `&admin1_id=${admin1Id}`
  }
  return params;
}

export const generateStaticLayerUrl = ({ mapRoute, country, admin1Id, countrySearch, schoolPageIds }: Pick<ChangeLayerOptions, "mapRoute" | "country" | "countrySearch" | "schoolPageIds"> & { admin1Id?: number | null }) => {
  const countryParams = getCountryParams(!mapRoute.map, country?.id, admin1Id);
  let params = getBaseUrl(`${CONNECTIVITY_STATUS_URL}/?${countryParams}`);
  if (countrySearch) {
    params += `&${countrySearch}`
  }
  if (schoolPageIds?.length === 1) {
    params += `&exclude_schools_same_coords_except_id=${schoolPageIds[0]}`
  }
  return `${params}&z={z}&x={x}&y={y}.mvt`;
}
export const generateLayerUrls = ({ layerId, connectivityBenchMark, schoolPageIds, layerUtils, mapRoute, country, admin1Id, connectivityFilter, countrySearch }: Pick<ChangeLayerOptions, "countrySearch" | "connectivityFilter" | "layerUtils" | "mapRoute" | "country" | "connectivityBenchMark" | "schoolPageIds"> & { layerId: number | null, admin1Id?: number | null }) => {
  let url = ''
  const { globalLayerId } = layerUtils;
  const { isLive } = layerUtils.currentLayerTypeUtils;
  const countryParams = getCountryParams(!mapRoute.map, country?.id, admin1Id);
  const params = generateMapParams({ connectivityFilter, mapRoute, isLive, schoolPageIds, connectivityBenchMark, countrySearch });
  if (globalLayerId === layerId || !layerId) {
    url = CONNECTIVITY_URL;
  } else {
    url = getDynamicUrl(String(layerId))
  }
  return getBaseUrl(`${url}/?${countryParams}${params}&z={z}&x={x}&y={y}.mvt`);
}

export const getMapId = (id: number | null, prefix = ''): string => {
  if (id) return `${id}_layer${prefix}`;
  return '';
}

export const createSource = ({ map, source = DEFAULT_SOURCE, url }: CreateSourceType, options: VectorSource): void => {
  map.addSource(source, {
    tiles: [url],
    minzoom: 0,
    maxzoom: 18,
    ...options,
    type: "vector",
  });
}

export const createSchoolSource = ({ map, source = DEFAULT_SOURCE, schoolData }: CreateSourceType) => {
  map.addSource(source, {
    type: 'geojson',
    data: schoolData as unknown as GeoJSON.FeatureCollection,
  });
}

export const getAllSourceLayers = (map: Map, sourceId = DEFAULT_SOURCE) => {
  const layersFromSource = map.getStyle().layers.filter((layer: any) => layer.source === sourceId);
  return layersFromSource
}

export const checkSourceAvailable = (map: Map, sourceId: string): boolean => {
  const { sources } = map.getStyle();
  return !!sources && !!sources[sourceId];
}

export const deleteSourceAndLayers = ({ map, sourceId = DEFAULT_SOURCE }: { map: Map, sourceId?: string }): void => {
  // remove click handlers
  removePreviewsMapClickHandlers(map, sourceId);

  if (!checkSourceAvailable(map, sourceId)) return;
  const { layers } = map.getStyle();
  layers?.forEach((layer) => {
    if ((layer as any).source === sourceId) {
      map.removeLayer(layer.id);
    }
  });
  map.removeSource(sourceId);
}

export const showLayer = (map: Map, id: string): void => {
  if (!map.getLayer(id)) return;
  map.setLayoutProperty(id, 'visibility', 'visible');
}

export const hideLayer = (map: Map, id: string): void => {
  if (!map.getLayer(id)) return;
  map.setLayoutProperty(id, 'visibility', 'none');
}

const createCircleLayer = (map: Map, options: CircleLayer, layerBefore?: string) => {
  return map.addLayer({
    minzoom: 0,
    ...options
  }, layerBefore && map.getLayer(layerBefore) ? layerBefore : '');
}

export const createSchoolLayer = (map: Map, { id, source = DEFAULT_SOURCE, paintData, options, mapRoute, isMobile }: { id: string; source?: string; paintData: StylePaintData, options: Record<string, any>; mapRoute: ChangeLayerOptions['mapRoute'], isMobile: boolean }): void => {
  const circleLayerId = `${id}-circle`;
  const symbolLayerId = `${id}-symbol`;

  // Check if layers already exist
  if (map.getLayer(circleLayerId) || map.getLayer(symbolLayerId)) {
    showLayer(map, circleLayerId);
    showLayer(map, symbolLayerId);
    return;
  }

  const connectivityStatusColors = paintData;


  // Create color expression (shared by both circle and text)
  const colorExpression = [
    'match',
    ['get', 'connectivity_status'],
    ConnectivityStatusDistribution.connected, connectivityStatusColors.connected,
    ConnectivityStatusDistribution.notConnected, connectivityStatusColors.not_connected,
    ConnectivityStatusDistribution.unknown, connectivityStatusColors.unknown,
    connectivityStatusColors.unknown // default
  ];

  const countryCode = $countryCode.getState();
  const currentCountryPaintData = CountryPaintData[countryCode?.toLowerCase() as keyof typeof CountryPaintData];

  // Get text size based on circle radius for consistent sizing
  const baseCircleRadius = mapPaintData.connectivityStatus["circle-radius"];
  const countryCircleRadius = currentCountryPaintData?.connectivityStatus?.["circle-radius"];
  const circleRadius = countryCircleRadius || baseCircleRadius;


  // Create circle paint for low zoom performance
  const circlePaint = {
    ...mapPaintData.connectivityStatus,
    ...currentCountryPaintData?.connectivityStatus,
    "circle-color": colorExpression
  } as unknown as CirclePaint;

  // LAYER 1: Circle layer for low zoom (0-7.99) - HIGH PERFORMANCE
  createCircleLayer(map, {
    id: circleLayerId,
    type: "circle",
    source,
    minzoom: 0,
    maxzoom: 7.99, // Hide before zoom 8 to avoid overlap with symbols
    paint: circlePaint,
    ...options
  });

  // Convert circle radius to text size (5x multiplier for good visibility)
  let textSize: any;
  if (Array.isArray(circleRadius) && circleRadius[0] === 'interpolate') {
    const pairs = circleRadius.slice(3);
    const scaledPairs = pairs.map((item, idx) => {
      return idx % 2 === 1 ? (item as number) * 4 : item;
    });
    textSize = ['interpolate', ['linear'], ['zoom'], ...scaledPairs];
  } else if (typeof circleRadius === 'number') {
    textSize = circleRadius * 4;
  } else {
    textSize = 16;
  }

  // LAYER 2: Symbol layer for high zoom levels (8+) - DETAILED VIEW
  map.addLayer({
    id: symbolLayerId,
    type: 'symbol',
    source,
    'source-layer': options['source-layer'],
    minzoom: 6, // Show only at zoom 8+ when fewer features visible
    layout: {
      // Use heavy plus sign Unicode character for better visibility
      'text-field': PLUS_SIGN_SYMBOL,
      'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
      'text-size': textSize as any,
      'text-allow-overlap': true,
      'text-ignore-placement': true,
      // Performance optimizations for 165k records
      'text-rotation-alignment': 'viewport',
      'text-pitch-alignment': 'viewport',
      'text-padding': 0,
      'symbol-sort-key': 0
    },
    paint: {
      'text-color': colorExpression as any,
      // Strong dark halo for visibility
      'text-halo-color': 'rgba(0, 0, 0, 0.5)',
      'text-halo-width': 2,
      'text-halo-blur': 1,
      'text-opacity': mapPaintData.connectivityStatus["circle-opacity"] || 1
    }
  });


  // Set up click handlers for both layers
  [circleLayerId, symbolLayerId].forEach(layerId => {
    map.off('click', layerId, mapDotsClickIdsAndHandler[source][layerId]);
    delete mapDotsClickIdsAndHandler?.[source]?.[layerId];
    if (!mapRoute.map) {
      onClickOnSchoolDots(map, layerId, CONNECTIVITY_STATUS_SOURCE);
    }
  });
}

const getConnectivityPaint = (colorsConnectivity: StylePaintData, isDynamicLayer: boolean) => {
  const countryCode = $countryCode.getState();
  const currentCountryPaintData = CountryPaintData[countryCode?.toLowerCase() as keyof typeof CountryPaintData];
  return {
    ...mapPaintData.connectivity,
    ...currentCountryPaintData?.connectivity,
    "circle-color": [
      ...mapPaintData.connectivity["circle-color"],
      [
        "match",
        ["get", isDynamicLayer ? LayerDataProps.fieldStatus.key : LayerDataProps.connectivity.key],
        ConnectivityDistribution.good, colorsConnectivity.good,
        ConnectivityDistribution.moderate, colorsConnectivity.moderate,
        ConnectivityDistribution.bad, colorsConnectivity.bad,
        ConnectivityDistribution.unknown, colorsConnectivity.unknown,
        Colors.TRANSPARENT
      ],
      Colors.TRANSPARENT
    ]
  } as unknown as CirclePaint;
}

export const getCoveragePaint = (colors: StylePaintData, isDynamicLayer: boolean) => {
  return {
    ...mapPaintData.coverage,
    "circle-color": [
      ...mapPaintData.coverage["circle-color"],
      ["get", isDynamicLayer ? LayerDataProps.fieldStatus.key : LayerDataProps.coverage.key],
      ConnectivityDistribution.good, colors.good,
      ConnectivityDistribution.moderate, colors.moderate,
      ConnectivityDistribution.bad, colors.bad,
      ConnectivityDistribution.unknown, colors.unknown,
      colors.unknown  // Default color for other cases
    ]
  } as unknown as CirclePaint;
}

// eslint-disable-next-line consistent-return
const getPaintData = ({ isLive, paintData, isDynamicLayer }: { isLive?: boolean; isDynamicLayer: boolean; paintData: StylePaintData }): undefined | CirclePaint => {
  if ((isLive)) {
    return getConnectivityPaint(paintData, isDynamicLayer)
  } else {
    return getCoveragePaint(paintData, isDynamicLayer);
  }

}

export const createSelectedLayer = (map: Map, { id, isDynamicLayer, source = DEFAULT_SOURCE, paintData, mapRoute, options, isLive, isMobile }: { id: string; isDynamicLayer: boolean; isLive?: boolean; source?: string; paintData: StylePaintData; options: Record<string, string>, isMobile: boolean; mapRoute: ChangeLayerOptions["mapRoute"] }): void => {
  const circleLayerId = `${id}-circle`;
  const symbolLayerId = `${id}-symbol`;

  // Check if layers already exist
  if (map.getLayer(circleLayerId) || map.getLayer(symbolLayerId)) {
    map.setLayoutProperty(circleLayerId, 'visibility', 'visible');
    map.setLayoutProperty(symbolLayerId, 'visibility', 'visible');
    return;
  }

  const circlePaint = getPaintData({ isLive, paintData, isDynamicLayer });

  // LAYER 1: Circle layer for low zoom (0-7.99) - HIGH PERFORMANCE
  const schoolCircleLayerId = `${getMapId(SCHOOL_LAYER_ID)}-circle`;
  const beforeCircleId = map.getLayer(schoolCircleLayerId) ? schoolCircleLayerId : undefined;

  createCircleLayer(map, {
    id: circleLayerId,
    type: "circle",
    source,
    minzoom: 0,
    maxzoom: 7.99, // Hide before zoom 8 to avoid overlap with symbols
    paint: circlePaint,
    ...options
  }, beforeCircleId);

  // LAYER 2: Symbol layer for high zoom (8+) - DETAILED VIEW
  // Create text color from circle paint
  const textColor = circlePaint?.["circle-color"] || paintData.connected;

  // Get text size based on circle radius (5x multiplier for good visibility)
  const baseCircleRadius = circlePaint?.["circle-radius"];
  let textSize: any;
  if (Array.isArray(baseCircleRadius) && baseCircleRadius[0] === 'interpolate') {
    const pairs = baseCircleRadius.slice(3);
    const scaledPairs = pairs.map((item, idx) => {
      return idx % 2 === 1 ? (item as number) * 4 : item;
    });
    textSize = ['interpolate', ['linear'], ['zoom'], ...scaledPairs];
  } else if (typeof baseCircleRadius === 'number') {
    textSize = baseCircleRadius * 4;
  } else {
    textSize = 16;
  }

  const schoolSymbolLayerId = `${getMapId(SCHOOL_LAYER_ID)}-symbol`;
  const beforeSymbolId = map.getLayer(schoolSymbolLayerId) ? schoolSymbolLayerId : undefined;

  map.addLayer({
    id: symbolLayerId,
    type: 'symbol',
    source,
    'source-layer': options['source-layer'],
    minzoom: 8,
    layout: {
      'text-field': PLUS_SIGN_SYMBOL,
      'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
      'text-size': textSize as any,
      'text-allow-overlap': true,
      'text-ignore-placement': true,
      'text-rotation-alignment': 'viewport',
      'text-pitch-alignment': 'viewport',
      'text-padding': 0,
      'symbol-sort-key': 0
    },
    paint: {
      'text-color': textColor as any,
      'text-halo-color': 'rgba(0, 0, 0, 0.5)',
      'text-halo-width': 2,
      'text-halo-blur': 1,
      'text-opacity': circlePaint?.["circle-opacity"] || 1
    }
  }, beforeSymbolId);

  // Set up click handlers for both layers
  [circleLayerId, symbolLayerId].forEach(layerId => {
    map.off('click', layerId, mapDotsClickIdsAndHandler?.[source]?.[layerId]);
    delete mapDotsClickIdsAndHandler?.[source]?.[layerId];
    console.log('mapRoute.map', source, layerId);
    if (!mapRoute.map) {
      onClickOnSchoolDots(map, layerId, source);
    }
  });
}


export const filterCoverageList = (coverageFilter: Record<string, boolean>, isDynamicLayer = false): string[] => {
  const filterList = Object.keys(coverageFilter)
    .filter((keyName: string) => coverageFilter[keyName]);

  return ['in', isDynamicLayer ? LayerDataProps.fieldStatus.key : LayerDataProps.coverage.key].concat(filterList);
}


export const filterConnectivityList = (connectivitySpeedFilter: Record<string, boolean>, isDynamicLayer = false) => {
  const filterList = Object.keys(connectivitySpeedFilter)
    .filter(key => connectivitySpeedFilter[key])
  return [
    'all',
    ["==", 'is_rt_connected', true],
    ['in', isDynamicLayer ? LayerDataProps.fieldStatus.key : LayerDataProps.connectivity.key].concat(filterList)
  ]
}

export const filterSchoolStatus = (lengendsSelected: string[]) => {
  return ['in', LayerDataProps.connectivityStatus.key, ...lengendsSelected];
}

// Creates a worldview filtes for Mapbox Boundaries tilesets
export const wvFilter = (worldview = defaultWorldView) => {
  return [
    "any",
    ["==", "all", ["get", "worldview"]],
    ["in", worldview, ["get", "worldview"]],
  ];
}

export const notHasDispute = (worldview = defaultWorldView) => {
  return [
    "all",
    ["!", ["has", "dispute"]],
    wvFilter(worldview),
  ]
}
export const filterCountry = (countryCode: string, operator = "==", worldView?: string) => {
  // Create a filter expression for the boundary layer using the country and worldview selection
  if (!countryCode) return []

  return [
    "all",
    [operator, ["get", "iso_3166_1"], countryCode],
    wvFilter(worldView)
  ];
}

export const matchCountryFilter = (countryCode: string, options: string[]) => {
  return [
    "match",
    [
      "get",
      "iso_3166_1"
    ],
    [
      countryCode
    ],
    ...options
  ]
}

export const matchAdminFilter = (code: string, state: string, color: string) => {
  return [
    'case',
    ['==', ['feature-state', state], code], color,
    'transparent'
  ]
}

export const findLayer = (features: MapboxGeoJSONFeature[], id: string) => {
  return features.find((feature => feature.layer.id === id))
}

export const getInterpolatedValue = (stops: [number, number][], zoom: number): number | undefined => {
  const len = stops.length;

  if (len === 0) throw new Error("Stops array cannot be empty");

  // If zoom is before the first stop, return the first value
  if (zoom <= stops[0][0]) return stops[0][1];

  // If zoom is after the last stop, return the last value
  if (zoom >= stops[len - 1][0]) return stops[len - 1][1];

  // Find the zoom interval the current zoom falls into
  for (let i = 0; i < len - 1; i++) {
    const [z1, v1] = stops[i];
    const [z2, v2] = stops[i + 1];

    if (zoom === z1) return v1;
    if (zoom > z1 && zoom < z2) {
      const t = (zoom - z1) / (z2 - z1); // linear interpolation factor
      return v1 + t * (v2 - v1);
    }
  }
}