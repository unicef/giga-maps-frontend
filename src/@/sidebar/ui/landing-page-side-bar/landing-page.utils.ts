import type { EntityConfig } from '~/@/entities/config/entity-config.types';
import { EntityType } from '~/@/entities/types/base-entity.type';
import type {
  EntitiesConnectivityStatsResponse,
  EntitiesGlobalStatsResponse,
  EntityConnectivityStat,
  EntityGlobalStats,
} from '~/api/types';
import { LanguageSuffixes } from '~/lib/utils';

import { ConnectivityDistributionNames } from '../global-and-country-view-components/container/layer-view.constant';
import type {
  EntityCardData,
  EntitySummaryCardData,
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
  isFiltered?: boolean;
  isStaticLayer?: boolean;
  lng: string;
  stylePaintData: LandingPageStylePaintData;
  t: LandingPageTranslationFn;
};

const getEntityLabel = (
  config: EntityConfig,
  t: LandingPageTranslationFn,
) => t(config.slug, { count: 2 });

const getConnectedEntityLabel = (
  entityType: EntityType,
  t: LandingPageTranslationFn,
) =>
  t(
    entityType === EntityType.SCHOOL
      ? 'connected-schools'
      : 'connected-health-facilities',
  );

type BuildEntityCardsArgs = {
  connectivityStatsByEntity: EntitiesConnectivityStatsResponse | null;
  entityConfigMap: Partial<Record<EntityType, EntityConfig>>;
  entityTypes: EntityType[];
  globalStatsByEntity: EntitiesGlobalStatsResponse;
  isFilteredByEntity?: Partial<Record<EntityType, boolean>>;
  isStaticLayerByEntity?: Partial<Record<EntityType, boolean>>;
  lng: string;
  stylePaintData: LandingPageStylePaintData;
  t: LandingPageTranslationFn;
};

export const buildEntityCard = ({
  connectivityStats,
  config,
  entityType,
  globalStats,
  isFiltered = false,
  isStaticLayer = false,
  t,
}: BuildEntityCardArgs): EntityCardData | null => {
  if (!config) return null;

  const entityGlobalStats = globalStats as LandingPageEntityStats | undefined;
  const totalMetricsGlobal = entityGlobalStats?.total_metrics as LandingPageEntityStats | undefined;
  const totalMetricsConn = connectivityStats?.total_metrics as Record<string, unknown> | undefined;

  const connectedGroup =
    entityGlobalStats?.connected_entities as LandingPageStatsGroup;
  const totalConnectedGroup =
    (totalMetricsGlobal?.connected_entities ?? connectedGroup) as LandingPageStatsGroup;

  const mappedValue = Number(
    entityGlobalStats?.entities_connected ??
    entityGlobalStats?.entities_total ??
    0,
  );
  const totalMappedValue = Number(
    totalMetricsGlobal?.entities_connected ??
    totalMetricsGlobal?.entities_total ??
    mappedValue,
  );

  const measureValue = isStaticLayer
    ? 0
    : Number(connectivityStats?.no_of_entities_measure ?? 0);
  const totalMeasureValue = isStaticLayer
    ? 0
    : Number(
        totalMetricsConn?.no_of_entities_measure ??
        totalMetricsConn?.no_of_schools_measure ??
        totalMetricsGlobal?.no_of_entities_measure ??
        measureValue,
      );

  const connectedValue = Number(connectedGroup?.connected ?? 0);
  const totalConnectedValue = Number(
    totalConnectedGroup?.connected ?? connectedValue,
  );
  const entityLabel = getEntityLabel(config, t);
  const connectedEntityLabel = getConnectedEntityLabel(entityType, t);

  const entitiesTotal = Number(
    entityGlobalStats?.entities_total ?? entityGlobalStats?.entities_connected ?? 0,
  );

  return {
    badge: config.sidebar.badge,
    collapsedRows: [
      {
        label: t('locations-mapped'),
        value: mappedValue,
        totalValue: totalMappedValue,
      },
      {
        label: connectedEntityLabel,
        value: connectedValue,
        totalValue: totalConnectedValue,
      },
      {
        label: t('reporting-internet-quality'),
        value: measureValue,
        totalValue: totalMeasureValue,
      },
    ],
    entitiesTotal,
    isFiltered,
    t,
    title: entityLabel,
    value: entityType,
  };
};

export const buildEntityCardContent = ({
  connectivityStats,
  config,
  entityType,
  globalStats,
  isStaticLayer = false,
  lng,
  stylePaintData,
  t,
}: BuildEntityCardArgs): EntitySummaryCardData['accordionContent'] | null => {
  if (!config) return null;

  const entityGlobalStats = globalStats as LandingPageEntityStats | undefined;
  const connectedGroup =
    entityGlobalStats?.connected_entities as LandingPageStatsGroup;
  const connectivityGroup =
    connectivityStats?.real_time_connected_entities as LandingPageStatsGroup;
  const mappedValue = Number(
    entityGlobalStats?.entities_connected ??
    entityGlobalStats?.entities_total ??
    0,
  );
  const measureValue = isStaticLayer
    ? 0
    : Number(connectivityStats?.no_of_entities_measure ?? 0);
  const connectedValue = Number(connectedGroup?.connected ?? 0);
  const estimate = config.sidebar.estimatedTotalInMillions
    ? `/${config.sidebar.estimatedTotalInMillions}${LanguageSuffixes[lng].million}`
    : undefined;
  const entityLabel = getEntityLabel(config, t);
  const connectedEntityLabel = getConnectedEntityLabel(entityType, t);
  const countriesDetailKey =
    entityType === EntityType.SCHOOL
      ? 'across-no-countries-and-territories'
      : 'across-no-countries';
  const showMetricTooltips = entityType !== EntityType.HEALTH;

  return {
    metrics: [
      {
        detail: t(countriesDetailKey, {
          count: entityGlobalStats?.no_of_countries ?? 0,
        }),
        estimate: estimate ? `${estimate} ${t('estimated')}` : undefined,
        label: t('locations-mapped'),
        tooltip: showMetricTooltips
          ? t('locations-mapped-from-datasets-tooltip', {
              entity: entityLabel,
            })
          : undefined,
        value: mappedValue,
      },
      {
        detail: t(countriesDetailKey, {
          count:
            entityGlobalStats?.countries_with_connectivity_status_mapped ?? 0,
        }),
        label: connectedEntityLabel,
        tooltip: showMetricTooltips
          ? t('with-mapped-connectivity-status-tooltip', {
              entity: entityLabel,
            })
          : undefined,
        value: connectedValue,
      },
      {
        bar: {
          colors: [
            stylePaintData.good,
            stylePaintData.moderate,
            stylePaintData.bad,
            stylePaintData.unknown,
          ],
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
            isStaticLayer ? 0 : (connectivityGroup?.good ?? 0),
            isStaticLayer ? 0 : (connectivityGroup?.moderate ?? 0),
            isStaticLayer ? 0 : (connectivityGroup?.no_internet ?? 0),
            isStaticLayer ? 0 : (connectivityGroup?.unknown ?? 0),
          ],
        },
        detail: t(countriesDetailKey, {
          count: isStaticLayer
            ? 0
            : (connectivityStats?.countries_with_realtime_data ?? 0),
        }),
        label: t('reporting-internet-quality'),
        tooltip: showMetricTooltips
          ? t('reporting-internet-quality-tooltip', {
              entity: entityLabel,
            })
          : undefined,
        value: measureValue,
      },
    ],
    title: entityLabel,
    value: entityType,
  };
};

export const buildEntityCards = ({
  connectivityStatsByEntity,
  entityConfigMap,
  entityTypes,
  globalStatsByEntity,
  isFilteredByEntity = {},
  isStaticLayerByEntity = {},
  lng,
  stylePaintData,
  t,
}: BuildEntityCardsArgs): EntitySummaryCardData[] =>
  entityTypes
    .map((entityType) => {
      const args = {
        config: entityConfigMap[entityType],
        connectivityStats: connectivityStatsByEntity?.[entityType],
        entityType,
        globalStats: globalStatsByEntity[entityType],
        isFiltered: isFilteredByEntity[entityType] ?? false,
        isStaticLayer: isStaticLayerByEntity[entityType] ?? false,
        lng,
        stylePaintData,
        t,
      };
      const accordionItem = buildEntityCard(args);
      const accordionContent = buildEntityCardContent(args);

      if (!accordionItem || !accordionContent) return null;

      return { accordionContent, accordionItem };
    })
    .filter((card): card is EntitySummaryCardData => Boolean(card));
