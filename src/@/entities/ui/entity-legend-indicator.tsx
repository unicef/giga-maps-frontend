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

const EntityLegendIndicator = ({
  className,
  color,
  entityType,
  glowColor,
  size = 8,
}: EntityLegendIndicatorProps) => {
  const entityConfigMap = useStore($entityConfigMap);
  const config = entityConfigMap[entityType];
  const shape = config?.legendShape ?? 'circle';
  const outerSize = glowColor ? size + 4 : size;
  const containerSize = glowColor ? outerSize : size;

  const containerStyle = {
    height: `${containerSize}px`,
    width: `${containerSize}px`,
  } as CSSProperties;

  const renderGlyph = (glyphSize: number, glyphColor: string) => {
    return (
      <span
        className={cn('!block !shrink-0', shape === 'square' ? '!rounded-none' : '!rounded-full')}
        style={{
          background: glyphColor,
          height: `${glyphSize}px`,
          width: `${glyphSize}px`,
        }}
      />
    );
  };

  return (
    <span className={cn('!relative !inline-flex !shrink-0 !items-center !justify-center !overflow-visible', className)} style={containerStyle}>
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
