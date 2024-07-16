import { useStore } from 'effector-react';

import { $selectedLayerId, $schoolStatusSelectedLayer, $currentLayerTypeUtils } from '../../sidebar.model';
import SchoolStatsTypeus from './school-connectivity-status-layer/school-connectivity-status-layer';
import SchoolCoverageLayer from './school-coverage-layer/school-coverage-layer';
import SchoolViewConnectivityLayer from './school-view-connectivity-layer/school-view-connectivity-layer.view';
import { SidebarScroll } from '../sidebar.style';

const SchoolView = () => {
  const selectedLayerId = useStore($selectedLayerId);
  const schoolStatusSelectedLayer = useStore($schoolStatusSelectedLayer);
  const { isLive, isStatic } = useStore($currentLayerTypeUtils);
  const defaultUIEnable = !selectedLayerId && schoolStatusSelectedLayer;

  return (
    <SidebarScroll>
      {(defaultUIEnable) && <SchoolStatsTypeus />}
      {isLive && <SchoolViewConnectivityLayer />}
      {isStatic && <SchoolCoverageLayer />}
    </SidebarScroll>
  )
}

export default SchoolView
