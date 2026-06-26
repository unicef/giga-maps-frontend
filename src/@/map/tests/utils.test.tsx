import { EntityType } from '~/@/entities/types/base-entity.type';
import { ConnectivityDistribution } from '~/@/sidebar/sidebar.constant';
import {
  createSchoolSource,
  createSelectedLayer,
  generateLayerUrls,
  getCoveragePaint,
} from '../utils';
import { LayerDataProps, mapPaintData, stylePaintData } from '../map.constant';

describe('getCoveragePaint', () => {
  it('should return the correct paint object', () => {
    const colors = stylePaintData.dark;
    const isDynamicLayer = true;

    const result = getCoveragePaint(colors, isDynamicLayer);

    expect(result).toEqual({
      ...mapPaintData.coverage,
      'circle-color': [
        ...mapPaintData.coverage['circle-color'],
        ['get', LayerDataProps.fieldStatus.key],
        ConnectivityDistribution.good,
        colors.good,
        ConnectivityDistribution.moderate,
        colors.moderate,
        ConnectivityDistribution.bad,
        colors.bad,
        ConnectivityDistribution.unknown,
        colors.unknown,
        colors.unknown,
      ],
    });
  });
});

describe('createSchoolSource', () => {
  it('should add the correct source to the map', () => {
    const map = {
      addLayer: vi.fn(),
      addSource: vi.fn(),
    } as any;
    const source = 'test-source';
    const schoolData = {
      type: 'FeatureCollection',
      features: [],
    };

    createSchoolSource({ map, source, schoolData });

    expect(map.addSource).toHaveBeenCalledWith(source, {
      type: 'geojson',
      data: schoolData,
    });
  });
});

describe('createSelectedLayer', () => {
  it('should create the correct layer on the map', () => {
    const map = {
      addLayer: vi.fn(),
      addSource: vi.fn(),
      setLayoutProperty: vi.fn(),
      off: vi.fn(),
      getLayer: vi.fn(),
      on: vi.fn(),
    } as any;
    const id = 'test-layer';
    const isDynamicLayer = true;
    const source = 'test-source';

    const mapRoute = {
      map: null,
    };

    createSelectedLayer(map, {
      id,
      isDynamicLayer,
      source,
      paintData: stylePaintData.dark,
      mapRoute,
    });

    expect(map.addLayer).toHaveBeenCalled();
    expect(map.getLayer).toHaveBeenCalledWith(id);
  });
});

describe('generateLayerUrls', () => {
  it('should not generate map tile URL when no entity has a selected layer', () => {
    const result = generateLayerUrls({
      layerId: null,
      activeEntityTypes: [EntityType.SCHOOL, EntityType.HEALTH],
      connectivityBenchMark: 'global',
      connectivityFilter: {
        isWeek: false,
        range: { start: new Date('2026-01-01'), end: new Date('2026-01-31') },
      },
      layerUtils: {
        selectedLayerIdByEntity: {},
        currentLayerTypeUtilsByEntity: {},
      },
      mapRoute: { country: true },
      country: { id: 1 },
      entityRegistry: {},
    } as any);

    expect(result).toBe('');
  });
});
