import { render } from '@testing-library/react';
import { testWrapper } from '~/tests/jest-wrapper';
import TourInstructionPopover from '../modal/tour-instruction-popover';

describe('Layer schools connectivity status', () => {
  it('should render component', () => {
    const { asFragment } = render(testWrapper(<TourInstructionPopover />));
    expect(asFragment).toMatchSnapshot();
  });
});
