import { useStore } from 'effector-react';
import { useTranslation } from 'react-i18next';

import {
  $isProductTour,
  $showLegend,
  onShowAdvancedFilter,
  onShowLegend,
  onShowThemeLayer,
} from '~/@/sidebar/sidebar.model';

import MapControlButton from '../layer-theme/map-control-button';
import LegendPopup from './legend-popup';
import { List } from 'lucide-react';


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

  const handleLegendClick = () => {
    const nextOpen = !showLegend;

    if (!isProductTour) {
      onShowAdvancedFilter(false);
      onShowThemeLayer(false);
    }

    handleLegendOpenChange(nextOpen);
  };

  return (
    <div className="relative! legend-container">
      <LegendPopup onOpenChange={handleLegendOpenChange} open={showLegend}>
        <MapControlButton
          active={showLegend}
          aria-label={t('legend')}
          className="legend-open-button"
          label={t('legend')}
          onClick={handleLegendClick}
        >
          <List />
        </MapControlButton>
      </LegendPopup>
    </div>
  )
}

export default LegendButton;
