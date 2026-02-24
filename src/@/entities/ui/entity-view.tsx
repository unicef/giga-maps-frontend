import { LocationFilled, InformationFilled } from '@carbon/icons-react';
import { useStore } from 'effector-react';
import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { Badge } from '~/components/ui/badge';
import {
  $entityPopupData,
  $entityLoading,
  $selectedEntityConfig,
} from '~/@/entities/models/entity.model';
import type { EntityFieldConfig } from '~/@/entities/config/entity-config.types';
import type { BaseEntity } from '~/@/entities/types/base-entity.type';

/**
 * Format a field value for display based on its config.
 */
const formatFieldValue = (field: EntityFieldConfig, entity: BaseEntity): string => {
  const value = (entity as any)[field.name];
  if (value === undefined || value === null) return '—';
  if (field.type === 'boolean') return value ? 'Yes' : 'No';
  if (field.type === 'date') return new Date(value).toLocaleDateString();
  if (field.type === 'array') return Array.isArray(value) ? value.join(', ') : String(value);
  const str = String(value);
  return field.unit ? `${str} ${field.unit}` : str;
};

/**
 * Entity sidebar view — shows detailed information for a selected entity.
 * Uses shadcn Card, Badge, and Skeleton components.
 */
const EntityView = () => {
  const { t } = useTranslation();
  const popupData = useStore($entityPopupData);
  const isLoading = useStore($entityLoading);
  const config = useStore($selectedEntityConfig);

  if (isLoading) {
    return (
      <div className="overflow-y-auto">
        <Card className="border-0 shadow-none gap-3">
          <CardContent>
            <Skeleton className="h-5 w-[70%] mb-3" />
            <Skeleton className="h-3 w-[50%] mb-2" />
            <Skeleton className="h-3 w-[60%] mb-2" />
            <Skeleton className="h-3 w-[40%]" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!popupData?.data || !config) {
    return (
      <div className="overflow-y-auto">
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center text-muted-foreground text-[0.8125rem] leading-5 [&>svg]:size-8 [&>svg]:mb-3 [&>svg]:opacity-40">
          <InformationFilled />
          <span>{t('select-entity', 'Select an entity on the map to view details')}</span>
        </div>
      </div>
    );
  }

  const { data } = popupData;
  const sidebarFields = config.fields.filter(f => f.showInSidebar);
  const coords = data.geopoint?.coordinates;

  return (
    <div className="overflow-y-auto">
      <Card className="border-0 shadow-none gap-3">
        <CardHeader className="pb-0">
          {/* Entity type badge */}
          <Badge
            variant="outline"
            className="text-[0.6875rem] font-semibold uppercase tracking-[0.04em] gap-1 w-fit"
            style={{
              backgroundColor: `${config.colors.primary}20`,
              color: config.colors.primary,
              borderColor: `${config.colors.primary}40`,
            }}
          >
            <span
              className="inline-block size-2 rounded-full opacity-65"
              style={{ backgroundColor: config.colors.primary }}
            />
            {config.displayName}
          </Badge>

          {/* Entity name */}
          <CardTitle className="text-sm tracking-[0.01rem] break-words">
            {data.name || `${config.displayName} #${data.id}`}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Coordinates */}
          {coords && (
            <div className="flex items-center [&>svg]:size-3 [&>svg]:fill-foreground [&>svg]:mr-1">
              <LocationFilled />
              <p className="text-xs text-muted-foreground capitalize">
                {[...coords].reverse().map(c => c.toFixed(4)).join(', ')}
              </p>
            </div>
          )}

          {/* Entity ID */}
          {data.external_id && (
            <div className="flex items-center [&>svg]:size-3 [&>svg]:fill-foreground [&>svg]:mr-1">
              <InformationFilled />
              <p className="text-xs text-muted-foreground capitalize">
                ID: {data.external_id}
              </p>
            </div>
          )}

          {/* Fields grid */}
          {sidebarFields.length > 0 && (
            <div className="grid grid-cols-2 w-full">
              {sidebarFields.map(field => (
                <div key={field.name} className="py-3 pr-2 overflow-hidden break-words">
                  <p className="text-xs text-muted-foreground mb-1">{field.label}</p>
                  <span className="block text-sm text-foreground leading-[1.125rem]">
                    {formatFieldValue(field, data)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EntityView;
