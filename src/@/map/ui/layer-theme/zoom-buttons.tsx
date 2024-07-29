import { Add, Subtract } from '@carbon/icons-react'

import { zoomIn, zoomOut } from '../../map.model';
import { ButtonWrapperDown, ButtonWrapperUp, ZoomButtonWrapper } from "./theme-button.style"

const ZoomButtons = () => {
  return (
    <ZoomButtonWrapper>
      <ButtonWrapperUp onClick={() => zoomIn()} label="Zoom in" align='left' kind='ghost'>
        <Add size={16} />
      </ButtonWrapperUp>
      <ButtonWrapperDown onClick={() => zoomOut()} label="Zoom out" align='left' kind='ghost'>
        <Subtract size={16} />
      </ButtonWrapperDown>
    </ZoomButtonWrapper >
  )
}

export default ZoomButtons