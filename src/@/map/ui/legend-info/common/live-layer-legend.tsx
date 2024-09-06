import { Checkbox } from "@carbon/react";
import { useStore } from 'effector-react';
import { useEffect, useState } from 'react';
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
  $connectivityBenchMark,
  $benchmarkmarkUtils,
  $layerUtils,
  $schoolStats,
  $benchmarkNamesAllLayers,
} from '~/@/sidebar/sidebar.model';
import { $country } from '~/@/country/country.model';
import { ConnectivityBenchMarks, ConnectivityStatusDistribution } from '~/@/sidebar/sidebar.constant';
import { CheckBoxContainer, CircleWrapper, InnerCircle, InnerCircleConnectivity, LiveLayerBenchmark } from '../legend-button.style';
import { formatNumber } from '~/lib/utils';
import { $stylePaintData } from "~/@/map/map.model";
import { defaultLegendValuesType } from "~/api/types";
import { TooltipButton } from "~/@/common/style/styled-component-style";
import { $mapRoutes } from "~/core/routes";

interface CheckedStatus {
  [key: string]: boolean;
}

const LiveLayerLegend = ({ shouldShowControls }: { shouldShowControls: boolean }) => {
  const { schools } = useStore($mapRoutes);
  const paintData = useStore($stylePaintData);
  const { currentLayerLegends: legends, selectedLayerData, selectedLayerId } = useStore($layerUtils);
  const { benchmarkLogic, countryConnectivityNames } = useStore($benchmarkmarkUtils)
  const benchmarkNames = useStore($benchmarkNamesAllLayers);
  const speedGood = useStore($connectivitySpeedGood);
  const speedModerate = useStore($connectivitySpeedModerate);
  const speedNoInternet = useStore($connectivitySpeednoInternet);
  const speedUnknown = useStore($connectivitySpeedUnknown);
  const connectivityBenchMark = useStore($connectivityBenchMark)
  const countryObj = useStore($country);
  const countryBenchmarkDescriptions = countryObj?.benchmark_metadata?.layer_descriptions;
  const [realtimeCheckedStatus, setRealtimeCheckedStatus] = useState<CheckedStatus>({});
  const realtimeStatsFromStore = useStore($connectivityStats);
  const schoolRealTimeStats = useStore($schoolStats);
  const realtimeStats = realtimeStatsFromStore?.real_time_connected_schools ?? {} as defaultLegendValuesType;
  const bencharkmarkValue = (!schools ? realtimeStatsFromStore : schoolRealTimeStats?.[0])?.benchmark_metadata.rounded_benchmark_value;
  const unitLabel = (!schools ? realtimeStatsFromStore : schoolRealTimeStats?.[0])?.benchmark_metadata.display_unit;
  const nationalBenchMarkDescription = countryBenchmarkDescriptions?.[selectedLayerData?.id ?? 0] ?? "";
  const isNational = connectivityBenchMark === ConnectivityBenchMarks.national;
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

  useEffect(() => {
    setRealtimeCheckedStatus({
      good: speedGood,
      moderate: speedModerate,
      bad: speedNoInternet,
      unknown: speedUnknown
    });
  }, [speedGood, speedModerate, speedNoInternet, speedUnknown]);

  return (
    <div className='school-status'>
      <h3>{selectedLayerData?.name}</h3>
      <TooltipButton $hideLabel={(!isNational || !nationalBenchMarkDescription)} label={nationalBenchMarkDescription ?? ""} align='top'>
        <button style={{ background: 'none', border: 'none', padding: 0, margin: 0 }}>
          {isNational ? <LiveLayerBenchmark>
            {countryConnectivityNames?.[selectedLayerId as number] ?? "National Benchmark"} - {bencharkmarkValue}&nbsp;{unitLabel}
          </LiveLayerBenchmark> : <LiveLayerBenchmark>
            {benchmarkNames[selectedLayerId ?? ""] ?? 'Global Benchmark'} - {bencharkmarkValue}&nbsp;{unitLabel}
          </LiveLayerBenchmark>}
        </button>
      </TooltipButton>
      {
        legends.values.map(({ key, label, tooltip }: { key: string, label: string, tooltip?: string }) => {
          const logicLabel = `${(benchmarkLogic && key) != "unknown" ? benchmarkLogic?.[key] : `Doesn't match any criteria`}`;
          const toolTiplabel = tooltip ? tooltip : logicLabel;
          return (
            <div key={key}>
              <TooltipButton leaveDelayMs={50} $hideLabel={!toolTiplabel} label={toolTiplabel} align='left'>
                <button>
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
                    {shouldShowControls && key === 'bad' ? <div className='legend-value'>{formatNumber(realtimeStats?.['no_internet'] ?? 0)}</div> : shouldShowControls && <div className='legend-value'>{formatNumber(realtimeStats?.[key] ?? 0)}</div>}
                  </div>
                </button>
              </TooltipButton>
            </div>
          )
        }
        )}
    </div>
  )
}

export default LiveLayerLegend