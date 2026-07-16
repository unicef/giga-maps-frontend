import { format } from 'date-fns';
import { useStore } from 'effector-react';
import { useCallback, useEffect, useState } from 'react';

import {
  $activeEntityTypes,
  $entityTypesFiltered,
} from '~/@/entities/models/entity.model';
import { addEntityTypeCodeParam } from '~/@/entities/utils/entity-query-params';
import { fetchEntitiesConnectivityStatsFx } from '~/api/project-connect';
import { ScrollArea } from '~/components/ui/scroll-area';

import { defaultInterval } from '../../sidebar.constant';
import { $connectivityStatsByEntity } from '../../sidebar.model';
import ShareURLModal from '../common-components/share-url-modal';
import EntitySummaryAccordion from './entity-summary-accordion';
import EntitySummaryCardContent from './entity-summary-card-content';
import LandingPageHeader from './landing-page-header';

const LandingPage = () => {
  const activeEntityTypes = useStore($activeEntityTypes);
  const entityTypesFiltered = useStore($entityTypesFiltered);
  const connectivityStatsByEntity = useStore($connectivityStatsByEntity);
  const isLoadingConnectivityStats = useStore(
    fetchEntitiesConnectivityStatsFx.pending,
  );
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    const startDate = format(defaultInterval().start, 'dd-MM-yyyy');
    const endDate = format(defaultInterval().end, 'dd-MM-yyyy');
    const params = addEntityTypeCodeParam(
      new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        benchmark: 'global',
        is_weekly: 'true',
      }),
      activeEntityTypes,
      entityTypesFiltered,
    );
    const query = params.toString();
    void fetchEntitiesConnectivityStatsFx({ query: `?${query}` });
  }, [activeEntityTypes, entityTypesFiltered]);

  const handleShareClicked = useCallback(() => {
    setShareModalOpen((current) => !current);
  }, []);

  return (
    <>
      <ScrollArea className="h-auto! max-h-none!">
        <div className="w-full! px-3.5! pt-4! pb-2.5!">
          <LandingPageHeader
            onShareClicked={handleShareClicked}
            subtitle={
              'an-open-live-global-map-of-mapped-facilities-and-their-connectivity'
            }
            title={'global-connectivity-map-for-children'}
          />

          <EntitySummaryAccordion
            connectivityStatsByEntity={connectivityStatsByEntity}
            isLoadingConnectivityStats={isLoadingConnectivityStats}
          >
            {(card, { infoLoadingMetricLabels, lng, t: translate }) => (
              <EntitySummaryCardContent
                card={card.accordionContent}
                loadingMetricLabels={infoLoadingMetricLabels}
                lng={lng}
                t={translate}
              />
            )}
          </EntitySummaryAccordion>
        </div>
      </ScrollArea>
      <ShareURLModal
        currentLink={window.location.href}
        setshareModalOpen={setShareModalOpen}
        shareModalOpen={shareModalOpen}
      />
    </>
  );
};

export default LandingPage;
