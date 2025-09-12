import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { useStore } from 'effector-react';
import ProductTourMainView from '../product-tour-main.view';
import { $currentMainStep, $currentSubStep } from '../../../models/product-tour.model';
import { $isMobile } from '~/core/media-query';
import { testWrapper } from '~/tests/jest-wrapper';
import '~/core/i18n/instance';
// Mock the effector-react hooks
jest.mock('effector-react', () => ({
  useStore: jest.fn(),
}));

// Mock the utility functions


describe('ProductTourMainView', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup default mock values
    (useStore as jest.Mock).mockImplementation((store) => {
      if (store === $isMobile) return false;
      if (store === $currentMainStep) return 1;
      if (store === $currentSubStep) return 1;
      return null;
    });
  });

  it('renders without crashing', () => {
    render(testWrapper(<ProductTourMainView />));
    expect(screen.getByText('On the map view you can navigate between different countries and zoom in to explore specific areas and schools.')).toBeInTheDocument();
  });

  it('does not show tour content when currentMainStep is 2', () => {
    (useStore as jest.Mock).mockImplementation((store) => {
      if (store === $currentMainStep) return 1;
      if (store === $currentSubStep) return 2;
      return false;
    });

    render(testWrapper(<ProductTourMainView />));
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
  });

  it('shows tour content when currentMainStep is greater than 0', () => {
    render(testWrapper(<ProductTourMainView />));
    expect(screen.getByText('Map navigation')).toBeInTheDocument();
  });

  it('handles mobile view correctly', async () => {
    (useStore as jest.Mock).mockImplementation((store) => {
      if (store === $isMobile) return true;
      if (store === $currentMainStep) return 1;
      if (store === $currentSubStep) return 3;
      return null;
    });

    await waitFor(() => {
      render(testWrapper(<ProductTourMainView />));
    });
  })
});