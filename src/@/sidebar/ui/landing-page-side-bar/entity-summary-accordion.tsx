import { useStore } from 'effector-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  $activeEntityTypes,
  $entityConfigMap,
  $entityTypesFiltered,
} from '~/@/entities/models/entity.model';
import type { EntityType } from '~/@/entities/types/base-entity.type';
import { $globalStatsByEntity, $stylePaintData } from '~/@/map/map.model';
import { $currentLayerTypeUtilsByEntity } from '~/@/sidebar/sidebar.model';
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
  const [activeAccordion, setActiveAccordion] = useState<EntityType | null>(
    null,
  );

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

  useEffect(() => {
    if (activeAccordion && !activeEntityTypes.includes(activeAccordion)) {
      setActiveAccordion(null);
      return;
    }

    if (!activeEntityTypes.length) {
      setActiveAccordion(null);
    }
  }, [activeAccordion, activeEntityTypes]);

  const handleAccordionChange = (nextValue?: string) => {
    const nextAccordion = nextValue ? (nextValue as EntityType) : null;
    setActiveAccordion(nextAccordion);
  };

  return (
    <div className="mt-4! flex! flex-col! gap-3!">
      <Accordion
        collapsible
        onValueChange={handleAccordionChange}
        type="single"
        value={activeAccordion ?? undefined}
      >
        <div className="flex! flex-col! gap-3!">
          {entityCards.map((card) => {
            const accordionItem = card.accordionItem;

            return (
              <EntitySummaryCard
                card={accordionItem}
                expanded={activeAccordion === accordionItem.value}
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
