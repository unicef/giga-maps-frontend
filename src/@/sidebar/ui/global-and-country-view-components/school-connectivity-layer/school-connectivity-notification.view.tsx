import { Trans, useTranslation } from 'react-i18next';

import { EntityType } from '~/@/entities/types/base-entity.type';
import { formatEntityTypeLabel } from '~/@/entities/utils/entity-layer-utils';

type SchoolConnectivityNotificationProps = {
  countryName: string;
  isConnectivityStatusZero: boolean;
  isLiveButtonDisabled: boolean;
  entityType?: EntityType;
};

const SchoolConnectivityNotification = ({
  countryName,
  isConnectivityStatusZero,
  isLiveButtonDisabled,
  entityType = EntityType.SCHOOL,
}: SchoolConnectivityNotificationProps) => {
  const { t } = useTranslation();

  const resolvedEntityType = entityType ?? EntityType.SCHOOL;
  const entityLabel = t(`${resolvedEntityType}-entity-label`, {
    defaultValue: formatEntityTypeLabel(resolvedEntityType),
  });

  // Priority 1: Check if connectivity status mapped count is 0
  if (isConnectivityStatusZero) {
    return (
      <div className="mt-auto! self-stretch! rounded-lg! bg-gray-900! p-4! shadow-sm!">
        <p className="m-0! p-0! font-sans! text-xs! font-normal! leading-4.5! text-gray-400!">
          {t('isnt-reporting-connectivity-status', {
            entity: entityLabel,
            country: countryName,
            defaultValue: `${entityLabel} connectivity status is unknown for ${countryName}.`,
          })}
        </p>
        <p className="m-0! mt-1! p-0! font-sans! text-xs! font-normal! leading-4.5! text-gray-400!">
          <Trans
            i18nKey="contact-us-for-more-information"
            defaults="<contact>Contact us</contact> for more information."
            components={{
              contact: (
                <a
                  href="/about#contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary! font-medium! hover:underline!"
                >
                  {t('contact-us', { defaultValue: 'Contact us' })}
                </a>
              ),
            }}
          />
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
            entity: entityLabel,
            country: countryName,
            defaultValue: `${entityLabel} internet quality is unknown for ${countryName}.`,
          })}
        </p>
        <p className="m-0! mt-1! p-0! font-sans! text-xs! font-normal! leading-4.5! text-gray-400!">
          <Trans
            i18nKey="contact-us-for-more-information"
            defaults="<contact>Contact us</contact> for more information."
            components={{
              contact: (
                <a
                  href="/about#contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary! font-medium! hover:underline!"
                >
                  {t('contact-us', { defaultValue: 'Contact us' })}
                </a>
              ),
            }}
          />
        </p>
      </div>
    );
  }

  return null;
};

export default SchoolConnectivityNotification;
