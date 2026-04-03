import { describe, test, } from '@jest/globals';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { createEvent } from 'effector';

import { onChangeMenu, onSelectMainLayer } from '~/@/sidebar/sidebar.model';
import { $isMobile } from '~/core/media-query';
import { mapCountry, mapOverview, router } from '~/core/routes';
import { testWrapper } from '~/tests/jest-wrapper';

import Sidebar from '../sidebar.view';
import { fetchMockResponse } from '~/tests/fetchMock';
import "~/core/i18n/instance"
import { fetchCountryLiveLayerInfo, fetchLayerListFx } from '~/api/project-connect';

const setMobileView = createEvent<boolean>()
$isMobile.on(setMobileView, (_, payload) => payload)

import { SimpleBarChart } from "@carbon/charts-react";

jest.mock('@carbon/charts-react', () => ({
  SimpleBarChart: jest.fn().mockReturnValue(null),
}));

describe('Sidebar', () => {

  beforeEach(() => {
    fetchMock.mockResponse(fetchMockResponse);
  })

  test('renders Sidebar and take a snapshop', () => {
    onChangeMenu(true)
    setMobileView(false)
    const { asFragment, container } = render(
      testWrapper(<Sidebar />)
    );
    expect(asFragment()).toMatchSnapshot();
    const expandButton = container.querySelector('.sidebar__expander')
    fireEvent.click(expandButton as Element)
  });

  test("Render SchoolView", () => {
    onChangeMenu(false)
    router.navigate('map/schools');
    render(testWrapper(<Sidebar />))
    expect(window.location.pathname).toBe('/map/schools')
  })

  test("render GlobalAndCountryView", () => {
    onChangeMenu(false)
    router.navigate('/map/country/br');
    render(testWrapper(<Sidebar />))
    expect(window.location.pathname).toBe('/map/country/br')
  })

  test('open tour pop up', async () => {
    router.navigate('/map');
    const { getByTestId } = render(testWrapper(<Sidebar />))
    const tourButton = getByTestId('tour-button')
    await fireEvent.click(tourButton)
    expect(window.location.search).toBe('?popover=tour');
  })

  test("Render in mobile view", async () => {
    onChangeMenu(false)
    setMobileView(true)
    const { container } = render(testWrapper(<Sidebar />))
    const sliderButton = container.querySelector('#mobile-view-slider')
    await fireEvent.click(sliderButton as Element)
    const tourButton = container.querySelector('#tour-button')
    expect(tourButton).toBeNull();
  })

  test("Render global view", async () => {
    mapOverview.navigate();
    render(testWrapper(<Sidebar />))
    expect(screen.getByText('Global School connectivity map')).toBeInTheDocument();
  })

  test("Render country view", async () => {
    mapCountry.navigate({ code: 'br' });
    await fetchLayerListFx();
    onSelectMainLayer(9)
    await fetchCountryLiveLayerInfo({ query: '?start_date=2022-09-01&end_date=2022-09-30', id: 9 });
    const { container } = render(testWrapper(<Sidebar />))
    expect(screen.getByText('schools with real-time connectivity data', { exact: false })).toBeInTheDocument();
    const filterBtn = container.querySelector('.filter-icon-button');
    fireEvent.click(filterBtn as Element);
    // expect(screen.getByText('Real-time connectivity data layer', { exact: false })).toBeInTheDocument();
    // const radioRTO = container.querySelector('#Round Trip Time - RTT19');
    // fireEvent.click(radioRTO as Element);
    // const applyBtn = screen.findByText('Apply');
    // fireEvent.click(applyBtn as Element);
  })

})