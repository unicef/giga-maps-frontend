import { useStore } from 'effector-react';
import { useTranslation } from 'react-i18next';

import { $isProductTour, $showLegend, onShowLegend } from '~/@/sidebar/sidebar.model';

import MapControlButton from '../layer-theme/map-control-button';
import LegendPopup from './legend-popup';

const LegendControlIcon = () => (
  <svg
    aria-hidden="true"
    className="!block"
    fill="none"
    height="16"
    viewBox="0 0 16 16"
    width="16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4 4H12" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
    <path d="M4 8H12" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
    <path d="M4 12H12" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
    <rect fill="currentColor" height="2.4" rx="0.5" width="2.4" x="2" y="2.8" />
    <path d="M10.4 6.8L12 9.4H8.8L10.4 6.8Z" fill="currentColor" />
    <rect fill="currentColor" height="2.4" rx="0.5" width="2.4" x="2" y="10.8" />
  </svg>
);

const LegendButton = () => {
  const { t } = useTranslation();
  const showLegend = useStore($showLegend);
  const isProductTour = useStore($isProductTour);

  const handleLegendOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isProductTour) {
      return;
    }
    onShowLegend(nextOpen);
  };

  return (
    <div className="relative! legend-container">
      <LegendPopup onOpenChange={handleLegendOpenChange} open={showLegend}>
        <MapControlButton
          active={showLegend}
          aria-label={t('legend')}
          className="legend-open-button"
          label={t('legend')}
          onClick={() => handleLegendOpenChange(!showLegend)}
        >
          <LegendControlIcon />
        </MapControlButton>
      </LegendPopup>
    </div>
  )
}

export default LegendButton;
