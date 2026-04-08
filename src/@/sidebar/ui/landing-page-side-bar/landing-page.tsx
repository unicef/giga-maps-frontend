import { format } from 'date-fns';
import { useStore } from 'effector-react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { $activeEntityTypes, $entityConfigMap, $entityTypesFiltered, $selectedEntityType, changeSelectedEntityType } from '~/@/entities/models/entity.model';
import type { EntityType } from '~/@/entities/types/base-entity.type';
import { $globalStatsByEntity, $stylePaintData } from '~/@/map/map.model';
import { fetchEntitiesConnectivityStatsFx, fetchEntityGlobalStatsFx } from '~/api/project-connect';
import { defaultLanguage } from '~/core/i18n/constant';
import { $lng } from '~/core/i18n/store';
import { Accordion } from '~/components/ui/accordion';
import { Scroll } from '@/scroll';

import { defaultInterval } from '../../sidebar.constant';
import { $connectivityStatsByEntity } from '../../sidebar.model';
import ShareURLModal from '../common-components/share-url-modal';
import EntitySummaryCard from './entity-summary-card';
import LandingPageHeader from './landing-page-header';
import type { EntityCardData } from './landing-page.types';
import { buildEntityCard } from './landing-page.utils';

const LandingPage = () => {
  const globalStatsByEntity = useStore($globalStatsByEntity);
  const connectivityStatsByEntity = useStore($connectivityStatsByEntity);
  const entityConfigMap = useStore($entityConfigMap);
  const stylePaintData = useStore($stylePaintData);
  const isLoadingGlobalStats = useStore(fetchEntityGlobalStatsFx.pending);
  const isLoadingConnectivityStats = useStore(fetchEntitiesConnectivityStatsFx.pending);
  const { t } = useTranslation();
  const lng = useStore($lng) ?? defaultLanguage;
  const activeEntityTypes = useStore($activeEntityTypes);
  const entityTypesFiltered = useStore($entityTypesFiltered);
  const visibleEntityTypes = entityTypesFiltered.filter((type) => activeEntityTypes.includes(type));
  const [activeAccordion, setActiveAccordion] = useState<EntityType | null>();
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const isLoading = isLoadingGlobalStats || isLoadingConnectivityStats;

  useEffect(() => {
    void fetchEntityGlobalStatsFx({});
    const startDate = format(defaultInterval().start, 'dd-MM-yyyy');
    const endDate = format(defaultInterval().end, 'dd-MM-yyyy');
    const params = { start_date: startDate, end_date: endDate, benchmark: 'global', is_weekly: 'true' };
    const query = new URLSearchParams(params).toString();
    void fetchEntitiesConnectivityStatsFx({ query: `?${query}` });
  }, []);

  const handleShareClicked = useCallback(() => {
    setShareModalOpen((current) => !current);
  }, []);

  useEffect(() => {
    if (activeAccordion && !activeEntityTypes.includes(activeAccordion)) {
      setActiveAccordion(activeEntityTypes[0] ?? null);
      return;
    }

    if (!activeEntityTypes.length) {
      setActiveAccordion(null);
    }
  }, [activeAccordion, activeEntityTypes]);

  const handleAccordionChange = (nextValue?: string) => {
    const nextAccordion = nextValue ? (nextValue as EntityType) : null;
    setActiveAccordion(nextAccordion);

    if (nextAccordion) {
      changeSelectedEntityType(nextAccordion);
    }
  };

  const entityCards = visibleEntityTypes
    .map((entityType) => buildEntityCard({
      config: entityConfigMap[entityType],
      connectivityStats: connectivityStatsByEntity[entityType],
      entityType,
      globalStats: globalStatsByEntity[entityType],
      lng,
      stylePaintData,
      t,
    }))
    .filter((card): card is EntityCardData => Boolean(card));

  return (
    <>
      <Scroll className="!h-auto !max-h-none !bg-background">
        <div className="!w-full !bg-background !px-3.5 !py-2.5">
          <LandingPageHeader
            onShareClicked={handleShareClicked}
            subtitle={t('an-open-live-global-map-of-schools-and-their-connectivity')}
            title={t('global-connectivity-map-for-children')}
          />

          <div className="!mt-4 !flex !flex-col !gap-3">
            <Accordion
              collapsible
              onValueChange={handleAccordionChange}
              type="single"
              value={activeAccordion ?? undefined}
            >
              <div className="!flex !flex-col !gap-3">
                {entityCards.map((card) => (
                  <EntitySummaryCard
                    card={card}
                    expanded={activeAccordion === card.value}
                    isLoading={isLoading}
                    key={card.value}
                    lng={lng}
                    t={t}
                  />
                ))}
              </div>
            </Accordion>
          </div>
        </div>
      </Scroll>
      <ShareURLModal
        currentLink={window.location.href}
        setshareModalOpen={setShareModalOpen}
        shareModalOpen={shareModalOpen}
      />
    </>
  );
};

export default LandingPage;
