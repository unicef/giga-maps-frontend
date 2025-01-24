import { format } from "date-fns";
import { CircleLayer, CirclePaint, Map, MapboxGeoJSONFeature, MapLayerMouseEvent, VectorSource } from "mapbox-gl";

import { getBaseUrl } from "~/api/project-connect";
import { GeoJSONFeatureCollection, GeoJSONPoint } from '~/core/global-types';

import { ConnectivityDistribution, ConnectivityStatusDistribution, Layers, SCHOOL_STATUS_LAYER } from "../sidebar/sidebar.constant";
import { animateCircleConfig, Colors, CONNECTIVITY_STATUS_SOURCE, CONNECTIVITY_STATUS_URL, CONNECTIVITY_URL, COVERAGE_URL, DEFAULT_SOURCE, defaultWorldView, LayerDataProps, mapPaintData, SCHOOL_LAYER_ID } from "./map.constant";
import { setPopupOnClickDot } from "./map.model";
import { ChangeLayerOptions, StylePaintData } from "./map.types";
import { gigaThemeList, ThemeType } from "~/core/theme.model";

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
  })
}

export const onClickOnSchoolDots = (map: Map, id: string, source: string) => {
  mapDotsClickIdsAndHandler[source][id] = (e: MapLayerMouseEvent) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: [...Object.keys(mapDotsClickIdsAndHandler[DEFAULT_SOURCE]), ...Object.keys(mapDotsClickIdsAndHandler[CONNECTIVITY_STATUS_SOURCE])],
    });
    if (!features.length) return;
    const feature = features[0];

    if (feature.layer.id === id && feature.properties) {
      setPopupOnClickDot({
        id: feature?.properties?.id || 0,
        geopoint: feature.geometry as GeoJSONPoint
      });
    }
  }
  map.on('click', id, mapDotsClickIdsAndHandler[source][id]);
}

const setCurrentRadius = () => {
  let lastZoom = 0;
  let radiusValue = [0, 0];
  const { maxRadius, maxRadiusPortion, startRadiusPortion } = animateCircleConfig;
  return (currentZoom: number) => {
    currentZoom = Math.min(currentZoom, maxRadius);
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


export const getDynamicUrl = (layerId: string) => `api/accounts/layers/${layerId}/map`

export const generateMapParams = ({ connectivityFilter, mapRoute, connectivityBenchMark, isLive, countrySearch }: Pick<ChangeLayerOptions, "countrySearch" | "connectivityFilter" | "mapRoute" | "connectivityBenchMark"> & { isLive?: boolean }): string => {
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
  return params;
}


export const getCountryParams = (country: boolean, countryId?: number, admin1Id?: number | null) => {
  let params = country && countryId ? `country_id=${countryId}` : ''
  if (admin1Id) {
    params += `&admin1_id=${admin1Id}`
  }
  return params;
}

export const generateStaticLayerUrl = ({ mapRoute, country, admin1Id, countrySearch }: Pick<ChangeLayerOptions, "mapRoute" | "country" | "countrySearch"> & { admin1Id?: number | null }) => {
  const countryParams = getCountryParams(!mapRoute.map, country?.id, admin1Id);
  let params = getBaseUrl(`${CONNECTIVITY_STATUS_URL}/?${countryParams}`);
  if (countrySearch) {
    params += `&${countrySearch}`
  }
  return `${params}&z={z}&x={x}&y={y}.mvt`;
}
export const generateLayerUrls = ({ layerId, connectivityBenchMark, layerUtils, mapRoute, country, admin1Id, connectivityFilter, countrySearch }: Pick<ChangeLayerOptions, "countrySearch" | "connectivityFilter" | "layerUtils" | "mapRoute" | "country" | "connectivityBenchMark"> & { layerId: number | null, admin1Id?: number | null }) => {
  let url = ''
  const { globalLayerId } = layerUtils;
  const { isLive } = layerUtils.currentLayerTypeUtils;
  const countryParams = getCountryParams(!mapRoute.map, country?.id, admin1Id);
  const params = generateMapParams({ connectivityFilter, mapRoute, isLive, connectivityBenchMark, countrySearch });
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
    maxzoom: 8,
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
  const layersFromSource = map.getStyle().layers.filter(layer => layer.source === sourceId);
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
  if (map.getLayer(id)) {
    showLayer(map, id);
    return;
  }

  const connectivityStatusColors = paintData;
  const circleColor = [
    ...mapPaintData.connectivityStatus["circle-color"],
    ConnectivityStatusDistribution.connected, connectivityStatusColors.connected,
    ConnectivityStatusDistribution.notConnected, connectivityStatusColors.not_connected,
    ConnectivityStatusDistribution.unknown, connectivityStatusColors.unknown,
    connectivityStatusColors.unknown
  ];
  const paint = {
    ...mapPaintData.connectivityStatus,
    "circle-color": circleColor
  } as unknown as CirclePaint;

  createCircleLayer(map, {
    id,
    type: "circle",
    source,
    minzoom: 0,
    paint,
    ...options
  });

  map.off('click', id, mapDotsClickIdsAndHandler[source][id]);
  delete mapDotsClickIdsAndHandler?.[source]?.[id];
  if (!mapRoute.map) {
    onClickOnSchoolDots(map, id, CONNECTIVITY_STATUS_SOURCE);
  }
}

const getConnectivityPaint = (colorsConnectivity: StylePaintData, isDynamicLayer: boolean) => {
  return {
    ...mapPaintData.connectivity,
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
  if (map.getLayer(id)) {
    map.setLayoutProperty(id, 'visibility', 'visible');
    return;
  }
  const paint = getPaintData({ isLive, paintData, isDynamicLayer });

  createCircleLayer(map, {
    id,
    type: "circle",
    source,
    minzoom: 0,
    paint,
    ...options
  }, getMapId(SCHOOL_LAYER_ID));
  // create on click on dots;
  // clear click event before creating new layer;

  map.off('click', id, mapDotsClickIdsAndHandler?.[source]?.[id]);
  delete mapDotsClickIdsAndHandler?.[source]?.[id];
  console.log('mapRoute.map', source, id);
  if (!mapRoute.map) {
    onClickOnSchoolDots(map, id, source);
  }

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