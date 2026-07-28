import { useStore } from 'effector-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { $activeEntityTypes } from '~/@/entities/models/entity.model';
import FooterDataSourcePopUp from '~/@/map/ui/footer-data-source-pop-up';
import {
  $currentLayerTypeUtilsByEntity,
  $getSchoolParams,
  $isLoadingSchoolView,
  $schoolStats,
} from '~/@/sidebar/sidebar.model';
import { SchoolStatsType } from '~/api/types';
import { ScrollArea } from '~/components/ui/scroll-area';
import { mapEntity } from '~/core/routes';

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
        <div className="w-full! min-w-0! px-3.5! pb-12! pt-2!">
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
              <EntityDetailContent
                entity={selectedEntities[0]!}
                entityType={entityType}
              />
            </div>
          )}
          {showDataSource && (
            <div className="sticky! bottom-0! z-10! bg-background! mt-4!">
              <FooterDataSourcePopUp isFooter={false} entityType={entityType} />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SchoolView;
