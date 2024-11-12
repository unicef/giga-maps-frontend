import { describe, test, } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import { createEvent } from 'effector';

import { onChangeMenu } from '~/@/sidebar/sidebar.model';
import { $isMobile } from '~/core/media-query';
import { router } from '~/core/routes';
import { testWrapper } from '~/tests/jest-wrapper';

import Sidebar from '../sidebar.view';
import layers from '~/tests/data/layers-data';
import globalStatusData from '~/tests/data/globalStatus.data';
import { fetchMockResponse } from '~/tests/fetchMock';


const setMobileView = createEvent<boolean>()
$isMobile.on(setMobileView, (_, payload) => payload)

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
    const { container, getByTestId } = render(testWrapper(<Sidebar />))
    const sliderButton = container.querySelector('#mobile-view-slider')
    await fireEvent.click(sliderButton as Element)
    const tourButton = container.querySelector('#tour-button')
    expect(tourButton).toBeNull();
  })

})