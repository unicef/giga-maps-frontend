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

const ThemeButtons = () => {
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
      <ThemeWrapper className="theme-wrapper-popup" $zIndex={isOpen ? 0 : 1} $bottom={sidebarHeight}>
        <ThemePopup open={isOpen} setOpen={onShowThemeLayer}>
          <ActiveButtonWrapper $backgroundImage={themeLayerBg} $iconColor={theme.white}>
            <IconButton
              align="left"
              size="sm"
              label="Theme & Layers"
              onClick={openLayerTheme}>
              <Layers fill={theme.white} />
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