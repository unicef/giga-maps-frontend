import { Checkbox } from "@carbon/react";
import { useStore } from 'effector-react';
import { useEffect, useState } from 'react';

import { CoverageKeyMapping } from '~/@/sidebar/ui/global-and-country-view-components/container/layer-view.constant';

import {
  changeCoverage3g2g,
  changeCoverage5g4g,
  changeCoverageNoCoverage,
  changeCoverageUnknown,
  $coverageStats,
  $layerUtils,
} from '~/@/sidebar/sidebar.model';
import { CheckBoxContainer, CircleWrapper, InnerCircle } from '../legend-button.style';
import { formatNumber } from '~/lib/utils';

interface CheckedStatus {
  [key: string]: boolean;
}

const StaticLayerLegend = ({ shouldShowControls }: { shouldShowControls: boolean }) => {

  const { currentLayerLegends: legends, selectedLayerData, selectedLayerId, coverageLayerId } = useStore($layerUtils);
  const isCoverage = selectedLayerId === coverageLayerId;

  const coverageStats: any = useStore($coverageStats);

  const [staticLayerCheckedStatus, setStaticLayerCheckedStatus] = useState<CheckedStatus>({});

  const handleStaticLayerToggle = (key: string) => {
    const newStatus = !staticLayerCheckedStatus[key];
    setStaticLayerCheckedStatus(prevState => ({
      ...prevState,
      [key]: newStatus
    }));

    // Update layer visibility based on the coverage key
    switch (key) {
      case 'good':
        changeCoverage5g4g(newStatus);
        break;
      case 'moderate':
        changeCoverage3g2g(newStatus);
        break;
      case 'bad':
        changeCoverageNoCoverage(newStatus);
        break;
      case 'unknown':
        changeCoverageUnknown(newStatus);
        break;
      default:
        console.log('Unknown coverage key:', key);
    }
  };

  useEffect(() => {
    setStaticLayerCheckedStatus({
      'good': true,
      'moderate': true,
      'bad': true,
      'unknown': true,
    });
  }, []);

  return (<div className='school-status'>
    <h3>{selectedLayerData?.name}</h3>
    {
      legends.values.map(({ key, label }) => {
        return (
          <div className='legend-container' key={`${key}`}>
            <div className='checkbox-with-label'>
              {shouldShowControls && (
                <CheckBoxContainer>
                  <Checkbox
                    id={key}
                    labelText={''}
                    checked={staticLayerCheckedStatus[key]}
                    onChange={() => handleStaticLayerToggle(key)}
                  />
                </CheckBoxContainer>
              )}
              <div key={key} className='real-time-connetivity-info'>
                <CircleWrapper>
                  <InnerCircle $backColor={legends.colors[key]} $large />
                </CircleWrapper>
                <p className="label">{label}{" "}</p>

              </div>
            </div>
            {shouldShowControls && coverageStats?.connected_schools && (
              <div className='legend-value'>{formatNumber(coverageStats?.connected_schools[isCoverage ? CoverageKeyMapping[key] : label])}</div>
            )}

          </div>
        )
      }
      )}
  </div>
  )
}

export default StaticLayerLegend