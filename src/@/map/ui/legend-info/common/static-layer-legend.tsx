import { ChevronUp, Information } from "@carbon/icons-react";
import { Checkbox } from "@carbon/react";
import { useStore } from 'effector-react';
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";

import { Div, TooltipButton } from "~/@/common/style/styled-component-style";
import { $country, $countryConnectivityNames } from "~/@/country/country.model";
import type { EntityLegendShape } from "~/@/entities/config/entity-config.types";
import { ConnectivityBenchMarks } from "~/@/sidebar/sidebar.constant";
import {
  $benchmarkNamesAllLayers,
  $connectivityBenchMark,
  $coverage3g2g,
  $coverage5g4g,
  $coverageNoCoverage,
  $coverageStats,
  $coverageUnknown,
  $layerUtils,
  changeCoverage3g2g,
  changeCoverage5g4g,
  changeCoverageNoCoverage,
  changeCoverageUnknown,
} from '~/@/sidebar/sidebar.model';
import { $lng } from "~/core/i18n/store";
import { formatNumber } from '~/lib/utils';

import {
  CheckBoxContainer,
  CircleWrapper,
  InnerCircle,
  LegendBenchmarkButton,
  LegendBenchmarkStack,
  LiveLayerBenchmark} from '../legend-button.style';

interface CheckedStatus {
  [key: string]: boolean;
}

const StaticLayerLegend = ({
  markerShape = "circle",
  shouldShowControls
}: {
  markerShape?: EntityLegendShape;
  shouldShowControls: boolean;
}) => {
  const lng = useStore($lng);
  const { t } = useTranslation();
  const countryConnectivityNames = useStore($countryConnectivityNames);
  const [staticLayerCheckedStatus, setStaticLayerCheckedStatus] = useState<CheckedStatus>({});
  const { currentLayerLegends: legends, selectedLayerData, selectedLayerId } = useStore($layerUtils);
  const coverageStats = useStore($coverageStats) as { connected_schools?: Record<string, number> } | null;
  const connectivityBenchMark = useStore($connectivityBenchMark)
  const countryObj = useStore($country);
  const countryBenchmarkDescriptions = countryObj?.benchmark_metadata?.layer_descriptions;
  const isNational = connectivityBenchMark === ConnectivityBenchMarks.national;
  const nationalBenchMarkDescription = countryBenchmarkDescriptions?.[selectedLayerData?.id ?? 0] ?? "";
  const benchmarkNames = useStore($benchmarkNamesAllLayers);
  const [showBenchmarks, setShowBenchmarks] = useState(false);

  // Get coverage filter values from store (synced with URL params)
  const coverage5g4g = useStore($coverage5g4g);
  const coverage3g2g = useStore($coverage3g2g);
  const coverageNoCoverage = useStore($coverageNoCoverage);
  const coverageUnknown = useStore($coverageUnknown);

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
        break;
    }
  };

  // Sync local checkbox state with store values (including URL params on first load)
  useEffect(() => {
    setStaticLayerCheckedStatus({
      'good': coverage5g4g,
      'moderate': coverage3g2g,
      'bad': coverageNoCoverage,
      'unknown': coverageUnknown,
    });
  }, [coverage5g4g, coverage3g2g, coverageNoCoverage, coverageUnknown]);

  useEffect(() => {
    if (!shouldShowControls) {
      setShowBenchmarks(false);
    }
  }, [shouldShowControls]);

  const currentBenchmarkName = isNational
    ? countryConnectivityNames?.[selectedLayerId as number]
    : benchmarkNames[selectedLayerId ?? ""];
  const alternateBenchmarkLabel = isNational
    ? t('legend-global-benchmark-value', { value: '50Mbps' })
    : t('legend-national-benchmark-value', { value: '10Mbps' });
  return (<div className='school-status'>
    <div className='legend-section-header legend-section-header--stacked'>
      <div className="legend-section-heading">
        <h3>{selectedLayerData?.name}</h3>
        <TooltipButton align='top' $hideLabel={!selectedLayerData?.description} label={selectedLayerData?.description ?? ""}>
          <button type="button">
            <Information size={12} />
          </button>
        </TooltipButton>
      </div>
      <p className='legend-section-meta'>{t('internet-quality')}</p>
    </div>
    {
      legends.values.map(({ key, label, tooltip }) => {
        const logicLabel = key === 'unknown' ? (tooltip || `Doesn't match any criteria`) : tooltip;
        const toolTiplabel = logicLabel;
        return (
          (coverageStats?.connected_schools &&
            (label) in coverageStats.connected_schools &&
            coverageStats.connected_schools[label] > 0)
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
                        <CircleWrapper $shape={markerShape}>
                          <InnerCircle $backColor={legends.colors[key]} $large $shape={markerShape} />
                        </CircleWrapper>
                        <p className="label">{label}{" "}</p>
                      </div>
                    </div>
                    {shouldShowControls && coverageStats?.connected_schools && (
                      <div className='legend-value' data-title={t('int', { val: coverageStats?.connected_schools?.[label] ?? 0 })}>{formatNumber(coverageStats?.connected_schools?.[label] ?? 0, lng)}</div>
                    )}
                  </div>
                </button>
              </TooltipButton>
            </Div> : null)
      }
      )}
    <TooltipButton $hideLabel={(!isNational || !nationalBenchMarkDescription)} label={nationalBenchMarkDescription ?? ""} align='top'>
      {currentBenchmarkName ? (
        shouldShowControls ? (
          <LegendBenchmarkStack $interactive>
            <LegendBenchmarkButton onClick={() => setShowBenchmarks(prev => !prev)} type="button">
              <span>{currentBenchmarkName}</span>
              <ChevronUp size={12} />
            </LegendBenchmarkButton>
            {showBenchmarks && (
              <LegendBenchmarkButton $muted onClick={() => setShowBenchmarks(false)} type="button">
                <span>{alternateBenchmarkLabel}</span>
              </LegendBenchmarkButton>
            )}
          </LegendBenchmarkStack>
        ) : (
          <LiveLayerBenchmark>{currentBenchmarkName}</LiveLayerBenchmark>
        )
      ) : null}
    </TooltipButton>
  </div>
  )
}

export default StaticLayerLegend
