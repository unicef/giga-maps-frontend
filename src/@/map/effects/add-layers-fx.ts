import { createEffect } from 'effector';
import { Map } from 'mapbox-gl';

import { changeGigaSelection } from '~/@/map/map.model';
import { ChangeLayerOptions, UpdateConnectivityFilterOptions, UpdateConnectivityType, UpdateCoverageFilterOptions } from '~/@/map/map.types';
import { map as mapRouter } from '~/core/routes';
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

import { cancelAnimation, createAndUpdateConnectiivtyStatusLayer, createAndUpdateMapLayer, createSourceForMapAndCountry, getLayerIdsAndLastChange } from './add-layers-utils';
import { CONNECTIVITY_STATUS_SOURCE, DEFAULT_SOURCE, SCHOOL_LAYER_ID } from '../map.constant';

const createAndUpdateLayer = async (props: ChangeLayerOptions): Promise<void> => {
  if (!props.map) { return };
  const {
    map,
    refresh,
    selectedLayerIds,
    lastSelectedLayer,
    mapRoute,
  } = props;
  let { schoolLayerId, selectedLayerId, isLastSelectionChange } = getLayerIdsAndLastChange({ selectedLayerIds, refresh, lastSelectedLayer });
  if (isLastSelectionChange || !checkSourceAvailable(map, DEFAULT_SOURCE)) {
    // create source data country and global view;
    if (mapRoute.map || mapRoute.country || mapRoute.schools) {
      const next = await createSourceForMapAndCountry({ ...props, selectedLayerId });
      if (!next) return;
    }
  }
  // create and update layers 
  createAndUpdateMapLayer({ ...props, selectedLayerId, schoolLayerId });
  // update giga selection
  changeGigaSelection({
    layerId: selectedLayerId ?? lastSelectedLayer.layerId
  });
}

const callDelay = delayMethodCall();
let timerId: ReturnType<typeof setTimeout> | undefined = undefined;

export const changeLayersFx = createEffect((props: ChangeLayerOptions) => {
  let { timeout = 20, zoomState, selectedLayerIds, isCheckedLastDate, mapRoute, refresh, lastSelectedLayer, map } = props;
  if (!map) return;
  clearTimeout(timerId);
  const { isLastSelectionChange } = getLayerIdsAndLastChange({ selectedLayerIds, refresh, lastSelectedLayer });
  const zoomEnd = zoomState === 'end';
  if (isLastSelectionChange) {
    deleteSourceAndLayers({ map })
  }
  if (isLastSelectionChange && !(isCheckedLastDate) || !zoomEnd) {
    return;
  }
  if (mapRoute.map) {
    timeout = 50;
  }
  timerId = callDelay.trigger(timeout, createAndUpdateLayer, props);
});

export const changeStaticLayerFx = createEffect(async (props: ChangeLayerOptions) => {
  const { map, mapRoute, zoomState } = props;
  if (!map) return;
  if (mapRoute.map || zoomState !== 'end') {
    deleteSourceAndLayers({ map, sourceId: CONNECTIVITY_STATUS_SOURCE })
    return;
  }
  const next = await createSourceForMapAndCountry({ ...props, selectedLayerId: null, isConnectivityStatus: true });
  if (!next) return;
  createAndUpdateConnectiivtyStatusLayer(props);
})

export const updateCoverageFilter = createEffect(({ map, layerUtils, coverageFilter, lastSelectedLayer }: UpdateCoverageFilterOptions) => {
  if (!map) return;
  const { selectedLayerId, coverageLayerId } = layerUtils;
  const { isStatic } = layerUtils.currentLayerTypeUtils
  const mapLayer = map.getLayer(getMapId(selectedLayerId));
  if (isStatic && mapLayer) {
    const isDynamicLayer = selectedLayerId !== coverageLayerId;
    const filter = filterCoverageList(coverageFilter, isDynamicLayer);
    map.setFilter(getMapId(selectedLayerId), filter);
  }
})

export const updateConnectivityFilter = createEffect(({ map, layerUtils, connectivitySpeedFilter, lastSelectedLayer }: UpdateConnectivityFilterOptions) => {
  if (!map) return;
  const { selectedLayerId, globalLayerId } = layerUtils;
  const { isLive } = layerUtils.currentLayerTypeUtils;
  const mapLayer = map.getLayer(getMapId(selectedLayerId));
  if (isLive && mapLayer) {
    const isDynamicLayer = selectedLayerId !== globalLayerId;
    const filter = filterConnectivityList(connectivitySpeedFilter, isDynamicLayer);
    map.setFilter(getMapId(selectedLayerId), filter);
  }
})

export const updateConnectivityStatus = createEffect(({ map, lengendsSelected }: UpdateConnectivityType & { lengendsSelected: string[] }) => {
  if (!map) return;
  const layer = map.getLayer(getMapId(SCHOOL_LAYER_ID));
  if (layer) {
    const filter = filterSchoolStatus(lengendsSelected);
    map.setFilter(getMapId(SCHOOL_LAYER_ID), filter);
  }
})

export const clearMapDataFx = createEffect(({ map }: { map: Map | null }) => {
  if (!map) return;
  // clear all running animation
  cancelAnimation()
  // remove click event;
  removePreviewsMapClickHandlers(map, DEFAULT_SOURCE);
  removePreviewsMapClickHandlers(map, CONNECTIVITY_STATUS_SOURCE);

  // delete existing source;
  deleteSourceAndLayers({ map });

  // delete static resource

  deleteSourceAndLayers({ map, sourceId: CONNECTIVITY_STATUS_SOURCE });

})

mapRouter.visible.watch((visible) => {
  if (!visible) {
    cancelAnimation();
  }
})
