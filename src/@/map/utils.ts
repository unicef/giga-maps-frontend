import { format } from 'date-fns';
import {
  CircleLayer,
  CirclePaint,
  Map,
  MapboxGeoJSONFeature,
  MapLayerMouseEvent,
  VectorSource,
} from 'mapbox-gl';

import { EntityType, getEntityMapValue } from '~/@/entities';
import type {
  EntityConfig,
  EntityMapAnimationConfig,
  EntityMapZoomRadius,
  MarkerType,
} from '~/@/entities/config/entity-config.types';
import { getEntityTypeCodeParam } from '~/@/entities/utils/entity-query-params';
import { getBaseUrl } from '~/api/project-connect';
import {
  GeoJSONFeatureCollection,
  GeoJSONPoint,
  PointCoordinates,
} from '~/core/global-types';
import { gigaThemeList, ThemeType } from '~/core/theme.model';
import { IntervalUnit } from '~/lib/date-fns-kit/types';

import { $countryCode, setSchoolFocusLatLng } from '../country/country.model';
import {
  ConnectivityBenchMarks,
  ConnectivityDistribution,
  ConnectivityStatusDistribution,
  Layers,
  SCHOOL_STATUS_LAYER,
} from '../sidebar/sidebar.constant';
import {
  animateCircleConfig,
  Colors,
  CONNECTIVITY_STATUS_SOURCE,
  CONNECTIVITY_STATUS_URL,
  CONNECTIVITY_URL,
  CountryPaintData,
  DEFAULT_SOURCE,
  defaultWorldView,
  LayerDataProps,
  mapPaintData,
  SCHOOL_LAYER_ID,
} from './map.constant';
import {
  $activeSchoolPopup,
  resetDublicateSchoolClickData,
  setPopupOnClickDot,
} from './map.model';
import { registerDevMultipleSchoolSameLocationHighlight } from './dev/multiple-school-same-location-highlight';
import { ChangeLayerOptions, StylePaintData } from './map.types';

type MapAnimationConfigSource = Pick<
  EntityConfig,
  'markerType' | 'mapAnimation'
>;

const defaultMapZoomRadius: EntityMapZoomRadius[] = [
  { zoom: 0, radius: 0.3 },
  { zoom: 2, radius: 1 },
  { zoom: 4, radius: 1.5 },
  { zoom: 5, radius: 2 },
  { zoom: 8, radius: 4 },
  { zoom: 10, radius: 6 },
  { zoom: 12, radius: 8 },
  { zoom: 14, radius: 10 },
];

const defaultCircleMapAnimation: EntityMapAnimationConfig = {
  zoomRadius: defaultMapZoomRadius,
  growSpeed: 1,
  glowMinScale: 1,
  glowMaxScale: 3,
};

const defaultSymbolMapAnimation: EntityMapAnimationConfig = {
  zoomRadius: defaultMapZoomRadius,
  growSpeed: 1,
  glowMinScale: 1,
  glowMaxScale: 3,
};

const symbolTextSizeScale = 2.5;

const getDefaultMapAnimation = (
  markerType: MarkerType,
): EntityMapAnimationConfig =>
  markerType === 'symbol'
    ? defaultSymbolMapAnimation
    : defaultCircleMapAnimation;

const getEntityMapAnimation = (
  entityConfig?: MapAnimationConfigSource,
  fallbackMarkerType: MarkerType = 'circle',
): EntityMapAnimationConfig => {
  const markerType = entityConfig?.markerType ?? fallbackMarkerType;
  const defaultConfig = getDefaultMapAnimation(markerType);
  const config = entityConfig?.mapAnimation;

  return {
    ...defaultConfig,
    ...config,
    zoomRadius: config?.zoomRadius?.length
      ? config.zoomRadius
      : defaultConfig.zoomRadius,
    growSpeed:
      config?.growSpeed && config.growSpeed > 0
        ? config.growSpeed
        : defaultConfig.growSpeed,
  };
};

const getOrderedZoomRadius = (
  zoomRadius: EntityMapZoomRadius[],
): EntityMapZoomRadius[] =>
  zoomRadius.reduce<EntityMapZoomRadius[]>((ordered, stop) => {
    const insertIndex = ordered.findIndex(({ zoom }) => stop.zoom < zoom);
    if (insertIndex === -1) return [...ordered, stop];
    return [
      ...ordered.slice(0, insertIndex),
      stop,
      ...ordered.slice(insertIndex),
    ];
  }, []);

const getRadiusAtZoom = (
  zoomRadius: EntityMapZoomRadius[],
  zoom: number,
): number => {
  const stops = getOrderedZoomRadius(zoomRadius).map(
    ({ zoom: stopZoom, radius }) => [stopZoom, radius] as [number, number],
  );

  return getInterpolatedValue(stops, zoom) ?? stops[0]?.[1] ?? 0;
};

const getRadiusExpression = (
  zoomRadius: EntityMapZoomRadius[],
  scale = 1,
): unknown[] => {
  const expression: unknown[] = ['interpolate', ['linear'], ['zoom']];
  getOrderedZoomRadius(zoomRadius).forEach(({ zoom, radius }) => {
    expression.push(zoom, radius * scale);
  });
  return expression;
};

const getEntityRadiusExpression = (
  entityConfig?: MapAnimationConfigSource,
  fallbackMarkerType: MarkerType = 'circle',
  scale = 1,
): unknown[] =>
  getRadiusExpression(
    getEntityMapAnimation(entityConfig, fallbackMarkerType).zoomRadius,
    scale,
  );

const getEntityTextSizeExpression = (
  entityConfig?: MapAnimationConfigSource,
  scale = 1,
): unknown[] =>
  getEntityRadiusExpression(entityConfig, 'symbol', scale * symbolTextSizeScale);

const withEntityCircleRadius = (
  paint: CirclePaint | undefined,
  entityConfig?: MapAnimationConfigSource,
): CirclePaint | undefined => {
  if (!paint) return paint;
  return {
    ...paint,
    'circle-radius': getEntityRadiusExpression(entityConfig, 'circle'),
  } as unknown as CirclePaint;
};

interface CreateSourceType {
  source?: string;
  minzoom?: number;
  url: string;
  map: Map;
  schoolData?: GeoJSONFeatureCollection;
}

export const isDefaultStyle = (style: string) => {
  return gigaThemeList.includes(style as ThemeType);
};

export const mapDotsClickIdsAndHandler = {
  [CONNECTIVITY_STATUS_SOURCE]: {},
  [DEFAULT_SOURCE]: {},
} as Record<string, Record<string, (event: MapLayerMouseEvent) => void>>;

export const isConnectivity = (id: string) =>
  id === `${Layers.connectivity}_layer`;
export const isCoverage = (id: string) => id === `${Layers.coverage}_layer`;

const getEntityTypeFromMapLayerId = (layerId?: string): EntityType | null => {
  if (!layerId) return null;
  if (layerId.startsWith('entity-status-')) {
    return layerId.replace('entity-status-', '') as EntityType;
  }

  const selectedLayerMatch = layerId.match(/^entity-selected-(.+)-[^-]+$/);
  if (selectedLayerMatch?.[1]) {
    return selectedLayerMatch[1] as EntityType;
  }

  return null;
};

const getEntityIdFromFeatureProperties = (
  properties: MapboxGeoJSONFeature['properties'],
  entityType: EntityType | null,
): number | null => {
  if (!properties) return null;

  const entityId =
    (entityType ? properties[`${entityType}_entity_id`] : undefined) ??
    (entityType ? properties[`${entityType}_id`] : undefined) ??
    properties.entity_id ??
    properties.id ??
    (entityType === EntityType.SCHOOL ? properties.school_id : undefined);

  const numericEntityId = Number(entityId);
  return Number.isFinite(numericEntityId) && numericEntityId > 0
    ? numericEntityId
    : null;
};

export const removePreviewsMapClickHandlers = (map: Map, source: string) => {
  const ids = Object.keys(mapDotsClickIdsAndHandler[source]);
  if (!ids?.length) return;
  ids?.forEach((id) => {
    map.off('click', id, mapDotsClickIdsAndHandler[source][id]);
    delete mapDotsClickIdsAndHandler?.[source]?.[id];
    resetDublicateSchoolClickData();
  });
};

export const onClickOnEntityDots = (map: Map, id: string, source: string) => {
  if (!mapDotsClickIdsAndHandler[source]) {
    mapDotsClickIdsAndHandler[source] = {};
  }
  mapDotsClickIdsAndHandler[source][id] = (e: MapLayerMouseEvent) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: [
        ...Object.keys(mapDotsClickIdsAndHandler[DEFAULT_SOURCE]),
        ...Object.keys(mapDotsClickIdsAndHandler[CONNECTIVITY_STATUS_SOURCE]),
      ],
    });
    if (!features.length) return;
    const ids = new Set(
      features.map((feature) => {
        return feature.layer.id;
      }),
    );
    if (ids.size === 2 && getMapId(SCHOOL_STATUS_LAYER.id) === id) {
      return;
    }
    const clickedLayerEntityType = getEntityTypeFromMapLayerId(id);
    const feature =
      features.find((item) => item.layer.id === id) ?? features[0];
    const fallbackFeature = features.find((item) => item !== feature);
    const entityType =
      clickedLayerEntityType ??
      getEntityTypeFromMapLayerId(feature?.layer?.id) ??
      getEntityTypeFromMapLayerId(fallbackFeature?.layer?.id);
    if (!entityType) return;
    const entityId =
      getEntityIdFromFeatureProperties(feature?.properties, entityType) ??
      getEntityIdFromFeatureProperties(fallbackFeature?.properties, entityType);
    if (!entityId) return;
    const activePopup = $activeSchoolPopup.getState();
    if (activePopup?.id === entityId && activePopup.entityType === entityType) {
      setPopupOnClickDot(null);
      return;
    }
    if (feature?.layer?.id) {
      setSchoolFocusLatLng(feature?.geometry?.coordinates as PointCoordinates);
      setPopupOnClickDot({
        id: entityId,
        entityType,
        geopoint: feature.geometry as GeoJSONPoint,
        allowDublicateSchoolIds: true,
      });
    }
  };
  map.on('click', id, mapDotsClickIdsAndHandler[source][id]);
};

export const onClickOnSchoolDots = onClickOnEntityDots;

const setCurrentRadius = (
  entityConfig?: MapAnimationConfigSource,
  fallbackMarkerType: MarkerType = 'circle',
) => {
  let lastZoom = Number.NaN;
  let radiusValue = [0, 0];
  const { glowMaxScale, glowMinScale, zoomRadius } = getEntityMapAnimation(
    entityConfig,
    fallbackMarkerType,
  );
  return (currentZoom: number) => {
    if (currentZoom === lastZoom) {
      return radiusValue;
    }
    lastZoom = currentZoom;
    const baseRadius = getRadiusAtZoom(zoomRadius, currentZoom);
    radiusValue = [baseRadius * glowMinScale, baseRadius * glowMaxScale];
    return radiusValue;
  };
};

export function animateCircles({
  map,
  id: layer,
  entityConfig,
  fallbackMarkerType = 'circle',
}: {
  map: Map;
  id: string;
  entityConfig?: MapAnimationConfigSource;
  fallbackMarkerType?: MarkerType;
}) {
  const animationFrameData = { requestId: 0 };
  const { opacityMax, opacityMin } = animateCircleConfig;
  const { growSpeed } = getEntityMapAnimation(entityConfig, fallbackMarkerType);
  const duration = animateCircleConfig.duration / growSpeed;
  let startTime = performance.now();
  let isGrowing = true;
  const getMaxRadius = setCurrentRadius(entityConfig, fallbackMarkerType);
  function animateFrame(time: number) {
    const mapLayer = map.getLayer(layer) as { type?: string } | undefined;
    if (!mapLayer) {
      animationFrameData.requestId = requestAnimationFrame(animateFrame);
      return;
    }
    const zoom = Number(map.getZoom().toFixed(1));
    const [startRadius, maxRadius] = getMaxRadius(zoom);
    let progress = time - startTime;
    if (progress >= duration) {
      progress = duration;
    }
    let radius =
      (progress / duration) * (maxRadius - startRadius) + startRadius;
    let opacity =
      opacityMax - (progress / duration) * (opacityMax - opacityMin);
    if (!isGrowing) {
      radius = maxRadius - (progress / duration) * (maxRadius - startRadius);
      opacity = (progress / duration) * (opacityMax - opacityMin) + opacityMin;
    }
    const nextOpacity = opacity > opacityMax ? opacityMax : opacity;
    if (mapLayer.type === 'symbol') {
      map.setLayoutProperty(layer, 'text-size', radius * symbolTextSizeScale);
      map.setPaintProperty(layer, 'text-opacity', nextOpacity);
    } else {
      map.setPaintProperty(layer, 'circle-radius', radius);
      map.setPaintProperty(layer, 'circle-opacity', nextOpacity);
    }
    if (progress >= duration) {
      // await waitFor(300)
      startTime = performance.now();
      isGrowing = !isGrowing;
    }
    animationFrameData.requestId = requestAnimationFrame(animateFrame);
  }
  animationFrameData.requestId = requestAnimationFrame(animateFrame);
  return animationFrameData;
}
export const getDynamicUrl = () => 'api/v2/entities/layers/map';

const getVisibleEntityTypes = (
  entityRegistry: ChangeLayerOptions['entityRegistry'],
): EntityType[] =>
  Object.entries(entityRegistry ?? {})
    .filter(([, config]) => config.visible)
    .map(([entityType]) => entityType as EntityType);

const getMapRequestEntityTypes = (
  activeEntityTypes: EntityType[] | undefined,
  entityRegistry: ChangeLayerOptions['entityRegistry'],
): {
  entityTypes: EntityType[];
  allEntityTypes: EntityType[];
} => {
  const visibleEntityTypes = getVisibleEntityTypes(entityRegistry);
  const allEntityTypes = visibleEntityTypes.length
    ? visibleEntityTypes
    : activeEntityTypes?.length
      ? activeEntityTypes
      : [EntityType.SCHOOL];
  const entityTypes = activeEntityTypes?.length
    ? activeEntityTypes
    : allEntityTypes;

  return { entityTypes, allEntityTypes };
};

const getEntityLayerId = ({
  entityType,
  selectedLayerIdByEntity,
  fallbackLayerId,
}: {
  entityType: EntityType;
  selectedLayerIdByEntity?: Partial<Record<EntityType, number | null>>;
  fallbackLayerId: number | null;
}) =>
  getEntityMapValue(selectedLayerIdByEntity ?? {}, entityType, fallbackLayerId);

const getEntityTypesWithLayerId = ({
  entityTypes,
  fallbackLayerId,
  layerUtils,
}: {
  entityTypes: EntityType[];
  fallbackLayerId: number | null;
  layerUtils: ChangeLayerOptions['layerUtils'];
}) => {
  const fallbackEntityLayerId =
    entityTypes.length === 1 ? fallbackLayerId : null;

  return entityTypes.filter((entityType) =>
    Boolean(
      getEntityLayerId({
        entityType,
        selectedLayerIdByEntity: layerUtils.selectedLayerIdByEntity,
        fallbackLayerId: fallbackEntityLayerId,
      }),
    ),
  );
};

const generateEntityMapParams = ({
  entityTypes,
  layerUtils,
  fallbackLayerId,
  connectivityFilter,
  interval,
  intervalByEntity,
  intervalUnit,
  intervalUnitByEntity,
  connectivityBenchMark,
  connectivityBenchMarkByEntity,
}: Pick<
  ChangeLayerOptions,
  | 'connectivityBenchMark'
  | 'connectivityBenchMarkByEntity'
  | 'connectivityFilter'
  | 'interval'
  | 'intervalByEntity'
  | 'intervalUnit'
  | 'intervalUnitByEntity'
  | 'layerUtils'
> & {
  entityTypes: EntityType[];
  fallbackLayerId: number | null;
}) => {
  const params = new URLSearchParams();
  const fallbackIntervalUnit =
    intervalUnit ??
    (connectivityFilter.isWeek ? IntervalUnit.week : IntervalUnit.month);

  entityTypes.forEach((entityType) => {
    const prefix = entityType + '_';
    const entityLayerId = getEntityLayerId({
      entityType,
      selectedLayerIdByEntity: layerUtils.selectedLayerIdByEntity,
      fallbackLayerId,
    });
    const isLive = Boolean(
      layerUtils.currentLayerTypeUtilsByEntity?.[entityType]?.isLive,
    );

    if (isLive) {
      const entityInterval = getEntityMapValue(
        intervalByEntity ?? {},
        entityType,
        interval ?? connectivityFilter.range,
      );
      const entityIntervalUnit = getEntityMapValue(
        intervalUnitByEntity ?? {},
        entityType,
        fallbackIntervalUnit,
      );
      params.set(
        prefix + 'start_date',
        format(entityInterval.start, 'dd-MM-yyyy'),
      );
      params.set(prefix + 'end_date', format(entityInterval.end, 'dd-MM-yyyy'));
      params.set(
        prefix + 'is_weekly',
        String(entityIntervalUnit === IntervalUnit.week),
      );
    }

    if (entityLayerId) {
      params.set(prefix + 'layer_id', String(entityLayerId));
    }

    params.set(
      prefix + 'benchmark',
      getEntityMapValue(
        connectivityBenchMarkByEntity ?? {},
        entityType,
        connectivityBenchMark,
      ),
    );
    params.set(prefix + 'include_same_location', 'false');
  });

  return params.toString();
};

export const generateMapParams = ({
  connectivityFilter,
  mapRoute,
  connectivityBenchMark,
  isLive,
  countrySearch,
  schoolPageIds,
}: Pick<
  ChangeLayerOptions,
  | 'countrySearch'
  | 'connectivityFilter'
  | 'mapRoute'
  | 'connectivityBenchMark'
  | 'schoolPageIds'
> & { isLive?: boolean }): string => {
  const { isWeek, range } = connectivityFilter;
  const startDate = format(range.start, 'dd-MM-yyyy');
  const endDate = format(range.end, 'dd-MM-yyyy');
  let params = `${mapRoute.map ? 'limit=5000' : ''}`;
  const benchmark = mapRoute.map
    ? ConnectivityBenchMarks.global
    : connectivityBenchMark;
  if (isLive) {
    params += `&indicator=${'download'}&benchmark=${benchmark}&start_date=${startDate}&end_date=${endDate}&is_weekly=${isWeek.toString()}`;
  }
  if (mapRoute.country && countrySearch) {
    params += `&${countrySearch}`;
  }
  if (schoolPageIds?.length === 1) {
    params += `&exclude_schools_same_coords_except_id=${schoolPageIds[0]}`;
  }
  return params;
};

export const getCountryParams = (
  country: boolean,
  countryId?: number,
  admin1Id?: number | null,
) => {
  let params = country && countryId ? `country_id=${countryId}` : '';
  if (admin1Id) {
    params += `&admin1_id=${admin1Id}`;
  }
  return params;
};

export const generateStaticLayerUrl = ({
  activeEntityTypes,
  mapRoute,
  country,
  admin1Id,
  countrySearch,
  schoolPageIds,
  entityRegistry,
}: Pick<
  ChangeLayerOptions,
  | 'activeEntityTypes'
  | 'entityRegistry'
  | 'mapRoute'
  | 'country'
  | 'countrySearch'
  | 'schoolPageIds'
> & { admin1Id?: number | null }) => {
  const countryParams = getCountryParams(!mapRoute.map, country?.id, admin1Id);
  const { allEntityTypes } = getMapRequestEntityTypes(
    activeEntityTypes,
    entityRegistry,
  );
  const entityParams =
    'entity_type__code=' +
    getEntityTypeCodeParam(activeEntityTypes, allEntityTypes);
  const query = [countryParams, entityParams].filter(Boolean).join('&');
  let params = getBaseUrl(CONNECTIVITY_STATUS_URL + '/?' + query);
  if (countrySearch) {
    params += '&' + countrySearch;
  }
  if (schoolPageIds?.length === 1) {
    params += '&exclude_schools_same_coords_except_id=' + schoolPageIds[0];
  }
  return params + '&z={z}&x={x}&y={y}.mvt';
};
export const generateLayerUrls = ({
  layerId,
  activeEntityTypes,
  connectivityBenchMark,
  connectivityBenchMarkByEntity,
  schoolPageIds,
  layerUtils,
  mapRoute,
  country,
  admin1Id,
  connectivityFilter,
  interval,
  intervalByEntity,
  intervalUnit,
  intervalUnitByEntity,
  countrySearch,
  entityRegistry,
}: Pick<
  ChangeLayerOptions,
  | 'activeEntityTypes'
  | 'connectivityBenchMark'
  | 'connectivityBenchMarkByEntity'
  | 'connectivityFilter'
  | 'countrySearch'
  | 'entityRegistry'
  | 'interval'
  | 'intervalByEntity'
  | 'intervalUnit'
  | 'intervalUnitByEntity'
  | 'layerUtils'
  | 'mapRoute'
  | 'country'
  | 'schoolPageIds'
> & { layerId: number | null; admin1Id?: number | null }) => {
  const countryParams = getCountryParams(!mapRoute.map, country?.id, admin1Id);
  const { entityTypes, allEntityTypes } = getMapRequestEntityTypes(
    activeEntityTypes,
    entityRegistry,
  );
  const isGlobalView = mapRoute.map;
  const requestEntityTypes = isGlobalView
    ? layerId
      ? entityTypes
      : []
    : getEntityTypesWithLayerId({
      entityTypes,
      layerUtils,
      fallbackLayerId: layerId,
    });
  if (!requestEntityTypes.length) return '';

  const entityParams =
    'entity_type__code=' +
    getEntityTypeCodeParam(requestEntityTypes, allEntityTypes);
  const url = isGlobalView ? CONNECTIVITY_URL : getDynamicUrl();
  const requestParams = isGlobalView
    ? generateMapParams({
      connectivityFilter,
      mapRoute,
      isLive: true,
      schoolPageIds,
      connectivityBenchMark,
      countrySearch,
    })
    : generateEntityMapParams({
      entityTypes: requestEntityTypes,
      layerUtils,
      fallbackLayerId: requestEntityTypes.length === 1 ? layerId : null,
      connectivityFilter,
      interval,
      intervalByEntity,
      intervalUnit,
      intervalUnitByEntity,
      connectivityBenchMark,
      connectivityBenchMarkByEntity,
    });
  const normalizedParams = requestParams.startsWith('&')
    ? requestParams.slice(1)
    : requestParams;
  const countryFilterParams =
    !isGlobalView && countrySearch ? countrySearch : '';
  const duplicateLocationParams =
    !isGlobalView && schoolPageIds?.length === 1
      ? 'exclude_schools_same_coords_except_id=' + schoolPageIds[0]
      : '';
  const query = [
    countryParams,
    entityParams,
    normalizedParams,
    countryFilterParams,
    duplicateLocationParams,
  ]
    .filter(Boolean)
    .join('&');
  return getBaseUrl(`${url}/?${query}&z={z}&x={x}&y={y}.mvt`);
};
export const getMapId = (id: number | null, prefix = ''): string => {
  if (id) return `${id}_layer${prefix}`;
  return '';
};

export const createSource = (
  { map, source = DEFAULT_SOURCE, url }: CreateSourceType,
  options: VectorSource,
): void => {
  map.addSource(source, {
    tiles: [url],
    minzoom: 0,
    maxzoom: 18,
    ...options,
    type: 'vector',
  });
};

export const createSchoolSource = ({
  map,
  source = DEFAULT_SOURCE,
  schoolData,
}: CreateSourceType) => {
  map.addSource(source, {
    type: 'geojson',
    data: schoolData as unknown as GeoJSON.FeatureCollection,
  });
};

export const getAllSourceLayers = (map: Map, sourceId = DEFAULT_SOURCE) => {
  const layersFromSource = map
    .getStyle()
    .layers.filter((layer: any) => layer.source === sourceId);
  return layersFromSource;
};

export const checkSourceAvailable = (map: Map, sourceId: string): boolean => {
  const { sources } = map.getStyle();
  return !!sources && !!sources[sourceId];
};

export const deleteSourceAndLayers = ({
  map,
  sourceId = DEFAULT_SOURCE,
}: {
  map: Map;
  sourceId?: string;
}): void => {
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
};

export const showLayer = (map: Map, id: string): void => {
  if (!map.getLayer(id)) return;
  map.setLayoutProperty(id, 'visibility', 'visible');
};

export const hideLayer = (map: Map, id: string): void => {
  if (!map.getLayer(id)) return;
  map.setLayoutProperty(id, 'visibility', 'none');
};

export const createCircleLayer = (
  map: Map,
  options: CircleLayer,
  layerBefore?: string,
) => {
  return map.addLayer(
    {
      minzoom: 0,
      ...options,
    },
    layerBefore && map.getLayer(layerBefore) ? layerBefore : '',
  );
};

export const createSchoolLayer = (
  map: Map,
  {
    id,
    source = DEFAULT_SOURCE,
    paintData,
    options,
    mapRoute,
    isMobile,
    entityConfig,
  }: {
    id: string;
    source?: string;
    paintData: StylePaintData;
    options: Record<string, any>;
    mapRoute: ChangeLayerOptions['mapRoute'];
    isMobile: boolean;
    entityConfig?: EntityConfig;
  },
): void => {
  if (map.getLayer(id)) {
    showLayer(map, id);
    return;
  }

  const connectivityStatusColors = paintData;
  const circleColor = [
    ...mapPaintData.connectivityStatus['circle-color'],
    ConnectivityStatusDistribution.connected,
    connectivityStatusColors.connected,
    ConnectivityStatusDistribution.notConnected,
    connectivityStatusColors.not_connected,
    ConnectivityStatusDistribution.unknown,
    connectivityStatusColors.unknown,
    connectivityStatusColors.unknown,
  ];
  const countryCode = $countryCode.getState();
  const currentCountryPaintData =
    CountryPaintData[
    countryCode?.toLowerCase() as keyof typeof CountryPaintData
    ];
  const paint = withEntityCircleRadius(
    {
      ...mapPaintData.connectivityStatus,
      ...currentCountryPaintData?.connectivityStatus,
      'circle-color': circleColor,
    } as unknown as CirclePaint,
    entityConfig,
  );
  createCircleLayer(map, {
    id,
    type: 'circle',
    source,
    minzoom: 0,
    paint,
    ...options,
  });

  map.off('click', id, mapDotsClickIdsAndHandler[source][id]);
  delete mapDotsClickIdsAndHandler[source][id];
  if (!mapRoute.map) {
    onClickOnSchoolDots(map, id, CONNECTIVITY_STATUS_SOURCE);
  }
};

/**
 * Create a symbol layer for non-circle entity types (health, etc.)
 * Uses text-field with a unicode symbol character from entity registry.
 * Colors are driven by connectivity_status, matching the same logic as createSchoolLayer.
 */
export const createEntitySymbolLayer = (
  map: Map,
  {
    id,
    symbol,
    source = DEFAULT_SOURCE,
    paintData,
    options,
    mapRoute,
    isMobile,
    entityConfig,
  }: {
    id: string;
    symbol: string;
    source?: string;
    paintData: StylePaintData;
    options: Record<string, any>;
    mapRoute: ChangeLayerOptions['mapRoute'];
    isMobile: boolean;
    entityConfig?: EntityConfig;
  },
): void => {
  if (map.getLayer(id)) {
    showLayer(map, id);
    return;
  }

  const connectivityStatusColors = paintData;
  // Build text-color expression matching the same connectivity_status logic as circle-color
  const textColor = [
    ...mapPaintData.connectivityStatus['circle-color'],
    ConnectivityStatusDistribution.connected,
    connectivityStatusColors.connected,
    ConnectivityStatusDistribution.notConnected,
    connectivityStatusColors.not_connected,
    ConnectivityStatusDistribution.unknown,
    connectivityStatusColors.unknown,
    connectivityStatusColors.unknown,
  ];

  const {
    'source-layer': sourceLayer,
    filter: layerFilter,
    ...restOptions
  } = options;

  map.addLayer({
    id,
    type: 'symbol',
    source,
    minzoom: 0,
    layout: {
      'text-field': symbol,
      'text-size': getEntityTextSizeExpression(entityConfig),
      'text-allow-overlap': true,
      'text-ignore-placement': true,
    },
    paint: {
      'text-color': textColor as any,
      'text-opacity': 1,
    },
    ...(sourceLayer ? { 'source-layer': sourceLayer } : {}),
    ...(layerFilter ? { filter: layerFilter } : {}),
    ...restOptions,
  });

  map.off('click', id, mapDotsClickIdsAndHandler[source]?.[id]);
  if (mapDotsClickIdsAndHandler[source]) {
    delete mapDotsClickIdsAndHandler[source][id];
  }
  if (!mapRoute.map) {
    onClickOnSchoolDots(map, id, source);
  }
};

const getConnectivityPaint = (
  colorsConnectivity: StylePaintData,
  isDynamicLayer: boolean,
) => {
  const countryCode = $countryCode.getState();
  const currentCountryPaintData =
    CountryPaintData[
    countryCode?.toLowerCase() as keyof typeof CountryPaintData
    ];
  return {
    ...mapPaintData.connectivity,
    ...currentCountryPaintData?.connectivity,
    'circle-color': [
      ...mapPaintData.connectivity['circle-color'],
      [
        'match',
        [
          'get',
          isDynamicLayer
            ? LayerDataProps.fieldStatus.key
            : LayerDataProps.connectivity.key,
        ],
        ConnectivityDistribution.good,
        colorsConnectivity.good,
        ConnectivityDistribution.moderate,
        colorsConnectivity.moderate,
        ConnectivityDistribution.bad,
        colorsConnectivity.bad,
        ConnectivityDistribution.unknown,
        colorsConnectivity.unknown,
        Colors.TRANSPARENT,
      ],
      Colors.TRANSPARENT,
    ],
  } as unknown as CirclePaint;
};

export const getCoveragePaint = (
  colors: StylePaintData,
  isDynamicLayer: boolean,
) => {
  return {
    ...mapPaintData.coverage,
    'circle-color': [
      ...mapPaintData.coverage['circle-color'],
      [
        'get',
        isDynamicLayer
          ? LayerDataProps.fieldStatus.key
          : LayerDataProps.coverage.key,
      ],
      ConnectivityDistribution.good,
      colors.good,
      ConnectivityDistribution.moderate,
      colors.moderate,
      ConnectivityDistribution.bad,
      colors.bad,
      ConnectivityDistribution.unknown,
      colors.unknown,
      colors.unknown, // Default color for other cases
    ],
  } as unknown as CirclePaint;
};

// eslint-disable-next-line consistent-return
const getPaintData = ({
  isLive,
  paintData,
  isDynamicLayer,
}: {
  isLive?: boolean;
  isDynamicLayer: boolean;
  paintData: StylePaintData;
}): undefined | CirclePaint => {
  if (isLive) {
    return getConnectivityPaint(paintData, isDynamicLayer);
  } else {
    return getCoveragePaint(paintData, isDynamicLayer);
  }
};

export const createSelectedLayer = (
  map: Map,
  {
    id,
    isDynamicLayer,
    source = DEFAULT_SOURCE,
    paintData,
    mapRoute,
    options,
    isLive,
    isMobile,
    entityConfig,
  }: {
    id: string;
    isDynamicLayer: boolean;
    isLive?: boolean;
    source?: string;
    paintData: StylePaintData;
    options: Record<string, unknown>;
    isMobile: boolean;
    entityConfig?: EntityConfig;
    mapRoute: ChangeLayerOptions['mapRoute'];
  },
): void => {
  if (map.getLayer(id)) {
    map.setLayoutProperty(id, 'visibility', 'visible');
    registerDevMultipleSchoolSameLocationHighlight({
      map,
      id,
      source,
      mapRoute,
      markerType: 'circle',
      options,
    });
    return;
  }
  const paint = withEntityCircleRadius(
    getPaintData({ isLive, paintData, isDynamicLayer }),
    entityConfig,
  );

  createCircleLayer(
    map,
    {
      id,
      type: 'circle',
      source,
      minzoom: 0,
      paint,
      ...options,
    },
    getMapId(SCHOOL_LAYER_ID),
  );
  // create on click on dots;
  // clear click event before creating new layer;

  if (mapDotsClickIdsAndHandler[source]) {
    map.off('click', id, mapDotsClickIdsAndHandler[source][id]);
    delete mapDotsClickIdsAndHandler[source][id];
  }
  registerDevMultipleSchoolSameLocationHighlight({
    map,
    id,
    source,
    mapRoute,
    markerType: 'circle',
    options,
    circleRadius: paint?.['circle-radius'],
  });
  if (!mapRoute.map) {
    onClickOnSchoolDots(map, id, source);
  }
};

export const createSelectedSymbolLayer = (
  map: Map,
  {
    id,
    symbol,
    isDynamicLayer,
    source = DEFAULT_SOURCE,
    paintData,
    mapRoute,
    options,
    isLive,
    isMobile,
    entityConfig,
  }: {
    id: string;
    symbol: string;
    isDynamicLayer: boolean;
    isLive?: boolean;
    source?: string;
    paintData: StylePaintData;
    options: Record<string, unknown>;
    isMobile: boolean;
    entityConfig?: EntityConfig;
    mapRoute: ChangeLayerOptions['mapRoute'];
  },
): void => {
  const textSize = getEntityTextSizeExpression(entityConfig);
  if (map.getLayer(id)) {
    map.setLayoutProperty(id, 'visibility', 'visible');
    registerDevMultipleSchoolSameLocationHighlight({
      map,
      id,
      source,
      mapRoute,
      markerType: 'symbol',
      options,
      symbol,
      textSize,
    });
    return;
  }
  const paint = getPaintData({ isLive, paintData, isDynamicLayer });
  const textColor = (paint as Record<string, unknown> | undefined)?.[
    'circle-color'
  ];
  const {
    'source-layer': sourceLayer,
    filter: layerFilter,
    ...restOptions
  } = options;

  const layerBefore = getMapId(SCHOOL_LAYER_ID);
  map.addLayer(
    {
      id,
      type: 'symbol',
      source,
      minzoom: 0,
      layout: {
        'text-field': symbol,
        'text-size': textSize,
        'text-allow-overlap': true,
        'text-ignore-placement': true,
      },
      paint: {
        'text-color': (textColor ?? paintData.unknown) as any,
        'text-opacity': 1,
      },
      ...(sourceLayer ? { 'source-layer': sourceLayer } : {}),
      ...(layerFilter ? { filter: layerFilter } : {}),
      ...restOptions,
    },
    layerBefore && map.getLayer(layerBefore) ? layerBefore : '',
  );

  if (mapDotsClickIdsAndHandler[source]) {
    map.off('click', id, mapDotsClickIdsAndHandler[source][id]);
    delete mapDotsClickIdsAndHandler[source][id];
  }
  registerDevMultipleSchoolSameLocationHighlight({
    map,
    id,
    source,
    mapRoute,
    markerType: 'symbol',
    options,
    symbol,
    textSize,
  });
  if (!mapRoute.map) {
    onClickOnSchoolDots(map, id, source);
  }
};
export const filterCoverageList = (
  coverageFilter: Record<string, boolean>,
  isDynamicLayer = false,
): string[] => {
  const filterList = Object.keys(coverageFilter).filter(
    (keyName: string) => coverageFilter[keyName],
  );

  return [
    'in',
    isDynamicLayer
      ? LayerDataProps.fieldStatus.key
      : LayerDataProps.coverage.key,
  ].concat(filterList);
};

export const filterConnectivityList = (
  connectivitySpeedFilter: Record<string, boolean>,
  isDynamicLayer = false,
) => {
  const filterList = Object.keys(connectivitySpeedFilter).filter(
    (key) => connectivitySpeedFilter[key],
  );
  return [
    'all',
    ['==', 'is_rt_connected', true],
    [
      'in',
      isDynamicLayer
        ? LayerDataProps.fieldStatus.key
        : LayerDataProps.connectivity.key,
    ].concat(filterList),
  ];
};

export const filterSchoolStatus = (lengendsSelected: string[]) => {
  return ['in', LayerDataProps.connectivityStatus.key, ...lengendsSelected];
};

// Creates a worldview filtes for Mapbox Boundaries tilesets
export const wvFilter = (worldview = defaultWorldView) => {
  return [
    'any',
    ['==', 'all', ['get', 'worldview']],
    ['in', worldview, ['get', 'worldview']],
  ];
};

export const notHasDispute = (worldview = defaultWorldView) => {
  return ['all', ['!', ['has', 'dispute']], wvFilter(worldview)];
};
export const filterCountry = (
  countryCode: string,
  operator = '==',
  worldView?: string,
) => {
  // Create a filter expression for the boundary layer using the country and worldview selection
  if (!countryCode) return [];

  return [
    'all',
    [operator, ['get', 'iso_3166_1'], countryCode],
    wvFilter(worldView),
  ];
};

export const matchCountryFilter = (countryCode: string, options: string[]) => {
  return ['match', ['get', 'iso_3166_1'], [countryCode], ...options];
};

export const matchAdminFilter = (
  code: string,
  state: string,
  color: string,
) => {
  return ['case', ['==', ['feature-state', state], code], color, 'transparent'];
};

export const findLayer = (features: MapboxGeoJSONFeature[], id: string) => {
  return features.find((feature) => feature.layer.id === id);
};

export const getInterpolatedValue = (
  stops: [number, number][],
  zoom: number,
): number | undefined => {
  const len = stops.length;

  if (len === 0) throw new Error('Stops array cannot be empty');

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
};
