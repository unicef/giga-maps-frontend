import { fireEvent, render, screen } from "@testing-library/react";
import SearchToolbar from "../search-toolbar";

describe('SearchToolbar Component', () => {
  it('should update the input value on change', () => {
    const mockOnSearchChange = jest.fn();
    render(<SearchToolbar onSearchChange={mockOnSearchChange} />);
    const searchInput = screen.getByRole('searchbox');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    expect(searchInput).toHaveValue('test');
  });
});