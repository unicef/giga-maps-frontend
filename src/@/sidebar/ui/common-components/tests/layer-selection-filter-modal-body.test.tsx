import { render, screen } from '@testing-library/react';
import { testWrapper } from '~/tests/jest-wrapper';
import LayerSelectionFilterModalBody from '../layer-selection-filter-modal-body';
import "~/core/i18n/instance"

describe('LayerSelectionFilterModalBody', () => {

  it('should render component', () => {
    const { asFragment } = render(testWrapper(<LayerSelectionFilterModalBody />));
    expect(asFragment).toMatchSnapshot();
  });

  it('should render title', () => {
    render(<LayerSelectionFilterModalBody />);
    const title = screen.getAllByText(/Static data layer benchmark/i);
    expect(title).toBeTruthy()
  });

});
