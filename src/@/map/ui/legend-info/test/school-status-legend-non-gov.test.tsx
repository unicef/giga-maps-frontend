import '~/core/i18n/instance';

import { fireEvent, render, screen } from '@testing-library/react';

import { EntityType } from '~/@/entities/types/base-entity.type';
import { testWrapper } from '~/tests/test-wrapper';

import SchoolStatusLegend from '../common/school-status-legend';

const { setNonGovLegendMode, nonGovLegendModeStore } = vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { createEvent, createStore } =
    require('effector') as typeof import('effector');
  const setMode = createEvent<'none' | 'extra' | 'only'>();
  const store = createStore<'none' | 'extra' | 'only'>('none').on(
    setMode,
    (_, mode) => mode,
  );
  return { setNonGovLegendMode: setMode, nonGovLegendModeStore: store };
});

vi.mock('~/@/country/country.model', async (importOriginal) => ({
  ...(await importOriginal<typeof import('~/@/country/country.model')>()),
  $nonGovLegendMode: nonGovLegendModeStore,
}));

const renderLegend = (shouldShowControls: boolean) =>
  render(
    testWrapper(
      <SchoolStatusLegend
        entityType={EntityType.SCHOOL}
        forceVisible
        shouldShowControls={shouldShowControls}
        statusTitle="Connectivity status"
      />,
    ),
  );

describe('SchoolStatusLegend non-gov data row', () => {
  test('engaged country: the three statuses and no non-gov row', () => {
    setNonGovLegendMode('none');
    renderLegend(true);

    expect(screen.getByText('Connected')).toBeInTheDocument();
    expect(screen.queryByText('Non-gov data')).not.toBeInTheDocument();
  });

  test('global view: non-gov data is listed after the statuses, without checkbox', () => {
    setNonGovLegendMode('extra');
    renderLegend(false);

    expect(screen.getByText('Connected')).toBeInTheDocument();
    expect(screen.getByText('Non-gov data')).toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  test('non-engaged country: only non-gov data, ticked and disabled', () => {
    setNonGovLegendMode('only');
    renderLegend(true);

    expect(screen.queryByText('Connected')).not.toBeInTheDocument();
    expect(screen.queryByText('Unknown')).not.toBeInTheDocument();
    const checkbox = screen.getByRole('checkbox', { name: 'Non-gov data' });
    expect(checkbox).toBeChecked();
    expect(checkbox).toBeDisabled();
  });

  test('focusing the row opens its tooltip', async () => {
    setNonGovLegendMode('extra');
    renderLegend(false);

    fireEvent.focus(screen.getByTestId('non-gov-legend-row'));

    expect(
      (
        await screen.findAllByText(/short description of what non-gov data is/)
      )[0],
    ).toBeInTheDocument();
  });
});
