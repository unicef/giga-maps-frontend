import { Hash, LucideIcon, MapPin } from 'lucide-react';

import EntityLegendIndicator from '~/@/entities/ui/entity-legend-indicator';

import { getDisplayValue } from './school-view.utils';

export function DetailLine({
  icon: Icon,
  label,
  value,
  valueClassName = '',
  preventTruncate = false,
}: {
  icon?: LucideIcon;
  label?: string;
  value: unknown;
  valueClassName?: string;
  preventTruncate?: boolean;
}) {
  const displayValue = getDisplayValue(value);
  if (displayValue === 'N/A') return null;

  return (
    <div className="flex! min-w-0! items-center! gap-1! mt-3! text-muted-foreground!">
      {Icon && <Icon className="size-3! shrink-0! text-foreground!" />}
      <p
        className={`m-0! min-w-0! capitalize! text-[12px]! leading-[1.125rem]! ${preventTruncate ? 'whitespace-normal! break-all!' : 'truncate!'}`}
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
  icon: Icon,
}: {
  icon?: LucideIcon;
  label: string;
  color: string;
  entityType?: string;
}) {
  return (
    <div className="flex! min-w-0! items-center! gap-1! mt-3!">
      {entityType ? (
        <span className="flex! shrink-0! items-center! justify-center! mr-1!">
          {/* <EntityLegendIndicator
            color={color}
            entityType={entityType}
            size={16}
          /> */}
          {Icon && <Icon className="size-3! shrink-0! text-foreground!" />}
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
