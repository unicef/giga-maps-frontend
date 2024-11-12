import { Information } from '@carbon/icons-react'
import { IconButton } from '@carbon/react'
import { combine, merge, sample } from 'effector';
import { useStore } from 'effector-react';

import { $isProductTour, $selectedLayerId, $showAdvancedFilter, $showLegend, $showThemeLayer, onShowLegend } from '~/@/sidebar/sidebar.model';
import ClickAnywhere from '~/@/sidebar/ui/common-components/click-anywhere';
import { $isMobile } from '~/core/media-query';
import { debounce } from '~/lib/effector-kit';

import { ActiveButtonWrapper, LegendWrapper } from "./legend-button.style";
import LegendPopup from "./legend-popup";
import { $country } from '~/@/country/country.model';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

sample({
  clock: merge([debounce($selectedLayerId, { timeout: 0 }), $country, $showThemeLayer, $showAdvancedFilter]),
  source: combine({ isMobile: $isMobile, showAdvancedFilter: $showAdvancedFilter, showThemeLayer: $showThemeLayer }),
  fn: () => true,
  filter: ({ isMobile, showAdvancedFilter, showThemeLayer }) => {
    if (showAdvancedFilter || showThemeLayer) return false;
    return !isMobile
  },
  target: onShowLegend,
})
const LegendButton = () => {
  const { t } = useTranslation();
  const showLegend = useStore($showLegend);
  const isMobile = useStore($isMobile);
  const isProductTour = useStore($isProductTour);
  const toggleShowLegend = () => {
    onShowLegend(!showLegend);
  };

  // default hidden from mobile screen;
  useEffect(() => {
    isMobile && onShowLegend(false)
  }, [isMobile])
  return (
    <LegendWrapper className="lengend-container">
      <LegendPopup open={showLegend} setOpen={onShowLegend}>
        <ActiveButtonWrapper className='contras legend-open-button' onClick={toggleShowLegend}>
          <IconButton
            align="left"
            size="sm"
            label={t("legend")}
            onClick={toggleShowLegend}>
            <Information />
          </IconButton>
        </ActiveButtonWrapper>
      </LegendPopup>
      {showLegend && isMobile && <ClickAnywhere
        classList={['lengend-container']}
        trigger={showLegend}
        outsideClick={() => {
          if (!isProductTour) {
            onShowLegend(false)
          }
        }}
      />}
    </LegendWrapper >
  )
}

export default LegendButton