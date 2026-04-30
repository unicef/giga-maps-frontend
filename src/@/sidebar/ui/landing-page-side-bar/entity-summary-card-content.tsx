import { Info } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { formatNumber } from '~/lib/utils';

import BarChart from './common/bar-chart';
import type { CardBarData, EntityCardContentData, LandingPageTranslationFn } from './landing-page.types';

const hasVisibleBarData = (bar?: CardBarData) =>
  Boolean(bar?.total) && Boolean(bar?.values.some((value) => Number(value) > 0));

const InfoTooltip = ({ content }: { content?: string }) => {
  if (!content) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            aria-label={content}
            className="inline-flex! items-center! justify-center! border-0! bg-transparent! p-0! text-on-surface-dim!"
            type="button"
          >
            <Info size={12} />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={6}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const MetricDivider = () => (
  <div className="h-px! w-full! bg-border!" />
);

type EntitySummaryCardContentProps = {
  card: EntityCardContentData;
  lng: string;
  t: LandingPageTranslationFn;
};

const EntitySummaryCardContent = ({ card, lng, t }: EntitySummaryCardContentProps) => (
  <div className="px-3.5! pb-2.5!">
    {card.metrics.map((metric, index) => {
      const bar = metric.bar;

      return (
        <div key={metric.label}>
          {index > 0 ? <MetricDivider /> : null}
          <div className="py-3.5!">
            <div className="flex! items-center! gap-1.5! text-xs! leading-5! text-muted-foreground">
              <span>{metric.label}</span>
              <InfoTooltip content={metric.tooltip} />
            </div>
            <div className="mt-2! text-[22px]! font-medium! leading-[26px]! text-foreground" data-title={t('int', { val: metric.value })}>
              {formatNumber(metric.value, lng)}
              {metric.estimate ? <span className="ml-1.5! text-[11px]! font-medium! leading-[14px]! text-[#a8a8a8]">{metric.estimate}</span> : null}
            </div>
            <p className="m-0! mt-1! text-[11px]! leading-[14px]! text-[#a8a8a8]">{metric.detail}</p>
            {hasVisibleBarData(bar) && bar ? (
              <div className="mt-3!">
                <BarChart
                  categories={bar.labels}
                  categoryColors={bar.colors}
                  categoryValues={bar.values}
                  total={bar.total}
                />
              </div>
            ) : null}
          </div>
        </div>
      );
    })}
  </div>
);

export default EntitySummaryCardContent;
