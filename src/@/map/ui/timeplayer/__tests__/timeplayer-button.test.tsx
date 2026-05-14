import { render, screen } from '@testing-library/react';
import { testWrapper } from '~/tests/test-wrapper';
import { useRoute } from '~/lib/router-effector';
import { fetchLayerListFx } from '~/api/project-connect';
import { $layersList, onSelectMainLayer, onToggleTimeplayer } from '~/@/sidebar/sidebar.model';
import { LayerTypeChoices } from '~/@/sidebar/types';
import TimeplayerButton from '../timeplayer-button';
import { fetchMockResponse } from '~/tests/fetchMock';
import { mapCountry } from '~/core/routes';
import { getSchoolAvailableDates } from '~/@/sidebar/effects/search-country-fx';

describe('TimeplayerButton', () => {
  beforeEach(() => {
    fetchMock.mockResponse(fetchMockResponse)
  });

  test('does not render when admin1 is present', async () => {
    mapCountry.navigate({ code: 'AR', path: "Admin1" });
    await fetchLayerListFx();
    await onSelectMainLayer(5);
    await getSchoolAvailableDates({ query: "" });
    render(testWrapper(<TimeplayerButton />));
    expect(screen.queryByText('Timeplayer')).not.toBeInTheDocument();
  });

  test('renders TimeplayerButton when all conditions are met', async () => {
    mapCountry.navigate({ code: 'BR' });
    $layersList.setState([{ id: 1, type: LayerTypeChoices.LIVE } as any]);
    onSelectMainLayer(1);
    await getSchoolAvailableDates({ query: "" });
    render(testWrapper(<TimeplayerButton />));
    expect(screen.getByLabelText(/timeplayer/i)).toBeInTheDocument();
  });
});
