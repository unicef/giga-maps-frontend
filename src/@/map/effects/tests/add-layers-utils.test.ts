import { Map } from 'mapbox-gl';
import { deleteSourceAndLayers, createSource, createSelectedLayer, animateCircles } from '../../utils';
import { getLayerIdsAndLastChange, createSourceForMapAndCountry, createAndUpdateMapLayer } from '../add-layers-utils';
import { ConnectivityBenchMarks } from '~/@/sidebar/sidebar.constant';
import { Country } from '~/api/types';

// Mock dependencies
jest.mock('../../utils', () => ({
  deleteSourceAndLayers: jest.fn(),
  createSource: jest.fn(),
  createSchoolSource: jest.fn(),
  createSelectedLayer: jest.fn(),
  animateCircles: jest.fn(() => ({ requestId: 123 })),
  checkSourceAvailable: jest.fn(() => true),
  getMapId: jest.fn(id => `layer-${id}`),
  filterConnectivityList: jest.fn(),
  filterCoverageList: jest.fn(),
  generateLayerUrls: jest.fn(),
  hideLayer: jest.fn(),
  removePreviewsMapClickHandlers: jest.fn(),
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
      } as Country;

      await createSourceForMapAndCountry({
        map: mockMap,
        schoolAdminId: 1,
        countrySearch: '',
        isConnectivityStatus: false,
        connectivityBenchMark: ConnectivityBenchMarks.global,
        selectedLayerId: 1,
        connectivityFilter: { isWeek: false, range: { start: new Date(), end: new Date() } },
        layerUtils: { coverageLayerId: 2 },
        mapRoute: { map: false, country: false, schools: true },
        country,
        lastSelectedLayer: { layerId: null },
        admin1Data: null
      });

      expect(deleteSourceAndLayers).toHaveBeenCalled();
      expect(createSource).toHaveBeenCalled();
    });

    it('should handle undefined map gracefully', async () => {
      const result = await createSourceForMapAndCountry({
        map: null as any,
        schoolAdminId: 1,
        countrySearch: '',
        isConnectivityStatus: false,
        connectivityBenchMark: ConnectivityBenchMarks.global,
        selectedLayerId: 1,
        connectivityFilter: { isWeek: false, range: { start: new Date(), end: new Date() } },
        layerUtils: { coverageLayerId: 2 },
        mapRoute: { map: false, country: false, schools: true },
        country: null,
        lastSelectedLayer: { layerId: null },
        admin1Data: null
      });

      expect(result).toBeUndefined();
    });
  });

  // describe.skip('createSourceForSchool', () => {
  //   it('should create school source with correct data', () => {
  //     const schoolStats = [{ id: 1, data: 'test' }];
  //     const mockSchoolData = { type: 'FeatureCollection', features: [] };
  //     (getSchoolsGeoJson as jest.Mock).mockReturnValue(mockSchoolData);

  //     createSourceForSchool({
  //       map: mockMap,
  //       layerUtils: {},
  //       schoolStats,
  //       selectedLayerId: 1,
  //       lastSelectedLayer: { layerId: null }
  //     });

  //     expect(deleteSourceAndLayers).toHaveBeenCalledWith({ map: mockMap });
  //     expect(createSchoolSource).toHaveBeenCalledWith({
  //       map: mockMap,
  //       schoolData: mockSchoolData
  //     });
  //   });

  //   it('should handle empty school stats', () => {
  //     createSourceForSchool({
  //       map: mockMap,
  //       layerUtils: {},
  //       schoolStats: [],
  //       selectedLayerId: 1,
  //       lastSelectedLayer: { layerId: null }
  //     });

  //     expect(createSchoolSource).not.toHaveBeenCalled();
  //   });
  // });

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
        isMobile: false
      });

      expect(createSelectedLayer).toHaveBeenCalled();
      expect(animateCircles).toHaveBeenCalled();
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
        isMobile: false
      });

      expect(createSelectedLayer).not.toHaveBeenCalled();
      expect(animateCircles).not.toHaveBeenCalled();
    });
  });
});
