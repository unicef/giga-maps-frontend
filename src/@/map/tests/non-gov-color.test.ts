import type { Map } from 'mapbox-gl';

import { stylePaintData } from '../map.constant';
import { createSchoolLayer, withNonGovColor } from '../utils';

const statusColor = [
  'match',
  ['get', 'connectivity_status'],
  'connected',
  '#0f0',
  '#00f',
];
const nonGovColor = '#183856';

describe('withNonGovColor', () => {
  test('leaves the colour untouched without non-gov options', () => {
    expect(
      withNonGovColor(statusColor, { nonGovColor, isGlobalView: true }),
    ).toBe(statusColor);
  });

  test('mutes every dot of a non-engaged country in country view', () => {
    expect(
      withNonGovColor(statusColor, {
        nonGovColor,
        isGlobalView: false,
        nonGovDots: { engagedCountryIds: [1], isCountryEngaged: false },
      }),
    ).toBe(nonGovColor);
  });

  test('keeps an engaged country unchanged in country view', () => {
    expect(
      withNonGovColor(statusColor, {
        nonGovColor,
        isGlobalView: false,
        nonGovDots: { engagedCountryIds: [1], isCountryEngaged: true },
      }),
    ).toBe(statusColor);
  });

  test('colours by country_id in global view, and keeps tiles without it as they are', () => {
    expect(
      withNonGovColor(statusColor, {
        nonGovColor,
        isGlobalView: true,
        nonGovDots: { engagedCountryIds: [1, 4], isCountryEngaged: true },
      }),
    ).toEqual([
      'case',
      ['has', 'country_id'],
      ['match', ['get', 'country_id'], [1, 4], statusColor, nonGovColor],
      statusColor,
    ]);
  });

  test('mutes every dot carrying a country_id when no country is engaged', () => {
    expect(
      withNonGovColor(statusColor, {
        nonGovColor,
        isGlobalView: true,
        nonGovDots: { engagedCountryIds: [], isCountryEngaged: true },
      }),
    ).toEqual(['case', ['has', 'country_id'], nonGovColor, statusColor]);
  });

  test('keeps the map as it was while the backend does not send school_data_type', () => {
    expect(
      withNonGovColor(statusColor, {
        nonGovColor,
        isGlobalView: true,
        nonGovDots: { engagedCountryIds: null, isCountryEngaged: true },
      }),
    ).toBe(statusColor);
  });
});

describe('createSchoolLayer with non-gov dots', () => {
  const mapRoute = {
    map: false,
    country: true,
    schools: false,
    entity: false,
    entityView: false,
  };

  test('repaints a reused layer instead of keeping its old colour', () => {
    const setPaintProperty = vi.fn();
    const map = {
      getLayer: vi.fn(() => ({ source: 'schools' })),
      setLayerZoomRange: vi.fn(),
      setLayoutProperty: vi.fn(),
      setPaintProperty,
    } as unknown as Map;

    createSchoolLayer(map, {
      id: 'status-layer',
      source: 'schools',
      paintData: stylePaintData.dark,
      options: {},
      mapRoute,
      isMobile: false,
      nonGovDots: { engagedCountryIds: [1], isCountryEngaged: false },
    });

    expect(setPaintProperty).toHaveBeenCalledWith(
      'status-layer',
      'circle-color',
      stylePaintData.dark.nonGov,
    );
  });

  test('does not touch reused layers that do not use non-gov dots', () => {
    const setPaintProperty = vi.fn();
    const map = {
      getLayer: vi.fn(() => ({ source: 'schools' })),
      setLayerZoomRange: vi.fn(),
      setLayoutProperty: vi.fn(),
      setPaintProperty,
    } as unknown as Map;

    createSchoolLayer(map, {
      id: 'preview-layer',
      source: 'schools',
      paintData: stylePaintData.dark,
      options: {},
      mapRoute,
      isMobile: false,
    });

    expect(setPaintProperty).not.toHaveBeenCalled();
  });
});

describe('non-gov paint data', () => {
  test('uses the ticket colours for dark and light themes', () => {
    expect(stylePaintData.dark.nonGov).toBe('#183856');
    expect(stylePaintData.light.nonGov).toBe('#c8c7c9');
  });
});
