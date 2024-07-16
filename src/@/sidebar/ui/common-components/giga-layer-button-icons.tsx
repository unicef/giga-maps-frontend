import {
  Account,
  Wifi
} from '@carbon/icons-react';
import { useStore } from 'effector-react';
import { useCallback } from 'react'

import { CustomIcon } from '~/@/common/style/styled-component-style';
import { $selectedGigaLayers } from '~/@/map/map.model';
import { $layerUtils, $schoolStatusSelectedLayer, $staticLayers, onSelectMainLayer, onSelectSchoolStatusLayer, resetCoverageFilterSelection, selectAllStaticLegendsSelection } from '~/@/sidebar/sidebar.model';

import { SCHOOL_STATUS_LAYER } from '../../sidebar.constant';
import GigaLayerButton from './giga-layer-button';
import { GigaLayerText, SidePanelLayerWrapper } from './styles/giga-layer.style';
import { $countryCode } from '~/@/country/country.model';


const GigaLayerButtonIcons = ({ popup }: { popup?: boolean }) => {
  const countryCode = useStore($countryCode)?.toLowerCase();
  const { currentDefaultLayerId, selectedLayerId, staticLayers, currentLayerTypeUtils, downloadLayerId, coverageLayerData, activeLayerByCountryCode } = useStore($layerUtils);
  const { layerId: lastSelectedLayerId } = useStore($selectedGigaLayers);
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
          disabled={!activeLayerByCountryCode[String(downloadLayerId)]}
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
        {coverageLayerData && <GigaLayerButton
          label={coverageLayerData.name}
          popup={popup}
          disabled={!activeLayerByCountryCode[String(coverageLayerData.id)]}
          isActive={coverageLayerData.id === selectedLayerId}
          icon={<CustomIcon dangerouslySetInnerHTML={{ __html: coverageLayerData.icon }} />}
          onClick={() => {
            if (coverageLayerData) {
              updateLayer(coverageLayerData.id);
              resetCoverageFilterSelection()
            }
          }}
        />}
        {popup && staticLayers.map((layer) => (!!layer.created_by && <GigaLayerButton
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
