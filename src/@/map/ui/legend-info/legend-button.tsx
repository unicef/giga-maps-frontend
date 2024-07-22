import { Information } from '@carbon/icons-react'
import { IconButton } from '@carbon/react'
import { merge, sample } from 'effector';
import { useStore } from 'effector-react';

import { $isProductTour, $selectedLayerId, $showLegend, onShowLegend } from '~/@/sidebar/sidebar.model';
import ClickAnywhere from '~/@/sidebar/ui/common-components/click-anywhere';
import { $isMobile } from '~/core/media-query';
import { debounce } from '~/lib/effector-kit';

import { ActiveButtonWrapper, LegendWrapper } from "./legend-button.style";
import LegendPopup from "./legend-popup";
import { $country } from '~/@/country/country.model';
import { useEffect } from 'react';

sample({
  clock: merge([debounce($selectedLayerId, { timeout: 0 }), $country]),
  source: $isMobile,
  fn: (_, selectedLayerId) => true,
  filter: (isMobile) => !isMobile,
  target: onShowLegend,
})
const LegendButton = () => {
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
            label="Legend"
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