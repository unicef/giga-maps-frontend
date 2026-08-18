import '~/core/i18n/instance';
import '@/sidebar/init';

import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  $showAccessibility,
  $showAdvancedFilter,
  $showLegend,
  $showThemeLayer,
  onShowAccessibility,
  onShowAdvancedFilter,
  onShowLegend,
  onShowThemeLayer,
} from '~/@/sidebar/sidebar.model';
import { $theme, setTheme, ThemeType } from '~/core/theme.model';
import { testWrapper } from '~/tests/test-wrapper';

import { AccessibilityButton } from '../accessibility-button';

describe('AccessibilityButton', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        disconnect() {}

        observe() {}

        unobserve() {}
      },
    );
    setTheme(ThemeType.dark);
    onShowAdvancedFilter(false);
    onShowThemeLayer(false);
    onShowAccessibility(false);
    onShowLegend(false);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    setTheme(ThemeType.dark);
  });

  test('opens and closes the accessibility controls from the trigger', async () => {
    const user = userEvent.setup();
    onShowAdvancedFilter(false);
    onShowThemeLayer(false);
    onShowLegend(true);

    render(testWrapper(<AccessibilityButton />));

    await user.click(screen.getByTestId('accessible-button'));

    expect($theme.getState()).toBe(ThemeType.dark);
    expect($showAccessibility.getState()).toBe(true);
    expect($showAdvancedFilter.getState()).toBe(false);
    expect($showLegend.getState()).toBe(false);
    expect($showThemeLayer.getState()).toBe(false);
    expect(screen.getByText('Off')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Increase interface contrast and use a colour-blind friendly colour palette across the map and related content.',
      ),
    ).toBeInTheDocument();

    await user.click(screen.getByTestId('accessible-button'));

    expect($showAccessibility.getState()).toBe(false);
    expect($showLegend.getState()).toBe(true);
    expect(
      screen.queryByText(
        'Increase interface contrast and use a colour-blind friendly colour palette across the map and related content.',
      ),
    ).not.toBeInTheDocument();
  });

  test('closes on a true outside click and reopens the legend', async () => {
    const user = userEvent.setup();

    render(
      testWrapper(
        <div>
          <button data-testid="outside" type="button">
            Outside
          </button>
          <AccessibilityButton />
        </div>,
      ),
    );

    await user.click(screen.getByTestId('accessible-button'));

    expect($showAccessibility.getState()).toBe(true);
    expect($showLegend.getState()).toBe(false);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    await user.click(screen.getByTestId('outside'));

    await waitFor(() => {
      expect($showAccessibility.getState()).toBe(false);
      expect($showLegend.getState()).toBe(true);
    });
  });

  test('keeps the legend closed when switching to theme layers', async () => {
    const user = userEvent.setup();

    render(testWrapper(<AccessibilityButton />));

    await user.click(screen.getByTestId('accessible-button'));
    act(() => onShowThemeLayer(true));

    expect($showAccessibility.getState()).toBe(false);
    expect($showThemeLayer.getState()).toBe(true);
    expect($showLegend.getState()).toBe(false);

    act(() => onShowThemeLayer(false));

    expect($showLegend.getState()).toBe(true);
  });
});
