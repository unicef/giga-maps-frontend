import { render } from '@testing-library/react';
import { testWrapper } from '~/tests/jest-wrapper';
import TourInstructionPopover from '../modal/tour-instruction-popover';

describe('Layer schools connectivity status', () => {
  it('should render component', () => {
    const { asFragment } = render(testWrapper(<TourInstructionPopover {...{}} />));
    expect(asFragment).toMatchSnapshot();
  });
});
describe('TourInstructionPopover', () => {
  it('should render with text content items', () => {
    const props = {
      totalSubStep: 3,
      title: 'Test Title',
      lastSubStep: false,
      firstSubStep: false,
      content: [
        { type: 'text', value: 'Text item 1' },
        { type: 'text', value: 'Text item 2' }
      ]
    };
    const { getAllByText } = render(testWrapper(<TourInstructionPopover {...props} />));
    expect(getAllByText(/Text item/)).toHaveLength(2);
  });

  it('should not render with clone content items', () => {
    const props = {
      totalSubStep: 3,
      title: 'Test Title',
      lastSubStep: false,
      firstSubStep: false,
      content: [
        { type: 'clone', value: '.target-item' }, {}
      ]
    };
    const { container } = render(testWrapper(<TourInstructionPopover {...props} />));
    expect(container.querySelector('.target-item')).toBeNull();
  });

  it('should handle first sub step state', () => {
    const props = {
      totalSubStep: 3,
      title: 'Test Title',
      lastSubStep: false,
      firstSubStep: true,
      content: []
    };
    const { queryByRole } = render(testWrapper(<TourInstructionPopover {...props} />));
    expect(queryByRole('button', { name: 'previous' })).not.toBeInTheDocument();
  });

  it('should handle last sub step state', () => {
    const props = {
      totalSubStep: 3,
      title: 'Test Title',
      lastSubStep: true,
      firstSubStep: false,
      content: []
    };
    const { getByRole } = render(testWrapper(<TourInstructionPopover {...props} />));
    const nextButton = getByRole('button', { name: 'Next' });
    expect(nextButton).toBeInTheDocument();
  });

  it('should render correct number of sub step dots', () => {
    const props = {
      totalSubStep: 0,
      title: 'Test Title',
      lastSubStep: false,
      firstSubStep: false,
      content: []
    };
    const { container } = render(testWrapper(<TourInstructionPopover {...props} />));
    const dots = container.querySelectorAll('.SubStepsDots');
    expect(dots).toHaveLength(0);
  });

  it('should render skip tour button', () => {
    const props = {
      totalSubStep: 3,
      title: 'Test Title',
      lastSubStep: false,
      firstSubStep: false,
      content: []
    };
    const { getByText } = render(testWrapper(<TourInstructionPopover {...props} />));
    expect(getByText('Skip tour')).toBeInTheDocument();
  });
});
