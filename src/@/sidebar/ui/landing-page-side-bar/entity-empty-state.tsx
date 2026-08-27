import { useStore } from 'effector-react';
import { Trans, useTranslation } from 'react-i18next';

import { $country } from '~/@/country/country.model';
import SchoolNotMappedImg from '~/assets/images/school-not-mapped.png';

import type { LandingPageTranslationFn } from './landing-page.types';

type EntityEmptyStateProps = {
  countryName?: string | null;
  entityTitle?: string;
  t?: LandingPageTranslationFn;
};

export const EntityEmptyState = ({
  countryName: customCountryName,
  entityTitle,
  t: customT,
}: EntityEmptyStateProps) => {
  const countryObj = useStore($country);
  const countryName = customCountryName ?? countryObj?.name;
  const { t: i18nT } = useTranslation();
  const t = customT ?? i18nT;

  const subject = entityTitle
    ? t(entityTitle, { defaultValue: entityTitle })
    : t('facilities', { defaultValue: 'Facilities' });

  return (
    <div className="flex! flex-col! items-center! justify-center! text-center! px-4! pb-6! gap-3!">
      <img
        alt={t('facilities-not-mapped', { defaultValue: 'Facilities not mapped' })}
        className="object-contain!"
        style={{
          width: '103.02px',
          height: '102.33px',
          marginTop: '20px',
        }}
        src={SchoolNotMappedImg}
      />
      <p className="m-0! text-xs! leading-5! text-muted-foreground!">
        {countryName ? (
          <Trans
            components={{
              country: <span className="font-semibold! text-foreground!" />,
              contact: (
                <a
                  className="font-medium! text-primary! underline! hover:opacity-80!"
                  href="/about#live-map-get-in-touch"
                  rel="noopener noreferrer"
                  target="_blank"
                />
              ),
            }}
            defaults="{{subject}} in <country>{{countryName}}</country> have not been mapped yet. For more information, <contact>contact us</contact>."
            i18nKey="subject-in-country-arent-mapped-here-yet"
            t={t}
            values={{ subject, countryName }}
          />
        ) : (
          <Trans
            components={{
              contact: (
                <a
                  className="font-medium! text-primary! underline! hover:opacity-80!"
                  href="/about#live-map-get-in-touch"
                  rel="noopener noreferrer"
                  target="_blank"
                />
              ),
            }}
            defaults="{{subject}} aren’t mapped here yet. For more information, <contact>contact us</contact>."
            i18nKey="subject-arent-mapped-here-yet"
            t={t}
            values={{ subject }}
          />
        )}
      </p>
    </div>
  );
};

export default EntityEmptyState;
