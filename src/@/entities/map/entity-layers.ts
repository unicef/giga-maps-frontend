import { CirclePaint, Map, SymbolLayout, SymbolPaint } from 'mapbox-gl';

import { $entityRegistry } from '~/@/entities/models/entity.model';
import type { EntityConfig } from '~/@/entities/config/entity-config.types';
import { ConnectivityStatusDistribution } from '~/@/sidebar/sidebar.constant';
import { DEFAULT_SOURCE } from '~/@/map/map.constant';
import { checkSourceAvailable, showLayer, hideLayer, createCircleLayer } from '~/@/map/utils';
import type { StylePaintData } from '~/@/map/map.types';
import { registerEntityClickHandlersForActiveLayers } from './entity-click-handler';

/**
 * Creates a map layer for a non-legacy entity type.
 * Uses the entity registry config for colors and marker style.
 *
 * This does NOT modify school layers — schools continue using createSchoolLayer.
 */
export const createEntityLayer = (
  map: Map,
  {
    entityType,
    source = DEFAULT_SOURCE,
    paintData,
    options = {},
  }: {
    entityType: string;
    source?: string;
    paintData: StylePaintData;
    options?: Record<string, any>;
  }
): void => {
  const registry = $entityRegistry.getState();
  const config = registry[entityType];
  if (!config || config.useLegacyApi) return;

  const layerId = `entity-${entityType}`;

  // If layer already exists, just show it
  if (map.getLayer(layerId)) {
    showLayer(map, layerId);
    return;
  }

  const colors = config.colors;

  // Color expression based on connectivity_status
  const colorExpression: any[] = [
    'match',
    ['get', 'connectivity_status'],
    ConnectivityStatusDistribution.connected, colors.connected,
    ConnectivityStatusDistribution.notConnected, colors.not_connected,
    ConnectivityStatusDistribution.unknown, colors.unknown,
    colors.unknown, // default
  ];

  if (config.markerType === 'symbol') {
    // Symbol layer (e.g., health facilities with ⚕ marker)
    const symbolMinZoom = config.zoomLevels?.symbolMinZoom ?? 8;

    // Circle layer for low zoom
    const circlePaint: CirclePaint = {
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 0, 1, 5, 2, 8, 3],
      'circle-color': colorExpression as any,
      'circle-opacity': 0.8,
    };

    createCircleLayer(map, {
      id: `${layerId}-circle`,
      type: 'circle',
      source,
      maxzoom: config.zoomLevels?.circleMaxZoom ?? 7.99,
      paint: circlePaint,
      ...options,
    } as any);

    // Symbol layer for high zoom
    if (!map.getLayer(`${layerId}-symbol`)) {
      map.addLayer({
        id: `${layerId}-symbol`,
        type: 'symbol',
        source,
        minzoom: symbolMinZoom,
        layout: {
          'text-field': config.markerSymbol ?? '●',
          'text-size': ['interpolate', ['linear'], ['zoom'], 8, 10, 12, 16],
          'text-allow-overlap': true,
          'text-ignore-placement': true,
        } as SymbolLayout,
        paint: {
          'text-color': colorExpression as any,
          'text-opacity': 0.9,
        } as SymbolPaint,
        ...options,
      } as any);
    }
  } else {
    // Circle-only layer
    const circlePaint: CirclePaint = {
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 0, 1, 5, 2, 8, 4],
      'circle-color': colorExpression as any,
      'circle-opacity': 0.8,
    };

    createCircleLayer(map, {
      id: layerId,
      type: 'circle',
      source,
      paint: circlePaint,
      ...options,
    } as any);
  }
};

/**
 * Hide all entity layers for a given entity type.
 */
export const hideEntityLayer = (map: Map, entityType: string): void => {
  const layerId = `entity-${entityType}`;
  hideLayer(map, layerId);
  hideLayer(map, `${layerId}-circle`);
  hideLayer(map, `${layerId}-symbol`);
};

/**
 * Create/show entity layers for all active non-legacy entity types.
 */
export const createActiveEntityLayers = (
  map: Map,
  {
    activeEntityTypes,
    paintData,
    source = DEFAULT_SOURCE,
    options = {},
  }: {
    activeEntityTypes: string[];
    paintData: StylePaintData;
    source?: string;
    options?: Record<string, any>;
  }
): void => {
  const registry = $entityRegistry.getState();

  // For each entity type in the registry
  Object.keys(registry).forEach(type => {
    const config = registry[type];
    if (config.useLegacyApi) return; // Skip legacy entities (schools)

    if (activeEntityTypes.includes(type)) {
      // Active: show/create layer
      createEntityLayer(map, { entityType: type, source, paintData, options });
    } else {
      // Inactive: hide layer
      hideEntityLayer(map, type);
    }
  });

  // Register click handlers for active entity layers
  registerEntityClickHandlersForActiveLayers(map, activeEntityTypes);
};
