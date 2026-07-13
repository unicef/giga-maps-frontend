import { fireEvent, render } from '@testing-library/react';
import { EntityType } from '~/@/entities';
import GigaLayerButtonIcons from '../giga-layer-button-icons';
import '~/core/i18n/instance';

describe('Giga layer button icons', () => {
  it('should handle click events correctly', () => {
    const { getByRole } = render(
      <GigaLayerButtonIcons entityType={EntityType.SCHOOL} />,
    );
    fireEvent.click(getByRole('button', { name: 'School status' }));
  });
});
