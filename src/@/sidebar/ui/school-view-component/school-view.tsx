import { useStore } from 'effector-react';
import React from 'react';
import { $currentLayerTypeUtils } from '../../sidebar.model';
import { SidebarScroll } from '../sidebar.style';
import SchoolStatsTypeus from './school-connectivity-status-layer/school-connectivity-status-layer';
import SchoolCoverageLayer from './school-coverage-layer/school-coverage-layer';
import SchoolViewConnectivityLayer from './school-view-connectivity-layer/school-view-connectivity-layer.view';


const SchoolViewWithPopup: React.FC = () => {
  const { isLive, isStatic } = useStore($currentLayerTypeUtils);

  return (
    <SidebarScroll id="school-sidebar-scroll">
      <SchoolStatsTypeus />
      {isLive && <SchoolViewConnectivityLayer />}
      {isStatic && <SchoolCoverageLayer />}
    </SidebarScroll>
  );
};

export default SchoolViewWithPopup;
