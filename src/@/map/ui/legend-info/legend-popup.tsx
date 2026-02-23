import { PopoverContent } from "@carbon/react";
import { useStore } from 'effector-react';
import { PropsWithChildren } from 'react';

import { $mapRoutes } from '~/core/routes';

import {
  $layerUtils,
} from '~/@/sidebar/sidebar.model';
import { CustomeLegendPopover, LegendContentWrapper, LegendHeaderWrapper } from './legend-button.style';
import SchoolStatusLegend from "./common/school-status-legend";
import LiveLayerLegend from "./common/live-layer-legend";
import StaticLayerLegend from "./common/static-layer-legend";
import { $theme } from "~/core/theme.model";

const LegendPopup = ({ open, children }: PropsWithChildren<{ open: boolean, setOpen: (open: boolean) => void, }>) => {
  const { currentLayerTypeUtils } = useStore($layerUtils);
  const { isStatic, isLive, isSchoolStatus } = currentLayerTypeUtils;
  const mapLevel = useStore($mapRoutes);
  const shouldShowControls = !mapLevel.map && !mapLevel.schools;
  const themeState = useStore($theme);

  return (
    <CustomeLegendPopover
      themeState={themeState}
      open={open}
      align={"left-bottom"}
      className="legend-info-popover-link"
    >
      {children}
      <PopoverContent className="legend-info-popover-content">
        <LegendHeaderWrapper>
        </LegendHeaderWrapper>
        <LegendContentWrapper themeState={themeState}>
          {isSchoolStatus && <SchoolStatusLegend shouldShowControls={shouldShowControls} />}
          {isLive && <LiveLayerLegend shouldShowControls={shouldShowControls} />}
          {isStatic && <StaticLayerLegend shouldShowControls={shouldShowControls} />}
        </LegendContentWrapper>
      </PopoverContent >
    </CustomeLegendPopover >
  )
}

export default LegendPopup