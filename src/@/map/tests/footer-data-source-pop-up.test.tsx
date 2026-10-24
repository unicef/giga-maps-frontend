import '~/core/i18n/instance';

import { fireEvent, render, screen } from '@testing-library/react';

import { EntityType } from '~/@/entities';

import FooterDataSourcePopUp from '../ui/footer-data-source-pop-up';

vi.mock('~/@/sidebar/sidebar.model', async () => {
  const { createStore } = await import('effector');
  return {
    // `combine` stores in the real model can't be seeded through `fork`.
    $currentLayerCountryDataSource: createStore({
      school: {
        name: 'Fiji Ministry of Health, 2026, Giga Meter, OpenStreetMap (openstreetmap.org)',
        description:
          'Sourced from the ministry.\n\nData shared under a CC BY 4.0 license.;;',
      },
    }),
    $currentLayerTypeUtilsByEntity: createStore({}),
  };
});

vi.mock('~/@/country/country.model', async () => {
  const { createStore } = await import('effector');
  return {
    $dataSourceByEntity: createStore({
      school: 'Fiji OpenStreetMap',
      health: 'Fiji health master list',
    }),
    $dataSourceDescriptionByEntity: createStore({
      school:
        'Sourced from [OpenStreetMap](https://www.openstreetmap.org).\n\nPlease [contact us](mailto:gigamaps@unicef.org).',
      health: '',
    }),
  };
});

const renderDataSource = () =>
  render(
    <FooterDataSourcePopUp entityType={EntityType.SCHOOL} isFooter={false} />,
  );

describe('FooterDataSourcePopUp', () => {
  test('a source without description or link is plain text', () => {
    renderDataSource();
    expect(screen.queryByRole('button', { name: 'Giga Meter' })).toBeNull();
    expect(screen.getByText(/Giga Meter/)).toBeInTheDocument();
  });

  test('a source with description opens a disclaimer popup', () => {
    renderDataSource();
    fireEvent.click(
      screen.getByRole('button', { name: 'Fiji Ministry of Health, 2026' }),
    );
    expect(
      screen.getByText(/Data shared under a CC BY 4.0 license/),
    ).toBeInTheDocument();
    expect(screen.queryByRole('link')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Close notification' }));
    expect(screen.queryByText(/Sourced from the ministry/)).toBeNull();
  });

  test('a source with a link shows it in the popup instead of navigating', () => {
    const open = vi.spyOn(window, 'open');
    renderDataSource();
    fireEvent.click(screen.getByRole('button', { name: 'OpenStreetMap' }));

    expect(open).not.toHaveBeenCalled();
    const link = screen.getByRole('link', { name: /View data source/ });
    expect(link).toHaveAttribute('href', 'https://openstreetmap.org');
    expect(link).toHaveAttribute('target', '_blank');
  });

  test('the info button opens the entity data source disclaimer with links', () => {
    renderDataSource();
    fireEvent.click(
      screen.getByRole('button', { name: 'About this data source' }),
    );

    expect(screen.getByText('Fiji OpenStreetMap')).toBeInTheDocument();
    const osm = screen.getByRole('link', { name: 'OpenStreetMap' });
    expect(osm).toHaveAttribute('href', 'https://www.openstreetmap.org');
    expect(osm).toHaveAttribute('target', '_blank');
    const contact = screen.getByRole('link', { name: 'contact us' });
    expect(contact).toHaveAttribute('href', 'mailto:gigamaps@unicef.org');
    expect(contact).not.toHaveAttribute('target');
  });

  test('without an entity description there is no info button', () => {
    render(
      <FooterDataSourcePopUp
        entityType={EntityType.HEALTH}
        isFooter={false}
        showOldDataSource
      />,
    );
    expect(screen.getByText('Fiji health master list')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'About this data source' }),
    ).toBeNull();
  });
});
