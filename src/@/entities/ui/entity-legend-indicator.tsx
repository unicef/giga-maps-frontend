import { useStore } from 'effector-react';
import type { CSSProperties } from 'react';

import { $entityConfigMap } from '~/@/entities/models/entity.model';
import { cn } from '~/lib/cn';

type EntityLegendIndicatorProps = {
  className?: string;
  color: string;
  entityType: string;
  fitToViewBox?: boolean;
  glowColor?: string;
  size?: number;
};

type GlyphMetrics = {
  boundsHeight: number;
  boundsWidth: number;
  boundsX: number;
  boundsY: number;
  x: number;
  y: number;
};

const FALLBACK_FONT_FAMILY = '"Open Sans", sans-serif';
const glyphMetricsCache = new Map<string, GlyphMetrics>();

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

  const canvas = document.createElement('canvas');
  measurementContext =
    canvas && typeof canvas.getContext === 'function'
      ? canvas.getContext('2d')
      : null;

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

const getGlyphMetrics = (symbol: string, glyphSize: number): GlyphMetrics => {
  const context = getMeasurementContext();
  const fontFamily = getMeasurementFontFamily();
  const cacheKey = `${fontFamily}:${glyphSize}:${symbol}`;
  const cachedMetrics = glyphMetricsCache.get(cacheKey);

  if (cachedMetrics) {
    return cachedMetrics;
  }

  if (!context) {
    const fallbackMetrics = {
      boundsHeight: glyphSize,
      boundsWidth: glyphSize,
      boundsX: 0,
      boundsY: 0,
      x: 0,
      y: 0,
    };
    glyphMetricsCache.set(cacheKey, fallbackMetrics);
    return fallbackMetrics;
  }

  context.font = `${glyphSize}px ${fontFamily}`;

  const metrics = context.measureText(symbol);
  const left = metrics.actualBoundingBoxLeft || 0;
  const right = metrics.actualBoundingBoxRight || metrics.width || glyphSize;
  const ascent = metrics.actualBoundingBoxAscent || glyphSize;
  const descent = metrics.actualBoundingBoxDescent || 0;
  const boundsWidth = Math.max(left + right, 1);
  const boundsHeight = Math.max(ascent + descent, 1);
  const glyphMetrics = {
    boundsHeight,
    boundsWidth,
    boundsX: -left,
    boundsY: -ascent,
    x: (left - right) / 2,
    y: (ascent - descent) / 2,
  };

  glyphMetricsCache.set(cacheKey, glyphMetrics);

  return glyphMetrics;
};

const EntityLegendIndicator = ({
  className,
  color,
  entityType,
  fitToViewBox = false,
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
    const fontFamily = getMeasurementFontFamily();

    if (fitToViewBox) {
      const baseMetrics = getGlyphMetrics(symbol, glyphSize);
      const targetScale = glyphSize / Math.max(baseMetrics.boundsWidth, baseMetrics.boundsHeight);
      const fittedFontSize = glyphSize * targetScale;
      const glyphMetrics = getGlyphMetrics(symbol, fittedFontSize);
      const centerX = glyphMetrics.boundsX + (glyphMetrics.boundsWidth / 2);
      const centerY = glyphMetrics.boundsY + (glyphMetrics.boundsHeight / 2);

      return (
        <svg
          className={cn('block! shrink-0! overflow-visible!', extraClass)}
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
            fontSize={fittedFontSize}
            textAnchor="start"
            x={(glyphSize / 2) - centerX}
            y={(glyphSize / 2) - centerY}
          >
            {symbol}
          </text>
        </svg>
      );
    }

    const glyphMetrics = getGlyphMetrics(symbol, glyphSize);

    return (
      <svg
        className={cn('block! shrink-0! overflow-visible!', extraClass)}
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
          x={(glyphSize / 2) + glyphMetrics.x}
          y={(glyphSize / 2) + glyphMetrics.y}
        >
          {symbol}
        </text>
      </svg>
    );
  };

  return (
    <span
      className={cn('relative! inline-flex! shrink-0! items-center! justify-center! overflow-visible! ml-[-4px]!', className)}
      style={containerStyle}
    >
      {glowColor ? (
        <span
          aria-hidden="true"
          className="absolute! left-1/2! top-1/2! z-0! pointer-events-none! animate-[legend-connectivity-glow_1.2s_infinite_alternate_0.2s]"
        >
          {renderGlyph(outerSize, glowColor)}
        </span>
      ) : null}
      <span className="relative! z-1! inline-flex! items-center! justify-center!">
        {renderGlyph(size, color)}
      </span>
    </span>
  );
};

export default EntityLegendIndicator;
