import { useStore } from 'effector-react';
import {
  Check,
  ChevronDown,
  ChevronRight,
  Hash,
  MapPin,
  Wifi,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { $country } from '~/@/country/country.model';
import {
  $entityRegistry,
  $selectedEntityType,
} from '~/@/entities/models/entity.model';
import { $stylePaintData } from '~/@/map/map.model';
import { UNKNOWN } from '~/@/map/map.types';
import FooterDataSourcePopUp from '~/@/map/ui/footer-data-source-pop-up';
import { getLiveSchoolDetails, getNullValueText, getSchoolStatus, getStaticSchoolDetails } from '~/@/sidebar/school-view.utils';
import {
  $currentLayerTypeUtils,
  $getSchoolParams,
  $isLoadingSchoolView,
  $schoolStats,
  $selectedLayerDataByEntity,
  onSchoolUncheck,
} from '~/@/sidebar/sidebar.model';
import { SchoolStatsType } from '~/api/types';
import { Button } from '~/components/ui/button';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Separator } from '~/components/ui/separator';
import { Skeleton } from '~/components/ui/skeleton';

import { getStatisticsConfig, groupOrder, StatisticConfig } from '../../config/school-information-config';
import { HistoryGraphAccordian } from '../common-components/history-graph/history-graph-accordian.view';
import WeekSlider from '../global-and-country-view-components/common/week-slider/week-slider.view';
import LiveAverage from '../global-and-country-view-components/connectivity-layer/live-average.view';
import { ConnectivityStatusNames } from '../global-and-country-view-components/container/layer-view.constant';

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
  return entity.external_id ?? entity.giga_id_school ?? entityRecord.giga_id ?? entity.id;
};

const connectivityColorClassByStatus: Record<string, string> = {
  good: 'text-success!',
  moderate: 'text-warning!',
  no_internet: 'text-error-brand!',
  bad: 'text-error-brand!',
  unknown: 'text-neutral!',
};

const getEntityCountLabel = (entity: SchoolStatsType) => {
  const stats = entity.statistics as unknown as Record<string, unknown> | undefined;
  const students = stats?.num_students ?? (entity as unknown as Record<string, unknown>).num_students;
  if (!students) return null;
  return `${students} students`;
};

const groupStatistics = (statistics: StatisticConfig[]) => {
  const groups = statistics.reduce((acc, stat) => {
    if (!acc[stat.group]) {
      acc[stat.group] = [];
    }
    acc[stat.group].push(stat);
    return acc;
  }, {} as Record<string, StatisticConfig[]>);

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
    <div className="flex! min-w-0! items-start! gap-2.5! py-1! text-sm! leading-6! text-foreground!">
      {Icon && <Icon className="mt-1! size-4! shrink-0! text-muted-foreground!" />}
      <p className="m-0! min-w-0! break-words!" title={displayValue}>
        {label ? <>{label}: </> : null}
        <span className={valueClassName}>{displayValue}</span>
      </p>
    </div>
  );
}

function StatusLine({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex! min-w-0! items-center! gap-2.5! py-1! text-sm! leading-6!">
      <span className="ml-1! size-2.5! shrink-0! rounded-full!" style={{ backgroundColor: color }} />
      <p className="m-0! min-w-0! break-words!" style={{ color }} title={label}>
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

function EntityMetricSummary({ entity }: { entity: SchoolStatsType }) {
  const { t } = useTranslation();
  const stylePaintData = useStore($stylePaintData);
  const selectedEntityType = useStore($selectedEntityType);
  const selectedLayerDataByEntity = useStore($selectedLayerDataByEntity);
  const selectedLayerData = selectedLayerDataByEntity[selectedEntityType];
  const { isLive, isStatic } = useStore($currentLayerTypeUtils);
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
            <WeekSlider entityType={selectedEntityType} />
          </div>
        </div>
        <HistoryGraphAccordian
          connectivityStats={entity as never}
          entityType={selectedEntityType}
          isLoading={isLoading}
          selectedLayerData={selectedLayerData}
        />
      </section>
    );
  }

  const statusLabel = t(ConnectivityStatusNames[connectivityStatus] ?? connectivityStatus);
  const unit = entity.benchmark_metadata?.display_unit ?? selectedLayerData?.global_benchmark?.convert_unit ?? '';

  if (isStatic) {
    const formattedValue = formatStaticFieldValue(staticDetails.value);

    return (
      <section className="mx-4! my-6!">
        {formattedValue !== 'N/A' && (
          <div className="relative! flex! w-full! flex-col! pb-6! pt-3!">
            <p className="m-0! break-words! text-[2rem]! font-normal! leading-tight!" style={{ color: staticDetails.color }}>
              {formattedValue}{unit ? ` ${unit}` : ''}
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
          <p className="m-0! break-words! text-[2.375rem]! font-normal! leading-tight! capitalize!" style={{ color: connectivityStatusColor }}>
            {statusLabel}
          </p>
        )}
      </div>
    </section>
  );
}

function EntityInformation({ entity }: { entity: SchoolStatsType }) {
  const { t } = useTranslation();
  const selectedEntityType = useStore($selectedEntityType);
  const entityRegistry = useStore($entityRegistry);
  const stylePaintData = useStore($stylePaintData);
  const country = useStore($country);
  const [statisticsConfig, setStatisticsConfig] = useState<StatisticConfig[]>([]);
  const config = entityRegistry[selectedEntityType];
  const entityRecord = entity as unknown as Record<string, unknown>;
  const statistics = entity.statistics as unknown as Record<string, unknown> | undefined;
  const coordinates = (entity.geopoint?.coordinates ?? []).toReversed();
  const { connectivityStatus, connectivityStatusColor } = getSchoolStatus({
    schoolDetails: entity,
    stylePaintData,
  });
  const statusLabel = t(ConnectivityStatusNames[connectivityStatus] ?? connectivityStatus);
  const detailTitle = t(`${selectedEntityType}-details`, {
    defaultValue: `${t(`${selectedEntityType}-entity-label`, { defaultValue: config?.displayName ?? selectedEntityType })} Details`,
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
        <DetailLine icon="location" value={coordinates.length ? coordinates.join(', ') : null} />
        <StatusLine color={connectivityStatusColor} label={statusLabel} />
        {getEntityGigaId(entity) && (
          <DetailLine icon="hash" label={t('giga-id')} value={getEntityGigaId(entity)} valueClassName="lowercase!" />
        )}
        {entity.admin1_name && entity.admin1_description_ui_label && (
          <DetailLine icon="hash" label={t(entity.admin1_description_ui_label)} value={entity.admin1_name} />
        )}
        {entity.admin2_name && entity.admin2_description_ui_label && (
          <DetailLine icon="hash" label={t(entity.admin2_description_ui_label)} value={entity.admin2_name} />
        )}
        {entity.education_level && (
          <DetailLine icon="hash" label={t('education-level')} value={entity.education_level} />
        )}
        {groupStatistics(statisticsConfig).map(({ groupName, stats }) => (
          <div key={groupName} className="pt-4!">
            {stats.map((item) => (
              <DetailLine
                key={item.key}
                icon="hash"
                label={t(item.label)}
                value={statistics?.[item.key] ?? entityRecord[item.key]}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function EntityDetailContent({ entity }: { entity: SchoolStatsType }) {
  const { isLive, isStatic } = useStore($currentLayerTypeUtils);
  const showSectionSeparator = isLive || isStatic;

  return (
    <div className="min-w-0!">
      <EntityMetricSummary entity={entity} />
      {showSectionSeparator && <Separator className="my-2!" />}
      <EntityInformation entity={entity} />
    </div>
  );
}

function EntityCollapsedSummary({ entity }: { entity: SchoolStatsType }) {
  const { t } = useTranslation();
  const stylePaintData = useStore($stylePaintData);
  const selectedEntityType = useStore($selectedEntityType);
  const selectedLayerDataByEntity = useStore($selectedLayerDataByEntity);
  const selectedLayerData = selectedLayerDataByEntity[selectedEntityType];
  const { isLive, isStatic } = useStore($currentLayerTypeUtils);
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
  const statusLabel = t(ConnectivityStatusNames[connectivityStatus] ?? connectivityStatus);
  const unit = entity.benchmark_metadata?.display_unit ?? selectedLayerData?.global_benchmark?.convert_unit ?? '';
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
          <span className="truncate!" title={String(getCollapsedEntityIdLabel(entity))}>
            {getCollapsedEntityIdLabel(entity)}
          </span>
        </span>
        {coordinates && (
          <span className="flex! min-w-0! items-center! gap-1.5!">
            <MapPin className="size-3.5! shrink-0!" />
            <span className="truncate!" title={coordinates}>{coordinates}</span>
          </span>
        )}
        {countLabel && (
          <span className="col-span-2! flex! min-w-0! items-center! gap-1.5!">
            <Hash className="size-3.5! shrink-0!" />
            <span className="truncate!" title={countLabel}>{countLabel}</span>
          </span>
        )}
      </div>
      <div className="flex! flex-wrap! items-center! gap-x-6! gap-y-2! text-sm! leading-5!">
        <span className="inline-flex! items-center! gap-2!" style={{ color: connectivityStatusColor }}>
          <span className="size-2.5! rounded-full!" style={{ backgroundColor: connectivityStatusColor }} />
          {statusLabel}
        </span>
        {metricValue && (
          <span className="inline-flex! items-center! gap-2!" style={{ color: metricColor }}>
            {isLive ? <Wifi className="size-3.5! text-muted-foreground!" /> : <LayerIcon icon={selectedLayerData?.icon} />}
            <span>{metricValue}</span>
          </span>
        )}
      </div>
    </div>
  );
}

function EntityListItem({
  entity,
  isOpen,
  onToggle,
}: {
  entity: SchoolStatsType;
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
      <div className="flex! min-w-0! gap-3! px-3.5! py-4!">
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
            <span className="min-w-0! flex-1! truncate! text-sm! font-semibold! leading-5!" title={entity.name}>
              {entity.name}
            </span>
            <span className="size-2.5! shrink-0! rounded-full!" style={{ backgroundColor: connectivityStatusColor }} />
            <Icon className="size-4! shrink-0! text-muted-foreground!" />
          </button>
          {!isOpen && <EntityCollapsedSummary entity={entity} />}
        </div>
      </div>
      {isOpen && (
        <div className="border-t! border-border!">
          <EntityDetailContent entity={entity} />
        </div>
      )}
    </div>
  );
}

function EntityDetailSkeleton({ count = 1 }: { count?: number }) {
  return (
    <div className="space-y-3! px-3.5! py-3!">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-lg! border! border-border! p-3!">
          <Skeleton className="mb-3! h-4! w-3/4!" />
          <Skeleton className="mb-2! h-8! w-32!" />
          <Skeleton className="h-4! w-full!" />
        </div>
      ))}
    </div>
  );
}

const SchoolView = () => {
  const { t } = useTranslation();
  const { schoolIds = [] } = useStore($getSchoolParams);
  const entities = useStore($schoolStats) ?? [];
  const isLoading = useStore($isLoadingSchoolView);
  const { isLive, isStatic } = useStore($currentLayerTypeUtils);
  const showDataSource = isLive || isStatic;
  const [openEntityIds, setOpenEntityIds] = useState<Set<number>>(() => new Set());
  const selectedEntities = schoolIds.length
    ? schoolIds
      .map((id) => entities.find((entity) => entity.id === id))
      .filter((entity): entity is SchoolStatsType => Boolean(entity))
    : entities;
  const isMulti = selectedEntities.length > 1;

  return (
    <div className="relative! h-full! min-h-0! w-full!">
      <ScrollArea
        className="h-full! w-full!"
        id="school-sidebar-scroll"
        viewportClassName="h-full! [&>div]:block! [&>div]:min-w-0! [&>div]:w-full!"
      >
        <div className="w-full! min-w-0! px-3.5! pb-28! pt-2!">
          {isLoading && !selectedEntities.length ? (
            <EntityDetailSkeleton count={Math.max(schoolIds.length, 1)} />
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
              <EntityDetailContent entity={selectedEntities[0]!} />
            </div>
          )}
        </div>
      </ScrollArea>
      {showDataSource && (
        <div className="absolute! inset-x-0! bottom-0! z-10! bg-background!">
          <FooterDataSourcePopUp isFooter={false} />
        </div>
      )}
    </div>
  );
};

export default SchoolView;

