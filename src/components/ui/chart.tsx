import * as React from 'react';
import {
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  type TooltipContentProps,
  type TooltipValueType,
} from 'recharts';

import { cn } from '~/lib/cn';

type ChartConfigItem = {
  color?: string;
  icon?: React.ComponentType;
  label?: React.ReactNode;
  theme?: Partial<Record<'dark' | 'light', string>>;
};

export type ChartConfig = Record<string, ChartConfigItem>;

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />');
  }

  return context;
}

type ChartStyle = React.CSSProperties &
  Record<`--color-${string}`, string | undefined>;

function getChartStyle(config: ChartConfig) {
  return Object.entries(config).reduce<ChartStyle>((style, [key, item]) => {
    style[`--color-${key}`] = item.color ?? item.theme?.dark;
    return style;
  }, {});
}

function ChartContainer({
  children,
  className,
  config,
  style,
  ...props
}: React.ComponentProps<'div'> & {
  config: ChartConfig;
}) {
  const chartId = React.useId();

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        className={cn(
          'flex! aspect-video! justify-center! text-xs! [&_.recharts-cartesian-axis-tick_text]:fill-foreground! [&_.recharts-reference-line_line]:stroke-success! [&_.recharts-tooltip-cursor]:fill-muted/20! [&_.recharts-yAxis_.recharts-cartesian-axis-line]:stroke-muted-foreground! [&_.recharts-xAxis_.recharts-cartesian-axis-line]:stroke-muted-foreground!',
          className,
        )}
        data-chart={chartId}
        style={{ ...getChartStyle(config), ...style }}
        {...props}
      >
        <ResponsiveContainer
          height="100%"
          initialDimension={{ height: 160, width: 240 }}
          minHeight={1}
          minWidth={1}
          width="100%"
        >
          {children}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

const ChartTooltip = RechartsTooltip;

function ChartTooltipContent({
  active,
  className,
  hideName = false,
  hideLabel = false,
  label,
  payload,
  valueFormatter,
}: TooltipContentProps<TooltipValueType, string> & {
  hideLabel?: boolean;
  hideName?: boolean;
  valueFormatter?: (value: TooltipValueType) => React.ReactNode;
}) {
  const { config } = useChart();
  const safeClassName = typeof className === 'string' ? className : undefined;

  if (!active || !payload?.length) return null;

  return (
    <div
      className={cn(
        'rounded-md! border! border-border! bg-popover! px-3! py-2! text-xs! text-popover-foreground! shadow-md!',
        safeClassName,
      )}
    >
      {!hideLabel && label ? (
        <div className="mb-1! font-medium! text-foreground!">{label}</div>
      ) : null}
      <div className="grid! gap-1.5!">
        {payload.map((item) => {
          const dataKey = String(item.dataKey ?? item.name ?? '');
          const configItem = config[dataKey];
          const color = item.color ?? configItem?.color;
          const name = configItem?.label ?? item.name ?? dataKey;
          const value = valueFormatter
            ? valueFormatter(item.value)
            : String(item.value ?? '');

          return (
            <div
              className="flex! items-center! justify-between! gap-4!"
              key={dataKey}
            >
              {!hideName && (
                <div className="flex! items-center! gap-2!">
                  <span
                    className="size-2! shrink-0! rounded-[2px]!"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-muted-foreground!">{name}</span>
                </div>
              )}
              <span className="font-medium! text-foreground!">{value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { ChartContainer, ChartTooltip, ChartTooltipContent };
