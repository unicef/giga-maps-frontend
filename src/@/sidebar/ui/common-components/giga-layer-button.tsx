import {
  Information
} from '@carbon/icons-react';
import { Tooltip } from "@carbon/react"

import { SidePanelLayerGirdColumns, SingleGigaLayerItem } from "./styles/giga-layer.style"

export default function GigaLayerButton({ label, popup, isActive, onClick, icon, disabled }: { disabled?: boolean; label: string, popup?: boolean, isActive?: boolean, onClick: () => void, icon?: any }) {
  return (<SidePanelLayerGirdColumns margin={popup ? "1rem 0.5rem 0 0" : "0 0.25rem 0 0"}>
    {disabled && <span className="disabled-box" />}
    <SingleGigaLayerItem
      $isActive={isActive}
      onClick={onClick}
      $disabled
    >
      <div className='single-giga-layer-icon'>
        {icon}
        <Tooltip align="bottom" label={label} className='information-icon' >
          <button className="sb-tooltip-trigger" type="button">
            <Information />
          </button>
        </Tooltip>
      </div>
      <div className="single-giga-layer-name">
        <p>{label}</p>
      </div>
    </SingleGigaLayerItem>
  </SidePanelLayerGirdColumns>)
}