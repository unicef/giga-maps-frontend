import { fireEvent, render } from '@testing-library/react';
import GigaLayerButtonIcons from '../giga-layer-button-icons';

describe('Giga layer button icons', () => {
  it('should handle click events correctly', () => {
    const { getByRole } = render(<GigaLayerButtonIcons />);
    fireEvent.click(getByRole('button', { name: 'School status' }));
  });
});
