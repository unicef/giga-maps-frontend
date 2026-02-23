import { LocationFilled } from '@carbon/icons-react';
import { useStore } from 'effector-react';
import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { Badge } from '~/components/ui/badge';
import { Separator } from '~/components/ui/separator';
import { $entityPopupData, $entityLoading } from '~/@/entities/models/entity.model';
import { $entityRegistry } from '~/@/entities/models/entity.model';
import type { EntityConfig, EntityFieldConfig } from '~/@/entities/config/entity-config.types';
import type { BaseEntity } from '~/@/entities/types/base-entity.type';

const renderFieldValue = (field: EntityFieldConfig, entity: BaseEntity): string => {
  const value = (entity as any)[field.name];
  if (value === undefined || value === null) return '—';
  if (field.type === 'boolean') return value ? 'Yes' : 'No';
  if (field.type === 'date') return new Date(value).toLocaleDateString();
  if (field.type === 'array') return Array.isArray(value) ? value.join(', ') : String(value);
  const str = String(value);
  return field.unit ? `${str} ${field.unit}` : str;
};

/**
 * Entity popup — renders in the Mapbox popup DOM for non-legacy entities.
 * Uses shadcn Card, Badge, Skeleton, and Separator components.
 */
export default function EntityPopup() {
  const { t } = useTranslation();
  const popupData = useStore($entityPopupData);
  const isLoading = useStore($entityLoading);
  const registry = useStore($entityRegistry);

  if (isLoading) {
    return (
      <Card className="tw:w-[250px] tw:gap-3 tw:py-4 tw:shadow-md">
        <CardContent>
          <Skeleton className="tw:h-3 tw:w-4/5 tw:mb-2" />
          <Skeleton className="tw:h-4 tw:w-3/5 tw:mb-2" />
          <Skeleton className="tw:h-3 tw:w-2/5" />
        </CardContent>
      </Card>
    );
  }

  if (!popupData?.data) return null;

  const { entityType, data } = popupData;
  const config = registry[entityType] as EntityConfig | undefined;
  if (!config) return null;

  const popupFields = config.fields.filter(f => f.showInPopup);
  const coords = data.geopoint?.coordinates;

  return (
    <Card className="entity-popup-container tw:w-[250px] tw:gap-3 tw:py-4 tw:shadow-md">
      <CardHeader className="tw:gap-1 tw:pb-0">
        <CardDescription className="tw:text-[0.65rem] tw:font-medium tw:uppercase tw:tracking-wider tw:opacity-70">
          {config.displayName}
        </CardDescription>
        <CardTitle className="tw:text-sm tw:tracking-[0.01rem]">
          {data.name || `${config.displayName} #${data.id}`}
        </CardTitle>
      </CardHeader>

      <CardContent className="tw:space-y-2">
        {/* Coordinates */}
        {coords && (
          <div className="tw:flex tw:items-center tw:[&>svg]:size-3 tw:[&>svg]:fill-muted-foreground tw:[&>svg]:mr-1">
            <LocationFilled />
            <span className="tw:text-xs tw:text-muted-foreground">
              {[...coords].reverse().map(c => c.toFixed(4)).join(', ')}
            </span>
          </div>
        )}

        {/* Divider + Fields */}
        {popupFields.length > 0 && <Separator />}

        {popupFields.map(field => (
          <div key={field.name} className="tw:flex tw:items-baseline tw:text-xs">
            <Badge variant="ghost" className="tw:text-[0.7rem] tw:text-muted-foreground tw:px-0 tw:min-w-16 tw:justify-start">
              {field.label}:
            </Badge>
            <span className="tw:text-xs tw:font-medium tw:text-foreground">
              {renderFieldValue(field, data)}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
