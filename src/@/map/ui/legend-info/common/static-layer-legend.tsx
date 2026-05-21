import { useStore } from 'effector-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { $country } from '~/@/country/country.model';
import EntityLegendIndicator from '~/@/entities/ui/entity-legend-indicator';
import { ConnectivityBenchMarks } from '~/@/sidebar/sidebar.constant';
import {
  $connectivityBenchMark,
  $coverage3g2g,
  $coverage5g4g,
  $coverageNoCoverage,
  $coverageStatsResponse,
  $coverageUnknown,
  $layerUtils,
  changeCoverage3g2g,
  changeCoverage5g4g,
  changeCoverageNoCoverage,
  changeCoverageUnknown,
} from '~/@/sidebar/sidebar.model';
import { $lng } from '~/core/i18n/store';
import { formatNumber } from '~/lib/utils';

import LegendBenchmarkDropdown from './legend-benchmark-dropdown';
import { Info } from 'lucide-react';

interface CheckedStatus {
  [key: string]: boolean;
}

const StaticLayerLegend = ({
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
  const [staticLayerCheckedStatus, setStaticLayerCheckedStatus] = useState<CheckedStatus>({});
  const { currentLayerLegends: legends, selectedLayerData } = useStore($layerUtils);
  const coverageStatsResponse = useStore($coverageStatsResponse);
  const coverageStats = coverageStatsResponse?.[entityType] as Record<string, any> | null;
  const connectedStats = coverageStats?.connected_entities ?? coverageStats?.connected_schools;
  const connectivityBenchMark = useStore($connectivityBenchMark);
  const countryObj = useStore($country);
  const countryBenchmarkDescriptions = countryObj?.benchmark_metadata?.layer_descriptions;
  const isNational = connectivityBenchMark === ConnectivityBenchMarks.national;
  const nationalBenchMarkDescription = countryBenchmarkDescriptions?.[selectedLayerData?.id ?? 0] ?? '';
  const coverage5g4g = useStore($coverage5g4g);
  const coverage3g2g = useStore($coverage3g2g);
  const coverageNoCoverage = useStore($coverageNoCoverage);
  const coverageUnknown = useStore($coverageUnknown);

  const handleStaticLayerToggle = (key: string) => {
    const newStatus = !staticLayerCheckedStatus[key];
    setStaticLayerCheckedStatus((prevState) => ({
      ...prevState,
      [key]: newStatus,
    }));

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

  useEffect(() => {
    setStaticLayerCheckedStatus({
      good: coverage5g4g,
      moderate: coverage3g2g,
      bad: coverageNoCoverage,
      unknown: coverageUnknown,
    });
  }, [coverage5g4g, coverage3g2g, coverageNoCoverage, coverageUnknown]);

  return (
    <div className="flex! min-w-0! flex-1! basis-[calc(50%-0.5rem)]! flex-col! self-start max-[560px]:basis-full max-[560px]:min-w-full">
      <div className="mb-1! flex! flex-col! items-start! gap-0.5!">
        <div className="flex! items-center! gap-1.5!">
          <div className="text-sm! font-normal! leading-5! text-muted-foreground!">{metricTitle}</div>
          {selectedLayerData?.description ? (
            <button className="inline-flex! items-center! justify-center! border-0! bg-transparent! p-0! text-muted-foreground!" title={selectedLayerData.description} type="button">
              <Info size={12} />
            </button>
          ) : null}
        </div>
        {metricSubtitle ? (
          <div className="text-xs! leading-4.5! text-muted-foreground!">{metricSubtitle}</div>
        ) : null}
      </div>

      {legends.values.map(({ key, label, tooltip }) => {
        const tooltipLabel = key === 'unknown' ? (tooltip || `Doesn't match any criteria`) : tooltip;

        return connectedStats && (label in connectedStats) && connectedStats[label] > 0 ? (
          <button className="mt-3! flex! w-full! items-center! justify-between! border-0! bg-transparent! p-0! text-left!" key={key} title={tooltipLabel} type="button">
            <div className="flex! min-w-0! items-center!">
              {shouldShowControls ? (
                <input
                  checked={Boolean(staticLayerCheckedStatus[key])}
                  className="mr-2! h-4! w-4! cursor-pointer! rounded-sm! border! border-border! accent-white!"
                  onChange={() => handleStaticLayerToggle(key)}
                  type="checkbox"
                />
              ) : null}
              <div className="flex! min-w-0! items-center! gap-2!">
                <EntityLegendIndicator color={legends.colors[key]} entityType={entityType} />
                <span className="text-sm! font-normal! leading-5! text-foreground!">{label}</span>
              </div>
            </div>
            {shouldShowControls ? (
              <div className="ml-1.5! block! min-w-0! text-left! text-sm! leading-5! text-muted-foreground!" data-title={t('int', { val: connectedStats?.[label] ?? 0 })}>
                {formatNumber(connectedStats?.[label] ?? 0, lng)}
              </div>
            ) : null}
          </button>
        ) : null;
      })}

      <LegendBenchmarkDropdown
        interactive={shouldShowControls}
        title={isNational ? nationalBenchMarkDescription : undefined}
      />

    </div>
  );
};

export default StaticLayerLegend;
