import { ArrowRight, TransmissionLte, Wifi } from '@carbon/icons-react'
import { createPortal } from 'react-dom';
import { setSchoolFocusLatLng } from '~/@/country/country.model';
import { useTranslation } from 'react-i18next';
import { InnerCircle, InnerCircleConnectivity } from '../legend-info/legend-button.style';
import { router } from '~/core/routes';
import { PointCoordinates } from '~/core/global-types';
import { ConnectivityCircleWrapper, FlexColumn, GeoLabel, GoToSchoolButton, Label, LocationFilledIcon, PopupTemplate, SchoolInfoWrapper, SchoolName, SchoolNameWrapper } from './school-popup.style';
import useSchoolPopupData from './school-popup-hook';
import { SchoolPopupLoading } from './school-popup-loading.view';

export const MapSchoolPopup = () => {
  const { t } = useTranslation();
  const { isLoading, features, isLive, getFeatureInfo,
    isStatic, countryCode } = useSchoolPopupData();

  if (!features?.length) return null;
  console.log(features)
  return (
    features.map(({ isClicked, element, feature }) => {
      const { connecitivityColor, connecitivityStatusColor, schoolCoords,
        connectivityValue, benchmarkTitle, staticValue } = getFeatureInfo(feature);
      return (
        createPortal(isLoading && isClicked ? <SchoolPopupLoading /> : (
          <div className="school-popup-data">
            <div className="map-popup-template">
              <PopupTemplate className="main-popup-container">
                <SchoolNameWrapper>
                  <SchoolName className="map-school-name">{feature?.name}</SchoolName>
                  <ConnectivityCircleWrapper className="map-school-status-circle">
                    {!isStatic && feature?.isRealTime && <InnerCircleConnectivity className="outer-circle" $backColor={connecitivityColor} />}
                    <InnerCircle className="inner-circle" $margin="0.35rem 0 0 0" $backColor={connecitivityStatusColor} />
                  </ConnectivityCircleWrapper>
                </SchoolNameWrapper>
                <SchoolInfoWrapper>
                  <LocationFilledIcon />
                  <GeoLabel className="label map-school-geo">{schoolCoords}</GeoLabel>
                </SchoolInfoWrapper>
                {isLive && <SchoolInfoWrapper className="live-container">
                  <Wifi />
                  <FlexColumn>
                    <Label className="map-school-connectivity-speed" style={{ color: connecitivityColor }}>{connectivityValue}</Label>
                    <Label className="benchmark-value-label">{benchmarkTitle} - {feature?.schoolBenchmark}</Label>
                  </FlexColumn>
                </SchoolInfoWrapper>}
                {isStatic && <SchoolInfoWrapper className="static-container">
                  <span className="static-icon"><TransmissionLte /></span>
                  <Label className="map-school-school-coverage">{staticValue}</Label>
                </SchoolInfoWrapper>}
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


{/* <SchoolMarkerWrapper className="shool-marker-wrapper">
        <LocationCompanyFilledIcon aria-label="marker" className="school-map-marker" size={46} />
      </SchoolMarkerWrapper> */}