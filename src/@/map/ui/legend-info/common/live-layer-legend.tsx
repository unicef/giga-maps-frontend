import { ChevronUp, Information } from "@carbon/icons-react";
import { Checkbox } from "@carbon/react";
import { useStore } from 'effector-react';
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";

import { TooltipButton } from "~/@/common/style/styled-component-style";
import { $country, $countryConnectivityNames } from '~/@/country/country.model';
import { $stylePaintData } from "~/@/map/map.model";
import { ConnectivityBenchMarks, ConnectivityStatusDistribution } from '~/@/sidebar/sidebar.constant';
import {
  $benchmarkmarkUtils,
  $benchmarkNamesAllLayers,
  $connectivityBenchMark,
  $connectivitySpeedGood,
  $connectivitySpeedModerate,
  $connectivitySpeednoInternet,
  $connectivitySpeedUnknown,
  $connectivityStats,
  $layerUtils,
  $schoolStats,
  changeConnectivitySpeedGood,
  changeConnectivitySpeedModerate,
  changeConnectivitySpeednoInternet,
  changeConnectivitySpeedUnknown,
} from '~/@/sidebar/sidebar.model';
import { defaultLegendValuesType } from "~/api/types";
import { $lng } from "~/core/i18n/store";
import { $mapRoutes } from "~/core/routes";
import { formatNumber } from '~/lib/utils';

import {
  CheckBoxContainer,
  CircleWrapper,
  InnerCircle,
  InnerCircleConnectivity,
  LegendBenchmarkButton,
  LegendBenchmarkStack,
  LiveLayerBenchmark} from '../legend-button.style';

interface CheckedStatus {
  [key: string]: boolean;
}

const LiveLayerLegend = ({
  markerShape = "circle",
  shouldShowControls
}: {
  markerShape?: "circle" | "square";
  shouldShowControls: boolean;
}) => {
  const lng = useStore($lng);
  const { t } = useTranslation();
  const { schools } = useStore($mapRoutes);
  const paintData = useStore($stylePaintData);
  const { currentLayerLegends: legends, selectedLayerData, selectedLayerId } = useStore($layerUtils);
  const { benchmarkLogic } = useStore($benchmarkmarkUtils)
  const countryConnectivityNames = useStore($countryConnectivityNames);
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
  const bencharkmarkValue = (!schools ? realtimeStatsFromStore : schoolRealTimeStats?.[0])?.benchmark_metadata?.rounded_benchmark_value;
  const unitLabel = (!schools ? realtimeStatsFromStore : schoolRealTimeStats?.[0])?.benchmark_metadata?.display_unit;
  const nationalBenchMarkDescription = countryBenchmarkDescriptions?.[selectedLayerData?.id ?? 0] ?? "";
  const isNational = connectivityBenchMark === ConnectivityBenchMarks.national;
  const [showBenchmarks, setShowBenchmarks] = useState(false);
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
        break;
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

  useEffect(() => {
    if (!shouldShowControls) {
      setShowBenchmarks(false);
    }
  }, [shouldShowControls]);

  const currentBenchmarkName = isNational
    ? countryConnectivityNames?.[selectedLayerId as number] ?? t('national-benchmark')
    : benchmarkNames[selectedLayerId ?? ""] ?? t('global-benchmark');
  const alternateBenchmarkLabel = isNational
    ? t('legend-global-benchmark-value', { value: '50Mbps' })
    : t('legend-national-benchmark-value', { value: '10Mbps' });
  const currentBenchmarkLabel = bencharkmarkValue && unitLabel
    ? `${currentBenchmarkName}: ${bencharkmarkValue}${unitLabel}`
    : currentBenchmarkName;

  return (
    <div className='school-status'>
      <div className='legend-section-header legend-section-header--stacked'>
        <div className="legend-section-heading">
          <h3>{selectedLayerData?.name}</h3>
          <TooltipButton align='top' label={t('internet-quality')}>
            <button type="button">
              <Information size={12} />
            </button>
          </TooltipButton>
        </div>
      </div>
      {
        legends.values.map(({ key, label, tooltip }: { key: string, label: string, tooltip?: string }) => {
          const logicLabel = `${(benchmarkLogic && key) != "unknown" ? benchmarkLogic?.[key] : t('doesnt-match-any-criteria')}`;
          const toolTiplabel = tooltip ? tooltip : logicLabel;
          const displayLabel = selectedLayerData?.name?.toLowerCase().includes('download')
            ? ({
              good: t('high'),
              moderate: t('moderate'),
              bad: t('low'),
              unknown: t('unknown'),
            }[key] ?? label)
            : label;
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
                        <CircleWrapper $large $shape={markerShape}>
                          <InnerCircleConnectivity $backColor={legends.colors[key]} $large $shape={markerShape} className="outer-circle" />
                          <InnerCircle className="inner-circle" $backColor={paintData[ConnectivityStatusDistribution.connected as string]} $shape={markerShape} />
                        </CircleWrapper>
                        <p className="label">{displayLabel}</p>
                      </div>
                    </div>
                    {shouldShowControls && key === 'bad' ? <div className='legend-value' data-title={t('int', { val: realtimeStats?.no_internet ?? 0 })}>{formatNumber(realtimeStats?.no_internet ?? 0, lng)}</div> : shouldShowControls && <div className='legend-value' data-title={t('int', { val: realtimeStats?.[key] ?? 0 })}>{formatNumber(realtimeStats?.[key] ?? 0, lng)}</div>}
                  </div>
                </button>
              </TooltipButton>
            </div>
          )
        }
        )}
      <TooltipButton $hideLabel={(!isNational || !nationalBenchMarkDescription)} label={nationalBenchMarkDescription ?? ""} align='top'>
        {shouldShowControls ? (
          <LegendBenchmarkStack $interactive>
            <LegendBenchmarkButton onClick={() => setShowBenchmarks(prev => !prev)} type="button">
              <span>{currentBenchmarkLabel}</span>
              <ChevronUp size={12} />
            </LegendBenchmarkButton>
            {showBenchmarks && (
              <LegendBenchmarkButton $muted onClick={() => setShowBenchmarks(false)} type="button">
                <span>{alternateBenchmarkLabel}</span>
              </LegendBenchmarkButton>
            )}
          </LegendBenchmarkStack>
        ) : (
          <LiveLayerBenchmark>{currentBenchmarkLabel}</LiveLayerBenchmark>
        )}
      </TooltipButton>
    </div>
  )
}

export default LiveLayerLegend
