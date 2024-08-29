import { Checkbox, PopoverContent, Tooltip } from "@carbon/react";
import { useStore } from 'effector-react';
import { PropsWithChildren, useEffect, useState } from 'react';

import { $mapRoutes } from '~/core/routes';
import { CoverageKeyMapping, ConnectivityStatusNames } from '~/@/sidebar/ui/global-and-country-view-components/container/layer-view.constant';

import {
  $connectivitySpeedGood,
  $connectivitySpeedModerate,
  $connectivitySpeednoInternet,
  $connectivitySpeedUnknown,
  $connectivityStats,
  changeConnectivitySpeedGood,
  changeConnectivitySpeedModerate,
  changeConnectivitySpeednoInternet,
  changeConnectivitySpeedUnknown,
  staticLegendsSelection,
  changeCoverage3g2g,
  changeCoverage5g4g,
  changeCoverageNoCoverage,
  changeCoverageUnknown,
  $coverageStats,
  $connectivityBenchMark,
  $benchmarkmarkUtils,
  $layerUtils,
  $staticLegendsSelected
} from '~/@/sidebar/sidebar.model';
import { $country } from '~/@/country/country.model';
import { ConnectivityBenchMarks, ConnectivityStatusDistribution } from '~/@/sidebar/sidebar.constant';
import { $globalStats } from '~/@/map/map.model';
import { $stylePaintData } from '../../map.model';
import { CircleWrapper, CustomeLegendPopover, InnerCircle, InnerCircleConnectivity, LegendContentWrapper, LegendHeaderWrapper } from './legend-button.style';
import styled from 'styled-components';
import { formatNumber } from '~/lib/utils';

interface LegendPopupProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface CheckedStatus {
  [key: string]: boolean;
}

const CheckBoxContainer = styled.div`
  display: flex;
  margin-top: 1rem;
  .cds--checkbox-label::before{
    border: 1px solid grey;
    border-width: 1px;
    background-color: white;
  }
  .cds--checkbox-label::after {
        border-block-end: 1.5px solid black;
    border-inline-start: 1.5px solid black;
  }
  .cds--checkbox:checked + .cds--checkbox-label::before{
    border: 1px solid grey;
    border-width: 1px;
    background-color: white;
  }
`

const LiveLayerBenchmark = styled.div`
  color:${props => props.theme.text};
  font-size: 0.65rem;
  opacity: 0.6;
  margin-top: 0.2rem;
  cursor: pointer;
  text-decoration: underline;
`

const LegendPopup = ({ open, setOpen, children }: PropsWithChildren<{ open: boolean, setOpen: (open: boolean) => void, }>) => {

  const paintData = useStore($stylePaintData);
  const { currentLayerTypeUtils, currentLayerLegends: legends, selectedLayerData, selectedLayerId, coverageLayerId } = useStore($layerUtils);
  const isCoverage = selectedLayerId === coverageLayerId;
  const { isLive, isStatic, isSchoolStatus } = currentLayerTypeUtils;

  const { benchmarkLogic, globalBenchmarkValue, benchmarkName, countryConnectivityNames, nationalBenchmarkValue } = useStore($benchmarkmarkUtils)
  const speedGood = useStore($connectivitySpeedGood);
  const speedModerate = useStore($connectivitySpeedModerate);
  const speedNoInternet = useStore($connectivitySpeednoInternet);
  const speedUnknown = useStore($connectivitySpeedUnknown);

  const connectivityBenchMark = useStore($connectivityBenchMark)

  const countryObj = useStore($country);
  const countryBenchmarkDescriptions = countryObj?.benchmark_metadata?.layer_descriptions;
  const [nationalBenchMarkDescription, setNationalBenchMarkDescription] = useState("");


  const coverageStats: any = useStore($coverageStats);

  const [realtimeCheckedStatus, setRealtimeCheckedStatus] = useState<CheckedStatus>({});
  const [schoolStatusCheckedStatus, setSchoolStatusCheckedStatus] = useState<CheckedStatus>({});
  const [staticLayerCheckedStatus, setStaticLayerCheckedStatus] = useState<CheckedStatus>({});

  const { connected, notConnected, unknown } = ConnectivityStatusDistribution;

  const realtimeStatsFromStore = useStore($connectivityStats)
  const globalStatsFromStore = useStore($globalStats)

  const staticLegends = useStore($staticLegendsSelected);


  const realtimeStats: any = realtimeStatsFromStore?.real_time_connected_schools ?? {};
  const schoolStatusStats: any = globalStatsFromStore?.connected_schools;

  const dataSourceId = selectedLayerData?.data_sources_list?.length ? selectedLayerData.data_sources_list[0].id : undefined;
  const unitLabel = selectedLayerData?.data_source_column[dataSourceId].display_unit;

  const handleRealtimeLayerChange = (key: string) => {
    const newStatus = !realtimeCheckedStatus[key];


    setRealtimeCheckedStatus(prevState => ({
      ...prevState,
      [key]: newStatus
    }));


    // Call the appropriate function based on the key
    switch (key) {
      case 'good':
        changeConnectivitySpeedGood(newStatus);
        break;
      case 'moderate':
        changeConnectivitySpeedModerate(newStatus);
        break;
      case 'bad':
        changeConnectivitySpeednoInternet(newStatus);
        break;
      case 'unknown':
        changeConnectivitySpeedUnknown(newStatus);
        break;
      default:
        console.log('Unknown key:', key);
    }
  };

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

  const mapLevel = useStore($mapRoutes);
  const shouldShowControls = !mapLevel.map && !mapLevel.schools;

  useEffect(() => {
    const keys = countryBenchmarkDescriptions ? Object.keys(countryBenchmarkDescriptions) : [];
    if (selectedLayerData?.id && keys.includes(selectedLayerData.id.toString())) {
      const description = countryBenchmarkDescriptions?.[selectedLayerData.id];
      setNationalBenchMarkDescription(description ?? "");
    }
  }, [selectedLayerData?.id, countryBenchmarkDescriptions]);

  useEffect(() => {
    setRealtimeCheckedStatus({
      good: speedGood,
      moderate: speedModerate,
      bad: speedNoInternet,
      unknown: speedUnknown
    });
  }, [speedGood, speedModerate, speedNoInternet, speedUnknown]);

  useEffect(() => {
    setSchoolStatusCheckedStatus({
      connected: staticLegends.includes(connected),
      not_connected: staticLegends.includes(notConnected),
      unknown: staticLegends.includes(unknown),
    });
  }, [staticLegends]);

  useEffect(() => {
    setStaticLayerCheckedStatus({
      'good': true,
      'moderate': true,
      'bad': true,
      'unknown': true,
    });
  }, []);

  return (
    <CustomeLegendPopover
      open={open}
      align={"left-bottom"}
      className="legend-info-popover-link"
    >
      {children}
      <PopoverContent className="legend-info-popover-content">
        <LegendHeaderWrapper>
        </LegendHeaderWrapper>
        <LegendContentWrapper>
          {isSchoolStatus && <div className='school-status'>
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
          </div>}
          {isLive &&
            <div className='school-status'>
              <h3>{selectedLayerData?.name}</h3>

              {connectivityBenchMark === ConnectivityBenchMarks.national ? nationalBenchMarkDescription ? <Tooltip label={nationalBenchMarkDescription} align='top'>
                <button style={{ background: 'none', border: 'none', padding: 0, margin: 0 }}>
                  <LiveLayerBenchmark>
                    {countryConnectivityNames?.[selectedLayerId as number] ?? "National Benchmark"} - {nationalBenchmarkValue}{unitLabel}
                  </LiveLayerBenchmark>
                </button>
              </Tooltip> : <LiveLayerBenchmark>
                {countryConnectivityNames?.[selectedLayerId as number] ?? "National Benchmark"} - {nationalBenchmarkValue}{unitLabel}
              </LiveLayerBenchmark> : <LiveLayerBenchmark>
                {benchmarkName ?? 'Global Benchmark'} - {globalBenchmarkValue}{unitLabel}
              </LiveLayerBenchmark>}
              {
                legends.values.map(({ key, label, tooltip }) => {
                  let tooltipLabel = `${benchmarkLogic && key != "unknown" ? benchmarkLogic[key] : `Doesn't match any criteria`}`;
                  return (
                    <div key={key}>
                      <Tooltip leaveDelayMs={50} label={tooltip ?? tooltipLabel} align='left'>
                        <button style={{ background: 'none', border: 'none', padding: 0, margin: 0 }}>
                          <div className='legend-container'>
                            <div className='checkbox-with-label'>
                              {shouldShowControls && <CheckBoxContainer><Checkbox id={key}
                                labelText={''}
                                checked={realtimeCheckedStatus[key]}
                                onChange={() => handleRealtimeLayerChange(key)} >
                              </Checkbox></CheckBoxContainer>}

                              <div key={key} className='real-time-connetivity-info'>
                                <CircleWrapper>
                                  <InnerCircleConnectivity $backColor={legends.colors[key]} className="outer-circle" />
                                  <InnerCircle className="inner-circle" $backColor={paintData[ConnectivityStatusDistribution.connected as string]} />
                                </CircleWrapper>
                                <p className="label">{label}</p>
                              </div>
                            </div>

                            {shouldShowControls && key === 'bad' ? <div className='legend-value'>{formatNumber(realtimeStats['no_internet'])}</div> : shouldShowControls && <div className='legend-value'>{formatNumber(realtimeStats[key])}</div>}
                          </div>
                        </button>
                      </Tooltip>
                    </div>
                  )
                }
                )}
            </div>}

          {isStatic && <div className='school-status'>
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
          </div>}
        </LegendContentWrapper>
      </PopoverContent >
    </CustomeLegendPopover >
  )
}

export default LegendPopup