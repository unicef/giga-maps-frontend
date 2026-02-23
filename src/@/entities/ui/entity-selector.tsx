import { useStore } from 'effector-react';
import { useTranslation } from 'react-i18next';

import { Button } from '~/components/ui/button';
import {
  $activeEntityTypes,
  $entityRegistry,
  toggleEntityType,
  selectAllEntityTypes,
} from '~/@/entities/models/entity.model';
import type { EntityConfig } from '~/@/entities/config/entity-config.types';
import type { EntityType } from '~/@/entities/types/base-entity.type';

/**
 * Entity type selector — dark floating pill bar with shadcn Button toggles.
 * Uses theme tokens: surface, on-surface, border-subtle.
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
    <div className="tw:fixed tw:top-2 tw:left-1/2 tw:-translate-x-1/2 tw:z-[3] tw:flex tw:items-center tw:gap-1.5 tw:py-1.5 tw:px-2 tw:bg-surface tw:rounded-full tw:shadow-[0_2px_12px_rgba(0,0,0,0.3)] max-[768px]:tw:top-auto max-[768px]:tw:bottom-[33vh]">
      {/* All entities button */}
      <Button
        variant={allSelected ? 'default' : 'outline'}
        size="sm"
        className="tw:rounded-full tw:text-xs tw:h-7 tw:px-3.5 tw:border-border-subtle tw:font-medium"
        onClick={() => selectAllEntityTypes()}
      >
        {t('all_entities', 'All entities')}
      </Button>

      {/* Entity type buttons */}
      {entityTypes.map(([type, config]) => {
        const isActive = activeEntityTypes.includes(type as EntityType);
        return (
          <Button
            key={type}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            className="tw:rounded-full tw:text-xs tw:h-7 tw:px-3.5 tw:gap-1.5 tw:border-border-subtle tw:font-medium"
            onClick={() => toggleEntityType(type as EntityType)}
          >
            <span
              className="tw:inline-block tw:size-2.5 tw:rounded-full tw:shrink-0"
              style={{ backgroundColor: config.colors.primary }}
            />
            {config.displayName}
          </Button>
        );
      })}
    </div>
  );
}
