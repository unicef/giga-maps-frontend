import { Maximize, Minimize } from "@carbon/icons-react";
import { PopoverContent } from "@carbon/react";
import { useStore } from "effector-react";
import { CSSProperties, PropsWithChildren, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { $activeEntityTypes, $entityConfigMap, $selectedEntityType, changeSelectedEntityType } from "~/@/entities/models/entity.model";
import { $stylePaintData } from "~/@/map/map.model";
import { ConnectivityStatusDistribution } from "~/@/sidebar/sidebar.constant";
import { $layerUtils } from "~/@/sidebar/sidebar.model";
import { ConnectivityStatusNames } from "~/@/sidebar/ui/global-and-country-view-components/container/layer-view.constant";
import { $isMobile } from "~/core/media-query";
import { $mapRoutes } from "~/core/routes";
import { $theme } from "~/core/theme.model";

import LiveLayerLegend from "./common/live-layer-legend";
import SchoolStatusLegend from "./common/school-status-legend";
import StaticLayerLegend from "./common/static-layer-legend";
import {
  CustomeLegendPopover,
  LegendCollapsedView,
  LegendContentTab,
  LegendContentTabs,
  LegendContentWrapper,
  LegendHeaderWrapper,
  LegendMetricMeta,
  LegendMetricTitle,
  LegendMetricWrapper,
  LegendSummaryBar,
  LegendSummaryBlock,
  LegendSummaryBody,
  LegendSummaryLabel,
  LegendSummaryLabels,
  LegendToggleButton
} from "./legend-button.style";

type LegendSummaryItem = {
  color: string;
  key: string;
  label: string;
};

type LegendTab = "schools" | "health-centers";

const getDefaultLegendTab = (entityTypes: string[]): LegendTab =>
  entityTypes.length === 1 && entityTypes[0] === "health"
    ? "health-centers"
    : "schools";

const getDefaultCollapsedState = (isMobile: boolean) => isMobile;

const schoolSummaryOrder = [
  ConnectivityStatusDistribution.unknown,
  ConnectivityStatusDistribution.notConnected,
  ConnectivityStatusDistribution.connected,
] as const;

const LegendPopup = ({ open, children }: PropsWithChildren<{ open: boolean, setOpen: (open: boolean) => void, }>) => {
  const { t } = useTranslation();
  const activeEntityTypes = useStore($activeEntityTypes);
  const entityConfigMap = useStore($entityConfigMap);
  const selectedEntityType = useStore($selectedEntityType);
  const { currentLayerLegends, currentLayerTypeUtils, selectedLayerData } = useStore($layerUtils);
  const { isStatic, isLive, isSchoolStatus } = currentLayerTypeUtils;
  const isMobile = useStore($isMobile);
  const mapLevel = useStore($mapRoutes);
  const shouldShowControls = !mapLevel.map && !mapLevel.schools;
  const themeState = useStore($theme);
  const paintData = useStore($stylePaintData);
  const [collapsed, setCollapsed] = useState(getDefaultCollapsedState(isMobile));

  useEffect(() => {
    if (!open) {
      setCollapsed(getDefaultCollapsedState(isMobile));
    }
  }, [isMobile, open]);

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
      { color: paintData.good, key: "good", label: t("high") },
      { color: paintData.moderate, key: "moderate", label: t("moderate") },
      { color: paintData.bad, key: "bad", label: t("low") },
      { color: paintData.unknown, key: "unknown", label: t("unknown") },
    ];

  const shouldShowMetricSummary = isLive || isStatic;
  const activeMetricTitle = shouldShowMetricSummary
    ? selectedLayerData?.name ?? t("average-download-speed")
    : t("average-download-speed");
  const shouldShowStatusSummary = isSchoolStatus;
  const effectiveSelectedEntityType = activeEntityTypes.includes(selectedEntityType)
    ? selectedEntityType
    : activeEntityTypes[0] ?? "school";
  const showSchoolTab = activeEntityTypes.includes("school");
  const showHealthTab = activeEntityTypes.includes("health");
  const metricSegmentClassName = `legend-summary-bar__segment legend-summary-bar__segment--spaced${isLive ? " legend-summary-bar__segment--live" : ""}`;
  const getMetricSegmentStyle = (color: string): CSSProperties => isLive
    ? {
      ["--legend-base-color" as string]: paintData[ConnectivityStatusDistribution.connected as string],
      ["--legend-accent-color" as string]: color,
    }
    : { background: color };

  const activeTab: LegendTab = showHealthTab && effectiveSelectedEntityType === "health"
    ? "health-centers"
    : getDefaultLegendTab(activeEntityTypes);
  const isHealthSelected = activeTab === "health-centers";
  const markerShape = entityConfigMap[effectiveSelectedEntityType]?.legendShape ?? "circle";
  const renderedSectionCount = Number(isSchoolStatus) + Number(isLive) + Number(isStatic);
  const legendContent = collapsed ? (
    <LegendCollapsedView data-testid="legend-collapsed-view" themeState={themeState}>
      {shouldShowStatusSummary ? (
        <LegendSummaryBlock>
          <LegendSummaryBody>
            <LegendSummaryLabels>
              {schoolSummaryItems.map(({ key, label }) => (
                <LegendSummaryLabel key={key} title={label}>
                  {label}
                </LegendSummaryLabel>
              ))}
            </LegendSummaryLabels>
            <LegendSummaryBar>
              {schoolSummaryItems.map(({ color, key, label }) => (
                <span
                  aria-hidden="true"
                  className="legend-summary-bar__segment"
                  key={key}
                  style={{ background: color }}
                  title={label}
                />
              ))}
            </LegendSummaryBar>
          </LegendSummaryBody>
          <LegendToggleButton
            aria-label={t("expand-legend")}
            data-testid="legend-expand-button"
            onClick={(event) => {
              event.stopPropagation();
              setCollapsed(false);
            }}
            type="button"
          >
            <Maximize size={14} />
          </LegendToggleButton>
        </LegendSummaryBlock>
      ) : shouldShowMetricSummary ? (
        <LegendSummaryBlock>
          <LegendSummaryBody>
            <LegendMetricWrapper>
              <LegendMetricTitle>{activeMetricTitle}</LegendMetricTitle>
              <LegendMetricMeta>{t("internet-quality")}</LegendMetricMeta>
            </LegendMetricWrapper>
            <LegendSummaryBar>
              {activeLayerSummaryItems.map(({ color, key, label }) => (
                <span
                  aria-hidden="true"
                  className={metricSegmentClassName}
                  key={key}
                  style={getMetricSegmentStyle(color)}
                  title={label}
                />
              ))}
            </LegendSummaryBar>
          </LegendSummaryBody>
          <LegendToggleButton
            aria-label={t("expand-legend")}
            data-testid="legend-expand-button"
            onClick={(event) => {
              event.stopPropagation();
              setCollapsed(false);
            }}
            type="button"
          >
            <Maximize size={14} />
          </LegendToggleButton>
        </LegendSummaryBlock>
      ) : null}
      {shouldShowStatusSummary && shouldShowMetricSummary && (
        <LegendSummaryBlock>
          <LegendSummaryBody>
            <LegendMetricWrapper>
              <LegendMetricTitle>{activeMetricTitle}</LegendMetricTitle>
              <LegendMetricMeta>{t("internet-quality")}</LegendMetricMeta>
            </LegendMetricWrapper>
            <LegendSummaryBar>
              {activeLayerSummaryItems.map(({ color, key, label }) => (
                <span
                  aria-hidden="true"
                  className={metricSegmentClassName}
                  key={key}
                  style={getMetricSegmentStyle(color)}
                  title={label}
                />
              ))}
            </LegendSummaryBar>
          </LegendSummaryBody>
        </LegendSummaryBlock>
      )}
    </LegendCollapsedView>
  ) : (
    <>
      <LegendHeaderWrapper themeState={themeState}>
        <LegendContentTabs>
          {showSchoolTab && (
            <LegendContentTab $active={!isHealthSelected} data-shape="circle" onClick={(event) => {
              event.stopPropagation();
              changeSelectedEntityType("school");
            }}>{t("schools")}</LegendContentTab>
          )}
          {showHealthTab && (
            <LegendContentTab $active={isHealthSelected} data-shape="square" onClick={(event) => {
              event.stopPropagation();
              changeSelectedEntityType("health");
            }}>{t("health-centers")}</LegendContentTab>
          )}
        </LegendContentTabs>
        <LegendToggleButton
          aria-label={t("collapse-legend")}
          data-testid="legend-collapse-button"
          onClick={(event) => {
            event.stopPropagation();
            setCollapsed(true);
          }}
          type="button"
        >
          <Minimize size={14} />
        </LegendToggleButton>
      </LegendHeaderWrapper>
      <LegendContentWrapper data-testid="legend-expanded-view" themeState={themeState}>
        {isSchoolStatus && <SchoolStatusLegend markerShape={markerShape} shouldShowControls={shouldShowControls} />}
        {isLive && <LiveLayerLegend markerShape={markerShape} shouldShowControls={shouldShowControls} />}
        {isStatic && <StaticLayerLegend markerShape={markerShape} shouldShowControls={shouldShowControls} />}
      </LegendContentWrapper>
    </>
  );

  return (
    <CustomeLegendPopover
      themeState={themeState}
      open={open}
      align={"left-bottom"}
      className="legend-info-popover-link"
    >
      {children}
      <PopoverContent className={`legend-info-popover-content${!collapsed && renderedSectionCount === 1 ? " legend-info-popover-content--single" : ""}`}>
        {legendContent}
      </PopoverContent >
    </CustomeLegendPopover >
  )
}

export default LegendPopup
