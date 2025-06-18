import { ArrowRight, TransmissionLte, Wifi } from '@carbon/icons-react'
import { createPortal } from 'react-dom';
import { setSchoolFocusLatLng } from '~/@/country/country.model';
import { useTranslation } from 'react-i18next';
import { InnerCircle, InnerCircleConnectivity } from '../legend-info/legend-button.style';
import { router } from '~/core/routes';
import { PointCoordinates } from '~/core/global-types';
import { ConnectivityCircleWrapper, GoToSchoolButton, Label, LiveContainer, LiveContent, LiveStatusRow, OSMLink, PopupTemplate, SchoolInfoWrapper, SchoolName, SchoolNameWrapper } from './school-popup.style';
import useSchoolPopupData from './school-popup-hook';
import { SchoolPopupLoading } from './school-popup-loading.view';

export const MapSchoolPopup = () => {
  const { t } = useTranslation();
  const { isLoading, features, isLive, isWeekly, getFeatureInfo,
    isStatic, countryCode } = useSchoolPopupData();

  if (!features?.length) return null;
  return (
    features.map(({ isClicked, element, feature }) => {
      const { connecitivityColor, connecitivityStatusColor, schoolCoords,
        connectivityValue, benchmarkTitle, staticValue, staticColor } = getFeatureInfo(feature);
      return (
        createPortal(isLoading && isClicked ? <SchoolPopupLoading /> : (
          <div className="school-popup-data">
            <div className="map-popup-template">
              <PopupTemplate className="main-popup-container">
                <SchoolNameWrapper>
                  <SchoolName className="map-school-name">{feature?.name}</SchoolName>
                </SchoolNameWrapper>
                {(isLive && feature?.isRealTime || isStatic) && <SchoolInfoWrapper className="live-container">
                  <LiveContainer>
                    <ConnectivityCircleWrapper className="map-school-status-circle">
                      {!isStatic && feature?.isRealTime && <InnerCircleConnectivity className="outer-circle" $backColor={connecitivityColor} />}
                      <InnerCircle className="inner-circle" $margin="0.35rem 0 0 0" $backColor={connecitivityStatusColor} />
                    </ConnectivityCircleWrapper>
                    {isLive && <LiveContent>
                      <LiveStatusRow>
                        <Label $color={connecitivityColor} style={{ whiteSpace: 'nowrap' }}>{connectivityValue}</Label>
                        <Label $size="14px" $textTransform="none" style={{ whiteSpace: 'nowrap' }}>{isWeekly ? t('connected-this-week') : t('connected-this-month')}</Label>
                      </LiveStatusRow>
                    </LiveContent>}
                    {isStatic && <Label $color={staticColor} className="map-school-school-coverage">{staticValue}</Label>}
                  </LiveContainer>
                  {isLive && <Label $size="14px">{benchmarkTitle} - {feature?.schoolBenchmark}</Label>}
                </SchoolInfoWrapper>}
                <OSMLink
                  href={`https://www.openstreetmap.org/#map=19/${schoolCoords[1]}/${schoolCoords[0]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('check-location-on-osm')}
                </OSMLink>
              </PopupTemplate>
              {isClicked && <GoToSchoolButton className="go-to-school" onClick={() => {
                router.navigate(`/map/schools?country=${countryCode.toLowerCase()}&school_ids=${feature?.id}`);
                setSchoolFocusLatLng(feature?.geopoint.coordinates as PointCoordinates);
              }} type="button"
                renderIcon={ArrowRight} >
                {t('go-to-school-page')}
              </GoToSchoolButton>}
            </div>
          </div>), element)
      )
    })
  );
};
