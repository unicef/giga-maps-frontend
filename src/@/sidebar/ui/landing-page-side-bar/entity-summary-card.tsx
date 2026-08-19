import { useStore } from 'effector-react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ReactNode } from 'react';

import { $country } from '~/@/country/country.model';
import EntityLegendIndicator from '~/@/entities/ui/entity-legend-indicator';
import { EntityType } from '~/@/entities/types/base-entity.type';
import { $stylePaintData } from '~/@/map/map.model';
import HealthCentersAccordionFooterLogo from '~/assets/images/health-centers-accordion-footer-logo.svg';
import SchoolAccordionFooterLogo from '~/assets/images/school-accordion-footer-logo.svg';
import EntityEmptyState from './entity-empty-state';
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

const MetricDivider = () => <div className="h-px! w-full! bg-card-border!" />;

const isNoData = (row?: { value?: number | null; totalValue?: number | null }) => {
  if (!row) return true;
  if (row.value) return false;
  if (row.value === 0 && Boolean(row.totalValue)) return false;
  return true;
};

type EntitySummaryCardProps = {
  card: EntityCardData;
  children?: ReactNode;
  expanded: boolean;
  isFiltered?: boolean;
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
  isFiltered: isFilteredProp,
  isLoading = false,
  loadingRowLabels = [],
  lng,
  showSummaryRowsWhenExpanded = false,
  t,
}: EntitySummaryCardProps) => {
  const stylePaintData = useStore($stylePaintData);
  const countryObj = useStore($country);
  const entityCountFromCountry = countryObj?.entity_counts?.[card.value];
  const isEmptyState =
    !isLoading &&
    (typeof entityCountFromCountry === 'number'
      ? entityCountFromCountry === 0
      : card.entitiesTotal === 0);
  const shouldShowSummaryRows = !isLoading && !expanded;
  const loadingRowLabelSet = new Set(loadingRowLabels);
  const isFiltered = isFilteredProp ?? card.isFiltered ?? false;

  return (
    <AccordionItem
      className="overflow-visible! rounded-lg! border! border-card-border!"
      value={card.value}
    >
      <AccordionTrigger
        disabled={isEmptyState}
        className={cn(
          'px-3.5! py-3! text-foreground! data-[state=open]:pb-3! data-[state=open]:pt-3!',
          isEmptyState && 'border-b-0! cursor-default! pointer-events-none! opacity-90!',
        )}
      >
        <div className="flex! min-w-0! items-center! gap-2.5!">
          <div className="min-w-0! text-left! text-[15px]! font-semibold! leading-[18px]! text-foreground">
            {card.title}
          </div>
        </div>
        {!isEmptyState ? (
          expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />
        ) : null}
      </AccordionTrigger>

      {isLoading ? (
        <div className="space-y-3! px-4! pb-3!">
          <Skeleton className="h-4! w-full! rounded-sm!" />
          <Skeleton className="h-4! w-full! rounded-sm!" />
          <Skeleton className="h-4! w-full! rounded-sm!" />
        </div>
      ) : null}

      {isEmptyState ? (
        <EntityEmptyState entityTitle={card.title} t={t} />
      ) : (
        <>
          {!isLoading && expanded && showSummaryRowsWhenExpanded ? (
            <div className="px-3.5! pb-2!">
              <div className="flex! items-center! gap-4! pb-3! pt-0.5! flex-wrap!">
                {/* Locations Mapped */}
                <div className="flex! items-center! gap-1.5!">
                  <EntityLegendIndicator
                    borderOnly
                    className="ml-0!"
                    color={stylePaintData.unknown}
                    dataTitle={
                      card.collapsedRows[0]?.label
                        ? card.collapsedRows[0].label.charAt(0).toUpperCase() +
                        card.collapsedRows[0].label.slice(1)
                        : undefined
                    }
                    dataTitlePos="right"
                    entityType={card.value}
                    size={14}
                    strokeWidth={0.75}
                  />
                  {loadingRowLabelSet.has(card.collapsedRows[0]?.label) ? (
                    <Skeleton className="h-5! w-10! rounded-sm!" />
                  ) : isNoData(card.collapsedRows[0]) ? (
                    <span
                      className="text-[16px]! font-semibold! leading-[18px]! text-gray-600!"
                      data-title={t('no-data-available')}
                      data-title-pos="right"
                    >
                      NA
                    </span>
                  ) : (
                    <div className="flex! flex-col! justify-center!">
                      <span
                        className="text-[16px]! font-normal! leading-[18px]! text-foreground"
                        data-title={t('int', { val: card.collapsedRows[0]?.value ?? 0 })}
                      >
                        {formatNumber(card.collapsedRows[0]?.value ?? 0, lng)}
                      </span>
                      {isFiltered ? (
                        <span
                          className="text-[12px]! font-normal! leading-3.5! text-muted-foreground"
                          data-title={t('int', {
                            val: card.collapsedRows[0]?.totalValue ?? card.collapsedRows[0]?.value ?? 0,
                          })}
                        >
                          {t('of-total', {
                            total: formatNumber(
                              card.collapsedRows[0]?.totalValue ?? card.collapsedRows[0]?.value ?? 0,
                              lng,
                            ),
                            defaultValue: `of ${formatNumber(
                              card.collapsedRows[0]?.totalValue ?? card.collapsedRows[0]?.value ?? 0,
                              lng,
                            )}`,
                          })}
                        </span>
                      ) : null}
                    </div>
                  )}
                </div>

                {/* Connected */}
                <div className="flex! items-center! gap-1.5!">
                  <EntityLegendIndicator
                    className="ml-0!"
                    color={stylePaintData.connected}
                    dataTitle={
                      card.collapsedRows[1]?.label
                        ? card.collapsedRows[1].label.charAt(0).toUpperCase() +
                        card.collapsedRows[1].label.slice(1)
                        : undefined
                    }
                    entityType={card.value}
                    size={14}
                  />
                  {loadingRowLabelSet.has(card.collapsedRows[1]?.label) ? (
                    <Skeleton className="h-5! w-10! rounded-sm!" />
                  ) : isNoData(card.collapsedRows[1]) ? (
                    <span
                      className="text-[16px]! font-semibold! leading-[18px]! text-gray-600!"
                      data-title={t('no-data-available')}
                    >
                      NA
                    </span>
                  ) : (
                    <div className="flex! flex-col! justify-center!">
                      <span
                        className="text-[16px]! font-normal! leading-[18px]! text-foreground"
                        data-title={t('int', { val: card.collapsedRows[1]?.value ?? 0 })}
                      >
                        {formatNumber(card.collapsedRows[1]?.value ?? 0, lng)}
                      </span>
                      {isFiltered ? (
                        <span
                          className="text-[12px]! font-normal! leading-3.5! text-muted-foreground"
                          data-title={t('int', {
                            val: card.collapsedRows[1]?.totalValue ?? card.collapsedRows[1]?.value ?? 0,
                          })}
                        >
                          {t('of-total', {
                            total: formatNumber(
                              card.collapsedRows[1]?.totalValue ?? card.collapsedRows[1]?.value ?? 0,
                              lng,
                            ),
                            defaultValue: `of ${formatNumber(
                              card.collapsedRows[1]?.totalValue ?? card.collapsedRows[1]?.value ?? 0,
                              lng,
                            )}`,
                          })}
                        </span>
                      ) : null}
                    </div>
                  )}
                </div>

                {/* Reporting Internet Quality */}
                <div className="flex! items-center! gap-1.5!">
                  <EntityLegendIndicator
                    className="ml-0!"
                    color={stylePaintData.connected}
                    dataTitle={
                      card.collapsedRows[2]?.label
                        ? card.collapsedRows[2].label.charAt(0).toUpperCase() +
                        card.collapsedRows[2].label.slice(1)
                        : undefined
                    }
                    entityType={card.value}
                    glowColor={stylePaintData.good ?? stylePaintData.connected}
                    size={14}
                  />
                  {loadingRowLabelSet.has(card.collapsedRows[2]?.label) ? (
                    <Skeleton className="h-5! w-10! rounded-sm!" />
                  ) : isNoData(card.collapsedRows[2]) ? (
                    <span
                      className="text-[16px]! font-semibold! leading-[18px]! text-gray-600!"
                      data-title={t('no-data-available')}
                    >
                      NA
                    </span>
                  ) : (
                    <div className="flex! flex-col! justify-center!">
                      <span
                        className="text-[16px]! font-normal! leading-[18px]! text-foreground"
                        data-title={t('int', { val: card.collapsedRows[2]?.value ?? 0 })}
                      >
                        {formatNumber(card.collapsedRows[2]?.value ?? 0, lng)}
                      </span>
                      {isFiltered ? (
                        <span
                          className="text-[12px]! font-normal! leading-3.5! text-muted-foreground"
                          data-title={t('int', {
                            val: card.collapsedRows[2]?.totalValue ?? card.collapsedRows[2]?.value ?? 0,
                          })}
                        >
                          {t('of-total', {
                            total: formatNumber(
                              card.collapsedRows[2]?.totalValue ?? card.collapsedRows[2]?.value ?? 0,
                              lng,
                            ),
                            defaultValue: `of ${formatNumber(
                              card.collapsedRows[2]?.totalValue ?? card.collapsedRows[2]?.value ?? 0,
                              lng,
                            )}`,
                          })}
                        </span>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
              <MetricDivider />
            </div>
          ) : null}

          {shouldShowSummaryRows ? (
            <div className="px-3.5! pb-2!">
              {card.collapsedRows.map((row, index) => (
                <div key={row.label}>
                  <div className="grid! grid-cols-[auto_1fr]! items-center! py-2.5!">
                    {loadingRowLabelSet.has(row.label) ? (
                      <Skeleton className="h-5! w-12! rounded-sm!" />
                    ) : isNoData(row) ? (
                      <span
                        className="shrink-0! text-[16px]! font-semibold! leading-[22px]! text-gray-600!"
                        data-title={t('no-data-available')}
                        data-title-pos="right"
                      >
                        NA
                      </span>
                    ) : (
                      <div className="flex! items-baseline! gap-1.5!">
                        <span
                          className="shrink-0! text-[16px]! font-semibold! leading-[22px]! text-foreground"
                          data-title={t('int', { val: row.value ?? 0 })}
                        >
                          {formatNumber(row.value ?? 0, lng)}
                        </span>
                        {isFiltered ? (
                          <span
                            className="shrink-0! text-[12px]! font-normal! leading-[22px]! text-muted-foreground"
                            data-title={t('int', { val: row.totalValue ?? row.value ?? 0 })}
                          >
                            {t('of-total', {
                              total: formatNumber(row.totalValue ?? row.value ?? 0, lng),
                              defaultValue: `of ${formatNumber(row.totalValue ?? row.value ?? 0, lng)}`,
                            })}
                          </span>
                        ) : null}
                      </div>
                    )}
                    <span className="min-w-0! text-right! text-xs! leading-4! text-muted-foreground">
                      {row.label.charAt(0).toUpperCase() + row.label.slice(1)}
                    </span>
                  </div>
                  {card.collapsedRows.length > index + 1 ? <MetricDivider /> : null}
                </div>
              ))}
            </div>
          ) : null}

          <AccordionContent className={cn((!expanded || isLoading) && 'hidden!')}>
            {children}
          </AccordionContent>

          {!isLoading && EntityType.SCHOOL === card.value ? (
            <div className="flex! items-center! justify-start! gap-3! rounded-b-lg! border-t! border-card-border! px-3.5! pt-3! pb-3.5! [&_img]:!block [&_img]:!h-[0.875rem] [&_img]:!w-auto [&_svg]:!block [&_svg]:!h-7 [&_svg]:!w-auto [&_svg_circle]:!fill-[#8d8d8d] [&_svg_g]:!fill-[#8d8d8d] [&_svg_path]:!fill-[#8d8d8d] [&_svg_polygon]:!fill-[#8d8d8d] [&_svg_rect]:!fill-[#8d8d8d]">
              <div className="inline-flex! items-center! justify-center! text-xs! font-semibold! leading-4!">
                <SchoolAccordionFooterLogo />
              </div>
            </div>
          ) : null}
          {!isLoading && EntityType.HEALTH === card.value ? (
            <div className="flex! items-center! justify-start! gap-3! rounded-b-lg! border-t! border-card-border! px-3.5! pt-3! pb-3.5! [&_img]:!block [&_img]:!h-[0.875rem] [&_img]:!w-auto [&_svg]:!block [&_svg]:!h-7 [&_svg]:!w-auto [&_svg_circle]:!fill-[#8d8d8d] [&_svg_g]:!fill-[#8d8d8d] [&_svg_path]:!fill-[#8d8d8d] [&_svg_polygon]:!fill-[#8d8d8d] [&_svg_rect]:!fill-[#8d8d8d]">
              <div className="inline-flex! items-center! justify-center! text-xs! font-semibold! leading-4!">
                <HealthCentersAccordionFooterLogo />
              </div>
            </div>
          ) : null}
        </>
      )}
    </AccordionItem>
  );
};

export default EntitySummaryCard;

