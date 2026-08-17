import { useStore } from 'effector-react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

import { setSchoolFocusLatLng } from '~/@/country/country.model';
import { $entityRegistry } from '~/@/entities/models/entity.model';
import EntityLegendIndicator from '~/@/entities/ui/entity-legend-indicator';
import { navigateToEntity } from '~/@/entities/utils/entity-navigation';
import { ConnectivityStatusNames } from '~/@/sidebar/ui/global-and-country-view-components/container/layer-view.constant';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { PointCoordinates } from '~/core/global-types';

import DublicateSchoolPopup from './dublicate-school-popup.view';
import useSchoolPopupData from './school-popup-hook';
import { SchoolPopupLoading } from './school-popup-loading.view';

export const MapSchoolPopup = () => {
  const { t } = useTranslation();
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
                  <div className="relative flex w-[15.4375rem] flex-col rounded-[2px] bg-surface-elevated p-4 shadow-[0px_2px_3px_0px_var(--giga-background)]">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                        <h6 className="map-school-name mb-[2px] max-w-full text-xl font-normal leading-7 text-filter-text capitalize break-words">
                          {feature?.name?.toLocaleLowerCase()}
                        </h6>
                        {feature?.isVerifiedSchool === false && (
                          <Badge
                            variant="outline"
                            className="min-h-5 rounded-md border-transparent bg-[#FCD34D] px-2.5 py-0.5 text-xs font-normal leading-4 text-[#44403C] hover:bg-[#FCD34D]"
                          >
                            Unverified
                          </Badge>
                        )}
                      </div>
                      <a
                        href={`https://www.openstreetmap.org/#map=19/${schoolCoords[1]}/${schoolCoords[0]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Open in OpenStreetMap"
                        className="inline-flex size-auto shrink-0 items-center self-start text-[#277AFF] transition-colors hover:text-[#277AFF]/80 focus:text-[#277AFF]/80 active:text-[#277AFF]"
                      >
                        <ExternalLink className="size-4" />
                      </a>
                    </div>
                    <div className="live-container mb-2 flex flex-col items-baseline gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="map-school-status-circle relative mr-[0.2rem] flex scale-130 items-center">
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
                        </div>
                        <div className="flex flex-col gap-1">
                          {isLive && feature?.isRealTime && (
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className="whitespace-nowrap text-sm font-normal leading-4 capitalize"
                                style={{ color: connecitivityColor }}
                              >
                                {connectivityValue}
                              </span>
                              <span className="text-sm font-normal leading-4 text-filter-text">
                                {formattedInterval}
                              </span>
                            </div>
                          )}
                          {isStatic && (
                            <span
                              className="text-sm font-normal leading-4 capitalize"
                              style={{ color: staticColor }}
                            >
                              {staticValue}
                            </span>
                          )}
                          {!isStatic && (!isLive || !feature?.isRealTime) && (
                            <span
                              className="whitespace-nowrap text-sm font-normal leading-4 capitalize"
                              style={{ color: connecitivityStatusColor }}
                            >
                              {t(
                                ConnectivityStatusNames[
                                connectivityStatusValue
                                ],
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                      {isEntityBenchmark && benchmarkTitle && (
                        <span className="mt-2 text-sm font-normal leading-4 text-muted-foreground capitalize">
                          {benchmarkTitle} - {feature?.schoolBenchmark}
                        </span>
                      )}
                    </div>
                  </div>
                  {isClicked && entityType && feature?.id && (
                    <Button
                      className="go-to-school w-full cursor-pointer justify-between rounded-none border-0 text-sm font-normal outline-none"
                      onClick={() => {
                        navigateToEntity(entityType, countryCode, feature.id);
                        setSchoolFocusLatLng(
                          feature?.geopoint.coordinates as PointCoordinates,
                        );
                      }}
                      type="button"
                    >
                      <span>{t('go-to-entity-page', { entity: entityLabel })}</span>
                      <ArrowRight className="size-4 shrink-0" />
                    </Button>
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
