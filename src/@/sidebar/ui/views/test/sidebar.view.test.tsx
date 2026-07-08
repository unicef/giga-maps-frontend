import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { createEvent } from 'effector';

import {
  onChangeMenu,
  onSelectMainLayer,
  $layersList,
  $currentLayerTypeUtils,
  $selectedLayerId,
} from '~/@/sidebar/sidebar.model';
import { $isMobile } from '~/core/media-query';
import { mapCountry, mapOverview, mapSchools, router } from '~/core/routes';
import { testWrapper } from '~/tests/test-wrapper';

import Sidebar from '../sidebar.view';
import { fetchMockResponse } from '~/tests/fetchMock';
import '~/core/i18n/instance';
import { $country, $countryCode, $countries } from '~/@/country/country.model';
import { $globalStats } from '~/@/map/map.model';
import layersData from '~/tests/data/layers-data';
import countrySingleData from '~/tests/data/country.single.data';
import globalStatusData from '~/tests/data/globalStatus.data';
import { fetchLayerListFx } from '~/api/project-connect';
import { useRoute } from '~/lib/router';

vi.mock('~/lib/router', async () => {
  const actual = await vi.importActual('~/lib/router');
  return {
    ...actual,
    useRoute: vi.fn(),
  };
});

const setMobileView = createEvent<boolean>();
$isMobile.on(setMobileView, (_, payload) => payload);

import { SimpleBarChart } from '@carbon/charts-react';

vi.mock('@carbon/charts-react', () => ({
  SimpleBarChart: vi.fn().mockReturnValue(null),
}));

describe('Sidebar', () => {
  beforeEach(() => {
    fetchMock.mockResponse(fetchMockResponse);
    ($layersList as any).setState(layersData.results);
    ($countries as any).setState([
      { id: 144, code: 'BR', name: 'Brazil' },
    ] as any);
  });

  test('renders Sidebar and take a snapshop', () => {
    (useRoute as any).mockImplementation((route: any) => {
      if (route === mapOverview) return {};
      return null;
    });
    onChangeMenu(true);
    setMobileView(false);
    const { asFragment, container } = render(testWrapper(<Sidebar />));
    expect(asFragment()).toMatchSnapshot();
    const expandButton = container.querySelector('.sidebar__expander');
    fireEvent.click(expandButton as Element);
  });

  test('Render SchoolView', () => {
    (useRoute as any).mockImplementation((route: any) => {
      if (route === mapSchools) return {};
      return null;
    });
    onChangeMenu(false);
    router.navigate('map/schools');
    render(testWrapper(<Sidebar />));
    expect(window.location.pathname).toBe('/map/schools');
  });

  test('render GlobalAndCountryView', () => {
    (useRoute as any).mockImplementation((route: any) => {
      if (route === mapCountry) return { code: 'br' };
      return null;
    });
    onChangeMenu(false);
    router.navigate('/map/country/br');
    render(testWrapper(<Sidebar />));
    expect(window.location.pathname).toBe('/map/country/br');
  });

  test('Render in mobile view', async () => {
    (useRoute as any).mockImplementation((route: any) => {
      if (route === mapOverview) return {};
      return null;
    });
    onChangeMenu(false);
    setMobileView(true);
    const { container } = render(testWrapper(<Sidebar />));
    const sliderButton = container.querySelector('#mobile-view-slider');
    await fireEvent.click(sliderButton as Element);
    const accessibleButton = container.querySelector(
      '[data-testid="accessible-button"]',
    );
    expect(accessibleButton).toBeInTheDocument();
  });

  test('Render global view', async () => {
    (useRoute as any).mockImplementation((route: any) => {
      if (route === mapOverview) return {};
      return null;
    });
    mapOverview.navigate();
    render(testWrapper(<Sidebar />));
    await waitFor(
      () => {
        expect(
          screen.getByText(/global connectivity map for children/i),
        ).toBeInTheDocument();
      },
      { timeout: 10000 },
    );
  });

  test('Render country view', async () => {
    (useRoute as any).mockImplementation((route: any) => {
      if (route === mapCountry) return { code: 'br' };
      if (route === mapOverview) return null;
      return null;
    });

    await act(async () => {
      ($country as any).setState(countrySingleData);
      ($globalStats as any).setState(globalStatusData);
    });

    await act(async () => {
      ($countryCode as any).setState('br');
    });

    await act(async () => {
      ($selectedLayerId as any).setState(47);
    });

    await fetchLayerListFx();
    const { container } = render(testWrapper(<Sidebar />));
    await waitFor(
      () => {
        ($selectedLayerId as any).setState(47);
        expect(container.textContent).toContain('Connectivity');
      },
      { timeout: 10000 },
    );
    const filterBtn = container.querySelector('.filter-icon-button');
    fireEvent.click(filterBtn as Element);
  });
});
