import { Maximize, Minimize } from "@carbon/icons-react";
import { PopoverContent } from "@carbon/react";
import { useStore } from "effector-react";
import { CSSProperties, PropsWithChildren, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { $entityRouteParam } from "~/@/entities/models/entity-route.model";
import { $stylePaintData } from "~/@/map/map.model";
import { ConnectivityStatusDistribution } from "~/@/sidebar/sidebar.constant";
import { $layerUtils } from "~/@/sidebar/sidebar.model";
import { ConnectivityStatusNames } from "~/@/sidebar/ui/global-and-country-view-components/container/layer-view.constant";
import { $mapRoutes } from "~/core/routes";
import { $theme } from "~/core/theme.model";

import LiveLayerLegend from "./common/live-layer-legend";
import SchoolStatusLegend from "./common/school-status-legend";
import StaticLayerLegend from "./common/static-layer-legend";
import {
  CustomeLegendPopover,
  LegendCollapsedHeader,
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

const schoolSummaryOrder = [
  ConnectivityStatusDistribution.unknown,
  ConnectivityStatusDistribution.notConnected,
  ConnectivityStatusDistribution.connected,
] as const;

const LegendPopup = ({ open, children }: PropsWithChildren<{ open: boolean, setOpen: (open: boolean) => void, }>) => {
  const { t } = useTranslation();
  const entityRouteParam = useStore($entityRouteParam);
  const { currentLayerLegends, currentLayerTypeUtils, selectedLayerData } = useStore($layerUtils);
  const { isStatic, isLive, isSchoolStatus } = currentLayerTypeUtils;
  const mapLevel = useStore($mapRoutes);
  const shouldShowControls = !mapLevel.map && !mapLevel.schools;
  const themeState = useStore($theme);
  const paintData = useStore($stylePaintData);
  const [collapsed, setCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState<LegendTab>(getDefaultLegendTab(entityRouteParam));

  useEffect(() => {
    if (!open) {
      setCollapsed(true);
      setActiveTab(getDefaultLegendTab(entityRouteParam));
    }
  }, [entityRouteParam, open]);

  useEffect(() => {
    if (open) {
      setActiveTab(getDefaultLegendTab(entityRouteParam));
    }
  }, [entityRouteParam, open]);

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
  const metricSegmentClassName = `legend-summary-bar__segment legend-summary-bar__segment--spaced${isLive ? " legend-summary-bar__segment--live" : ""}`;
  const getMetricSegmentStyle = (color: string): CSSProperties => isLive
    ? {
      ["--legend-base-color" as string]: paintData[ConnectivityStatusDistribution.connected as string],
      ["--legend-accent-color" as string]: color,
    }
    : { background: color };

  const isHealthSelected = activeTab === "health-centers";
  const markerShape = isHealthSelected ? "square" : "circle";
  const renderedSectionCount = Number(isSchoolStatus) + Number(isLive) + Number(isStatic);
  const legendContent = collapsed ? (
    <LegendCollapsedView data-testid="legend-collapsed-view" themeState={themeState}>
      {shouldShowStatusSummary ? (
        <LegendSummaryBlock>
          <LegendCollapsedHeader>
          <LegendSummaryLabels>
              {schoolSummaryItems.map(({ key, label }) => (
                <LegendSummaryLabel key={key} title={label}>
                  {label}
                </LegendSummaryLabel>
              ))}
            </LegendSummaryLabels>
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
          </LegendCollapsedHeader>
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
        </LegendSummaryBlock>
      ) : shouldShowMetricSummary ? (
        <LegendSummaryBlock>
          <LegendCollapsedHeader>
          <LegendMetricWrapper>
              <LegendMetricTitle>{activeMetricTitle}</LegendMetricTitle>
              <LegendMetricMeta>{t("internet-quality")}</LegendMetricMeta>
            </LegendMetricWrapper>
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
          </LegendCollapsedHeader>
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
        </LegendSummaryBlock>
      ) : null}
      {shouldShowStatusSummary && shouldShowMetricSummary && (
        <LegendSummaryBlock>
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
        </LegendSummaryBlock>
      )}
    </LegendCollapsedView>
  ) : (
    <>
      <LegendHeaderWrapper themeState={themeState}>
        <LegendContentTabs>
          <LegendContentTab $active={!isHealthSelected} data-shape="circle" onClick={(event) => {
            event.stopPropagation();
            setActiveTab("schools");
          }}>{t("schools")}</LegendContentTab>
          <LegendContentTab $active={isHealthSelected} data-shape="square" onClick={(event) => {
            event.stopPropagation();
            setActiveTab("health-centers");
          }}>{t("health-centers")}</LegendContentTab>
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
      <PopoverContent className={`legend-info-popover-content${renderedSectionCount === 1 ? " legend-info-popover-content--single" : ""}`}>
        {legendContent}
      </PopoverContent >
    </CustomeLegendPopover >
  )
}

export default LegendPopup
