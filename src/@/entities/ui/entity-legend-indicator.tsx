import { useStore } from 'effector-react';
import { type CSSProperties, useEffect, useReducer } from 'react';

import { $entityConfigMap } from '~/@/entities/models/entity.model';
import { cn } from '~/lib/cn';

type EntityLegendIndicatorProps = {
  borderOnly?: boolean;
  className?: string;
  color: string;
  dataTitle?: string;
  dataTitlePos?: 'center' | 'right' | 'left';
  entityType: string;
  fitToViewBox?: boolean;
  glowColor?: string;
  size?: number;
  strokeWidth?: number;
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
const GLYPH_REFERENCE_SIZE = 100;
const CIRCLE_SYMBOL = '●';
const SQUARE_SYMBOL = '■';
const glyphMetricsCache = new Map<string, GlyphMetrics>();

let measurementContext: CanvasRenderingContext2D | null | undefined;
let measurementFontFamily: string | undefined;

const resetGlyphMetrics = () => {
  glyphMetricsCache.clear();
  measurementFontFamily = undefined;
};

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

  if (
    typeof window === 'undefined' ||
    typeof document === 'undefined' ||
    !document.body
  ) {
    measurementFontFamily = FALLBACK_FONT_FAMILY;
    return measurementFontFamily;
  }

  measurementFontFamily =
    window.getComputedStyle(document.body).fontFamily || FALLBACK_FONT_FAMILY;

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
  borderOnly = false,
  className,
  color,
  dataTitle,
  dataTitlePos,
  entityType,
  fitToViewBox = false,
  glowColor,
  size = 16,
  strokeWidth: strokeWidthProp,
}: EntityLegendIndicatorProps) => {
  const [, refreshGlyphMetrics] = useReducer(
    (revision: number) => revision + 1,
    0,
  );
  const entityConfigMap = useStore($entityConfigMap);
  const config = entityConfigMap[entityType];
  const symbol = config?.symbol ?? CIRCLE_SYMBOL;

  useEffect(() => {
    if (typeof document === 'undefined' || !document.fonts) return undefined;

    let isMounted = true;
    const handleFontsLoaded = () => {
      if (!isMounted) return;

      resetGlyphMetrics();
      refreshGlyphMetrics();
    };

    void document.fonts.ready.then(handleFontsLoaded);
    document.fonts.addEventListener('loadingdone', handleFontsLoaded);

    return () => {
      isMounted = false;
      document.fonts.removeEventListener('loadingdone', handleFontsLoaded);
    };
  }, []);

  const outerSize = glowColor ? size + 16 : size;
  const containerSize = glowColor ? outerSize : size;

  const containerStyle = {
    height: `${containerSize}px`,
    width: `${containerSize}px`,
  } as CSSProperties;

  const renderGlyph = (
    glyphSize: number,
    glyphColor: string,
    extraClass: string = '',
  ) => {
    const fontFamily = getMeasurementFontFamily();
    const effectiveStrokeWidth =
      strokeWidthProp ??
      (borderOnly ? 0.75 : Math.min(2, Math.max(1, glyphSize * 0.1)));
    const glyphMetrics = getGlyphMetrics(symbol, GLYPH_REFERENCE_SIZE);
    const referenceStrokeWidth =
      (effectiveStrokeWidth / glyphSize) * GLYPH_REFERENCE_SIZE;

    if (symbol === CIRCLE_SYMBOL || symbol === SQUARE_SYMBOL) {
      const fittedShapeSize = fitToViewBox
        ? GLYPH_REFERENCE_SIZE
        : Math.min(
            glyphMetrics.boundsHeight,
            glyphMetrics.boundsWidth,
            GLYPH_REFERENCE_SIZE,
          );
      const strokeInset = borderOnly ? referenceStrokeWidth / 2 : 0;
      const shapeSize = Math.max(fittedShapeSize - strokeInset * 2, 1);
      const shapeStart = (GLYPH_REFERENCE_SIZE - shapeSize) / 2;

      return (
        <svg
          className={cn('block! shrink-0! overflow-visible!', extraClass)}
          focusable="false"
          style={{
            height: `${glyphSize}px`,
            width: `${glyphSize}px`,
          }}
          viewBox={`0 0 ${GLYPH_REFERENCE_SIZE} ${GLYPH_REFERENCE_SIZE}`}
        >
          {symbol === CIRCLE_SYMBOL ? (
            <circle
              cx={GLYPH_REFERENCE_SIZE / 2}
              cy={GLYPH_REFERENCE_SIZE / 2}
              fill={borderOnly ? 'none' : glyphColor}
              r={shapeSize / 2}
              stroke={borderOnly ? glyphColor : undefined}
              strokeWidth={borderOnly ? referenceStrokeWidth : undefined}
            />
          ) : (
            <rect
              fill={borderOnly ? 'none' : glyphColor}
              height={shapeSize}
              stroke={borderOnly ? glyphColor : undefined}
              strokeWidth={borderOnly ? referenceStrokeWidth : undefined}
              width={shapeSize}
              x={shapeStart}
              y={shapeStart}
            />
          )}
        </svg>
      );
    }

    if (fitToViewBox) {
      const vbX = glyphMetrics.boundsX;
      const vbY = glyphMetrics.boundsY;
      const vbWidth = glyphMetrics.boundsWidth || GLYPH_REFERENCE_SIZE;
      const vbHeight = glyphMetrics.boundsHeight || GLYPH_REFERENCE_SIZE;

      return (
        <svg
          className={cn('block! shrink-0! overflow-visible!', extraClass)}
          focusable="false"
          style={{
            height: `${glyphSize}px`,
            width: `${glyphSize}px`,
          }}
          // 2. Crop the viewBox tightly around the drawn character's ink area
          viewBox={`${vbX} ${vbY} ${vbWidth} ${vbHeight}`}
          // 3. Force SVG to stretch BOTH X and Y to fill 100% of glyphSize (e.g., 16x16)
          preserveAspectRatio="none"
        >
          <text
            fill={borderOnly ? 'none' : glyphColor}
            fontFamily={fontFamily}
            fontSize={GLYPH_REFERENCE_SIZE}
            stroke={borderOnly ? glyphColor : undefined}
            strokeWidth={borderOnly ? referenceStrokeWidth : undefined}
            x="0"
            y="0"
          >
            {symbol}
          </text>
        </svg>
      );
    }

    return (
      <svg
        className={cn('block! shrink-0! overflow-visible!', extraClass)}
        focusable="false"
        style={{
          height: `${glyphSize}px`,
          width: `${glyphSize}px`,
        }}
        viewBox={`0 0 ${GLYPH_REFERENCE_SIZE} ${GLYPH_REFERENCE_SIZE}`}
      >
        <text
          fill={borderOnly ? 'none' : glyphColor}
          fontFamily={fontFamily}
          fontSize={GLYPH_REFERENCE_SIZE}
          stroke={borderOnly ? glyphColor : undefined}
          strokeWidth={borderOnly ? referenceStrokeWidth : undefined}
          textAnchor="start"
          x={GLYPH_REFERENCE_SIZE / 2 + glyphMetrics.x}
          y={GLYPH_REFERENCE_SIZE / 2 + glyphMetrics.y}
        >
          {symbol}
        </text>
      </svg>
    );
  };

  return (
    <span
      className={cn(
        'relative! inline-flex! shrink-0! items-center! justify-center! overflow-visible! ml-[-4px]!',
        className,
      )}
      data-title={dataTitle}
      data-title-pos={dataTitlePos}
      style={containerStyle}
    >
      {glowColor ? (
        <span
          aria-hidden="true"
          className="absolute! inset-0! z-0! inline-flex! items-center! justify-center! pointer-events-none!"
        >
          <span className="inline-flex! origin-center! animate-[legend-connectivity-glow_1.2s_infinite_alternate_0.2s]">
            {renderGlyph(outerSize, glowColor)}
          </span>
        </span>
      ) : null}
      <span className="relative! z-1! inline-flex! items-center! justify-center!">
        {renderGlyph(size, color)}
      </span>
    </span>
  );
};

export default EntityLegendIndicator;
