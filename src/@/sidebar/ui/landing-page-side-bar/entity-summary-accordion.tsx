import { useStore } from 'effector-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import {
  $activeEntityTypes,
  $entityConfigMap,
  $entityTypesFiltered,
} from '~/@/entities/models/entity.model';
import type { EntityType } from '~/@/entities/types/base-entity.type';
import { $globalStatsByEntity, $stylePaintData } from '~/@/map/map.model';
import {
  $accordionExpandedEntities,
  $currentLayerTypeUtilsByEntity,
  toggleAccordionEntity,
} from '~/@/sidebar/sidebar.model';
import {
  fetchEntitiesConnectivityStatsFx,
  fetchEntitiesLayerInfoFx,
  fetchEntityGlobalStatsFx,
} from '~/api/project-connect';
import type { EntitiesConnectivityStatsResponse } from '~/api/types';
import { Accordion } from '~/components/ui/accordion';
import { defaultLanguage } from '~/core/i18n/constant';
import { $lng } from '~/core/i18n/store';

import EntitySummaryCard from './entity-summary-card';
import type {
  EntitySummaryCardData,
  LandingPageTranslationFn,
} from './landing-page.types';
import { buildEntityCards } from './landing-page.utils';

type EntitySummaryAccordionRenderContext = {
  infoLoadingMetricLabels: string[];
  isLoadingEntityInfo: boolean;
  lng: string;
  t: LandingPageTranslationFn;
};

type EntitySummaryAccordionProps = {
  children: (
    card: EntitySummaryCardData,
    context: EntitySummaryAccordionRenderContext,
  ) => ReactNode;
  connectivityStatsByEntity: EntitiesConnectivityStatsResponse | null;
  isLoadingConnectivityStats?: boolean;
  showSummaryRowsWhenExpanded?: boolean;
};

const EntitySummaryAccordion = ({
  children,
  connectivityStatsByEntity,
  isLoadingConnectivityStats = false,
  showSummaryRowsWhenExpanded = false,
}: EntitySummaryAccordionProps) => {
  const globalStatsByEntity = useStore($globalStatsByEntity);
  const currentLayerTypeUtilsByEntity = useStore(
    $currentLayerTypeUtilsByEntity,
  );
  const entityConfigMap = useStore($entityConfigMap);
  const stylePaintData = useStore($stylePaintData);
  const isLoadingGlobalStats = useStore(fetchEntityGlobalStatsFx.pending);
  const isLoadingEntityInfo = useStore(fetchEntitiesLayerInfoFx.pending);
  const isLoadingEntityConnectivityStats = useStore(
    fetchEntitiesConnectivityStatsFx.pending,
  );
  const { t } = useTranslation();
  const lng = useStore($lng) ?? defaultLanguage;
  const activeEntityTypes = useStore($activeEntityTypes);
  const entityTypesFiltered = useStore($entityTypesFiltered);
  const visibleEntityTypes = entityTypesFiltered.filter((type) =>
    activeEntityTypes.includes(type),
  );
  const accordionExpandedEntitiesMap = useStore($accordionExpandedEntities);
  const activeAccordion = Object.entries(accordionExpandedEntitiesMap)
    .filter(([_, isExpanded]) => Boolean(isExpanded))
    .map(([entityType]) => entityType);

  const isLoading =
    isLoadingGlobalStats ||
    isLoadingConnectivityStats ||
    isLoadingEntityConnectivityStats;
  const infoLoadingMetricLabels = isLoadingEntityInfo
    ? [t('reporting-internet-quality')]
    : [];
  const entityCards = buildEntityCards({
    connectivityStatsByEntity,
    entityConfigMap,
    entityTypes: visibleEntityTypes,
    globalStatsByEntity,
    isStaticLayerByEntity: Object.fromEntries(
      Object.entries(currentLayerTypeUtilsByEntity).map(
        ([entityType, layerTypeUtils]) => [
          entityType,
          !!layerTypeUtils?.isStatic,
        ],
      ),
    ),
    lng,
    stylePaintData,
    t,
  });

  const handleAccordionChange = (nextValue: string[]) => {
    const currentSet = new Set(activeAccordion);
    const nextSet = new Set(nextValue as EntityType[]);
    const added = [...nextSet].filter((v) => !currentSet.has(v));
    const removed = [...currentSet].filter((v) => !nextSet.has(v));
    [...added, ...removed].forEach((entityType) => {
      toggleAccordionEntity(entityType);
    });
  };

  return (
    <div className="mt-4! flex! flex-col! gap-3!">
      <Accordion
        onValueChange={handleAccordionChange}
        type="multiple"
        value={activeAccordion}
      >
        <div className="flex! flex-col! gap-3!">
          {entityCards.map((card) => {
            const accordionItem = card.accordionItem;

            return (
              <EntitySummaryCard
                card={accordionItem}
                expanded={Boolean(
                  accordionExpandedEntitiesMap[
                    accordionItem.value as EntityType
                  ],
                )}
                isLoading={isLoading}
                key={accordionItem.value}
                loadingRowLabels={infoLoadingMetricLabels}
                lng={lng}
                showSummaryRowsWhenExpanded={showSummaryRowsWhenExpanded}
                t={t}
              >
                {children(card, {
                  infoLoadingMetricLabels,
                  isLoadingEntityInfo,
                  lng,
                  t,
                })}
              </EntitySummaryCard>
            );
          })}
        </div>
      </Accordion>
    </div>
  );
};

export default EntitySummaryAccordion;
