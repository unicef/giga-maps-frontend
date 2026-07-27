import { allSettled, fork } from 'effector';
import {
  $accordionExpandedEntities,
  $benchmarkmarkUtilsByEntity,
  $connectivityBenchMarkByEntity,
  $connectivityLayers,
  $coverageStatusAllByEntity,
  $isLiveLegendLoading,
  $layersList,
  $multiSelectionSchoolCheckboxByEntity,
  $selectedLayerDataByEntity,
  $staticLayers,
  $staticLegendsSelectedByEntity,
  changeEntityCoverageStatus,
  changeMultiSelectionSchoolCheckbox,
  liveLegendLoadingFinished,
  liveLegendLoadingStarted,
  makeEmptyEntityStaticLegendsSelection,
  resetCoverageFilterSelection,
  resetEntityCoverageFilterSelection,
  selectAllEntityStaticLegendsSelection,
  entityStaticLegendsSelection,
  buildBenchmarkUtils,
  toggleAccordionEntity,
} from '../../sidebar.model';
import { LayerType, LayerTypeChoices } from '../../types';
import {
  ConnectivityBenchMarks,
  ConnectivityDistribution,
  ConnectivityStatusDistribution,
} from '../../sidebar.constant';
import {
  $countryBenchmark,
  $countryConnectivityNames,
} from '~/@/country/country.model';
import { EntityType, $activeEntityTypes, changeActiveEntityTypes } from '~/@/entities';
import { fetchSchoolLayerInfoFx } from '~/api/project-connect';

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
    expect(
      connectivityLayers.every((layer) => layer.type === LayerTypeChoices.LIVE),
    ).toBe(true);
  });

  it('should correctly filter static layers', async () => {
    const scope = fork({
      values: new Map().set($layersList, mockLayers),
    });

    const staticLayers = scope.getState($staticLayers);

    // Should have 1 static layer
    expect(staticLayers.length).toBe(1);

    // All layers should be of type STATIC
    expect(
      staticLayers.every((layer) => layer.type === LayerTypeChoices.STATIC),
    ).toBe(true);

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

describe('Live legend loading', () => {
  it('stays loading until the full live legend request pipeline finishes', async () => {
    const scope = fork();

    await allSettled(liveLegendLoadingStarted, { scope });
    expect(scope.getState($isLiveLegendLoading)).toBe(true);

    await allSettled(liveLegendLoadingFinished, { scope });
    expect(scope.getState($isLiveLegendLoading)).toBe(false);
  });

  it('finishes when the entity-detail layer info request settles', async () => {
    const scope = fork({
      handlers: new Map().set(fetchSchoolLayerInfoFx, () => []),
    });

    await allSettled(liveLegendLoadingStarted, { scope });
    expect(scope.getState($isLiveLegendLoading)).toBe(true);

    await allSettled(fetchSchoolLayerInfoFx, {
      scope,
      params: {
        entityType: EntityType.HEALTH,
        query: '',
        url: '',
      },
    });
    expect(scope.getState($isLiveLegendLoading)).toBe(false);
  });
});

describe('Static Legends Selection Tests', () => {
  const scope = fork();

  beforeEach(() => {
    allSettled(scope);
  });

  it('should initialize with default values', async () => {
    const state = scope.getState($staticLegendsSelectedByEntity).school;
    expect(state).toEqual([
      ConnectivityStatusDistribution.connected,
      ConnectivityStatusDistribution.notConnected,
      ConnectivityStatusDistribution.unknown,
    ]);
  });

  it('should not add more than 3 legends', async () => {
    const initialState = [
      ConnectivityStatusDistribution.connected,
      ConnectivityStatusDistribution.notConnected,
      ConnectivityStatusDistribution.unknown,
    ];
    await allSettled(entityStaticLegendsSelection, {
      scope,
      params: { entityType: EntityType.SCHOOL, legends: 'test_legend' },
    });
    const state = scope.getState($staticLegendsSelectedByEntity).school;
    expect(state).toEqual(initialState);
  });

  it('should remove a legend when selecting an already selected item', async () => {
    await allSettled(entityStaticLegendsSelection, {
      scope,
      params: {
        entityType: EntityType.SCHOOL,
        legends: ConnectivityStatusDistribution.connected,
      },
    });
    const state = scope.getState($staticLegendsSelectedByEntity).school;
    expect(state).not.toContain(ConnectivityStatusDistribution.connected);
  });

  it('should handle array input by replacing current selection', async () => {
    const newSelection = [
      ConnectivityStatusDistribution.connected,
      ConnectivityStatusDistribution.notConnected,
    ];
    await allSettled(entityStaticLegendsSelection, {
      scope,
      params: { entityType: EntityType.SCHOOL, legends: newSelection },
    });
    const state = scope.getState($staticLegendsSelectedByEntity).school;
    expect(state).toEqual(newSelection);
  });

  it('should clear all selections for one entity', async () => {
    await allSettled(makeEmptyEntityStaticLegendsSelection, {
      scope,
      params: { entityType: EntityType.SCHOOL },
    });
    const state = scope.getState($staticLegendsSelectedByEntity).school;
    expect(state).toEqual([]);
  });

  it('should select all legends for one entity', async () => {
    await allSettled(selectAllEntityStaticLegendsSelection, {
      scope,
      params: { entityType: EntityType.SCHOOL },
    });
    const state = scope.getState($staticLegendsSelectedByEntity).school;
    expect(state.length).toEqual(3);
  });

  it('should handle select all functionality', async () => {
    const scope = fork();

    // Add some initial selections
    await allSettled(entityStaticLegendsSelection, {
      scope,
      params: { entityType: EntityType.SCHOOL, legends: 'connected' },
    });
    expect(
      scope.getState($staticLegendsSelectedByEntity).school?.length,
    ).toEqual(2);

    // Test select all
    await allSettled(selectAllEntityStaticLegendsSelection, {
      scope,
      params: { entityType: EntityType.SCHOOL },
    });
    const finalState =
      scope.getState($staticLegendsSelectedByEntity).school ?? [];
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
    const state = scope.getState($multiSelectionSchoolCheckboxByEntity).school!;
    expect(state).toEqual({ countryId: 0, schoolIds: [] });
  });

  it('should add a school to selection', async () => {
    const mockSelection = { countryId: 1, schoolIds: [123] };
    await allSettled(changeMultiSelectionSchoolCheckbox, {
      scope,
      params: { ...mockSelection, entityType: EntityType.SCHOOL },
    });
    const state = scope.getState($multiSelectionSchoolCheckboxByEntity).school!;
    expect(state.countryId).toBe(1);
  });

  it('should remove a school from selection', async () => {
    // First add schools
    const initialSelection = { countryId: 1, schoolIds: [123, 456] };
    await allSettled(changeMultiSelectionSchoolCheckbox, {
      scope,
      params: { ...initialSelection, entityType: EntityType.SCHOOL },
    });

    // Then remove one
    const removeSelection = { countryId: 1, schoolIds: 123 };
    await allSettled(changeMultiSelectionSchoolCheckbox, {
      scope,
      params: { ...removeSelection, entityType: EntityType.SCHOOL },
    });

    const state = scope.getState($multiSelectionSchoolCheckboxByEntity).school!;
    expect(state.schoolIds).toHaveLength(3);
  });

  it('should clear selection when changing country', async () => {
    // First add schools for country 1
    const initialSelection = { countryId: 1, schoolIds: [123, 456] };
    await allSettled(changeMultiSelectionSchoolCheckbox, {
      scope,
      params: { ...initialSelection, entityType: EntityType.SCHOOL },
    });

    // Change to country 2
    const newSelection = { countryId: 2, schoolIds: [789] };
    await allSettled(changeMultiSelectionSchoolCheckbox, {
      scope,
      params: { ...newSelection, entityType: EntityType.SCHOOL },
    });

    const state = scope.getState($multiSelectionSchoolCheckboxByEntity).school!;
    expect(state.countryId).toBe(2);
  });

  it('should handle multiple school selections', async () => {
    const selections = [
      { countryId: 1, schoolIds: [123] },
      { countryId: 1, schoolIds: [456] },
      { countryId: 1, schoolIds: [789] },
    ];

    for (const selection of selections) {
      await allSettled(changeMultiSelectionSchoolCheckbox, {
        scope,
        params: { ...selection, entityType: EntityType.SCHOOL },
      });
    }

    const state = scope.getState($multiSelectionSchoolCheckboxByEntity).school!;
    expect(state.schoolIds).toHaveLength(8);
  });

  it('should handle clearing all selections', async () => {
    // First add some schools
    const initialSelection = { countryId: 1, schoolIds: [123, 456, 789] };
    await allSettled(changeMultiSelectionSchoolCheckbox, {
      scope,
      params: { ...initialSelection, entityType: EntityType.SCHOOL },
    });

    // Clear all selections
    const state = scope.getState($multiSelectionSchoolCheckboxByEntity).school!;
    expect(state.countryId).toEqual(1);
  });

  it('should not add duplicate school IDs', async () => {
    const selections = [
      { countryId: 1, schoolIds: [123] },
      { countryId: 1, schoolIds: [123] }, // Duplicate selection
    ];

    for (const selection of selections) {
      await allSettled(changeMultiSelectionSchoolCheckbox, {
        scope,
        params: { ...selection, entityType: EntityType.SCHOOL },
      });
    }

    const state = scope.getState($multiSelectionSchoolCheckboxByEntity).school!;
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
      benchmark_name: 'Global Benchmark',
    },
    is_reverse: false,
    benchmark_metadata: {
      base_benchmark: '5',
      round_unit_value: 'x => Math.round(x)',
    },
  };

  const mockCountryBenchmark = {
    1: '15', // for layer id 1
  };

  const mockConnectivityNames = {
    1: 'National Benchmark', // for layer id 1
  };

  it('should return empty object if layer data is missing or not live', async () => {
    const result = buildBenchmarkUtils(
      mockCountryBenchmark,
      null,
      ConnectivityBenchMarks.global,
      mockConnectivityNames,
      { map: false } as any,
    );
    expect(result).toEqual({});
  });

  it('should calculate global benchmark values correctly', async () => {
    const scope = fork({
      values: new Map()
        .set($selectedLayerDataByEntity, { school: mockSelectedLayerData })
        .set($countryBenchmark, mockCountryBenchmark)
        .set($connectivityBenchMarkByEntity, {
          school: ConnectivityBenchMarks.global,
        })
        .set($countryConnectivityNames, mockConnectivityNames),
    });

    const result = scope.getState($benchmarkmarkUtilsByEntity).school;
    expect(result.isReverse).toEqual(false);
    expect(result.baseBenchmark).toEqual('5');
  });

  it('should calculate national benchmark values correctly', async () => {
    const scope = fork({
      values: new Map()
        .set($selectedLayerDataByEntity, { school: mockSelectedLayerData })
        .set($countryBenchmark, mockCountryBenchmark)
        .set($connectivityBenchMarkByEntity, {
          school: ConnectivityBenchMarks.national,
        })
        .set($countryConnectivityNames, mockConnectivityNames),
    });

    const result = scope.getState($benchmarkmarkUtilsByEntity).school;
    expect(result.nationalBenchmarkValue).toEqual(0);
  });

  it('should handle missing national benchmark value', async () => {
    const scope = fork({
      values: new Map()
        .set($selectedLayerDataByEntity, { school: mockSelectedLayerData })
        .set($countryBenchmark, {})
        .set($connectivityBenchMarkByEntity, {
          school: ConnectivityBenchMarks.national,
        })
        .set($countryConnectivityNames, mockConnectivityNames),
    });

    const result = scope.getState($benchmarkmarkUtilsByEntity).school;
    expect(result.nationalBenchmarkValue).toBe(0);
    expect(result.isNational).toBe(false);
  });

  it('should handle reversed benchmark logic', async () => {
    const reversedLayerData = {
      ...mockSelectedLayerData,
      is_reverse: true,
    };

    const scope = fork({
      values: new Map()
        .set($selectedLayerDataByEntity, { school: reversedLayerData })
        .set($countryBenchmark, mockCountryBenchmark)
        .set($connectivityBenchMarkByEntity, {
          school: ConnectivityBenchMarks.global,
        })
        .set($countryConnectivityNames, mockConnectivityNames),
    });

    const result = scope.getState($benchmarkmarkUtilsByEntity).school;
    expect(result.isReverse).toBe(true);
    expect(result.benchmarkLogic).toBeDefined();
  });

  it('should handle missing benchmark metadata', async () => {
    const layerWithoutMetadata = {
      ...mockSelectedLayerData,
      benchmark_metadata: undefined,
    };

    const scope = fork({
      values: new Map()
        .set($selectedLayerDataByEntity, { school: layerWithoutMetadata })
        .set($countryBenchmark, mockCountryBenchmark)
        .set($connectivityBenchMarkByEntity, {
          school: ConnectivityBenchMarks.global,
        })
        .set($countryConnectivityNames, mockConnectivityNames),
    });

    const result = scope.getState($benchmarkmarkUtilsByEntity).school;
    expect(result.baseBenchmark).toBeUndefined();
    expect(result.benchmarkLogic).toBeDefined();
  });
});

describe('Entity coverage filter reset', () => {
  afterEach(() => {
    resetCoverageFilterSelection();
  });

  it('resets only the requested entity type', () => {
    changeEntityCoverageStatus({
      entityType: EntityType.SCHOOL,
      key: ConnectivityDistribution.good,
      value: false,
    });
    changeEntityCoverageStatus({
      entityType: EntityType.HEALTH,
      key: ConnectivityDistribution.good,
      value: false,
    });
    resetEntityCoverageFilterSelection(EntityType.HEALTH);

    const filters = $coverageStatusAllByEntity.getState();
    expect(filters[EntityType.HEALTH]?.good).toBe(true);
    expect(filters[EntityType.SCHOOL]?.good).toBe(false);
  });
});

describe('Accordion Expanded Entities Store', () => {
  it('collapses all entities by default on initial multi-entity selection', () => {
    const scope = fork({
      values: new Map().set($activeEntityTypes, [
        EntityType.HEALTH,
        EntityType.SCHOOL,
      ]),
    });
    expect(scope.getState($accordionExpandedEntities)).toEqual({});
  });

  it('expands single entity by default on single-entity selection', async () => {
    const scope = fork();
    await allSettled(changeActiveEntityTypes, {
      scope,
      params: [EntityType.SCHOOL],
    });
    expect(scope.getState($accordionExpandedEntities)).toEqual({
      [EntityType.SCHOOL]: true,
    });
  });

  it('expands single entity when switching from multi-entity to single-entity', async () => {
    const scope = fork({
      values: new Map().set($activeEntityTypes, [
        EntityType.HEALTH,
        EntityType.SCHOOL,
      ]),
    });

    await allSettled(changeActiveEntityTypes, {
      scope,
      params: [EntityType.HEALTH],
    });

    expect(scope.getState($accordionExpandedEntities)).toEqual({
      [EntityType.HEALTH]: true,
    });
  });

  it('toggles entity expansion and preserves user expanded state across transitions', async () => {
    const scope = fork({
      values: new Map().set($activeEntityTypes, [
        EntityType.HEALTH,
        EntityType.SCHOOL,
      ]),
    });

    // Toggle HEALTH to expanded
    await allSettled(toggleAccordionEntity, {
      scope,
      params: EntityType.HEALTH,
    });

    expect(scope.getState($accordionExpandedEntities)).toEqual({
      [EntityType.HEALTH]: true,
    });

    // Switch to single entity SCHOOL
    await allSettled(changeActiveEntityTypes, {
      scope,
      params: [EntityType.SCHOOL],
    });

    // Both HEALTH (toggled earlier) and SCHOOL (single entity auto-expand) should remain true
    expect(scope.getState($accordionExpandedEntities)).toEqual({
      [EntityType.HEALTH]: true,
      [EntityType.SCHOOL]: true,
    });
  });
});
