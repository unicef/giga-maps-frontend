import '~/core/i18n/instance';

import { fireEvent, render } from '@testing-library/react';

import { EntityType } from '~/@/entities';

import GigaLayerButtonIcons, {
  isLayerApplicableToCountry,
} from '../giga-layer-button-icons';

describe('Giga layer button icons', () => {
  it('filters layers using applicable countries', () => {
    expect(
      isLayerApplicableToCountry({ applicable_countries: [1, 2] }, 1),
    ).toBe(true);
    expect(
      isLayerApplicableToCountry({ applicable_countries: [1, 2] }, 3),
    ).toBe(false);
    expect(isLayerApplicableToCountry({ applicable_countries: [] }, 3)).toBe(
      true,
    );
    expect(
      isLayerApplicableToCountry({ applicable_countries: [1, 2] }, null),
    ).toBe(true);
  });

  it('should handle click events correctly', () => {
    const { getByRole } = render(
      <GigaLayerButtonIcons entityType={EntityType.SCHOOL} />,
    );
    fireEvent.click(getByRole('button', { name: 'School status' }));
  });
});
