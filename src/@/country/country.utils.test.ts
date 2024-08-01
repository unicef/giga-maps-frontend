import { getCountryLevels, onChangeLabelLayer, getCountryAdminCode, addAdminCountryLayerEvents, createLineLayerForCountry, setCountryBound, getFillColorForLayer, createSourceForAdminCountry, getFilterForFillLayer, createFillLayerForCountry, onChangeAdminBoundariesLayer, getAdminCountrySource, getAdminCountryLayerFill } from './country.utils';
import { CountryAdminLevel } from './country.constant';
import { Colors } from '../map/map.constant';
import { defaultSource } from '../map/utils';

describe('getCountryLevels', () => {

  it('should return isGreater true if level is less than selectedLevel', () => {
    const result = getCountryLevels(1, 2);
    expect(result.isGreater).toBe(true);
  });

  it('should return isLessThan true if level is greater than selectedLevel', () => {
    const result = getCountryLevels(2, 1);
    expect(result.isLessThan).toBe(true);
  });

  it('should return isGreaterOrEqualLevel true if level is equal to selectedLevel', () => {
    const result = getCountryLevels(2, 2);
    expect(result.isGreaterOrEqualLevel).toBe(true);
  });

  it('should return isSame true if level is equal to selectedLevel', () => {
    const result = getCountryLevels(2, 2);
    expect(result.isSame).toBe(true);
  });

});

describe('getFilterForFillLayer', () => {

  it('should return filter for level 0 with country code not equal to provided code', () => {
    const result = getFilterForFillLayer({
      levelsCode: ['US'],
      level: CountryAdminLevel.level0,
      worldView: ""
    });

    expect(result.length).toEqual(3);
  });

  it('should return filter for level 1 with country code equal to provided code', () => {
    const result = getFilterForFillLayer({
      levelsCode: ['US'],
      level: CountryAdminLevel.level1,
      worldView: "US"
    });

    expect(result.length).toEqual(3);
  });

  it('should return world view filter when no country code provided', () => {
    const result = getFilterForFillLayer({
      levelsCode: [],
      level: CountryAdminLevel.level1,
      worldView: "US"
    });

    expect(result.length).toEqual(3);
  });

});

describe('getFillColorForLayer', () => {

  it('should return default color when no admin1', () => {
    const result = getFillColorForLayer({
      levelsCode: ['', ''],
      isGreater: false,
      paintData: {
        allCountryColor: 'blue'
      }
    } as any);
    expect(result).toBe('blue');
  });

  it('should return admin1 color when admin1 is present', () => {
    const result = getFillColorForLayer({
      levelsCode: ['', 'CA'],
      isGreater: true,
      paintData: {
        allCountryColor: 'blue'
      }
    } as any);
    expect(result.length).toBe(4);
  });

  it('should return transparent when isGreater is false', () => {
    const result = getFillColorForLayer({
      levelsCode: ['', ''],
      isGreater: true,
      paintData: {
        allCountryColor: 'blue'
      }
    } as any);
    expect(result).toBe(Colors.TRANSPARENT);
  });

});

describe('createSourceForAdminCountry', () => {

  let map: any;

  beforeEach(() => {
    map = {
      addSource: jest.fn(),
      getStyle: () => ({
        sources: {
          [defaultSource]: true,
          layers: []
        }
      })
    };
  });

  it('should add a vector source for the admin country level', () => {
    const level = 0;

    createSourceForAdminCountry({ map, level });

    expect(map.addSource).toHaveBeenCalled();
  });

  it('should add a vector source for the admin country level', () => {
    const level = 1;

    createSourceForAdminCountry({
      map: {
        addSource: jest.fn(),
        getStyle: () => ({
          sources: {
            [getAdminCountrySource(1)]: true,
          }
        })
      },
      level
    } as any);

    expect(map.addSource).not.toHaveBeenCalled();
  });

});

describe('createFillLayerForCountry', () => {

  let map: any;

  beforeEach(() => {
    map = {
      addSource: jest.fn(),
      addLayer: jest.fn(),
      getLayer: () => { },
      setPaintProperty: jest.fn(),
      setLayoutProperty: jest.fn(),
      setFilter: jest.fn(),
      getStyle: () => ({
        sources: {
          [defaultSource]: true,
          layers: []
        }
      })
    };
  });

  it('should return isLayerCreated: true', () => {
    const result = createFillLayerForCountry({
      map,
      paintData: {},
      level: 0,
      selectedLevel: 0,
      levelsCode: ['admin0'],
      worldView: 'US',
      style: 'default'
    } as any);

    expect(result).toEqual({ isLayerCreated: true });
  });

  it('should create layer if not existing', () => {
    const result = createFillLayerForCountry({
      map: {
        ...map, getLayer: (id: string) => {
          if (id === 'land-structure-line') return true;
          return false;
        }
      },
      paintData: {},
      level: 1,
      selectedLevel: 1,
      levelsCode: ['adm0'],
      worldView: 'US',
      style: 'dark'
    } as any);

    expect(map.addLayer).toHaveBeenCalled();
    expect(result).toEqual({ isLayerCreated: true });
  });

  it('should update existing layer', () => {
    map.getLayer = jest.fn(() => true);
    const result = createFillLayerForCountry({
      map,
      paintData: {},
      level: 2,
      selectedLevel: 0,
      levelsCode: ["admin0"],
      worldView: 'US',
      style: 'default'
    } as any);

    expect(result).toEqual({ isLayerCreated: false });
  });

  it('should handle lower level', () => {
    map.addLayer = jest.fn();
    map.getLayer = jest.fn(() => true);

    const result = createFillLayerForCountry({
      map,
      paintData: {},
      level: 0,
      selectedLevel: 0,
      levelsCode: 'ADM0',
      worldView: 'US',
      style: 'default'
    } as any);

    expect(map.getLayer).toHaveBeenCalled();
    expect(map.addLayer).not.toHaveBeenCalled();
    expect(map.setPaintProperty).toHaveBeenCalled();
    expect(result).toEqual({ isLayerCreated: false });
  });

});

describe('createLineLayerForCountry', () => {

  let map: any;

  beforeEach(() => {
    map = {
      getLayer: jest.fn(),
      addLayer: jest.fn(),
      setFilter: jest.fn(),
      showLayer: jest.fn(),
      setLayoutProperty: jest.fn()
    };
  });

  it('should add layer if not existing', () => {
    map.getLayer.mockReturnValueOnce(false);

    createLineLayerForCountry({
      map,
      paintData: {},
      level: 0,
      selectedLevel: 0,
      countryCode: 'USA'
    } as any);


    createLineLayerForCountry({
      map,
      paintData: {},
      level: 0,
      selectedLevel: 0,
      countryCode: ''
    } as any);

    createLineLayerForCountry({
      map,
      paintData: {},
      level: 1,
      selectedLevel: 1,
      countryCode: 'US'
    } as any);

    expect(map.addLayer).toHaveBeenCalled();
  });

  it('should hide layer if level is less than', () => {
    map.getLayer.mockReturnValueOnce(true);

    createLineLayerForCountry({
      map,
      paintData: {},
      level: 1,
      selectedLevel: 0,
      countryCode: 'USA'
    } as any);

    expect(map.setFilter).not.toHaveBeenCalled();
  });

  it('should show layer if level is same or greater', () => {
    map.getLayer.mockReturnValueOnce(false);
    createLineLayerForCountry({
      map,
      paintData: {},
      level: 0,
      selectedLevel: 0,
      countryCode: 'US'
    } as any);

    expect(map.showLayer).not.toHaveBeenCalled();
  });

  it('should set filter with country code', () => {
    map.getLayer = () => true

    createLineLayerForCountry({
      map,
      paintData: {},
      level: 0,
      selectedLevel: 0,
      countryCode: 'US'
    } as any);

    createLineLayerForCountry({
      map,
      paintData: {},
      level: 1,
      selectedLevel: 1,
      countryCode: ''
    } as any);

    createLineLayerForCountry({
      map,
      paintData: {},
      level: 1,
      selectedLevel: 1,
      countryCode: 'US'
    } as any);

    expect(map.setFilter).toHaveBeenCalledTimes(3);
  });

});


describe('setCountryBound', () => {

  let map: any;

  beforeEach(() => {
    map = {
      fitBounds: jest.fn()
    };
  });

  it('should not call fitBounds if bbox is undefined', () => {
    setCountryBound(map, 'US');

    expect(map.fitBounds).not.toHaveBeenCalled();
  });

  it('should call fitBounds with bbox and padding', () => {
    const bbox = [0, 10, 20, 30];

    setCountryBound(map, 'US', bbox);

    expect(map.fitBounds).toHaveBeenCalled();
  });

});

describe('addAdminCountryLayerEvents', () => {
  let map: any;

  beforeEach(() => {
    map = {
      queryRenderedFeatures: jest.fn(),
      on: jest.fn(),
      addSource: jest.fn(),
      addLayer: jest.fn(),
      getLayer: () => { },
      mapSetFeatureState: jest.fn(),
      fitBounds: jest.fn(),
      setPaintProperty: jest.fn(),
      setLayoutProperty: jest.fn(),
      setFilter: jest.fn(),
      getStyle: () => ({
        sources: {
          [defaultSource]: true,
          layers: []
        }
      })
    };
  });

  it('should add click handler', () => {
    const level = 0;
    addAdminCountryLayerEvents({ map, level } as any);

    expect(map.on).toHaveBeenCalledWith('click', expect.any(Function));
  });

  it('should handle click event', () => {
    const level = 0;
    const result = addAdminCountryLayerEvents({ map, level } as any);

    const handler = map.on.mock.calls[0][1];
    map.queryRenderedFeatures.mockReturnValueOnce([{
      layer: {
        id: 1
      },
      properties: {
        "iso_3166_1": 'us'
      }
    }]);
    handler({
      point: { x: 1, y: 1 },
      features: [{
        layer: {
          id: 'layer0'
        },
        properties: {
        }
      }]
    } as any);
    expect(result).toBe(undefined);
  });

  it('should handle click event: case1', () => {
    const level = 1;
    const result = addAdminCountryLayerEvents({ map, level } as any);

    const handler = map.on.mock.calls[0][1];
    map.queryRenderedFeatures.mockReturnValueOnce([{
      layer: {
        id: 1
      },
      properties: {
        "iso_3166_1": 'us'
      }
    }]);
    handler({
      point: { x: 1, y: 1 },
      features: [{
        layer: {
          id: 'layer0'
        },
        properties: {
        }
      }]
    } as any);
    expect(result).toBe(undefined);
  });

  it('should handle click event: case2 - find layer', () => {
    const level = 0;
    addAdminCountryLayerEvents({ map, level } as any);

    const handler = map.on.mock.calls[0][1];
    map.queryRenderedFeatures.mockReturnValueOnce([{
      layer: {
        id: getAdminCountryLayerFill(level)
      },
      state: {
        bbox: [10, 12]
      },
      properties: {
        "iso_3166_1": 'us'
      }
    }]);
    handler({
      point: { x: 1, y: 1 }
    } as any);
    expect(window.location.pathname).toBe('/map/country/us');
  });

  it('should handle click event: case3 - admni1', () => {
    const level = 1;
    addAdminCountryLayerEvents({ map, level } as any);

    const handler = map.on.mock.calls[0][1];
    map.queryRenderedFeatures.mockReturnValueOnce([{
      layer: {
        id: getAdminCountryLayerFill(level)
      },
      state: {
        bbox: [10, 12],
        giga_id_admin: "ADM01"
      },
      properties: {
        "iso_3166_1": 'us'
      }
    }]);
    handler({
      point: { x: 1, y: 1 }
    } as any);
    expect(window.location.pathname).toBe('/map/country/us/ADM01');
  });

  it('should handle click event: case4 - admni1 empty ', () => {
    const level = 1;
    const result = addAdminCountryLayerEvents({ map, level } as any);

    const handler = map.on.mock.calls[0][1];
    map.queryRenderedFeatures.mockReturnValueOnce([{
      layer: {
        id: getAdminCountryLayerFill(level)
      },
      state: {
        bbox: [10, 12],
        giga_id_admin: ""
      },
      properties: {
        "iso_3166_1": 'us'
      }
    }]);
    handler({
      point: { x: 1, y: 1 }
    } as any);
    expect(result).toBe(undefined);
  });

  it('should handle mousemove event', () => {
    const level = 'level0';
    const setFeatureState = jest.fn();
    const getCanvas = jest.fn(() => ({
      style: {}
    }))
    addAdminCountryLayerEvents({ map: { ...map, setFeatureState, getCanvas }, level } as any);
    const handler = map.on.mock.calls[1][2];

    handler({
      features: [{
        id: 'country1'
      }]
    } as any);
    // if hoverid is same
    addAdminCountryLayerEvents({ map: { ...map, setFeatureState, getCanvas }, level } as any);
    handler({
      features: [{
        id: 'country1'
      }]
    } as any);
    expect(setFeatureState).toHaveBeenCalled();
  });

  it('should handle mousemove event: else case', () => {
    const level = 'level0';
    const setFeatureState = jest.fn();
    const getCanvas = jest.fn(() => ({
      style: {}
    }))
    addAdminCountryLayerEvents({ map: { ...map, setFeatureState, getCanvas }, level } as any);

    const handler = map.on.mock.calls[1][2];

    handler({
      features: []
    } as any);

    expect(getCanvas).toHaveBeenCalled();
  });

  it('should handle mouseout event', () => {
    const level = 0;
    const setFeatureState = jest.fn();
    const getCanvas = jest.fn(() => ({
      style: {}
    }))
    addAdminCountryLayerEvents({ map: { ...map, getCanvas, setFeatureState }, level } as any);

    const handler = map.on.mock.calls[2][2];

    handler({} as any);

    expect(setFeatureState).toHaveBeenCalled();
  });
});



describe('getCountryAdminCode', () => {

  it('should return empty admin codes when no path', () => {
    expect(getCountryAdminCode()).toEqual({
      admin1: undefined,
      admin2: undefined
    });
  });

  it('should return admin1 when only admin1 in path', () => {
    expect(getCountryAdminCode('US')).toEqual({
      admin1: 'US',
      admin2: undefined
    });
  });

  it('should return admin1 and admin2 when both in path', () => {
    expect(getCountryAdminCode('US/CA')).toEqual({
      admin1: 'US',
      admin2: 'CA'
    });
  });

  it('should handle extra slashes', () => {
    expect(getCountryAdminCode('US//CA')).toEqual({
      admin1: 'US',
      admin2: 'CA'
    });
  });

  it('should handle leading slash', () => {
    expect(getCountryAdminCode('/US/CA')).toEqual({
      admin1: 'US',
      admin2: 'CA'
    });
  });

  it('should handle trailing slash', () => {
    expect(getCountryAdminCode('US/CA/')).toEqual({
      admin1: 'US',
      admin2: 'CA'
    });
  });

  it('should ignore empty admin codes', () => {
    expect(getCountryAdminCode('/US//CA/')).toEqual({
      admin1: 'US',
      admin2: 'CA'
    });
  });

});


describe('onChangeLabelLayer', () => {
  let map: any;

  beforeEach(() => {
    map = {
      getLayer: jest.fn().mockImplementation(() => true),
      setLayoutProperty: jest.fn(),
      showLayer: jest.fn(),
      hideLayer: jest.fn()
    };
  });

  it('should show all label layers when showLabels is true', () => {
    onChangeLabelLayer(map, true);

    expect(map.setLayoutProperty).toHaveBeenCalled();
  });

  it('should hide all label layers when showLabels is false', () => {
    onChangeLabelLayer(map, false);

    expect(map.setLayoutProperty).toHaveBeenCalled();
  });
});


describe('onChangeAdminBoundariesLayer', () => {

  let map: any;

  beforeEach(() => {
    map = {
      getLayer: jest.fn().mockImplementation(() => true),
      setLayoutProperty: jest.fn(),
      showLayer: jest.fn(),
      hideLayer: jest.fn()
    };
  });

  it('should show all admin boundaries when showAdmin is true', () => {

    onChangeAdminBoundariesLayer(map, true);

    expect(map.setLayoutProperty).toHaveBeenCalled();
  });

  it('should hide all admin boundaries when showAdmin is false', () => {
    onChangeAdminBoundariesLayer(map, false);

    expect(map.setLayoutProperty).toHaveBeenCalled();
  });

});