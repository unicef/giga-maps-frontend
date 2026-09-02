import { useStore } from 'effector-react';
import { Trans, useTranslation } from 'react-i18next';

import DisclaimerNotification from '~/@/common/disclaimer-notification';
import {
  $isWelcomeToastVisible,
  dismissWelcomeToast,
} from '~/@/entities/models/welcome-toast.model';
import { $isSidebarCollapsed } from '~/@/sidebar/sidebar.model';
import { $showDisclaimerNotification } from '~/@/sidebar/ui/common-components/country-disclaimer-notification/country-disclaimer-notification';
import BuildingHospital from '~/assets/images/building-hospital.svg';
import { $isMobile } from '~/core/media-query';
import { cn } from '~/lib/cn';

/** One-off health-facilities announcement. Shows once per browser. */
const WelcomeToast = () => {
  const { t } = useTranslation();
  const isVisible = useStore($isWelcomeToastVisible);
  const isMobile = useStore($isMobile);
  const isCountryDisclaimerOpen = useStore($showDisclaimerNotification);
  const isSidebarCollapsed = useStore($isSidebarCollapsed);

  if (!isVisible) return null;

  return (
    <DisclaimerNotification
      className={cn(
        'z-[6002] w-96 max-w-[calc(100vw-2rem)]',
        isMobile
          ? // Clears the fixed sidebar header and its entity-type pill row.
            'fixed inset-x-4 top-42 mx-auto'
          : cn(
              'fixed transition-all duration-300',
              // Clears the panel's collapse arrow in either state, with the
              // same 8px gutter the panel itself sits on.
              isSidebarCollapsed ? 'left-6!' : 'left-88!',
            ),
        // Stack above the country disclaimer, which shares this anchor.
        !isMobile && (isCountryDisclaimerOpen ? 'bottom-44' : 'bottom-8'),
      )}
      closeLabel={t('close-notification')}
      icon={<BuildingHospital />}
      onClose={() => dismissWelcomeToast()}
      title={t('welcome-toast-title')}
    >
      {/* <contact> lives in the translation so each language places the link. */}
      <Trans
        components={{
          contact: (
            // eslint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label
            <a
              className="text-primary! hover:underline"
              href={'/about#contact'}
              rel="noreferrer"
              target="_blank"
            />
          ),
        }}
        i18nKey="welcome-toast-body"
      />
    </DisclaimerNotification>
  );
};

export default WelcomeToast;
