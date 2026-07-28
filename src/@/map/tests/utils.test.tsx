import { EntityType } from '~/@/entities/types/base-entity.type';
import { ConnectivityDistribution } from '~/@/sidebar/sidebar.constant';
import {
  animateCircles,
  createSchoolSource,
  createSelectedLayer,
  createSelectedSymbolLayer,
  generateLayerUrls,
  generateStaticLayerUrl,
  getCoveragePaint,
  onClickOnEntityDots,
} from '../utils';
import {
  DEFAULT_SOURCE,
  LayerDataProps,
  mapPaintData,
  stylePaintData,
} from '../map.constant';
import { $activeSchoolPopup, setPopupOnClickDot } from '../map.model';

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

  it('adds a dev-only white border for multiple-school same-location dots', () => {
    const devSettings = (globalThis as any).GIGA_MAP_DEV;
    devSettings.highlightMultipleSchoolOnSameLatLng = true;
    const map = {
      addLayer: vi.fn(),
      setLayoutProperty: vi.fn(),
      off: vi.fn(),
      getLayer: vi.fn(() => null),
      on: vi.fn(),
      setPaintProperty: vi.fn(),
    } as any;

    createSelectedLayer(map, {
      id: 'entity-selected-school-1',
      isDynamicLayer: true,
      source: DEFAULT_SOURCE,
      paintData: stylePaintData.dark,
      mapRoute: { country: true },
      options: {},
      isMobile: false,
      isLive: true,
    });

    expect(map.addLayer).toHaveBeenCalledTimes(2);
    const overlayLayer = map.addLayer.mock.calls[1][0];
    expect(overlayLayer).toMatchObject({
      id: 'entity-selected-school-1-dev-multiple-school-same-location-highlight',
      type: 'circle',
      source: DEFAULT_SOURCE,
      layout: { visibility: 'visible' },
      paint: {
        'circle-color': 'rgba(255, 255, 255, 0)',
        'circle-stroke-color': '#ffffff',
        'circle-stroke-width': 4,
      },
    });
    expect(overlayLayer.filter).toEqual([
      'any',
      ['==', 'has_multiple_school_on_same_lat_lng', true],
      ['==', 'has_multiple_school_on_same_lat_lng', 1],
      ['==', 'has_multiple_school_on_same_lat_lng', '1'],
      ['==', 'has_multiple_school_on_same_lat_lng', 'true'],
      ['==', 'has_multiple_school_on_same_lat_lng', 'True'],
      ['==', 'has_multiple_school_on_same_lat_lng', 'TRUE'],
    ]);

    devSettings.highlightMultipleSchoolOnSameLatLng = false;
  });

  it('does not add the dev multiple-school border on global view', () => {
    const devSettings = (globalThis as any).GIGA_MAP_DEV;
    devSettings.highlightMultipleSchoolOnSameLatLng = true;
    const map = {
      addLayer: vi.fn(),
      setLayoutProperty: vi.fn(),
      off: vi.fn(),
      getLayer: vi.fn(() => null),
      on: vi.fn(),
      setPaintProperty: vi.fn(),
    } as any;

    createSelectedLayer(map, {
      id: 'entity-selected-school-1',
      isDynamicLayer: false,
      source: DEFAULT_SOURCE,
      paintData: stylePaintData.dark,
      mapRoute: { map: true },
      options: {},
      isMobile: false,
      isLive: true,
    });

    expect(map.addLayer).toHaveBeenCalledTimes(1);
    expect(map.addLayer.mock.calls[0][0].id).toBe('entity-selected-school-1');

    devSettings.highlightMultipleSchoolOnSameLatLng = false;
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

describe('onClickOnEntityDots', () => {
  afterEach(() => {
    setPopupOnClickDot(null);
  });

  it('uses the clicked entity layer type and id when overlapping map dots exist', () => {
    const healthLayerId = 'entity-selected-health-72';
    const handlerRef = { current: null as ((event: any) => void) | null };
    const map = {
      on: vi.fn((_event, _id, handler) => {
        handlerRef.current = handler;
      }),
      queryRenderedFeatures: vi.fn(() => [
        {
          layer: { id: healthLayerId },
          properties: { health_entity_id: 685448, id: 685448 },
          geometry: { type: 'Point', coordinates: [26.5, -30.2] },
        },
        {
          layer: { id: 'entity-selected-school-1' },
          properties: { id: 123, school_id: 123 },
          geometry: { type: 'Point', coordinates: [26.5, -30.2] },
        },
      ]),
    } as any;

    onClickOnEntityDots(map, healthLayerId, DEFAULT_SOURCE);
    handlerRef.current?.({ point: { x: 1, y: 1 } });

    expect($activeSchoolPopup.getState()).toMatchObject({
      id: 685448,
      entityType: EntityType.HEALTH,
    });
  });
});

describe('generateLayerUrls', () => {
  it.each([
    [EntityType.SCHOOL, 'school_exclude_same_coords_except_id=101'],
    [EntityType.HEALTH, 'health_exclude_same_coords_except_id=101'],
  ])(
    'should use the current %s detail id in entity-aware tile params',
    (entityType, expectedParam) => {
      const options = {
        activeEntityTypes: [EntityType.SCHOOL, EntityType.HEALTH],
        connectivityBenchMarkByEntity: {},
        country: { id: 1 },
        entityPageSelection: { entityType, ids: [101] },
        entityRegistry: {
          [EntityType.SCHOOL]: { visible: true },
          [EntityType.HEALTH]: { visible: true },
        },
        layerUtils: {
          selectedLayerIdByEntity: {
            [EntityType.SCHOOL]: 1,
            [EntityType.HEALTH]: 2,
          },
          currentLayerTypeUtilsByEntity: {},
        },
        mapRoute: { entity: true },
      } as any;

      expect(generateLayerUrls({ ...options, layerId: null })).toContain(
        expectedParam,
      );
      expect(generateStaticLayerUrl(options)).toContain(expectedParam);
    },
  );

  it('should generate global health connectivity tile URL without selected layer', () => {
    const result = generateLayerUrls({
      layerId: null,
      activeEntityTypes: [EntityType.HEALTH],
      connectivityBenchMark: 'global',
      connectivityFilter: {
        isWeek: false,
        range: { start: new Date('2026-01-01'), end: new Date('2026-01-31') },
      },
      layerUtils: {
        selectedLayerIdByEntity: {},
        currentLayerTypeUtilsByEntity: {},
      },
      mapRoute: { map: true },
      country: null,
      entityRegistry: {
        [EntityType.SCHOOL]: { visible: true },
        [EntityType.HEALTH]: { visible: true },
      },
    } as any);

    expect(result).toContain('api/v2/entities/tiles/connectivity/?');
    expect(result).toContain('entity_type__code=health');
    expect(result).not.toContain('entity_type__code=school');
  });

  it('should generate all-entity global connectivity tile URL without selected layer', () => {
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
      mapRoute: { map: true },
      country: null,
      entityRegistry: {
        [EntityType.SCHOOL]: { visible: true },
        [EntityType.HEALTH]: { visible: true },
      },
    } as any);

    expect(result).toContain('api/v2/entities/tiles/connectivity/?');
    expect(result).toContain('entity_type__code=all');
  });

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
