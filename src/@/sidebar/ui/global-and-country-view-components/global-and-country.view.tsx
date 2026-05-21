import { format } from 'date-fns';
import { useStore } from 'effector-react';
import { useEffect } from 'react';

import { Div, LoadingText } from '~/@/common/style/styled-component-style';
import { $schoolConnectedOpenStatus } from '~/@/map/map.model';
import { $connectivityStatsByEntity, $currentLayerTypeUtils, $schoolStatusSelectedLayer, $selectedLayerId } from '~/@/sidebar/sidebar.model';
import { fetchEntitiesConnectivityStatsFx } from '~/api/project-connect';

import CoverageLayer from '@/sidebar/ui/global-and-country-view-components/coverage-layer/coverage-layer';

import { defaultInterval } from '../../sidebar.constant';
import CommonComponentGigaLayer from '../common-components/common-component-gigalayer';
import EntitySummaryAccordion from '../landing-page-side-bar/entity-summary-accordion';
import EntitySummaryCardContent from '../landing-page-side-bar/entity-summary-card-content';
import { SidebarScroll } from '../sidebar.style';
import ConnectivityLayer from './connectivity-layer/connectivity-layer.view';
import SchoolConnectivityLayer from './school-connectivity-layer/school-connectivity-layer.view';

const GlobalAndCountryView = () => {
  const selectedLayerId = useStore($selectedLayerId);
  const schoolStatusSelectedLayer = useStore($schoolStatusSelectedLayer);
  const { isLive, isStatic } = useStore($currentLayerTypeUtils);
  const defaultUIEnable = !selectedLayerId && schoolStatusSelectedLayer;

  const connectivityStatsByEntity = useStore($connectivityStatsByEntity);
  const isLoadingConnectivityStats = useStore(fetchEntitiesConnectivityStatsFx.pending);

  useEffect(() => {
    const startDate = format(defaultInterval().start, 'dd-MM-yyyy');
    const endDate = format(defaultInterval().end, 'dd-MM-yyyy');
    const params = { start_date: startDate, end_date: endDate, benchmark: 'global', is_weekly: 'true' };
    const query = new URLSearchParams(params).toString();
    void fetchEntitiesConnectivityStatsFx({ query: `?${query}` });
  }, []);

  return (
    <SidebarScroll style={{ maxHeight: '100%', padding: '10px' }}>
      <span style={{ color: 'white', margin: '20px 0' }}>
        {`defaultUIEnable: ${defaultUIEnable}, isStatic: ${isStatic}, isLive: ${isLive}`}
      </span>

      <EntitySummaryAccordion
        connectivityStatsByEntity={connectivityStatsByEntity}
        isLoadingConnectivityStats={isLoadingConnectivityStats}
      >
        {() => (
          <>
            {defaultUIEnable && <SchoolConnectivityLayer />}

            {isStatic && <CoverageLayer />}

            {isLive && <ConnectivityLayer />}
            <CommonComponentGigaLayer isCountryView={true} />
          </>
        )}
      </EntitySummaryAccordion>


      {/* <Div $margin={'0.8rem 0'} /> */}
    </SidebarScroll>
  )
}
export default GlobalAndCountryView
