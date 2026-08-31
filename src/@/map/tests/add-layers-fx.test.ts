import { EntityType } from '~/@/entities/types/base-entity.type';

import { changeLayersFx } from '../effects/add-layers-fx';
import { clearMapDataFx } from '../effects/add-layers-fx';
import { updateConnectivityFilter } from '../effects/add-layers-fx';
import { filterConnectivityList } from '../utils';

vi.mock('../utils');
describe('changeLayersFx', () => {
  let map: any;
  beforeEach(() => {
    map = {
      getStyle: vi.fn(),
    };
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
      refresh: true,
      mapRoute: {
        map: false,
      },
    } as any);
    expect(result).toBeUndefined();
  });

  it('should call createAndUpdateLayer after delay on layer change', async () => {
    const result = await changeLayersFx({
      map,
      selectedLayerIds: [1],
      lastSelectedLayer: null,
      mapRoute: {
        map: true,
      },
    } as any);
    expect(result).toBeUndefined();
  });
});

describe('clearMapDataFx', () => {
  let map: any;
  beforeEach(() => {
    map = {
      removeSource: vi.fn(),
      getStyle: () => ({
        sources: {
          [DEFAULT_SOURCE]: true,
          layers: [],
        },
      }),
    };
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
import { DEFAULT_SOURCE } from '../map.constant';

describe('updateCoverageFilter', () => {
  it('should return early if map is not provided', async () => {
    const result = await updateCoverageFilter({
      layerUtils: {},
      coverageFilter: {},
      lastSelectedLayer: {},
    } as any);

    expect(result).toBeUndefined();
  });

  it('should set filter on map layer if static layer', () => {
    const map = {
      getLayer: vi.fn(() => true),
      setFilter: vi.fn(),
    };
    const layerUtils = {
      selectedLayerIdByEntity: { [EntityType.SCHOOL]: 1 },
      coverageLayerDataByEntity: { [EntityType.SCHOOL]: { id: 2 } },
      currentLayerTypeUtilsByEntity: {
        [EntityType.SCHOOL]: {
          isStatic: true,
        },
      },
    };
    const coverageFilter = {};
    const lastSelectedLayer = {};

    updateCoverageFilter({
      map,
      layerUtils,
      coverageFilterByEntity: { [EntityType.SCHOOL]: coverageFilter },
      lastSelectedLayer,
    } as any);

    expect(map.setFilter).toHaveBeenCalled();
  });

  it('should not set filter if not static layer', () => {
    const map = {
      getLayer: vi.fn(() => true),
      setFilter: vi.fn(),
    };
    const layerUtils = {
      selectedLayerIdByEntity: { [EntityType.SCHOOL]: 1 },
      coverageLayerDataByEntity: { [EntityType.SCHOOL]: { id: 2 } },
      currentLayerTypeUtilsByEntity: {
        [EntityType.SCHOOL]: {
          isStatic: false,
        },
      },
    };
    const coverageFilter = {};
    const lastSelectedLayer = {};

    updateCoverageFilter({
      map,
      layerUtils,
      coverageFilterByEntity: { [EntityType.SCHOOL]: coverageFilter },
      lastSelectedLayer,
    } as any);

    expect(map.setFilter).not.toHaveBeenCalled();
  });
});

describe('updateConnectivityFilter', () => {
  it('should return early if map is not provided', async () => {
    const result = await updateConnectivityFilter({
      map: null,
      layerUtils: {},
      connectivitySpeedFilterByEntity: {},
      lastSelectedLayer: {},
    } as any);

    expect(result).toBeUndefined();
  });

  it('should set filter on live layer if map and layer provided', () => {
    const map = {
      getLayer: vi.fn(() => true),
      setFilter: vi.fn(),
    };
    const layerUtils = {
      selectedLayerIdByEntity: { [EntityType.SCHOOL]: 1 },
      globalLayerDataByEntity: { [EntityType.SCHOOL]: { id: 2 } },
      currentLayerTypeUtilsByEntity: {
        [EntityType.SCHOOL]: {
          isLive: true,
        },
      },
    };
    const connectivitySpeedFilter = {
      range: {
        start: 1000,
        end: 2000,
      },
    };

    updateConnectivityFilter({
      map,
      layerUtils,
      connectivitySpeedFilterByEntity: { [EntityType.SCHOOL]: connectivitySpeedFilter },
      lastSelectedLayer: {},
    } as any);

    expect(map.setFilter).toHaveBeenCalled();
  });

  it('should not set filter on static layer', () => {
    const map = {
      getLayer: vi.fn(() => true),
      setFilter: vi.fn(),
    };
    const layerUtils = {
      selectedLayerIdByEntity: { [EntityType.SCHOOL]: 1 },
      globalLayerDataByEntity: { [EntityType.SCHOOL]: { id: 2 } },
      currentLayerTypeUtilsByEntity: {
        [EntityType.SCHOOL]: {
          isLive: false,
        },
      },
    };

    updateConnectivityFilter({
      map,
      layerUtils,
      connectivitySpeedFilterByEntity: { [EntityType.SCHOOL]: {} },
      lastSelectedLayer: {},
    } as any);

    expect(map.setFilter).not.toHaveBeenCalled();
  });

  it('updateConnectivityFilter: should return early if connectivitySpeedFilter is not provided', async () => {
    const result = await updateConnectivityFilter({
      map: null,
      layerUtils: {},
      connectivitySpeedFilterByEntity: null,
      lastSelectedLayer: {},
    } as any);

    expect(result).toBeUndefined();
  });

  it('updateConnectivityFilter: should set correct filter if live layer', async () => {
    const map = {
      getLayer: vi.fn(() => true),
      setFilter: vi.fn(),
    };

    const layerUtils = {
      selectedLayerIdByEntity: { [EntityType.SCHOOL]: 1 },
      globalLayerDataByEntity: { [EntityType.SCHOOL]: { id: 2 } },
      currentLayerTypeUtilsByEntity: {
        [EntityType.SCHOOL]: {
          isLive: true,
        },
      },
    };

    const connectivitySpeedFilter = {
      range: {
        start: 1000,
        end: 2000,
      },
    };

    await updateConnectivityFilter({
      map,
      layerUtils,
      connectivitySpeedFilterByEntity: { [EntityType.SCHOOL]: connectivitySpeedFilter },
      lastSelectedLayer: {},
    } as any);

    expect(map.setFilter).toHaveBeenCalled();
  });

  it('updateConnectivityFilter: should use dynamic filter keys for country download layer', async () => {
    const map = {
      getLayer: vi.fn(() => true),
      setFilter: vi.fn(),
    };

    const layerUtils = {
      selectedLayerIdByEntity: { [EntityType.SCHOOL]: 1 },
      globalLayerDataByEntity: { [EntityType.SCHOOL]: { id: 1 } },
      currentLayerTypeUtilsByEntity: {
        [EntityType.SCHOOL]: {
          isLive: true,
        },
      },
    };

    const connectivitySpeedFilter = {
      good: true,
      moderate: true,
      bad: true,
      unknown: true,
    };

    await updateConnectivityFilter({
      map,
      layerUtils,
      connectivitySpeedFilterByEntity: { [EntityType.SCHOOL]: connectivitySpeedFilter },
      mapRoute: { country: true },
      lastSelectedLayer: {},
    } as any);

    expect(filterConnectivityList).toHaveBeenCalledWith(
      connectivitySpeedFilter,
      true,
    );
    expect(map.setFilter).toHaveBeenCalled();
  });

  it('updateConnectivityFilter: should use active health entity on global map without layer metadata', async () => {
    const connectivitySpeedFilter = {
      good: true,
      moderate: true,
      bad: true,
      unknown: true,
    };
    const map = {
      getLayer: vi.fn((id) => id === 'entity-selected-health-10'),
      setFilter: vi.fn(),
    };

    await updateConnectivityFilter({
      map,
      layerUtils: {
        selectedLayerId: null,
        selectedLayerIdByEntity: {},
        globalLayerDataByEntity: { [EntityType.HEALTH]: { id: 10 } },
        currentLayerTypeUtils: {
          isLive: false,
        },
        currentLayerTypeUtilsByEntity: {},
      },
      connectivitySpeedFilterByEntity: { [EntityType.HEALTH]: connectivitySpeedFilter },
      mapRoute: { map: true },
      activeEntityTypes: [EntityType.HEALTH],
      lastSelectedLayer: {},
    } as any);

    expect(map.getLayer).toHaveBeenCalledWith('entity-selected-health-10');
    expect(filterConnectivityList).toHaveBeenCalledWith(
      connectivitySpeedFilter,
      false,
    );
    expect(map.setFilter).toHaveBeenCalled();
  });
  it('updateConnectivityFilter: should not set filter if layer is not live', () => {
    const map = {
      getLayer: vi.fn(() => true),
      setFilter: vi.fn(),
    };

    const layerUtils = {
      selectedLayerIdByEntity: { [EntityType.SCHOOL]: 1 },
      globalLayerDataByEntity: { [EntityType.SCHOOL]: { id: 2 } },
      currentLayerTypeUtilsByEntity: {
        [EntityType.SCHOOL]: {
          isLive: false,
        },
      },
    };

    const connectivitySpeedFilter = {
      range: {
        start: 1000,
        end: 2000,
      },
    };

    updateConnectivityFilter({
      map,
      layerUtils,
      connectivitySpeedFilterByEntity: { [EntityType.SCHOOL]: connectivitySpeedFilter },
      lastSelectedLayer: {},
    } as any);

    expect(map.setFilter).not.toHaveBeenCalled();
  });
});
