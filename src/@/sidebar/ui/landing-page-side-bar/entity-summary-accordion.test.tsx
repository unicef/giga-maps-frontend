import { render, screen } from '@testing-library/react';
import { fork } from 'effector';
import { Provider } from 'effector-react';

import {
  $activeEntityTypes,
  $entityTypesFiltered,
} from '~/@/entities/models/entity.model';
import { EntityType } from '~/@/entities/types/base-entity.type';
import { $globalStatsByEntity } from '~/@/map/map.model';
import {
  $accordionExpandedByScope,
  $currentLayerTypeUtilsByEntity,
} from '~/@/sidebar/sidebar.model';
import { testWrapper } from '~/tests/test-wrapper';

import EntitySummaryAccordion from './entity-summary-accordion';

const renderAccordion = (isLive: boolean) => {
  const scope = fork({
    values: new Map()
      .set($activeEntityTypes, [EntityType.SCHOOL])
      .set($entityTypesFiltered, [EntityType.SCHOOL])
      .set($currentLayerTypeUtilsByEntity, {
        [EntityType.SCHOOL]: {
          isLive,
          isSchoolStatus: false,
          isStatic: !isLive,
        },
      })
      .set($globalStatsByEntity, {
        [EntityType.SCHOOL]: {
          connected_entities: { connected: 2 },
          entities_total: 10,
        },
      }),
  });

  return render(
    <Provider value={scope}>
      {testWrapper(
        <EntitySummaryAccordion
          connectivityStatsByEntity={{}}
          isLoadingLiveData
        >
          {() => null}
        </EntitySummaryAccordion>,
      )}
    </Provider>,
  );
};

describe('EntitySummaryAccordion live data loading', () => {
  it('loads only the reporting internet quality row for a live entity', () => {
    renderAccordion(true);

    const label = screen.getByText(/Reporting[- ]internet[- ]quality/i);
    const row = label.parentElement;

    expect(row?.querySelector('[data-slot="skeleton"]')).toBeInTheDocument();
    expect(row).not.toHaveTextContent('0');
  });

  it('does not apply live loading to a static entity card', () => {
    renderAccordion(false);

    const label = screen.getByText(/Reporting[- ]internet[- ]quality/i);
    const row = label.parentElement;

    expect(
      row?.querySelector('[data-slot="skeleton"]'),
    ).not.toBeInTheDocument();
    expect(row).toHaveTextContent('NA');
  });
});

describe('EntitySummaryAccordion expansion state', () => {
  const entityStats = {
    connected_entities: { connected: 2 },
    entities_total: 10,
  };

  const renderMultiEntity = (
    expandedByScope: Record<string, Record<string, boolean>>,
  ) => {
    const scope = fork({
      values: new Map()
        .set($activeEntityTypes, [EntityType.HEALTH, EntityType.SCHOOL])
        .set($entityTypesFiltered, [EntityType.SCHOOL, EntityType.HEALTH])
        .set($accordionExpandedByScope, expandedByScope)
        .set($globalStatsByEntity, {
          [EntityType.HEALTH]: entityStats,
          [EntityType.SCHOOL]: entityStats,
        }),
    });

    render(
      <Provider value={scope}>
        {testWrapper(
          <EntitySummaryAccordion connectivityStatsByEntity={{}}>
            {() => null}
          </EntitySummaryAccordion>,
        )}
      </Provider>,
    );

    return screen
      .getAllByRole('button')
      .filter((node) => node.dataset.slot === 'accordion-trigger')
      .map((node) => node.getAttribute('aria-expanded'));
  };

  it('renders every card collapsed when no scope state is set', () => {
    expect(renderMultiEntity({ country: {}, global: {} })).toEqual([
      'false',
      'false',
    ]);
  });

  it('renders the cards expanded by the current scope state', () => {
    expect(
      renderMultiEntity({
        country: { [EntityType.HEALTH]: true },
        global: { [EntityType.SCHOOL]: true },
      }),
    ).toEqual(['true', 'false']);
  });
});
