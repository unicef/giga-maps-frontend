import { Hash, MapPin } from 'lucide-react';

import EntityLegendIndicator from '~/@/entities/ui/entity-legend-indicator';

import { getDisplayValue } from './school-view.utils';

export function DetailLine({
  icon,
  label,
  value,
  valueClassName = '',
}: {
  icon?: 'hash' | 'location';
  label?: string;
  value: unknown;
  valueClassName?: string;
}) {
  const displayValue = getDisplayValue(value);
  if (displayValue === 'N/A') return null;
  const Icon = icon === 'location' ? MapPin : icon === 'hash' ? Hash : null;

  return (
    <div className="flex! min-w-0! items-center! gap-1! mt-3! text-muted-foreground!">
      {Icon && <Icon className="size-3! shrink-0! text-foreground!" />}
      <p
        className="m-0! min-w-0! truncate! capitalize! text-[12px]! leading-[1.125rem]!"
        title={displayValue}
      >
        {label ? <>{label}: </> : null}
        <span className={valueClassName}>{displayValue}</span>
      </p>
    </div>
  );
}

export function StatusLine({
  label,
  color,
  entityType,
}: {
  label: string;
  color: string;
  entityType?: string;
}) {
  return (
    <div className="flex! min-w-0! items-center! gap-1! mt-3!">
      {entityType ? (
        <span className="flex! shrink-0! items-center! justify-center! mr-1!">
          <EntityLegendIndicator
            color={color}
            entityType={entityType}
            size={16}
          />
        </span>
      ) : (
        <span
          className="mr-1! size-2! shrink-0! rounded-full!"
          style={{ backgroundColor: color }}
        />
      )}
      <p
        className="m-0! min-w-0! truncate! capitalize! text-[12px]! leading-[1.125rem]!"
        style={{ color }}
        title={label}
      >
        {label}
      </p>
    </div>
  );
}

export function LayerIcon({ icon }: { icon?: string }) {
  if (!icon) return null;

  return (
    <span
      aria-hidden="true"
      className="size-3.5! shrink-0! text-muted-foreground! [&_svg]:size-3.5!"
      dangerouslySetInnerHTML={{ __html: icon }}
    />
  );
}
