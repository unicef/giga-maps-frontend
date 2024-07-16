import { render, screen } from '@testing-library/react';
import { testWrapper } from '~/tests/jest-wrapper';
import LayerSelectionFilterModalBody from '../layer-selection-filter-modal-body';
describe('LayerSelectionFilterModalBody', () => {

  it('should render component', () => {
    const { asFragment } = render(testWrapper(<LayerSelectionFilterModalBody />));
    expect(asFragment).toMatchSnapshot();
  });

  it('should render title', () => {
    render(<LayerSelectionFilterModalBody />);
    const title = screen.getAllByText(/Real-time connectivity data layer/i);
    expect(title).toBeTruthy()
  });

});
