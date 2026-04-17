import { useStore } from 'effector-react';
import type { CSSProperties } from 'react';

import { $entityConfigMap } from '~/@/entities/models/entity.model';
import { cn } from '~/lib/cn';

type EntityLegendIndicatorProps = {
  className?: string;
  color: string;
  entityType: string;
  glowColor?: string;
  size?: number;
};

type GlyphOffset = {
  x: number;
  y: number;
};

const FALLBACK_FONT_FAMILY = '"Open Sans", sans-serif';
const glyphOffsetCache = new Map<string, GlyphOffset>();

let measurementContext: CanvasRenderingContext2D | null | undefined;
let measurementFontFamily: string | undefined;

const getMeasurementContext = () => {
  if (measurementContext !== undefined) {
    return measurementContext;
  }

  if (typeof document === 'undefined') {
    measurementContext = null;
    return measurementContext;
  }

  measurementContext = document.createElement('canvas').getContext('2d');

  return measurementContext;
};

const getMeasurementFontFamily = () => {
  if (measurementFontFamily) {
    return measurementFontFamily;
  }

  if (typeof window === 'undefined' || typeof document === 'undefined' || !document.body) {
    measurementFontFamily = FALLBACK_FONT_FAMILY;
    return measurementFontFamily;
  }

  measurementFontFamily = window.getComputedStyle(document.body).fontFamily || FALLBACK_FONT_FAMILY;

  return measurementFontFamily;
};

const getGlyphOffset = (symbol: string, glyphSize: number): GlyphOffset => {
  const context = getMeasurementContext();
  const fontFamily = getMeasurementFontFamily();
  const cacheKey = `${fontFamily}:${glyphSize}:${symbol}`;
  const cachedOffset = glyphOffsetCache.get(cacheKey);

  if (cachedOffset) {
    return cachedOffset;
  }

  if (!context) {
    const fallbackOffset = { x: 0, y: 0 };
    glyphOffsetCache.set(cacheKey, fallbackOffset);
    return fallbackOffset;
  }

  context.font = `${glyphSize}px ${fontFamily}`;

  const metrics = context.measureText(symbol);
  const glyphOffset = {
    x: (metrics.actualBoundingBoxLeft - metrics.actualBoundingBoxRight) / 2,
    y: (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2,
  };

  glyphOffsetCache.set(cacheKey, glyphOffset);

  return glyphOffset;
};

const EntityLegendIndicator = ({
  className,
  color,
  entityType,
  glowColor,
  size = 16,
}: EntityLegendIndicatorProps) => {
  const entityConfigMap = useStore($entityConfigMap);
  const config = entityConfigMap[entityType];
  const symbol = config?.symbol ?? '●';

  const outerSize = glowColor ? size + 16 : size;
  const containerSize = glowColor ? outerSize : size;

  const containerStyle = {
    height: `${containerSize}px`,
    width: `${containerSize}px`,
  } as CSSProperties;

  const renderGlyph = (glyphSize: number, glyphColor: string, extraClass: string = '') => {
    const glyphOffset = getGlyphOffset(symbol, glyphSize);
    const fontFamily = getMeasurementFontFamily();

    return (
      <svg
        className={cn('!block !shrink-0 !overflow-visible', extraClass)}
        focusable="false"
        style={{
          height: `${glyphSize}px`,
          width: `${glyphSize}px`,
        }}
        viewBox={`0 0 ${glyphSize} ${glyphSize}`}
      >
        <text
          fill={glyphColor}
          fontFamily={fontFamily}
          fontSize={glyphSize}
          textAnchor="start"
          x={(glyphSize / 2) + glyphOffset.x}
          y={(glyphSize / 2) + glyphOffset.y}
        >
          {symbol}
        </text>
      </svg>
    );
  };

  return (
    <span
      className={cn('!relative !inline-flex !shrink-0 !items-center !justify-center !overflow-visible', className)}
      style={containerStyle}
    >
      {glowColor ? (
        <span
          aria-hidden="true"
          className="!absolute !left-1/2 !top-1/2 !z-0 !pointer-events-none ![animation:legend-connectivity-glow_1.2s_infinite_alternate_0.2s]"
        >
          {renderGlyph(outerSize, glowColor)}
        </span>
      ) : null}
      <span className="!relative !z-[1] !inline-flex !items-center !justify-center">
        {renderGlyph(size, color)}
      </span>
    </span>
  );
};

export default EntityLegendIndicator;
