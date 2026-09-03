import '~/core/i18n/instance';

import { render, screen } from '@testing-library/react';
import { fork } from 'effector';
import { Provider } from 'effector-react';

import { $country } from '~/@/country/country.model';
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

import EntityEmptyState from './entity-empty-state';
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

describe('EntitySummaryAccordion allEntitiesEmpty state', () => {
  it('renders "Schools and health facilities in Gabon have not been mapped yet. For more information, contact us" when all entities are empty', () => {
    const scope = fork({
      values: new Map()
        .set($activeEntityTypes, [EntityType.SCHOOL, EntityType.HEALTH])
        .set($entityTypesFiltered, [EntityType.SCHOOL, EntityType.HEALTH])
        .set($country, {
          name: 'Gabon',
          code: 'GAB',
          id: 1,
          entity_counts: {
            [EntityType.SCHOOL]: 0,
            [EntityType.HEALTH]: 0,
          },
        } as any),
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

    expect(
      screen.getByText(/Schools and health facilities in/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/have not been mapped yet/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /contact us/i }),
    ).toBeInTheDocument();
  });

  it('renders "Health facility in Gabon have not been mapped yet. For more information, contact us" when only health entity is selected and empty', () => {
    const scope = fork({
      values: new Map()
        .set($activeEntityTypes, [EntityType.HEALTH])
        .set($entityTypesFiltered, [EntityType.HEALTH])
        .set($country, {
          name: 'Gabon',
          code: 'GAB',
          id: 1,
          entity_counts: {
            [EntityType.HEALTH]: 0,
          },
        } as any),
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

    expect(
      screen.getByText(/Health facility in/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/have not been mapped yet/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /contact us/i }),
    ).toBeInTheDocument();
  });

  it('renders "Health facility in Gabon have not been mapped yet" when entityType is HEALTH', () => {
    const scope = fork({
      values: new Map().set($country, { name: 'Gabon' } as any),
    });

    render(
      <Provider value={scope}>
        {testWrapper(<EntityEmptyState entityType={EntityType.HEALTH} />)}
      </Provider>,
    );

    expect(screen.getByText(/Health facility in/i)).toBeInTheDocument();
    expect(screen.getByText(/have not been mapped yet/i)).toBeInTheDocument();
  });

  it('renders "Schools in Gabon have not been mapped yet" when entityType is SCHOOL', () => {
    const scope = fork({
      values: new Map().set($country, { name: 'Gabon' } as any),
    });

    render(
      <Provider value={scope}>
        {testWrapper(<EntityEmptyState entityType={EntityType.SCHOOL} />)}
      </Provider>,
    );

    expect(screen.getByText(/Schools in/i)).toBeInTheDocument();
    expect(screen.getByText(/have not been mapped yet/i)).toBeInTheDocument();
  });
});
