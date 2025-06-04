import { Layers } from '@carbon/icons-react'
import { IconButton } from '@carbon/react'
import { useStore } from 'effector-react';
import { useTheme } from 'styled-components';

import { $isProductTour, $showThemeLayer, $sidebarHeight, onShowLegend, onShowThemeLayer } from '~/@/sidebar/sidebar.model';
import ClickAnywhere from '~/@/sidebar/ui/common-components/click-anywhere';

import { ActiveButtonWrapper } from '../legend-info/legend-button.style';
import { ThemeWrapper } from './theme-button.style'
import { themeLayerBg } from './theme-layer-bg';
import ThemePopup from './theme-popup';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SettingIcon from '~/assets/images/setting.svg'


const ThemeButtons = () => {
  const { t } = useTranslation();
  const isProductTour = useStore($isProductTour);
  const theme = useTheme();
  const isOpen = useStore($showThemeLayer)
  const openLayerTheme = () => {
    onShowThemeLayer(!isOpen);
  };
  useEffect(() => {
    if (isOpen) {
      onShowLegend(false);
    }
  }, [isOpen]);

  const sidebarHeight = useStore($sidebarHeight)
  return (
    <>
      <ThemeWrapper className="theme-wrapper-popuptheme-wrapper-popup" $zIndex={isOpen ? 0 : 1} $bottom={sidebarHeight}>
        <ThemePopup open={isOpen} setOpen={onShowThemeLayer}>
          <ActiveButtonWrapper >
            <IconButton 
              align="left"
              size="sm"
              className="button_placement"
              label={t("theme-layers")}
              onClick={openLayerTheme}>
                <span style={{ marginTop: '-10px', display: 'inline-block' }}>
              <SettingIcon/>
              </span>
            </IconButton>
          </ActiveButtonWrapper>
        </ThemePopup>
      </ThemeWrapper>
      {isOpen && <ClickAnywhere
        classList={['theme-wrapper-popup']}
        trigger={isOpen}
        outsideClick={() => {
          if (!isProductTour) {
            onShowThemeLayer(false)
          }
        }}
      />}
    </>
  )
}

export default ThemeButtons