import { fireEvent, render, screen } from "@testing-library/react";
import PromptActionable from "../prompt-actionable";

describe('PromptActionable Component', () => {
  const mockOnActionDone = jest.fn();
  const mockOnActionButtonClick = jest.fn();

  const defaultProps: PromptActionableType = {
    $style: 'background-color: red;',
    title: 'Test Notification',
    subtitle: 'This is a test prompt',
    onActionDone: mockOnActionDone,
    onActionButtonClick: mockOnActionButtonClick,
  };

  it('should render the notification with title and subtitle', () => {
    render(<PromptActionable {...defaultProps} />);
    expect(screen.getByText('Test Notification')).toBeInTheDocument();
    expect(screen.getByText('This is a test prompt')).toBeInTheDocument();
  });

  it('should trigger onActionButtonClick and onActionDone when the action button is clicked', () => {
    render(<PromptActionable {...defaultProps} />);
    const actionButton = screen.getByText('Yes');
    fireEvent.click(actionButton);
    expect(mockOnActionButtonClick).toHaveBeenCalledTimes(1);
    expect(mockOnActionDone).toHaveBeenCalledTimes(1);
  });

  it('should apply custom styles if $style prop is provided', () => {
    const { container } = render(<PromptActionable {...defaultProps} />);
    const wrapper = container.querySelector('div');
    expect(wrapper).toHaveStyle('background-color: red');
  });

  // it('should render the notification with low contrast and inline', () => {
  //   render(<PromptActionable {...defaultProps} />);
  //   const notification = screen.getByRole('alert');
  //   expect(notification).toHaveClass('low-contrast');
  //   expect(notification).toHaveAttribute('inline');
  // });
});