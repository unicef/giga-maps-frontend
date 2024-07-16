import { useStore } from 'effector-react';

import { $getSchoolParams } from '~/@/sidebar/init';

import CurrentLayerNameIcon from '../../common-components/current-layer-name-Icon';
import SingleSchoolConnnectivityLayer from '../common/single-school-connectivity-layer.view';
import MultiSchoolLayerView from '../common/multi-school-layer.view';
import { $schoolStats } from '~/@/sidebar/sidebar.model';

export default function SchoolViewConnectivityLayer() {
  const { schoolIds = [0] } = useStore($getSchoolParams);
  const SchoolStatsTypes = useStore($schoolStats);
  const isMoreThenOne = (schoolIds?.length) > 1
  return (
    <>
      <CurrentLayerNameIcon label="Real-time Connectivity" isLiveLayer={true} />
      {!isMoreThenOne && <SingleSchoolConnnectivityLayer schoolId={schoolIds[0]} />}
      {isMoreThenOne && <MultiSchoolLayerView schoolLength={schoolIds.length} schoolLayerList={SchoolStatsTypes} />}
    </>
  );
};

