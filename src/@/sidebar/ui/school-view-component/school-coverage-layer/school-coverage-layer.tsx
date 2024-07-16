

import { useStore } from 'effector-react';

import { $getSchoolParams } from '~/@/sidebar/init';

import CurrentLayerNameIcon from '../../common-components/current-layer-name-Icon';
import SingleSchoolCoverageLayer from '../common/single-school-coverage-layer';
import MultiSchoolLayerView from '../common/multi-school-layer.view';
import { $layerUtils, $schoolStats } from '~/@/sidebar/sidebar.model';
import FooterDataSourcePopUp from '~/@/map/ui/footer-data-source-pop-up';

const SchoolCoverageLayer = () => {
  const { schoolIds = [0] } = useStore($getSchoolParams);
  const schoolStats = useStore($schoolStats);
  const { selectedLayerData } = useStore($layerUtils);
  const isMoreThenOne = (schoolIds?.length || 0) > 1

  return (
    <>
      <CurrentLayerNameIcon label={selectedLayerData?.name} icon={selectedLayerData?.icon} />
      {!isMoreThenOne && <SingleSchoolCoverageLayer schoolId={schoolIds[0]} />}
      {isMoreThenOne && <MultiSchoolLayerView schoolLength={schoolIds.length} schoolLayerList={schoolStats} />}
      <FooterDataSourcePopUp size={25} isFooter={false} />
    </>
  )
}

export default SchoolCoverageLayer
