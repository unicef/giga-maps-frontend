import { useStore } from 'effector-react';

import { EntityType, getEntityMapValue } from '~/@/entities';
import {
  $connectivityStatsByEntity,
  $currentDefaultLayerIdByEntity,
  $currentLayerTypeUtilsByEntity,
  $isLiveLegendLoading,
  $selectedLayerIdByEntity,
  $statusLayerIdByEntity,
} from '~/@/sidebar/sidebar.model';
import { ScrollArea } from '~/components/ui/scroll-area';

import CoverageLayer from '@/sidebar/ui/global-and-country-view-components/coverage-layer/coverage-layer';

import FooterDataSourcePopUp from '~/@/map/ui/footer-data-source-pop-up';
import EntitySummaryAccordion from '../landing-page-side-bar/entity-summary-accordion';
import CommonComponentGigaLayer from './common-component-gigalayer';
import ConnectivityLayer from './connectivity-layer/connectivity-layer.view';
import SchoolConnectivityLayer from './school-connectivity-layer/school-connectivity-layer.view';

const EntityLayerContent = ({
  entityType,
  isLiveDataLoading,
}: {
  entityType: EntityType;
  isLiveDataLoading: boolean;
}) => {
  const selectedLayerIdByEntity = useStore($selectedLayerIdByEntity);
  const currentDefaultLayerIdByEntity = useStore(
    $currentDefaultLayerIdByEntity,
  );
  const statusLayerIdByEntity = useStore($statusLayerIdByEntity);
  const currentLayerTypeUtilsByEntity = useStore(
    $currentLayerTypeUtilsByEntity,
  );
  const selectedLayerId = getEntityMapValue(
    selectedLayerIdByEntity,
    entityType,
    currentDefaultLayerIdByEntity[entityType],
  );
  const statusLayerId = statusLayerIdByEntity[entityType];
  const { isLive, isStatic } = currentLayerTypeUtilsByEntity[entityType] ?? {};
  const defaultUIEnable = !selectedLayerId && statusLayerId;

  return (
    <>
      {defaultUIEnable && <SchoolConnectivityLayer entityType={entityType} />}
      {isStatic && <CoverageLayer entityType={entityType} />}
      {isLive && (
        <ConnectivityLayer
          entityType={entityType}
          isLiveDataLoading={isLiveDataLoading}
        />
      )}
    </>
  );
};

const GlobalAndCountryView = () => {
  const connectivityStatsByEntity = useStore($connectivityStatsByEntity);
  const isLiveDataLoading = useStore($isLiveLegendLoading);

  return (
    <ScrollArea
      className="h-full! w-full!"
      viewportClassName="h-full! [&>div]:block! [&>div]:min-w-0! [&>div]:w-full!"
    >
      <div className="w-full! px-3.5! pb-2.5!">
        <EntitySummaryAccordion
          connectivityStatsByEntity={connectivityStatsByEntity}
          isLoadingLiveData={isLiveDataLoading}
          showSummaryRowsWhenExpanded={true}
        >
          {(card) => (
            <div className="min-h-[calc(100vh-14rem)]! flex! flex-col! justify-between!">
              <div>
                <EntityLayerContent
                  entityType={card.accordionItem.value}
                  isLiveDataLoading={isLiveDataLoading}
                />
              </div>
              <div className="sticky! bottom-0! z-10! bg-background! mt-auto! flex! flex-col! gap-0!">
                <div className="px-4!">
                  <FooterDataSourcePopUp
                    isFooter={false}
                    entityType={card.accordionItem.value}
                  />
                </div>
                <CommonComponentGigaLayer
                  entityType={card.accordionItem.value}
                  isCountryView
                />
              </div>
            </div>
          )}
        </EntitySummaryAccordion>
      </div>
    </ScrollArea>
  );
};
export default GlobalAndCountryView;
