import { ConnectionSignal, Information, Wifi } from '@carbon/icons-react'
import { Tooltip } from "@carbon/react";

import { CustomIcon, Div } from '~/@/common/style/styled-component-style';

import { FilterIconAndName } from '../global-and-country-view-components/styles/layer-view-common.style'
import { LayerSelectionTextAndFilter } from './layer-selection-text-and-filter';

const CurrentLayerNameIcon = ({ label, isLiveLayer, isSchoolStatus, icon, showFilter = true }: { label?: string, isLiveLayer?: boolean; isSchoolStatus?: boolean; icon?: string, showFilter?: boolean }) => {
  return (
    <FilterIconAndName>
      <Div $flex="center">
        {isSchoolStatus && <ConnectionSignal />}
        {isLiveLayer && < Wifi />}
        {icon && <CustomIcon dangerouslySetInnerHTML={{ __html: icon }} />}
        <h1 className='layer-heading'>{label}</h1>
        <Tooltip className='info-icon' align="bottom" label={"Key connectivity metrics calculated using periodical in-school internet measurements from software and hardware-based solutions."}>
          <button className="sb-tooltip-trigger" type="button">
            <Information />
          </button>
        </Tooltip>
      </Div>
      {showFilter && <LayerSelectionTextAndFilter />}
    </FilterIconAndName>
  )
}

export default CurrentLayerNameIcon