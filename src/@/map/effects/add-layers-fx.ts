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
import { map as mapRouter } from '~/core/routes';
import { delayMethodCall } from '~/lib/utils';

import {
  checkSourceAvailable,
  deleteSourceAndLayers,
  filterConnectivityList,
  filterCoverageList,
  filterSchoolStatus,
  removePreviewsMapClickHandlers,
} from '@/map/utils';

import {
  CONNECTIVITY_STATUS_SOURCE,
  DEFAULT_SOURCE,
  getEntitySelectedLayerId,
  getEntityStatusLayerId,
} from '../map.constant';
import {
  cancelAnimation,
  createAndUpdateConnectiivtyStatusLayer,
  createAndUpdateMapLayer,
  createSourceForMapAndCountry,
  getEntityGlobalLayerId,
  getFirstGlobalLayerId,
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
    activeEntityTypes,
  } = props;
  const {
    schoolLayerId,
    selectedLayerId,
    selectedLayerIdByEntity,
    isLastSelectionChange,
  } = getLayerIdsAndLastChange({
    selectedLayerIds,
    refresh,
    lastSelectedLayer,
  });
  const selectedEntityTypes = Object.keys(
    selectedLayerIdByEntity,
  ) as EntityType[];
  const globalEntityTypes = Object.keys(
    layerUtils.globalLayerDataByEntity ?? {},
  ) as EntityType[];
  const entityTypes = activeEntityTypes?.length
    ? activeEntityTypes
    : selectedEntityTypes.length
      ? selectedEntityTypes
      : globalEntityTypes;
  const firstEntitySelectedLayerId =
    entityTypes
      .map((entityType) => selectedLayerIdByEntity[entityType])
      .find((id): id is number => Boolean(id)) ?? null;
  const effectiveSelectedLayerId = mapRoute.map
    ? getFirstGlobalLayerId(layerUtils, entityTypes)
    : (selectedLayerId ?? firstEntitySelectedLayerId);
  const entityTypesWithSelectedLayer = getEntityTypesWithSelectedLayer({
    entityTypes,
    layerUtils,
    mapRoute,
    selectedLayerId: effectiveSelectedLayerId,
    selectedLayerIdByEntity,
  });

  if (!entityTypesWithSelectedLayer.length) {
    deleteSourceAndLayers({ map, sourceId: DEFAULT_SOURCE });
    changeGigaSelection({
      layerId: null,
      layerIdByEntity: selectedLayerIdByEntity,
    });
    return;
  }
  if (isLastSelectionChange || !checkSourceAvailable(map, DEFAULT_SOURCE)) {
    // create source data country and global view;
    if (
      mapRoute.map ||
      mapRoute.country ||
      mapRoute.schools ||
      mapRoute.entity
    ) {
      const next = createSourceForMapAndCountry({
        ...props,
        selectedLayerId: effectiveSelectedLayerId,
        activeEntityTypes: entityTypesWithSelectedLayer,
      });
      if (!next) return;
    }
  }
  // create and update layers
  createAndUpdateMapLayer({
    ...props,
    selectedLayerId: effectiveSelectedLayerId,
    activeEntityTypes: entityTypesWithSelectedLayer,
    schoolLayerId,
  });
  // update giga selection
  changeGigaSelection({
    layerId: effectiveSelectedLayerId ?? lastSelectedLayer?.layerId ?? null,
    layerIdByEntity: mapRoute.map
      ? (activeEntityTypes?.length ? activeEntityTypes : entityTypes).reduce(
          (acc, entityType) => ({
            ...acc,
            [entityType]: getEntityGlobalLayerId(layerUtils, entityType),
          }),
          {} as Partial<Record<EntityType, number | null>>,
        )
      : selectedLayerIdByEntity,
  });
};

const callDelay = delayMethodCall();
let timerId: ReturnType<typeof setTimeout> | undefined = undefined;

const getEntityTypesWithSelectedLayer = ({
  entityTypes,
  layerUtils,
  mapRoute,
  selectedLayerId,
  selectedLayerIdByEntity,
}: {
  entityTypes: EntityType[];
  layerUtils: ChangeLayerOptions['layerUtils'];
  mapRoute: ChangeLayerOptions['mapRoute'];
  selectedLayerId: number | null;
  selectedLayerIdByEntity: Partial<Record<EntityType, number | null>>;
}) => {
  if (mapRoute.map) {
    return entityTypes;
  }

  const fallbackLayerId = entityTypes.length === 1 ? selectedLayerId : null;
  return entityTypes.filter((entityType) =>
    Boolean(selectedLayerIdByEntity[entityType] ?? fallbackLayerId),
  );
};

export const changeLayersFx = createEffect((props: ChangeLayerOptions) => {
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

const hasSelectedEntityStatusLayer = ({
  activeEntityTypes,
  selectedLayerIds,
}: Pick<ChangeLayerOptions, 'activeEntityTypes' | 'selectedLayerIds'>) => {
  const { schoolId, schoolIdByEntity = {} } = selectedLayerIds ?? {};
  const entityTypes = activeEntityTypes?.length
    ? activeEntityTypes
    : (Object.keys(schoolIdByEntity) as EntityType[]);

  return entityTypes.length
    ? entityTypes.some((entityType) => Boolean(schoolIdByEntity[entityType])) ||
        Boolean(schoolId)
    : Boolean(schoolId);
};
export const changeStaticLayerFx = createEffect((props: ChangeLayerOptions) => {
  const { map, mapRoute, refresh, zoomState } = props;
  if (!map) return;
  if (mapRoute.map || zoomState !== 'end') {
    deleteSourceAndLayers({ map, sourceId: CONNECTIVITY_STATUS_SOURCE });
    return;
  }
  if (!hasSelectedEntityStatusLayer(props)) {
    deleteSourceAndLayers({ map, sourceId: CONNECTIVITY_STATUS_SOURCE });
    return;
  }

  const shouldReloadSource =
    refresh || !checkSourceAvailable(map, CONNECTIVITY_STATUS_SOURCE);
  if (shouldReloadSource) {
    const next = createSourceForMapAndCountry({
      ...props,
      selectedLayerId: null,
      isConnectivityStatus: true,
    });
    if (!next) return;
  }
  createAndUpdateConnectiivtyStatusLayer(props);
});

export const updateCoverageFilter = createEffect(
  ({
    map,
    layerUtils,
    coverageFilter,
    coverageFilterByEntity,
  }: UpdateCoverageFilterOptions) => {
    if (!map) return;
    const { selectedLayerId, selectedLayerIdByEntity } = layerUtils;
    const activeEntityTypes = Object.keys(
      selectedLayerIdByEntity ?? { [EntityType.SCHOOL]: selectedLayerId },
    ) as EntityType[];
    const { isStatic } = layerUtils.currentLayerTypeUtils;
    if (isStatic) {
      for (const entityType of activeEntityTypes.length
        ? activeEntityTypes
        : [EntityType.SCHOOL]) {
        const effectiveSelectedLayerId =
          selectedLayerIdByEntity?.[entityType] ?? selectedLayerId;
        const layerId = getEntitySelectedLayerId(
          entityType,
          effectiveSelectedLayerId,
        );
        const mapLayer = map.getLayer(layerId);
        if (!mapLayer) continue;
        const filter = filterCoverageList(
          coverageFilterByEntity?.[entityType] ?? coverageFilter,
          true,
        );
        map.setFilter(layerId, filter);
      }
    }
  },
);

export const updateConnectivityFilter = createEffect(
  ({
    map,
    layerUtils,
    connectivitySpeedFilter,
    connectivitySpeedFilterByEntity,
    mapRoute,
    activeEntityTypes,
  }: UpdateConnectivityFilterOptions) => {
    if (!map) return;
    const {
      selectedLayerId,
      selectedLayerIdByEntity,
      currentLayerTypeUtils,
      currentLayerTypeUtilsByEntity,
    } = layerUtils;
    const selectedEntityTypes = Object.keys(
      selectedLayerIdByEntity ?? {},
    ) as EntityType[];
    const isGlobalMap = Boolean(mapRoute?.map);
    const entityTypes =
      isGlobalMap && activeEntityTypes?.length
        ? activeEntityTypes
        : selectedEntityTypes.length
          ? selectedEntityTypes
          : [EntityType.SCHOOL];
    for (const entityType of entityTypes) {
      const effectiveSelectedLayerId = isGlobalMap
        ? getEntityGlobalLayerId(layerUtils, entityType)
        : (selectedLayerIdByEntity?.[entityType] ?? selectedLayerId);
      if (!isGlobalMap && !effectiveSelectedLayerId) continue;
      const isEntityLive =
        isGlobalMap ||
        (currentLayerTypeUtilsByEntity?.[entityType]?.isLive ??
          currentLayerTypeUtils.isLive);
      if (!isEntityLive) continue;
      const layerId = getEntitySelectedLayerId(
        entityType,
        effectiveSelectedLayerId,
      );
      const mapLayer = map.getLayer(layerId);
      if (!mapLayer) continue;
      const isDynamicLayer = !isGlobalMap;
      const filter = filterConnectivityList(
        connectivitySpeedFilterByEntity?.[entityType] ??
          connectivitySpeedFilter,
        isDynamicLayer,
      );
      map.setFilter(layerId, filter);
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
