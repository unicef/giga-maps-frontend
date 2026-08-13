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
import {
  $getSchoolParams,
  $isGlobalLegendLoading,
  $isLiveLegendLoading,
  $isMenuOpen,
  $isStaticLegendLoading,
  $isStatusLegendLoading,
  $layerUtils,
  $sidebarHeight,
} from '~/@/sidebar/sidebar.model';
import {
  $hasSearchInput,
  $isSearchFocused,
  $showCountries,
} from '~/@/sidebar/ui/common-components/top-search-bar/top-search-bar.model';
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

export const shouldShowLegendLoading = (
  isEntityDetailView: boolean,
  isLoading: boolean,
) => !isEntityDetailView && isLoading;

export const shouldOpenLegendPopup = ({
  open,
  isMobile,
  isCountryListOpen,
  isSearchListOpen,
  isMenuOpen,
}: {
  open: boolean;
  isMobile: boolean;
  isCountryListOpen: boolean;
  isSearchListOpen: boolean;
  isMenuOpen?: boolean;
}) =>
  open && !isMenuOpen && !(isMobile && (isCountryListOpen || isSearchListOpen));

const schoolSummaryOrder = [
  ConnectivityStatusDistribution.connected,
  ConnectivityStatusDistribution.notConnected,
  ConnectivityStatusDistribution.unknown,
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
    currentLayerTypeUtilsByEntity,
    globalLayerDataByEntity,
    selectedLayerDataByEntity,
  } = useStore($layerUtils);
  const isMobile = useStore($isMobile);
  const hasSearchInput = useStore($hasSearchInput);
  const isSearchFocused = useStore($isSearchFocused);
  const isCountryListOpen = useStore($showCountries);
  const isMenuOpen = useStore($isMenuOpen);
  const sidebarHeight = useStore($sidebarHeight);
  const { entityType: detailEntityType } = useStore($getSchoolParams);
  const mapLevel = useStore($mapRoutes);
  const isGlobalView = mapLevel.map;
  const isEntityDetailView =
    mapLevel.schools || mapLevel.entity || mapLevel.entityView;
  const shouldShowControls = !mapLevel.map && !isEntityDetailView;

  const paintData = useStore($stylePaintData);
  const isGlobalLegendLoading = useStore($isGlobalLegendLoading);
  const isLiveLegendLoading = useStore($isLiveLegendLoading);
  const isStaticLegendLoading = useStore($isStaticLegendLoading);
  const isStatusLegendLoading = useStore($isStatusLegendLoading);
  const isSearchListOpen = isSearchFocused && hasSearchInput;
  const isLegendPopupOpen = shouldOpenLegendPopup({
    open,
    isMobile,
    isCountryListOpen,
    isSearchListOpen,
    isMenuOpen,
  });
  const visibleLegendEntityTypes = useMemo(() => {
    return entityTypesFiltered.filter((type) =>
      mapLevel.entity
        ? type === detailEntityType
        : activeEntityTypes.includes(type),
    );
  }, [
    activeEntityTypes,
    detailEntityType,
    entityTypesFiltered,
    mapLevel.entity,
  ]);
  const [collapsed, setCollapsed] = useState(() =>
    getDefaultCollapsedState(isMobile),
  );
  const [activeTab, setActiveTab] = useState<EntityType>(() =>
    getDefaultLegendTab(visibleLegendEntityTypes),
  );

  const popoverContentRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;
      const wrapper = node.closest<HTMLElement>(
        '[data-radix-popper-content-wrapper]',
      );
      if (wrapper) {
        wrapper.style.setProperty('z-index', '10000', 'important');
      }
    },
    [],
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
    currentLayerTypeUtilsByEntity[activeTab];
  const { isStatic, isLive, isSchoolStatus } = activeLayerTypeUtils ?? {
    isStatic: false,
    isLive: false,
    isSchoolStatus: false,
  };
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
    !isGlobalView && activeEntityLayerLegends?.values?.length
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
  const visibleLegendSectionCount = [
    shouldShowStatusSummary,
    showLiveLegend,
    showStaticLegend,
  ].filter(Boolean).length;
  const isCompactLegend = visibleLegendSectionCount <= 1;
  const legendPanelWidthClasses = [
    'min-[420px]:w-[min(20rem,calc(100vw-1rem))]! min-[420px]:max-w-[min(20rem,calc(100vw-1rem))]!',
    'min-[560px]:w-[min(25rem,calc(100vw-1rem))]! min-[560px]:max-w-[min(25rem,calc(100vw-1rem))]!',
    'min-[768px]:w-[min(30rem,calc(100vw-1rem))]! min-[768px]:max-w-[min(30rem,calc(100vw-1rem))]!',
  ];
  const liveMetricFill = paintData[ConnectivityStatusDistribution.connected];

  const renderMetricSummary = () => {
    const isMetricLoading = shouldShowLegendLoading(
      isEntityDetailView,
      isGlobalView
        ? isGlobalLegendLoading
        : showLiveLegend
          ? isLiveLegendLoading
          : isStaticLegendLoading,
    );

    return (
      <div className="grid! grid-cols-[minmax(0,1fr)_auto]! items-start! gap-x-2!">
        <div className="flex! min-w-0! w-full! flex-col! gap-1!">
          <div className="flex! items-center! justify-between! gap-3!">
            {isMetricLoading ? (
              <div className="h-4! w-32! animate-pulse! rounded! bg-muted-foreground/20!" />
            ) : (
              <span className="text-sm! leading-5! text-foreground! max-md:text-xs! max-md:leading-4.5!">
                {legendMetricSubtitle}
              </span>
            )}
            {/* <span className="text-xs! leading-4.5! text-muted-foreground!">
              {legendMetricTitle}
            </span> */}
          </div>
          <div
            className={cn(
              'flex! h-4! w-full! items-center!',
              showLiveLegend
                ? 'gap-2! overflow-visible! max-md:gap-1!'
                : 'gap-0! overflow-visible!',
            )}
          >
            {activeLayerSummaryItems.map(({ color, key, label }) =>
              showLiveLegend ? (
                <span
                  aria-hidden="true"
                  className="relative! block! min-w-0! flex-1! h-4! overflow-visible!"
                  key={key}
                  data-title={label}
                >
                  {/* Pulsing outer glow bar */}
                  <span
                    aria-hidden="true"
                    className="absolute! left-1/2! top-1/2! w-full! h-1! pointer-events-none! animate-[legend-bar-glow_1.2s_infinite_alternate_0.2s]"
                    style={{ background: color }}
                  />
                  {/* Solid center bar */}
                  <span
                    className="absolute! left-0! right-0! top-1/2! -translate-y-1/2! h-1!"
                    style={{ background: liveMetricFill }}
                  />
                </span>
              ) : (
                <span
                  aria-hidden="true"
                  className="relative! block! min-w-0! flex-1! h-4! overflow-visible!"
                  key={key}
                  data-title={label}
                >
                  <span
                    className="absolute! left-0! right-0! top-1/2! -translate-y-1/2! h-1!"
                    style={{ background: color }}
                  />
                </span>
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
  };

  const collapsedContent = (
    <div
      className="relative! flex! flex-col! gap-2.5! bg-popover! px-3.5! pr-10! py-3! max-md:gap-2! max-md:px-3! max-md:pr-9! max-md:py-2.5!"
      data-testid="legend-collapsed-view"
    >
      {shouldShowStatusSummary ? (
        <div className="grid! grid-cols-[minmax(0,1fr)_auto]! items-start! gap-x-2!">
          <div className="flex! min-w-0! w-full! flex-col! gap-1!">
            <div className="flex! items-center! justify-between! gap-3!">
              <span className="text-sm! leading-5! text-foreground! max-md:text-xs! max-md:leading-4.5!">
                {legendStatusTitle}
              </span>
            </div>
            <div className="flex! h-4! w-full! items-center! overflow-visible!">
              {schoolSummaryItems.map(({ color, key, label }) => (
                <span
                  aria-hidden="true"
                  className="relative! block! min-w-0! flex-1! h-4! overflow-visible!"
                  key={key}
                  data-title={label}
                >
                  <span
                    className="absolute! left-0! right-0! top-1/2! -translate-y-1/2! h-1!"
                    style={{ background: color }}
                  />
                </span>
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
      <div className="relative! flex! items-center! justify-between! gap-3! bg-popover! in-[.accessible]:bg-accessible-panel! in-[[data-theme=accessible]]:bg-accessible-panel! px-3.5! pr-10! pt-3! max-md:gap-2! max-md:px-3! max-md:pr-9! max-md:pt-2.5!">
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
                  fitToViewBox
                  size={8}
                  entityType={entityType}
                />
                <span className="whitespace-nowrap!">
                  {t(config.slug, {
                    count: 2,
                    defaultValue: config.displayName,
                  })}
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
        className={cn(
          'bg-popover! in-[.accessible]:bg-accessible-panel! in-[[data-theme=accessible]]:bg-accessible-panel! p-3.5! max-md:max-h-[min(24rem,calc(100vh-10rem))]! max-md:overflow-y-auto! max-md:gap-3.5! max-md:p-3!',
          isCompactLegend ? 'flex! flex-col! gap-4!' : 'flex! flex-wrap! gap-4!',
        )}
        data-testid="legend-expanded-view"
      >
        {shouldShowStatusSummary ? (
          <SchoolStatusLegend
            entityType={activeTab}
            forceVisible={shouldShowGlobalSchoolStatus}
            isCompact={isCompactLegend}
            isLoading={shouldShowLegendLoading(
              isEntityDetailView,
              isGlobalView ? isGlobalLegendLoading : isStatusLegendLoading,
            )}
            shouldShowControls={shouldShowControls}
            statusTitle={legendStatusTitle}
          />
        ) : null}
        {showLiveLegend ? (
          <LiveLayerLegend
            entityType={activeTab}
            isCompact={isCompactLegend}
            isLoading={shouldShowLegendLoading(
              isEntityDetailView,
              isGlobalView ? isGlobalLegendLoading : isLiveLegendLoading,
            )}
            metricSubtitle={legendMetricSubtitle}
            metricTitle={legendMetricTitle}
            shouldShowControls={shouldShowControls}
          />
        ) : null}
        {showStaticLegend ? (
          <StaticLayerLegend
            entityType={activeTab}
            isCompact={isCompactLegend}
            isLoading={shouldShowLegendLoading(
              isEntityDetailView,
              isGlobalView ? isGlobalLegendLoading : isStaticLegendLoading,
            )}
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
      open={isLegendPopupOpen}
    >
      <PopoverAnchor asChild>
        <div className="legend-info-popover-link relative! inline-flex!">
          {children}
        </div>
      </PopoverAnchor>
      <PopoverContent
        ref={popoverContentRef}
        align={isMobile && sidebarHeight && !collapsed ? 'center' : 'end'}
        className={cn(
          'z-[10000]! overflow-hidden! rounded-[6px]! border! border-border! p-0! shadow-xs!',
          collapsed || !isCompactLegend
            ? legendPanelWidthClasses
            : 'w-max! max-w-[min(22rem,calc(100vw-1rem))]!',
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
