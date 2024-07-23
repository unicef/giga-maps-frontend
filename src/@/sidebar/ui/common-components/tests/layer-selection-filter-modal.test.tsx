import { render } from '@testing-library/react';
import { testWrapper } from '~/tests/jest-wrapper';
import LayerSelectionFilterModal from '../layer-selection-filter-modal';

describe('Layer selection filter modal', () => {
  it('should render component', () => {
    const setOpen = jest.fn();
    const { asFragment } = render(testWrapper(<LayerSelectionFilterModal open={true} setOpen={setOpen} />));
    expect(asFragment).toMatchSnapshot();
  });
});
