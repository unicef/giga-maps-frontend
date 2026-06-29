import { EntityType } from '~/@/entities/types/base-entity.type';
import { ConnectivityDistribution } from '~/@/sidebar/sidebar.constant';
import {
  animateCircles,
  createSchoolSource,
  createSelectedLayer,
  createSelectedSymbolLayer,
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

const expectedPocRadiusExpression = [
  'interpolate',
  ['linear'],
  ['zoom'],
  0,
  0.3,
  2,
  1,
  4,
  1.5,
  5,
  2,
  8,
  4,
  10,
  6,
  12,
  8,
  14,
  10,
];
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
    expect(map.addLayer.mock.calls[0][0].paint['circle-radius']).toEqual(
      expectedPocRadiusExpression,
    );
  });
  it('should size symbol dots with the POC text multiplier', () => {
    const map = {
      addLayer: vi.fn(),
      setLayoutProperty: vi.fn(),
      off: vi.fn(),
      getLayer: vi.fn(),
      on: vi.fn(),
    } as any;

    createSelectedSymbolLayer(map, {
      id: 'symbol-layer',
      symbol: '\u25A0',
      isDynamicLayer: true,
      source: 'test-source',
      paintData: stylePaintData.dark,
      mapRoute: { map: null },
      options: {},
      isLive: true,
    });

    expect(map.addLayer.mock.calls[0][0].layout['text-size']).toEqual([
      'interpolate',
      ['linear'],
      ['zoom'],
      0,
      0.75,
      2,
      2.5,
      4,
      3.75,
      5,
      5,
      8,
      10,
      10,
      15,
      12,
      20,
      14,
      25,
    ]);
  });
});

describe('animateCircles', () => {
  it('starts animation on the next frame without delaying dot glow', () => {
    const originalRequestAnimationFrame = globalThis.requestAnimationFrame;
    const requestAnimationFrameMock = vi.fn(() => 123);
    globalThis.requestAnimationFrame = requestAnimationFrameMock as any;

    try {
      const result = animateCircles({
        map: {
          getLayer: vi.fn(() => ({ type: 'circle' })),
          getZoom: vi.fn(() => 4),
          setPaintProperty: vi.fn(),
        } as any,
        id: 'live-layer',
      });

      expect(requestAnimationFrameMock).toHaveBeenCalledTimes(1);
      expect(result.requestId).toBe(123);
    } finally {
      globalThis.requestAnimationFrame = originalRequestAnimationFrame;
    }
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
