import { useStore } from 'effector-react';
import { MouseEvent } from 'react';
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
import { ChevronDown, ChevronRight, ChevronUp } from 'lucide-react';

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
  const entityPopupData = useStore($entityPopupData);
  return (
    <div
      className={cn(
        'relative z-2 flex w-full shrink-0 transition-all duration-300 h-[calc(100%-2.2rem)]',
        isMobile
          ? cn(
            'fixed inset-x-0',
            sidebarHeight ? 'h-[60vh]' : 'h-[32vh]',
            isSidebarCollapsed ? 'bottom-[-24vh]' : 'bottom-0'
          )
          : cn(
            'fixed top-2',
            isSidebarCollapsed ? '-left-68 min-[1584px]:left-[-18.2rem]' : 'left-2',
            'bottom-[1.8rem] min-[1584px]:bottom-2',
            'w-[288px] min-[1584px]:w-[296px]'
          )
      )}
      onClick={() => onClickSidebar()}
    >
      <div
        className="sidebar flex h-inherit w-inherit flex-col overflow-y-auto overflow-x-hidden rounded-[0.875rem]! border! border-border! bg-background shadow-card! max-md:rounded-none ! max-md:border-none! max-md:shadow-none!"
      >
        {
          isMobile &&
          <div
            className="-mb-0.25 flex w-full items-center justify-center p-[0.6rem] bg-background"
            id='mobile-view-slider'
            onClick={() => setSidebarHeight(!sidebarHeight)}
          >
            {/* <VerticalSliderButton /> */}
            {sidebarHeight ? <ChevronDown className="text-foreground" /> : <ChevronUp className="text-foreground" />}
          </div>
        }
        <SideInfoPanelHeaderLogoAndMenuButton />
        {isMenuOpen && <SidebarMenuList />}
        {!(isMobile && isMenuOpen) && <div className="relative z-12">
          <TopSearchBar />
          <SearchResult />
        </div>}
        <div className="flex min-h-0 flex-1 flex-col">
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
              'sidebar__expander absolute bottom-22 left-full flex h-12 w-4 items-center justify-center border-0 p-0 outline-none max-md:hidden',
              'cursor-pointer bg-background'
            )}
            type="button"
            onClick={onToggleSidebar}
          >
            <ChevronRight
              className={cn('transition-all duration-500 text-foreground', isSidebarCollapsed ? 'rotate-0' : 'rotate-180')}
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
