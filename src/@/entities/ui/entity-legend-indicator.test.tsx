import { render } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { EntityType } from '../types/base-entity.type';
import EntityLegendIndicator from './entity-legend-indicator';

const measureText = vi.fn(
  () =>
    ({
      actualBoundingBoxAscent: 70,
      actualBoundingBoxDescent: 10,
      actualBoundingBoxLeft: 5,
      actualBoundingBoxRight: 75,
      width: 80,
    }) as TextMetrics,
);

beforeAll(() => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    font: '',
    measureText,
  } as unknown as CanvasRenderingContext2D);
});

describe('EntityLegendIndicator', () => {
  it('centers the glow independently from its animation', () => {
    const { container } = render(
      <EntityLegendIndicator
        color="#00d661"
        entityType={EntityType.SCHOOL}
        glowColor="#85ffbc"
        size={14}
      />,
    );

    const indicator = container.firstElementChild;
    const glowPositioner = indicator?.querySelector('[aria-hidden="true"]');
    const glowAnimation = glowPositioner?.firstElementChild;

    expect(indicator).toHaveStyle({ height: '30px', width: '30px' });
    expect(glowPositioner).toHaveClass(
      'inset-0!',
      'items-center!',
      'justify-center!',
    );
    expect(glowAnimation).toHaveClass(
      'animate-[legend-connectivity-glow_1.2s_infinite_alternate_0.2s]',
    );
  });

  it('renders circle glyph layers around the exact same geometric center', () => {
    const { container } = render(
      <EntityLegendIndicator
        color="#00d661"
        entityType={EntityType.SCHOOL}
        glowColor="#85ffbc"
        size={14}
      />,
    );

    const glyphs = [...container.querySelectorAll('svg')];
    const circles = [...container.querySelectorAll('circle')];

    expect(glyphs).toHaveLength(2);
    glyphs.forEach((glyph) => {
      expect(glyph).toHaveAttribute('viewBox', '0 0 100 100');
    });
    expect(circles).toHaveLength(2);
    circles.forEach((circle) => {
      expect(circle).toHaveAttribute('cx', '50');
      expect(circle).toHaveAttribute('cy', '50');
    });
  });
});
