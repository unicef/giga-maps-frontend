import { useStore } from 'effector-react';

import { ScrollArea } from '~/components/ui/scroll-area';

import {
  $currentLayerTypeUtils,
  $schoolStatusSelectedLayer,
  $selectedLayerId,
} from '../../sidebar.model';
import SchoolStatsTypeus from './school-connectivity-status-layer/school-connectivity-status-layer';
import SchoolCoverageLayer from './school-coverage-layer/school-coverage-layer';
import SchoolViewConnectivityLayer from './school-view-connectivity-layer/school-view-connectivity-layer.view';

const SchoolView = () => {
  const selectedLayerId = useStore($selectedLayerId);
  const schoolStatusSelectedLayer = useStore($schoolStatusSelectedLayer);
  const { isLive, isStatic } = useStore($currentLayerTypeUtils);
  const defaultUIEnable = !selectedLayerId && schoolStatusSelectedLayer;

  return (
    <ScrollArea id="school-sidebar-scroll">
      {defaultUIEnable && <SchoolStatsTypeus />}
      {isLive && <SchoolViewConnectivityLayer />}
      {isStatic && <SchoolCoverageLayer />}
    </ScrollArea>
  );
};

export default SchoolView;
