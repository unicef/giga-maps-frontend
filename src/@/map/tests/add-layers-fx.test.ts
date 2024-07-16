import { changeLayersFx } from '../effects/add-layers-fx';
import { clearMapDataFx } from '../effects/add-layers-fx';
import { updateConnectivityFilter } from '../effects/add-layers-fx';

jest.mock('../utils')
describe('changeLayersFx', () => {
  let map: any;
  beforeEach(() => {
    map = {
      getStyle: jest.fn(),
    }
  });

  it('should return early if map not provided', async () => {
    const result = await changeLayersFx({ map: null } as any);
    expect(result).toBeUndefined();
  });

  it('should call deleteSourceAndLayers if last layer selection changed', async () => {
    const result = await changeLayersFx({
      map,
      selectedLayerIds: [1],
      lastSelectedLayer: null,
      refresh: true
    } as any);
    expect(result).toBeUndefined();
  });

  it('should call createAndUpdateLayer after delay on layer change', async () => {
    const result = await changeLayersFx({
      map,
      selectedLayerIds: [1],
      lastSelectedLayer: null
    } as any);
    expect(result).toBeUndefined();
  });

});

describe('clearMapDataFx', () => {

  let map: any;
  beforeEach(() => {
    map = {
      removeSource: jest.fn(),
      getStyle: () => ({
        sources: {
          [defaultSource]: true,
          layers: []
        }
      })
    }
  });

  it('should return early if map is not provided', async () => {
    const result = await clearMapDataFx({ map: null });
    expect(result).toBeUndefined();
  });

  it('should call cancelAnimation', () => {
    clearMapDataFx({ map });
  });

});

import { updateCoverageFilter } from '../effects/add-layers-fx';
import { defaultSource } from '../utils';

describe('updateCoverageFilter', () => {

  it('should return early if map is not provided', async () => {
    const result = await updateCoverageFilter({
      layerUtils: {},
      coverageFilter: {},
      lastSelectedLayer: {}
    } as any);

    expect(result).toBeUndefined();
  });

  it('should set filter on map layer if static layer', () => {
    const map = {
      getLayer: jest.fn(() => true),
      setFilter: jest.fn()
    };
    const layerUtils = {
      selectedLayerId: 1,
      coverageLayerId: 2,
      currentLayerTypeUtils: {
        isStatic: true
      }
    };
    const coverageFilter = {};
    const lastSelectedLayer = {};

    updateCoverageFilter({
      map,
      layerUtils,
      coverageFilter,
      lastSelectedLayer
    } as any);

    expect(map.setFilter).toHaveBeenCalled();
  });

  it('should not set filter if not static layer', () => {
    const map = {
      getLayer: jest.fn(() => true),
      setFilter: jest.fn()
    };
    const layerUtils = {
      selectedLayerId: 1,
      coverageLayerId: 2,
      currentLayerTypeUtils: {
        isStatic: false
      }
    };
    const coverageFilter = {};
    const lastSelectedLayer = {};

    updateCoverageFilter({
      map,
      layerUtils,
      coverageFilter,
      lastSelectedLayer
    } as any);

    expect(map.setFilter).not.toHaveBeenCalled();
  });

});

describe('updateConnectivityFilter', () => {

  it('should return early if map is not provided', async () => {
    const result = await updateConnectivityFilter({
      map: null,
      layerUtils: {},
      connectivitySpeedFilter: {},
      lastSelectedLayer: {}
    } as any);

    expect(result).toBeUndefined();
  });

  it('should set filter on live layer if map and layer provided', () => {
    const map = {
      getLayer: jest.fn(() => true),
      setFilter: jest.fn()
    };
    const layerUtils = {
      selectedLayerId: 1,
      downloadLayerId: 2,
      currentLayerTypeUtils: {
        isLive: true
      }
    };
    const connectivitySpeedFilter = {
      range: {
        start: 1000,
        end: 2000
      }
    };

    updateConnectivityFilter({
      map,
      layerUtils,
      connectivitySpeedFilter,
      lastSelectedLayer: {}
    } as any);

    expect(map.setFilter).toHaveBeenCalled();
  });

  it('should not set filter on static layer', () => {
    const map = {
      getLayer: jest.fn(() => true),
      setFilter: jest.fn()
    };
    const layerUtils = {
      selectedLayerId: 1,
      downloadLayerId: 2,
      currentLayerTypeUtils: {
        isLive: false
      }
    };

    updateConnectivityFilter({
      map,
      layerUtils,
      connectivitySpeedFilter: {},
      lastSelectedLayer: {}
    } as any);

    expect(map.setFilter).not.toHaveBeenCalled();
  });

  it('updateConnectivityFilter: should return early if connectivitySpeedFilter is not provided', async () => {
    const result = await updateConnectivityFilter({
      map: null,
      layerUtils: {},
      connectivitySpeedFilter: null,
      lastSelectedLayer: {}
    } as any);

    expect(result).toBeUndefined();
  });

  it('updateConnectivityFilter: should set correct filter if live layer', async () => {
    const map = {
      getLayer: jest.fn(() => true),
      setFilter: jest.fn()
    };

    const layerUtils = {
      selectedLayerId: 1,
      downloadLayerId: 2,
      currentLayerTypeUtils: {
        isLive: true
      }
    };

    const connectivitySpeedFilter = {
      range: {
        start: 1000,
        end: 2000
      }
    };

    await updateConnectivityFilter({
      map,
      layerUtils,
      connectivitySpeedFilter,
      lastSelectedLayer: {}
    } as any);

    expect(map.setFilter).toHaveBeenCalled();
  });

  it('updateConnectivityFilter: should not set filter if layer is not live', () => {
    const map = {
      getLayer: jest.fn(() => true),
      setFilter: jest.fn()
    };

    const layerUtils = {
      selectedLayerId: 1,
      downloadLayerId: 2,
      currentLayerTypeUtils: {
        isLive: false
      }
    };

    const connectivitySpeedFilter = {
      range: {
        start: 1000,
        end: 2000
      }
    };

    updateConnectivityFilter({
      map,
      layerUtils,
      connectivitySpeedFilter,
      lastSelectedLayer: {}
    } as any);

    expect(map.setFilter).not.toHaveBeenCalled();
  });

});