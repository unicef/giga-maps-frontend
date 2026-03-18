import { useStore } from 'effector-react';

import { useTranslation } from 'react-i18next';
import FooterDataSourcePopUp from '~/@/map/ui/footer-data-source-pop-up';
import { $getSchoolParams, $schoolStats } from '~/@/sidebar/sidebar.model';
import CurrentLayerNameIcon from '../../common-components/current-layer-name-Icon';
import CommonUIOnlySchoolConnectivityLayer from '../common/common-ui-only-school-connectivity-layer';
import SidebarDublicateSchoolList from '../common/dublicate-school-list-view';
import MultiSchoolLayerView from '../common/multi-school-layer.view';

const SchoolStatsTypeus = () => {
  const { t } = useTranslation();
  const { schoolIds } = useStore($getSchoolParams);
  const SchoolStatsTypeus = useStore($schoolStats);
  const singleSchool = schoolIds?.length === 1;
  return (
    <>
      <CurrentLayerNameIcon label={t('school-status')} isSchoolStatus={true} />
      {singleSchool && (
        <>
          <CommonUIOnlySchoolConnectivityLayer schoolId={schoolIds[0]} />
          <SidebarDublicateSchoolList scrollableTargetId="school-sidebar-scroll" />
        </>
      )}
      {!singleSchool && (
        <MultiSchoolLayerView
          schoolLength={schoolIds?.length}
          schoolLayerList={SchoolStatsTypeus}
        />
      )}
      <FooterDataSourcePopUp
        showOldDataSource={true}
        size={25}
        isFooter={false}
      />
    </>
  );
};

export default SchoolStatsTypeus;
