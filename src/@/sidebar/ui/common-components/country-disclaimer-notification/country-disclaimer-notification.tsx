import { createEvent, restore } from 'effector';
import { useStore } from 'effector-react';
import { useTranslation } from 'react-i18next';

import DisclaimerNotification from '~/@/common/disclaimer-notification';
import { $country, $countryCode } from '~/@/country/country.model';
import { $isSidebarCollapsed } from '~/@/sidebar/sidebar.model';
import { $isMobile } from '~/core/media-query';
import { $mapRoutes } from '~/core/routes';
import { cn } from '~/lib/cn';

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
  const isSidebarCollapsed = useStore($isSidebarCollapsed);
  const disclaimerText = countryData?.country_disclaimer?.trim();

  if (!country || !showNotification || isMobile || !disclaimerText) return null;

  return (
    <DisclaimerNotification
      className={cn(
        'fixed bottom-8 z-[6002] w-96 max-w-[calc(100vw-2rem)]',
        // Same duration as the panel slide, so both move as one.
        'transition-all duration-300',
        // Clears the panel's collapse arrow in either state, with the same 8px
        // gutter the panel itself sits on.
        isSidebarCollapsed ? 'left-6!' : 'left-88!',
      )}
      closeLabel={t('close-notification')}
      onClose={() => onCloseDiscalimerNotification(false)}
      title={t('disclaimer')}
    >
      {disclaimerText}
    </DisclaimerNotification>
  );
};

export default CountryDisclaimerNotification;
