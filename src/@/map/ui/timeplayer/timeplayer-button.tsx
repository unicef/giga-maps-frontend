import { Play } from '@carbon/icons-react'
import { IconButton } from '@carbon/react'
import { useStore } from 'effector-react';
import { TimeplayerWrapper } from './timeplayer-button.style';
import { ActiveButtonWrapper } from '../legend-info/legend-button.style';
import { $connectivityYears, $currentLayerTypeUtils, $isTimeplayer, onToggleTimeplayer } from '~/@/sidebar/sidebar.model';
import { useRoute } from '~/lib/router';
import { mapCountry } from '~/core/routes';
import { $admin1Code } from '~/@/country/country.model';
import { useTranslation } from 'react-i18next';


const TimeplayerButton = () => {
  const { t } = useTranslation();
  const isTimePlayer = useStore($isTimeplayer);
  const isCountryView = useRoute(mapCountry);
  const admin1 = useStore($admin1Code)
  const connectivityYears = useStore($connectivityYears);
  const { isLive } = useStore($currentLayerTypeUtils)
  if (!connectivityYears || !isLive || !isCountryView || admin1) return null;
  return (
    <TimeplayerWrapper className="timeplayer-container">
      <ActiveButtonWrapper>
        <IconButton
          align="left"
          size="sm"
          label={t("timeplayer")}
          onClick={() => onToggleTimeplayer(!isTimePlayer)}>
          <Play />
        </IconButton>
      </ActiveButtonWrapper>
    </TimeplayerWrapper>
  )
}

export default TimeplayerButton