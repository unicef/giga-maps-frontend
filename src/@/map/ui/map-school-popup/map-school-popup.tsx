import { ArrowRight, Launch } from '@carbon/icons-react';
import { useStore } from 'effector-react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

import { setSchoolFocusLatLng } from '~/@/country/country.model';
import { ConnectivityStatusNames } from '~/@/sidebar/ui/global-and-country-view-components/container/layer-view.constant';
import { PointCoordinates } from '~/core/global-types';
import { router } from '~/core/routes';

import {
  $activeDublicateSchoolsPopup,
  $dublicateSchoolClickData
} from '../../map.model';

import { fetchDublicateSchoolPopupDataFx } from '~/api/project-connect';
import { InnerCircle, InnerCircleConnectivity } from '../legend-info/legend-button.style';
import DublicateSchoolPopup from './dublicate-school-popup.view';
import SchoolPopupDataSource from './school-popup-data-source';
import useSchoolPopupData from './school-popup-hook';
import { SchoolPopupLoading } from './school-popup-loading.view';
import {
  ConnectivityCircleWrapper,
  GoToSchoolButton,
  Label,
  LiveContainer,
  LiveContent,
  LiveStatusRow,
  OSMLink,
  PopupTemplate,
  SchoolInfoWrapper,
  SchoolName,
  SchoolNameWrapper,
} from './school-popup.style';

/** simple array equality for number arrays — no lodash */
function arraysEqual(a?: number[] | null, b?: number[] | null) {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

/**
 * Per-feature container: triggers setSchoolIdsOnPopupClickDot once (guarded),
 * reads fetched data from store, shows loader while pending, and renders popup.
 */
function DuplicatePopupContainer({
  rawIds,
  countryCode,
  element,
}: {
  rawIds: number[];
  countryCode: string;
  element: Element | DocumentFragment;
}) {
  // read the active payload and fetched data from model
  const activePayload = useStore($activeDublicateSchoolsPopup);
  const fetchedSchools = useStore($dublicateSchoolClickData);
  const fetching = useStore(fetchDublicateSchoolPopupDataFx.pending);

  // decide what to render inside popup:
  // - show loader if fetch pending and we have activePayload for these ids
  const currentActiveIds = activePayload?.ids ?? null;
  const isActiveForThisIds = arraysEqual(currentActiveIds, rawIds ?? null);

  if (fetching && isActiveForThisIds) {
    return createPortal(<SchoolPopupLoading />, element);
  }

  return createPortal(
    <DublicateSchoolPopup
      countryCode={countryCode}
      schoolIds={rawIds}
    />,
    element,
  );
}

export const MapSchoolPopup = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    isLoading,
    features,
    isLive,
    isSchoolBenchmark,
    getFeatureInfo,
    isStatic,
    countryCode,
    formattedInterval,
  } = useSchoolPopupData();

  if (!features?.length) return null;

  return (
    <>
      {features.map(({ isClicked, element, feature }) => {
        const {
          connecitivityColor,
          connecitivityStatusColor,
          connectivityStatusValue,
          schoolCoords,
          connectivityValue,
          benchmarkTitle,
          staticValue,
          staticColor,
          schoolAtSameLocation,
        } = getFeatureInfo(feature);

        const getMoreSchoolData = !!schoolAtSameLocation?.count;

        // when loading and clicked -> show loading portal
        if (isLoading && isClicked) {
          return createPortal(<SchoolPopupLoading />, element);
        }

        // when clicked and there are duplicates -> render DuplicatePopupContainer
        if (!isLoading && isClicked && getMoreSchoolData) {
          return (
            <DuplicatePopupContainer
              countryCode={countryCode}
              key={feature?.id ?? 'dup-' + (schoolAtSameLocation?.schoolIds?.join(',') ?? '')}
              rawIds={schoolAtSameLocation?.schoolIds ?? null}
              element={element}
            />
          );
        }

        // default: normal popup content
        return createPortal(
          <div className="school-popup-data" key={feature?.id ?? 'popup-' + (feature?.name ?? '')}>
            <div className="map-popup-template">
              <PopupTemplate>
                <SchoolNameWrapper>
                  <SchoolName className="map-school-name">{feature?.name}</SchoolName>
                  <OSMLink
                    href={`https://www.openstreetmap.org/#map=19/${schoolCoords[1]}/${schoolCoords[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open in OpenStreetMap"
                  >
                    <Launch />
                  </OSMLink>
                </SchoolNameWrapper>

                <SchoolInfoWrapper className="live-container">
                  <LiveContainer>
                    <ConnectivityCircleWrapper className="map-school-status-circle">
                      {!isStatic && feature?.isRealTime && (
                        <InnerCircleConnectivity className="outer-circle" $backColor={connecitivityColor} />
                      )}
                      <InnerCircle className="inner-circle" $margin="0.35rem 0 0 0" $backColor={isStatic ? staticColor : connecitivityStatusColor} />
                    </ConnectivityCircleWrapper>
                    <LiveContent>
                      {isLive && feature?.isRealTime && (
                        <LiveStatusRow>
                          <Label $color={connecitivityColor} style={{ whiteSpace: 'nowrap' }}>{connectivityValue}</Label>
                          <Label $size="0.875rem" $textTransform="none" $color={theme.text}>{formattedInterval}</Label>
                        </LiveStatusRow>
                      )}
                      {isStatic && <Label $color={staticColor}>{staticValue}</Label>}
                      {!isStatic && (!isLive || !feature?.isRealTime) && (
                        <Label $color={connecitivityStatusColor} style={{ whiteSpace: 'nowrap' }}>{t(ConnectivityStatusNames[connectivityStatusValue])}</Label>
                      )}
                    </LiveContent>
                  </LiveContainer>

                  {isSchoolBenchmark && benchmarkTitle && (
                    <Label style={{ marginTop: '0.5rem' }} $size=".875rem">{benchmarkTitle} - {feature?.schoolBenchmark}</Label>
                  )}
                </SchoolInfoWrapper>

                {/* Data source section tailored for popup */}
                <SchoolPopupDataSource />
              </PopupTemplate>

              {isClicked && (
                <GoToSchoolButton
                  className="go-to-school"
                  onClick={() => {
                    router.navigate(`/map/schools?country=${countryCode.toLowerCase()}&school_ids=${feature?.id}`);
                    setSchoolFocusLatLng(feature?.geopoint.coordinates as PointCoordinates);
                  }}
                  type="button"
                  renderIcon={ArrowRight}
                >
                  {t('go-to-school-page')}
                </GoToSchoolButton>
              )}
            </div>
          </div>,
          element,
        );
      })}
    </>
  );
};
