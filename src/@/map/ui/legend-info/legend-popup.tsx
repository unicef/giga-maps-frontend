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

const LegendPopup = ({ open, children }: PropsWithChildren<{ open: boolean, setOpen: (open: boolean) => void, }>) => {
  const { currentLayerTypeUtils } = useStore($layerUtils);
  const { isStatic, isLive, isSchoolStatus } = currentLayerTypeUtils;
  const mapLevel = useStore($mapRoutes);
  const shouldShowControls = !mapLevel.map && !mapLevel.schools;

  return (
    <CustomeLegendPopover
      open={open}
      align={"left-bottom"}
      className="legend-info-popover-link"
    >
      {children}
      <PopoverContent className="legend-info-popover-content">
        <LegendHeaderWrapper>
        </LegendHeaderWrapper>
        <LegendContentWrapper>
          {isSchoolStatus && <SchoolStatusLegend shouldShowControls={shouldShowControls} />}
          {isLive && <LiveLayerLegend shouldShowControls={shouldShowControls} />}
          {isStatic && <StaticLayerLegend shouldShowControls={shouldShowControls} />}
        </LegendContentWrapper>
      </PopoverContent >
    </CustomeLegendPopover >
  )
}

export default LegendPopup