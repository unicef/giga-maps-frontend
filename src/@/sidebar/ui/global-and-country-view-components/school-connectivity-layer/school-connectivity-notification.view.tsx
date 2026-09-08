import { useStore } from 'effector-react';
import { Trans, useTranslation } from 'react-i18next';

import { $country } from '~/@/country/country.model';
import { EntityType } from '~/@/entities/types/base-entity.type';
import { formatEntityTypeLabel } from '~/@/entities/utils/entity-layer-utils';
import { $globalStatsByEntity } from '~/@/map/map.model';
import { useTargetLiveButtonLayer } from '~/@/sidebar/ui/common-components/giga-layer-button-icons';

type SchoolConnectivityNotificationProps = {
  entityType?: EntityType;
  countryName?: string;
  isConnectivityStatusZero?: boolean;
  isLiveButtonDisabled?: boolean;
  className?: string;
};

const SchoolConnectivityNotification = ({
  entityType = EntityType.SCHOOL,
  countryName: propCountryName,
  isConnectivityStatusZero: propIsConnectivityStatusZero,
  isLiveButtonDisabled: propIsLiveButtonDisabled,
  className,
}: SchoolConnectivityNotificationProps) => {
  const { t } = useTranslation();
  const country = useStore($country);
  const globalStatsByEntity = useStore($globalStatsByEntity);
  const { isLiveButtonDisabled: hookLiveButtonDisabled } =
    useTargetLiveButtonLayer(entityType);

  const selectedEntityGlobalStats = globalStatsByEntity[entityType];
  const connectivityStatusMapped =
    selectedEntityGlobalStats?.entities_with_connectivity_status_mapped ?? 0;
  const countryConnected = country?.connected_entities?.[entityType]?.connected;

  const countryName =
    propCountryName ?? country?.name ?? t('country', { defaultValue: 'Country' });

  const isConnectivityStatusZero =
    propIsConnectivityStatusZero ??
    (typeof countryConnected === 'number'
      ? countryConnected === 0
      : connectivityStatusMapped === 0);

  const isLiveButtonDisabled =
    propIsLiveButtonDisabled ?? hookLiveButtonDisabled;

  const resolvedEntityType = entityType ?? EntityType.SCHOOL;
  const entityLabel = t(`${resolvedEntityType}-entity-label`, {
    defaultValue: formatEntityTypeLabel(resolvedEntityType),
  });

  // Priority 1: Check if connectivity status mapped count is 0
  if (isConnectivityStatusZero) {
    return (
      <div className={className ?? 'w-full! px-4! pb-3!'}>
        <div className="w-full! rounded-lg! bg-gray-900! p-4! shadow-sm!">
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
      </div>
    );
  }

  // Priority 2: Check if live button is disabled
  if (isLiveButtonDisabled) {
    return (
      <div className={className ?? 'w-full! px-4! pb-3!'}>
        <div className="w-full! rounded-lg! bg-gray-900! p-4! shadow-sm!">
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
      </div>
    );
  }

  return null;
};

export default SchoolConnectivityNotification;
