import { describe, expect, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';

import TimeplayerButton from '../timeplayer-button';
import { fetchMockResponse } from '~/tests/fetchMock';
import { fetchLayerListFx } from '~/api/project-connect';
import { $isTimeplayer, onSelectMainLayer } from '~/@/sidebar/sidebar.model';
import "~/core/i18n/instance"
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
    const { container } = render(<TimeplayerButton />);
    expect(container.firstChild).toBeNull();
  });

  test('renders TimeplayerButton when all conditions are met', async () => {
    mapCountry.navigate({ code: 'BR' });
    await getSchoolAvailableDates({ query: "" });
    render(<TimeplayerButton />);
    expect(screen.getByText('Timeplayer')).toBeInTheDocument();

    const button = await screen.findByLabelText('Timeplayer') as HTMLElement;
    fireEvent.click(button);
    expect($isTimeplayer.getState()).toBe(true);
  });

});
