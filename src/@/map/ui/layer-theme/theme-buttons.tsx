import { useStore } from 'effector-react';
import { Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { $isProductTour, $showThemeLayer, onShowThemeLayer } from '~/@/sidebar/sidebar.model';
import ClickAnywhere from '~/@/sidebar/ui/common-components/click-anywhere';
import { cn } from '~/lib/cn';

import MapControlButton from './map-control-button';
import ThemePopup from './theme-popup';


const ThemeButtons = () => {
  const { t } = useTranslation();
  const isProductTour = useStore($isProductTour);
  const isOpen = useStore($showThemeLayer)
  const openLayerTheme = () => {
    onShowThemeLayer(!isOpen);
  };

  return (
    <>
      <div className={cn('theme-wrapper-popup relative! overflow-visible!')}>
        <ThemePopup open={isOpen} setOpen={onShowThemeLayer}>
          <MapControlButton
            active={isOpen}
            aria-label={t('theme-layers')}
            label={t('theme-layers')}
            onClick={openLayerTheme}
          >
            <Settings className="size-4" />
          </MapControlButton>
        </ThemePopup>
      </div>
      {isOpen && <ClickAnywhere
        classList={['theme-wrapper-popup', 'theme-layer-popover-content']}
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
