import { useStore } from 'effector-react';
import { Check, ChevronDown, ChevronRight } from 'lucide-react';

import { $stylePaintData } from '~/@/map/map.model';
import { getSchoolStatus } from '~/@/sidebar/school-view.utils';
import { onSchoolUncheck } from '~/@/sidebar/sidebar.model';
import { SchoolStatsType } from '~/api/types';
import { Button } from '~/components/ui/button';
import EntityLegendIndicator from '~/@/entities/ui/entity-legend-indicator';
import { EntityType } from '~/@/entities';

import { EntityCollapsedSummary } from './entity-collapsed-summary';
import { EntityDetailContent } from './entity-detail-content';

export function EntityListItem({
  entity,
  entityType,
  isOpen,
  onToggle,
}: {
  entity: SchoolStatsType;
  entityType: EntityType;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const stylePaintData = useStore($stylePaintData);
  const { connectivityStatusColor } = getSchoolStatus({
    schoolDetails: entity,
    stylePaintData,
  });
  const Icon = isOpen ? ChevronDown : ChevronRight;

  return (
    <div className="border-b! border-border! bg-background! last:border-b-0!">
      <div className="px-3.5! py-4!">
        <div className="flex! min-w-0! gap-3!">
          <Button
            aria-label="Remove selected entity"
            className="mt-0.5! size-5! shrink-0! rounded-sm! bg-foreground! p-0! text-background! hover:bg-foreground/90!"
            onClick={() => onSchoolUncheck(entity.id)}
            size="icon-xs"
            type="button"
            variant="icon"
          >
            <Check className="size-3.5!" />
          </Button>
          <div className="min-w-0! flex-1!">
            <button
              className="flex! w-full! items-center! gap-2! border-0! bg-transparent! p-0! text-left! text-foreground!"
              onClick={onToggle}
              type="button"
            >
              <span
                className="min-w-0! flex-1! truncate! text-sm! font-semibold! leading-5!"
                title={entity.name}
              >
                {entity.name}
              </span>
              <span className="flex! shrink-0! items-center! justify-center!">
                <EntityLegendIndicator
                  color={connectivityStatusColor}
                  entityType={entityType}
                  size={16}
                />
              </span>
              <Icon className="size-4! shrink-0! text-muted-foreground!" />
            </button>
          </div>
        </div>
        {!isOpen && (
          <EntityCollapsedSummary entity={entity} entityType={entityType} />
        )}
      </div>
      {isOpen && (
        <div className="border-t! border-border!">
          <EntityDetailContent entity={entity} entityType={entityType} />
        </div>
      )}
    </div>
  );
}
