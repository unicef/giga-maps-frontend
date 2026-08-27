import { useStore } from 'effector-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { $countryCode, setSchoolFocusLatLng } from '~/@/country/country.model';
import { $entityRegistry } from '~/@/entities/models/entity.model';
import {
  $dublicateSchoolClickData,
  $stylePaintData,
  setSchoolIdsOnPopupClickDot,
} from '~/@/map/map.model';
import { UNKNOWN } from '~/@/map/map.types';
import {
  getSchoolStatus,
  getStaticSchoolDetails,
} from '~/@/sidebar/school-view.utils';
import {
  $currentLayerTypeUtilsByEntity,
  $selectedLayerDataByEntity,
  schoolStatsMap,
} from '~/@/sidebar/sidebar.model';
import { fetchDublicateSchoolPopupDataFx } from '~/api/project-connect';
import { SchoolStatsType } from '~/api/types';
import { navigateToEntity } from '~/@/entities/utils/entity-navigation';
import { PointCoordinates } from '~/core/global-types';
import { Button } from '~/components/ui/button';
import { Skeleton } from '~/components/ui/skeleton';
import { EntityType } from '~/@/entities';
import EntityLegendIndicator from '~/@/entities/ui/entity-legend-indicator';

import { ConnectivityStatusNames } from '../global-and-country-view-components/container/layer-view.constant';

import {
  formatConnectivityValue,
  formatStaticFieldValue,
  getEntitySameLocationIds,
} from './school-view.utils';

export function EntityDuplicateLocationList({
  entity,
  entityType,
  pageSize = 5,
}: {
  entity: SchoolStatsType;
  entityType: EntityType;
  pageSize?: number;
}) {
  const { t } = useTranslation();
  const entityRegistry = useStore($entityRegistry);
  const stylePaintData = useStore($stylePaintData);
  const selectedLayerDataByEntity = useStore($selectedLayerDataByEntity);
  const popupEntitiesFromStore = useStore($dublicateSchoolClickData) as
    | SchoolStatsType[]
    | undefined;
  const fetchPending = useStore(fetchDublicateSchoolPopupDataFx.pending);
  const countryCode = useStore($countryCode);
  const currentLayerTypeUtilsByEntity = useStore(
    $currentLayerTypeUtilsByEntity,
  );
  const { isLive, isStatic } = currentLayerTypeUtilsByEntity[entityType] ?? {};
  const selectedLayerData = selectedLayerDataByEntity[entityType];
  const unit = selectedLayerData?.global_benchmark?.convert_unit ?? '';
  const duplicateIds = useMemo(
    () => getEntitySameLocationIds(entity, entityType),
    [entity, entityType],
  );
  const [items, setItems] = useState<ReturnType<typeof schoolStatsMap>[]>([]);
  const [showAutoLoad, setShowAutoLoad] = useState(false);
  const nextIndexRef = useRef(0);
  const isFetchingRef = useRef(false);
  const requestedIdsRef = useRef<Set<number>>(new Set());
  const totalIds = duplicateIds.length;
  const entityLabel = t(`${entityType}-entity-label`, {
    defaultValue: entityRegistry[entityType]?.displayName ?? entityType,
  });

  const requestIdsChunk = useCallback(
    (fromIndex: number) => {
      if (isFetchingRef.current) return false;
      const to = Math.min(duplicateIds.length, fromIndex + pageSize);
      if (fromIndex >= to) return false;
      const idsToFetch = duplicateIds.slice(fromIndex, to);
      if (!idsToFetch.length) return false;

      isFetchingRef.current = true;
      nextIndexRef.current = to;
      idsToFetch.forEach((id) => requestedIdsRef.current.add(id));
      setSchoolIdsOnPopupClickDot({
        ids: idsToFetch,
        entityType,
        allowDublicateSchoolIds: false,
      });
      return true;
    },
    [duplicateIds, pageSize, entityType],
  );

  useEffect(() => {
    setItems([]);
    setShowAutoLoad(false);
    nextIndexRef.current = 0;
    isFetchingRef.current = false;
    requestedIdsRef.current.clear();

    if (duplicateIds.length > 1) {
      requestIdsChunk(0);
    }
  }, [duplicateIds.join(','), requestIdsChunk]);

  useEffect(() => {
    if (!popupEntitiesFromStore?.length) {
      if (!fetchPending) isFetchingRef.current = false;
      return;
    }

    const existingIds = new Set(items.map((item) => item.id));
    const nextItems = popupEntitiesFromStore.filter((item) => {
      const id = Number(item.id);
      return requestedIdsRef.current.has(id) && !existingIds.has(id);
    });

    if (nextItems.length) {
      setItems((current) => [
        ...current,
        ...nextItems.map((item) => schoolStatsMap(item)),
      ]);
    }

    isFetchingRef.current = false;
  }, [fetchPending, items, popupEntitiesFromStore]);

  const loadMore = useCallback(() => {
    if (nextIndexRef.current >= totalIds) return;
    requestIdsChunk(nextIndexRef.current);
  }, [requestIdsChunk, totalIds]);

  const handleShowMoreClick = () => {
    setShowAutoLoad(true);
    loadMore();
  };

  const getStaticValue = (value: boolean | string | null | undefined) => {
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (!value || value === UNKNOWN) return t('unknown');
    return formatStaticFieldValue(value);
  };

  if (totalIds <= 1) return null;

  return (
    <section className="px-3.5! py-4!">
      <div className="mb-3! flex! items-center! justify-between! gap-3!">
        <h3 className="m-0! text-sm! font-semibold! leading-5! text-foreground!">
          {`(${totalIds}) ${t(`${entityType}-duplicates`, {
            defaultValue: `${entityLabel} duplicates`,
          })}`}
        </h3>
        {fetchPending && <Skeleton className="h-3! w-16!" />}
      </div>
      <div className="space-y-[4px]!">
        {items.map((item, index) => {
          const connectivityColor =
            stylePaintData[item.connectivityType ?? UNKNOWN];
          const staticColor = stylePaintData[item.staticType ?? UNKNOWN];
          const statusColor =
            stylePaintData[item.connectivityStatus ?? UNKNOWN];
          const liveValue =
            isLive && item.isRealTime && item.connectivityType !== UNKNOWN
              ? formatConnectivityValue(item.liveAvg ?? 0, unit)
              : t('unknown');
          const staticValue = getStaticValue(item.staticValue);
          const statusLabel = t(
            ConnectivityStatusNames[item.connectivityStatus ?? UNKNOWN] ??
              item.connectivityStatus ??
              UNKNOWN,
          );

          return (
            <button
              key={item.id}
              aria-label={`Open ${item.name}`}
              className="flex! w-full! flex-col! rounded-xl! border! border-card-border! bg-card! p-3.5! text-left! transition-colors! hover:bg-muted/40!"
              onClick={() => {
                navigateToEntity(entityType, countryCode, item.id);
                if (item.geopoint?.coordinates) {
                  setSchoolFocusLatLng(
                    item.geopoint.coordinates as PointCoordinates,
                  );
                }
              }}
              type="button"
            >
              {/* Row 1: Item Index & Full School Name (14px) */}
              <div className="flex! items-start! gap-2.5!">
                <span className="shrink-0! text-[14px]! font-normal! leading-[20px]! text-foreground!">
                  {index + 1}
                </span>
                <span
                  className="min-w-0! flex-1! text-[14px]! font-normal! leading-[20px]! text-foreground! capitalize! break-words!"
                  title={item.name}
                >
                  {item.name?.toLocaleLowerCase() ?? item.id}
                </span>
              </div>

              {/* Row 2: Status Indicator (EntityLegendIndicator) & Label (12px) */}
              <div className="mt-2.5! flex! items-center! gap-2!">
                <div className="map-school-status-circle flex! items-center!">
                  <EntityLegendIndicator
                    color={(isStatic ? staticColor : statusColor) ?? ''}
                    entityType={entityType}
                    glowColor={
                      !isStatic && item.isRealTime
                        ? connectivityColor
                          ? `color-mix(in srgb, ${connectivityColor} 42%, white)`
                          : undefined
                        : undefined
                    }
                    size={14}
                  />
                </div>
                {isLive && item.isRealTime ? (
                  <span
                    className="text-[12px]! font-normal! leading-4! capitalize!"
                    style={{ color: connectivityColor }}
                  >
                    {liveValue}
                  </span>
                ) : isStatic ? (
                  <span
                    className="text-[12px]! font-normal! leading-4! capitalize!"
                    style={{ color: staticColor }}
                  >
                    {staticValue}
                  </span>
                ) : (
                  <span
                    className="text-[12px]! font-normal! leading-4! capitalize!"
                    style={{ color: statusColor }}
                  >
                    {statusLabel}
                  </span>
                )}
              </div>
            </button>
          );
        })}
        {fetchPending && !items.length && (
          <div className="space-y-[4px]!">
            {Array.from({ length: Math.min(totalIds, pageSize) }).map(
              (_, index) => (
                <Skeleton key={index} className="h-20! w-full! rounded-xl!" />
              ),
            )}
          </div>
        )}
      </div>
      {totalIds > pageSize && !showAutoLoad && items.length < totalIds && (
        <Button
          className="mt-3! h-auto! px-0! py-1! text-sm!"
          onClick={handleShowMoreClick}
          type="button"
          variant="link"
        >
          {t('show-more')}
        </Button>
      )}
      {showAutoLoad && items.length < totalIds && !fetchPending && (
        <Button
          className="mt-3! h-auto! px-0! py-1! text-sm!"
          onClick={loadMore}
          type="button"
          variant="link"
        >
          {t('show-more')}
        </Button>
      )}
    </section>
  );
}
