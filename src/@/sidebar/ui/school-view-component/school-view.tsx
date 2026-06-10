import { useStore } from 'effector-react';

import { EntityType, getEntityMapValue } from '~/@/entities';
import { ScrollArea } from '~/components/ui/scroll-area';

import {
  $currentLayerTypeUtils,
  $schoolStatusSelectedLayer,
  $selectedLayerIdByEntity,
} from '../../sidebar.model';
import SchoolStatsTypeus from './school-connectivity-status-layer/school-connectivity-status-layer';
import SchoolCoverageLayer from './school-coverage-layer/school-coverage-layer';
import SchoolViewConnectivityLayer from './school-view-connectivity-layer/school-view-connectivity-layer.view';

const SchoolView = () => {
  const selectedLayerIdByEntity = useStore($selectedLayerIdByEntity);
  const selectedLayerId = getEntityMapValue(
    selectedLayerIdByEntity,
    EntityType.SCHOOL,
    null,
  );
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
