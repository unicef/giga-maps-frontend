import { useTranslation } from 'react-i18next';

type SchoolConnectivityNotificationProps = {
  countryName: string;
  isConnectivityStatusZero: boolean;
  isLiveButtonDisabled: boolean;
};

const SchoolConnectivityNotification = ({
  countryName,
  isConnectivityStatusZero,
  isLiveButtonDisabled,
}: SchoolConnectivityNotificationProps) => {
  const { t } = useTranslation();

  // Priority 1: Check if connectivity status mapped count is 0
  if (isConnectivityStatusZero) {
    return (
      <div className="mt-auto! self-stretch! rounded-lg! bg-gray-900! p-4! shadow-sm!">
        <p className="m-0! p-0! font-sans! text-xs! font-normal! leading-4.5! text-gray-400!">
          {t('isnt-reporting-connectivity-status', {
            country: countryName,
            defaultValue: `${countryName} isn't reporting connectivity status.`,
          })}
        </p>
        <p className="m-0! mt-1! p-0! font-sans! text-xs! font-normal! leading-4.5! text-gray-400!">
          {t('for-more-information', { defaultValue: 'For more information,' })}{' '}
          <a
            href="/about#contact"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary! font-medium! hover:underline!"
          >
            {t('contact-us', { defaultValue: 'contact us' })}
          </a>
        </p>
      </div>
    );
  }

  // Priority 2: Check if live button is disabled
  if (isLiveButtonDisabled) {
    return (
      <div className="mt-auto! self-stretch! rounded-lg! bg-gray-900! p-4! shadow-sm!">
        <p className="m-0! p-0! font-sans! text-xs! font-normal! leading-4.5! text-gray-400!">
          {t('isnt-reporting-internet-quality', {
            country: countryName,
            defaultValue: `${countryName} isn't reporting internet quality.`,
          })}
        </p>
        <p className="m-0! mt-1! p-0! font-sans! text-xs! font-normal! leading-4.5! text-gray-400!">
          {t('want-to-help-map-it', { defaultValue: 'Want to help map it?' })}{' '}
          <a
            href="/about#contact"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary! font-medium! hover:underline!"
          >
            {t('contact-us', { defaultValue: 'Contact us' })}
          </a>
        </p>
      </div>
    );
  }

  return null;
};

export default SchoolConnectivityNotification;
