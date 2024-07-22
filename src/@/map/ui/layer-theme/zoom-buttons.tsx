import { Add, Subtract } from '@carbon/icons-react'

import { zoomIn, zoomOut } from '../../map.model';
import { ButtonWrapper, ButtonWrapperUp, ZoomButtonWrapper } from "./theme-button.style"

const ZoomButtons = () => {
  return (
    <ZoomButtonWrapper>
      <ButtonWrapperUp onClick={() => zoomIn()} label="Zoom in" align='left' kind='ghost'>
        <Add size={16} />
      </ButtonWrapperUp>
      <ButtonWrapper onClick={() => zoomOut()} label="Zoom out" align='left' kind='ghost'>
        <Subtract size={16} />
      </ButtonWrapper>
    </ZoomButtonWrapper >
  )
}

export default ZoomButtons