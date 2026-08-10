import { useStore } from 'effector-react';

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
  t,
}: EntityEmptyStateProps) => {
  const countryObj = useStore($country);
  const countryName = customCountryName ?? countryObj?.name;

  const subject = entityTitle ? entityTitle : 'Facilities';

  return (
    <div className="flex! flex-col! items-center! justify-center! text-center! px-4! pb-6! gap-3!">
      <img
        alt={t ? t('facilities-not-mapped', { defaultValue: 'Facilities not mapped' }) : 'Facilities not mapped'}
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
          <>
            {subject} in <span className="font-semibold! text-foreground!">{countryName}</span> aren’t mapped here yet.{' '}
          </>
        ) : (
          <>{subject} aren’t mapped here yet.{' '}</>
        )}
        For more information,{' '}
        <a
          className="font-medium! text-primary! underline! hover:opacity-80!"
          href="/about#live-map-get-in-touch"
          rel="noopener noreferrer"
          target="_blank"
        >
          contact us
        </a>
        .
      </p>
    </div>
  );
};

export default EntityEmptyState;
