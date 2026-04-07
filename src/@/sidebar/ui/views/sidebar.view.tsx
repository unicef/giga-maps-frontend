import { ChevronDown, ChevronRight, ChevronUp } from '@carbon/icons-react'
import { useStore } from 'effector-react';
import { MouseEvent, } from 'react';
import { useTheme } from 'styled-components';

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
import { entityView, mapCountry, mapOverview, mapSchools } from '~/core/routes';
import { cn } from '~/lib/cn';
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

const onToggleSidebar = toggleSidebar.prepend<MouseEvent<HTMLButtonElement>>(
  (event) => event.stopPropagation()
);

export default function Sidebar() {
  const isMenuOpen = useStore($isMenuOpen);
  const isMobile = useStore($isMobile)
  const sidebarHeight = useStore($sidebarHeight)
  const countryRoute = useRoute(mapCountry)
  const schoolRoute = useRoute(mapSchools);
  const entityRoute = useRoute(entityView);
  const mapRoute = useRoute(mapOverview);
  const isSidebarCollapsed = useStore($isSidebarCollapsed)
  const isTimeplayer = useStore($isTimeplayer)
  const entityPopupData = useStore($entityPopupData)
  const theme = useTheme();
  return (
    <div
      className={cn(
        'relative z-[2] flex h-full w-full shrink-0 transition-all duration-300',
        isMobile
          ? cn(
            'fixed inset-x-0',
            sidebarHeight ? 'h-[60vh]' : 'h-[32vh]',
            isSidebarCollapsed ? 'bottom-[-24vh]' : 'bottom-0'
          )
          : cn(
            'fixed top-2',
            isSidebarCollapsed ? 'left-[-17rem] min-[1584px]:left-[-18.2rem]' : 'left-2',
            'bottom-[1.8rem] min-[1584px]:bottom-2',
            'w-[288px] min-[1584px]:w-[296px]'
          )
      )}
      onClick={() => onClickSidebar()}
    >
      <div
        className="sidebar flex h-inherit w-inherit flex-col overflow-y-auto overflow-x-hidden rounded-[0.875rem] border border-[#393939] bg-[#161616] shadow-[0_12px_32px_rgba(0,0,0,0.28)] max-md:rounded-none max-md:border-none max-md:shadow-none [&_.cds--tooltip-content]:!ml-2 [&_.cds--tooltip-content]:!text-[0.8rem]"
      >
        {
          isMobile &&
          <div
            className="mb-[-0.0625rem] flex w-full items-center justify-center p-[0.6rem]"
            id='mobile-view-slider'
            onClick={() => setSidebarHeight(!sidebarHeight)}
            style={{ background: theme.main }}
          >
            {/* <VerticalSliderButton /> */}
            {sidebarHeight ? <ChevronDown style={{ fill: theme.text }} /> : <ChevronUp style={{ fill: theme.text }} />}
          </div>
        }
        <SideInfoPanelHeaderLogoAndMenuButton />
        {isMenuOpen && <SidebarMenuList />}
        {!(isMobile && isMenuOpen) && <div className="relative z-[12]">
          <TopSearchBar />
          <SearchResult />
        </div>}
        <div className="flex min-h-0 flex-1 flex-col bg-transparent">
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
            className={cn(
              'sidebar__expander absolute bottom-[5.5rem] left-full flex h-12 w-4 items-center justify-center border-0 p-0 outline-none max-md:hidden',
              'cursor-pointer'
            )}
            type="button"
            onClick={onToggleSidebar}
            style={{ backgroundColor: theme.main }}
          >
            <ChevronRight
              className={cn('h-4 w-4 transition-all duration-500', isSidebarCollapsed ? 'rotate-0' : 'rotate-180')}
              style={{ fill: '#fff', color: theme.text }}
            />
          </button>
        </div>
        <div className={cn('relative z-10 transition-all duration-500', isTimeplayer && '-translate-x-full')}>
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

        </div>
        <CountryDisclaimerNotification />
      </div>
    </div>
  )
};
