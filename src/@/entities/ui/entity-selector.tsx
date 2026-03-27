import { useStore } from 'effector-react';
import { useTranslation } from 'react-i18next';

import {
  $activeEntityTypes,
  $entityRegistry,
  changeActiveEntityTypes,
  changeSelectedEntityType,
  selectAllEntityTypes,
} from '~/@/entities/models/entity.model';
import type { EntityType } from '~/@/entities/types/base-entity.type';
import EntityLegendIndicator from '~/@/entities/ui/entity-legend-indicator';
import { Button } from '~/components/ui/button';

const base = 'rounded-full px-5 py-2.5 text-sm font-semibold focus-visible:ring-0';
const active = '';
const inactive = 'bg-[#3a3a3a] text-gray-300 hover:bg-[#454545] hover:text-gray-200';

/**
 * Entity type selector - floating pill bar over the map.
 * Matches the dark-container / blue-active / icon design.
 */
export default function EntityTypeSelector() {
  const { t } = useTranslation();
  const activeEntityTypes = useStore($activeEntityTypes);
  const entityRegistry = useStore($entityRegistry);

  const entityTypes = Object.entries(entityRegistry);

  if (entityTypes.length <= 1) {
    return null;
  }

  const registeredEntityTypes = entityTypes.map(([type]) => type as EntityType);
  const allSelected = activeEntityTypes.length === registeredEntityTypes.length;

  const handleSelectAll = () => {
    selectAllEntityTypes();
  };

  const handleEntityClick = (entityType: EntityType) => {
    changeActiveEntityTypes([entityType]);
    changeSelectedEntityType(entityType);
  };

  return (
    <div className="fixed top-12 left-80 z-[3] flex items-center gap-2 rounded-full max-[768px]:top-auto max-[768px]:bottom-[33vh]">
      <Button
        variant="default"
        className={`${base} ${allSelected ? active : inactive}`}
        onClick={handleSelectAll}
      >
        {t('all_entities', 'All entities')}
      </Button>

      {entityTypes.map(([type, config]) => {
        const isActive = !allSelected && activeEntityTypes.includes(type as EntityType);

        return (
          <Button
            key={type}
            variant="default"
            className={`${base} ${isActive ? active : inactive}`}
            onClick={() => handleEntityClick(type as EntityType)}
          >
            <EntityLegendIndicator
              color={isActive ? '#f4f4f4' : '#d9d9d9'}
              entityType={type}
              size={8}
            />
            {config.displayName}
          </Button>
        );
      })}
    </div>
  );
}
