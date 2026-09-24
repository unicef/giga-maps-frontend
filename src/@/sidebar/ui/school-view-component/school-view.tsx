import { useStore } from 'effector-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { $activeEntityTypes } from '~/@/entities/models/entity.model';
import FooterDataSourcePopUp from '~/@/map/ui/footer-data-source-pop-up';
import {
  $currentLayerTypeUtilsByEntity,
  $getSchoolParams,
  $isFlyoutExpanded,
  $isLoadingSchoolView,
  $schoolStats,
} from '~/@/sidebar/sidebar.model';
import { SchoolStatsType } from '~/api/types';
import { Badge } from '~/components/ui/badge';
import { ScrollArea } from '~/components/ui/scroll-area';
import { $isMobile } from '~/core/media-query';
import { mapEntity } from '~/core/routes';
import { cn } from '~/lib/cn';

import { EntityDetailContent } from './entity-detail-content';
import {
  EntityDetailSkeleton,
  SingleEntityDetailSkeleton,
} from './entity-detail-skeleton';
import { EntityListItem } from './entity-list-item';

const SchoolView = () => {
  const { t } = useTranslation();
  const { entityType: detailEntityType, schoolIds = [] } =
    useStore($getSchoolParams);
  const entities = useStore($schoolStats) ?? [];
  const activeEntityTypes = useStore($activeEntityTypes);
  const isEntityDetailView = useStore(mapEntity.visible);
  const entityType = isEntityDetailView
    ? (detailEntityType ?? null)
    : activeEntityTypes.length === 1
      ? activeEntityTypes[0]
      : null;
  const isLoading = useStore($isLoadingSchoolView);
  const isFlyoutExpanded = useStore($isFlyoutExpanded);
  const isMobile = useStore($isMobile);
  const currentLayerTypeUtilsByEntity = useStore(
    $currentLayerTypeUtilsByEntity,
  );
  const { isLive, isStatic } = entityType
    ? (currentLayerTypeUtilsByEntity[entityType] ?? {})
    : {};
  const showDataSource = isLive || isStatic;
  const [openEntityIds, setOpenEntityIds] = useState<Set<number>>(
    () => new Set(),
  );
  const selectedEntities = schoolIds.length
    ? schoolIds
      .map((id) => entities.find((entity) => entity.id === id))
      .filter((entity): entity is SchoolStatsType => Boolean(entity))
    : entities;
  const isMulti = selectedEntities.length > 1;

  if (!entityType) return null;
  return (
    <div className="relative! h-full! min-h-0! w-full!">
      <ScrollArea
        className="h-full! w-full!"
        id="school-sidebar-scroll"
        viewportClassName="h-full! [&>div]:block! [&>div]:min-w-0! [&>div]:w-full!"
      >
        <div
          className={cn(
            'w-full! min-w-0! px-3.5! pb-12! pt-2!',
            // The giga-layer bar is fixed over the flyout once it is expanded.
            isFlyoutExpanded && 'max-md:pb-24!',
          )}
        >
          {isLoading && !selectedEntities.length ? (
            schoolIds.length > 1 ? (
              <EntityDetailSkeleton count={schoolIds.length} />
            ) : (
              <SingleEntityDetailSkeleton />
            )
          ) : !selectedEntities.length ? (
            <div className="rounded-lg! border! border-dashed! border-border! px-3! py-6! text-sm! text-muted-foreground!">
              {t('no-data-available')}
            </div>
          ) : isMulti ? (
            <div className="overflow-hidden! rounded-lg! border! border-border! bg-background!">
              {selectedEntities.map((entity) => (
                <EntityListItem
                  key={entity.id}
                  entity={entity}
                  entityType={entityType}
                  isOpen={openEntityIds.has(entity.id)}
                  onToggle={() =>
                    setOpenEntityIds((current) => {
                      const next = new Set(current);
                      if (next.has(entity.id)) {
                        next.delete(entity.id);
                      } else {
                        next.add(entity.id);
                      }
                      return next;
                    })
                  }
                />
              ))}
            </div>
          ) : (
            <div className={isLoading ? 'opacity-70!' : undefined}>
              {!isMobile && selectedEntities[0]?.name && (
                <div className="px-4! pt-1!">
                  <div className="flex! min-w-0! flex-wrap! items-center! gap-2!">
                    <h2
                      title={selectedEntities[0].name}
                      className="m-0! text-[18px]! font-semibold! leading-[28px]! text-foreground! capitalize! break-words!"
                    >
                      {selectedEntities[0].name}
                    </h2>
                  </div>
                </div>
              )}
              <EntityDetailContent
                entity={selectedEntities[0]!}
                entityType={entityType}
              />
            </div>
          )}
          {showDataSource && (
            <div className="mt-4! md:sticky! md:bottom-0! md:z-10! md:bg-background!">
              <FooterDataSourcePopUp isFooter={false} entityType={entityType} />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SchoolView;
