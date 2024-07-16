import { createAndUpdateMapLayer, createSourceForMapAndCountry, createSourceForSchool, getLayerIdsAndLastChange } from '../effects/add-layers-utils';

describe('addLayerUtils', () => {

  it('should return schoolLayerId, selectedLayerId, and isLastSelectionChange', () => {
    const lastSelectedLayer = {
      layerId: 2,
      schoolId: 1,
    };
    const { schoolLayerId, selectedLayerId, isLastSelectionChange } = getLayerIdsAndLastChange({
      lastSelectedLayer,
      refresh: false,
      selectedLayerIds: {
        schoolId: 1,
        selectedId: 3
      }
    });

    expect(schoolLayerId).toBe(1);
    expect(selectedLayerId).toBe(3);
    expect(isLastSelectionChange).toBe(true);
  });

  it('should set isLastSelectionChange to false if selectedLayerId matches lastSelectedLayer.layerId', () => {
    const selectedLayerIds = {
      schoolId: 1,
      selectedId: 2
    };
    const lastSelectedLayer = {
      layerId: 2,
      schoolId: 0
    };
    const { isLastSelectionChange } = getLayerIdsAndLastChange({
      selectedLayerIds,
      lastSelectedLayer
    });

    expect(isLastSelectionChange).toBe(false);
  });

  it('should set isLastSelectionChange to true if refresh is true', () => {
    const selectedLayerIds = {
      schoolId: 1,
      selectedId: 2
    };
    const lastSelectedLayer = {
      layerId: 2,
      schoolId: 0
    };
    const { isLastSelectionChange } = getLayerIdsAndLastChange({
      selectedLayerIds,
      lastSelectedLayer,
      refresh: true
    });

    expect(isLastSelectionChange).toBe(true);
  });

  it('createSourceForMapAndCountry: should create source with bounds when country and admin1Data provided', () => {
    const map = {
      addSource: jest.fn(),
      getStyle: () => ({
        sources: {}
      })
    } as any;

    const selectedLayerId = 1;

    const layerUtils = {
      coverageLayerId: 1,
      currentLayerTypeUtils: {
        isLive: true
      }
    } as any;

    const mapRoute = {
      country: true
    } as any;

    const country = {
      id: 1,
      code: 'AI',
      admin_metadata: {
        bbox: [1, 2, 3, 4]
      }
    };

    createSourceForMapAndCountry({
      map,
      selectedLayerId,
      country,
      layerUtils,
      mapRoute,
      connectivityFilter: {
        range: {
          start: 324242424,
          end: 3232342424
        },
        isWeek: true
      },
      lastSelectedLayer: {
        layerId: 1,
        schoolId: 0
      }
    } as any);

    expect(map.addSource).toHaveBeenCalled();
  });

  it('should return early if map is not provided', () => {
    const func = createSourceForSchool({
      layerUtils: {},
      schoolStats: [],
      selectedLayerId: 1,
      lastSelectedLayer: {
        schoolId: 0,
        layerId: 0
      }
    } as any);

    expect(func).toBeUndefined();
  });

  it('should delete existing sources and layers', () => {
    const map = {
      addSource: jest.fn(),
      createSource: jest.fn(),
      getStyle: () => ({
        sources: {}
      })
    } as any;
    const layerUtils = {};
    const schoolStats = [{ id: 1 }];
    const selectedLayerId = 1;
    const lastSelectedLayer = {
      schoolId: 0,
      layerId: 0
    };

    createSourceForSchool({
      map,
      layerUtils,
      schoolStats,
      selectedLayerId,
      lastSelectedLayer
    } as any);

    expect(map.addSource).toHaveBeenCalled();
  });


  it('createAndUpdateMapLayers: should return empty createAndUpdateMapLayers', () => {
    const func = createAndUpdateMapLayer({} as any);
    expect(func).toBeUndefined();
  });

  it('createAndUpdateMapLayers: should called map create layer', () => {
    const map = {
      addLayer: jest.fn(),
      getStyle: () => ({
        sources: {}
      }),
      getLayer: jest.fn(() => false)
    }
    createAndUpdateMapLayer({
      map,
      mapRoute: {},
      connectivitySpeedFilter: {},
      coverageFilter: {},
      layerUtils: {
        currentLayerTypeUtils: {
          isLive: true
        }
      },
      selectedLayerId: 1,
      paintData: {},
      schoolLayerId: 1,
      lastSelectedLayer: {
        layerId: 0,
        schoolId: 0
      },
      schoolLegends: {}
    } as any);
    expect(map.getLayer).toHaveBeenCalled();
  });

});