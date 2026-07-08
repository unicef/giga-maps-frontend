import { useStore } from 'effector-react';
import { Maximize2, Minimize2 } from 'lucide-react';
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import {
  $activeEntityTypes,
  $entityConfigMap,
  $entityTypesFiltered,
} from '~/@/entities/models/entity.model';
import { EntityType } from '~/@/entities/types/base-entity.type';
import EntityLegendIndicator from '~/@/entities/ui/entity-legend-indicator';
import { $stylePaintData } from '~/@/map/map.model';
import { ConnectivityStatusDistribution } from '~/@/sidebar/sidebar.constant';
import { $layerUtils } from '~/@/sidebar/sidebar.model';
import { ConnectivityStatusNames } from '~/@/sidebar/ui/global-and-country-view-components/container/layer-view.constant';
import { Button } from '~/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/ui/collapsible';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '~/components/ui/popover';
import { $isMobile } from '~/core/media-query';
import { $mapRoutes } from '~/core/routes';
import { cn } from '~/lib/cn';

import LiveLayerLegend from './common/live-layer-legend';
import SchoolStatusLegend from './common/school-status-legend';
import StaticLayerLegend from './common/static-layer-legend';

type LegendSummaryItem = {
  color: string;
  key: string;
  label: string;
};

const getLightGlowColor = (color: string) =>
  `color-mix(in srgb, ${color} 42%, white)`;

const getDefaultLegendTab = (entityTypes: EntityType[]) =>
  entityTypes[0] ?? 'school';
const getDefaultCollapsedState = (isMobile: boolean) => isMobile;

const schoolSummaryOrder = [
  ConnectivityStatusDistribution.unknown,
  ConnectivityStatusDistribution.notConnected,
  ConnectivityStatusDistribution.connected,
] as const;

const LegendPopup = ({
  open,
  onOpenChange,
  children,
}: PropsWithChildren<{
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}>) => {
  const { t } = useTranslation();
  const activeEntityTypes = useStore($activeEntityTypes);
  const entityConfigMap = useStore($entityConfigMap);
  const entityTypesFiltered = useStore($entityTypesFiltered);
  const {
    currentLayerLegendsByEntity,
    currentLayerTypeUtils,
    currentLayerTypeUtilsByEntity,
    globalLayerDataByEntity,
    selectedLayerDataByEntity,
  } = useStore($layerUtils);
  const isMobile = useStore($isMobile);
  const mapLevel = useStore($mapRoutes);
  const isGlobalView = mapLevel.map;
  const isEntityDetailView = mapLevel.schools || mapLevel.entity;
  const shouldShowControls = !mapLevel.map && !isEntityDetailView;

  const paintData = useStore($stylePaintData);
  const visibleLegendEntityTypes = useMemo(() => {
    // Filter to only types that are both active AND visible in config, maintain registry order
    return entityTypesFiltered.filter((type) =>
      activeEntityTypes.includes(type),
    );
  }, [activeEntityTypes, entityTypesFiltered]);
  const [collapsed, setCollapsed] = useState(() =>
    getDefaultCollapsedState(isMobile),
  );
  const [activeTab, setActiveTab] = useState<EntityType>(() =>
    getDefaultLegendTab(visibleLegendEntityTypes),
  );

  const popoverContentRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;
      const wrapper: unknown | any = node.closest(
        '[data-radix-popper-content-wrapper]',
      );
      if (wrapper) {
        wrapper.style.left = isMobile ? '7px' : '';
      }
    },
    [isMobile],
  );

  useEffect(() => {
    if (!visibleLegendEntityTypes.length) return;

    setActiveTab((currentTab) =>
      visibleLegendEntityTypes.includes(currentTab)
        ? currentTab
        : visibleLegendEntityTypes[0],
    );
  }, [visibleLegendEntityTypes]);

  const legendMetricTitle = t('internet-quality');
  const activeLayerTypeUtils =
    currentLayerTypeUtilsByEntity[activeTab] ?? currentLayerTypeUtils;
  const { isStatic, isLive, isSchoolStatus } = activeLayerTypeUtils;
  const activeEntityLayerData =
    selectedLayerDataByEntity[activeTab] ?? null;
  const showLiveLegend = isGlobalView || isLive;
  const showStaticLegend = !isGlobalView && isStatic;
  const activeEntityLayerLegends = currentLayerLegendsByEntity[activeTab]!;
  const metricLayerData = isGlobalView
    ? globalLayerDataByEntity[activeTab]
    : activeEntityLayerData;
  const legendMetricSubtitle = showStaticLegend
    ? (metricLayerData?.name ?? t('coverage-data'))
    : (metricLayerData?.name ?? t('average-download-speed'));
  const legendStatusTitle = t('connectivity-status');

  const schoolSummaryItems: LegendSummaryItem[] = schoolSummaryOrder.map(
    (key) => ({
      color: paintData[key],
      key,
      label: t(ConnectivityStatusNames[key]),
    }),
  );

  const activeLayerSummaryItems: LegendSummaryItem[] =
    !isGlobalView && activeEntityLayerLegends.values.length
      ? activeEntityLayerLegends.values.map(({ key, label }) => ({
          color:
            activeEntityLayerLegends.colors[key] ??
            paintData[key] ??
            paintData.unknown,
          key,
          label,
        }))
      : [
          { color: paintData.good, key: 'good', label: t('high') },
          { color: paintData.moderate, key: 'moderate', label: t('moderate') },
          { color: paintData.bad, key: 'bad', label: t('low') },
          { color: paintData.unknown, key: 'unknown', label: t('unknown') },
        ];

  const shouldShowMetricSummary = showLiveLegend || showStaticLegend;
  const shouldShowGlobalSchoolStatus = isGlobalView;
  const shouldShowStatusSummary =
    isSchoolStatus || shouldShowGlobalSchoolStatus;
  const liveMetricFill = paintData[ConnectivityStatusDistribution.connected];

  const renderMetricSummary = () => (
    <div className="grid! grid-cols-[minmax(0,1fr)_auto]! items-start! gap-x-2!">
      <div className="flex! min-w-0! w-full! flex-col! gap-1!">
        <div className="flex! items-center! justify-between! gap-3!">
          <span className="text-sm! leading-5! text-foreground! max-md:text-xs! max-md:leading-4.5!">
            {legendMetricSubtitle}
          </span>
          <span className="text-xs! leading-4.5! text-muted-foreground!">
            {legendMetricTitle}
          </span>
        </div>
        <div
          className={cn(
            'flex! h-1! w-full!',
            showLiveLegend
              ? 'gap-2! overflow-visible! max-md:gap-1!'
              : 'gap-0! overflow-hidden!',
          )}
        >
          {activeLayerSummaryItems.map(({ color, key, label }) =>
            showLiveLegend ? (
              <span
                aria-hidden="true"
                className="relative! block! min-w-0! flex-1! overflow-visible!"
                key={key}
                style={{
                  boxShadow:
                    '0 0 2px 0.5px ' +
                    getLightGlowColor(color) +
                    ', 0 0 4px 0 ' +
                    color,
                }}
                title={label}
              >
                <span
                  className="absolute! inset-0!"
                  style={{ background: liveMetricFill }}
                />
              </span>
            ) : (
              <span
                aria-hidden="true"
                className="block! min-w-0! flex-1! overflow-hidden!"
                key={key}
                style={{ background: color }}
                title={label}
              />
            ),
          )}
        </div>
      </div>
      {!shouldShowStatusSummary ? (
        <Button
          className="absolute! top-1! right-1!"
          aria-label={t('expand-legend')}
          data-testid="legend-expand-button"
          onClick={(event) => {
            event.stopPropagation();
            setCollapsed(false);
          }}
          size="icon"
          variant="icon"
        >
          <Maximize2 size={14} className="text-foreground/60!" />
        </Button>
      ) : null}
    </div>
  );

  const collapsedContent = (
    <div
      className="flex! flex-col! gap-2.5! bg-popover! px-3.5! py-3! max-md:gap-2! max-md:px-3! max-md:py-2.5!"
      data-testid="legend-collapsed-view"
    >
      {shouldShowStatusSummary ? (
        <div className="grid! grid-cols-[minmax(0,1fr)_auto]! items-start! gap-x-2!">
          <div className="flex! min-w-0! w-full! flex-col! gap-1!">
            <div className="flex! min-w-0! w-full! gap-0!">
              {schoolSummaryItems.map(({ key, label }) => (
                <span
                  className="min-w-0! flex-1! overflow-hidden! pr-2! text-sm! leading-5! text-muted-foreground! text-ellipsis! whitespace-nowrap! last:pr-0! max-md:pr-1.5! max-md:text-xs! max-md:leading-4.5!"
                  key={key}
                  title={label}
                >
                  {label}
                </span>
              ))}
            </div>
            <div className="flex! h-1! w-full! overflow-hidden!">
              {schoolSummaryItems.map(({ color, key, label }) => (
                <span
                  aria-hidden="true"
                  className="block! min-w-0! flex-1!"
                  key={key}
                  style={{ background: color }}
                  title={label}
                />
              ))}
            </div>
          </div>
          <CollapsibleTrigger asChild>
            <Button
              className="absolute! top-1! right-1!"
              aria-label={t('expand-legend')}
              data-testid="legend-expand-button"
              onClick={(event) => {
                event.stopPropagation();
              }}
              size="icon"
              variant="icon"
            >
              <Maximize2 size={14} className="text-foreground/60!" />
            </Button>
          </CollapsibleTrigger>
        </div>
      ) : shouldShowMetricSummary ? (
        renderMetricSummary()
      ) : null}
      {shouldShowStatusSummary && shouldShowMetricSummary
        ? renderMetricSummary()
        : null}
    </div>
  );

  const expandedContent = (
    <>
      <div className="flex! items-center! justify-between! gap-3! bg-popover! px-3.5! pt-3! max-md:gap-2! max-md:px-3! max-md:pt-2.5!">
        <div className="flex! min-w-0! items-center! gap-2! max-md:gap-3!">
          {visibleLegendEntityTypes.map((entityType) => {
            const config = entityConfigMap[entityType];
            if (!config) return null;

            const isActive = activeTab === entityType;

            return (
              <button
                className={cn(
                  'relative! inline-flex! cursor-pointer! items-center! gap-1! border-0! bg-transparent! pb-2.5! px-3! text-sm! leading-5!',
                  isActive
                    ? 'text-foreground!'
                    : 'text-muted-foreground! opacity-[0.78]!',
                )}
                key={entityType}
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveTab(entityType);
                }}
                type="button"
              >
                <EntityLegendIndicator
                  color={
                    isActive
                      ? 'var(--color-foreground)'
                      : 'var(--color-muted-foreground)'
                  }
                  entityType={entityType}
                />
                <span>
                  {t(
                    config.slug,
                    config.slug === (EntityType.SCHOOL as string)
                      ? { count: 2 }
                      : undefined,
                  )}
                </span>
                <span
                  className={cn(
                    'absolute! bottom-0! left-0! right-0! h-0.5! rounded-full!',
                    isActive ? 'bg-primary!' : 'bg-transparent!',
                  )}
                />
              </button>
            );
          })}
        </div>
        <CollapsibleTrigger asChild>
          <Button
            className="absolute! top-1! right-1!"
            variant="icon"
            aria-label={t('collapse-legend')}
            size="icon"
            data-testid="legend-collapse-button"
            onClick={(event) => {
              event.stopPropagation();
            }}
            type="button"
          >
            <Minimize2 size={14} className="text-foreground/60!" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <div
        className="flex! flex-wrap! gap-4! bg-popover! p-3.5! max-md:max-h-[min(24rem,calc(100vh-10rem))]! max-md:overflow-y-auto! max-md:gap-3.5! max-md:p-3!"
        data-testid="legend-expanded-view"
      >
        {shouldShowStatusSummary ? (
          <SchoolStatusLegend
            entityType={activeTab}
            forceVisible={shouldShowGlobalSchoolStatus}
            shouldShowControls={shouldShowControls}
            statusTitle={legendStatusTitle}
          />
        ) : null}
        {showLiveLegend ? (
          <LiveLayerLegend
            entityType={activeTab}
            metricSubtitle={legendMetricSubtitle}
            metricTitle={legendMetricTitle}
            shouldShowControls={shouldShowControls}
          />
        ) : null}
        {showStaticLegend ? (
          <StaticLayerLegend
            entityType={activeTab}
            metricSubtitle={legendMetricSubtitle}
            metricTitle={legendMetricTitle}
            shouldShowControls={shouldShowControls}
          />
        ) : null}
      </div>
    </>
  );

  return (
    <Popover
      modal={false}
      onOpenChange={(nextOpen) => {
        onOpenChange?.(nextOpen);
      }}
      open={open}
    >
      <PopoverAnchor asChild>
        <div className="legend-info-popover-link relative! inline-flex!">
          {children}
        </div>
      </PopoverAnchor>
      <PopoverContent
        ref={popoverContentRef}
        align="end"
        className={cn(
          'z-1! overflow-hidden! rounded-[6px]! border! border-border! bg-popover! p-0! shadow-xs!',
          'w-[min(28.125rem,calc(100vw-1rem))]! max-w-[min(28.125rem,calc(100vw-1rem))]!',
          'max-md:w-[min(23rem,calc(100vw-1rem))]! max-md:max-w-[min(23rem,calc(100vw-1rem))]!',
          'max-[560px]:w-[min(18.5rem,calc(100vw-1rem))]! max-[560px]:max-w-[min(18.5rem,calc(100vw-1rem))]!',
        )}
        onCloseAutoFocus={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
        onOpenAutoFocus={(event) => event.preventDefault()}
        side="left"
        sideOffset={12}
      >
        <Collapsible
          onOpenChange={(nextOpen) => {
            setCollapsed(!nextOpen);
          }}
          open={!collapsed}
        >
          {collapsed ? collapsedContent : null}
          <CollapsibleContent forceMount className={cn(collapsed && 'hidden!')}>
            {expandedContent}
          </CollapsibleContent>
        </Collapsible>
      </PopoverContent>
    </Popover>
  );
};

export default LegendPopup;
