import { Tooltip as CarbonTooltip } from '@carbon/react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion';
import { cn } from '~/lib/cn';
import { formatNumber } from '~/lib/utils';

import SchoolAccordionFooterLogo from '~/assets/images/school-accordion-footer-logo.svg';

import BarChart from './common/bar-chart';
import type { CardBarData, EntityCardData, LandingPageTranslationFn } from './landing-page.types';

const hasVisibleBarData = (bar?: CardBarData) =>
  Boolean(bar?.total) && Boolean(bar?.values.some((value) => Number(value) > 0));

const InfoTooltip = ({ content }: { content?: string }) => {
  if (!content) return null;

  return (
    <CarbonTooltip align="top" label={content}>
      <button className="sb-tooltip-trigger !inline-flex !items-center !justify-center !border-0 !bg-transparent !p-0 !text-[color:var(--lp-icon-muted)]" type="button">
        <Info size={12} />
      </button>
    </CarbonTooltip>
  );
};

const LoadingLine = ({ width }: { width: string }) => (
  <div
    className="h-4 animate-pulse rounded-sm bg-[color:var(--lp-skeleton)]"
    style={{ width }}
  />
);

const MetricDivider = () => (
  <div className="h-px w-full bg-[color:var(--lp-border)]" />
);

type EntitySummaryCardProps = {
  card: EntityCardData;
  expanded: boolean;
  isLoading?: boolean;
  lng: string;
  t: LandingPageTranslationFn;
};

const EntitySummaryCard = ({ card, expanded, isLoading = false, lng, t }: EntitySummaryCardProps) => {
  return (
    <AccordionItem
      className="!overflow-visible !rounded-lg !border !border-[color:var(--lp-border)] !bg-[color:var(--lp-surface)]"
      value={card.value}
    >
      <AccordionTrigger className="!px-3.5 !py-3 !text-[color:var(--lp-text)] [&[data-state=open]]:!pb-3 [&[data-state=open]]:!pt-3">
        <div className="!flex !min-w-0 !items-center !gap-2.5">
          {card.badge ? (
            <span className="!inline-flex !shrink-0 !items-center !justify-center !rounded-full !bg-[#0f62fe] !px-2 !py-1 !text-[10px] !font-semibold !leading-none !text-[#f4f4f4]">
              {card.badge}
            </span>
          ) : null}
          <div className="!min-w-0 !text-left !text-[15px] !font-semibold !leading-[18px] !text-[color:var(--lp-text)]">{card.title}</div>
        </div>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </AccordionTrigger>

      {isLoading ? (
        <div className="!space-y-3 !px-4 !pb-3">
          <LoadingLine width="80%" />
          <LoadingLine width="70%" />
          <LoadingLine width="60%" />
        </div>
      ) : null}

      {!isLoading && !expanded ? (
        <div className="!px-3.5 !pb-2">
          {card.collapsedRows.map((row, index) => (
            <div key={row.label}>
              {index > 0 ? <MetricDivider /> : null}
              <div className="!grid !grid-cols-[auto_1fr] !items-center !gap-x-3 !py-2.5">
                <span className="!shrink-0 !text-lg !font-semibold !leading-[22px] !text-[color:var(--lp-text)]" data-title={t('int', { val: row.value })}>
                  {formatNumber(row.value, lng)}
                </span>
                <span className="!min-w-0 !text-right !text-xs !leading-4 !text-[color:var(--lp-muted)]">{row.label}</span>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <AccordionContent className={cn((!expanded || isLoading) && '!hidden')}>
        <div className="!px-3.5 !pb-2.5">
          {card.expandedMetrics.map((metric, index) => {
            const bar = metric.bar;

            return (
              <div key={metric.label}>
                {index > 0 ? <MetricDivider /> : null}
                <div className="!py-3.5">
                  <div className="!flex !items-center !gap-1.5 !text-xs !leading-5 !text-[color:var(--lp-muted)]">
                    <span>{metric.label}</span>
                    <InfoTooltip content={metric.tooltip} />
                  </div>
                  <div className="!mt-2 !text-[22px] !font-medium !leading-[26px] !text-[color:var(--lp-text)]" data-title={t('int', { val: metric.value })}>
                    {formatNumber(metric.value, lng)}
                    {metric.estimate ? <span className="!ml-1.5 !text-[11px] !font-medium !leading-[14px] !text-[#a8a8a8]">{metric.estimate}</span> : null}
                  </div>
                  <p className="!m-0 !mt-1 !text-[11px] !leading-[14px] !text-[#a8a8a8]">{metric.detail}</p>
                  {hasVisibleBarData(bar) && bar ? (
                    <div className="!mt-3">
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
      </AccordionContent>

      {!isLoading && card.showFooter ? (
        <div className="!flex !items-center !justify-center !gap-3 !rounded-b-lg !bg-[#0f62fe] !px-3.5 !py-[0.35rem] !text-[#f4f4f4] [&_img]:!block [&_img]:!h-[0.875rem] [&_img]:!w-auto [&_svg]:!block [&_svg]:!h-6 [&_svg]:!w-auto [&_svg_circle]:!fill-[#f4f4f4] [&_svg_g]:!fill-[#f4f4f4] [&_svg_path]:!fill-[#f4f4f4] [&_svg_polygon]:!fill-[#f4f4f4] [&_svg_rect]:!fill-[#f4f4f4]">
          {card.footerLogoVariant === 'school' ? (
            <div className="!inline-flex !items-center !justify-center !text-xs !font-semibold !leading-4">
              <SchoolAccordionFooterLogo />
            </div>
          ) : null}
        </div>
      ) : null}
    </AccordionItem>
  );
};

export default EntitySummaryCard;
