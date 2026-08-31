import { Play } from 'lucide-react';
import { useStore } from 'effector-react';
import { useTranslation } from 'react-i18next';

import { $admin1Code } from '~/@/country/country.model';
import { $activeEntityTypes } from '~/@/entities/models/entity.model';
import {
  $connectivityYearsByEntity,
  $currentLayerTypeUtilsByEntity,
  $isTimeplayer,
  onToggleTimeplayer,
} from '~/@/sidebar/sidebar.model';
import { mapCountry } from '~/core/routes';
import { useRoute } from '~/lib/router';

import MapControlButton from '../layer-theme/map-control-button';

const TimeplayerButton = () => {
  const { t } = useTranslation();
  const isTimePlayer = useStore($isTimeplayer);
  const isCountryView = useRoute(mapCountry);
  const admin1 = useStore($admin1Code);
  const activeEntityTypes = useStore($activeEntityTypes);
  const connectivityYearsByEntity = useStore($connectivityYearsByEntity);
  const currentLayerTypeUtilsByEntity = useStore(
    $currentLayerTypeUtilsByEntity,
  );
  if (activeEntityTypes.length !== 1) return null;
  const entityType = activeEntityTypes[0];
  const connectivityYears = connectivityYearsByEntity[entityType];
  const { isLive } = currentLayerTypeUtilsByEntity[entityType] ?? {};
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
  );
};

export default TimeplayerButton;
