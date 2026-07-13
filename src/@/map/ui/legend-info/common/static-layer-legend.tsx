import { useStore } from 'effector-react';
import { useTranslation } from 'react-i18next';

import { $country } from '~/@/country/country.model';
import { EntityType } from '~/@/entities/types/base-entity.type';
import EntityLegendIndicator from '~/@/entities/ui/entity-legend-indicator';
import {
  ConnectivityBenchMarks,
  ConnectivityDistribution,
} from '~/@/sidebar/sidebar.constant';
import {
  $connectivityBenchMarkByEntity,
  $coverageStatsByEntity,
  $coverageStatusAllByEntity,
  $layerUtils,
  changeEntityCoverageStatus,
} from '~/@/sidebar/sidebar.model';
import { $lng } from '~/core/i18n/store';
import { formatNumber } from '~/lib/utils';

import LegendBenchmarkDropdown from './legend-benchmark-dropdown';
import { Info } from 'lucide-react';

const StaticLayerLegend = ({
  entityType,
  metricSubtitle,
  metricTitle,
  shouldShowControls,
}: {
  entityType: EntityType;
  metricSubtitle: string;
  metricTitle: string;
  shouldShowControls: boolean;
}) => {
  const lng = useStore($lng);
  const { t } = useTranslation();
  const { currentLayerLegendsByEntity, selectedLayerDataByEntity } =
    useStore($layerUtils);
  const legends = currentLayerLegendsByEntity[entityType]!;
  const currentSelectedLayerData = selectedLayerDataByEntity[entityType];
  const coverageStats = useStore($coverageStatsByEntity)[entityType] as {
    connected_schools?: Record<string, number>;
  } | null;
  const connectivityBenchMark =
    useStore($connectivityBenchMarkByEntity)[entityType] ??
    ConnectivityBenchMarks.global;
  const countryObj = useStore($country);
  const countryBenchmarkDescriptions =
    countryObj?.benchmark_metadata?.layer_descriptions;
  const isNational = connectivityBenchMark === ConnectivityBenchMarks.national;
  const nationalBenchMarkDescription =
    countryBenchmarkDescriptions?.[currentSelectedLayerData?.id ?? 0] ?? '';
  const coverageStatus = (useStore($coverageStatusAllByEntity)[entityType] ??
    {}) as Record<string, boolean>;

  const handleStaticLayerToggle = (key: string) => {
    changeEntityCoverageStatus({
      entityType,
      key: key as
        | ConnectivityDistribution.good
        | ConnectivityDistribution.moderate
        | ConnectivityDistribution.bad
        | ConnectivityDistribution.unknown,
      value: !coverageStatus[key],
    });
  };

  return (
    <div className="flex! min-w-0! flex-1! basis-[calc(50%-0.5rem)]! flex-col! self-start max-[560px]:basis-full max-[560px]:min-w-full">
      <div className="mb-1! flex! flex-col! items-start! gap-0.5!">
        <div className="flex! items-center! gap-1.5!">
          <div className="text-sm! font-normal! leading-5! text-muted-foreground!">
            {metricTitle}
          </div>
          {currentSelectedLayerData?.description ? (
            <button
              className="inline-flex! items-center! justify-center! border-0! bg-transparent! p-0! text-muted-foreground!"
              title={currentSelectedLayerData.description}
              type="button"
            >
              <Info size={12} />
            </button>
          ) : null}
        </div>
        {metricSubtitle ? (
          <div className="text-xs! leading-4.5! text-muted-foreground!">
            {metricSubtitle}
          </div>
        ) : null}
      </div>

      {legends?.values?.map(({ key, label, tooltip }) => {
        const tooltipLabel =
          key === 'unknown' ? tooltip || `Doesn't match any criteria` : tooltip;

        return coverageStats?.connected_schools &&
          label in coverageStats.connected_schools &&
          coverageStats.connected_schools[label] > 0 ? (
          <button
            className="mt-3! flex! w-full! items-center! justify-between! border-0! bg-transparent! p-0! text-left!"
            key={key}
            title={tooltipLabel}
            type="button"
          >
            <div className="flex! min-w-0! items-center!">
              {shouldShowControls ? (
                <input
                  checked={Boolean(coverageStatus[key])}
                  className="mr-2! h-4! w-4! cursor-pointer! rounded-sm! border! border-border! accent-white!"
                  onChange={() => handleStaticLayerToggle(key)}
                  type="checkbox"
                />
              ) : null}
              <div className="flex! min-w-0! items-center! gap-2!">
                <EntityLegendIndicator
                  color={legends.colors[key]}
                  entityType={entityType}
                />
                <span className="text-sm! font-normal! leading-5! text-foreground!">
                  {label}
                </span>
              </div>
            </div>
            {shouldShowControls ? (
              <div
                className="ml-1.5! block! min-w-0! text-left! text-sm! leading-5! text-muted-foreground!"
                data-title={t('int', {
                  val: coverageStats?.connected_schools?.[label] ?? 0,
                })}
              >
                {formatNumber(
                  coverageStats?.connected_schools?.[label] ?? 0,
                  lng,
                )}
              </div>
            ) : null}
          </button>
        ) : null;
      })}

      <LegendBenchmarkDropdown
        entityType={entityType}
        interactive={shouldShowControls}
        title={isNational ? nationalBenchMarkDescription : undefined}
      />
    </div>
  );
};

export default StaticLayerLegend;
