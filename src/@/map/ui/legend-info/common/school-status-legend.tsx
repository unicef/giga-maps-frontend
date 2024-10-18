import { Checkbox } from "@carbon/react";
import { useStore } from 'effector-react';
import { useEffect, useState } from 'react';
import { ConnectivityStatusNames } from '~/@/sidebar/ui/global-and-country-view-components/container/layer-view.constant';
import {
  staticLegendsSelection,
  $layerUtils,
  $staticLegendsSelected
} from '~/@/sidebar/sidebar.model';
import { ConnectivityStatusDistribution } from '~/@/sidebar/sidebar.constant';
import { $globalStats, $stylePaintData } from '~/@/map/map.model';
import { CheckBoxContainer, CircleWrapper, InnerCircle } from '../legend-button.style';
import { formatNumber } from '~/lib/utils';

interface CheckedStatus {
  [key: string]: boolean;
}

const SchoolStatusLegend = ({ shouldShowControls }: { shouldShowControls: boolean }) => {

  const paintData = useStore($stylePaintData);
  const { currentLayerTypeUtils } = useStore($layerUtils);
  const { isSchoolStatus } = currentLayerTypeUtils;
  const [schoolStatusCheckedStatus, setSchoolStatusCheckedStatus] = useState<CheckedStatus>({});
  const { connected, notConnected, unknown } = ConnectivityStatusDistribution;
  const globalStatsFromStore = useStore($globalStats)
  const staticLegends = useStore($staticLegendsSelected);
  const schoolStatusStats: any = globalStatsFromStore?.connected_schools;


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
        console.log('Unknown key:', key);
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
    <h3>School status</h3>
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
              <CircleWrapper>
                <InnerCircle $backColor={paintData[key]} />
              </CircleWrapper>
              <p className="label">{ConnectivityStatusNames[key]}</p>
            </div>
          </div>
          {shouldShowControls && <div className='legend-value'>{formatNumber(schoolStatusStats[key])}</div>}
        </div>
      )
      )}
  </div>
  )
}

export default SchoolStatusLegend