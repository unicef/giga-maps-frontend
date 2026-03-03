import { type ComponentType } from 'react';
import { useStore } from 'effector-react';
import { useTranslation } from 'react-i18next';
import { Education, Hospital } from '@carbon/icons-react';

import { Button } from '~/components/ui/button';
import {
  $activeEntityTypes,
  $entityRegistry,
  toggleEntityType,
  selectAllEntityTypes,
} from '~/@/entities/models/entity.model';
import type { EntityConfig } from '~/@/entities/config/entity-config.types';
import type { EntityType } from '~/@/entities/types/base-entity.type';

/** Map entity config `icon` strings → Carbon icon components */
const iconMap: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  Education,
  Hospital,
};

const base =
  'rounded-lg px-5 py-2.5 text-sm font-semibold border-0 shadow-none focus-visible:ring-0';
const active = 'bg-[#2979ff] text-white hover:bg-[#2979ff]/90';
const inactive = 'bg-[#3a3a3a] text-gray-300 hover:bg-[#454545] hover:text-gray-200';

/**
 * Entity type selector — floating pill bar over the map.
 * Matches the dark-container / blue-active / icon design.
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
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[3] flex items-center gap-2 rounded-xl bg-[#2b2b2b]/90 p-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.45)] backdrop-blur-md max-[768px]:top-auto max-[768px]:bottom-[33vh]">
      {/* ── All entities ── */}
      <Button
        variant="default"
        className={`${base} ${allSelected ? active : inactive}`}
        onClick={() => selectAllEntityTypes()}
      >
        {t('all_entities', 'All entities')}
      </Button>

      {/* ── Per-entity buttons ── */}
      {entityTypes.map(([type, config]) => {
        const isActive = activeEntityTypes.includes(type as EntityType);
        const Icon = iconMap[config.icon];

        return (
          <Button
            key={type}
            variant="default"
            className={`${base} ${isActive ? active : inactive}`}
            onClick={() => toggleEntityType(type as EntityType)}
          >
            {Icon && <Icon size={18} />}
            {config.displayName}
          </Button>
        );
      })}
    </div>
  );
}
