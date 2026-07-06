import { useStore } from 'effector-react';
import { useMemo, type MouseEvent } from 'react';
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
const disabled =
  'cursor-not-allowed! border-border! bg-background! text-muted-foreground! opacity-50! hover:bg-background! hover:text-muted-foreground!';

const getEntityTypeFromEntityRoute = (search: string) => {
  const params = new URLSearchParams(search);
  const entityIdsParam = Array.from(params.entries()).find(
    ([key, value]) => key.endsWith('_ids') && key !== 'entity_ids' && !!value,
  );
  const entityTypeFromIds = entityIdsParam?.[0].replace(/_ids$/, '') as
    | EntityType
    | undefined;
  const legacyEntityTypeParam = params.get('entity_type') ?? params.get('entity');

  return entityTypeFromIds
    ?? (legacyEntityTypeParam ? (legacyEntityTypeParam as EntityType) : null);
};

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
  const entitySearch = useStore(mapEntity.router.search);
  const lockedEntityType = useMemo(
    () => (isEntityView ? getEntityTypeFromEntityRoute(entitySearch) : null),
    [entitySearch, isEntityView],
  );
  const isEntityViewLocked = Boolean(lockedEntityType);

  const entityTypes = Object.entries(entityRegistry);

  if (entityTypes.length <= 1) {
    return null;
  }

  const allSelected = !isEntityViewLocked && isGlobalMode;

  const handleSelectAllEntityTypes = () => {
    if (isEntityViewLocked) return;
    selectAllEntityTypes();
  };

  const handleEntityClick = (entityType: EntityType, event: MouseEvent) => {
    if (isEntityViewLocked && entityType !== lockedEntityType) return;

    if (isGlobalMode) {
      // If we're in global mode, the first click starts a manual selection with this entity.
      changeActiveEntityTypes([entityType]);
      changeSelectedEntityType(entityType);
    } else if (event.shiftKey && !isEntityViewLocked) {
      toggleEntityType(entityType);
    } else {
      changeActiveEntityTypes([entityType]);
      changeSelectedEntityType(entityType);
    }
  };

  return (
    <div className={!isMobile ? cn("fixed top-2 left-86 z-[3] flex items-center gap-2 rounded-full") : cn("flex items-center gap-2 p-1! overflow-auto")}>
      <Button
        variant="default"
        size="lg"
        className={`${base} ${isEntityViewLocked ? disabled : allSelected ? active : inactive}`}
        disabled={isEntityViewLocked}
        onClick={handleSelectAllEntityTypes}
      >
        {t('all-entities', 'All entities')}
      </Button>

      {entityTypes.map(([type, config]) => {
        const entityType = type as EntityType;
        const isDisabled = isEntityViewLocked && entityType !== lockedEntityType;
        const isActive = isEntityViewLocked
          ? entityType === lockedEntityType
          : activeEntityTypes.includes(entityType) && !isGlobalMode;

        return (
          <Button
            key={type}
            variant="default"
            size="lg"
            className={`${base} ${isDisabled ? disabled : isActive ? active : inactive}`}
            disabled={isDisabled}
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
      {isMobile &&
        <FilterButton />
      }
    </div>
  );
}
