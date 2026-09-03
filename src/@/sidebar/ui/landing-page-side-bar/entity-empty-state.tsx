import { useStore } from 'effector-react';
import { Trans, useTranslation } from 'react-i18next';

import { $country } from '~/@/country/country.model';
import {
  $activeEntityTypes,
  $entityTypesFiltered,
} from '~/@/entities/models/entity.model';
import { EntityType } from '~/@/entities';
import { formatEntityTypeLabel } from '~/@/entities/utils/entity-layer-utils';
import SchoolNotMappedImg from '~/assets/images/school-not-mapped.png';

import type { LandingPageTranslationFn } from './landing-page.types';

type EntityEmptyStateProps = {
  countryName?: string | null;
  entityType?: EntityType;
  t?: LandingPageTranslationFn;
};

export const EntityEmptyState = ({
  countryName: customCountryName,
  entityType,
  t: customT,
}: EntityEmptyStateProps) => {
  const countryObj = useStore($country);
  const countryName = customCountryName ?? countryObj?.name;
  const { t: i18nT } = useTranslation();
  const t = customT ?? i18nT;

  const activeEntityTypes = useStore($activeEntityTypes);
  const entityTypesFiltered = useStore($entityTypesFiltered);
  const visibleEntityTypes = entityTypesFiltered.filter((type) =>
    activeEntityTypes.includes(type),
  );

  const targetEntities = entityType ? [entityType] : visibleEntityTypes;

  const getEntityName = (type: EntityType, isSingle: boolean): string => {
    if (type === EntityType.HEALTH) {
      return isSingle
        ? t('health-entity-label', {
            defaultValue: formatEntityTypeLabel(type),
          })
        : t('health-facilities', {
            count: 2,
            defaultValue: 'health facilities',
          });
    }
    if (type === EntityType.SCHOOL) {
      return t('school', { count: 2, defaultValue: 'Schools' });
    }
    return formatEntityTypeLabel(type);
  };

  const isSingle = targetEntities.length === 1;
  const labels = targetEntities.map((type, index) => {
    const name = getEntityName(type, isSingle);
    return index === 0 ? name : name.toLowerCase();
  });

  const andWord = t('and', { defaultValue: 'and' });
  const subject =
    labels.length === 0
      ? t('facilities', { defaultValue: 'Facilities' })
      : labels.length === 1
        ? labels[0]
        : labels.length === 2
          ? `${labels[0]} ${andWord} ${labels[1]}`
          : `${labels.slice(0, -1).join(', ')} ${andWord} ${labels[labels.length - 1]}`;

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
                  href="/about#contact"
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
                  href="/about#contact"
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
