import { fireEvent, render } from '@testing-library/react';
import { testWrapper } from '~/tests/jest-wrapper';
import LayerSelectionFilterModal from '../layer-selection-filter-modal';

describe('Layer selection filter modal', () => {
  it('should render component', () => {
    const setOpen = jest.fn();
    const { asFragment } = render(testWrapper(<LayerSelectionFilterModal open={true} setOpen={setOpen} />));
    expect(asFragment).toMatchSnapshot();
  });
});
describe('Layer selection filter modal', () => {
  const mockSetOpen = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should close modal when clicking close button in header', () => {
    const { getByRole } = render(testWrapper(<LayerSelectionFilterModal open={true} setOpen={mockSetOpen} />));
    const closeButton = getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });

  it('should close modal and apply filters when clicking apply button', () => {
    const { getByText } = render(testWrapper(<LayerSelectionFilterModal open={true} setOpen={mockSetOpen} />));
    const applyButton = getByText('Apply');
    fireEvent.click(applyButton);
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });

  it('should close modal when clicking reset button', () => {
    const { getByText } = render(testWrapper(<LayerSelectionFilterModal open={true} setOpen={mockSetOpen} />));
    const resetButton = getByText('Reset');
    fireEvent.click(resetButton);
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });

  it('should not render modal body when open is false', () => {
    const { container } = render(testWrapper(<LayerSelectionFilterModal open={false} setOpen={mockSetOpen} />));
    expect(container.querySelector('.layer-selection-filter-body-scroll')).toBeTruthy();
    expect(container.querySelector('LayerSelectionFilterModalBody')).toBeFalsy();
  });
});
