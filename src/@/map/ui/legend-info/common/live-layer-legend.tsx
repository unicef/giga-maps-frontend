import { useStore } from 'effector-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { $country } from '~/@/country/country.model';
import EntityLegendIndicator from '~/@/entities/ui/entity-legend-indicator';
import { $stylePaintData } from '~/@/map/map.model';
import { ConnectivityBenchMarks, ConnectivityStatusDistribution } from '~/@/sidebar/sidebar.constant';
import {
  $benchmarkmarkUtils,
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
import { DefaultLegendValuesType } from '~/api/types';
import { $lng } from '~/core/i18n/store';
import { $mapRoutes } from '~/core/routes';
import { formatNumber } from '~/lib/utils';

import LegendBenchmarkDropdown from './legend-benchmark-dropdown';
import { Info } from 'lucide-react';

interface CheckedStatus {
  [key: string]: boolean;
}

const LiveLayerLegend = ({
  entityType,
  metricSubtitle,
  metricTitle,
  shouldShowControls,
}: {
  entityType: string;
  metricSubtitle: string;
  metricTitle: string;
  shouldShowControls: boolean;
}) => {
  const lng = useStore($lng);
  const { t } = useTranslation();
  const { schools } = useStore($mapRoutes);
  const paintData = useStore($stylePaintData);
  const { currentLayerLegends: legends, selectedLayerData } = useStore($layerUtils);
  const { benchmarkLogic } = useStore($benchmarkmarkUtils);
  const speedGood = useStore($connectivitySpeedGood);
  const speedModerate = useStore($connectivitySpeedModerate);
  const speedNoInternet = useStore($connectivitySpeednoInternet);
  const speedUnknown = useStore($connectivitySpeedUnknown);
  const connectivityBenchMark = useStore($connectivityBenchMark);
  const countryObj = useStore($country);
  const countryBenchmarkDescriptions = countryObj?.benchmark_metadata?.layer_descriptions;
  const [realtimeCheckedStatus, setRealtimeCheckedStatus] = useState<CheckedStatus>({});
  const realtimeStatsFromStore = useStore($connectivityStats);
  const schoolRealTimeStats = useStore($schoolStats);
  const realtimeStats = realtimeStatsFromStore?.real_time_connected_schools ?? {} as DefaultLegendValuesType;
  const benchmarkValue = (!schools ? realtimeStatsFromStore : schoolRealTimeStats?.[0])?.benchmark_metadata?.rounded_benchmark_value;
  const unitLabel = (!schools ? realtimeStatsFromStore : schoolRealTimeStats?.[0])?.benchmark_metadata?.display_unit;
  const nationalBenchMarkDescription = countryBenchmarkDescriptions?.[selectedLayerData?.id ?? 0] ?? '';

  const handleRealtimeLayerChange = (key: string) => {
    const newStatus = !realtimeCheckedStatus[key];
    setRealtimeCheckedStatus((prevState) => ({
      ...prevState,
      [key]: newStatus,
    }));

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
      unknown: speedUnknown,
    });
  }, [speedGood, speedModerate, speedNoInternet, speedUnknown]);

  const isNational = connectivityBenchMark === ConnectivityBenchMarks.national;
  const currentBenchmarkLabel = benchmarkValue && unitLabel
    ? `${benchmarkValue}${unitLabel}`
    : undefined;

  return (
    <div className="flex! min-w-0! flex-1! basis-[calc(50%-0.5rem)]! flex-col! self-start! max-[560px]:basis-full! max-[560px]:min-w-full!">
      <div className="mb-1! flex! flex-col! items-start! gap-0.5!">
        <div className="flex! items-center! gap-1.5!">
          <div className="text-sm! font-normal! leading-5! text-muted-foreground!">{metricTitle}</div>
          {selectedLayerData?.description ? (
            <button className="inline-flex! items-center! justify-center! border-0! bg-transparent! p-0! text-muted-foreground!" title={selectedLayerData.description} type="button">
              <Info size={12} />
            </button>
          ) : null}
        </div>
        <div className="text-xs! leading-4.5! text-muted-foreground!">{metricSubtitle}</div>
      </div>
      {legends.values.map(({ key, label, tooltip }: { key: string, label: string, tooltip?: string }) => {
        const logicLabel = `${(benchmarkLogic && key) !== 'unknown' ? benchmarkLogic?.[key] : t('doesnt-match-any-criteria')}`;
        const tooltipLabel = tooltip || logicLabel;
        const displayLabel = selectedLayerData?.name?.toLowerCase().includes('download')
          ? ({ good: t('high'), moderate: t('moderate'), bad: t('low'), unknown: t('unknown') }[key] ?? label)
          : label;

        return (
          <button className="mt-1! flex! w-full! items-center! justify-between! border-0! bg-transparent! p-0! text-left!" key={key} title={tooltipLabel} type="button">
            <div className="flex! min-w-0! items-center!">
              {shouldShowControls ? (
                <input
                  checked={Boolean(realtimeCheckedStatus[key])}
                  className="mr-2! h-4! w-4! cursor-pointer! rounded-sm! border! border-border! accent-white!"
                  onChange={() => handleRealtimeLayerChange(key)}
                  type="checkbox"
                />
              ) : null}
              <div className="flex! min-w-0! items-center! gap-2!">
                <EntityLegendIndicator
                  color={paintData[ConnectivityStatusDistribution.connected as string]}
                  entityType={entityType}
                  glowColor={legends.colors[key]}
                />
                <span className="text-sm! font-normal! leading-5! text-foreground!">{displayLabel}</span>
              </div>
            </div>
            {shouldShowControls ? (
              <div
                className="ml-1.5! block! min-w-0! text-left! text-sm! leading-5! text-muted-foreground!"
                data-title={t('int', { val: key === 'bad' ? realtimeStats?.no_internet ?? 0 : realtimeStats?.[key] ?? 0 })}
              >
                {formatNumber(key === 'bad' ? realtimeStats?.no_internet ?? 0 : realtimeStats?.[key] ?? 0, lng)}
              </div>
            ) : null}
          </button>
        );
      })}
      <LegendBenchmarkDropdown
        interactive={shouldShowControls}
        title={isNational ? nationalBenchMarkDescription : undefined}
        valueLabel={currentBenchmarkLabel}
      />
    </div>
  );
};

export default LiveLayerLegend;
