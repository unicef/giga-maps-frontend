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
import { useTranslation } from 'react-i18next';


const GigaLayerButtonIcons = ({ popup }: { popup?: boolean }) => {
  const { t } = useTranslation();
  const { currentDefaultLayerId, selectedLayerId, staticLayers, currentLayerTypeUtils, coverageLayerData, staticPopupActiveLayer, activeLayerByCountryCode } = useStore($layerUtils);
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
      {popup && <GigaLayerText>{t('giga-layers')}</GigaLayerText>}
      <SidePanelLayerWrapper $wrap={popup}>
        <GigaLayerButton
          label={t("school-status")}
          popup={popup}
          isActive={isSchoolStatus}
          icon={<Account className='layer-icon' />}
          onClick={() => {
            handleSchoolConnectivityClicked(SCHOOL_STATUS_LAYER.id)
          }}
        />
        <GigaLayerButton
          label={t("real-time-connectivity")}
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
          label={staticPopupActiveLayer?.name ?? "Cellular Coverage"}
          popup={popup}
          disabled={!staticPopupActiveLayer || !activeLayerByCountryCode[String(staticPopupActiveLayer?.id)]}
          isActive={staticPopupActiveLayer?.id === selectedLayerId}
          icon={<CustomIcon dangerouslySetInnerHTML={{ __html: staticPopupActiveLayer?.icon ?? "" }} />}
          onClick={() => {
            if (staticPopupActiveLayer) {
              updateLayer(staticPopupActiveLayer.id);
              resetCoverageFilterSelection()
            }
          }}
        />
        {popup && staticLayers.map((layer) => ((layer.created_by && layer.id !== staticPopupActiveLayer?.id) && <GigaLayerButton
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
