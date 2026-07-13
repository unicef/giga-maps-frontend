import { useStore } from 'effector-react';
import {
  Check,
  ChevronDown,
  ChevronRight,
  Hash,
  MapPin,
  Wifi,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  $country,
  $countryCode,
  setSchoolFocusLatLng,
} from '~/@/country/country.model';
import {
  $activeEntityTypes,
  $entityRegistry,
} from '~/@/entities/models/entity.model';
import {
  $dublicateSchoolClickData,
  $stylePaintData,
  setSchoolIdsOnPopupClickDot,
} from '~/@/map/map.model';
import { UNKNOWN } from '~/@/map/map.types';
import FooterDataSourcePopUp from '~/@/map/ui/footer-data-source-pop-up';
import {
  getLiveSchoolDetails,
  getNullValueText,
  getSchoolStatus,
  getStaticSchoolDetails,
} from '~/@/sidebar/school-view.utils';
import {
  $currentLayerTypeUtilsByEntity,
  $getSchoolParams,
  $isLoadingSchoolView,
  $schoolStats,
  $selectedLayerDataByEntity,
  onSchoolUncheck,
  schoolStatsMap,
} from '~/@/sidebar/sidebar.model';
import { fetchDublicateSchoolPopupDataFx } from '~/api/project-connect';
import { SchoolStatsType } from '~/api/types';
import { navigateToEntity } from '~/@/entities/utils/entity-navigation';
import { PointCoordinates } from '~/core/global-types';
import { Button } from '~/components/ui/button';
import EntityLegendIndicator from '~/@/entities/ui/entity-legend-indicator';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Separator } from '~/components/ui/separator';
import { Skeleton } from '~/components/ui/skeleton';

import {
  getStatisticsConfig,
  groupOrder,
  StatisticConfig,
} from '../../config/school-information-config';
import { HistoryGraphAccordian } from '../common-components/history-graph/history-graph-accordian.view';
import WeekSlider from '../global-and-country-view-components/common/week-slider/week-slider.view';
import LiveAverage from '../global-and-country-view-components/connectivity-layer/live-average.view';
import { ConnectivityStatusNames } from '../global-and-country-view-components/container/layer-view.constant';
import { EntityType } from '~/@/entities';

const getDisplayValue = (value: unknown) => {
  if (value === true) return 'Yes';
  if (value === false) return 'No';
  if (value === null || value === undefined || value === '') return 'N/A';
  return String(value);
};

const toTitleCase = (value: string) =>
  value
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const formatStaticFieldValue = (value: unknown) => {
  const displayValue = getDisplayValue(value);
  if (displayValue === 'N/A') return displayValue;
  if (displayValue.toLowerCase() === 'true') return 'Yes';
  if (displayValue.toLowerCase() === 'false') return 'No';
  return toTitleCase(displayValue);
};

const getEntityGigaId = (entity: SchoolStatsType) => {
  const entityRecord = entity as unknown as Record<string, unknown>;
  return entity.giga_id_school ?? entityRecord.giga_id;
};

const getCollapsedEntityIdLabel = (entity: SchoolStatsType) => {
  const entityRecord = entity as unknown as Record<string, unknown>;
  return (
    entity.external_id ??
    entity.giga_id_school ??
    entityRecord.giga_id ??
    entity.id
  );
};

const connectivityColorClassByStatus: Record<string, string> = {
  good: 'text-success!',
  moderate: 'text-warning!',
  no_internet: 'text-error-brand!',
  bad: 'text-error-brand!',
  unknown: 'text-neutral!',
};

const getEntityCountLabel = (entity: SchoolStatsType) => {
  const stats = entity.statistics as unknown as
    | Record<string, unknown>
    | undefined;
  const students =
    stats?.num_students ??
    (entity as unknown as Record<string, unknown>).num_students;
  if (!students) return null;
  return `${students} students`;
};

const groupStatistics = (statistics: StatisticConfig[]) => {
  const groups = statistics.reduce(
    (acc, stat) => {
      if (!acc[stat.group]) {
        acc[stat.group] = [];
      }
      acc[stat.group].push(stat);
      return acc;
    },
    {} as Record<string, StatisticConfig[]>,
  );

  return groupOrder
    .filter((group) => groups[group]?.length)
    .map((group) => ({ groupName: group, stats: groups[group] }));
};

function DetailLine({
  icon,
  label,
  value,
  valueClassName = '',
}: {
  icon?: 'hash' | 'location';
  label?: string;
  value: unknown;
  valueClassName?: string;
}) {
  const displayValue = getDisplayValue(value);
  if (displayValue === 'N/A') return null;
  const Icon = icon === 'location' ? MapPin : icon === 'hash' ? Hash : null;

  return (
    <div className="flex! min-w-0! items-center! gap-1! mt-3! text-muted-foreground!">
      {Icon && <Icon className="size-3! shrink-0! text-foreground!" />}
      <p
        className="m-0! min-w-0! truncate! capitalize! text-[12px]! leading-[1.125rem]!"
        title={displayValue}
      >
        {label ? <>{label}: </> : null}
        <span className={valueClassName}>{displayValue}</span>
      </p>
    </div>
  );
}

function StatusLine({
  label,
  color,
  entityType,
}: {
  label: string;
  color: string;
  entityType?: string;
}) {
  return (
    <div className="flex! min-w-0! items-center! gap-1! mt-3!">
      {entityType ? (
        <span className="flex! shrink-0! items-center! justify-center! mr-1!">
          <EntityLegendIndicator
            color={color}
            entityType={entityType}
            size={16}
          />
        </span>
      ) : (
        <span
          className="mr-1! size-2! shrink-0! rounded-full!"
          style={{ backgroundColor: color }}
        />
      )}
      <p
        className="m-0! min-w-0! truncate! capitalize! text-[12px]! leading-[1.125rem]!"
        style={{ color }}
        title={label}
      >
        {label}
      </p>
    </div>
  );
}

function LayerIcon({ icon }: { icon?: string }) {
  if (!icon) return null;

  return (
    <span
      aria-hidden="true"
      className="size-3.5! shrink-0! text-muted-foreground! [&_svg]:size-3.5!"
      dangerouslySetInnerHTML={{ __html: icon }}
    />
  );
}

function EntityMetricSummary({
  entity,
  entityType,
}: {
  entity: SchoolStatsType;
  entityType: EntityType;
}) {
  const { t } = useTranslation();
  const stylePaintData = useStore($stylePaintData);
  const selectedLayerDataByEntity = useStore($selectedLayerDataByEntity);
  const selectedLayerData = selectedLayerDataByEntity[entityType];
  const currentLayerTypeUtilsByEntity = useStore(
    $currentLayerTypeUtilsByEntity,
  );
  const { isLive, isStatic } = currentLayerTypeUtilsByEntity[entityType] ?? {};
  const isLoading = useStore($isLoadingSchoolView);
  const { connectivityStatus, connectivityStatusColor } = getSchoolStatus({
    schoolDetails: entity,
    stylePaintData,
  });
  const liveDetails = getLiveSchoolDetails({
    schoolDetails: entity,
    stylePaintData,
  });
  const staticDetails = getStaticSchoolDetails({
    schoolDetails: entity,
    stylePaintData,
  });

  if (isLive) {
    const colorClassName =
      connectivityColorClassByStatus[liveDetails.type ?? UNKNOWN] ??
      'text-neutral!';

    return (
      <section className="pt-1!">
        <div className="mx-4!">
          <div className="relative! flex! w-full! flex-col! gap-3! pb-6! pt-3!">
            <LiveAverage
              colorClassName={colorClassName}
              currentLayerData={selectedLayerData}
              isLoading={isLoading}
              value={Number(liveDetails.value ?? 0)}
            />
            <WeekSlider entityType={entityType} />
          </div>
        </div>
        <HistoryGraphAccordian
          connectivityStats={entity as never}
          entityType={entityType}
          isLoading={isLoading}
          selectedLayerData={selectedLayerData}
        />
      </section>
    );
  }

  const statusLabel = t(
    ConnectivityStatusNames[connectivityStatus] ?? connectivityStatus,
  );
  const unit =
    entity.benchmark_metadata?.display_unit ??
    selectedLayerData?.global_benchmark?.convert_unit ??
    '';

  if (isStatic) {
    const formattedValue = formatStaticFieldValue(staticDetails.value);

    return (
      <section className="mx-4! my-6!">
        {formattedValue !== 'N/A' && (
          <div className="relative! flex! w-full! flex-col! pb-6! pt-3!">
            <p
              className="m-0! break-words! text-[2rem]! font-normal! leading-tight!"
              style={{ color: staticDetails.color }}
            >
              {formattedValue}
              {unit ? ` ${unit}` : ''}
            </p>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="mx-4! my-6!">
      <div className="relative! flex! w-full! flex-col! pb-6! pt-3!">
        {isLoading ? (
          <Skeleton className="h-11! w-[70%]!" />
        ) : (
          <p
            className="m-0! break-words! text-[2.375rem]! font-normal! leading-tight! capitalize!"
            style={{ color: connectivityStatusColor }}
          >
            {statusLabel}
          </p>
        )}
      </div>
    </section>
  );
}

function EntityInformation({
  entity,
  entityType,
}: {
  entity: SchoolStatsType;
  entityType: EntityType;
}) {
  const { t } = useTranslation();
  const entityRegistry = useStore($entityRegistry);
  const stylePaintData = useStore($stylePaintData);
  const country = useStore($country);
  const [statisticsConfig, setStatisticsConfig] = useState<StatisticConfig[]>(
    [],
  );
  const config = entityRegistry[entityType];
  const entityRecord = entity as unknown as Record<string, unknown>;
  const statistics = entity.statistics as unknown as
    | Record<string, unknown>
    | undefined;
  const coordinates = (entity.geopoint?.coordinates ?? []).toReversed();
  const { connectivityStatus, connectivityStatusColor } = getSchoolStatus({
    schoolDetails: entity,
    stylePaintData,
  });
  const statusLabel = t(
    ConnectivityStatusNames[connectivityStatus] ?? connectivityStatus,
  );
  const detailTitle = t(`${entityType}-details`, {
    defaultValue: `${t(`${entityType}-entity-label`, { defaultValue: config?.displayName ?? entityType })} Details`,
  });

  useEffect(() => {
    let isCancelled = false;

    if (!country?.id) {
      setStatisticsConfig([]);
      return undefined;
    }

    getStatisticsConfig(country.id).then((nextConfig) => {
      if (!isCancelled) {
        setStatisticsConfig(nextConfig);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [country?.id]);

  return (
    <section className="px-3.5! py-3!">
      <h3 className="m-0! mb-3! text-sm! font-semibold! leading-5! text-foreground!">
        {detailTitle}
      </h3>
      <div className="space-y-1!">
        <DetailLine
          icon="location"
          value={coordinates.length ? coordinates.join(', ') : null}
        />
        <StatusLine
          color={connectivityStatusColor}
          label={statusLabel}
          entityType={entityType}
        />
        {getEntityGigaId(entity) && (
          <DetailLine
            icon="hash"
            label={t('giga-id')}
            value={getEntityGigaId(entity)}
            valueClassName="lowercase!"
          />
        )}
        {entity.admin1_name && entity.admin1_description_ui_label && (
          <DetailLine
            icon="hash"
            label={t(entity.admin1_description_ui_label)}
            value={entity.admin1_name}
          />
        )}
        {entity.admin2_name && entity.admin2_description_ui_label && (
          <DetailLine
            icon="hash"
            label={t(entity.admin2_description_ui_label)}
            value={entity.admin2_name}
          />
        )}
        {entity.education_level && (
          <DetailLine
            icon="hash"
            label={t('education-level')}
            value={entity.education_level}
          />
        )}
        {groupStatistics(statisticsConfig).map(({ groupName, stats }) => (
          <div key={groupName} className="pt-4!">
            {stats.map((item) => {
              const rawValue = statistics?.[item.key] ?? entityRecord[item.key];
              const displayValue =
                typeof rawValue === 'boolean'
                  ? rawValue
                    ? 'Yes'
                    : 'No'
                  : rawValue !== undefined && rawValue !== null
                    ? String(rawValue)
                    : 'N/A';
              return (
                <DetailLine
                  key={item.key}
                  icon="hash"
                  label={t(item.label)}
                  value={displayValue}
                />
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

type SameLocationValue = {
  count?: number;
  school_ids?: unknown;
  entity_ids?: unknown;
  ids?: unknown;
} & Record<string, unknown>;

const toNumericIds = (value: unknown): number[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id) && id > 0);
};

const getSameLocationRecordCandidates = (
  entity: SchoolStatsType,
  entityType: string,
): SameLocationValue[] => {
  const record = entity as unknown as Record<string, unknown>;
  return [
    record.schools_at_same_location,
    record.entities_at_same_location,
    record[`${entityType}_at_same_location`],
    record[`${entityType}s_at_same_location`],
    record.same_location_entities,
    record.same_location,
  ].filter(
    (value): value is SameLocationValue =>
      Boolean(value) && typeof value === 'object' && !Array.isArray(value),
  );
};

const getEntitySameLocationIds = (
  entity: SchoolStatsType,
  entityType: string,
): number[] => {
  const ids = new Set<number>([entity.id]);
  const record = entity as unknown as Record<string, unknown>;
  const idKeys = [
    'school_ids',
    'entity_ids',
    'ids',
    `${entityType}_ids`,
    `${entityType}_entity_ids`,
  ];

  getSameLocationRecordCandidates(entity, entityType).forEach(
    (sameLocation) => {
      idKeys.forEach((key) => {
        toNumericIds(sameLocation[key]).forEach((id) => ids.add(id));
      });
    },
  );

  idKeys.forEach((key) => {
    toNumericIds(record[key]).forEach((id) => ids.add(id));
  });

  return Array.from(ids);
};

const formatConnectivityValue = (value: number, valueUnit?: string) => {
  if (!valueUnit) return String(value);
  return valueUnit === '%' ? `${value}${valueUnit}` : `${value} ${valueUnit}`;
};
function EntityDuplicateLocationList({
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
    <section className="border-t! border-border! px-3.5! py-4!">
      <div className="mb-3! flex! items-center! justify-between! gap-3!">
        <h3 className="m-0! text-sm! font-semibold! leading-5! text-foreground!">
          {`(${totalIds}) ${t(`${entityType}-duplicates`, {
            defaultValue: `${entityLabel} duplicates`,
          })}`}
        </h3>
        {fetchPending && <Skeleton className="h-3! w-16!" />}
      </div>
      <div className="space-y-2!">
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
              className="flex! w-full! items-center! justify-between! gap-3! rounded-md! border! border-border! bg-background! px-3! py-2.5! text-left! hover:bg-muted/40!"
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
              <span className="flex! min-w-0! flex-1! items-center! gap-2!">
                <span className="shrink-0! text-xs! text-muted-foreground!">
                  {index + 1}.
                </span>
                <span
                  className="truncate! text-sm! font-medium! text-foreground!"
                  title={item.name}
                >
                  {item.name}
                </span>
              </span>
              <span className="flex! shrink-0! items-center! gap-2! text-xs!">
                <span
                  className="size-2.5! rounded-full!"
                  style={{
                    backgroundColor: isStatic ? staticColor : statusColor,
                  }}
                />
                {isLive && item.isRealTime ? (
                  <span style={{ color: connectivityColor }}>{liveValue}</span>
                ) : isStatic ? (
                  <span style={{ color: staticColor }}>{staticValue}</span>
                ) : (
                  <span style={{ color: statusColor }}>{statusLabel}</span>
                )}
              </span>
            </button>
          );
        })}
        {fetchPending && !items.length && (
          <div className="space-y-2!">
            {Array.from({ length: Math.min(totalIds, pageSize) }).map(
              (_, index) => (
                <Skeleton key={index} className="h-10! w-full! rounded-md!" />
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
function EntityDetailContent({
  entity,
  entityType,
}: {
  entity: SchoolStatsType;
  entityType: EntityType;
}) {
  const currentLayerTypeUtilsByEntity = useStore(
    $currentLayerTypeUtilsByEntity,
  );
  const { isLive, isStatic } = currentLayerTypeUtilsByEntity[entityType] ?? {};
  const showSectionSeparator = isLive || isStatic;

  return (
    <div className="min-w-0!">
      <EntityMetricSummary entity={entity} entityType={entityType} />
      {showSectionSeparator && <Separator className="my-2!" />}
      <EntityInformation entity={entity} entityType={entityType} />
      <EntityDuplicateLocationList entity={entity} entityType={entityType} />
    </div>
  );
}

function EntityCollapsedSummary({
  entity,
  entityType,
}: {
  entity: SchoolStatsType;
  entityType: EntityType;
}) {
  const { t } = useTranslation();
  const stylePaintData = useStore($stylePaintData);
  const selectedLayerDataByEntity = useStore($selectedLayerDataByEntity);
  const selectedLayerData = selectedLayerDataByEntity[entityType];
  const currentLayerTypeUtilsByEntity = useStore(
    $currentLayerTypeUtilsByEntity,
  );
  const { isLive, isStatic } = currentLayerTypeUtilsByEntity[entityType] ?? {};
  const { connectivityStatus, connectivityStatusColor } = getSchoolStatus({
    schoolDetails: entity,
    stylePaintData,
  });
  const liveDetails = getLiveSchoolDetails({
    schoolDetails: entity,
    stylePaintData,
  });
  const staticDetails = getStaticSchoolDetails({
    schoolDetails: entity,
    stylePaintData,
  });
  const statusLabel = t(
    ConnectivityStatusNames[connectivityStatus] ?? connectivityStatus,
  );
  const unit =
    entity.benchmark_metadata?.display_unit ??
    selectedLayerData?.global_benchmark?.convert_unit ??
    '';
  const coordinates = entity.geopoint?.coordinates?.join(', ');
  const countLabel = getEntityCountLabel(entity);
  const metricColor = isLive ? liveDetails.color : staticDetails.color;
  const staticValue = formatStaticFieldValue(staticDetails.value);
  const metricValue = isLive
    ? liveDetails.value
      ? `${liveDetails.value}${unit ? ` ${unit}` : ''}`
      : getNullValueText(connectivityStatus)
    : isStatic && staticValue !== 'N/A'
      ? `${staticValue}${unit ? ` ${unit}` : ''}`
      : null;

  return (
    <div className="mt-3! space-y-3!">
      <div className="grid! grid-cols-2! gap-x-4! gap-y-2! text-xs! leading-5! text-muted-foreground!">
        <span className="flex! min-w-0! items-center! gap-1.5!">
          <Hash className="size-3.5! shrink-0!" />
          <span
            className="truncate!"
            title={String(getCollapsedEntityIdLabel(entity))}
          >
            {getCollapsedEntityIdLabel(entity)}
          </span>
        </span>
        {coordinates && (
          <span className="flex! min-w-0! items-center! gap-1.5!">
            <MapPin className="size-3.5! shrink-0!" />
            <span className="truncate!" title={coordinates}>
              {coordinates}
            </span>
          </span>
        )}
        {countLabel && (
          <span className="col-span-2! flex! min-w-0! items-center! gap-1.5!">
            <Hash className="size-3.5! shrink-0!" />
            <span className="truncate!" title={countLabel}>
              {countLabel}
            </span>
          </span>
        )}
      </div>
      <div className="flex! flex-wrap! items-center! gap-x-6! gap-y-2! text-sm! leading-5!">
        <span
          className="inline-flex! items-center! gap-2!"
          style={{ color: connectivityStatusColor }}
        >
          <span className="flex! shrink-0! items-center! justify-center!">
            <EntityLegendIndicator
              color={connectivityStatusColor}
              entityType={entityType}
              size={16}
            />
          </span>
          {statusLabel}
        </span>
        {metricValue && (
          <span
            className="inline-flex! items-center! gap-2!"
            style={{ color: metricColor }}
          >
            {isLive ? (
              <Wifi className="size-3.5! text-muted-foreground!" />
            ) : (
              <LayerIcon icon={selectedLayerData?.icon} />
            )}
            <span>{metricValue}</span>
          </span>
        )}
      </div>
    </div>
  );
}

function EntityListItem({
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

function SingleEntityDetailSkeleton() {
  return (
    <div className="min-w-0! px-4! py-6!">
      <div className="relative! flex! w-full! flex-col! gap-3! pb-6! pt-3!">
        <Skeleton className="h-3.5! w-40!" />
        <Skeleton className="h-10! w-44!" />
        <Skeleton className="h-2! w-full!" />
      </div>
      <div className="space-y-3! pt-5!">
        <Skeleton className="h-4! w-32!" />
        <Skeleton className="h-3.5! w-4/5!" />
        <Skeleton className="h-3.5! w-3/5!" />
        <Skeleton className="h-3.5! w-2/3!" />
      </div>
    </div>
  );
}

function EntityDetailSkeleton({ count = 1 }: { count?: number }) {
  const skeletonCount = Math.min(Math.max(count, 2), 4);

  return (
    <div className="space-y-3! px-3.5! py-3!">
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <div key={index} className="rounded-lg! border! border-border! p-3!">
          <div className="mb-3! flex! items-center! gap-3!">
            <Skeleton className="size-5! shrink-0! rounded-sm!" />
            <Skeleton className="h-4! flex-1!" />
            <Skeleton className="size-2.5! shrink-0! rounded-full!" />
            <Skeleton className="size-4! shrink-0!" />
          </div>
          <div className="grid! grid-cols-2! gap-x-4! gap-y-2!">
            <Skeleton className="h-3.5! w-full!" />
            <Skeleton className="h-3.5! w-full!" />
            <Skeleton className="col-span-2! h-3.5! w-3/5!" />
          </div>
        </div>
      ))}
    </div>
  );
}

const SchoolView = () => {
  const { t } = useTranslation();
  const { schoolIds = [] } = useStore($getSchoolParams);
  const entities = useStore($schoolStats) ?? [];
  const activeEntityTypes = useStore($activeEntityTypes);
  const entityType =
    activeEntityTypes.length === 1 ? activeEntityTypes[0] : null;
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
