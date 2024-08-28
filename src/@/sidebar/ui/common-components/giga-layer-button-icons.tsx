import {
  Account,
  Wifi
} from '@carbon/icons-react';
import { useStore } from 'effector-react';
import { useCallback } from 'react'

import { CustomIcon } from '~/@/common/style/styled-component-style';
import { $layerUtils, $schoolStatusSelectedLayer, onSelectMainLayer, onSelectSchoolStatusLayer, resetCoverageFilterSelection, selectAllStaticLegendsSelection } from '~/@/sidebar/sidebar.model';

import { SCHOOL_STATUS_LAYER } from '../../sidebar.constant';
import GigaLayerButton from './giga-layer-button';
import { GigaLayerText, SidePanelLayerWrapper } from './styles/giga-layer.style';


const GigaLayerButtonIcons = ({ popup }: { popup?: boolean }) => {
  const { currentDefaultLayerId, selectedLayerId, staticLayers, currentLayerTypeUtils, coverageLayerData, coverageDynamicLayerData, activeLayerByCountryCode } = useStore($layerUtils);
  const schoolStatusSelectedLayer = useStore($schoolStatusSelectedLayer);
  const { isLive, isSchoolStatus } = currentLayerTypeUtils;
  const updateLayer = useCallback((prevSelectedId: number | null) => {
    let selectedId = null;
    if (selectedLayerId !== prevSelectedId) {
      selectedId = prevSelectedId
    }
    onSelectMainLayer(selectedId);
  }, [selectedLayerId]);

  const handleSchoolConnectivityClicked = useCallback((selectedId: number) => {
    // Logic for toggling of school connectivity status ON and OFF only when overlay layer should have some selected
    if (selectedLayerId) {
      onSelectSchoolStatusLayer(schoolStatusSelectedLayer ? null : selectedId);
      selectAllStaticLegendsSelection([]);
    }
  }, [selectedLayerId, schoolStatusSelectedLayer]);
  return (
    <>
      {popup && <GigaLayerText>Giga Layers</GigaLayerText>}
      <SidePanelLayerWrapper $wrap={popup}>
        <GigaLayerButton
          label="School status"
          popup={popup}
          isActive={isSchoolStatus}
          icon={<Account className='layer-icon' />}
          onClick={() => {
            handleSchoolConnectivityClicked(SCHOOL_STATUS_LAYER.id)
          }}
        />
        <GigaLayerButton
          label="Real-time Connectivity"
          disabled={!(activeLayerByCountryCode[String(currentDefaultLayerId)])}
          popup={popup}
          isActive={isLive}
          icon={<Wifi className='layer-icon' />}
          onClick={() => {
            if (isLive) {
              updateLayer(null);
            } else {
              updateLayer(currentDefaultLayerId);
            }
          }}
        />
        <GigaLayerButton
          label={coverageDynamicLayerData?.name ?? "Cellular Coverage"}
          popup={popup}
          disabled={!coverageDynamicLayerData || !activeLayerByCountryCode[String(coverageDynamicLayerData?.id)]}
          isActive={coverageDynamicLayerData?.id === selectedLayerId}
          icon={<CustomIcon dangerouslySetInnerHTML={{ __html: coverageDynamicLayerData?.icon ?? "" }} />}
          onClick={() => {
            if (coverageDynamicLayerData) {
              updateLayer(coverageDynamicLayerData.id);
              resetCoverageFilterSelection()
            }
          }}
        />
        {popup && staticLayers.map((layer) => ((layer.created_by && layer.id !== coverageDynamicLayerData?.id) && <GigaLayerButton
          key={layer.name}
          disabled={!activeLayerByCountryCode[layer.id]}
          label={layer.name}
          popup={popup}
          isActive={layer.id === selectedLayerId}
          icon={<CustomIcon dangerouslySetInnerHTML={{ __html: layer.icon }} />}
          onClick={() => {
            if (coverageLayerData) {
              updateLayer(layer.id);
              resetCoverageFilterSelection()
            }
          }}
        />))}
      </SidePanelLayerWrapper>
    </>

  )
}

export default GigaLayerButtonIcons
