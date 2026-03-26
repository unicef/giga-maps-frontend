import { ChevronDown, ChevronRight, ChevronUp } from '@carbon/icons-react'
import { useStore } from 'effector-react';
import { MouseEvent, } from 'react';

import { $entityPopupData } from '~/@/entities/models/entity.model';
import EntityView from '~/@/entities/ui/entity-view';
import FilterButton from '~/@/map/ui/advanced-filter/filter';
import { AccessibilityButton } from '~/@/map/ui/layer-theme/accessibility-button';
import { BroadcastButton, TakeTourWrapper } from '~/@/map/ui/layer-theme/theme-button.style';
import ThemeButtons from '~/@/map/ui/layer-theme/theme-buttons';
import ZoomButtons from '~/@/map/ui/layer-theme/zoom-buttons';
import LegendButton from '~/@/map/ui/legend-info/legend-button';
import TimeplayerButton from '~/@/map/ui/timeplayer/timeplayer-button';
import {
  $isMenuOpen, $isSidebarCollapsed,
  $isTimeplayer,
  $sidebarHeight,
  onClickSidebar,
  setSidebarHeight,
  toggleSidebar,
} from '~/@/sidebar/sidebar.model';
import { $isMobile } from '~/core/media-query';
import { mapCountry, mapEntities, mapOverview, mapSchools } from '~/core/routes';
import { useRoute } from '~/lib/router';

import BreadcrumbInfo from '../breadcrumb';
import CommonComponentGigaLayer from '../common-components/common-component-gigalayer';
import CountryDisclaimerNotification from '../common-components/country-disclaimer-notification';
import SideInfoPanelHeaderLogoAndMenuButton from '../common-components/side-info-panel-header-menubutton-and-logo';
import SidebarMenuList from '../common-components/sidebar-menu-list';
import TopSearchBar from '../common-components/top-search-bar';
import GlobalAndCountryView from '../global-and-country-view-components';
import LandingPage from '../landing-page-side-bar/landing-page';
import SchoolView from '../school-view-component/school-view';
import SearchResult from '../search-result';
import { LayerDetailContainer } from '../search-result/styles/search-result-style';
import { MainSideBarContainer, MapButtonWrapper, SearchAreaWrapper, SidePanelContainer, SubContainer, VerticalSliderButtonWrapper } from '../sidebar.style';

const onToggleSidebar = toggleSidebar.prepend<MouseEvent<HTMLButtonElement>>(
  (event) => event.stopPropagation()
);

export default function Sidebar() {
  const isMenuOpen = useStore($isMenuOpen);
  const isMobile = useStore($isMobile)
  const sidebarHeight = useStore($sidebarHeight)
  const countryRoute = useRoute(mapCountry)
  const schoolRoute = useRoute(mapSchools);
  const entityRoute = useRoute(mapEntities);
  const mapRoute = useRoute(mapOverview);
  const isSidebarCollapsed = useStore($isSidebarCollapsed)
  const isTimeplayer = useStore($isTimeplayer)
  const entityPopupData = useStore($entityPopupData)
  return (
    <MainSideBarContainer onClick={() => onClickSidebar()}
      $left={isSidebarCollapsed}
      $height={sidebarHeight} >
      <SidePanelContainer className='sidebar'>
        {
          isMobile &&
          <VerticalSliderButtonWrapper id='mobile-view-slider' onClick={() => setSidebarHeight(!sidebarHeight)}>
            {/* <VerticalSliderButton /> */}
            {sidebarHeight ? <ChevronDown /> : <ChevronUp />}
          </VerticalSliderButtonWrapper>
        }
        <SideInfoPanelHeaderLogoAndMenuButton />
        {isMenuOpen && <SidebarMenuList />}
        {!(isMobile && isMenuOpen) && <SearchAreaWrapper>
          <TopSearchBar />
          <SearchResult />
        </SearchAreaWrapper>}
        <SubContainer>
          <BreadcrumbInfo />
          {mapRoute ? <LandingPage /> :
            <LayerDetailContainer $height={isMobile && !sidebarHeight ? '0rem' : '6rem'}>
              {(countryRoute) && <GlobalAndCountryView />}
              {(schoolRoute) && <SchoolView />}
              {(schoolRoute) && entityPopupData && <EntityView />}
              {(entityRoute) && <EntityView />}
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
            <ChevronRight />
          </button>
        </SubContainer>
        <MapButtonWrapper $hide={isTimeplayer}>
          <BroadcastButton className="broadcast-button">
            <FilterButton />
          </BroadcastButton >
          <TakeTourWrapper $bottom={sidebarHeight} >
            {!isMobile && <ZoomButtons />}
            {!sidebarHeight && <TimeplayerButton />}
            <AccessibilityButton />
            {!sidebarHeight && <ThemeButtons />}
            <LegendButton />
          </TakeTourWrapper>

        </MapButtonWrapper>
        <CountryDisclaimerNotification />
      </SidePanelContainer >
    </MainSideBarContainer>
  )
};
