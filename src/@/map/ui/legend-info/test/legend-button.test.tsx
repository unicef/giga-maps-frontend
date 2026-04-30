import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { $showLegend, onSelectMainLayer, onShowLegend } from '~/@/sidebar/sidebar.model';

import LegendButton from '../legend-button';

describe('LegendButton', () => {
  test('renders legend button in desktop view', () => {
    render(<LegendButton />);
    expect(document.body).toHaveTextContent('legend');
  });

  test('toggles legend visibility on button click', async () => {
    render(<LegendButton />);
    const button = document.querySelector('button[aria-label="legend"]');

    expect(button).toBeInTheDocument();

    if (!button) {
      throw new Error('Legend button is missing');
    }

    await userEvent.click(button);
    expect($showLegend.getState()).toBe(true);

    await userEvent.click(button);
    expect($showLegend.getState()).toBe(false);
  });

  test('hides legend by default on mobile', () => {
    global.innerWidth = 400;
    window.dispatchEvent(new Event('resize'));
    render(<LegendButton />);

    expect($showLegend.getState()).toBe(false);
  });

  test('shows click anywhere component on mobile when legend is visible', () => {
    global.innerWidth = 400;
    window.dispatchEvent(new Event('resize'));
    onShowLegend(true);
    render(<LegendButton />);

    const clickAnywhere = document.querySelector('.lengend-container');
    expect(clickAnywhere).toBeInTheDocument();
  });

  test('close legend on outside click during product tour', async () => {
    global.innerWidth = 1200;
    window.dispatchEvent(new Event('resize'));
    onShowLegend(true);
    render(<LegendButton />);

    await userEvent.click(document.body);
    expect($showLegend.getState()).toBe(false);
  });

  test('preserves legend open state while switching layers', async () => {
    global.innerWidth = 1200;
    window.dispatchEvent(new Event('resize'));
    onShowLegend(true);
    render(<LegendButton />);

    onSelectMainLayer(123);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect($showLegend.getState()).toBe(true);

    onShowLegend(false);
    onSelectMainLayer(456);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect($showLegend.getState()).toBe(false);
  });
});

