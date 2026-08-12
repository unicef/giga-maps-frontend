import { useStore } from 'effector-react';
import { Trans, useTranslation } from 'react-i18next';

import DisclaimerNotification from '~/@/common/disclaimer-notification';
import {
  $isWelcomeToastVisible,
  dismissWelcomeToast,
} from '~/@/entities/models/welcome-toast.model';
import { $showDisclaimerNotification } from '~/@/sidebar/ui/common-components/country-disclaimer-notification/country-disclaimer-notification';
import BuildingHospital from '~/assets/images/building-hospital.svg';
import { Button } from '~/components/ui/button';
import { $isMobile } from '~/core/media-query';
import { cn } from '~/lib/cn';

/** "Get in touch" section of the About page - relative, so every env resolves it. */
const GET_IN_TOUCH_URL = '/about#live-map-get-in-touch';

/** One-off health-facilities announcement. Shows once per browser. */
const WelcomeToast = () => {
  const { t } = useTranslation();
  const isVisible = useStore($isWelcomeToastVisible);
  const isMobile = useStore($isMobile);
  const isCountryDisclaimerOpen = useStore($showDisclaimerNotification);

  if (!isVisible) return null;

  return (
    <DisclaimerNotification
      className={cn(
        isMobile
          ? 'fixed inset-x-4 bottom-8 z-[10051]'
          : 'fixed left-84 z-[6002] w-96 max-w-[calc(100vw-2rem)]',
        // Stack above the country disclaimer, which shares this anchor.
        !isMobile && (isCountryDisclaimerOpen ? 'bottom-44' : 'bottom-8'),
      )}
      closeLabel={t('close-notification')}
      footer={
        isMobile ? (
          <Button
            className="w-full rounded-full! text-sm! leading-5! font-medium!"
            onClick={() => dismissWelcomeToast()}
            size="lg"
          >
            {t('welcome-toast-cta')}
          </Button>
        ) : null
      }
      icon={<BuildingHospital />}
      modal={isMobile}
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
              href={GET_IN_TOUCH_URL}
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
