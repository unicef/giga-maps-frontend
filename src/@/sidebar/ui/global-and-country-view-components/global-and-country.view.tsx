import { useStore } from 'effector-react';
import { useEffect, useState } from 'react';

import { Div } from '~/@/common/style/styled-component-style';
import { $schoolConnectedOpenStatus } from '~/@/map/map.model';
import { Layers } from '~/@/sidebar/sidebar.constant';
import { $selectedLayerId, $schoolStatusSelectedLayer, $currentLayerTypeUtils } from '~/@/sidebar/sidebar.model';

import CoverageLayer from '@/sidebar/ui/global-and-country-view-components/coverage-layer/coverage-layer';

import { SidebarScroll } from '../sidebar.style';
import ConnectivityLayer from './connectivity-layer/connectivity-layer.view';
import SchoolConnectivityLayer from './school-connectivity-layer/school-connectivity-layer.view';

const GlobalAndCountryView = () => {
  const selectedLayerId = useStore($selectedLayerId);
  const schoolStatusSelectedLayer = useStore($schoolStatusSelectedLayer);
  const isSchoolStatusOpen = useStore($schoolConnectedOpenStatus);
  const { isLive, isStatic } = useStore($currentLayerTypeUtils);
  const defaultUIEnable = !selectedLayerId && schoolStatusSelectedLayer;

  return (
    <SidebarScroll>
      {defaultUIEnable && <SchoolConnectivityLayer />}
      {isStatic && <CoverageLayer />}
      {isLive && <ConnectivityLayer />}
      {/* extra spacing when school status is open */}
      <Div $margin={isSchoolStatusOpen ? '0.8rem 0' : '0.8rem 0'} />
    </SidebarScroll>
  )
}
export default GlobalAndCountryView
