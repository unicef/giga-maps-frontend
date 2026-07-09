import { Map } from 'mapbox-gl';
import {
  deleteSourceAndLayers,
  createSource,
  createSelectedLayer,
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

// Mock dependencies
vi.mock('../../utils', () => ({
  deleteSourceAndLayers: vi.fn(),
  createSource: vi.fn(),
  createSchoolSource: vi.fn(),
  createSelectedLayer: vi.fn(),
  createSchoolLayer: vi.fn(),
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

describe('add-layers-utils', () => {
  let mockMap: vi.Mocked<Map>;

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
        selectedLayerIds: { schoolId: 1, selectedId: 2 },
        refresh: true,
        lastSelectedLayer: { layerId: 2 },
      });

      expect(result).toEqual({
        schoolLayerId: 1,
        selectedLayerId: 2,
        selectedLayerIdByEntity: {
          [EntityType.SCHOOL]: 2,
        },
        isLastSelectionChange: true,
      });
    });

    it('should detect selection change when selectedId differs from lastSelectedLayer', () => {
      const result = getLayerIdsAndLastChange({
        selectedLayerIds: { schoolId: 1, selectedId: 3 },
        refresh: false,
        lastSelectedLayer: { layerId: 2 },
      });

      expect(result.isLastSelectionChange).toBe(true);
    });

    it('should detect selection change for entity-specific layer ids', () => {
      const result = getLayerIdsAndLastChange({
        selectedLayerIds: {
          schoolId: 1,
          selectedId: 2,
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
        connectivitySpeedFilter: [],
        coverageFilter: [],
        layerUtils: {
          currentLayerTypeUtils: { isLive: true },
          coverageLayerDataByEntity: { school: { id: 'coverage' } },
          selectedLayerIdByEntity: { [EntityType.SCHOOL]: 1 },
        },
        selectedLayerId: 1,
        paintData: {},
        schoolLayerId: null,
        lastSelectedLayer: { layerId: null },
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
        connectivitySpeedFilter: [],
        coverageFilter: [],
        layerUtils: {
          currentLayerTypeUtils: { isLive: true },
          globalLayerDataByEntity: { school: { id: 1 } },
          selectedLayerIdByEntity: { [EntityType.SCHOOL]: 1 },
        },
        selectedLayerId: 1,
        paintData: {},
        schoolLayerId: null,
        lastSelectedLayer: { layerId: null },
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
        connectivitySpeedFilter: [],
        coverageFilter: [],
        layerUtils: {
          currentLayerTypeUtils: { isLive: true },
          globalLayerDataByEntity: { school: { id: 1 } },
        },
        selectedLayerId: 1,
        paintData: {},
        schoolLayerId: null,
        lastSelectedLayer: { layerId: null },
        schoolLegends: [],
        isMobile: false,
        activeEntityTypes: [EntityType.SCHOOL],
        entityRegistry: {},
      });

      expect(filterConnectivityList).toHaveBeenCalledWith([], false);
    });
    it('should create a health global layer without global layer metadata', () => {
      createAndUpdateMapLayer({
        map: mockMap,
        mapRoute: { map: true },
        connectivitySpeedFilter: [],
        coverageFilter: [],
        layerUtils: {
          currentLayerTypeUtils: { isLive: true },
          globalLayerDataByEntity: {},
        },
        selectedLayerId: null,
        paintData: {},
        schoolLayerId: null,
        lastSelectedLayer: { layerId: null },
        schoolLegends: [],
        isMobile: false,
        activeEntityTypes: [EntityType.HEALTH],
        entityRegistry: {},
      });

      expect(createSelectedLayer).toHaveBeenCalledWith(
        mockMap,
        expect.objectContaining({
          id: 'entity-selected-health-null',
          options: expect.objectContaining({ 'source-layer': 'entities' }),
        }),
      );
      expect(filterConnectivityList).toHaveBeenCalledWith([], false);
    });
    it('should create layers for multiple entity types', () => {
      createAndUpdateMapLayer({
        map: mockMap,
        mapRoute: { map: true },
        connectivitySpeedFilter: [],
        coverageFilter: [],
        layerUtils: {
          currentLayerTypeUtils: { isLive: false },
          coverageLayerDataByEntity: { school: { id: 'coverage' } },
          globalLayerDataByEntity: {
            [EntityType.SCHOOL]: { id: 1 },
            [EntityType.HEALTH]: { id: 1 },
          },
        },
        selectedLayerId: 1,
        paintData: {},
        schoolLayerId: null,
        lastSelectedLayer: { layerId: null },
        schoolLegends: [],
        isMobile: false,
        activeEntityTypes: [EntityType.SCHOOL, EntityType.HEALTH],
        entityRegistry: {},
      });

      // Should create selected layer for each entity type
      expect(createSelectedLayer).toHaveBeenCalledTimes(2);
    });

    it('should not create selected layers when no entity layer is selected', () => {
      createAndUpdateMapLayer({
        map: mockMap,
        mapRoute: { schools: false },
        connectivitySpeedFilter: [],
        coverageFilter: [],
        layerUtils: {
          currentLayerTypeUtils: { isLive: true },
          coverageLayerDataByEntity: { school: { id: 'coverage' } },
          selectedLayerIdByEntity: {},
        },
        selectedLayerId: null,
        paintData: {},
        schoolLayerId: null,
        lastSelectedLayer: { layerId: null },
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
        connectivitySpeedFilter: [],
        coverageFilter: [],
        layerUtils: {
          currentLayerTypeUtils: { isLive: true },
          coverageLayerDataByEntity: { school: { id: 'coverage' } },
        },
        selectedLayerId: 1,
        paintData: {},
        schoolLayerId: null,
        lastSelectedLayer: { layerId: null },
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
        selectedLayerIds: { schoolId: 1 },
        schoolLegends: ['connected'],
        schoolLegendsByEntity: {},
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
        connectivitySpeedFilter: [],
        coverageFilter: [],
        layerUtils: {
          currentLayerTypeUtils: { isLive: true },
          coverageLayerDataByEntity: { school: { id: 'coverage' } },
        },
        selectedLayerId: 1,
        paintData: {},
        schoolLayerId: null,
        lastSelectedLayer: { layerId: null },
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
