import { describe, expect, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LegendButton from '../legend-button';
import { $showLegend, onShowLegend } from '~/@/sidebar/sidebar.model';

describe('LegendButton', () => {
  test('renders legend button in desktop view', () => {
    render(<LegendButton />);
    expect(screen.getByText('legend')).toBeInTheDocument();
  });

  test('toggles legend visibility on button click', async () => {
    render(<LegendButton />);
    const button = screen.getByText('legend');
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
});
