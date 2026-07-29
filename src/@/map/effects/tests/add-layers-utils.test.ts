import { Map } from 'mapbox-gl';
import {
  deleteSourceAndLayers,
  createSource,
  createSelectedLayer,
  createSelectedSymbolLayer,
  createSchoolLayer,
  createEntitySymbolLayer,
  animateCircles,
  generateLayerUrls,
  filterConnectivityList,
} from '../../utils';
import {
  getLayerIdsAndLastChange,
  createSourceForMapAndCountry,
  createAndUpdateMapLayer,
  createAndUpdateConnectiivtyStatusLayer,
} from '../add-layers-utils';
import { EntityType } from '~/@/entities/types/base-entity.type';
import { getEntityMarkerTransitionZoom } from '~/@/entities/utils/entity-resolver';

// Mock dependencies
vi.mock('../../utils', () => ({
  deleteSourceAndLayers: vi.fn(),
  createSource: vi.fn(),
  createSchoolSource: vi.fn(),
  createSelectedLayer: vi.fn(),
  createSelectedSymbolLayer: vi.fn(),
  createSchoolLayer: vi.fn(),
  createEntitySymbolLayer: vi.fn(),
  animateCircles: vi.fn(() => ({ requestId: 123 })),
  checkSourceAvailable: vi.fn(() => true),
  getMapId: vi.fn((id) => `layer-${id}`),
  filterConnectivityList: vi.fn(),
  filterCoverageList: vi.fn(),
  generateLayerUrls: vi.fn(),
  generateStaticLayerUrl: vi.fn(),
  hideLayer: vi.fn(),
  removePreviewsMapClickHandlers: vi.fn(),
  filterSchoolStatus: vi.fn(),
}));

vi.mock('~/@/country/lib/get-schools-geojson', () => ({
  getSchoolsGeoJson: vi.fn(),
}));

describe('getEntityMarkerTransitionZoom', () => {
  it('uses circleMaxZoom as the single gap-free transition threshold', () => {
    expect(
      getEntityMarkerTransitionZoom({
        markerType: 'symbol',
        zoomLevels: { circleMaxZoom: 8, symbolMinZoom: 12 },
      }),
    ).toBe(8);
  });

  it('supports legacy registry payloads and guards Mapbox maximum zoom', () => {
    expect(
      getEntityMarkerTransitionZoom({
        markerType: 'symbol',
        zoomLevels: { symbolMinZoom: 30 },
      }),
    ).toBe(24);
  });
});

describe('add-layers-utils', () => {
  let mockMap: vi.Mocked<Map>;
  const schoolCircleConfig = {
    markerType: 'circle',
    mapAnimation: {
      zoomRadius: [
        { zoom: 0, radius: 0.2 },
        { zoom: 8, radius: 4 },
      ],
      growSpeed: 1,
      glowMinScale: 1,
      glowMaxScale: 2.5,
    },
  };

  beforeEach(() => {
    mockMap = {
      addSource: vi.fn(),
      removeLayer: vi.fn(),
      removeSource: vi.fn(),
      getSource: vi.fn(),
      off: vi.fn(),
    } as any;

    vi.clearAllMocks();
    vi.mocked(generateLayerUrls).mockReturnValue('tile-url');
  });

  describe('getLayerIdsAndLastChange', () => {
    it('should return correct layer ids and change status when refresh is true', () => {
      const result = getLayerIdsAndLastChange({
        selectedLayerIds: {
          schoolIdByEntity: { [EntityType.SCHOOL]: 'school_status' },
          selectedIdByEntity: { [EntityType.SCHOOL]: 2 },
        },
        refresh: true,
        lastSelectedLayer: {
          layerIdByEntity: { [EntityType.SCHOOL]: 2 },
        },
      });

      expect(result).toEqual({
        selectedLayerIdByEntity: {
          [EntityType.SCHOOL]: 2,
        },
        isLastSelectionChange: true,
      });
    });

    it('should detect selection change when selectedId differs from lastSelectedLayer', () => {
      const result = getLayerIdsAndLastChange({
        selectedLayerIds: {
          schoolIdByEntity: { [EntityType.SCHOOL]: 'school_status' },
          selectedIdByEntity: { [EntityType.SCHOOL]: 3 },
        },
        refresh: false,
        lastSelectedLayer: {
          layerIdByEntity: { [EntityType.SCHOOL]: 2 },
        },
      });

      expect(result.isLastSelectionChange).toBe(true);
    });

    it('should detect selection change for entity-specific layer ids', () => {
      const result = getLayerIdsAndLastChange({
        selectedLayerIds: {
          schoolIdByEntity: { [EntityType.SCHOOL]: 'school_status' },
          selectedIdByEntity: {
            [EntityType.SCHOOL]: 2,
            [EntityType.HEALTH]: 5,
          },
        },
        refresh: false,
        lastSelectedLayer: {
          layerId: 2,
          layerIdByEntity: {
            [EntityType.SCHOOL]: 2,
            [EntityType.HEALTH]: 4,
          },
        },
      });

      expect(result.isLastSelectionChange).toBe(true);
    });
  });

  describe('createSourceForMapAndCountry', () => {
    it('should create source with correct options for country with admin data', async () => {
      const country = {
        code: 'US',
        admin_metadata: { bbox: [1, 2, 3, 4] },
        admin1_metadata: [{ id: 1, bbox: [2, 3, 4, 5] }],
      };

      await createSourceForMapAndCountry({
        map: mockMap,
        schoolAdminId: 1,
        countrySearch: '',
        connectivityBenchMark: 10,
        selectedLayerId: 1,
        connectivityFilter: [],
        layerUtils: {
          coverageLayerDataByEntity: { school: { id: 'coverage' } },
        },
        mapRoute: { schools: true },
        country,
        lastSelectedLayer: { layerId: null },
        admin1Data: null,
      });

      expect(deleteSourceAndLayers).toHaveBeenCalledWith({
        map: mockMap,
        sourceId: 'map-data-source',
      });
      expect(createSource).toHaveBeenCalled();
    });

    it('should not create a source when no layer URL can be generated', async () => {
      vi.mocked(generateLayerUrls).mockReturnValueOnce('');

      const result = await createSourceForMapAndCountry({
        map: mockMap,
        schoolAdminId: 1,
        countrySearch: '',
        connectivityBenchMark: 10,
        selectedLayerId: null,
        connectivityFilter: [],
        layerUtils: { selectedLayerIdByEntity: {} },
        mapRoute: { country: true },
        country: { code: 'US', admin_metadata: { bbox: [1, 2, 3, 4] } },
        lastSelectedLayer: { layerId: null },
        admin1Data: null,
      } as any);

      expect(result).toBe(false);
      expect(createSource).not.toHaveBeenCalled();
    });
    it('should handle undefined map gracefully', async () => {
      const result = await createSourceForMapAndCountry({
        map: null as any,
        schoolAdminId: 1,
        countrySearch: '',
        connectivityBenchMark: 10,
        selectedLayerId: 1,
        connectivityFilter: [],
        layerUtils: {
          coverageLayerDataByEntity: { school: { id: 'coverage' } },
        },
        mapRoute: { schools: true },
        country: null,
        lastSelectedLayer: { layerId: null },
        admin1Data: null,
      });

      expect(result).toBeUndefined();
    });
  });

  describe('createAndUpdateMapLayer', () => {
    it('should create layer with correct options for live data', () => {
      createAndUpdateMapLayer({
        map: mockMap,
        mapRoute: { schools: false },
        connectivitySpeedFilterByEntity: { [EntityType.SCHOOL]: [] },
        coverageFilterByEntity: { [EntityType.SCHOOL]: [] },
        layerUtils: {
          currentLayerTypeUtilsByEntity: {
            [EntityType.SCHOOL]: { isLive: true },
          },
          coverageLayerDataByEntity: { school: { id: 'coverage' } },
          selectedLayerIdByEntity: { [EntityType.SCHOOL]: 1 },
        },
        selectedLayerId: 1,
        paintData: {},
        schoolLayerId: null,
        lastSelectedLayer: { layerIdByEntity: {} },
        schoolLegends: [],
        isMobile: false,
        activeEntityTypes: [EntityType.SCHOOL],
        entityRegistry: {},
      });

      expect(createSelectedLayer).toHaveBeenCalled();
      expect(animateCircles).toHaveBeenCalled();
    });

    it('should use dynamic field filters for country download layer', () => {
      createAndUpdateMapLayer({
        map: mockMap,
        mapRoute: { country: true },
        connectivitySpeedFilterByEntity: { [EntityType.SCHOOL]: [] },
        coverageFilterByEntity: { [EntityType.SCHOOL]: [] },
        layerUtils: {
          currentLayerTypeUtilsByEntity: {
            [EntityType.SCHOOL]: { isLive: true },
          },
          globalLayerDataByEntity: { school: { id: 1 } },
          selectedLayerIdByEntity: { [EntityType.SCHOOL]: 1 },
        },
        selectedLayerId: 1,
        paintData: {},
        schoolLayerId: null,
        lastSelectedLayer: { layerIdByEntity: {} },
        schoolLegends: [],
        isMobile: false,
        activeEntityTypes: [EntityType.SCHOOL],
        entityRegistry: {},
      });

      expect(filterConnectivityList).toHaveBeenCalledWith([], true);
    });

    it('should use global field filters on map overview', () => {
      createAndUpdateMapLayer({
        map: mockMap,
        mapRoute: { map: true },
        connectivitySpeedFilterByEntity: { [EntityType.SCHOOL]: [] },
        coverageFilterByEntity: { [EntityType.SCHOOL]: [] },
        layerUtils: {
          currentLayerTypeUtilsByEntity: {
            [EntityType.SCHOOL]: { isLive: true },
          },
          globalLayerDataByEntity: { school: { id: 1 } },
        },
        selectedLayerId: 1,
        paintData: {},
        schoolLayerId: null,
        lastSelectedLayer: { layerIdByEntity: {} },
        schoolLegends: [],
        isMobile: false,
        activeEntityTypes: [EntityType.SCHOOL],
        entityRegistry: {},
      });

      expect(filterConnectivityList).toHaveBeenCalledWith([], false);
    });
    it('should skip a health global layer without entity layer metadata', () => {
      createAndUpdateMapLayer({
        map: mockMap,
        mapRoute: { map: true },
        connectivitySpeedFilterByEntity: { [EntityType.HEALTH]: [] },
        coverageFilterByEntity: { [EntityType.HEALTH]: [] },
        layerUtils: {
          currentLayerTypeUtilsByEntity: {
            [EntityType.HEALTH]: { isLive: true },
          },
          globalLayerDataByEntity: {},
        },
        selectedLayerId: null,
        paintData: {},
        schoolLayerId: null,
        lastSelectedLayer: { layerIdByEntity: {} },
        schoolLegends: [],
        isMobile: false,
        activeEntityTypes: [EntityType.HEALTH],
        entityRegistry: {},
      });

      expect(createSelectedLayer).not.toHaveBeenCalled();
    });
    it('should create layers for multiple entity types', () => {
      createAndUpdateMapLayer({
        map: mockMap,
        mapRoute: { map: true },
        connectivitySpeedFilterByEntity: {
          [EntityType.SCHOOL]: [],
          [EntityType.HEALTH]: [],
        },
        coverageFilterByEntity: {
          [EntityType.SCHOOL]: [],
          [EntityType.HEALTH]: [],
        },
        layerUtils: {
          currentLayerTypeUtilsByEntity: {},
          coverageLayerDataByEntity: { school: { id: 'coverage' } },
          globalLayerDataByEntity: {
            [EntityType.SCHOOL]: { id: 1 },
            [EntityType.HEALTH]: { id: 1 },
          },
        },
        selectedLayerId: 1,
        paintData: {},
        schoolLayerId: null,
        lastSelectedLayer: { layerIdByEntity: {} },
        schoolLegends: [],
        isMobile: false,
        activeEntityTypes: [EntityType.SCHOOL, EntityType.HEALTH],
        entityRegistry: {},
      });

      // Should create selected layer for each entity type
      expect(createSelectedLayer).toHaveBeenCalledTimes(2);
    });

    it('creates gap-free health circle and symbol variants for the global API', () => {
      createAndUpdateMapLayer({
        map: mockMap,
        mapRoute: { map: true },
        connectivitySpeedFilterByEntity: { [EntityType.HEALTH]: [] },
        coverageFilterByEntity: { [EntityType.HEALTH]: [] },
        layerUtils: {
          currentLayerTypeUtilsByEntity: {},
          globalLayerDataByEntity: { [EntityType.HEALTH]: { id: 7 } },
        },
        selectedLayerIds: {
          schoolIdByEntity: { [EntityType.HEALTH]: 'health_status' },
          selectedIdByEntity: {},
        },
        selectedLayerId: 7,
        paintData: {},
        lastSelectedLayer: { layerIdByEntity: {} },
        isMobile: false,
        activeEntityTypes: [EntityType.HEALTH],
        entityRegistry: {
          [EntityType.SCHOOL]: schoolCircleConfig,
          [EntityType.HEALTH]: {
            markerType: 'symbol',
            symbol: '■',
            zoomLevels: { circleMaxZoom: 9 },
          },
        },
      } as any);

      expect(createSelectedLayer).toHaveBeenCalledWith(
        mockMap,
        expect.objectContaining({
          id: 'entity-selected-health-7-zoom-circle',
          options: expect.objectContaining({
            'source-layer': 'entities',
            maxzoom: 9,
          }),
          entityConfig: schoolCircleConfig,
        }),
      );
      expect(createSelectedSymbolLayer).toHaveBeenCalledWith(
        mockMap,
        expect.objectContaining({
          id: 'entity-selected-health-7',
          options: expect.objectContaining({
            'source-layer': 'entities',
            minzoom: 9,
          }),
        }),
      );
      expect(createSchoolLayer).toHaveBeenCalledWith(
        mockMap,
        expect.objectContaining({
          id: 'entity-status-health-zoom-circle',
          options: { 'source-layer': 'entities', maxzoom: 9 },
          entityConfig: schoolCircleConfig,
        }),
      );
      expect(createEntitySymbolLayer).toHaveBeenCalledWith(
        mockMap,
        expect.objectContaining({
          id: 'entity-status-health',
          options: { 'source-layer': 'entities', minzoom: 9 },
        }),
      );
    });

    it('creates both health variants for the country dynamic-layer API', () => {
      createAndUpdateMapLayer({
        map: mockMap,
        mapRoute: { country: true },
        connectivitySpeedFilterByEntity: { [EntityType.HEALTH]: [] },
        coverageFilterByEntity: { [EntityType.HEALTH]: [] },
        layerUtils: {
          currentLayerTypeUtilsByEntity: {
            [EntityType.HEALTH]: { isLive: true },
          },
          selectedLayerIdByEntity: { [EntityType.HEALTH]: 12 },
        },
        selectedLayerId: 12,
        paintData: {},
        lastSelectedLayer: { layerIdByEntity: {} },
        isMobile: false,
        activeEntityTypes: [EntityType.HEALTH],
        entityRegistry: {
          [EntityType.SCHOOL]: schoolCircleConfig,
          [EntityType.HEALTH]: {
            markerType: 'symbol',
            symbol: '■',
            zoomLevels: { circleMaxZoom: 6 },
          },
        },
      } as any);

      expect(createSelectedLayer).toHaveBeenCalledWith(
        mockMap,
        expect.objectContaining({
          id: 'entity-selected-health-12-zoom-circle',
          isDynamicLayer: true,
          options: expect.objectContaining({ maxzoom: 6 }),
          entityConfig: schoolCircleConfig,
        }),
      );
      expect(createSelectedSymbolLayer).toHaveBeenCalledWith(
        mockMap,
        expect.objectContaining({
          id: 'entity-selected-health-12',
          isDynamicLayer: true,
          options: expect.objectContaining({ minzoom: 6 }),
        }),
      );
      expect(animateCircles).toHaveBeenCalledWith({
        map: mockMap,
        id: 'entity-selected-health-12-zoom-circle',
        entityConfig: schoolCircleConfig,
        fallbackMarkerType: 'circle',
        maxZoom: 6,
        zoomVariant: {
          id: 'entity-selected-health-12',
          entityConfig: expect.objectContaining({ markerType: 'symbol' }),
          fallbackMarkerType: 'symbol',
          minZoom: 6,
        },
      });
    });

    it('animates the symbol layer when it has no zoom transition', () => {
      createAndUpdateMapLayer({
        map: mockMap,
        mapRoute: { country: true },
        connectivitySpeedFilterByEntity: { [EntityType.HEALTH]: [] },
        coverageFilterByEntity: { [EntityType.HEALTH]: [] },
        layerUtils: {
          currentLayerTypeUtilsByEntity: {
            [EntityType.HEALTH]: { isLive: true },
          },
          selectedLayerIdByEntity: { [EntityType.HEALTH]: 12 },
        },
        selectedLayerId: 12,
        paintData: {},
        lastSelectedLayer: { layerIdByEntity: {} },
        isMobile: false,
        activeEntityTypes: [EntityType.HEALTH],
        entityRegistry: {
          [EntityType.SCHOOL]: schoolCircleConfig,
          [EntityType.HEALTH]: {
            markerType: 'symbol',
            symbol: '■',
          },
        },
      } as any);

      expect(createSelectedSymbolLayer).toHaveBeenCalledWith(
        mockMap,
        expect.objectContaining({ id: 'entity-selected-health-12' }),
      );
      expect(animateCircles).toHaveBeenCalledWith({
        map: mockMap,
        id: 'entity-selected-health-12',
        entityConfig: expect.objectContaining({ markerType: 'symbol' }),
        fallbackMarkerType: 'symbol',
      });
    });

    it('creates both health variants for the country status API source', () => {
      createAndUpdateConnectiivtyStatusLayer({
        map: mockMap,
        mapRoute: { country: true },
        paintData: {},
        selectedLayerIds: {
          schoolIdByEntity: { [EntityType.HEALTH]: 'health_status' },
          selectedIdByEntity: {},
        },
        schoolLegendsByEntity: { [EntityType.HEALTH]: ['connected'] },
        isMobile: false,
        activeEntityTypes: [EntityType.HEALTH],
        entityRegistry: {
          [EntityType.SCHOOL]: schoolCircleConfig,
          [EntityType.HEALTH]: {
            markerType: 'symbol',
            symbol: '■',
            zoomLevels: { circleMaxZoom: 10 },
          },
        },
      } as any);

      expect(createSchoolLayer).toHaveBeenCalledWith(
        mockMap,
        expect.objectContaining({
          source: 'map-data-source-static',
          id: 'entity-status-health-zoom-circle',
          options: expect.objectContaining({ maxzoom: 10 }),
          entityConfig: schoolCircleConfig,
        }),
      );
      expect(createEntitySymbolLayer).toHaveBeenCalledWith(
        mockMap,
        expect.objectContaining({
          source: 'map-data-source-static',
          id: 'entity-status-health',
          options: expect.objectContaining({ minzoom: 10 }),
        }),
      );
    });

    it('should not create selected layers when no entity layer is selected', () => {
      createAndUpdateMapLayer({
        map: mockMap,
        mapRoute: { schools: false },
        connectivitySpeedFilterByEntity: {},
        coverageFilterByEntity: {},
        layerUtils: {
          currentLayerTypeUtilsByEntity: {},
          coverageLayerDataByEntity: { school: { id: 'coverage' } },
          selectedLayerIdByEntity: {},
        },
        selectedLayerId: null,
        paintData: {},
        schoolLayerId: null,
        lastSelectedLayer: { layerIdByEntity: {} },
        schoolLegends: [],
        isMobile: false,
        activeEntityTypes: [EntityType.SCHOOL, EntityType.HEALTH],
        entityRegistry: {},
      });

      expect(createSelectedLayer).not.toHaveBeenCalled();
      expect(animateCircles).not.toHaveBeenCalled();
    });
    it('should move existing status layers above selected layers', () => {
      mockMap = {
        ...mockMap,
        getLayer: vi.fn((id) => (id === 'entity-status-school' ? {} : null)),
        moveLayer: vi.fn(),
      } as any;

      createAndUpdateMapLayer({
        map: mockMap,
        mapRoute: { schools: false },
        connectivitySpeedFilterByEntity: { [EntityType.SCHOOL]: [] },
        coverageFilterByEntity: { [EntityType.SCHOOL]: [] },
        layerUtils: {
          currentLayerTypeUtilsByEntity: {
            [EntityType.SCHOOL]: { isLive: true },
          },
          coverageLayerDataByEntity: { school: { id: 'coverage' } },
          selectedLayerIdByEntity: { [EntityType.SCHOOL]: 1 },
        },
        selectedLayerId: 1,
        paintData: {},
        schoolLayerId: null,
        lastSelectedLayer: { layerIdByEntity: {} },
        schoolLegends: [],
        isMobile: false,
        activeEntityTypes: [EntityType.SCHOOL],
        entityRegistry: {},
      });

      expect(mockMap.moveLayer).toHaveBeenCalledWith('entity-status-school');
    });

    it('should move static status layers above existing map layers', () => {
      mockMap = {
        ...mockMap,
        getLayer: vi.fn((id) => (id === 'entity-status-school' ? {} : null)),
        moveLayer: vi.fn(),
      } as any;

      createAndUpdateConnectiivtyStatusLayer({
        map: mockMap,
        mapRoute: { country: true },
        paintData: {},
        selectedLayerIds: {
          schoolIdByEntity: { [EntityType.SCHOOL]: 'school_status' },
          selectedIdByEntity: {},
        },
        schoolLegendsByEntity: {
          [EntityType.SCHOOL]: ['connected'],
        },
        isMobile: false,
        activeEntityTypes: [EntityType.SCHOOL],
        entityRegistry: {},
      } as any);

      expect(mockMap.moveLayer).toHaveBeenCalledWith('entity-status-school');
    });
    it('should handle undefined map gracefully', () => {
      createAndUpdateMapLayer({
        map: null as any,
        mapRoute: { schools: false },
        connectivitySpeedFilterByEntity: {},
        coverageFilterByEntity: {},
        layerUtils: {
          currentLayerTypeUtilsByEntity: {},
          coverageLayerDataByEntity: { school: { id: 'coverage' } },
        },
        selectedLayerId: 1,
        paintData: {},
        schoolLayerId: null,
        lastSelectedLayer: { layerIdByEntity: {} },
        schoolLegends: [],
        isMobile: false,
        activeEntityTypes: [EntityType.SCHOOL],
        entityRegistry: {},
      });

      expect(createSelectedLayer).not.toHaveBeenCalled();
      expect(animateCircles).not.toHaveBeenCalled();
    });
  });
});
