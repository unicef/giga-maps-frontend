import type { EntityConfig } from '~/@/entities/config/entity-config.types';
import type { EntityType } from '~/@/entities/types/base-entity.type';
import type { EntityConnectivityStat, EntityGlobalStats } from '~/api/types';
import { LanguageSuffixes } from '~/lib/utils';

import { ConnectivityDistributionNames } from '../global-and-country-view-components/container/layer-view.constant';
import type {
  EntityCardData,
  LandingPageEntityStats,
  LandingPageStatsGroup,
  LandingPageStylePaintData,
  LandingPageTranslationFn,
} from './landing-page.types';

type BuildEntityCardArgs = {
  connectivityStats?: EntityConnectivityStat | null;
  config?: EntityConfig;
  entityType: EntityType;
  globalStats?: EntityGlobalStats | null;
  lng: string;
  stylePaintData: LandingPageStylePaintData;
  t: LandingPageTranslationFn;
};

export const buildEntityCard = ({
  connectivityStats,
  config,
  entityType,
  globalStats,
  lng,
  stylePaintData,
  t,
}: BuildEntityCardArgs): EntityCardData | null => {
  if (!config) return null;

  const entityGlobalStats = globalStats as LandingPageEntityStats | undefined;
  const connectedGroup = entityGlobalStats?.[config.stats.connectedGroupKey] as LandingPageStatsGroup;
  const connectivityGroup = connectivityStats?.[config.stats.realtimeGroupKey] as LandingPageStatsGroup;
  const mappedValue = Number(entityGlobalStats?.[config.stats.mappedCountKey] ?? 0);
  const measureValue = Number(connectivityStats?.[config.stats.measureCountKey] ?? 0);
  const connectedValue = Number(connectedGroup?.connected ?? 0);
  const estimate = config.sidebar.estimatedTotalInMillions
    ? `/${config.sidebar.estimatedTotalInMillions}${LanguageSuffixes[lng].million}`
    : undefined;
  const entityLabel = config.sidebar.title;

  return {
    badge: config.sidebar.badge,
    collapsedRows: [
      { label: config.sidebar.locationsMappedLabel, value: mappedValue },
      { label: config.sidebar.connectedLabel, value: connectedValue },
      { label: config.sidebar.reportingLabel, value: measureValue },
    ],
    expandedMetrics: [
      {
        detail: t(config.sidebar.mappedDetailTranslationKey, { count: entityGlobalStats?.no_of_countries ?? 0 }),
        estimate: estimate ? `${estimate} ${t('estimated')}` : undefined,
        label: config.sidebar.locationsMappedLabel,
        tooltip: config.sidebar.locationsMappedTooltip,
        value: mappedValue,
      },
      {
        detail: t(config.sidebar.connectedDetailTranslationKey, { count: entityGlobalStats?.countries_with_connectivity_status_mapped ?? 0 }),
        label: config.sidebar.connectedLabel,
        tooltip: config.sidebar.connectedTooltip,
        value: connectedValue,
      },
      {
        bar: {
          colors: [stylePaintData.good, stylePaintData.moderate, stylePaintData.bad, stylePaintData.unknown],
          entityLabel,
          labels: [
            ConnectivityDistributionNames.good,
            ConnectivityDistributionNames.moderate,
            ConnectivityDistributionNames.bad,
            ConnectivityDistributionNames.unknown,
          ],
          total: measureValue,
          type: 'entity-internet-quality',
          values: [
            connectivityGroup?.good ?? 0,
            connectivityGroup?.moderate ?? 0,
            connectivityGroup?.no_internet ?? 0,
            connectivityGroup?.unknown ?? 0,
          ],
        },
        detail: t(config.sidebar.reportingDetailTranslationKey, { count: connectivityStats?.countries_with_realtime_data ?? 0 }),
        label: config.sidebar.reportingLabel,
        tooltip: config.sidebar.reportingTooltip,
        value: measureValue,
      },
    ],
    footerLogoVariant: config.sidebar.footerLogoVariant ?? 'default',
    showFooter: config.sidebar.footerLogoVariant === 'school',
    title: config.sidebar.title,
    value: entityType,
  };
};
