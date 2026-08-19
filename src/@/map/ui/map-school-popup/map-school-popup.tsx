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
import SchoolPopupDataSource from './school-popup-data-source';
import useSchoolPopupData, { PopupFeatureItem } from './school-popup-hook';
import { SchoolPopupLoading } from './school-popup-loading.view';
import { UNKNOWN } from '../../map.types';

export const MapSchoolPopup = () => {
  const { t } = useTranslation();
  const entityRegistry = useStore($entityRegistry);
  const {
    isLoading,
    features,
    countryCode,
    formattedInterval,
    entityType,
    getFeatureInfo,
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
      {features.map(
        ({
          isClicked,
          element,
          feature,
          entityType: itemEntityType,
        }: PopupFeatureItem) => {
          const targetEntityType = itemEntityType ?? entityType;
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
            isLive: featureIsLive,
            isStatic: featureIsStatic,
            isEntityBenchmark: featureIsEntityBenchmark,
          } = getFeatureInfo(feature, targetEntityType);

          const duplicateSchoolIds = schoolAtSameLocation?.schoolIds ?? [];
          const hasDublicateSchools = duplicateSchoolIds.length > 0;

          const itemEntityLabel = targetEntityType
            ? t(`${targetEntityType}-entity-label`, {
              defaultValue: t(
                entityRegistry[targetEntityType]?.slug ?? targetEntityType,
                { count: 1 },
              ),
            })
            : entityLabel;

          return createPortal(
            isLoading && isClicked ? (
              <SchoolPopupLoading />
            ) : (
              <div className="school-popup-data">
                {!isLoading && isClicked && hasDublicateSchools && targetEntityType ? (
                  <DublicateSchoolPopup
                    schoolIds={[...(schoolId ? [schoolId] : []), ...duplicateSchoolIds]}
                    entityType={targetEntityType}
                    countryCode={countryCode}
                    scrollableTargetId="parentPopupScrollContainer"
                    batchSize={10}
                  />
                ) : (
                  <div className="map-popup-template">
                    <div className="relative! flex! w-[300px]! flex-col! gap-3! rounded-xl! border! border-gray-800! bg-gray-900! p-4! text-foreground! shadow-xl!">
                      {/* Header: Title, verification badge & OSM link */}
                      <div className="flex! items-start! justify-between! gap-3!">
                        <div className="flex! min-w-0! flex-1! flex-wrap! items-center! gap-2!">
                          <h6 className="map-school-name text-[20px]! font-normal! not-italic! leading-[30px]! text-foreground! capitalize! break-words!">
                            {feature?.name?.toLocaleLowerCase()}
                          </h6>
                          {feature?.isVerifiedSchool === false && (
                            <Badge
                              variant="outline"
                              className="min-h-5! rounded-md! border-transparent! bg-[#FCD34D]! px-2! py-0.5! text-xs! font-normal! leading-4! text-[#44403C]! hover:bg-[#FCD34D]!"
                            >
                              Unverified
                            </Badge>
                          )}
                        </div>
                        {schoolCoords?.length >= 2 && (
                          <a
                            href={`https://www.openstreetmap.org/#map=19/${schoolCoords[1]}/${schoolCoords[0]}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Open in OpenStreetMap"
                            className="inline-flex! size-auto! shrink-0! items-center! self-start! text-primary! transition-colors! hover:text-primary/80! focus:text-primary/80! active:text-primary!"
                          >
                            <ExternalLink className="size-4!" />
                          </a>
                        )}
                      </div>

                      {/* Metric / Status Row */}
                      <div className="flex! flex-col! gap-1!">
                        <div className="flex! flex-wrap! items-center! gap-2!">
                          <div className="map-school-status-circle flex! items-center!">
                            <EntityLegendIndicator
                              color={
                                (featureIsStatic
                                  ? staticColor
                                  : connecitivityStatusColor) ?? ''
                              }
                              entityType={targetEntityType}
                              glowColor={
                                !featureIsStatic && feature?.isRealTime
                                  ? connecitivityColor
                                    ? `color-mix(in srgb, ${connecitivityColor} 42%, white)`
                                    : undefined
                                  : undefined
                              }
                              size={16}
                            />
                          </div>

                          {featureIsLive && feature?.isRealTime ? (
                            <div className="flex! flex-wrap! items-center! gap-2!">
                              <span
                                className="text-[14px]! font-normal! not-italic! leading-[20px]! capitalize!"
                                style={{ color: connecitivityColor }}
                              >
                                {connectivityValue}
                              </span>
                              {formattedInterval && (
                                <span className="inline-flex! items-center! rounded-md! border! border-gray-800! px-2.5! py-0.5! text-xs! font-normal! text-foreground!">
                                  {formattedInterval}
                                </span>
                              )}
                            </div>
                          ) : featureIsStatic ? (
                            <span
                              className="text-[14px]! font-normal! not-italic! leading-[20px]! capitalize!"
                              style={{ color: staticColor }}
                            >
                              {staticValue}
                            </span>
                          ) : (
                            <span
                              className="whitespace-nowrap! text-[14px]! font-normal! not-italic! leading-[20px]! capitalize!"
                              style={{ color: connecitivityStatusColor }}
                            >
                              {t(
                                ConnectivityStatusNames[
                                connectivityStatusValue ?? UNKNOWN
                                ] ?? UNKNOWN,
                              )}
                            </span>
                          )}
                        </div>

                        {/* Benchmark Subtitle */}
                        {featureIsEntityBenchmark &&
                          benchmarkTitle &&
                          feature?.schoolBenchmark && (
                            <span className="text-[14px]! font-normal! not-italic! leading-[20px]! text-gray-400!">
                              {benchmarkTitle} - {feature?.schoolBenchmark}
                            </span>
                          )}
                      </div>

                      {/* Data Source Section */}
                      <SchoolPopupDataSource entityType={targetEntityType} />

                      {/* Action Button */}
                      {targetEntityType && (feature?.id || schoolId) && isClicked && (
                        <Button
                          className="go-to-school mt-1! w-full! cursor-pointer! justify-center! gap-1.5! rounded-full! border-0! bg-[#005BED]! px-2.5! py-2! text-sm! font-medium! text-[#FAFAFA]! shadow-xs! transition-all! hover:bg-[#0052D6]! focus:outline-none! active:bg-[#0047B3]!"
                          onClick={() => {
                            const targetId = feature?.id ?? schoolId;
                            if (targetId && targetEntityType) {
                              navigateToEntity(
                                targetEntityType,
                                countryCode,
                                targetId,
                              );
                              if (feature?.geopoint?.coordinates) {
                                setSchoolFocusLatLng(
                                  feature.geopoint
                                    .coordinates as PointCoordinates,
                                );
                              }
                            }
                          }}
                          type="button"
                        >
                          <span>
                            {t('go-to-entity-page', {
                              entity: itemEntityLabel,
                              defaultValue: `Go to ${itemEntityLabel} page`,
                            })}
                          </span>
                          <ArrowRight className="size-4! shrink-0!" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ),
            element,
          );
        },
      )}
    </>
  );
};
