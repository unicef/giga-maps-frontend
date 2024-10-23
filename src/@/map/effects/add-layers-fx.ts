import { createEffect } from 'effector';
import { Map } from 'mapbox-gl';

import { changeGigaSelection } from '~/@/map/map.model';
import { ChangeLayerOptions, UpdateConnectivityFilterOptions, UpdateConnectivityType, UpdateCoverageFilterOptions } from '~/@/map/map.types';
import { map as mapRouter } from '~/core/routes';
import { delayMethodCall } from '~/lib/utils';

import {
  checkSourceAvailable,
  defaultSource,
  deleteSourceAndLayers,
  filterConnectivityList,
  filterCoverageList,
  filterSchoolStatus,
  getMapId,
  removePreviewsMapClickHandlers,
} from '@/map/utils';

import { cancelAnimation, createAndUpdateMapLayer, createSourceForMapAndCountry, createSourceForSchool, getLayerIdsAndLastChange } from './add-layers-utils';

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
  if (isLastSelectionChange || !checkSourceAvailable(map, defaultSource)) {
    // create source data country and global view;
    if (mapRoute.map || mapRoute.country || mapRoute.schools) {
      const next = await createSourceForMapAndCountry({ ...props, selectedLayerId });
      if (!next) return;
    }
    // else if (mapRoute.schools) {
    //   createSourceForSchool({ ...props, selectedLayerId });
    // }
  }
  // create and update layers 
  createAndUpdateMapLayer({ ...props, selectedLayerId, schoolLayerId });
  // update giga selection
  changeGigaSelection({
    schoolId: schoolLayerId,
    layerId: selectedLayerId ?? lastSelectedLayer.layerId
  });
}

const callDelay = delayMethodCall();

export const changeLayersFx = createEffect((props: ChangeLayerOptions) => {
  let { timeout = 100, selectedLayerIds, isCheckedLastDate, mapRoute, refresh, lastSelectedLayer, map } = props;
  if (!map) return;
  const { isLastSelectionChange } = getLayerIdsAndLastChange({ selectedLayerIds, refresh, lastSelectedLayer });
  if (isLastSelectionChange) {
    deleteSourceAndLayers({ map })
  }
  if (isLastSelectionChange && !(isCheckedLastDate || mapRoute.map)) {
    return;
  }
  if (mapRoute.map) {
    timeout = 1000;
  }
  callDelay(timeout, createAndUpdateLayer, props);
});

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
  const { selectedLayerId, downloadLayerId } = layerUtils;
  const { isLive } = layerUtils.currentLayerTypeUtils;
  const mapLayer = map.getLayer(getMapId(selectedLayerId));
  if (isLive && mapLayer) {
    const isDynamicLayer = selectedLayerId !== downloadLayerId;
    const filter = filterConnectivityList(connectivitySpeedFilter, isDynamicLayer);
    map.setFilter(getMapId(selectedLayerId), filter);
  }
})

export const updateConnectivityStatus = createEffect(({ map, lengendsSelected, lastSelectedLayer }: UpdateConnectivityType & { lengendsSelected: string[] }) => {
  if (!map) return;
  const { schoolId } = lastSelectedLayer;
  const layer = map.getLayer(getMapId(schoolId));
  if (layer) {
    const filter = filterSchoolStatus(lengendsSelected);
    map.setFilter(getMapId(schoolId), filter);
  }
})

export const clearMapDataFx = createEffect(({ map }: { map: Map | null }) => {
  if (!map) return;
  // clear all running animation
  cancelAnimation()
  // remove click event;
  removePreviewsMapClickHandlers(map);
  // delete existing source;
  deleteSourceAndLayers({ map });

})

mapRouter.visible.watch((visible) => {
  if (!visible) {
    cancelAnimation();
  }
})
