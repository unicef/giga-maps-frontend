import { useStore } from 'effector-react';
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
import {
  $connectivityStatsByEntity,
  $getSchoolParams,
  $isGlobalLegendLoading,
  $isLiveLegendLoading,
  $isMenuOpen,
  $isStaticLegendLoading,
  $isStatusLegendLoading,
  $isTimeplayer,
  $layerUtils,
  $isFlyoutExpanded,
} from '~/@/sidebar/sidebar.model';
import {
  $hasSearchInput,
  $isSearchFocused,
  $showCountries,
} from '~/@/sidebar/ui/common-components/top-search-bar/top-search-bar.model';
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

const getDefaultLegendTab = (entityTypes: EntityType[]) =>
  entityTypes[0] ?? 'school';

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
  isTimeplayer,
}: {
  open: boolean;
  isMobile: boolean;
  isCountryListOpen: boolean;
  isSearchListOpen: boolean;
  isMenuOpen?: boolean;
  isTimeplayer?: boolean;
}) =>
  open &&
  !isMenuOpen &&
  !isTimeplayer &&
  !(isMobile && (isCountryListOpen || isSearchListOpen));

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
    currentLayerTypeUtilsByEntity,
    globalLayerDataByEntity,
    selectedLayerDataByEntity,
  } = useStore($layerUtils);
  const isMobile = useStore($isMobile);
  const hasSearchInput = useStore($hasSearchInput);
  const isSearchFocused = useStore($isSearchFocused);
  const isCountryListOpen = useStore($showCountries);
  const isMenuOpen = useStore($isMenuOpen);
  const isFlyoutExpanded = useStore($isFlyoutExpanded);
  const { entityType: detailEntityType } = useStore($getSchoolParams);
  const mapLevel = useStore($mapRoutes);
  const isGlobalView = mapLevel.map;
  const isEntityDetailView =
    mapLevel.schools || mapLevel.entity || mapLevel.entityView;
  const shouldShowControls = !mapLevel.map && !isEntityDetailView;

  const isGlobalLegendLoading = useStore($isGlobalLegendLoading);
  const isLiveLegendLoading = useStore($isLiveLegendLoading);
  const isStaticLegendLoading = useStore($isStaticLegendLoading);
  const isStatusLegendLoading = useStore($isStatusLegendLoading);
  const isSearchListOpen = isSearchFocused && hasSearchInput;
  const isTimeplayer = useStore($isTimeplayer);
  const isLegendPopupOpen = shouldOpenLegendPopup({
    open,
    isMobile,
    isCountryListOpen,
    isSearchListOpen,
    isMenuOpen,
    isTimeplayer,
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

  const activeLayerTypeUtils =
    currentLayerTypeUtilsByEntity[activeTab];
  const { isStatic, isLive, isSchoolStatus } = activeLayerTypeUtils ?? {
    isStatic: false,
    isLive: false,
    isSchoolStatus: false,
  };
  const activeEntityLayerData =
    selectedLayerDataByEntity[activeTab] ?? null;
  const connectivityStatsByEntity = useStore($connectivityStatsByEntity);
  const activeConnectivityStats = connectivityStatsByEntity[activeTab];
  const reportingInternetQuality = Number(
    activeConnectivityStats?.no_of_entities_measure ??
    (activeConnectivityStats as any)?.no_of_schools_measure ??
    0,
  );
  const showLiveLegend = isGlobalView
    ? reportingInternetQuality > 0
    : isLive;
  const showStaticLegend = !isGlobalView && isStatic;
  const metricLayerData = isGlobalView
    ? globalLayerDataByEntity[activeTab]
    : activeEntityLayerData;
  const legendMetricSubtitle = showStaticLegend
    ? (metricLayerData?.name ?? t('coverage-data'))
    : (metricLayerData?.name ?? t('average-download-speed'));
  const legendStatusTitle = t('connectivity-status');

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
    'legend-sm:w-[min(20rem,calc(100vw-1rem))]! legend-sm:max-w-[min(20rem,calc(100vw-1rem))]!',
    'legend-md:w-[min(25rem,calc(100vw-1rem))]! legend-md:max-w-[min(25rem,calc(100vw-1rem))]!',
    'legend-lg:w-[min(30rem,calc(100vw-1rem))]! legend-lg:max-w-[min(30rem,calc(100vw-1rem))]!',
  ];
  const legendContent = (
    <>
      <div className="relative! flex! items-center! justify-between! gap-3! bg-popover! px-3.5! pt-3! max-md:gap-2! max-md:px-3! max-md:pt-2.5!">
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
      </div>
      <div
        className={cn(
          'bg-popover! flex! gap-[var(--legend-section-gap)]! p-3.5! max-md:max-h-[min(24rem,calc(100vh-10rem))]! max-md:overflow-y-auto! max-md:p-3!',
          isCompactLegend ? 'flex-col!' : 'flex-wrap!',
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
        align={isMobile && isFlyoutExpanded ? 'center' : 'end'}
        className={cn(
          'z-[10000]! overflow-hidden! rounded-[6px]! border! border-border! p-0! shadow-xs!',
          // Several sections share widths so columns align across entity types.
          isCompactLegend
            ? 'w-max! max-w-[min(21rem,calc(100vw-1rem))]!'
            : [
              'w-[min(18rem,calc(100vw-1rem))]! max-w-[min(18rem,calc(100vw-1rem))]!',
              ...legendPanelWidthClasses,
            ],
        )}
        onCloseAutoFocus={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
        onOpenAutoFocus={(event) => event.preventDefault()}
        side="left"
        sideOffset={12}
      >
        {legendContent}
      </PopoverContent>
    </Popover>
  );
};

export default LegendPopup;
