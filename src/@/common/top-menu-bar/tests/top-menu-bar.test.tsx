import { fireEvent, render } from "@testing-library/react";
import { testWrapper } from "~/tests/test-wrapper";
import TopMenuBar from "..";

describe('TopMenuBar component', () => {
  it('renders correctly with default props', () => {
    const { getByAltText, getByLabelText } = render(testWrapper(<TopMenuBar />));

    expect(getByAltText('Atlas')).toBeInTheDocument();

    expect(getByLabelText('Menu')).toBeInTheDocument();
  });

  it('toggles menu state when clicked', () => {
    const mockOnClickMenu = vi.fn();
    const { getByLabelText } = render(testWrapper(<TopMenuBar onClickMenu={mockOnClickMenu} />));

    const button = getByLabelText('Menu')
    fireEvent.click(button)

    expect(mockOnClickMenu).toHaveBeenCalledTimes(1);
  });
});
