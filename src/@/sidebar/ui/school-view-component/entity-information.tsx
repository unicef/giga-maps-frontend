import { useStore } from 'effector-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { $country } from '~/@/country/country.model';
import { $entityRegistry } from '~/@/entities/models/entity.model';
import { $stylePaintData } from '~/@/map/map.model';
import { getSchoolStatus } from '~/@/sidebar/school-view.utils';
import { SchoolStatsType } from '~/api/types';
import { EntityType } from '~/@/entities';

import {
  getStatisticsConfig,
  StatisticConfig,
} from '../../config/school-information-config';
import { ConnectivityStatusNames } from '../global-and-country-view-components/container/layer-view.constant';

import { DetailLine, StatusLine } from './detail-line';
import {
  getEntityGigaId,
  groupStatistics,
} from './school-view.utils';

export function EntityInformation({
  entity,
  entityType,
}: {
  entity: SchoolStatsType;
  entityType: EntityType;
}) {
  const { t } = useTranslation();
  const entityRegistry = useStore($entityRegistry);
  const stylePaintData = useStore($stylePaintData);
  const country = useStore($country);
  const [statisticsConfig, setStatisticsConfig] = useState<StatisticConfig[]>(
    [],
  );
  const config = entityRegistry[entityType];
  const entityRecord = entity as unknown as Record<string, unknown>;
  const statistics = entity.statistics as unknown as
    | Record<string, unknown>
    | undefined;
  const coordinates = (entity.geopoint?.coordinates ?? []).toReversed();
  const { connectivityStatus, connectivityStatusColor } = getSchoolStatus({
    schoolDetails: entity,
    stylePaintData,
  });
  const statusLabel = t(
    ConnectivityStatusNames[connectivityStatus] ?? connectivityStatus,
  );
  const detailTitle = t(`${entityType}-details`, {
    defaultValue: `${t(`${entityType}-entity-label`, { defaultValue: config?.displayName ?? entityType })} Details`,
  });

  useEffect(() => {
    let isCancelled = false;

    if (!country?.id) {
      setStatisticsConfig([]);
      return undefined;
    }

    getStatisticsConfig(country.id).then((nextConfig) => {
      if (!isCancelled) {
        setStatisticsConfig(nextConfig);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [country?.id]);

  return (
    <section className="px-3.5! py-3!">
      <h3 className="m-0! mb-3! text-sm! font-semibold! leading-5! text-foreground!">
        {detailTitle}
      </h3>
      <div className="space-y-1!">
        <DetailLine
          icon="location"
          value={coordinates.length ? coordinates.join(', ') : null}
        />
        <StatusLine
          color={connectivityStatusColor}
          label={statusLabel}
          entityType={entityType}
        />
        {Boolean(getEntityGigaId(entity)) && (
          <DetailLine
            icon="hash"
            label={t('giga-id')}
            value={getEntityGigaId(entity)}
            valueClassName="lowercase!"
          />
        )}
        {entity.admin1_name && entity.admin1_description_ui_label && (
          <DetailLine
            icon="hash"
            label={t(entity.admin1_description_ui_label)}
            value={entity.admin1_name}
          />
        )}
        {entity.admin2_name && entity.admin2_description_ui_label && (
          <DetailLine
            icon="hash"
            label={t(entity.admin2_description_ui_label)}
            value={entity.admin2_name}
          />
        )}
        {entity.education_level && (
          <DetailLine
            icon="hash"
            label={t('education-level')}
            value={entity.education_level}
          />
        )}
        {groupStatistics(statisticsConfig).map(({ groupName, stats }) => (
          <div key={groupName} className="pt-4!">
            {stats.map((item) => {
              const rawValue = statistics?.[item.key] ?? entityRecord[item.key];
              const displayValue =
                typeof rawValue === 'boolean'
                  ? rawValue
                    ? 'Yes'
                    : 'No'
                  : rawValue !== undefined && rawValue !== null
                    ? String(rawValue)
                    : 'N/A';
              return (
                <DetailLine
                  key={item.key}
                  icon="hash"
                  label={t(item.label)}
                  value={displayValue}
                />
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
