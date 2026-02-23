import { createEffect } from 'effector';
import { Map, MapLayerMouseEvent, Popup } from 'mapbox-gl';

import { $entityRegistry } from '~/@/entities/models/entity.model';
import { setEntityPopupData, setEntityLoading } from '~/@/entities/models/entity.model';
import { fetchEntityPopupDataFx } from '~/api/entities';
import { createPopup } from '~/@/map/popup/popup.util';
import { $countryCode } from '~/@/country/country.model';
import { navigateToEntity } from '~/@/entities/utils/entity-navigation';
import type { EntityType } from '~/@/entities/types/base-entity.type';

// Register global handler for popup "View details" button
(window as any).__navigateToEntity__ = (
  entityType: string,
  entityId: number,
  country: string
) => {
  navigateToEntity(entityType as EntityType, entityId, country);
};

/**
 * Tracks registered click handlers per entity layer so we can clean them up.
 */
const entityClickHandlers: Record<string, (e: MapLayerMouseEvent) => void> = {};
let activeEntityPopup: Popup | null = null;

/**
 * Get entity type from a layer ID.
 * Entity layers are named: entity-{type}, entity-{type}-circle, entity-{type}-symbol
 */
const getEntityTypeFromLayerId = (layerId: string): string | null => {
  const match = layerId.match(/^entity-([^-]+)/);
  return match ? match[1] : null;
};

/**
 * Register a click handler on an entity layer.
 * On click, it fetches entity popup data from the API and creates a Mapbox popup.
 */
export const registerEntityClickHandler = (map: Map, layerId: string, entityType: string): void => {
  // Remove old handler if exists
  if (entityClickHandlers[layerId]) {
    map.off('click', layerId, entityClickHandlers[layerId]);
    delete entityClickHandlers[layerId];
  }

  const handler = async (e: MapLayerMouseEvent) => {
    const features = map.queryRenderedFeatures(e.point, { layers: [layerId] });
    if (!features.length) return;

    const feature = features[0];
    const entityId = feature.properties?.id;
    if (!entityId) return;

    const registry = $entityRegistry.getState();
    const config = registry[entityType];
    if (!config || !config.apiEndpoint) return;

    // Remove previous entity popup
    if (activeEntityPopup) {
      activeEntityPopup.remove();
      activeEntityPopup = null;
    }

    // Show loading state
    setEntityLoading(true);
    setEntityPopupData({
      entityType: entityType as EntityType,
      data: null,
    });

    // Create popup at click location
    const coordinates = (feature.geometry as GeoJSON.Point).coordinates.slice() as [number, number];
    const popup = createPopup({ closeOnMove: false, closeOnClick: true });
    const popupDiv = document.createElement('div');
    popupDiv.className = 'entity-popup-root';
    popupDiv.innerHTML = '<div style="padding: 12px; min-width: 180px; font-size: 0.75rem; color: #666;">Loading...</div>';

    popup.setLngLat(coordinates).setDOMContent(popupDiv).addTo(map);
    activeEntityPopup = popup;

    popup.on('close', () => {
      setEntityPopupData(null);
      setEntityLoading(false);
      activeEntityPopup = null;
    });

    // Fetch entity data
    try {
      const data = await fetchEntityPopupDataFx({
        entityType: entityType as EntityType,
        entityId: Number(entityId),
      });

      setEntityLoading(false);
      setEntityPopupData({
        entityType: entityType as EntityType,
        data: data as any,
      });

      // Update popup content
      const name = (data as any)?.name ?? `${config.displayName} #${entityId}`;
      const geopoint = (data as any)?.geopoint;
      const fields = config.fields.filter(f => f.showInPopup);

      let html = `
        <div style="width: 230px; padding: 12px;">
          <div style="font-size: 0.6rem; text-transform: uppercase; opacity: 0.6; letter-spacing: 0.05em;">${config.displayName}</div>
          <div style="font-size: 0.875rem; font-weight: 600; margin: 4px 0;">${name}</div>
      `;
      if (geopoint?.coordinates) {
        const coords = [...geopoint.coordinates].reverse().map((c: number) => c.toFixed(4)).join(', ');
        html += `<div style="font-size: 0.75rem; color: #888; margin-top: 4px;">📍 ${coords}</div>`;
      }
      if (fields.length > 0) {
        html += '<hr style="border: none; border-top: 1px solid #eee; margin: 8px 0;" />';
        fields.forEach(field => {
          const value = (data as any)?.[field.name];
          const displayValue = value !== undefined && value !== null ? `${value}${field.unit ? ` ${field.unit}` : ''}` : '—';
          html += `<div style="display: flex; justify-content: space-between; margin-top: 4px; font-size: 0.75rem;">
            <span style="color: #888;">${field.label}</span>
            <span style="font-weight: 500;">${displayValue}</span>
          </div>`;
        });
      }

      // "View details" button navigates to /map/entities
      const country = $countryCode.getState()?.toLowerCase() || '';
      html += `<div style="margin-top: 10px; text-align: center;">
        <button
          onclick="window.__navigateToEntity__('${entityType}', ${entityId}, '${country}')"
          style="background: #277AFF; color: white; border: none; border-radius: 4px; padding: 6px 16px; font-size: 0.75rem; cursor: pointer; width: 100%;">
          View Details →
        </button>
      </div>`;

      html += '</div>';
      popupDiv.innerHTML = html;
    } catch (error) {
      setEntityLoading(false);
      popupDiv.innerHTML = '<div style="padding: 12px; color: #e74c3c; font-size: 0.75rem;">Failed to load data</div>';
    }
  };

  entityClickHandlers[layerId] = handler;
  map.on('click', layerId, handler);
};

/**
 * Remove all registered entity click handlers from the map.
 */
export const removeAllEntityClickHandlers = (map: Map): void => {
  Object.entries(entityClickHandlers).forEach(([layerId, handler]) => {
    map.off('click', layerId, handler);
    delete entityClickHandlers[layerId];
  });
};

/**
 * Register click handlers for all entity layers currently on the map.
 */
export const registerEntityClickHandlersForActiveLayers = (map: Map, activeEntityTypes: string[]): void => {
  const registry = $entityRegistry.getState();

  activeEntityTypes.forEach(type => {
    const config = registry[type];
    if (!config || config.useLegacyApi) return; // Skip legacy (schools have their own handler)

    const layerId = `entity-${type}`;

    // Register handlers for possible layer variants
    [layerId, `${layerId}-circle`, `${layerId}-symbol`].forEach(id => {
      if (map.getLayer(id)) {
        registerEntityClickHandler(map, id, type);
      }
    });
  });
};
