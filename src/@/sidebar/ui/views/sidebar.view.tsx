import { MagicWandFilled } from '@carbon/icons-react'
import { IconButton } from '@carbon/react';
import { useStore } from 'effector-react';
import { MouseEvent, } from 'react';

import { BroadcastButton, TakeTourWrapper } from '~/@/map/ui/layer-theme/theme-button.style';
import ThemeButtons from '~/@/map/ui/layer-theme/theme-buttons';
import ZoomButtons from '~/@/map/ui/layer-theme/zoom-buttons';
import LegendButton from '~/@/map/ui/legend-info/legend-button';
import { ActiveButtonWrapper } from '~/@/map/ui/legend-info/legend-button.style';
import {
  $isMenuOpen, $isSidebarCollapsed,
  $isTimeplayer,
  $sidebarHeight,
  onClickSidebar,
  setSidebarHeight,
  toggleSidebar,
} from '~/@/sidebar/sidebar.model';
import { $isMobile } from '~/core/media-query';
import { mapCountry, mapOverview, mapSchools, router } from '~/core/routes';
import { useRoute } from '~/lib/router';

import Chevron from '../../../../assets/images/chevron.svg';
import BreadcrumbInfo from '../breadcrumb';
import CommonComponentGigaLayer from '../common-components/common-component-gigalayer';
import SideInfoPanelHeaderLogoAndMenuButton from '../common-components/side-info-panel-header-menubutton-and-logo';
import SidebarMenuList from '../common-components/sidebar-menu-list';
import TopSearchBar from '../common-components/top-search-bar';
import GlobalAndCountryView from '../global-and-country-view-components';
import LandingPage from '../landing-page-side-bar/landing-page';
import SchoolView from '../school-view-component/school-view';
import SearchResult from '../search-result';
import { LayerDetailContainer } from '../search-result/styles/search-result-style';
import { MainSideBarContainer, MapButtonWrapper, SidePanelContainer, SubContainer, VerticalSliderButton, VerticalSliderButtonWrapper } from '../sidebar.style';
import TimeplayerButton from '~/@/map/ui/timeplayer/timeplayer-button';
import FilterButton from '~/@/map/ui/advanced-filter/filter';
import { useTranslation } from 'react-i18next';

const onToggleSidebar = toggleSidebar.prepend<MouseEvent<HTMLButtonElement>>(
  (event) => event.stopPropagation()
);

export default function Sidebar() {
  const { t } = useTranslation();
  const isMenuOpen = useStore($isMenuOpen);
  const isMobile = useStore($isMobile)
  const sidebarHeight = useStore($sidebarHeight)
  const countryRoute = useRoute(mapCountry)
  const schoolRoute = useRoute(mapSchools);
  const mapRoute = useRoute(mapOverview);
  const isSidebarCollapsed = useStore($isSidebarCollapsed)
  const isTimeplayer = useStore($isTimeplayer)
  return (
    <MainSideBarContainer onClick={() => onClickSidebar()}
      $left={isSidebarCollapsed}
      $height={sidebarHeight} >
      <SidePanelContainer className='sidebar'>
        {
          isMobile &&
          <VerticalSliderButtonWrapper id='mobile-view-slider' onClick={() => setSidebarHeight(!sidebarHeight)}>
            <VerticalSliderButton />
          </VerticalSliderButtonWrapper>
        }
        <SideInfoPanelHeaderLogoAndMenuButton />
        {isMenuOpen && <SidebarMenuList />}
        {!(isMobile && isMenuOpen) && <TopSearchBar />}
        <SearchResult />
        <SubContainer>
          <BreadcrumbInfo />
          {mapRoute ? <LandingPage /> :
            <LayerDetailContainer>
              {(countryRoute) && <GlobalAndCountryView />}
              {(schoolRoute) && <SchoolView />}
            </LayerDetailContainer>
          }
          {
            !mapRoute && <CommonComponentGigaLayer />
          }
          <button
            className="sidebar__expander"
            type="button"
            onClick={onToggleSidebar}
          >
            <Chevron alt="Expand/collapse sidebar" />
          </button>
        </SubContainer>
        <MapButtonWrapper $hide={isTimeplayer}>
          <BroadcastButton className="broadcast-button">
            <FilterButton />
          </BroadcastButton >
          <TakeTourWrapper $bottom={sidebarHeight} >
            {!isMobile && <ZoomButtons />}
            {!sidebarHeight && <TimeplayerButton />}
            {!sidebarHeight && <ActiveButtonWrapper>
              <IconButton
                data-testid="tour-button"
                align="left"
                id='tour-button'
                size="sm"
                label={t("tour")}
                onClick={() => router.navigate(`/map?popover=tour`)}>
                <MagicWandFilled />
              </IconButton>
            </ActiveButtonWrapper>}
            {!sidebarHeight && <ThemeButtons />}
            <LegendButton />
          </TakeTourWrapper>

        </MapButtonWrapper>
      </SidePanelContainer >
    </MainSideBarContainer>
  )
};
