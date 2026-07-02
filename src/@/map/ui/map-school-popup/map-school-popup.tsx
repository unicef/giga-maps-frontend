import { ArrowRight, Launch } from '@carbon/icons-react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';
import { setSchoolFocusLatLng } from '~/@/country/country.model';
import { ConnectivityStatusNames } from '~/@/sidebar/ui/global-and-country-view-components/container/layer-view.constant';
import { PointCoordinates } from '~/core/global-types';
import { router } from '~/core/routes';
import {
  InnerCircle,
  InnerCircleConnectivity,
} from '../legend-info/legend-button.style';
import DublicateSchoolPopup from './dublicate-school-popup.view';
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
  SchoolNameContent,
  SchoolNameWrapper,
  SchoolVerificationTag,
} from './school-popup.style';

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
          schoolId
        } = getFeatureInfo(feature);

        const hasDublicateSchools = schoolAtSameLocation?.schoolIds.length > 0;

        return createPortal(
          isLoading && isClicked ? (
            <SchoolPopupLoading />
          ) : (
            <div className="school-popup-data">
              {(!isLoading && isClicked && hasDublicateSchools) ?
                <DublicateSchoolPopup
                  schoolIds={[schoolId, ...schoolAtSameLocation.schoolIds]}
                  countryCode={countryCode}
                  scrollableTargetId="parentPopupScrollContainer"
                  batchSize={10}
                /> :
                <div className="map-popup-template">
                  <PopupTemplate>
                    <SchoolNameWrapper>
                      <SchoolNameContent>
                        <SchoolName className="map-school-name">{feature?.name?.toLocaleLowerCase()}</SchoolName>
                        {!feature?.isVerifiedSchool && <SchoolVerificationTag>unverfied</SchoolVerificationTag>}
                      </SchoolNameContent>
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
                          {!isStatic && feature?.isRealTime && <InnerCircleConnectivity className="outer-circle" $backColor={connecitivityColor} />}
                          <InnerCircle className="inner-circle" $margin="0.35rem 0 0 0" $backColor={isStatic ? staticColor : connecitivityStatusColor} />
                        </ConnectivityCircleWrapper>
                        <LiveContent>
                          {isLive && feature?.isRealTime && <LiveStatusRow>
                            <Label $color={connecitivityColor} style={{ whiteSpace: 'nowrap' }}>{connectivityValue}</Label>
                            <Label $size="0.875rem" $textTransform="none" $color={theme.filterText}>{formattedInterval}</Label>
                          </LiveStatusRow>}
                          {isStatic && <Label $color={staticColor}>{staticValue}</Label>}
                          {!isStatic && (!isLive || !feature?.isRealTime) &&
                            <Label $color={connecitivityStatusColor} style={{ whiteSpace: 'nowrap' }}>{t(ConnectivityStatusNames[connectivityStatusValue])}</Label>
                          }
                        </LiveContent>
                      </LiveContainer>
                      {isSchoolBenchmark && benchmarkTitle && <Label style={{ marginTop: '0.5rem' }} $size=".875rem">{benchmarkTitle} - {feature?.schoolBenchmark}</Label>}
                    </SchoolInfoWrapper>

                    {/* Data source section tailored for popup */}
                    {/* <SchoolPopupDataSource /> */}
                  </PopupTemplate>
                  {isClicked && <GoToSchoolButton className="go-to-school" onClick={() => {
                    router.navigate(`/map/schools?country=${countryCode.toLowerCase()}&school_ids=${feature?.id}`);
                    setSchoolFocusLatLng(feature?.geopoint.coordinates as PointCoordinates);
                  }} type="button"
                    renderIcon={ArrowRight} >
                    {t('go-to-school-page')}
                  </GoToSchoolButton>}
                </div>}
            </div>
          ),
          element,
        );
      })}
    </>
  );
};