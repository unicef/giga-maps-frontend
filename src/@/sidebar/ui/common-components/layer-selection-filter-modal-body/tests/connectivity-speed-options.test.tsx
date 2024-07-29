import { render } from '@testing-library/react';
import { testWrapper } from '~/tests/jest-wrapper';
import { PopoverFilterContentSpeed } from '../../styles/layer-filter-modal.style';

describe('Connectivity speed options', () => {
  it('should render component', () => {
    const { asFragment } = render(testWrapper(<PopoverFilterContentSpeed />));
    expect(asFragment).toMatchSnapshot();
  });
});
