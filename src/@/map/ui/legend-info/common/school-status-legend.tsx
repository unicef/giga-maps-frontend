import { Information } from "@carbon/icons-react";
import { Checkbox } from "@carbon/react";
import { useStore } from 'effector-react';
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";

import { $globalStats, $stylePaintData } from '~/@/map/map.model';
import { ConnectivityStatusDistribution } from '~/@/sidebar/sidebar.constant';
import {
  $layerUtils,
  $staticLegendsSelected,
  staticLegendsSelection} from '~/@/sidebar/sidebar.model';
import { ConnectivityStatusNames } from '~/@/sidebar/ui/global-and-country-view-components/container/layer-view.constant';
import { $lng } from "~/core/i18n/store";
import { formatNumber } from '~/lib/utils';

import { CheckBoxContainer, CircleWrapper, InnerCircle } from '../legend-button.style';

interface CheckedStatus {
  [key: string]: boolean;
}

const SchoolStatusLegend = ({
  markerShape = "circle",
  shouldShowControls
}: {
  markerShape?: "circle" | "square";
  shouldShowControls: boolean;
}) => {
  const { t } = useTranslation();
  const lng = useStore($lng);
  const paintData = useStore($stylePaintData);
  const { currentLayerTypeUtils } = useStore($layerUtils);
  const { isSchoolStatus } = currentLayerTypeUtils;
  const [schoolStatusCheckedStatus, setSchoolStatusCheckedStatus] = useState<CheckedStatus>({});
  const { connected, notConnected, unknown } = ConnectivityStatusDistribution;
  const globalStatsFromStore = useStore($globalStats)
  const staticLegends = useStore($staticLegendsSelected);
  const schoolStatusStats = globalStatsFromStore?.connected_schools as Record<string, number> | undefined;


  const handleSchoolStatusLayerChange = (key: string) => {
    const newStatus = !schoolStatusCheckedStatus[key];
    setSchoolStatusCheckedStatus(prevState => ({
      ...prevState,
      [key]: newStatus
    }));

    switch (key) {
      case 'connected':
        staticLegendsSelection(connected);
        break;
      case 'not_connected':
        staticLegendsSelection(notConnected);
        break;
      case 'unknown':
        staticLegendsSelection(unknown);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setSchoolStatusCheckedStatus({
      connected: staticLegends.includes(connected),
      not_connected: staticLegends.includes(notConnected),
      unknown: staticLegends.includes(unknown),
    });
  }, [staticLegends]);

  if (!isSchoolStatus) return null;
  return (<div className='school-status'>
    <div className='legend-section-header'>
      <h3>{t('school-status')}</h3>
      <Information size={12} />
    </div>
    {
      Object.values(ConnectivityStatusDistribution).map((key, index) => (
        <div className='legend-container' key={`${key}`}>
          <div className='checkbox-with-label'>
            {shouldShowControls && <CheckBoxContainer><Checkbox id={`school-status-${key}`}
              labelText={''}
              checked={schoolStatusCheckedStatus[key]}
              onChange={() => handleSchoolStatusLayerChange(key)} >

            </Checkbox></CheckBoxContainer>}
            <div key={`${key}${index}`} className='conneted-info'>
              <CircleWrapper $shape={markerShape}>
                <InnerCircle $backColor={paintData[key]} $shape={markerShape} />
              </CircleWrapper>
              <p className="label">{t(ConnectivityStatusNames[key])}</p>
            </div>
          </div>
          {shouldShowControls && <div className='legend-value' data-title={t('int', { val: schoolStatusStats?.[key] ?? 0 })}>{formatNumber(schoolStatusStats?.[key] ?? 0, lng)}</div>}
        </div>
      )
      )}
  </div>
  )
}

export default SchoolStatusLegend
