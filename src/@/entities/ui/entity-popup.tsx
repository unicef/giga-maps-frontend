import { LocationFilled } from '@carbon/icons-react';
import { SkeletonText } from '@carbon/react';
import { styled } from 'styled-components';
import { useStore } from 'effector-react';
import { useTranslation } from 'react-i18next';

import { $entityPopupData, $entityLoading } from '~/@/entities/models/entity.model';
import { $entityRegistry } from '~/@/entities/models/entity.model';
import type { EntityConfig, EntityFieldConfig } from '~/@/entities/config/entity-config.types';
import type { BaseEntity } from '~/@/entities/types/base-entity.type';

const PopupContainer = styled.div`
  width: 250px;
  border-radius: 2px;
  background: ${props => props.theme.main};
  padding: 16px;
  box-shadow: 0 2px 3px 0 ${props => props.theme.main};
`;

const EntityName = styled.h6`
  color: ${props => props.theme.text};
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.125rem;
  letter-spacing: 0.01rem;
  margin-bottom: 4px;
`;

const EntityTypeLabel = styled.span`
  color: ${props => props.theme.titleDesc};
  font-size: 0.65rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05rem;
  opacity: 0.7;
`;

const FieldRow = styled.div`
  display: flex;
  align-items: baseline;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: ${props => props.theme.text};
`;

const FieldLabel = styled.span`
  color: ${props => props.theme.titleDesc};
  font-size: 0.7rem;
  margin-right: 0.375rem;
  min-width: 4rem;
`;

const FieldValue = styled.span`
  color: ${props => props.theme.text};
  font-size: 0.75rem;
  font-weight: 500;
`;

const GeoWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-top: 6px;
  svg {
    width: 0.75rem;
    height: 0.75rem;
    fill: ${props => props.theme.graphWeekMonthBorder};
    margin-right: 0.25rem;
  }
`;

const GeoLabel = styled.span`
  color: ${props => props.theme.titleDesc};
  font-size: 0.75rem;
`;

const StatusDot = styled.span<{ $color: string }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.$color};
  margin-right: 6px;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${props => props.theme.border};
  margin: 0.5rem 0;
`;

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
 * Uses the EntityConfig.fields to dynamically render field rows.
 */
export default function EntityPopup() {
  const { t } = useTranslation();
  const popupData = useStore($entityPopupData);
  const isLoading = useStore($entityLoading);
  const registry = useStore($entityRegistry);

  if (isLoading) {
    return (
      <PopupContainer>
        <SkeletonText heading width="80%" />
        <SkeletonText width="60%" />
        <SkeletonText width="40%" />
      </PopupContainer>
    );
  }

  if (!popupData?.data) return null;

  const { entityType, data } = popupData;
  const config = registry[entityType] as EntityConfig | undefined;
  if (!config) return null;

  const popupFields = config.fields.filter(f => f.showInPopup);
  const coords = data.geopoint?.coordinates;

  return (
    <PopupContainer className="entity-popup-container">
      <EntityTypeLabel>{config.displayName}</EntityTypeLabel>
      <EntityName>{data.name || `${config.displayName} #${data.id}`}</EntityName>

      {coords && (
        <GeoWrapper>
          <LocationFilled />
          <GeoLabel>
            {[...coords].reverse().map(c => c.toFixed(4)).join(', ')}
          </GeoLabel>
        </GeoWrapper>
      )}

      {popupFields.length > 0 && <Divider />}

      {popupFields.map(field => (
        <FieldRow key={field.name}>
          <FieldLabel>{field.label}:</FieldLabel>
          <FieldValue>{renderFieldValue(field, data)}</FieldValue>
        </FieldRow>
      ))}
    </PopupContainer>
  );
}
