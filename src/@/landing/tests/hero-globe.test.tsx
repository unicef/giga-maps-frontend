import { fireEvent, render, screen } from '@testing-library/react';

import { testWrapper } from '~/tests/test-wrapper';

import { HeroGlobe } from '../ui/hero-globe';

vi.mock('../ui/hero-globe-scene', () => ({
  default: ({
    onReady,
    onUnavailable,
  }: {
    onReady: () => void;
    onUnavailable: () => void;
  }) => (
    <div data-testid="globe-scene">
      <button onClick={onReady} type="button">
        Ready
      </button>
      <button onClick={onUnavailable} type="button">
        Unavailable
      </button>
    </div>
  ),
}));

describe('HeroGlobe', () => {
  it('exposes an accessible description while the scene stays decorative', async () => {
    render(testWrapper(<HeroGlobe />));

    expect(
      screen.getByRole('figure', {
        name: 'Globe showing mapped schools and their connectivity',
      }),
    ).toBeInTheDocument();
    expect(await screen.findByTestId('globe-scene')).toBeInTheDocument();
  });

  it('uses the supplied media when WebGL is unavailable', async () => {
    render(testWrapper(<HeroGlobe fallbackSrc="/fallback.png" />));

    fireEvent.click(await screen.findByRole('button', { name: 'Unavailable' }));

    expect(screen.getByRole('figure')).toContainElement(
      document.querySelector<HTMLImageElement>('img.hero-globe-fallback'),
    );
  });

  it('crossfades the poster only after the first rendered frame', async () => {
    render(testWrapper(<HeroGlobe stage={true} />));

    const figure = screen.getByRole('figure');
    expect(figure).toHaveClass('hero-globe-stage');
    expect(figure).not.toHaveClass('is-ready');

    fireEvent.click(await screen.findByRole('button', { name: 'Ready' }));

    expect(figure).toHaveClass('is-ready');
  });
});
