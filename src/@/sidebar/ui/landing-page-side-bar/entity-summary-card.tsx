import { ChevronDown, ChevronUp, Hospital } from 'lucide-react';
import type { ReactNode } from 'react';

import { EntityType } from '~/@/entities/types/base-entity.type';
import SchoolAccordionFooterLogo from '~/assets/images/school-accordion-footer-logo.svg';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import { Skeleton } from '~/components/ui/skeleton';
import { cn } from '~/lib/cn';
import { formatNumber } from '~/lib/utils';

import type {
  EntityCardData,
  LandingPageTranslationFn,
} from './landing-page.types';

const MetricDivider = () => <div className="h-px! w-full! bg-border!" />;

type EntitySummaryCardProps = {
  card: EntityCardData;
  children?: ReactNode;
  expanded: boolean;
  isLoading?: boolean;
  loadingRowLabels?: string[];
  lng: string;
  showSummaryRowsWhenExpanded?: boolean;
  t: LandingPageTranslationFn;
};

const EntitySummaryCard = ({
  card,
  children,
  expanded,
  isLoading = false,
  loadingRowLabels = [],
  lng,
  showSummaryRowsWhenExpanded = false,
  t,
}: EntitySummaryCardProps) => {
  const shouldShowSummaryRows =
    !isLoading && (!expanded || showSummaryRowsWhenExpanded);
  const loadingRowLabelSet = new Set(loadingRowLabels);

  return (
    <AccordionItem
      className="overflow-visible! rounded-lg! border! border-border!"
      value={card.value}
    >
      <AccordionTrigger className="px-3.5! py-3! text-foreground! data-[state=open]:pb-3! data-[state=open]:pt-3!">
        <div className="flex! min-w-0! items-center! gap-2.5!">
          <div className="min-w-0! text-left! text-[15px]! font-semibold! leading-[18px]! text-foreground">
            {card.title}
          </div>
        </div>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </AccordionTrigger>

      {isLoading ? (
        <div className="space-y-3! px-4! pb-3!">
          <Skeleton className="h-4! w-full! rounded-sm!" />
          <Skeleton className="h-4! w-full! rounded-sm!" />
          <Skeleton className="h-4! w-full! rounded-sm!" />
        </div>
      ) : null}

      {shouldShowSummaryRows ? (
        <div className="px-3.5! pb-2!">
          {card.collapsedRows.map((row, index) => (
            <div key={row.label}>
              <div className="grid! grid-cols-[auto_1fr]! items-center! gap-x-3! py-2.5!">
                {loadingRowLabelSet.has(row.label) ? (
                  <Skeleton className="h-5! w-12! rounded-sm!" />
                ) : (
                  <span
                    className="shrink-0! text-lg! font-semibold! leading-[22px]! text-foreground"
                    data-title={t('int', { val: row.value })}
                  >
                    {formatNumber(row.value, lng)}
                  </span>
                )}
                <span className="min-w-0! text-right! text-xs! leading-4! text-muted-foreground">
                  {row.label.replace(/(^\w|\s\w)/g, match => match.toUpperCase())}
                </span>
              </div>
              {card.collapsedRows.length > index + 1 || expanded ? <MetricDivider /> : null}
            </div>
          ))}
        </div>
      ) : null}

      <AccordionContent className={cn((!expanded || isLoading) && 'hidden!')}>
        {children}
      </AccordionContent>

      {!isLoading && EntityType.SCHOOL === card.value ? (
        <div className="flex! items-center! justify-center! gap-3! rounded-b-lg! bg-[#0f62fe]! px-3.5! py-[0.35rem]! text-[#f4f4f4]! [&_img]:!block [&_img]:!h-[0.875rem] [&_img]:!w-auto [&_svg]:!block [&_svg]:!h-6 [&_svg]:!w-auto [&_svg_circle]:!fill-[#f4f4f4] [&_svg_g]:!fill-[#f4f4f4] [&_svg_path]:!fill-[#f4f4f4] [&_svg_polygon]:!fill-[#f4f4f4] [&_svg_rect]:!fill-[#f4f4f4]">
          <div className="inline-flex! items-center! justify-center! text-xs! font-semibold! leading-4!">
            <SchoolAccordionFooterLogo />
          </div>
        </div>
      ) : null}
      {!isLoading && EntityType.HEALTH === card.value ? (
        <div className="flex! min-w-0! items-center! justify-center! gap-2! rounded-b-lg! bg-[#01AEEF]! px-4! py-[0.45rem]! text-[#f4f4f4]!">
          <Hospital className="size-3.5! shrink-0!" strokeWidth={2.25} />
          <span className="whitespace-nowrap! text-xs! font-semibold! leading-4! tracking-[0.01em]!">
            {t('health-facilities')}
          </span>
        </div>
      ) : null}
    </AccordionItem>
  );
};

export default EntitySummaryCard;
