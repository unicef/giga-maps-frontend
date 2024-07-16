import { useStore } from 'effector-react';

import { $getSchoolParams } from '~/@/sidebar/init';

import CurrentLayerNameIcon from '../../common-components/current-layer-name-Icon';
import CommonUIOnlySchoolConnectivityLayer from '../common/common-ui-only-school-connectivity-layer';
import MultiSchoolLayerView from '../common/multi-school-layer.view';
import { $schoolStats } from '~/@/sidebar/sidebar.model';
import FooterDataSourcePopUp from '~/@/map/ui/footer-data-source-pop-up';

const SchoolStatsTypeus = () => {
  const { schoolIds } = useStore($getSchoolParams);
  const SchoolStatsTypeus = useStore($schoolStats);
  const singleSchool = schoolIds?.length === 1;
  return (
    <>
      <CurrentLayerNameIcon label='School status' isSchoolStatus={true} />
      {singleSchool && <CommonUIOnlySchoolConnectivityLayer schoolId={schoolIds[0]} />}
      {!singleSchool && <MultiSchoolLayerView schoolLength={schoolIds?.length} schoolLayerList={SchoolStatsTypeus} />}
      <FooterDataSourcePopUp showOldDataSource={true} size={25} isFooter={false} />
      {/* <p>hello</p> */}
    </>
  );
}

export default SchoolStatsTypeus
