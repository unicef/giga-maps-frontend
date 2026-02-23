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
      <div className="tw:overflow-y-auto">
        <Card className="tw:border-0 tw:shadow-none tw:gap-3">
          <CardContent>
            <Skeleton className="tw:h-5 tw:w-[70%] tw:mb-3" />
            <Skeleton className="tw:h-3 tw:w-[50%] tw:mb-2" />
            <Skeleton className="tw:h-3 tw:w-[60%] tw:mb-2" />
            <Skeleton className="tw:h-3 tw:w-[40%]" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!popupData?.data || !config) {
    return (
      <div className="tw:overflow-y-auto">
        <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-8 tw:px-4 tw:text-center tw:text-muted-foreground tw:text-[0.8125rem] tw:leading-5 tw:[&>svg]:size-8 tw:[&>svg]:mb-3 tw:[&>svg]:opacity-40">
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
    <div className="tw:overflow-y-auto">
      <Card className="tw:border-0 tw:shadow-none tw:gap-3">
        <CardHeader className="tw:pb-0">
          {/* Entity type badge */}
          <Badge
            variant="outline"
            className="tw:text-[0.6875rem] tw:font-semibold tw:uppercase tw:tracking-[0.04em] tw:gap-1 tw:w-fit"
            style={{
              backgroundColor: `${config.colors.primary}20`,
              color: config.colors.primary,
              borderColor: `${config.colors.primary}40`,
            }}
          >
            <span
              className="tw:inline-block tw:size-2 tw:rounded-full tw:opacity-65"
              style={{ backgroundColor: config.colors.primary }}
            />
            {config.displayName}
          </Badge>

          {/* Entity name */}
          <CardTitle className="tw:text-sm tw:tracking-[0.01rem] tw:break-words">
            {data.name || `${config.displayName} #${data.id}`}
          </CardTitle>
        </CardHeader>

        <CardContent className="tw:space-y-3">
          {/* Coordinates */}
          {coords && (
            <div className="tw:flex tw:items-center tw:[&>svg]:size-3 tw:[&>svg]:fill-foreground tw:[&>svg]:mr-1">
              <LocationFilled />
              <p className="tw:text-xs tw:text-muted-foreground tw:capitalize">
                {[...coords].reverse().map(c => c.toFixed(4)).join(', ')}
              </p>
            </div>
          )}

          {/* Entity ID */}
          {data.external_id && (
            <div className="tw:flex tw:items-center tw:[&>svg]:size-3 tw:[&>svg]:fill-foreground tw:[&>svg]:mr-1">
              <InformationFilled />
              <p className="tw:text-xs tw:text-muted-foreground tw:capitalize">
                ID: {data.external_id}
              </p>
            </div>
          )}

          {/* Fields grid */}
          {sidebarFields.length > 0 && (
            <div className="tw:grid tw:grid-cols-2 tw:w-full">
              {sidebarFields.map(field => (
                <div key={field.name} className="tw:py-3 tw:pr-2 tw:overflow-hidden tw:break-words">
                  <p className="tw:text-xs tw:text-muted-foreground tw:mb-1">{field.label}</p>
                  <span className="tw:block tw:text-sm tw:text-foreground tw:leading-[1.125rem]">
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
