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
  $connectivityBenchMark,
  $benchmarkNamesAllLayers,
} from '~/@/sidebar/sidebar.model';
import { CheckBoxContainer, CircleWrapper, InnerCircle, LiveLayerBenchmark } from '../legend-button.style';
import { formatNumber } from '~/lib/utils';
import { Div, TooltipButton } from "~/@/common/style/styled-component-style";
import { ConnectivityBenchMarks, ConnectivityDistribution } from "~/@/sidebar/sidebar.constant";
import { $country, $countryConnectivityNames } from "~/@/country/country.model";

interface CheckedStatus {
  [key: string]: boolean;
}

const StaticLayerLegend = ({ shouldShowControls }: { shouldShowControls: boolean }) => {
  const countryConnectivityNames = useStore($countryConnectivityNames);
  const [staticLayerCheckedStatus, setStaticLayerCheckedStatus] = useState<CheckedStatus>({});
  const { currentLayerLegends: legends, selectedLayerData, selectedLayerId, coverageLayerId } = useStore($layerUtils);
  const isCoverage = selectedLayerId === coverageLayerId;
  const coverageStats: any = useStore($coverageStats);
  const connectivityBenchMark = useStore($connectivityBenchMark)
  const countryObj = useStore($country);
  const countryBenchmarkDescriptions = countryObj?.benchmark_metadata?.layer_descriptions;
  const isNational = connectivityBenchMark === ConnectivityBenchMarks.national;
  const nationalBenchMarkDescription = countryBenchmarkDescriptions?.[selectedLayerData?.id ?? 0] ?? "";
  const benchmarkNames = useStore($benchmarkNamesAllLayers);

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
    <TooltipButton $hideLabel={(!isNational || !nationalBenchMarkDescription)} label={nationalBenchMarkDescription ?? ""} align='top'>
      <button style={{ background: 'none', border: 'none', padding: 0, margin: 0 }}>
        {isNational && countryConnectivityNames?.[selectedLayerId as number] ? (
          <LiveLayerBenchmark>
            {countryConnectivityNames[selectedLayerId as number]}
          </LiveLayerBenchmark>
        ) : (!isNational && benchmarkNames[selectedLayerId ?? ""]) ? (
          <LiveLayerBenchmark>
            {benchmarkNames[selectedLayerId ?? ""]}
          </LiveLayerBenchmark>
        ) : null}
      </button>
    </TooltipButton>
    {
      legends.values.map(({ key, label, tooltip }) => {
        const logicLabel = key === ConnectivityDistribution.unknown ? (tooltip || `Doesn't match any criteria`) : tooltip;
        const toolTiplabel = logicLabel;
        return (
          (coverageStats?.connected_schools &&
            (isCoverage ? CoverageKeyMapping[key] : label) in coverageStats.connected_schools &&
            coverageStats.connected_schools[isCoverage ? CoverageKeyMapping[key] : label] > 0)
            ? <Div key={key}>
              <TooltipButton leaveDelayMs={50} $hideLabel={!toolTiplabel} label={toolTiplabel} align='left'>
                <button>
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
                </button>
              </TooltipButton>
            </Div> : null)
      }
      )}
  </div>
  )
}

export default StaticLayerLegend
