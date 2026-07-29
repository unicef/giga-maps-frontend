import { ArrowRight, Launch } from '@carbon/icons-react';
import { useStore } from 'effector-react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

import { setSchoolFocusLatLng } from '~/@/country/country.model';
import { $entityRegistry } from '~/@/entities/models/entity.model';
import EntityLegendIndicator from '~/@/entities/ui/entity-legend-indicator';
import { navigateToEntity } from '~/@/entities/utils/entity-navigation';
import { ConnectivityStatusNames } from '~/@/sidebar/ui/global-and-country-view-components/container/layer-view.constant';
import { PointCoordinates } from '~/core/global-types';

import DublicateSchoolPopup from './dublicate-school-popup.view';
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
import useSchoolPopupData from './school-popup-hook';
import { SchoolPopupLoading } from './school-popup-loading.view';

export const MapSchoolPopup = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const entityRegistry = useStore($entityRegistry);
  const {
    isLoading,
    features,
    isLive,
    isEntityBenchmark,
    getFeatureInfo,
    isStatic,
    countryCode,
    formattedInterval,
    entityType,
  } = useSchoolPopupData();

  if (!entityType || !features?.length) return null;

  const entityLabel = entityType
    ? t(`${entityType}-entity-label`, {
      defaultValue: t(entityRegistry[entityType]?.slug ?? entityType, {
        count: 1,
      }),
    })
    : '';

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
          schoolId,
        } = getFeatureInfo(feature);

        const duplicateSchoolIds = schoolAtSameLocation?.schoolIds ?? [];
        const hasDublicateSchools = duplicateSchoolIds.length > 0;

        return createPortal(
          isLoading && isClicked ? (
            <SchoolPopupLoading />
          ) : (
            <div className="school-popup-data">
              {!isLoading && isClicked && hasDublicateSchools && entityType ? (
                <DublicateSchoolPopup
                  schoolIds={[schoolId, ...duplicateSchoolIds]}
                  entityType={entityType}
                  countryCode={countryCode}
                  scrollableTargetId="parentPopupScrollContainer"
                  batchSize={10}
                />
              ) : (
                <div className="map-popup-template">
                  <PopupTemplate>
                    <SchoolNameWrapper>
                      <SchoolNameContent>
                        <SchoolName className="map-school-name">
                          {feature?.name?.toLocaleLowerCase()}
                        </SchoolName>
                        {feature?.isVerifiedSchool === false && (
                          <SchoolVerificationTag>
                            Unverified
                          </SchoolVerificationTag>
                        )}
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
                        <ConnectivityCircleWrapper className="map-school-status-circle flex! items-center!">
                          <EntityLegendIndicator
                            color={
                              isStatic ? staticColor : connecitivityStatusColor
                            }
                            entityType={entityType}
                            glowColor={
                              !isStatic && feature?.isRealTime
                                ? `color-mix(in srgb, ${connecitivityColor} 42%, white)`
                                : undefined
                            }
                            size={16}
                          />
                        </ConnectivityCircleWrapper>
                        <LiveContent>
                          {isLive && feature?.isRealTime && (
                            <LiveStatusRow>
                              <Label
                                $color={connecitivityColor}
                                style={{ whiteSpace: 'nowrap' }}
                              >
                                {connectivityValue}
                              </Label>
                              <Label
                                $size="0.875rem"
                                $textTransform="none"
                                $color={theme.filterText}
                              >
                                {formattedInterval}
                              </Label>
                            </LiveStatusRow>
                          )}
                          {isStatic && (
                            <Label $color={staticColor}>{staticValue}</Label>
                          )}
                          {!isStatic && (!isLive || !feature?.isRealTime) && (
                            <Label
                              $color={connecitivityStatusColor}
                              style={{ whiteSpace: 'nowrap' }}
                            >
                              {t(
                                ConnectivityStatusNames[
                                connectivityStatusValue
                                ],
                              )}
                            </Label>
                          )}
                        </LiveContent>
                      </LiveContainer>
                      {isEntityBenchmark && benchmarkTitle && (
                        <Label style={{ marginTop: '0.5rem' }} $size=".875rem">
                          {benchmarkTitle} - {feature?.schoolBenchmark}
                        </Label>
                      )}
                    </SchoolInfoWrapper>
                  </PopupTemplate>
                  {isClicked && entityType && feature?.id && (
                    <GoToSchoolButton
                      className="go-to-school"
                      onClick={() => {
                        navigateToEntity(entityType, countryCode, feature.id);
                        setSchoolFocusLatLng(
                          feature?.geopoint.coordinates as PointCoordinates,
                        );
                      }}
                      type="button"
                      renderIcon={ArrowRight}
                    >
                      {t('go-to-entity-page', { entity: entityLabel })}
                    </GoToSchoolButton>
                  )}
                </div>
              )}
            </div>
          ),
          element,
        );
      })}
    </>
  );
};
