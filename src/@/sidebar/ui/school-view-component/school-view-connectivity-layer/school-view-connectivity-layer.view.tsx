import { useStore } from 'effector-react';
import { useTranslation } from 'react-i18next';
import { $getSchoolParams, $schoolStats } from '~/@/sidebar/sidebar.model';
import CurrentLayerNameIcon from '../../common-components/current-layer-name-Icon';
import SidebarDublicateSchoolList from '../common/dublicate-school-list-view';
import MultiSchoolLayerView from '../common/multi-school-layer.view';
import SingleSchoolConnnectivityLayer from '../common/single-school-connectivity-layer.view';

export default function SchoolViewConnectivityLayer() {
  const { t } = useTranslation();
  const { schoolIds = [0] } = useStore($getSchoolParams);
  const SchoolStatsTypes = useStore($schoolStats);
  const isMoreThenOne = (schoolIds?.length) > 1
  return (
    <>
      <CurrentLayerNameIcon label={t("real-time-connectivity")} isLiveLayer={true} />
      {!isMoreThenOne && (
        <>
          <SingleSchoolConnnectivityLayer schoolId={schoolIds[0]} />
          <SidebarDublicateSchoolList scrollableTargetId="school-sidebar-scroll" />
        </>
      )}
      {isMoreThenOne && <MultiSchoolLayerView schoolLength={schoolIds.length} schoolLayerList={SchoolStatsTypes} />}
    </>
  );
};

