import { Checkbox } from '@carbon/react';
import { useStore } from 'effector-react';
import { Info } from 'lucide-react';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import { $lng } from '~/core/i18n/store';
import { cn } from '~/lib/cn';
import { formatNumber } from '~/lib/utils';

import { CheckBoxContainer } from '../legend-button.style';
import LegendBenchmarkDropdown from './legend-benchmark-dropdown';

const StaticLayerLegend = ({
  entityType,
  isCompact = false,
  isLoading = false,
  metricSubtitle,
  metricTitle,
  shouldShowControls,
}: {
  entityType: EntityType;
  isCompact?: boolean;
  isLoading?: boolean;
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
    <div
      className={cn(
        'flex! flex-col! self-start!',
        isCompact
          ? 'w-full! self-stretch!'
          : 'min-w-0! flex-1! basis-[calc(50%-0.5rem)]! max-[560px]:basis-full! max-[560px]:min-w-full!',
      )}
    >
      <div className="mb-1! flex! flex-col! items-start! gap-0.5!">
        <div className="flex! items-center! gap-1.5!">
          <div className="text-sm! font-normal! leading-5! text-muted-foreground!">
            {metricTitle}
          </div>
          {currentSelectedLayerData?.description ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild stopPropagation>
                  <button
                    aria-label={currentSelectedLayerData.description}
                    className="inline-flex! size-6! -m-1.5! p-1.5! items-center! justify-center! rounded-full! border-0! bg-transparent! text-muted-foreground!"
                    type="button"
                  >
                    <Info size={12} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={6}>
                  {currentSelectedLayerData.description}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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

        return (
          <button
            className={cn(
              'mt-3! flex! w-full! items-center! gap-3! border-0! bg-transparent! p-0! text-left!',
              isCompact ? 'justify-between!' : 'justify-start!',
            )}
            key={key}
            type="button"
          >
            <div className="flex! min-w-0! items-center!">
              {shouldShowControls ? (
                <input
                  className="relative! mr-2! h-4! w-4! shrink-0! cursor-pointer! appearance-none! rounded-sm! border! border-gray-400! bg-white! after:absolute! after:left-[4px]! after:top-px! after:hidden! after:h-[9px]! after:w-[5px]! after:rotate-45! after:border-b-[1.5px]! after:border-r-[1.5px]! after:border-black! after:content-['']! checked:after:block!"
                  id={key}
                  type="checkbox"
                  checked={Boolean(coverageStatus[key])}
                  onChange={() => handleStaticLayerToggle(key)}
                />
              ) : null}
              <div
                className="flex! min-w-0! items-center! gap-2!"
                data-title={tooltipLabel}
              >
                <EntityLegendIndicator
                  color={legends.colors[key]}
                  entityType={entityType}
                />
                {isLoading ? (
                  <div className="h-4! w-24! animate-pulse! rounded! bg-muted-foreground/20!" />
                ) : (
                  <span className="text-sm! font-normal! leading-5! text-foreground!">
                    {label}
                  </span>
                )}
              </div>
            </div>
            {shouldShowControls ? (
              isLoading ? (
                <div className="ml-2! h-4! w-8! animate-pulse! rounded! bg-muted-foreground/20!" />
              ) : (
                <div
                  className="ml-2! block! min-w-0! text-left! text-sm! leading-5! text-muted-foreground!"
                  data-title={t('int', {
                    val: coverageStats?.connected_schools?.[label] ?? 0,
                  })}
                >
                  {formatNumber(
                    coverageStats?.connected_schools?.[label] ?? 0,
                    lng,
                  )}
                </div>
              )
            ) : null}
          </button>
        );
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
