import { useStore } from 'effector-react';
import { ChevronRight } from 'lucide-react';
import { type CSSProperties, type MouseEvent, useRef } from 'react';
import { useTranslation } from 'react-i18next';

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
  FLYOUT_VISIBLE_HEIGHT,
  getFlyoutOffset,
} from '~/@/sidebar/sidebar.constant';
import {
  $isMenuOpen,
  $isSidebarCollapsed,
  $isTimeplayer,
  $getSchoolParams,
  $sidebarFlyoutState,
  cycleSidebarFlyoutState,
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
import MobileFlyoutHeader from '../breadcrumb/mobile-flyout-header';
import CountryDisclaimerNotification from '../common-components/country-disclaimer-notification';
import SideInfoPanelHeaderLogoAndMenuButton from '../common-components/side-info-panel-header-menubutton-and-logo';
import SidebarMenuList from '../common-components/sidebar-menu-list';
import TopSearchBar from '../common-components/top-search-bar';
import GlobalAndCountryView from '../global-and-country-view-components';
import CommonComponentGigaLayer from '../global-and-country-view-components/common-component-gigalayer';
import LandingPage from '../landing-page-side-bar/landing-page';
import SchoolView from '../school-view-component/school-view';
import SearchResult from '../search-result';
import { useFlyoutDrag } from './use-flyout-drag';
import { useFlyoutTopOffset } from './use-flyout-top-offset';

const onToggleSidebar = toggleSidebar.prepend<MouseEvent<HTMLButtonElement>>(
  (event) => event.stopPropagation(),
);

export default function Sidebar() {
  const { t } = useTranslation();
  const isMenuOpen = useStore($isMenuOpen);
  const isMobile = useStore($isMobile);
  const flyoutState = useStore($sidebarFlyoutState);
  const isFlyoutExpanded = flyoutState === 'expanded';
  const panelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { dragHandlers, wasDragged } = useFlyoutDrag({
    disabled: !isMobile,
    panelRef,
    state: flyoutState,
  });
  useFlyoutTopOffset({ enabled: isMobile, headerRef, panelRef });
  const countryRoute = useRoute(mapCountry);
  const schoolRoute = useRoute(mapSchools);
  const entityRoute = useRoute(entityView) || useRoute(mapEntity);
  const mapRoute = useRoute(mapOverview);
  const isSidebarCollapsed = useStore($isSidebarCollapsed);
  const isTimeplayer = useStore($isTimeplayer);
  const { entityType } = useStore($getSchoolParams);
  const detailEntityType =
    entityType ?? (schoolRoute ? EntityType.SCHOOL : undefined);
  const detailHeightOffset = isMobile && !isFlyoutExpanded ? '0rem' : '6rem';

  const cycleFlyoutState = () => {
    if (wasDragged()) return;
    cycleSidebarFlyoutState();
  };

  const header = (
    <div className={cn(isMobile && 'fixed! top-0! left-0! right-0! z-2!')}>
      <div className={cn(isMobile && 'bg-background! pb-5!')} ref={headerRef}>
        <SideInfoPanelHeaderLogoAndMenuButton />
        {isMenuOpen && <SidebarMenuList />}
        {!isMenuOpen && (
          <div className="relative z-12">
            <TopSearchBar />
            <SearchResult />
          </div>
        )}
      </div>
      {isMobile && (
        // Out of flow so the header box ends at the search band; otherwise its
        // empty area sits over the flyout handle in full and eats the taps.
        <div
          aria-hidden={isFlyoutExpanded}
          className={cn(
            'absolute inset-x-0 top-full transition-opacity duration-300 ease-out',
            isFlyoutExpanded && 'pointer-events-none opacity-0',
          )}
        >
          <EntityTypeSelector />
        </div>
      )}
    </div>
  );

  return (
    <>
      <div
        className={cn(
          'relative z-2 flex w-full shrink-0',
          'motion-reduce:transition-none! data-[dragging]:transition-none!',
          isMobile
            ? cn(
                'fixed inset-x-0 bottom-0 top-[var(--flyout-top-offset,var(--search-panel-top-offset))]',
                'transition-[translate] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]',
                isSidebarCollapsed
                  ? 'translate-y-full'
                  : 'translate-y-[var(--flyout-drag-y,var(--flyout-y))]',
              )
            : cn(
                'fixed top-2 h-[calc(100%-2.2rem)] transition-[height,left,transform] duration-300',
                isSidebarCollapsed ? 'left-[-320px]!' : 'left-2!',
                'bottom-[var(--map-footer-offset)] min-[1584px]:bottom-2',
                'w-[320px] min-[1584px]:w-[320px]',
              ),
        )}
        ref={panelRef}
        style={
          isMobile
            ? ({
                '--flyout-y': getFlyoutOffset(
                  FLYOUT_VISIBLE_HEIGHT[flyoutState],
                ),
              } as CSSProperties)
            : undefined
        }
      >
        <div className="sidebar flex h-inherit w-full! flex-col overflow-y-auto overflow-x-hidden rounded-lg! border! border-border! bg-background shadow-card! max-md:rounded-b-none! max-md:border-none! max-md:shadow-none!">
          {isMobile && !isTimeplayer && (
            <button
              aria-expanded={isFlyoutExpanded}
              aria-label={t('resize-panel')}
              className="-mb-0.25 flex w-full shrink-0 cursor-grab touch-none items-center justify-center border-0 bg-background py-5 active:cursor-grabbing"
              id="mobile-view-slider"
              onClick={cycleFlyoutState}
              type="button"
              {...dragHandlers}
            >
              <span aria-hidden className="h-1 w-14 rounded-full bg-border" />
            </button>
          )}
          {!isMobile && header}

          <div className="flex min-h-0 flex-1 flex-col">
            {isMobile ? <MobileFlyoutHeader /> : <BreadcrumbInfo />}
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
            {!isTimeplayer && (
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
            )}
          </div>
          <div
            className={cn(
              'relative z-10 transition-all duration-500',
              isTimeplayer && 'hidden',
            )}
            data-flyout-no-drag
          >
            {!isMobile && (
              <BroadcastButton className="broadcast-button">
                <FilterButton />
              </BroadcastButton>
            )}
            {/* Expanded on mobile leaves no map to control, and the stack would
              be pushed off the top of the screen. */}
            {!(isMobile && isFlyoutExpanded) && (
              <TakeTourWrapper>
                {!isMobile && <ZoomButtons />}
                <TimeplayerButton />
                <AccessibilityButton />
                <ThemeButtons />
                <LegendButton />
              </TakeTourWrapper>
            )}
          </div>
          <CountryDisclaimerNotification />
        </div>
      </div>
      {/* Outside the panel: its translate would make this fixed header scroll
        along with it. */}
      {isMobile && header}
    </>
  );
}
