import { useStore } from 'effector-react';
import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { $country } from '~/@/country/country.model';
import { EntityType } from '~/@/entities/types/base-entity.type';
import EntityLegendIndicator from '~/@/entities/ui/entity-legend-indicator';
import { $stylePaintData } from '~/@/map/map.model';
import {
  ConnectivityBenchMarks,
  ConnectivityDistribution,
  ConnectivityStatusDistribution,
} from '~/@/sidebar/sidebar.constant';
import {
  $benchmarkmarkUtilsByEntity,
  $connectivityBenchMarkByEntity,
  $connectivitySpeedFilterByEntity,
  $connectivityStatsByEntity,
  $layerUtils,
  $schoolStats,
  changeEntityConnectivitySpeed,
} from '~/@/sidebar/sidebar.model';
import { DefaultLegendValuesType } from '~/api/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import { $lng } from '~/core/i18n/store';
import { $mapRoutes } from '~/core/routes';
import { formatNumber } from '~/lib/utils';

import LegendBenchmarkDropdown from './legend-benchmark-dropdown';


const LiveLayerLegend = ({
  entityType,
  isLoading = false,
  metricSubtitle,
  metricTitle,
  shouldShowControls,
}: {
  entityType: EntityType;
  isLoading?: boolean;
  metricSubtitle: string;
  metricTitle: string;
  shouldShowControls: boolean;
}) => {
  const lng = useStore($lng);
  const { t } = useTranslation();
  const { entity, map, schools } = useStore($mapRoutes);
  const paintData = useStore($stylePaintData);
  const {
    currentLayerLegendsByEntity,
    globalLayerDataByEntity,
    selectedLayerDataByEntity,
  } = useStore($layerUtils);
  const legends = currentLayerLegendsByEntity[entityType]!;
  const { benchmarkLogic } =
    useStore($benchmarkmarkUtilsByEntity)[entityType] ?? {};
  const connectivitySpeedFilter = (useStore($connectivitySpeedFilterByEntity)[
    entityType
  ] ?? {}) as Record<string, boolean>;
  const connectivityBenchMark =
    useStore($connectivityBenchMarkByEntity)[entityType] ??
    ConnectivityBenchMarks.global;
  const countryObj = useStore($country);
  const countryBenchmarkDescriptions =
    countryObj?.benchmark_metadata?.layer_descriptions;
  const metricLayerData = map
    ? globalLayerDataByEntity[entityType]
    : selectedLayerDataByEntity[entityType];
  const realtimeStatsFromStore = useStore($connectivityStatsByEntity)[
    entityType
  ];
  const schoolRealTimeStats = useStore($schoolStats);
  const isEntityDetailView = schools || entity;
  const realtimeStats =
    realtimeStatsFromStore?.real_time_connected_entities ??
    ({} as DefaultLegendValuesType);
  const benchmarkValue = (
    !isEntityDetailView ? realtimeStatsFromStore : schoolRealTimeStats?.[0]
  )?.benchmark_metadata?.rounded_benchmark_value;
  const unitLabel = (
    !isEntityDetailView ? realtimeStatsFromStore : schoolRealTimeStats?.[0]
  )?.benchmark_metadata?.display_unit;
  const nationalBenchMarkDescription =
    countryBenchmarkDescriptions?.[metricLayerData?.id ?? 0] ?? '';

  const handleRealtimeLayerChange = (key: string) => {
    changeEntityConnectivitySpeed({
      entityType,
      key: key as
        | ConnectivityDistribution.good
        | ConnectivityDistribution.moderate
        | ConnectivityDistribution.bad
        | ConnectivityDistribution.unknown,
      value: !connectivitySpeedFilter[key],
    });
  };

  const isNational =
    !map && connectivityBenchMark === ConnectivityBenchMarks.national;
  const currentBenchmarkLabel =
    benchmarkValue && unitLabel ? `${benchmarkValue}${unitLabel}` : undefined;

  return (
    <div className="flex! min-w-0! flex-1! basis-[calc(50%-0.5rem)]! flex-col! self-start! max-[560px]:basis-full! max-[560px]:min-w-full!">
      <div className="mb-1! flex! flex-col! items-start! gap-0.5!">
        <div className="flex! items-center! gap-1.5!">
          <div className="text-sm! font-normal! leading-5! text-muted-foreground!">
            {metricSubtitle}
          </div>
          {metricLayerData?.description ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild stopPropagation>
                  <button
                    aria-label={metricLayerData.description}
                    className="inline-flex! items-center! justify-center! border-0! bg-transparent! p-0! text-muted-foreground! cursor-pointer!"
                    type="button"
                  >
                    <Info size={12} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={6}>
                  {metricLayerData.description}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null}
        </div>
        <div className="text-xs! leading-4.5! text-muted-foreground!">
          {metricTitle}
        </div>
      </div>
      {legends?.values?.map(
        ({
          key,
          label,
          tooltip,
        }: {
          key: string;
          label: string;
          tooltip?: string;
        }) => {
          const logicLabel = `${(benchmarkLogic && key) !== 'unknown' ? benchmarkLogic?.[key] : t('doesnt-match-any-criteria')}`;
          const tooltipLabel = tooltip || logicLabel;
          const displayLabel = metricLayerData?.name
            ?.toLowerCase()
            .includes('download')
            ? ({
              good: t('high'),
              moderate: t('moderate'),
              bad: t('low'),
              unknown: t('unknown'),
            }[key] ?? label)
            : label;
          const legendColor =
            legends.colors[key] ?? paintData[key] ?? paintData.unknown;
          const liveMetricFill =
            paintData[ConnectivityStatusDistribution.connected];

          return (
            <button
              className="mt-1! flex! w-full! items-center! justify-start! border-0! bg-transparent! p-0! text-left!"
              key={key}
              type="button"
            >
              <div className="flex! min-w-0! items-center!">
                {shouldShowControls ? (
                  <input
                    aria-label={label}
                    checked={Boolean(connectivitySpeedFilter[key])}
                    className="relative! mr-2! h-4! w-4! shrink-0! cursor-pointer! appearance-none! rounded-sm! border! border-gray-400! bg-white! after:absolute! after:left-[4px]! after:top-px! after:hidden! after:h-[9px]! after:w-[5px]! after:rotate-45! after:border-b-[1.5px]! after:border-r-[1.5px]! after:border-black! after:content-['']! checked:after:block!"
                    onChange={() => handleRealtimeLayerChange(key)}
                    type="checkbox"
                  />
                ) : null}
                <div
                  className="flex! min-w-0! items-center! gap-2!"
                  data-title={tooltipLabel}
                >
                  <EntityLegendIndicator
                    color={liveMetricFill}
                    entityType={entityType}
                    glowColor={legendColor}
                  />
                  {isLoading ? (
                    <div className="h-4! w-24! animate-pulse! rounded! bg-muted-foreground/20!" />
                  ) : (
                    <span className="text-sm! font-normal! leading-5! text-foreground!">
                      {displayLabel}
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
                      val:
                        key === 'bad'
                          ? (realtimeStats?.no_internet ?? 0)
                          : (realtimeStats?.[key] ?? 0),
                    })}
                  >
                    {formatNumber(
                      key === 'bad'
                        ? (realtimeStats?.no_internet ?? 0)
                        : (realtimeStats?.[key] ?? 0),
                      lng,
                    )}
                  </div>
                )
              ) : null}
            </button>
          );
        },
      )}
      <LegendBenchmarkDropdown
        entityType={entityType}
        interactive={shouldShowControls}
        staticLabel={map ? `${t('global-benchmark')} 20Mbps` : undefined}
        title={isNational ? nationalBenchMarkDescription : undefined}
        valueLabel={currentBenchmarkLabel}
      />
    </div>
  );
};

export default LiveLayerLegend;
