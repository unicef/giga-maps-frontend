import { render, screen } from '@testing-library/react';
import { testWrapper } from '~/tests/test-wrapper';
import LayerSelectionFilterModalBody from '../layer-selection-filter-modal-body';
import { EntityType } from '~/@/entities';
import '~/core/i18n/instance';

describe('LayerSelectionFilterModalBody', () => {
  it('should render component', () => {
    const { asFragment } = render(
      testWrapper(
        <LayerSelectionFilterModalBody entityType={EntityType.SCHOOL} />,
      ),
    );
    expect(asFragment).toMatchSnapshot();
  });

  it('should render title', () => {
    render(<LayerSelectionFilterModalBody entityType={EntityType.SCHOOL} />);
    const title = screen.getAllByText(/Static data layer benchmark/i);
    expect(title).toBeTruthy();
  });
});
