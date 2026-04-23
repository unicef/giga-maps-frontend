import { Map, VectorSource } from 'mapbox-gl';
import { getSchoolsGeoJson } from '~/@/country/lib/get-schools-geojson';
import { deleteSourceAndLayers, createSource, createSchoolSource, createSelectedLayer, animateCircles } from '../../utils';
import { getLayerIdsAndLastChange, createSourceForMapAndCountry, createAndUpdateMapLayer } from '../add-layers-utils';
import { EntityType } from '~/@/entities/types/base-entity.type';

// Mock dependencies
jest.mock('../../utils', () => ({
  deleteSourceAndLayers: jest.fn(),
  createSource: jest.fn(),
  createSchoolSource: jest.fn(),
  createSelectedLayer: jest.fn(),
  createSchoolLayer: jest.fn(),
  animateCircles: jest.fn(() => ({ requestId: 123 })),
  checkSourceAvailable: jest.fn(() => true),
  getMapId: jest.fn(id => `layer-${id}`),
  filterConnectivityList: jest.fn(),
  filterCoverageList: jest.fn(),
  generateLayerUrls: jest.fn(),
  generateStaticLayerUrl: jest.fn(),
  hideLayer: jest.fn(),
  removePreviewsMapClickHandlers: jest.fn(),
  filterSchoolStatus: jest.fn(),
}));

jest.mock('~/@/country/lib/get-schools-geojson', () => ({
  getSchoolsGeoJson: jest.fn(),
}));

describe('add-layers-utils', () => {
  let mockMap: jest.Mocked<Map>;

  beforeEach(() => {
    mockMap = {
      addSource: jest.fn(),
      removeLayer: jest.fn(),
      removeSource: jest.fn(),
      getSource: jest.fn(),
      off: jest.fn(),
    } as any;

    jest.clearAllMocks();
  });

  describe('getLayerIdsAndLastChange', () => {
    it('should return correct layer ids and change status when refresh is true', () => {
      const result = getLayerIdsAndLastChange({
        selectedLayerIds: { schoolId: 1, selectedId: 2 },
        refresh: true,
        lastSelectedLayer: { layerId: 2 }
      });

      expect(result).toEqual({
        schoolLayerId: 1,
        selectedLayerId: 2,
        isLastSelectionChange: true
      });
    });

    it('should detect selection change when selectedId differs from lastSelectedLayer', () => {
      const result = getLayerIdsAndLastChange({
        selectedLayerIds: { schoolId: 1, selectedId: 3 },
        refresh: false,
        lastSelectedLayer: { layerId: 2 }
      });

      expect(result.isLastSelectionChange).toBe(true);
    });
  });

  describe('createSourceForMapAndCountry', () => {
    it('should create source with correct options for country with admin data', async () => {
      const country = {
        code: 'US',
        admin_metadata: { bbox: [1, 2, 3, 4] },
        admin1_metadata: [{ id: 1, bbox: [2, 3, 4, 5] }]
      };

      await createSourceForMapAndCountry({
        map: mockMap,
        schoolAdminId: 1,
        countrySearch: '',
        connectivityBenchMark: 10,
        selectedLayerId: 1,
        connectivityFilter: [],
        layerUtils: { coverageLayerId: 'coverage' },
        mapRoute: { schools: true },
        country,
        lastSelectedLayer: { layerId: null },
        admin1Data: null
      });

      expect(deleteSourceAndLayers).toHaveBeenCalledWith({ map: mockMap, sourceId: 'map-data-source' });
      expect(createSource).toHaveBeenCalled();
    });

    it('should handle undefined map gracefully', async () => {
      const result = await createSourceForMapAndCountry({
        map: null as any,
        schoolAdminId: 1,
        countrySearch: '',
        connectivityBenchMark: 10,
        selectedLayerId: 1,
        connectivityFilter: [],
        layerUtils: { coverageLayerId: 'coverage' },
        mapRoute: { schools: true },
        country: null,
        lastSelectedLayer: { layerId: null },
        admin1Data: null
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
          downloadLayerId: 'download',
          coverageLayerId: 'coverage'
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

    it('should create layers for multiple entity types', () => {
      createAndUpdateMapLayer({
        map: mockMap,
        mapRoute: { map: true },
        connectivitySpeedFilter: [],
        coverageFilter: [],
        layerUtils: {
          currentLayerTypeUtils: { isLive: false },
          downloadLayerId: 'download',
          coverageLayerId: 'coverage',
          globalLayerId: 1,
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

    it('should handle undefined map gracefully', () => {
      createAndUpdateMapLayer({
        map: null as any,
        mapRoute: { schools: false },
        connectivitySpeedFilter: [],
        coverageFilter: [],
        layerUtils: {
          currentLayerTypeUtils: { isLive: true },
          downloadLayerId: 'download',
          coverageLayerId: 'coverage'
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
