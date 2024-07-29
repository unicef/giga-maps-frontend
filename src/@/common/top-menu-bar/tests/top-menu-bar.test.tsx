import { fireEvent, render } from "@testing-library/react";
import TopMenuBar from "..";

describe('TopMenuBar component', () => {
  it('renders correctly with default props', () => {
    const { getByAltText, getByLabelText } = render(<TopMenuBar />);

    expect(getByAltText('Giga logo')).toBeInTheDocument();

    expect(getByLabelText('Menu')).toBeInTheDocument();
  });

  it('toggles menu state when clicked', () => {
    const mockOnClickMenu = jest.fn();
    const { getByLabelText } = render(<TopMenuBar onClickMenu={mockOnClickMenu} />);

    const button = getByLabelText('Menu')
    fireEvent.click(button)

    expect(mockOnClickMenu).toHaveBeenCalledTimes(1);
  });
});