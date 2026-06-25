

import { useStore } from 'effector-react';

import { EntityType } from '~/@/entities';
import FooterDataSourcePopUp from '~/@/map/ui/footer-data-source-pop-up';
import { $getSchoolParams, $layerUtils, $schoolStats } from '~/@/sidebar/sidebar.model';

import CurrentLayerNameIcon from '../../common-components/current-layer-name-Icon';
import MultiSchoolLayerView from '../common/multi-school-layer.view';
import SingleSchoolCoverageLayer from '../common/single-school-coverage-layer';

const SchoolCoverageLayer = () => {
  const allPrams = useStore($getSchoolParams);
  const schoolStats = useStore($schoolStats);
  const { selectedLayerData } = useStore($layerUtils);
  const schoolIds = [];
  for (const element of Object.values(EntityType)) {
    if (allPrams[element + "__ids"]) {
      schoolIds.push(...allPrams[element + "__ids"]);
    }
  }
  const isMoreThenOne = (schoolIds?.length || 0) > 1

  return (
    <>
      {/* <CurrentLayerNameIcon label={selectedLayerData?.name} icon={selectedLayerData?.icon} /> */}
      {!isMoreThenOne && <SingleSchoolCoverageLayer schoolId={schoolIds[0]} />}
      {isMoreThenOne && <MultiSchoolLayerView schoolLength={schoolIds.length} schoolLayerList={schoolStats} />}
      <FooterDataSourcePopUp isFooter={false} />
    </>
  )
}

export default SchoolCoverageLayer
