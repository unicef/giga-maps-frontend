import { ChevronDown, ChevronUp, Information } from '@carbon/icons-react'
import { Tooltip } from '@carbon/react';
import { format } from 'date-fns';
import { useStore } from 'effector-react';
import { ComponentType, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

import { LoadingText } from '~/@/common/style/styled-component-style';
import { $globalStats, $stylePaintData } from '~/@/map/map.model';
import { fetchConnectivityLayerFx } from '~/api/project-connect';
import Itu from '~/assets/images/itu-logo-footer.svg';
import SchoolAccordionFooterLogo from '~/assets/images/school-accordion-footer-logo.svg';
import Unicef from '~/assets/images/unicef-logo-map-footer.svg';
import GigaLogo from '~/assets/images/white-logo-small.png';
import { defaultLanguage } from '~/core/i18n/constant';
import { $lng } from '~/core/i18n/store';
import { formatNumber,LanguageSuffixes } from '~/lib/utils';

import { defaultInterval } from '../../sidebar.constant';
import { $allLoadings, $connectivityStats } from '../../sidebar.model';
import ShareButton from '../common-components/share-button';
import ShareURLModal from '../common-components/share-url-modal';
import { ConnectivityDistributionNames } from '../global-and-country-view-components/container/layer-view.constant';
import BarChart from './common/bar-chart';
import {
  DescriptionWrapper,
  EntityCard,
  EntityCardBadge,
  EntityCardBarWrapper,
  EntityCardCollapsedContent,
  EntityCardCollapsedLabel,
  EntityCardCollapsedRow,
  EntityCardCollapsedValue,
  EntityCardExpandedContent,
  EntityCardFooter,
  EntityCardFooterBrand,
  EntityCardFooterLogo,
  EntityCardHeader,
  EntityCardHeaderLeft,
  EntityCardList,
  EntityCardMetric,
  EntityCardMetricDetail,
  EntityCardMetricEstimate,
  EntityCardMetricLabelRow,
  EntityCardMetricValue,
  EntityCardPanel,
  EntityCardPanelInner,
  EntityCardSkeleton,
  EntityCardTitle,
  LandingPageContentWrapper,
  LandingPageHeadingActions,
  LandingPageScroll,
  MainTitle,
  TitleWrapper,
  UpperContentWrapper
} from './styles/landing-page-style';

type CardMetric = {
  detail: string;
  estimate?: string;
  label: string;
  tooltip?: string;
  value: number;
};

type CardBarData = {
  colors: string[];
  labels: string[];
  total: number;
  type: string;
  values: number[];
};

type EntityCardData = {
  badge?: string;
  bar?: CardBarData;
  collapsedRows: { label: string; value: number; }[];
  expandedMetrics: CardMetric[];
  footerLogoComponent?: ComponentType<Record<string, unknown>>;
  showFooter?: boolean;
  title: string;
};

const HEALTH_GLOBAL_DUMMY = {
  connected: 18300,
  mapped: 128200,
  mappedCountries: 218,
  reporting: 3300,
  reportingCountries: 36,
  reportingQualityBreakdown: {
    bad: 700,
    good: 1000,
    moderate: 800,
    unknown: 800,
  },
  statusCountries: 54,
};

const EntitySummaryCard = ({
  card,
  expanded,
  isLoading = false,
  onToggle,
  t,
  lng,
}: {
  card: EntityCardData;
  expanded: boolean;
  isLoading?: boolean;
  lng: string;
  onToggle: () => void;
  t: (key: string, options?: Record<string, unknown>) => string;
}) => {
  const metricCount = card.expandedMetrics.length;
  return (
    <EntityCard>
      <EntityCardHeader onClick={onToggle} type="button">
        <EntityCardHeaderLeft>
          {card.badge ? <EntityCardBadge>{card.badge}</EntityCardBadge> : null}
          <EntityCardTitle>{card.title}</EntityCardTitle>
        </EntityCardHeaderLeft>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </EntityCardHeader>
      {isLoading ? (
        <EntityCardSkeleton>
          <LoadingText className="loading-line" lineCount={1} paragraph width="80%" />
          <LoadingText className="loading-line" lineCount={1} paragraph width="70%" />
          <LoadingText className="loading-line" lineCount={1} paragraph width="60%" />
        </EntityCardSkeleton>
      ) : (
        <>
          <EntityCardPanel $open={expanded}>
            <EntityCardPanelInner>
              <EntityCardExpandedContent>
                {card.expandedMetrics.map((metric) => (
                  <EntityCardMetric key={metric.label}>
                    <EntityCardMetricLabelRow>
                      <span>{metric.label}</span>
                      {metric.tooltip ? (
                        <Tooltip align="top" className="metric-label-tooltip" label={metric.tooltip}>
                          <button className="sb-tooltip-trigger" type="button">
                            <Information />
                          </button>
                        </Tooltip>
                      ) : null}
                    </EntityCardMetricLabelRow>
                    <EntityCardMetricValue data-title={t('int', { val: metric.value })}>
                      {formatNumber(metric.value, lng)}
                      {metric.estimate ? <EntityCardMetricEstimate>{metric.estimate}</EntityCardMetricEstimate> : null}
                    </EntityCardMetricValue>
                    <EntityCardMetricDetail>{metric.detail}</EntityCardMetricDetail>
                    {metricCount > 0 && metric.label === card.expandedMetrics[metricCount - 1]?.label && card.bar ? (
                      <EntityCardBarWrapper>
                        <BarChart
                          categories={card.bar.labels}
                          categoryColors={card.bar.colors}
                          categoryValues={card.bar.values}
                          total={card.bar.total}
                          tooltipAlign="top"
                          type={card.bar.type}
                        />
                      </EntityCardBarWrapper>
                    ) : null}
                  </EntityCardMetric>
                ))}
              </EntityCardExpandedContent>
            </EntityCardPanelInner>
          </EntityCardPanel>
          <EntityCardPanel $open={!expanded}>
            <EntityCardPanelInner>
              <EntityCardCollapsedContent>
                {card.collapsedRows.map((row) => (
                  <EntityCardCollapsedRow key={row.label}>
                    <EntityCardCollapsedValue data-title={t('int', { val: row.value })}>
                      {formatNumber(row.value, lng)}
                    </EntityCardCollapsedValue>
                    <EntityCardCollapsedLabel>{row.label}</EntityCardCollapsedLabel>
                  </EntityCardCollapsedRow>
                ))}
              </EntityCardCollapsedContent>
            </EntityCardPanelInner>
          </EntityCardPanel>
        </>
      )}
      {card.showFooter ? (
        <EntityCardFooter>
          {card.footerLogoComponent ? (
            <EntityCardFooterLogo as="div">
              <card.footerLogoComponent />
            </EntityCardFooterLogo>
          ) : (
            <>
              <EntityCardFooterLogo as="div">
                <img alt="Giga logo" src={GigaLogo} />
              </EntityCardFooterLogo>
              <EntityCardFooterBrand as="span">
                giga
              </EntityCardFooterBrand>
              <EntityCardFooterLogo as="div">
                <Unicef />
              </EntityCardFooterLogo>
              <EntityCardFooterLogo as="div">
                <Itu />
              </EntityCardFooterLogo>
            </>
          )}
        </EntityCardFooter>
      ) : null}
    </EntityCard>
  );
};

const LandingPage = () => {
  const globalstats = useStore($globalStats);
  const isLoadingGlobalStats = useStore($allLoadings).stats;
  const connectivityStats = useStore($connectivityStats);
  const stylePaintData = useStore($stylePaintData);
  const theme = useTheme();
  const { t } = useTranslation();
  const lng = useStore($lng) ?? defaultLanguage;
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [activeCard, setActiveCard] = useState<'health' | 'school' | null>('school');

  useEffect(() => {
    const startDate = format(defaultInterval().start, 'dd-MM-yyyy');
    const endDate = format(defaultInterval().end, 'dd-MM-yyyy');
    const params = { start_date: startDate, end_date: endDate, benchmark: 'global', is_weekly: "true" };
    const query = new URLSearchParams(params).toString();
    void fetchConnectivityLayerFx({ query: '?' + query });
  }, []);

  const toggleCard = (key: 'health' | 'school') => {
    setActiveCard((current) => current === key ? null : key);
  };
  const handleShareClicked = useCallback(() => {
    setShareModalOpen((current) => !current);
  }, []);

  const schoolCard: EntityCardData = {
    badge: 'GigaMaps',
    bar: {
      colors: [stylePaintData.good, stylePaintData.moderate, stylePaintData.bad, stylePaintData.unknown],
      labels: [
        ConnectivityDistributionNames.good,
        ConnectivityDistributionNames.moderate,
        ConnectivityDistributionNames.bad,
        ConnectivityDistributionNames.unknown,
      ],
      total: connectivityStats?.no_of_schools_measure ?? 0,
      type: 'real-time-schools-connectivity',
      values: [
        connectivityStats?.real_time_connected_schools?.good ?? 0,
        connectivityStats?.real_time_connected_schools?.moderate ?? 0,
        connectivityStats?.real_time_connected_schools?.no_internet ?? 0,
        connectivityStats?.real_time_connected_schools?.unknown ?? 0,
      ],
    },
    collapsedRows: [
      { label: t('locations-mapped'), value: globalstats?.schools_connected ?? 0 },
      { label: t('connected-schools-title'), value: globalstats?.connected_schools?.connected ?? 0 },
      { label: t('reporting-internet-quality'), value: connectivityStats?.no_of_schools_measure ?? 0 },
    ],
    expandedMetrics: [
      {
        detail: t('across-no-countries-and-territories', { count: globalstats?.no_of_countries ?? 0 }),
        estimate: `/6${LanguageSuffixes[lng].million} ${t('estimated')}`,
        label: t('locations-mapped'),
        tooltip: t('school-geolocations-mapped-and-supplemental-open-data'),
        value: globalstats?.schools_connected ?? 0,
      },
      {
        detail: t('across-no-countries', { count: globalstats?.countries_with_connectivity_status_mapped ?? 0 }),
        label: t('connected-schools-title'),
        tooltip: t('school-connectivity-status-a-real-time-measurement-source'),
        value: globalstats?.connected_schools?.connected ?? 0,
      },
      {
        detail: t('across-no-countries', { count: connectivityStats?.countries_with_realtime_data ?? 0 }),
        label: t('reporting-internet-quality'),
        tooltip: t('schools-with-periodical-software-and-hardware-based-solutions'),
        value: connectivityStats?.no_of_schools_measure ?? 0,
      },
    ],
    footerLogoComponent: SchoolAccordionFooterLogo,
    showFooter: true,
    title: t('schools'),
  };

  const healthCard: EntityCardData = {
    bar: {
      colors: [stylePaintData.good, stylePaintData.moderate, stylePaintData.bad, stylePaintData.unknown],
      labels: [
        ConnectivityDistributionNames.good,
        ConnectivityDistributionNames.moderate,
        ConnectivityDistributionNames.bad,
        ConnectivityDistributionNames.unknown,
      ],
      total: HEALTH_GLOBAL_DUMMY.reporting,
      type: 'real-time-schools-connectivity',
      values: [
        HEALTH_GLOBAL_DUMMY.reportingQualityBreakdown.good,
        HEALTH_GLOBAL_DUMMY.reportingQualityBreakdown.moderate,
        HEALTH_GLOBAL_DUMMY.reportingQualityBreakdown.bad,
        HEALTH_GLOBAL_DUMMY.reportingQualityBreakdown.unknown,
      ],
    },
    collapsedRows: [
      { label: t('locations-mapped'), value: HEALTH_GLOBAL_DUMMY.mapped },
      { label: t('connected-health-centers-title'), value: HEALTH_GLOBAL_DUMMY.connected },
      { label: t('reporting-internet-quality'), value: HEALTH_GLOBAL_DUMMY.reporting },
    ],
    expandedMetrics: [
      {
        detail: t('across-no-countries', { count: HEALTH_GLOBAL_DUMMY.mappedCountries }),
        label: t('locations-mapped'),
        tooltip: t('health-centers-locations-mapped-tooltip'),
        value: HEALTH_GLOBAL_DUMMY.mapped,
      },
      {
        detail: t('across-no-countries', { count: HEALTH_GLOBAL_DUMMY.statusCountries }),
        label: t('connected-health-centers-title'),
        tooltip: t('health-centers-connectivity-status-tooltip'),
        value: HEALTH_GLOBAL_DUMMY.connected,
      },
      {
        detail: t('across-no-countries', { count: HEALTH_GLOBAL_DUMMY.reportingCountries }),
        label: t('reporting-internet-quality'),
        tooltip: t('health-centers-reporting-internet-quality-tooltip'),
        value: HEALTH_GLOBAL_DUMMY.reporting,
      },
    ],
    title: t('health-centers-title'),
  };

  return (
    <>
      <LandingPageScroll>
        <LandingPageContentWrapper>
          <UpperContentWrapper>
            <TitleWrapper>
              <MainTitle $color={theme.text}>
                {t('global-connectivity-map-for-children')}
              </MainTitle>
              <LandingPageHeadingActions>
                <ShareButton handleShareClicked={handleShareClicked} shareButtonRef={null} />
              </LandingPageHeadingActions>
            </TitleWrapper>
            <DescriptionWrapper>
              <p>{t('an-open-live-global-map-of-schools-and-their-connectivity')}</p>
            </DescriptionWrapper>
          </UpperContentWrapper>

          <EntityCardList>
            <EntitySummaryCard
              card={schoolCard}
              expanded={activeCard === 'school'}
              isLoading={isLoadingGlobalStats}
              lng={lng}
              onToggle={() => toggleCard('school')}
              t={t}
            />
            <EntitySummaryCard
              card={healthCard}
              expanded={activeCard === 'health'}
              lng={lng}
              onToggle={() => toggleCard('health')}
              t={t}
            />
          </EntityCardList>
        </LandingPageContentWrapper>
      </LandingPageScroll >
      <ShareURLModal
        currentLink={window.location.href}
        setshareModalOpen={setShareModalOpen}
        shareModalOpen={shareModalOpen}
      />
    </>
  )
}
export default LandingPage
