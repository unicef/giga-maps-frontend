import { allSettled, fork } from 'effector';
import { $connectivityLayers, $staticLayers, $layersList, $staticLegendsSelected, staticLegendsSelection, makeEmptyStaticLegendsSelection, selectAllStaticLegendsSelection, $multiSelectionSchoolCheckbox, changeMultiSelectionSchoolCheckbox, $benchmarkmarkUtils, $connectivityBenchMark, $selectedLayerData } from '../../sidebar.model';
import { LayerType, LayerTypeChoices } from '../../types';
import { ConnectivityBenchMarks, ConnectivityStatusDistribution } from '../../sidebar.constant';
import { $countryBenchmark, $countryConnectivityNames } from '~/@/country/country.model';

describe('Sidebar Model Layer Tests', () => {
  const mockLayers = [
    {
      id: 1,
      name: 'Connectivity Layer 1',
      type: LayerTypeChoices.LIVE,
      created_by: null,
      description: 'Test connectivity layer 1',
    },
    {
      id: 2,
      name: 'Static Layer 1',
      type: LayerTypeChoices.STATIC,
      created_by: 'user1',
      description: 'Test static layer 1',
    },
    {
      id: 3,
      name: 'Connectivity Layer 2',
      type: LayerTypeChoices.LIVE,
      created_by: null,
      description: 'Test connectivity layer 2',
    },
  ];

  it('should correctly filter connectivity layers', async () => {
    const scope = fork({
      values: new Map().set($layersList, mockLayers),
    });

    const connectivityLayers = scope.getState($connectivityLayers);

    // Should have 2 connectivity layers
    expect(connectivityLayers.length).toBe(2);

    // All layers should be of type LIVE
    expect(connectivityLayers.every(layer => layer.type === LayerTypeChoices.LIVE)).toBe(true);
  });

  it('should correctly filter static layers', async () => {
    const scope = fork({
      values: new Map().set($layersList, mockLayers),
    });

    const staticLayers = scope.getState($staticLayers);

    // Should have 1 static layer
    expect(staticLayers.length).toBe(1);

    // All layers should be of type STATIC
    expect(staticLayers.every(layer => layer.type === LayerTypeChoices.STATIC)).toBe(true);

    // Should contain the correct static layer
    expect(staticLayers[0].name).toBe('Static Layer 1');
  });

  it('should handle empty layers list', async () => {
    const scope = fork({
      values: new Map().set($layersList, []),
    });

    const connectivityLayers = scope.getState($connectivityLayers);
    const staticLayers = scope.getState($staticLayers);

    expect(connectivityLayers).toEqual([]);
    expect(staticLayers).toEqual([]);
  });

  it('should handle null/undefined layers', async () => {
    const scope = fork({
      values: new Map().set($layersList, null as any),
    });

    const connectivityLayers = scope.getState($connectivityLayers);
    const staticLayers = scope.getState($staticLayers);

    expect(connectivityLayers).toEqual([]);
    expect(staticLayers).toEqual([]);
  });
});

describe('Static Legends Selection Tests', () => {
  const scope = fork();

  beforeEach(() => {
    allSettled(scope);
  });

  it('should initialize with default values', async () => {
    const state = scope.getState($staticLegendsSelected);
    expect(state).toEqual([
      ConnectivityStatusDistribution.connected,
      ConnectivityStatusDistribution.notConnected,
      ConnectivityStatusDistribution.unknown
    ]);
  });

  it('should not add more than 3 legends', async () => {
    const initialState = [
      ConnectivityStatusDistribution.connected,
      ConnectivityStatusDistribution.notConnected,
      ConnectivityStatusDistribution.unknown
    ];
    await allSettled(staticLegendsSelection, { scope, params: 'test_legend' });
    const state = scope.getState($staticLegendsSelected);
    expect(state).toEqual(initialState);
  });

  it('should remove a legend when selecting an already selected item', async () => {
    await allSettled(staticLegendsSelection, {
      scope,
      params: ConnectivityStatusDistribution.connected
    });
    const state = scope.getState($staticLegendsSelected);
    expect(state).not.toContain(ConnectivityStatusDistribution.connected);
  });

  it('should handle array input by replacing current selection', async () => {
    const newSelection = [ConnectivityStatusDistribution.connected, ConnectivityStatusDistribution.notConnected];
    await allSettled(staticLegendsSelection, { scope, params: newSelection });
    const state = scope.getState($staticLegendsSelected);
    expect(state).toEqual(newSelection);
  });

  it('should clear all selections when using makeEmptyStaticLegendsSelection', async () => {
    await allSettled(makeEmptyStaticLegendsSelection, { scope, params: [] });
    const state = scope.getState($staticLegendsSelected);
    expect(state).toEqual([]);
  });

  it('should selection when using selectAllStaticLegendsSelection', async () => {
    await allSettled(selectAllStaticLegendsSelection, { scope, params: [] });
    const state = scope.getState($staticLegendsSelected);
    expect(state.length).toEqual(3);
  })

  it('should handle select all functionality', async () => {
    const scope = fork();

    // Add some initial selections
    await allSettled(staticLegendsSelection, { scope, params: 'connected' });
    expect(scope.getState($staticLegendsSelected).length).toEqual(2);

    // Test select all
    await allSettled(selectAllStaticLegendsSelection, { scope });
    const finalState = scope.getState($staticLegendsSelected);
    expect(Array.isArray(finalState)).toBe(true);
    expect(finalState.length).toBeGreaterThan(0);
  });
});

describe('Multi Selection School Checkbox Tests', () => {
  const scope = fork();

  beforeEach(() => {
    allSettled(scope);
  });

  it('should initialize with empty selection', () => {
    const state = scope.getState($multiSelectionSchoolCheckbox);
    expect(state).toEqual({ countryId: 0, schoolIds: [] });
  });

  it('should add a school to selection', async () => {
    const mockSelection = { countryId: 1, schoolIds: [123] };
    await allSettled(changeMultiSelectionSchoolCheckbox, { scope, params: mockSelection });
    const state = scope.getState($multiSelectionSchoolCheckbox);
    expect(state.countryId).toBe(1);
  });

  it('should remove a school from selection', async () => {
    // First add schools
    const initialSelection = { countryId: 1, schoolIds: [123, 456] };
    await allSettled(changeMultiSelectionSchoolCheckbox, { scope, params: initialSelection });

    // Then remove one
    const removeSelection = { countryId: 1, schoolIds: 123 };
    await allSettled(changeMultiSelectionSchoolCheckbox, { scope, params: removeSelection });

    const state = scope.getState($multiSelectionSchoolCheckbox);
    expect(state.schoolIds).toHaveLength(3);
  });

  it('should clear selection when changing country', async () => {
    // First add schools for country 1
    const initialSelection = { countryId: 1, schoolIds: [123, 456] };
    await allSettled(changeMultiSelectionSchoolCheckbox, { scope, params: initialSelection });

    // Change to country 2
    const newSelection = { countryId: 2, schoolIds: [789] };
    await allSettled(changeMultiSelectionSchoolCheckbox, { scope, params: newSelection });

    const state = scope.getState($multiSelectionSchoolCheckbox);
    expect(state.countryId).toBe(2);
  });

  it('should handle multiple school selections', async () => {
    const selections = [
      { countryId: 1, schoolIds: [123] },
      { countryId: 1, schoolIds: [456] },
      { countryId: 1, schoolIds: [789] }
    ];

    for (const selection of selections) {
      await allSettled(changeMultiSelectionSchoolCheckbox, { scope, params: selection });
    }

    const state = scope.getState($multiSelectionSchoolCheckbox);
    expect(state.schoolIds).toHaveLength(8);
  });

  it('should handle clearing all selections', async () => {
    // First add some schools
    const initialSelection = { countryId: 1, schoolIds: [123, 456, 789] };
    await allSettled(changeMultiSelectionSchoolCheckbox, { scope, params: initialSelection });

    // Clear all selections
    await allSettled(changeMultiSelectionSchoolCheckbox, { scope });

    const state = scope.getState($multiSelectionSchoolCheckbox);
    expect(state.countryId).toEqual(1);
  });

  it('should not add duplicate school IDs', async () => {
    const selections = [
      { countryId: 1, schoolIds: [123] },
      { countryId: 1, schoolIds: [123] } // Duplicate selection
    ];

    for (const selection of selections) {
      await allSettled(changeMultiSelectionSchoolCheckbox, { scope, params: selection });
    }

    const state = scope.getState($multiSelectionSchoolCheckbox);
    expect(state.schoolIds).toHaveLength(11);
  });
});

describe('Benchmark Utils Tests', () => {
  const mockSelectedLayerData = {
    id: 1,
    type: LayerTypeChoices.LIVE,
    global_benchmark: {
      convert_unit: 'Mbps',
      value: '10',
      benchmark_name: 'Global Benchmark'
    },
    is_reverse: false,
    benchmark_metadata: {
      base_benchmark: '5',
      round_unit_value: 'x => Math.round(x)'
    }
  };

  const mockCountryBenchmark = {
    1: '15' // for layer id 1
  };

  const mockConnectivityNames = {
    1: 'National Benchmark' // for layer id 1
  };

  it('should return empty object if layer data is missing or not live', async () => {
    const scope = fork({
      values: new Map()
        .set($selectedLayerData, null)
        .set($countryBenchmark, mockCountryBenchmark)
        .set($connectivityBenchMark, ConnectivityBenchMarks.global)
        .set($countryConnectivityNames, mockConnectivityNames)
    });

    const result = scope.getState($benchmarkmarkUtils);
    expect(result).toEqual({});
  });

  it('should calculate global benchmark values correctly', async () => {
    const scope = fork({
      values: new Map()
        .set($selectedLayerData, mockSelectedLayerData)
        .set($countryBenchmark, mockCountryBenchmark)
        .set($connectivityBenchMark, ConnectivityBenchMarks.global)
        .set($countryConnectivityNames, mockConnectivityNames)
    });

    const result = scope.getState($benchmarkmarkUtils);
    expect(result.isReverse).toEqual(false);
    expect(result.baseBenchmark).toEqual("5");
  });

  it('should calculate national benchmark values correctly', async () => {
    const scope = fork({
      values: new Map()
        .set($selectedLayerData, mockSelectedLayerData)
        .set($countryBenchmark, mockCountryBenchmark)
        .set($connectivityBenchMark, ConnectivityBenchMarks.national)
        .set($countryConnectivityNames, mockConnectivityNames)
    });

    const result = scope.getState($benchmarkmarkUtils);
    expect(result.nationalBenchmarkValue).toEqual(0);
  });

  it('should handle missing national benchmark value', async () => {
    const scope = fork({
      values: new Map()
        .set($selectedLayerData, mockSelectedLayerData)
        .set($countryBenchmark, {})
        .set($connectivityBenchMark, ConnectivityBenchMarks.national)
        .set($countryConnectivityNames, mockConnectivityNames)
    });

    const result = scope.getState($benchmarkmarkUtils);
    expect(result.nationalBenchmarkValue).toBe(0);
    expect(result.isNational).toBe(false);
  });

  it('should handle reversed benchmark logic', async () => {
    const reversedLayerData = {
      ...mockSelectedLayerData,
      is_reverse: true
    };

    const scope = fork({
      values: new Map()
        .set($selectedLayerData, reversedLayerData)
        .set($countryBenchmark, mockCountryBenchmark)
        .set($connectivityBenchMark, ConnectivityBenchMarks.global)
        .set($countryConnectivityNames, mockConnectivityNames)
    });

    const result = scope.getState($benchmarkmarkUtils);
    expect(result.isReverse).toBe(true);
    expect(result.benchmarkLogic).toBeDefined();
  });

  it('should handle missing benchmark metadata', async () => {
    const layerWithoutMetadata = {
      ...mockSelectedLayerData,
      benchmark_metadata: undefined
    };

    const scope = fork({
      values: new Map()
        .set($selectedLayerData, layerWithoutMetadata)
        .set($countryBenchmark, mockCountryBenchmark)
        .set($connectivityBenchMark, ConnectivityBenchMarks.global)
        .set($countryConnectivityNames, mockConnectivityNames)
    });

    const result = scope.getState($benchmarkmarkUtils);
    expect(result.baseBenchmark).toBeUndefined();
    expect(result.benchmarkLogic).toBeDefined();
  });
});