import { useStore } from 'effector-react';

import type { EntityType } from '~/@/entities/types/base-entity.type';
import {
  $connectivityStatsByEntity,
  $currentDefaultLayerIdByEntity,
  $currentLayerTypeUtilsByEntity,
  $selectedLayerIdByEntity,
  $statusLayerIdByEntity,
} from '~/@/sidebar/sidebar.model';
import { ScrollArea } from '~/components/ui/scroll-area';

import CoverageLayer from '@/sidebar/ui/global-and-country-view-components/coverage-layer/coverage-layer';

import EntitySummaryAccordion from '../landing-page-side-bar/entity-summary-accordion';
import CommonComponentGigaLayer from './common-component-gigalayer';
import ConnectivityLayer from './connectivity-layer/connectivity-layer.view';
import SchoolConnectivityLayer from './school-connectivity-layer/school-connectivity-layer.view';

const hasEntityValue = <T,>(
  values: Partial<Record<EntityType, T>>,
  entityType: EntityType,
) => {
  return Object.prototype.hasOwnProperty.call(values, entityType);
};

const EntityLayerContent = ({ entityType }: { entityType: EntityType }) => {
  const selectedLayerIdByEntity = useStore($selectedLayerIdByEntity);
  const currentDefaultLayerIdByEntity = useStore(
    $currentDefaultLayerIdByEntity,
  );
  const statusLayerIdByEntity = useStore($statusLayerIdByEntity);
  const currentLayerTypeUtilsByEntity = useStore(
    $currentLayerTypeUtilsByEntity,
  );
  const selectedLayerId = hasEntityValue(selectedLayerIdByEntity, entityType)
    ? selectedLayerIdByEntity[entityType]
    : currentDefaultLayerIdByEntity[entityType];
  const statusLayerId = statusLayerIdByEntity[entityType];
  const { isLive, isStatic } = currentLayerTypeUtilsByEntity[entityType] ?? {};
  const defaultUIEnable = !selectedLayerId && statusLayerId;

  return (
    <>
      {defaultUIEnable && <SchoolConnectivityLayer entityType={entityType} />}
      {isStatic && <CoverageLayer entityType={entityType} />}
      {isLive && <ConnectivityLayer entityType={entityType} />}
    </>
  );
};

const GlobalAndCountryView = () => {
  const connectivityStatsByEntity = useStore($connectivityStatsByEntity);

  return (
    <ScrollArea
      className="h-full! w-full!"
      viewportClassName="h-full! [&>div]:block! [&>div]:min-w-0! [&>div]:w-full!"
    >
      <div className="w-full! px-3.5! pb-2.5!">
        <EntitySummaryAccordion
          connectivityStatsByEntity={connectivityStatsByEntity}
          selectEntityOnExpand={false}
          showSummaryRowsWhenExpanded={true}
        >
          {(card) => (
            <>
              <EntityLayerContent entityType={card.accordionItem.value} />
              <CommonComponentGigaLayer
                entityType={card.accordionItem.value}
                isCountryView
              />
            </>
          )}
        </EntitySummaryAccordion>
      </div>
    </ScrollArea>
  );
};
export default GlobalAndCountryView;
