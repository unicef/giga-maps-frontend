import { useStore } from 'effector-react';
import { useTranslation } from 'react-i18next';

import { EntityType } from '~/@/entities';
import { $getSchoolParams, $schoolStats } from '~/@/sidebar/sidebar.model';

import CurrentLayerNameIcon from '../../common-components/current-layer-name-Icon';
import SidebarDublicateSchoolList from '../common/dublicate-school-list-view';
import MultiSchoolLayerView from '../common/multi-school-layer.view';
import SingleSchoolConnnectivityLayer from '../common/single-school-connectivity-layer.view';

export default function SchoolViewConnectivityLayer() {
  const { t } = useTranslation();
  const allPrams = useStore($getSchoolParams);
  const SchoolStatsTypes = useStore($schoolStats);
  const schoolIds = [];
  for (const element of Object.values(EntityType)) {
    if (allPrams[element + "__ids"]) {
      schoolIds.push(...allPrams[element + "__ids"]);
    }
  }
  const isMoreThenOne = (schoolIds?.length) > 1
  return (
    <>
      {/* <CurrentLayerNameIcon label={t("real-time-connectivity")} isLiveLayer={true} /> */}
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

