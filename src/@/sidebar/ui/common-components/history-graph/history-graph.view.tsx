import { useStore } from 'effector-react';
import { MoveHorizontal } from 'lucide-react';
import { type ReactNode, useMemo, useRef } from 'react';
import { Bar, BarChart, ReferenceLine, XAxis, YAxis } from 'recharts';

import type { EntityType } from '~/@/entities';
import {
  $historyIntervalUnit,
  $historyIntervalUnitByEntity,
} from '~/@/sidebar/history-graph.model';
import { $connectivityStats } from '~/@/sidebar/sidebar.model';
import type { LayerType } from '~/@/sidebar/types';
import {
  ConnectivityStat,
  EntityConnectivityStat,
  GraphData,
  SchoolStatsType,
} from '~/api/types';
import { Button } from '~/components/ui/button';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '~/components/ui/chart';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Skeleton } from '~/components/ui/skeleton';
import { mapSchools } from '~/core/routes';
import { IntervalUnit } from '~/lib/date-fns-kit/types';
import { useRoute } from '~/lib/router';

import HistoryButtons from './history-buttons.view';

type HistoryChartData = {
  key: string;
  value: number;
};

type HistoryXAxisTickProps = {
  firstLabel?: string;
  lastLabel?: string;
  payload?: {
    value?: string;
  };
  x?: number;
  y?: number;
};

const minimumChartWidth = 242;
const monthlyPointWidth = 44;

const chartConfig = {
  value: {
    color: 'var(--giga-primary)',
    label: 'Value',
  },
} satisfies ChartConfig;

const toNumber = (value: number | string | null | undefined) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getNiceMax = (value: number) => {
  if (value <= 0) return 100;
  const roughStep = value / 4;
  const magnitude = 10 ** Math.floor(Math.log10(roughStep));
  const normalized = roughStep / magnitude;
  const step =
    normalized <= 1
      ? magnitude
      : normalized <= 2
        ? 2 * magnitude
        : normalized <= 5
          ? 5 * magnitude
          : 10 * magnitude;
  return step * 4 * Math.ceil(value / (step * 4));
};

const getYTicks = (maxValue: number) =>
  Array.from({ length: 5 }, (_, index) =>
    Math.round(maxValue - (maxValue / 4) * index),
  ).reverse();

const formatChartValue = (
  value: string | number | readonly (string | number)[] | null | undefined,
  unit?: string,
) => {
  const formattedValue = Array.isArray(value) ? value.join(' - ') : value;
  return `${String(formattedValue ?? '')}${unit ? ` ${unit}` : ''}`;
};

function HistoryXAxisTick({
  firstLabel,
  lastLabel,
  payload,
  x = 0,
  y = 0,
}: HistoryXAxisTickProps): ReactNode {
  const value = payload?.value;

  if (!value || (value !== firstLabel && value !== lastLabel)) return null;

  return (
    <text
      className="fill-foreground! text-xs!"
      dy={6}
      textAnchor={value === firstLabel ? 'start' : 'end'}
      x={x}
      dx={value === firstLabel ? -10 : 10}
      y={y}
    >
      {value}
    </text>
  );
}

function HistoryBarChart({
  benchmark,
  data,
  isWeek,
  unit,
}: {
  readonly benchmark: number;
  readonly data: GraphData[];
  readonly isWeek: boolean;
  readonly unit?: string;
}) {
  const chartData = useMemo<HistoryChartData[]>(
    () =>
      data.map((item) => ({
        key: item.key,
        value: item.value ?? 0,
      })),
    [data],
  );
  const maxValue = getNiceMax(
    Math.max(benchmark, ...chartData.map((item) => item.value), 0),
  );
  const firstLabel = chartData[0]?.key;
  const lastLabel = chartData.at(-1)?.key;
  const width = isWeek
    ? minimumChartWidth
    : Math.max(minimumChartWidth, chartData.length * monthlyPointWidth);

  return (
    <ChartContainer
      className="h-40! min-h-40! max-w-none! aspect-auto!"
      config={chartConfig}
      style={{ width }}
    >
      <BarChart
        accessibilityLayer
        barSize={20}
        data={chartData}
        margin={{ bottom: 8, left: 0, right: 0, top: 8 }}
      >
        <XAxis
          axisLine={true}
          dataKey="key"
          interval={0}
          minTickGap={0}
          tick={(props: HistoryXAxisTickProps) => (
            <HistoryXAxisTick
              {...props}
              firstLabel={firstLabel}
              lastLabel={lastLabel}
            />
          )}
          tickLine={false}
          tickMargin={8}
        />
        <YAxis
          axisLine={true}
          domain={[0, maxValue]}
          tickFormatter={(value: number) => String(Math.round(value))}
          tickLine={false}
          ticks={getYTicks(maxValue)}
          width={38}
        />
        {benchmark > 0 && (
          <ReferenceLine
            ifOverflow="extendDomain"
            stroke="var(--giga-success)"
            strokeWidth={2}
            y={benchmark}
          />
        )}
        <ChartTooltip
          content={
            <ChartTooltipContent
              hideName
              valueFormatter={(value) => formatChartValue(value, unit)}
              active={false}
              payload={[]}
              coordinate={undefined}
              accessibilityLayer={false}
              activeIndex={undefined}
            />
          }
        />
        <Bar dataKey="value" fill="var(--color-value)" radius={0} />
      </BarChart>
    </ChartContainer>
  );
}

const HistoryGraph = ({
  connectivityStats,
  entityType,
  schoolData,
  isLoading,
  selectedLayerData,
}: {
  connectivityStats?: ConnectivityStat | EntityConnectivityStat | null;
  entityType?: EntityType;
  schoolData?: SchoolStatsType;
  isLoading?: boolean;
  selectedLayerData?: LayerType | null;
}) => {
  const selectedIntervalUnit = useStore($historyIntervalUnit);
  const historyIntervalUnitByEntity = useStore($historyIntervalUnitByEntity);
  const intervalUnit = entityType
    ? (historyIntervalUnitByEntity[entityType] ?? IntervalUnit.week)
    : selectedIntervalUnit;
  const fallbackConnectivityStats = useStore($connectivityStats);
  const schoolView = useRoute(mapSchools);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isWeek = intervalUnit === IntervalUnit.week;
  const currentConnectivityStats =
    connectivityStats ?? fallbackConnectivityStats;
  const infoBenchmark = schoolView
    ? schoolData?.benchmark_metadata
    : currentConnectivityStats?.benchmark_metadata;
  const benchmark = toNumber(
    infoBenchmark?.rounded_benchmark_value ??
      selectedLayerData?.global_benchmark?.value,
  );
  const unit =
    infoBenchmark?.display_unit ||
    infoBenchmark?.convert_unit ||
    selectedLayerData?.global_benchmark?.convert_unit ||
    selectedLayerData?.global_benchmark?.unit;
  const data = useMemo(() => {
    if (!schoolView) return currentConnectivityStats?.graph_data ?? [];
    return schoolData?.graph_data ?? [];
  }, [
    currentConnectivityStats?.graph_data,
    schoolData?.graph_data,
    schoolView,
  ]);

  return (
    <div className="overflow-hidden!">
      <HistoryButtons entityType={entityType} isWeek={isWeek} />
      {isLoading ? (
        <Skeleton className="ml-2.5! h-40! w-full!" />
      ) : (
        <div className="relative! py-4! pt-2!">
          {!isWeek && (
            <Button
              aria-label="Scroll chart"
              className="absolute! right-4! top-[-1rem]! z-2! size-8! text-foreground!"
              onClick={() => {
                const element = scrollRef.current;
                if (element) {
                  const totalWidth = element.scrollWidth;
                  const clientWidth = element.clientWidth;
                  const scrollWidth = element.scrollLeft;
                  if (clientWidth + scrollWidth >= totalWidth) {
                    element.scrollLeft = 0;
                  } else {
                    element.scrollLeft += 300;
                  }
                }
              }}
              size="icon-sm"
              type="button"
              variant="icon"
            >
              <MoveHorizontal size={20} />
            </Button>
          )}
          {isWeek ? (
            <HistoryBarChart
              benchmark={benchmark}
              data={data}
              isWeek={isWeek}
              unit={unit}
            />
          ) : (
            <ScrollArea
              className="overflow-y-hidden! pr-[1.7rem]!"
              scrollbars="horizontal"
              viewportClassName="overflow-y-hidden!"
              viewportRef={scrollRef}
            >
              <HistoryBarChart
                benchmark={benchmark}
                data={data}
                isWeek={isWeek}
                unit={unit}
              />
            </ScrollArea>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryGraph;
