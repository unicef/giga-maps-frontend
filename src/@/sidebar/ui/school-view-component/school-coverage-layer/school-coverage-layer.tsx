import { useStore } from 'effector-react';

import CurrentLayerNameIcon from '../../common-components/current-layer-name-Icon';
import SingleSchoolCoverageLayer from '../common/single-school-coverage-layer';
import MultiSchoolLayerView from '../common/multi-school-layer.view';
import {
  $getSchoolParams,
  $layerUtils,
  $schoolStats,
} from '~/@/sidebar/sidebar.model';
import FooterDataSourcePopUp from '~/@/map/ui/footer-data-source-pop-up';

const SchoolCoverageLayer = () => {
  const { entityType, schoolIds = [0] } = useStore($getSchoolParams);
  const schoolStats = useStore($schoolStats);
  const { selectedLayerDataByEntity } = useStore($layerUtils);
  const selectedLayerData = entityType
    ? selectedLayerDataByEntity[entityType]
    : null;
  const isMoreThenOne = (schoolIds?.length || 0) > 1;

  if (!entityType) return null;
  return (
    <>
      {/* <CurrentLayerNameIcon label={selectedLayerData?.name} icon={selectedLayerData?.icon} /> */}
      {!isMoreThenOne && <SingleSchoolCoverageLayer schoolId={schoolIds[0]} />}
      {isMoreThenOne && (
        <MultiSchoolLayerView
          entityType={entityType}
          schoolLength={schoolIds.length}
          schoolLayerList={schoolStats}
        />
      )}
      <FooterDataSourcePopUp isFooter={false} entityType={entityType} />
    </>
  );
};

export default SchoolCoverageLayer;
