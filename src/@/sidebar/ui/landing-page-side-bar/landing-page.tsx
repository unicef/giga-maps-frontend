import { ChevronDown, ChevronUp, Information } from '@carbon/icons-react';
import { Tooltip as CarbonTooltip } from '@carbon/react';
import { format } from 'date-fns';
import { useStore } from 'effector-react';
import { ComponentType, CSSProperties, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

import { $activeEntityTypes, $entityConfigMap, $selectedEntityType, changeSelectedEntityType } from '~/@/entities/models/entity.model';
import type { EntityType } from '~/@/entities/types/base-entity.type';
import { $globalStatsByEntity, $stylePaintData } from '~/@/map/map.model';
import { fetchEntitiesConnectivityStatsFx, fetchEntityGlobalStatsFx } from '~/api/project-connect';
import Itu from '~/assets/images/itu-logo-footer.svg';
import SchoolAccordionFooterLogo from '~/assets/images/school-accordion-footer-logo.svg';
import Unicef from '~/assets/images/unicef-logo-map-footer.svg';
import GigaLogo from '~/assets/images/white-logo-small.png';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion';
import { defaultLanguage } from '~/core/i18n/constant';
import { $lng } from '~/core/i18n/store';
import { cn } from '~/lib/cn';
import { formatNumber, LanguageSuffixes } from '~/lib/utils';

import { Scroll } from '@/scroll';

import { defaultInterval } from '../../sidebar.constant';
import { $connectivityStatsByEntity } from '../../sidebar.model';
import ShareButton from '../common-components/share-button';
import ShareURLModal from '../common-components/share-url-modal';
import { ConnectivityDistributionNames } from '../global-and-country-view-components/container/layer-view.constant';
import BarChart from './common/bar-chart';

type CardMetric = {
  bar?: CardBarData;
  detail: string;
  estimate?: string;
  label: string;
  tooltip?: string;
  value: number;
};

type CardBarData = {
  colors: string[];
  entityLabel: string;
  labels: string[];
  total: number;
  type: string;
  values: number[];
};

const hasVisibleBarData = (bar?: CardBarData) =>
  Boolean(bar?.total) && Boolean(bar?.values.some((value) => Number(value) > 0));

type EntityCardData = {
  badge?: string;
  collapsedRows: { label: string; value: number; }[];
  expandedMetrics: CardMetric[];
  footerLogoComponent?: ComponentType<Record<string, unknown>>;
  showFooter?: boolean;
  title: string;
  value: EntityType;
};

const InfoTooltip = ({ content }: { content?: string }) => {
  if (!content) return null;

  return (
    <CarbonTooltip align="top" label={content}>
      <button className="sb-tooltip-trigger !inline-flex !items-center !justify-center !border-0 !bg-transparent !p-0 !text-[color:var(--lp-icon-muted)]" type="button">
        <Information size={12} />
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

const getFooterLogoComponent = (footerLogoVariant?: 'default' | 'none' | 'school') => {
  if (footerLogoVariant === 'school') return SchoolAccordionFooterLogo;
  return undefined;
};

const EntitySummaryCard = ({
  card,
  expanded,
  isLoading = false,
  lng,
  t,
}: {
  card: EntityCardData;
  expanded: boolean;
  isLoading?: boolean;
  lng: string;
  t: (key: string, options?: Record<string, unknown>) => string;
}) => {
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
          {card.expandedMetrics.map((metric, index) => (
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
                {hasVisibleBarData(metric.bar) ? (
                  <div className="!mt-3">
                    <BarChart
                      categories={metric.bar.labels}
                      categoryColors={metric.bar.colors}
                      categoryValues={metric.bar.values}
                      total={metric.bar.total}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </AccordionContent>

      {!isLoading && card.showFooter ? (
        <div className="!flex !items-center !justify-center !gap-3 !rounded-b-lg !bg-[#0f62fe] !px-3.5 !py-[0.35rem] !text-[#f4f4f4] [&_img]:!block [&_img]:!h-[0.875rem] [&_img]:!w-auto [&_svg]:!block [&_svg]:!h-6 [&_svg]:!w-auto [&_svg_circle]:!fill-[#f4f4f4] [&_svg_g]:!fill-[#f4f4f4] [&_svg_path]:!fill-[#f4f4f4] [&_svg_polygon]:!fill-[#f4f4f4] [&_svg_rect]:!fill-[#f4f4f4]">
          {card.footerLogoComponent ? (
            <div className="!inline-flex !items-center !justify-center !text-xs !font-semibold !leading-4">
              <card.footerLogoComponent />
            </div>
          ) : (
            <>
              <div className="!inline-flex !items-center !justify-center !text-xs !font-semibold !leading-4">
                <img alt="Giga logo" src={GigaLogo} />
              </div>
              <span className="!text-xs !font-semibold !leading-4">giga</span>
              <div className="!inline-flex !items-center !justify-center !text-xs !font-semibold !leading-4">
                <Unicef />
              </div>
              <div className="!inline-flex !items-center !justify-center !text-xs !font-semibold !leading-4">
                <Itu />
              </div>
            </>
          )}
        </div>
      ) : null}
    </AccordionItem>
  );
};

const LandingPage = () => {
  const globalStatsByEntity = useStore($globalStatsByEntity);
  const isLoadingGlobalStats = useStore(fetchEntityGlobalStatsFx.pending);
  const connectivityStatsByEntity = useStore($connectivityStatsByEntity);
  const isLoadingConnectivityStats = useStore(fetchEntitiesConnectivityStatsFx.pending);
  const entityConfigMap = useStore($entityConfigMap);
  const stylePaintData = useStore($stylePaintData);
  const theme = useTheme();
  const { t } = useTranslation();
  const lng = useStore($lng) ?? defaultLanguage;
  const activeEntityTypes = useStore($activeEntityTypes);
  const selectedEntityType = useStore($selectedEntityType);
  const visibleEntityTypes = activeEntityTypes.filter((type): type is EntityType => Boolean(entityConfigMap[type]));
  const [activeAccordion, setActiveAccordion] = useState<EntityType | null>(
    activeEntityTypes.includes(selectedEntityType) ? selectedEntityType : activeEntityTypes[0] ?? null
  );
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const panelStyle = {
    '--lp-surface': theme.main,
    '--lp-border': theme.schoolListBack,
    '--lp-text': theme.text,
    '--lp-muted': theme.titleDesc,
    '--lp-icon-muted': theme.grey60,
    '--lp-skeleton': theme.skeleton,
  } as CSSProperties;
  const isLoading = isLoadingGlobalStats || isLoadingConnectivityStats;

  useEffect(() => {
    void fetchEntityGlobalStatsFx({});
    const startDate = format(defaultInterval().start, 'dd-MM-yyyy');
    const endDate = format(defaultInterval().end, 'dd-MM-yyyy');
    const params = { start_date: startDate, end_date: endDate, benchmark: 'global', is_weekly: 'true' };
    const query = new URLSearchParams(params).toString();
    void fetchEntitiesConnectivityStatsFx({ query: `?${query}` });
  }, []);

  const handleShareClicked = useCallback(() => {
    setShareModalOpen((current) => !current);
  }, []);

  useEffect(() => {
    if (activeAccordion && !activeEntityTypes.includes(activeAccordion)) {
      setActiveAccordion(activeEntityTypes[0] ?? null);
      return;
    }

    if (!activeEntityTypes.length) {
      setActiveAccordion(null);
    }
  }, [activeAccordion, activeEntityTypes]);

  const handleAccordionChange = (nextValue?: string) => {
    const nextAccordion = nextValue ? nextValue as EntityType : null;
    setActiveAccordion(nextAccordion);

    if (nextAccordion) {
      changeSelectedEntityType(nextAccordion);
    }
  };

  const buildEntityCard = (entityType: EntityType): EntityCardData | null => {
    const config = entityConfigMap[entityType];
    if (!config) return null;

    const globalStats = globalStatsByEntity[entityType];
    const connectivityStats = connectivityStatsByEntity[entityType];
    const connectedGroup = globalStats?.[config.stats.connectedGroupKey] as Record<string, number> | undefined;
    const realtimeGroup = connectivityStats?.[config.stats.realtimeGroupKey] as Record<string, number> | undefined;
    const mappedValue = Number(globalStats?.[config.stats.mappedCountKey] ?? 0);
    const measureValue = Number(connectivityStats?.[config.stats.measureCountKey] ?? 0);
    const connectedValue = Number(connectedGroup?.connected ?? 0);
    const estimate = config.sidebar.estimatedTotalInMillions
      ? `/${config.sidebar.estimatedTotalInMillions}${LanguageSuffixes[lng].million}`
      : undefined;
    const entityLabel = config.sidebar.title;

    return {
      badge: config.sidebar.badge,
      collapsedRows: [
        { label: config.sidebar.locationsMappedLabel, value: mappedValue },
        { label: config.sidebar.connectedLabel, value: connectedValue },
        { label: config.sidebar.reportingLabel, value: measureValue },
      ],
      expandedMetrics: [
        {
          detail: t(config.sidebar.mappedDetailTranslationKey, { count: globalStats?.no_of_countries ?? 0 }),
          estimate: estimate ? `${estimate} ${t('estimated')}` : undefined,
          label: config.sidebar.locationsMappedLabel,
          tooltip: config.sidebar.locationsMappedTooltip,
          value: mappedValue,
        },
        {
          detail: t(config.sidebar.connectedDetailTranslationKey, { count: globalStats?.countries_with_connectivity_status_mapped ?? 0 }),
          label: config.sidebar.connectedLabel,
          tooltip: config.sidebar.connectedTooltip,
          value: connectedValue,
        },
        {
          bar: {
            colors: [stylePaintData.good, stylePaintData.moderate, stylePaintData.bad, stylePaintData.unknown],
            entityLabel,
            labels: [
              ConnectivityDistributionNames.good,
              ConnectivityDistributionNames.moderate,
              ConnectivityDistributionNames.bad,
              ConnectivityDistributionNames.unknown,
            ],
            total: measureValue,
            type: 'entity-internet-quality',
            values: [
              realtimeGroup?.good ?? 0,
              realtimeGroup?.moderate ?? 0,
              realtimeGroup?.no_internet ?? 0,
              realtimeGroup?.unknown ?? 0,
            ],
          },
          detail: t(config.sidebar.reportingDetailTranslationKey, { count: connectivityStats?.countries_with_realtime_data ?? 0 }),
          label: config.sidebar.reportingLabel,
          tooltip: config.sidebar.reportingTooltip,
          value: measureValue,
        },
      ],
      footerLogoComponent: getFooterLogoComponent(config.sidebar.footerLogoVariant),
      showFooter: config.sidebar.footerLogoVariant === 'school',
      title: config.sidebar.title,
      value: entityType,
    };
  };

  const entityCards = visibleEntityTypes
    .map((entityType) => buildEntityCard(entityType))
    .filter((card): card is EntityCardData => Boolean(card));

  return (
    <>
      <Scroll className="h-auto max-h-none bg-[color:var(--lp-surface)]" style={panelStyle}>
        <div className="!w-full !bg-[color:var(--lp-surface)] !px-3.5 !py-2.5">
          <div className="!flex !flex-col !gap-3">
            <div className="!flex !items-start !justify-between !gap-3">
              <p className="!m-0 !max-w-56 !text-base !leading-[1.35rem] !text-[color:var(--lp-text)]" style={{ fontFamily: 'Open Sans' }}>
                {t('global-connectivity-map-for-children')}
              </p>
              <div className="!mt-[-0.125rem] !inline-flex !items-center [&_.cds--btn--ghost]:!bg-transparent [&_.cds--btn--ghost:active]:!bg-transparent [&_.cds--btn--ghost:focus]:!bg-transparent [&_.cds--btn--ghost:hover]:!bg-transparent [&_.sidebar-worldview-shareIcon_svg]:!fill-[color:var(--lp-text)]">
                <ShareButton handleShareClicked={handleShareClicked} shareButtonRef={null} />
              </div>
            </div>
            <p className="!m-0 !text-[0.8125rem] !font-normal !leading-[1.125rem] !tracking-[0.01rem] !text-[color:var(--lp-muted)]">
              {t('an-open-live-global-map-of-schools-and-their-connectivity')}
            </p>
          </div>

          <div className="!mt-4 !flex !flex-col !gap-3">
            <Accordion
              collapsible
              onValueChange={handleAccordionChange}
              type="single"
              value={activeAccordion ?? undefined}
            >
              <div className="!flex !flex-col !gap-3">
                {entityCards.map((card) => (
                  <EntitySummaryCard
                    card={card}
                    expanded={activeAccordion === card.value}
                    isLoading={isLoading}
                    key={card.value}
                    lng={lng}
                    t={t}
                  />
                ))}
              </div>
            </Accordion>
          </div>
        </div>
      </Scroll>
      <ShareURLModal
        currentLink={window.location.href}
        setshareModalOpen={setShareModalOpen}
        shareModalOpen={shareModalOpen}
      />
    </>
  );
};

export default LandingPage;
