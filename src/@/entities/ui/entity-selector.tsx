import { useStore } from 'effector-react';
import { useTranslation } from 'react-i18next';

import {
  $activeEntityTypes,
  $entityRegistry,
  changeActiveEntityTypes,
  changeSelectedEntityType,
  selectAllEntityTypes,
  toggleEntityType,
  $isGlobalMode,
} from '~/@/entities/models/entity.model';
import type { EntityType } from '~/@/entities/types/base-entity.type';
import EntityLegendIndicator from '~/@/entities/ui/entity-legend-indicator';
import { Button } from '~/components/ui/button';

const base = 'px-4 py-2 rounded-lg border border-border';
const active = '';
const inactive = 'bg-background text-foreground hover:bg-background/80 hover:text-foreground';

/**
 * Entity type selector - floating pill bar over the map.
 */
export default function EntityTypeSelector() {
  const { t } = useTranslation();
  const activeEntityTypes = useStore($activeEntityTypes);
  const entityRegistry = useStore($entityRegistry);

  const entityTypes = Object.entries(entityRegistry);

  if (entityTypes.length <= 1) {
    return null;
  }

  const isGlobalMode = useStore($isGlobalMode);
  const allSelected = isGlobalMode;

  const handleSelectAll = () => {
    selectAllEntityTypes();
  };

  const handleEntityClick = (entityType: EntityType, event: React.MouseEvent) => {
    if (isGlobalMode) {
      // If we're in global mode, the first click (even with shift) starts a manual selection with this entity
      changeActiveEntityTypes([entityType]);
      changeSelectedEntityType(entityType);
    } else if (event.shiftKey) {
      toggleEntityType(entityType);
    } else {
      changeActiveEntityTypes([entityType]);
      changeSelectedEntityType(entityType);
    }
  };

  return (
    <div className="fixed top-2 left-80 z-[3] flex items-center gap-2 rounded-full max-[768px]:top-auto max-[768px]:bottom-[33vh]">
      <Button
        variant="default"
        size="lg"
        className={`${base} ${allSelected ? active : inactive}`}
        onClick={handleSelectAll}
      >
        {t('all-entities', 'All entities')}
      </Button>

      {entityTypes.map(([type, config]) => {
        const isActive = activeEntityTypes.includes(type as EntityType) && !isGlobalMode;

        return (
          <Button
            key={type}
            variant="default"
            size="lg"
            className={`${base} ${isActive ? active : inactive}`}
            onClick={(event) => handleEntityClick(type as EntityType, event)}
          >
            <EntityLegendIndicator
              color={isActive ? '#f4f4f4' : '#d9d9d9'}
              entityType={type}
              size={20}
            />
            {t(config.slug)}
          </Button>
        );
      })}
    </div>
  );
}
