import { render } from '@testing-library/react';

import { testWrapper } from '~/tests/test-wrapper';

import { HeroSkeleton } from '../ui/hero-skeleton';

describe('HeroSkeleton', () => {
  it('fills the hero slot so the page is not blank while the CMS responds', () => {
    const { container } = render(testWrapper(<HeroSkeleton />));
    const section = container.querySelector('[data-slot="hero-skeleton"]');

    expect(section).not.toBeNull();
    expect(
      container.querySelectorAll('[data-slot="skeleton"]').length,
    ).toBeGreaterThan(5);
  });

  it('is hidden from assistive tech, being pure decoration', () => {
    const { container } = render(testWrapper(<HeroSkeleton />));

    expect(
      container
        .querySelector('[data-slot="hero-skeleton"]')
        ?.getAttribute('aria-hidden'),
    ).toBe('true');
  });
});
