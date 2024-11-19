import { ConnectionSignal, Information, Location, MagicWandFilled, NextOutline, Wifi } from '@carbon/icons-react'
import { Button, Link, Tooltip } from '@carbon/react';
import { format } from 'date-fns';
import { useStore } from 'effector-react';
import { useEffect } from 'react';
import { useTheme } from 'styled-components';

import { LoadingText } from '~/@/common/style/styled-component-style';
import { $globalStats, $stylePaintData, } from '~/@/map/map.model';
import { fetchConnectivityLayerFx } from '~/api/project-connect';
import { $isMobile } from '~/core/media-query';
import { router } from '~/core/routes';
import { formatNumber } from '~/lib/utils';

import { defaultInterval } from '../../sidebar.constant';
import { $allLoadings, $connectivityStats } from '../../sidebar.model';
import { onShowCountriesAdminList } from '../common-components/top-search-bar/top-search-bar.model';
import { ConnectivityDistributionNames, ConnectivityStatusNames } from '../global-and-country-view-components/container/layer-view.constant';
import BarChart from './common/bar-chart';
import { DescriptionWrapper, ExploreMapButtonWrapper, LandingPageContentWrapper, LandingPageScroll, MainTitle, MappedContentWrapper, MappedInfoWrapper, SchoolNumberWrapper, TakeTourLink, TitleWrapper, UpperContentWrapper } from './styles/landing-page-style';
import { useTranslation } from 'react-i18next';

const LandingPage = () => {
  const isMobile = useStore($isMobile)
  const globalstats = useStore($globalStats);
  const isLoadingGlobalStats = useStore($allLoadings).stats;
  const connectivityStats = useStore($connectivityStats);
  const stylePaintData = useStore($stylePaintData);
  const theme = useTheme();
  const { t } = useTranslation();
  useEffect(() => {
    const startDate = format(defaultInterval().start, 'dd-MM-yyyy');
    const endDate = format(defaultInterval().end, 'dd-MM-yyyy');
    const params = { start_date: startDate, end_date: endDate, benchmark: 'global', is_weekly: "true" };
    const query = new URLSearchParams(params).toString();
    void fetchConnectivityLayerFx({ query: '?' + query });
  }, [])
  return (
    <>
      <LandingPageScroll>
        <LandingPageContentWrapper>
          <UpperContentWrapper>
            <TitleWrapper>
              <MainTitle $color={theme.text}>
                {t('global-school-connectivity-map')}
              </MainTitle>
            </TitleWrapper>
            <DescriptionWrapper>
              <p>{t('an-open-live-global-map-of-schools-and-their-connectivity')}</p>
            </DescriptionWrapper>
            <TakeTourLink>
              <MagicWandFilled />
              <Link visited={false}
                onClick={() => { router.navigate(`/map?popover=tour`) }}>
                {t('take-the-tour')}
              </Link>
            </TakeTourLink>
          </UpperContentWrapper>
          <MappedContentWrapper>
            <Location />
            {isLoadingGlobalStats ? <LoadingText lineCount={2} paragraph /> :
              <>
                <SchoolNumberWrapper>
                  <p>
                    {formatNumber(globalstats?.schools_connected ?? 0)} {t('6m')} <span>{t('schools-location-mapped')}</span>
                  </p>
                  <Tooltip align="left" label={t('school-geolocations-mapped-and-supplemental-open-data')} className='information-icon' >
                    <button className="sb-tooltip-trigger" type="button">
                      <Information />
                    </button>
                  </Tooltip>
                </SchoolNumberWrapper>
                <MappedInfoWrapper>
                  <p>
                    {t('across')} {globalstats?.no_of_countries ?? 0} {t('countries')}
                  </p>
                </MappedInfoWrapper>
              </>}
          </MappedContentWrapper>
          <MappedContentWrapper>
            <ConnectionSignal />
            {isLoadingGlobalStats ? <>
              <LoadingText lineCount={2} paragraph />
              <LoadingText $blockSize='0.3' />
            </> :
              <>
                <SchoolNumberWrapper>
                  <p>
                    {formatNumber((globalstats?.schools_with_connectivity_status_mapped ?? 0))} <span>{t('schools-connectivity-status-mapped')}</span>
                  </p>
                  <Tooltip align="left" label={t('school-connectivity-status-a-real-time-measurement-source')} className='information-icon'>
                    <button className="sb-tooltip-trigger" type="button">
                      <Information />
                    </button>
                  </Tooltip>
                </SchoolNumberWrapper>
                <MappedInfoWrapper>
                  <p>
                    {t('across')} {globalstats?.countries_with_connectivity_status_mapped ?? 0} {t('countries')}
                  </p>
                  <span>
                    {formatNumber(globalstats?.schools_with_connectivity_status_mapped ?? 0)}
                  </span>
                </MappedInfoWrapper>
                <BarChart
                  type={"schools-connectivity"}
                  TooltipAlign={"top"}
                  total={(globalstats?.schools_with_connectivity_status_mapped ?? 0)}
                  categories={[ConnectivityStatusNames.connected, ConnectivityStatusNames.not_connected, /*ConnectivityStatusNames.unknown*/]}
                  categoryColors={[stylePaintData.good, stylePaintData.bad, stylePaintData.unknown]}
                  categoryValues={[globalstats?.connected_schools?.connected, globalstats?.connected_schools?.not_connected, globalstats?.connected_schools?.unknown]}
                />
              </>}
          </MappedContentWrapper>
          <MappedContentWrapper>
            <Wifi />
            {isLoadingGlobalStats ? <>
              <LoadingText lineCount={2} paragraph />
              <LoadingText $blockSize='0.3' />
            </> : <>
              <SchoolNumberWrapper>
                <p>
                  {formatNumber(connectivityStats?.no_of_schools_measure ? connectivityStats?.no_of_schools_measure : 0)} <span>{t('schools-with-real-time-data-mapped')}</span>
                </p>
                <Tooltip align="left-bottom" label={t('schools-with-periodical-software-and-hardware-based-solutions')} className='information-icon'>
                  <button className="sb-tooltip-rigger" type="button">
                    <Information />
                  </button>
                </Tooltip>
              </SchoolNumberWrapper>
              <MappedInfoWrapper>
                <p>
                  {t('across')} {connectivityStats?.countries_with_realtime_data ?? 0} {t('countries')}
                </p>
                <span>
                  {formatNumber(connectivityStats?.no_of_schools_measure)}
                </span>
              </MappedInfoWrapper>
              <BarChart
                type={"real-time-schools-connectivity"}
                TooltipAlign={"top"}
                total={connectivityStats?.no_of_schools_measure ?? 0}
                categories={[ConnectivityDistributionNames.good, ConnectivityDistributionNames.moderate, ConnectivityDistributionNames.bad, ConnectivityDistributionNames.unknown]}
                categoryColors={[stylePaintData.good, stylePaintData.moderate, stylePaintData.bad, stylePaintData.unknown,]}
                categoryValues={[
                  connectivityStats?.real_time_connected_schools?.good ?? 0,
                  connectivityStats?.real_time_connected_schools?.moderate ?? 0,
                  connectivityStats?.real_time_connected_schools?.no_internet ?? 0,
                  connectivityStats?.real_time_connected_schools?.unknown ?? 0
                ]}
              />
            </>}
          </MappedContentWrapper>
        </LandingPageContentWrapper>
      </LandingPageScroll >
      {!isMobile && <ExploreMapButtonWrapper className='explore-countries-button'>
        <Button type="button"
          onClick={() => {
            onShowCountriesAdminList(true)
          }}
          renderIcon={NextOutline} >
          {t('explore-countries')}
        </Button>
      </ExploreMapButtonWrapper>}
    </>
  )
}
export default LandingPage