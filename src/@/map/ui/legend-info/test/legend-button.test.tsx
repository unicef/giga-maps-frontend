import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { allSettled, fork } from 'effector';
import userEvent from '@testing-library/user-event';

import { changeCountryCode } from '~/@/country/country.model';
import {
  $showAdvancedFilter,
  $showLegend,
  $showThemeLayer,
  onSelectMainLayer,
  onShowAdvancedFilter,
  onShowLegend,
  onShowThemeLayer,
} from '~/@/sidebar/sidebar.model';

import LegendButton from '../legend-button';
import { $isMobile } from '~/core/media-query';
import { testWrapper } from '~/tests/test-wrapper';
import '~/core/i18n/instance';
import '@/sidebar/init';

describe('LegendButton', () => {
  beforeEach(() => {
    onShowLegend(false);
  });

  test('renders legend button in desktop view', () => {
    render(testWrapper(<LegendButton />));
    expect(screen.getByLabelText(/legend/i)).toBeInTheDocument();
  });

  test('toggles legend visibility on button click', async () => {
    const { container } = render(testWrapper(<LegendButton />));
    const button = container.querySelector('button[aria-label="Legend"]');

    expect(button).toBeInTheDocument();

    if (!button) {
      throw new Error('Legend button is missing');
    }

    await act(async () => {
      fireEvent.click(button);
    });
    expect($showLegend.getState()).toBe(true);

    await act(async () => {
      fireEvent.click(button);
    });
    expect($showLegend.getState()).toBe(false);
  });

  test('hides legend by default on mobile', () => {
    global.innerWidth = 400;
    window.dispatchEvent(new Event('resize'));
    render(testWrapper(<LegendButton />));

    expect($showLegend.getState()).toBe(false);
  });

  test('shows click anywhere component on mobile when legend is visible', () => {
    global.innerWidth = 400;
    window.dispatchEvent(new Event('resize'));
    onShowLegend(true);
    render(testWrapper(<LegendButton />));

    const clickAnywhere = document.querySelector('.legend-container');
    expect(clickAnywhere).toBeInTheDocument();
  });

  test('keeps legend open on outside click on desktop', async () => {
    global.innerWidth = 1200;
    window.dispatchEvent(new Event('resize'));
    onShowLegend(true);
    const { getByTestId } = render(testWrapper(
      <div>
        <div data-testid="outside">Outside</div>
        <LegendButton />
      </div>
    ));

    await act(async () => {
      await userEvent.click(getByTestId('outside'));
    });

    await waitFor(() => {
      expect($showLegend.getState()).toBe(true);
    });
  });

  test('preserves legend open state while switching layers', async () => {
    global.innerWidth = 1200;
    window.dispatchEvent(new Event('resize'));
    onShowLegend(true);
    render(testWrapper(<LegendButton />));

    onSelectMainLayer(123);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect($showLegend.getState()).toBe(true);

    onShowLegend(false);
    onSelectMainLayer(456);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect($showLegend.getState()).toBe(false);
  });

  test('reopens legend when filter or theme layer closes', () => {
    onShowLegend(true);
    onShowAdvancedFilter(true);
    expect($showLegend.getState()).toBe(false);

    onShowAdvancedFilter(false);
    expect($showLegend.getState()).toBe(true);

    onShowThemeLayer(true);
    expect($showLegend.getState()).toBe(false);

    onShowThemeLayer(false);
    expect($showLegend.getState()).toBe(true);
  });

  test('keeps legend closed while switching from theme layer to filter', () => {
    onShowLegend(true);
    onShowThemeLayer(true);

    expect($showLegend.getState()).toBe(false);
    expect($showThemeLayer.getState()).toBe(true);

    onShowAdvancedFilter(true);

    expect($showAdvancedFilter.getState()).toBe(true);
    expect($showThemeLayer.getState()).toBe(false);
    expect($showLegend.getState()).toBe(false);
  });

  test('reopens legend on desktop after a country change', () => {
    onShowLegend(false);
    expect($showLegend.getState()).toBe(false);

    changeCountryCode('af');

    expect($showLegend.getState()).toBe(true);
  });

  test('preserves the last legend state on mobile after a country change', async () => {
    const closedScope = fork({
      values: new Map()
        .set($isMobile, true)
        .set($showLegend, false),
    });
    await allSettled(changeCountryCode, {
      scope: closedScope,
      params: 'br',
    });
    expect(closedScope.getState($showLegend)).toBe(false);

    const openScope = fork({
      values: new Map()
        .set($isMobile, true)
        .set($showLegend, true),
    });
    await allSettled(changeCountryCode, {
      scope: openScope,
      params: 'ke',
    });
    expect(openScope.getState($showLegend)).toBe(true);
  });
});
