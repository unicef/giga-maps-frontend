import { createEvent, restore } from 'effector';
import { useStore } from 'effector-react';
import { useTranslation } from 'react-i18next';

import { $country, $countryCode } from '~/@/country/country.model';
import DisclaimerNotification from '~/@/common/disclaimer-notification';
import { $isMobile } from '~/core/media-query';
import { $mapRoutes } from '~/core/routes';

export const onCloseDiscalimerNotification = createEvent<boolean>();
export const $showDisclaimerNotification = restore(
  onCloseDiscalimerNotification,
  false,
);

$showDisclaimerNotification.reset($countryCode);

const CountryDisclaimerNotification = () => {
  const { t } = useTranslation();
  const showNotification = useStore($showDisclaimerNotification);
  const countryData = useStore($country);
  const { country } = useStore($mapRoutes);
  const isMobile = useStore($isMobile);

  if (!country || !showNotification || isMobile) return null;

  return (
    <DisclaimerNotification
      className="fixed bottom-8 left-84 z-[6002] w-96 max-w-[calc(100vw-2rem)]"
      closeLabel={t('close-notification')}
      onClose={() => onCloseDiscalimerNotification(false)}
      title={t('disclaimer')}
    >
      {countryData?.country_disclaimer || t('disclaimer-text')}
    </DisclaimerNotification>
  );
};

export default CountryDisclaimerNotification;
