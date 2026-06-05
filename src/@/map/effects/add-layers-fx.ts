import { createEffect } from 'effector';
import { Map } from 'mapbox-gl';

import { EntityType } from '~/@/entities/types/base-entity.type';
import { changeGigaSelection } from '~/@/map/map.model';
import {
  ChangeLayerOptions,
  UpdateConnectivityFilterOptions,
  UpdateConnectivityType,
  UpdateCoverageFilterOptions,
} from '~/@/map/map.types';
import { $mapRoutes, map as mapRouter } from '~/core/routes';
import { delayMethodCall } from '~/lib/utils';

import {
  checkSourceAvailable,
  deleteSourceAndLayers,
  filterConnectivityList,
  filterCoverageList,
  filterSchoolStatus,
  getMapId,
  removePreviewsMapClickHandlers,
} from '@/map/utils';

import {
  CONNECTIVITY_STATUS_SOURCE,
  DEFAULT_SOURCE,
  getEntityStatusLayerId,
} from '../map.constant';
import {
  cancelAnimation,
  createAndUpdateConnectiivtyStatusLayer,
  createAndUpdateMapLayer,
  createSourceForMapAndCountry,
  getLayerIdsAndLastChange,
} from './add-layers-utils';

const createAndUpdateLayer = (props: ChangeLayerOptions): void => {
  if (!props.map) {
    return;
  }
  const {
    map,
    refresh,
    selectedLayerIds,
    lastSelectedLayer,
    mapRoute,
    layerUtils,
  } = props;
  const { schoolLayerId, selectedLayerId, isLastSelectionChange } =
    getLayerIdsAndLastChange({ selectedLayerIds, refresh, lastSelectedLayer });
  const effectiveSelectedLayerId = mapRoute.map
    ? layerUtils.globalLayerId
    : selectedLayerId;
  if (isLastSelectionChange || !checkSourceAvailable(map, DEFAULT_SOURCE)) {
    // create source data country and global view;
    if (mapRoute.map || mapRoute.country || mapRoute.schools) {
      const next = createSourceForMapAndCountry({
        ...props,
        selectedLayerId: effectiveSelectedLayerId,
      });
      if (!next) return;
    }
  }
  // create and update layers
  createAndUpdateMapLayer({
    ...props,
    selectedLayerId: effectiveSelectedLayerId,
    schoolLayerId,
  });
  // update giga selection
  changeGigaSelection({
    layerId: effectiveSelectedLayerId ?? lastSelectedLayer.layerId,
  });
};

const callDelay = delayMethodCall();
let timerId: ReturnType<typeof setTimeout> | undefined = undefined;

export const changeLayersFx = createEffect((props: ChangeLayerOptions) => {
  // temporary stop map layer redering;
  if (!$mapRoutes.getState().map) return;
  const {
    timeout = 20,
    zoomState,
    selectedLayerIds,
    isCheckedLastDate,
    refresh,
    lastSelectedLayer,
    map,
  } = props;
  if (!map) return;
  clearTimeout(timerId);
  const { isLastSelectionChange } = getLayerIdsAndLastChange({
    selectedLayerIds,
    refresh,
    lastSelectedLayer,
  });
  const zoomEnd = zoomState === 'end';
  if (isLastSelectionChange) {
    deleteSourceAndLayers({ map });
  }
  if ((isLastSelectionChange && !isCheckedLastDate) || !zoomEnd) {
    return;
  }
  timerId = callDelay.trigger(timeout, createAndUpdateLayer, props);
});

export const changeStaticLayerFx = createEffect((props: ChangeLayerOptions) => {
  const { map, mapRoute, zoomState } = props;
  if (!map) return;
  if (mapRoute.map || zoomState !== 'end') {
    deleteSourceAndLayers({ map, sourceId: CONNECTIVITY_STATUS_SOURCE });
    return;
  }
  const next = createSourceForMapAndCountry({
    ...props,
    selectedLayerId: null,
    isConnectivityStatus: true,
  });
  if (!next) return;
  createAndUpdateConnectiivtyStatusLayer(props);
});

export const updateCoverageFilter = createEffect(
  ({ map, layerUtils, coverageFilter }: UpdateCoverageFilterOptions) => {
    if (!map) return;
    const { selectedLayerId } = layerUtils;
    const { isStatic } = layerUtils.currentLayerTypeUtils;
    const mapLayer = map.getLayer(getMapId(selectedLayerId));
    if (isStatic && mapLayer) {
      const filter = filterCoverageList(coverageFilter, true);
      map.setFilter(getMapId(selectedLayerId), filter);
    }
  },
);

export const updateConnectivityFilter = createEffect(
  ({
    map,
    layerUtils,
    connectivitySpeedFilter,
    mapRoute,
  }: UpdateConnectivityFilterOptions) => {
    if (!map) return;
    const { selectedLayerId, globalLayerId } = layerUtils;
    const effectiveSelectedLayerId = mapRoute.map
      ? globalLayerId
      : selectedLayerId;
    const isLive = mapRoute.map || layerUtils.currentLayerTypeUtils.isLive;
    const mapLayer = map.getLayer(getMapId(effectiveSelectedLayerId));
    if (isLive && mapLayer) {
      const isDynamicLayer = effectiveSelectedLayerId !== globalLayerId;
      const filter = filterConnectivityList(
        connectivitySpeedFilter,
        isDynamicLayer,
      );
      map.setFilter(getMapId(effectiveSelectedLayerId), filter);
    }
  },
);

export const updateConnectivityStatus = createEffect(
  ({
    map,
    lengendsSelected,
    legendsSelectedByEntity,
    activeEntityTypes,
  }: Pick<UpdateConnectivityType, 'map'> & {
    lengendsSelected?: string[];
    legendsSelectedByEntity?: Record<string, string[]>;
    activeEntityTypes?: string[];
  }) => {
    if (!map) return;
    const entityTypes = activeEntityTypes?.length
      ? activeEntityTypes
      : [EntityType.SCHOOL];
    for (const entityType of entityTypes) {
      const layerId = getEntityStatusLayerId(entityType);
      const layer = map.getLayer(layerId);
      if (layer) {
        const filter = filterSchoolStatus(
          legendsSelectedByEntity?.[entityType] ?? lengendsSelected ?? [],
        );
        map.setFilter(layerId, filter);
      }
    }
  },
);

export const clearMapDataFx = createEffect(({ map }: { map: Map | null }) => {
  if (!map) return;
  // clear all running animation
  cancelAnimation();
  // remove click event;
  removePreviewsMapClickHandlers(map, DEFAULT_SOURCE);
  removePreviewsMapClickHandlers(map, CONNECTIVITY_STATUS_SOURCE);

  // delete existing source;
  deleteSourceAndLayers({ map });

  // delete static resource

  deleteSourceAndLayers({ map, sourceId: CONNECTIVITY_STATUS_SOURCE });
});

mapRouter.visible.watch((visible) => {
  if (!visible) {
    cancelAnimation();
  }
});
