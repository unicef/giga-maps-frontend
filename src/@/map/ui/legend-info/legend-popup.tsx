import { Maximize, Minimize } from '@carbon/icons-react';
import { useStore } from 'effector-react';
import { CSSProperties, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

import { $activeEntityTypes, $entityConfigMap } from '~/@/entities/models/entity.model';
import type { EntityType } from '~/@/entities/types/base-entity.type';
import EntityLegendIndicator from '~/@/entities/ui/entity-legend-indicator';
import { $stylePaintData } from '~/@/map/map.model';
import { ConnectivityStatusDistribution } from '~/@/sidebar/sidebar.constant';
import { $layerUtils } from '~/@/sidebar/sidebar.model';
import { ConnectivityStatusNames } from '~/@/sidebar/ui/global-and-country-view-components/container/layer-view.constant';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import { Popover, PopoverAnchor, PopoverContent } from '~/components/ui/popover';
import { $isMobile } from '~/core/media-query';
import { $mapRoutes } from '~/core/routes';
import { $theme, ThemeType } from '~/core/theme.model';
import { cn } from '~/lib/cn';

import LiveLayerLegend from './common/live-layer-legend';
import SchoolStatusLegend from './common/school-status-legend';
import StaticLayerLegend from './common/static-layer-legend';

type LegendSummaryItem = {
  color: string;
  key: string;
  label: string;
};

const getDefaultLegendTab = (entityTypes: EntityType[]) => entityTypes[0] ?? 'school';
const getDefaultCollapsedState = (isMobile: boolean) => isMobile;

const schoolSummaryOrder = [
  ConnectivityStatusDistribution.unknown,
  ConnectivityStatusDistribution.notConnected,
  ConnectivityStatusDistribution.connected,
] as const;

const LegendPopup = ({
  open,
  children,
}: PropsWithChildren<{ open: boolean }>) => {
  const { t } = useTranslation();
  const activeEntityTypes = useStore($activeEntityTypes);
  const entityConfigMap = useStore($entityConfigMap);
  const { currentLayerLegends, currentLayerTypeUtils, selectedLayerData } = useStore($layerUtils);
  const { isStatic, isLive, isSchoolStatus } = currentLayerTypeUtils;
  const isMobile = useStore($isMobile);
  const mapLevel = useStore($mapRoutes);
  const shouldShowControls = !mapLevel.map && !mapLevel.schools;
  const themeState = useStore($theme);
  const theme = useTheme();
  const paintData = useStore($stylePaintData);
  const visibleLegendEntityTypes = useMemo(
    () => activeEntityTypes.filter((type): type is EntityType => Boolean(entityConfigMap[type])),
    [activeEntityTypes, entityConfigMap]
  );
  const [collapsed, setCollapsed] = useState(() => getDefaultCollapsedState(isMobile));
  const [activeTab, setActiveTab] = useState<EntityType>(() => getDefaultLegendTab(visibleLegendEntityTypes));

  const legendSurface = themeState === ThemeType.light ? theme.main : '#161616';
  const legendBorder = themeState === ThemeType.light ? '#d9d9d9' : '#393939';
  const legendMuted = themeState === ThemeType.light ? theme.titleDesc : '#9e9e9e';
  const legendText = themeState === ThemeType.light ? theme.text : '#ececec';
  const legendStyle = {
    '--legend-surface': legendSurface,
    '--legend-border': legendBorder,
    '--legend-muted': legendMuted,
    '--legend-text': legendText,
    '--legend-subtle': theme.grey60,
    '--legend-accent': theme.titleBlue,
    '--legend-benchmark-border': theme.grey80,
    '--legend-checkbox-border': theme.grey80,
  } as CSSProperties;

  useEffect(() => {
    if (!visibleLegendEntityTypes.length) return;

    setActiveTab((currentTab) => (visibleLegendEntityTypes.includes(currentTab) ? currentTab : visibleLegendEntityTypes[0]));
  }, [visibleLegendEntityTypes]);

  const activeLegendConfig = entityConfigMap[activeTab] ?? entityConfigMap[visibleLegendEntityTypes[0] ?? 'school'];
  const legendMetricTitle = isStatic
    ? selectedLayerData?.name ?? t('coverage-data')
    : activeLegendConfig?.legend.metricTitle ?? t('average-download-speed');
  const legendMetricSubtitle = isStatic
    ? ''
    : activeLegendConfig?.legend.metricSubtitle ?? t('internet-quality');
  const legendStatusTitle = activeLegendConfig?.legend.statusTitle ?? t('connectivity-status');

  const schoolSummaryItems: LegendSummaryItem[] = schoolSummaryOrder.map((key) => ({
    color: paintData[key],
    key,
    label: t(ConnectivityStatusNames[key]),
  }));

  const activeLayerSummaryItems: LegendSummaryItem[] = currentLayerLegends.values.length
    ? currentLayerLegends.values.map(({ key, label }) => ({
      color: currentLayerLegends.colors[key] ?? paintData[key] ?? paintData.unknown,
      key,
      label,
    }))
    : [
      { color: paintData.good, key: 'good', label: t('high') },
      { color: paintData.moderate, key: 'moderate', label: t('moderate') },
      { color: paintData.bad, key: 'bad', label: t('low') },
      { color: paintData.unknown, key: 'unknown', label: t('unknown') },
    ];

  const shouldShowMetricSummary = isLive || isStatic;
  const shouldShowStatusSummary = isSchoolStatus;
  const renderedSectionCount = Number(isSchoolStatus) + Number(isLive) + Number(isStatic);
  const liveMetricFill = paintData[ConnectivityStatusDistribution.connected as string];

  const renderMetricSummary = () => (
    <div className="!grid !grid-cols-[minmax(0,1fr)_auto] !items-start !gap-x-2">
      <div className="!flex !min-w-0 !w-full !flex-col !gap-1">
        <div className="!flex !items-center !justify-between !gap-3">
          <span className="!text-sm !leading-5 !text-[color:var(--legend-text)] max-md:!text-xs max-md:!leading-[1.125rem]">{legendMetricTitle}</span>
          <span className="!text-xs !leading-[1.125rem] !text-[color:var(--legend-subtle)]">{legendMetricSubtitle}</span>
        </div>
        <div className="!flex !h-1 !w-full !gap-0 !overflow-hidden !rounded-full">
          {activeLayerSummaryItems.map(({ color, key, label }) => (
            isLive ? (
              <span
                aria-hidden="true"
                className="!relative !block !min-w-0 !flex-1 !overflow-hidden !rounded-full !bg-transparent !mr-1.5 last:!mr-0"
                key={key}
                title={label}
              >
                <span
                  className="!absolute !inset-px !rounded-full"
                  style={{ background: liveMetricFill }}
                />
                <span
                  className="!absolute !inset-0 !rounded-full !border"
                  style={{ borderColor: color }}
                />
              </span>
            ) : (
              <span
                aria-hidden="true"
                className="!block !min-w-0 !flex-1 !overflow-hidden !rounded-full"
                key={key}
                style={{ background: color }}
                title={label}
              />
            )
          ))}
        </div>
      </div>
      {!shouldShowStatusSummary ? (
        <button
          className="!inline-flex !h-4 !w-4 !shrink-0 !items-center !justify-center !rounded-full !border-0 !bg-transparent !p-0 !text-[color:var(--legend-text)] hover:!bg-white/8"
          aria-label={t('expand-legend')}
          data-testid="legend-expand-button"
          onClick={(event) => {
            event.stopPropagation();
            setCollapsed(false);
          }}
          type="button"
        >
          <Maximize size={14} />
        </button>
      ) : null}
    </div>
  );

  const collapsedContent = (
    <div className="!flex !flex-col !gap-2.5 !bg-[color:var(--legend-surface)] !px-3.5 !py-3 max-md:!gap-2 max-md:!px-3 max-md:!py-2.5" data-testid="legend-collapsed-view">
      {shouldShowStatusSummary ? (
        <div className="!grid !grid-cols-[minmax(0,1fr)_auto] !items-start !gap-x-2">
          <div className="!flex !min-w-0 !w-full !flex-col !gap-1">
            <div className="!flex !min-w-0 !w-full !gap-0">
              {schoolSummaryItems.map(({ key, label }) => (
                <span className="!min-w-0 !flex-1 !overflow-hidden !pr-2 !text-sm !leading-5 !text-[color:var(--legend-muted)] text-ellipsis whitespace-nowrap last:!pr-0 max-md:!pr-1.5 max-md:!text-xs max-md:!leading-[1.125rem]" key={key} title={label}>
                  {label}
                </span>
              ))}
            </div>
            <div className="!flex !h-1 !w-full !overflow-hidden !rounded-full">
              {schoolSummaryItems.map(({ color, key, label }) => (
                <span
                  aria-hidden="true"
                  className="!block !min-w-0 !flex-1"
                  key={key}
                  style={{ background: color }}
                  title={label}
                />
              ))}
            </div>
          </div>
          <CollapsibleTrigger asChild>
            <button
              className="!inline-flex !h-4 !w-4 !shrink-0 !items-center !justify-center !rounded-full !border-0 !bg-transparent !p-0 !text-[color:var(--legend-text)] hover:!bg-white/8"
              aria-label={t('expand-legend')}
              data-testid="legend-expand-button"
              onClick={(event) => {
                event.stopPropagation();
              }}
              type="button"
            >
              <Maximize size={14} />
            </button>
          </CollapsibleTrigger>
        </div>
      ) : shouldShowMetricSummary ? renderMetricSummary() : null}
      {shouldShowStatusSummary && shouldShowMetricSummary ? renderMetricSummary() : null}
    </div>
  );

  const expandedContent = (
    <>
      <div className="!flex !items-center !justify-between !gap-3 !bg-[color:var(--legend-surface)] !px-3.5 !pt-3 max-md:!gap-2 max-md:!px-3 max-md:!pt-2.5">
        <div className="!flex !min-w-0 !items-center !gap-4 max-md:!gap-3">
          {visibleLegendEntityTypes.map((entityType) => {
            const config = entityConfigMap[entityType];
            if (!config) return null;

            const isActive = activeTab === entityType;

            return (
              <button
                className={cn(
                  '!relative !inline-flex !cursor-pointer !items-center !gap-2 !border-0 !bg-transparent !p-0 !pb-2.5 !text-sm !leading-5',
                  isActive ? '!text-[color:var(--legend-text)]' : '!text-[color:var(--legend-muted)] !opacity-[0.78]'
                )}
                key={entityType}
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveTab(entityType);
                }}
                type="button"
              >
                <EntityLegendIndicator
                  color={isActive ? 'var(--legend-text)' : 'var(--legend-muted)'}
                  entityType={entityType}
                  size={8}
                />
                <span>{config.legend.tabLabel}</span>
                <span
                  className={cn(
                    '!absolute !bottom-0 !left-0 !right-0 !h-0.5 !rounded-full',
                    isActive ? '!bg-[color:var(--legend-accent)]' : '!bg-transparent'
                  )}
                />
              </button>
            );
          })}
        </div>
        <CollapsibleTrigger asChild>
          <button
            className="!inline-flex !h-7 !w-7 !shrink-0 !items-center !justify-center !rounded-full !border-0 !bg-transparent !p-0 !text-[color:var(--legend-text)] hover:!bg-white/8"
            aria-label={t('collapse-legend')}
            data-testid="legend-collapse-button"
            onClick={(event) => {
              event.stopPropagation();
            }}
            type="button"
          >
            <Minimize size={14} />
          </button>
        </CollapsibleTrigger>
      </div>
      <div className="!flex !flex-wrap !gap-4 !bg-[color:var(--legend-surface)] !p-3.5 max-md:!max-h-[min(24rem,calc(100vh-10rem))] max-md:!overflow-y-auto max-md:!gap-3.5 max-md:!p-3" data-testid="legend-expanded-view">
        {isSchoolStatus ? (
          <SchoolStatusLegend
            entityType={activeTab}
            shouldShowControls={shouldShowControls}
            statusTitle={legendStatusTitle}
          />
        ) : null}
        {isLive ? (
          <LiveLayerLegend
            entityType={activeTab}
            metricSubtitle={legendMetricSubtitle}
            metricTitle={legendMetricTitle}
            shouldShowControls={shouldShowControls}
          />
        ) : null}
        {isStatic ? (
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
    <Popover modal={false} open={open}>
      <PopoverAnchor asChild>
        <div className="legend-info-popover-link !relative !inline-flex" style={legendStyle}>
          {children}
        </div>
      </PopoverAnchor>
      <PopoverContent
        align="end"
        className={cn(
          '!z-[6002] !overflow-visible !rounded-md !border !border-[color:var(--legend-border)] !bg-[color:var(--legend-surface)] !p-0 !shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)]',
          '!w-[min(28.125rem,calc(100vw-1rem))] !max-w-[min(28.125rem,calc(100vw-1rem))]',
          'max-md:!w-[min(25rem,calc(100vw-1rem))] max-md:!max-w-[min(25rem,calc(100vw-1rem))]',
          'max-[560px]:!w-[min(18.5rem,calc(100vw-1rem))] max-[560px]:!max-w-[min(18.5rem,calc(100vw-1rem))]',
          !collapsed && renderedSectionCount === 1 && '!w-[min(22rem,calc(100vw-1rem))] !max-w-[min(22rem,calc(100vw-1rem))] max-[560px]:!w-[min(18.5rem,calc(100vw-1rem))] max-[560px]:!max-w-[min(18.5rem,calc(100vw-1rem))]'
        )}
        onCloseAutoFocus={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
        onOpenAutoFocus={(event) => event.preventDefault()}
        side="left"
        sideOffset={12}
        style={legendStyle}
      >
        <Collapsible
          onOpenChange={(nextOpen) => {
            setCollapsed(!nextOpen);
          }}
          open={!collapsed}
        >
          {collapsed ? collapsedContent : null}
          <CollapsibleContent forceMount className={cn(collapsed && '!hidden')}>
            {expandedContent}
          </CollapsibleContent>
        </Collapsible>
      </PopoverContent>
    </Popover>
  );
};

export default LegendPopup;
