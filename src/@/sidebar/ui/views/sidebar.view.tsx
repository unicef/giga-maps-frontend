import { useStore } from 'effector-react';
import { ChevronDown, ChevronRight, ChevronUp } from 'lucide-react';
import { type CSSProperties, type MouseEvent } from 'react';

import { EntityType } from '~/@/entities';
import EntityTypeSelector from '~/@/entities/ui/entity-selector';
import FilterButton from '~/@/map/ui/advanced-filter/filter';
import { AccessibilityButton } from '~/@/map/ui/layer-theme/accessibility-button';
import {
  BroadcastButton,
  TakeTourWrapper,
} from '~/@/map/ui/layer-theme/theme-button.style';
import ThemeButtons from '~/@/map/ui/layer-theme/theme-buttons';
import ZoomButtons from '~/@/map/ui/layer-theme/zoom-buttons';
import LegendButton from '~/@/map/ui/legend-info/legend-button';
import TimeplayerButton from '~/@/map/ui/timeplayer/timeplayer-button';
import {
  $isMenuOpen,
  $isSidebarCollapsed,
  $isTimeplayer,
  $getSchoolParams,
  $sidebarHeight,
  onClickSidebar,
  setSidebarHeight,
  toggleSidebar,
} from '~/@/sidebar/sidebar.model';
import { $isMobile } from '~/core/media-query';
import {
  entityView,
  mapCountry,
  mapEntity,
  mapOverview,
  mapSchools,
} from '~/core/routes';
import { cn } from '~/lib/cn';
import { useRoute } from '~/lib/router';

import BreadcrumbInfo from '../breadcrumb';
import CountryDisclaimerNotification from '../common-components/country-disclaimer-notification';
import SideInfoPanelHeaderLogoAndMenuButton from '../common-components/side-info-panel-header-menubutton-and-logo';
import SidebarMenuList from '../common-components/sidebar-menu-list';
import TopSearchBar from '../common-components/top-search-bar';
import GlobalAndCountryView from '../global-and-country-view-components';
import CommonComponentGigaLayer from '../global-and-country-view-components/common-component-gigalayer';
import LandingPage from '../landing-page-side-bar/landing-page';
import SchoolView from '../school-view-component/school-view';
import SearchResult from '../search-result';

const onToggleSidebar = toggleSidebar.prepend<MouseEvent<HTMLButtonElement>>(
  (event) => event.stopPropagation(),
);

export default function Sidebar() {
  const isMenuOpen = useStore($isMenuOpen);
  const isMobile = useStore($isMobile);
  const sidebarHeight = useStore($sidebarHeight);
  const countryRoute = useRoute(mapCountry);
  const schoolRoute = useRoute(mapSchools);
  const entityRoute = useRoute(entityView) || useRoute(mapEntity);
  const mapRoute = useRoute(mapOverview);
  const isSidebarCollapsed = useStore($isSidebarCollapsed);
  const isTimeplayer = useStore($isTimeplayer);
  const { entityType } = useStore($getSchoolParams);
  const detailEntityType =
    entityType ?? (schoolRoute ? EntityType.SCHOOL : undefined);
  const detailHeightOffset = isMobile && !sidebarHeight ? '0rem' : '6rem';
  return (
    <div
      className={cn(
        'relative z-2 flex w-full shrink-0 transition-all duration-300 h-[calc(100%-2.2rem)]',
        isMobile
          ? cn(
              'fixed inset-x-0',
              sidebarHeight ? 'h-[60vh]' : 'h-[32vh]',
              isSidebarCollapsed ? 'bottom-[-24vh]' : 'bottom-0',
            )
          : cn(
              'fixed top-2',
              isSidebarCollapsed ? 'left-[-320px]!' : 'left-2!',
              'bottom-[var(--map-footer-offset)] min-[1584px]:bottom-2',
              'w-[320px] min-[1584px]:w-[320px]',
            ),
      )}
      onClick={() => onClickSidebar()}
    >
      <div className="sidebar flex h-inherit w-full! flex-col overflow-y-auto overflow-x-hidden rounded-lg! border! border-border! bg-background shadow-card! max-md:rounded-none ! max-md:border-none! max-md:shadow-none!">
        {isMobile && (
          <div
            className="-mb-0.25 flex w-full items-center justify-center p-[0.6rem] bg-background"
            id="mobile-view-slider"
            onClick={() => setSidebarHeight(!sidebarHeight)}
          >
            {/* <VerticalSliderButton /> */}
            {sidebarHeight ? (
              <ChevronDown className="text-foreground" />
            ) : (
              <ChevronUp className="text-foreground" />
            )}
          </div>
        )}
        <div
          className={cn(isMobile && 'fixed! top-0! left-0! right-0! z-[6001]!')}
        >
          <div className={cn(isMobile && 'bg-background! pb-5!')}>
            <SideInfoPanelHeaderLogoAndMenuButton />
            {isMenuOpen && <SidebarMenuList />}
            {!isMenuOpen && (
              <div className="relative z-12">
                <TopSearchBar />
                <SearchResult />
              </div>
            )}
          </div>
          {isMobile && <EntityTypeSelector />}
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <BreadcrumbInfo />
          {mapRoute ? (
            <LandingPage />
          ) : (
            <div
              className="h-full! min-h-0! flex-1! overflow-hidden! bg-background! max-md:h-[calc(100%-var(--detail-height-offset))]!"
              style={
                {
                  '--detail-height-offset': detailHeightOffset,
                } as CSSProperties
              }
            >
              {countryRoute && <GlobalAndCountryView />}
              {(schoolRoute || entityRoute) && <SchoolView />}
            </div>
          )}
          {!mapRoute && !countryRoute && detailEntityType && (
            <CommonComponentGigaLayer entityType={detailEntityType} />
          )}
          <button
            className={cn(
              'sidebar__expander absolute bottom-22 left-full flex h-12 w-4 items-center justify-center border border-l-0 border-border rounded-r-md shadow-md p-0 outline-none max-md:hidden',
              'cursor-pointer bg-background',
            )}
            type="button"
            onClick={onToggleSidebar}
          >
            <ChevronRight
              className={cn(
                'transition-all duration-500 text-foreground',
                isSidebarCollapsed ? 'rotate-0' : 'rotate-180',
              )}
            />
          </button>
        </div>
        <div
          className={cn(
            'relative z-10 transition-all duration-500',
            isTimeplayer && '-translate-x-full',
          )}
        >
          {!isMobile && (
            <BroadcastButton className="broadcast-button">
              <FilterButton />
            </BroadcastButton>
          )}
          <TakeTourWrapper $bottom={sidebarHeight}>
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
  );
}
