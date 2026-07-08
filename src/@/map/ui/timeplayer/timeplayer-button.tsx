import { Play } from 'lucide-react';
import { useStore } from 'effector-react';
import { useTranslation } from 'react-i18next';

import { $admin1Code } from '~/@/country/country.model';
import { $selectedEntityType } from '~/@/entities/models/entity.model';
import { $connectivityYears, $currentLayerTypeUtilsByEntity, $isTimeplayer, onToggleTimeplayer } from '~/@/sidebar/sidebar.model';
import { mapCountry } from '~/core/routes';
import { useRoute } from '~/lib/router';

import MapControlButton from '../layer-theme/map-control-button';


const TimeplayerButton = () => {
  const { t } = useTranslation();
  const isTimePlayer = useStore($isTimeplayer);
  const isCountryView = useRoute(mapCountry);
  const admin1 = useStore($admin1Code)
  const connectivityYears = useStore($connectivityYears);
  const selectedEntityType = useStore($selectedEntityType);
  const currentLayerTypeUtilsByEntity = useStore($currentLayerTypeUtilsByEntity);
  const { isLive } = currentLayerTypeUtilsByEntity[selectedEntityType] ?? {};
  if (!connectivityYears || !isLive || !isCountryView || admin1) return null;
  return (
    <MapControlButton
      aria-label={t('timeplayer')}
      containerClassName="timeplayer-container"
      label={t('timeplayer')}
      onClick={() => onToggleTimeplayer(!isTimePlayer)}
    >
      <Play className="size-4" />
    </MapControlButton>
  )
}

export default TimeplayerButton
