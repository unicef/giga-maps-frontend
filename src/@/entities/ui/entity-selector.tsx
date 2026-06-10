import { useStore } from 'effector-react';
import { useTranslation } from 'react-i18next';

import {
  $activeEntityTypes,
  $isGlobalMode,
  $entityRegistry,
  changeActiveEntityTypes,
  changeSelectedEntityType,
  selectAllEntityTypes,
  toggleEntityType,
} from '~/@/entities/models/entity.model';
import type { EntityType } from '~/@/entities/types/base-entity.type';
import EntityLegendIndicator from '~/@/entities/ui/entity-legend-indicator';
import { Button } from '~/components/ui/button';

const base =
  'h-9! gap-2! rounded-[6px]! border px-3! py-2! text-sm! font-medium! leading-5!';
const active = 'border-primary';
const inactive =
  'border-border bg-background text-foreground hover:bg-background/80 hover:text-foreground';

const handleSelectAllEntityTypes = () => {
  selectAllEntityTypes();
};

/**
 * Entity type selector - floating pill bar over the map.
 */
export default function EntityTypeSelector() {
  const { t } = useTranslation();
  const activeEntityTypes = useStore($activeEntityTypes);
  const entityRegistry = useStore($entityRegistry);
  const isGlobalMode = useStore($isGlobalMode);

  const entityTypes = Object.entries(entityRegistry);

  if (entityTypes.length <= 1) {
    return null;
  }

  const allSelected = isGlobalMode;

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
    <div className="fixed top-2 left-86 z-[3] flex items-center gap-2 rounded-full max-[768px]:top-auto max-[768px]:bottom-[33vh]">
      <Button
        variant="default"
        size="lg"
        className={`${base} ${allSelected ? active : inactive}`}
        onClick={handleSelectAllEntityTypes}
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
              className="ml-0!"
              color={isActive ? '#f4f4f4' : '#d9d9d9'}
              entityType={type}
              fitToViewBox
              size={11}
            />
            {t(config.slug)}
          </Button>
        );
      })}
    </div>
  );
}
