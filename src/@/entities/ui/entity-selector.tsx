import { useStore } from 'effector-react';
import { useTranslation } from 'react-i18next';

import {
  $activeEntityTypes,
  $entityRegistry,
  toggleEntityType,
  selectAllEntityTypes,
} from '~/@/entities/models/entity.model';
import type { EntityConfig } from '~/@/entities/config/entity-config.types';
import type { EntityType } from '~/@/entities/types/base-entity.type';

import {
  EntitySelectorWrapper,
  EntityToggleButton,
  EntityDot,
} from './entity-selector.style';

/**
 * Entity type selector — displays toggle buttons for each registered entity type.
 * Includes a "Select All" button to activate all entity types at once.
 */
export default function EntityTypeSelector() {
  const { t } = useTranslation();
  const activeEntityTypes = useStore($activeEntityTypes);
  const entityRegistry = useStore($entityRegistry);

  const entityTypes = Object.entries(entityRegistry) as [string, EntityConfig][];

  if (entityTypes.length <= 1) {
    return null;
  }

  const allSelected = entityTypes.length === activeEntityTypes.length;

  return (
    <EntitySelectorWrapper>
      <EntityToggleButton
        $active={allSelected}
        onClick={() => selectAllEntityTypes()}
        title={t('select_all', 'Select All')}
      >
        {t('all', 'All')}
      </EntityToggleButton>
      {entityTypes.map(([type, config]) => {
        const isActive = activeEntityTypes.includes(type as EntityType);
        return (
          <EntityToggleButton
            key={type}
            $active={isActive}
            onClick={() => toggleEntityType(type as EntityType)}
            title={config.displayName}
          >
            <EntityDot $color={config.colors.primary} />
            {config.displayName}
          </EntityToggleButton>
        );
      })}
    </EntitySelectorWrapper>
  );
}

