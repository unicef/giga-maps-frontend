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
 * Entity type selector — floating pill bar with shadcn Button toggles.
 * Uses standard shadcn theme tokens (background, border, primary, etc.)
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
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[3] flex items-center gap-1.5 py-1.5 px-2 bg-background rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.3)] max-[768px]:top-auto max-[768px]:bottom-[33vh]">
      {/* All entities button */}
      <Button
        variant={allSelected ? 'default' : 'outline'}
        size="sm"
        className="rounded-full text-xs h-7 px-3.5 border-border font-medium"
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
            className="rounded-full text-xs h-7 px-3.5 gap-1.5 border-border font-medium"
            onClick={() => toggleEntityType(type as EntityType)}
          >
            <span
              className="inline-block size-2.5 rounded-full shrink-0"
              style={{ backgroundColor: config.colors.primary }}
            />
            {config.displayName}
          </Button>
        );
      })}
    </div>
  );
}
