import {
  createAndUpdateMapLayer,
  createSourceForMapAndCountry,
  getLayerIdsAndLastChange,
} from '../effects/add-layers-utils';
import { EntityType } from '~/@/entities';

describe('addLayerUtils', () => {
  it('should return entity layer ids and selection change status', () => {
    const lastSelectedLayer = {
      layerIdByEntity: { [EntityType.SCHOOL]: 2 },
    };
    const { selectedLayerIdByEntity, isLastSelectionChange } =
      getLayerIdsAndLastChange({
        lastSelectedLayer,
        refresh: false,
        selectedLayerIds: {
          schoolIdByEntity: { [EntityType.SCHOOL]: 'school_status' },
          selectedIdByEntity: { [EntityType.SCHOOL]: 3 },
        },
      });

    expect(selectedLayerIdByEntity[EntityType.SCHOOL]).toBe(3);
    expect(isLastSelectionChange).toBe(true);
  });

  it('should set isLastSelectionChange to false if selectedLayerId matches lastSelectedLayer.layerId', () => {
    const selectedLayerIds = {
      schoolIdByEntity: { [EntityType.SCHOOL]: 'school_status' },
      selectedIdByEntity: { [EntityType.SCHOOL]: 2 },
    };
    const lastSelectedLayer = {
      layerIdByEntity: { [EntityType.SCHOOL]: 2 },
    };
    const { isLastSelectionChange } = getLayerIdsAndLastChange({
      selectedLayerIds,
      lastSelectedLayer,
    });

    expect(isLastSelectionChange).toBe(false);
  });

  it('should set isLastSelectionChange to true if refresh is true', () => {
    const selectedLayerIds = {
      schoolIdByEntity: { [EntityType.SCHOOL]: 'school_status' },
      selectedIdByEntity: { [EntityType.SCHOOL]: 2 },
    };
    const lastSelectedLayer = {
      layerIdByEntity: { [EntityType.SCHOOL]: 2 },
    };
    const { isLastSelectionChange } = getLayerIdsAndLastChange({
      selectedLayerIds,
      lastSelectedLayer,
      refresh: true,
    });

    expect(isLastSelectionChange).toBe(true);
  });

  it('createSourceForMapAndCountry: should create source with bounds when country and admin1Data provided', () => {
    const map = {
      addSource: vi.fn(),
      getStyle: () => ({
        sources: {},
      }),
    } as any;

    const selectedLayerId = 1;

    const layerUtils = {
      coverageLayerDataByEntity: { school: { id: 1 } },
      selectedLayerIdByEntity: { [EntityType.SCHOOL]: 1 },
      currentLayerTypeUtilsByEntity: {
        [EntityType.SCHOOL]: { isLive: true },
      },
    } as any;

    const mapRoute = {
      country: true,
    } as any;

    const country = {
      id: 1,
      code: 'AI',
      admin_metadata: {
        bbox: [1, 2, 3, 4],
      },
    };

    createSourceForMapAndCountry({
      map,
      selectedLayerId,
      country,
      layerUtils,
      mapRoute,
      activeEntityTypes: [EntityType.SCHOOL],
      entityRegistry: { [EntityType.SCHOOL]: { visible: true } },
      intervalByEntity: {
        [EntityType.SCHOOL]: {
          start: 324242424,
          end: 3232342424,
        },
      },
      intervalUnitByEntity: { [EntityType.SCHOOL]: 'week' },
      connectivityBenchMarkByEntity: { [EntityType.SCHOOL]: 'global' },
      lastSelectedLayer: {
        layerIdByEntity: { [EntityType.SCHOOL]: 1 },
      },
    } as any);

    expect(map.addSource).toHaveBeenCalled();
  });

  it('createAndUpdateMapLayers: should return empty createAndUpdateMapLayers', () => {
    const func = createAndUpdateMapLayer({} as any);
    expect(func).toBeUndefined();
  });

  it('createAndUpdateMapLayers: should called map create layer', () => {
    const map = {
      addLayer: vi.fn(),
      getStyle: () => ({
        sources: {},
      }),
      getLayer: vi.fn(() => false),
    };
    createAndUpdateMapLayer({
      map,
      mapRoute: { country: true },
      connectivitySpeedFilterByEntity: { [EntityType.SCHOOL]: {} },
      coverageFilterByEntity: { [EntityType.SCHOOL]: {} },
      layerUtils: {
        selectedLayerIdByEntity: { [EntityType.SCHOOL]: 1 },
        currentLayerTypeUtilsByEntity: {
          [EntityType.SCHOOL]: { isLive: true },
        },
      },
      selectedLayerId: 1,
      paintData: {},
      schoolLayerId: 1,
      lastSelectedLayer: {
        layerIdByEntity: {},
      },
      activeEntityTypes: [EntityType.SCHOOL],
      entityRegistry: {},
    } as any);
    expect(map.getLayer).toHaveBeenCalled();
  });
});
