import { useStore } from 'effector-react';
import {
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  Gauge,
  Hash,
  Info,
  MapPin,
  Users,
  Wifi,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import {
  $entityRegistry,
  $selectedEntityType,
} from '~/@/entities/models/entity.model';
import { $stylePaintData } from '~/@/map/map.model';
import { UNKNOWN } from '~/@/map/map.types';
import FooterDataSourcePopUp from '~/@/map/ui/footer-data-source-pop-up';
import { getLiveSchoolDetails, getSchoolStatus, getStaticSchoolDetails } from '~/@/sidebar/school-view.utils';
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

const getEntityIdLabel = (entity: SchoolStatsType) =>
  entity.giga_id_school ?? entity.external_id ?? entity.id;

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
  return `${students} Students`;
};

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: unknown;
}) {
  const displayValue = getDisplayValue(value);
  if (displayValue === 'N/A') return null;

  return (
    <div className="flex! min-w-0! items-start! gap-2.5! rounded-md! px-2! py-1.5! text-sm!">
      <Icon className="mt-0.5! size-4! shrink-0! text-muted-foreground!" />
      <div className="min-w-0! flex-1!">
        <div className="text-xs! leading-4! text-muted-foreground!">{label}</div>
        <div className="break-words! text-sm! leading-5! text-foreground!" title={displayValue}>
          {displayValue}
        </div>
      </div>
    </div>
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
        <FooterDataSourcePopUp isFooter={false} />
      </section>
    );
  }

  const statusLabel = t(ConnectivityStatusNames[connectivityStatus] ?? connectivityStatus);
  const unit = entity.benchmark_metadata?.display_unit ?? selectedLayerData?.global_benchmark?.convert_unit ?? '';
  const metricValue = isStatic
    ? getDisplayValue(staticDetails.value)
    : statusLabel;
  const metricColor = isStatic ? staticDetails.color : connectivityStatusColor;

  return (
    <section className="space-y-3! px-3.5! pt-3.5!">
      <div className="flex! items-start! justify-between! gap-3!">
        <div className="min-w-0!">
          <p className="m-0! text-xs! leading-4! text-muted-foreground!">
            {selectedLayerData?.name ?? t('connectivity-status')}
          </p>
          <p className="m-0! break-words! text-2xl! font-semibold! leading-8!" style={{ color: metricColor }}>
            {metricValue}{isStatic && unit ? ` ${unit}` : ''}
          </p>
        </div>
        <div className="mt-1! inline-flex! shrink-0! items-center! gap-1.5! rounded-full! border! border-border! px-2! py-1! text-xs! text-foreground!">
          <span className="size-2! rounded-full!" style={{ backgroundColor: connectivityStatusColor }} />
          {statusLabel}
        </div>
      </div>
    </section>
  );
}
function EntityInformation({ entity }: { entity: SchoolStatsType }) {
  const { t } = useTranslation();
  const selectedEntityType = useStore($selectedEntityType);
  const entityRegistry = useStore($entityRegistry);
  const config = entityRegistry[selectedEntityType];
  const coordinates = entity.geopoint?.coordinates ?? [];
  const configuredRows = useMemo(
    () =>
      (config?.fields ?? [])
        .filter((field) => field.showInSidebar)
        .map((field) => ({
          label: t(field.label),
          value: (entity as unknown as Record<string, unknown>)[field.name]
            ?? (entity.statistics as unknown as Record<string, unknown> | undefined)?.[field.name],
        }))
        .filter((row) => getDisplayValue(row.value) !== 'N/A'),
    [config?.fields, entity, t],
  );

  return (
    <section className="px-3.5! py-3!">
      <div className="mb-2! flex! items-center! gap-2! text-sm! font-semibold! text-foreground!">
        <Info className="size-4! text-muted-foreground!" />
        {t(`${selectedEntityType}-details`, {
          defaultValue: `${t(`${selectedEntityType}-entity-label`, { defaultValue: config?.displayName ?? selectedEntityType })} Details`,
        })}
      </div>
      <div className="space-y-1!">
        <DetailRow icon={MapPin} label={t('coordinates', { defaultValue: 'Coordinates' })} value={coordinates.length ? coordinates.toReversed().join(', ') : null} />
        <DetailRow icon={Hash} label={t('id', { defaultValue: 'ID' })} value={getEntityIdLabel(entity)} />
        <DetailRow icon={Building2} label={t(entity.admin1_description_ui_label ?? 'admin-1', { defaultValue: entity.admin1_description_ui_label ?? 'Admin 1' })} value={entity.admin1_name} />
        <DetailRow icon={Building2} label={t(entity.admin2_description_ui_label ?? 'admin-2', { defaultValue: entity.admin2_description_ui_label ?? 'Admin 2' })} value={entity.admin2_name} />
        {entity.education_level && <DetailRow icon={Users} label={t('education-level')} value={entity.education_level} />}
        {configuredRows.map((row) => (
          <DetailRow key={row.label} icon={Gauge} label={row.label} value={row.value} />
        ))}
      </div>
    </section>
  );
}

function EntityDetailContent({ entity }: { entity: SchoolStatsType }) {
  return (
    <div className="min-w-0!">
      <EntityMetricSummary entity={entity} />
      <Separator className="my-2!" />
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
  const coordinates = entity.geopoint?.coordinates?.toReversed().join(', ');
  const countLabel = getEntityCountLabel(entity);
  const metricColor = isLive ? liveDetails.color : staticDetails.color;
  const metricValue = isLive
    ? `${getDisplayValue(liveDetails.value)}${unit ? ` ${unit}` : ''}`
    : isStatic
      ? getDisplayValue(staticDetails.value)
      : null;

  return (
    <div className="mt-3! space-y-3!">
      <div className="grid! grid-cols-2! gap-x-4! gap-y-2! text-xs! leading-5! text-muted-foreground!">
        <span className="flex! min-w-0! items-center! gap-1.5!">
          <Hash className="size-3.5! shrink-0!" />
          <span className="truncate!" title={String(getEntityIdLabel(entity))}>
            {getEntityIdLabel(entity)}
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
            {isLive ? <Wifi className="size-3.5! text-muted-foreground!" /> : <Gauge className="size-3.5! text-muted-foreground!" />}
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
  const [openEntityId, setOpenEntityId] = useState<number | null>(null);
  const selectedEntities = schoolIds.length
    ? schoolIds
      .map((id) => entities.find((entity) => entity.id === id))
      .filter((entity): entity is SchoolStatsType => Boolean(entity))
    : entities;
  const isMulti = selectedEntities.length > 1;
  const effectiveOpenEntityId = openEntityId ?? selectedEntities[0]?.id ?? null;

  return (
    <ScrollArea
      className="h-full! w-full!"
      id="school-sidebar-scroll"
      viewportClassName="h-full! [&>div]:block! [&>div]:min-w-0! [&>div]:w-full!"
    >
      <div className="w-full! min-w-0! px-3.5! pb-4! pt-2!">
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
                isOpen={effectiveOpenEntityId === entity.id}
                onToggle={() =>
                  setOpenEntityId((current) => current === entity.id ? null : entity.id)
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
  );
};
export default SchoolView;
