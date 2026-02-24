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
      <Card className="w-[250px] gap-3 py-4 shadow-md">
        <CardContent>
          <Skeleton className="h-3 w-4/5 mb-2" />
          <Skeleton className="h-4 w-3/5 mb-2" />
          <Skeleton className="h-3 w-2/5" />
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
    <Card className="entity-popup-container w-[250px] gap-3 py-4 shadow-md">
      <CardHeader className="gap-1 pb-0">
        <CardDescription className="text-[0.65rem] font-medium uppercase tracking-wider opacity-70">
          {config.displayName}
        </CardDescription>
        <CardTitle className="text-sm tracking-[0.01rem]">
          {data.name || `${config.displayName} #${data.id}`}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        {/* Coordinates */}
        {coords && (
          <div className="flex items-center [&>svg]:size-3 [&>svg]:fill-muted-foreground [&>svg]:mr-1">
            <LocationFilled />
            <span className="text-xs text-muted-foreground">
              {[...coords].reverse().map(c => c.toFixed(4)).join(', ')}
            </span>
          </div>
        )}

        {/* Divider + Fields */}
        {popupFields.length > 0 && <Separator />}

        {popupFields.map(field => (
          <div key={field.name} className="flex items-baseline text-xs">
            <Badge variant="ghost" className="text-[0.7rem] text-muted-foreground px-0 min-w-16 justify-start">
              {field.label}:
            </Badge>
            <span className="text-xs font-medium text-foreground">
              {renderFieldValue(field, data)}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
