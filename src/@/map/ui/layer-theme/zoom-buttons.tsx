import { Add, Subtract } from '@carbon/icons-react'

import { zoomIn, zoomOut } from '../../map.model';
import { ButtonWrapperDown, ButtonWrapperUp, ZoomButtonWrapper } from "./theme-button.style"
import { useTranslation } from 'react-i18next';

const ZoomButtons = () => {
  const { t } = useTranslation();

  return (
    <ZoomButtonWrapper>
      <ButtonWrapperUp onClick={() => zoomIn()} label={t("zoom-in")} align='left' kind='ghost'>
        <Add size={16} />
      </ButtonWrapperUp>
      <ButtonWrapperDown onClick={() => zoomOut()} label={t("zoom-out")} align='left' kind='ghost'>
        <Subtract size={16} />
      </ButtonWrapperDown>
    </ZoomButtonWrapper >
  )
}

export default ZoomButtons