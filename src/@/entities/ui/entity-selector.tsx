import { useStore } from 'effector-react';
import { type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

import {
  $activeEntityTypes,
  $entityRegistry,
  $isGlobalMode,
  changeActiveEntityTypes,
  changeSelectedEntityType,
  selectAllEntityTypes,
  toggleEntityType,
} from '~/@/entities/models/entity.model';
import { EntityType } from '~/@/entities/types/base-entity.type';
import EntityLegendIndicator from '~/@/entities/ui/entity-legend-indicator';
import { $isSidebarCollapsed } from '~/@/sidebar/sidebar.model';
import FilterButton from '~/@/map/ui/advanced-filter/filter';
import { Button } from '~/components/ui/button';
import { $isMobile } from '~/core/media-query';
import { cn } from '~/lib/cn';
import { mapEntity } from '~/core/routes';

const base =
  'h-9! gap-2! rounded-[6px]! border px-3! py-2! text-sm! font-medium! leading-5!';
const active = 'border-primary';
const inactive =
  'border-border bg-background text-foreground hover:bg-background/80 hover:text-foreground';

/**
 * Entity type selector - floating pill bar over the map.
 */
export default function EntityTypeSelector() {
  const { t } = useTranslation();
  const isMobile = useStore($isMobile);
  const activeEntityTypes = useStore($activeEntityTypes);
  const entityRegistry = useStore($entityRegistry);
  const isGlobalMode = useStore($isGlobalMode);
  const isEntityView = useStore(mapEntity.visible);
  const isSidebarCollapsed = useStore($isSidebarCollapsed);

  const entityTypes = Object.entries(entityRegistry);

  if (entityTypes.length <= 1 || isEntityView) {
    return null;
  }

  const allSelected = isGlobalMode;

  const handleSelectAllEntityTypes = () => {
    selectAllEntityTypes();
  };

  const handleEntityClick = (entityType: EntityType, event: MouseEvent) => {
    if (isGlobalMode) {
      // If we're in global mode, the first click starts a manual selection with this entity.
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
    <div
      className={
        !isMobile
          ? cn(
              'fixed top-2 z-[3] flex items-center gap-2 rounded-full transition-all duration-300',
              isSidebarCollapsed ? 'left-4!' : 'left-86!',
            )
          : cn('flex items-center gap-2 p-1! overflow-auto')
      }
    >
      <Button
        variant="default"
        size="lg"
        className={`${base} ${allSelected ? active : inactive}`}
        onClick={handleSelectAllEntityTypes}
      >
        {t('all-facilities')}
      </Button>

      {entityTypes.map(([type, config]) => {
        const entityType = type as EntityType;
        const isActive = activeEntityTypes.includes(entityType) && !isGlobalMode;

        return (
          <Button
            key={type}
            variant="default"
            size="lg"
            className={`${base} ${isActive ? active : inactive}`}
            onClick={(event) => handleEntityClick(entityType, event)}
          >
            <EntityLegendIndicator
              className="ml-0!"
              color={isActive ? '#f4f4f4' : '#d9d9d9'}
              entityType={type}
              fitToViewBox
              size={11}
            />
            {t(config.slug, config.slug === (EntityType.SCHOOL as string) ? { count: 2 } : undefined)}
          </Button>
        );
      })}
      {isMobile && <FilterButton />}
    </div>
  );
}
