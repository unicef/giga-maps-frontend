import { LocationFilled, InformationFilled } from '@carbon/icons-react';
import { SkeletonText } from '@carbon/react';
import { useStore } from 'effector-react';
import { useTranslation } from 'react-i18next';

import { SidebarScroll } from '~/@/sidebar/ui/sidebar.style';
import {
  $entityPopupData,
  $entityLoading,
  $selectedEntityConfig,
} from '~/@/entities/models/entity.model';
import type { EntityFieldConfig } from '~/@/entities/config/entity-config.types';
import type { BaseEntity } from '~/@/entities/types/base-entity.type';

import {
  EntityViewContainer,
  EntityViewHeader,
  EntityTypeTag,
  EntityName,
  EntityFieldsGrid,
  EntityFieldItem,
  EntityInfoRow,
  EntityEmptyState,
  StatusDot,
} from './entity-view.style';

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
 * Entity sidebar view — renders detailed information for a selected entity.
 * 
 * Reads from `$entityPopupData` and `$selectedEntityConfig`.
 * Shows entity name, type badge, coordinates, and all sidebar-visible fields.
 */
const EntityView = () => {
  const { t } = useTranslation();
  const popupData = useStore($entityPopupData);
  const isLoading = useStore($entityLoading);
  const config = useStore($selectedEntityConfig);

  if (isLoading) {
    return (
      <SidebarScroll>
        <EntityViewContainer>
          <SkeletonText heading width="70%" />
          <SkeletonText width="50%" />
          <SkeletonText width="60%" />
          <SkeletonText width="40%" />
        </EntityViewContainer>
      </SidebarScroll>
    );
  }

  if (!popupData?.data || !config) {
    return (
      <SidebarScroll>
        <EntityEmptyState>
          <InformationFilled />
          <span>{t('select-entity', 'Select an entity on the map to view details')}</span>
        </EntityEmptyState>
      </SidebarScroll>
    );
  }

  const { data } = popupData;
  const sidebarFields = config.fields.filter(f => f.showInSidebar);
  const coords = data.geopoint?.coordinates;

  return (
    <SidebarScroll>
      <EntityViewContainer>
        {/* Header with entity type tag */}
        <EntityViewHeader>
          <EntityTypeTag $color={config.colors.primary}>
            <StatusDot $color={config.colors.primary} />
            {config.displayName}
          </EntityTypeTag>
        </EntityViewHeader>

        {/* Entity name */}
        <EntityName>
          {data.name || `${config.displayName} #${data.id}`}
        </EntityName>

        {/* Coordinates */}
        {coords && (
          <EntityInfoRow>
            <LocationFilled />
            <p>{[...coords].reverse().map(c => c.toFixed(4)).join(', ')}</p>
          </EntityInfoRow>
        )}

        {/* Entity ID */}
        {data.external_id && (
          <EntityInfoRow>
            <InformationFilled />
            <p>ID: {data.external_id}</p>
          </EntityInfoRow>
        )}

        {/* Fields grid */}
        {sidebarFields.length > 0 && (
          <EntityFieldsGrid>
            {sidebarFields.map(field => (
              <EntityFieldItem key={field.name}>
                <p>{field.label}</p>
                <span>{formatFieldValue(field, data)}</span>
              </EntityFieldItem>
            ))}
          </EntityFieldsGrid>
        )}
      </EntityViewContainer>
    </SidebarScroll>
  );
};

export default EntityView;
