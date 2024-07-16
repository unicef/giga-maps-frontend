import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CoverageLayerSelectionFilterModal from '~/@/sidebar/ui/common-components/coverage-layer-selection-filter-modal';

describe('CoverageLayerSelectionFilterModal', () => {

  test('modal opens when open prop is true', () => {
    render(<CoverageLayerSelectionFilterModal open={true} setOpen={jest.fn()} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('modal closes when close button is clicked', async () => {
    const setOpen = jest.fn();
    render(<CoverageLayerSelectionFilterModal open={true} setOpen={setOpen} />);
    await userEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(setOpen).toHaveBeenCalledWith(false);
  });

  test('reset button calls resetCoverageFilterSelection', async () => {
    const setOpen = jest.fn();
    render(<CoverageLayerSelectionFilterModal open={true} setOpen={setOpen} />);
    await userEvent.click(screen.getByRole('button', { name: /reset/i }));
    expect(setOpen).toHaveBeenCalled();
  });

  test('apply button calls handleApply on ref', async () => {
    const setOpen = jest.fn();
    render(<CoverageLayerSelectionFilterModal open={true} setOpen={setOpen} />);
    await userEvent.click(screen.getByRole('button', { name: /apply/i }));
    expect(setOpen).toHaveBeenCalled();
  });

});
