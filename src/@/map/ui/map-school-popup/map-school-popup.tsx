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
                  <div className="relative! flex! w-[17.5rem]! flex-col! gap-3! rounded-xl! border! border-white/5! bg-popover! p-4! text-foreground! shadow-xl!">
                    {/* Header: Title, verification badge & OSM link */}
                    <div className="flex! items-start! justify-between! gap-3!">
                      <div className="flex! min-w-0! flex-1! flex-wrap! items-center! gap-2!">
                        <h6 className="map-school-name text-[1.125rem]! font-medium! leading-6! text-foreground! capitalize! break-words!">
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
                          className="inline-flex! size-auto! shrink-0! items-center! self-start! text-[#277AFF]! transition-colors! hover:text-[#277AFF]/80! focus:text-[#277AFF]/80! active:text-[#277AFF]!"
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
                              isStatic ? staticColor : connecitivityStatusColor
                            }
                            entityType={entityType}
                            glowColor={
                              !isStatic && feature?.isRealTime
                                ? connecitivityColor
                                  ? `color-mix(in srgb, ${connecitivityColor} 42%, white)`
                                  : undefined
                                : undefined
                            }
                            size={10}
                          />
                        </div>

                        {isLive && feature?.isRealTime ? (
                          <div className="flex! flex-wrap! items-center! gap-2!">
                            <span
                              className="text-[0.9375rem]! font-normal! leading-none! capitalize!"
                              style={{ color: connecitivityColor }}
                            >
                              {connectivityValue}
                            </span>
                            {formattedInterval && (
                              <span className="inline-flex! items-center! rounded-md! border! border-white/10! bg-[#2b2b2b]! px-2.5! py-0.5! text-xs! font-normal! text-neutral-300!">
                                {formattedInterval}
                              </span>
                            )}
                          </div>
                        ) : isStatic ? (
                          <span
                            className="text-sm! font-normal! leading-none! capitalize!"
                            style={{ color: staticColor }}
                          >
                            {staticValue}
                          </span>
                        ) : (
                          <span
                            className="whitespace-nowrap! text-sm! font-normal! leading-none! capitalize!"
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

                      {/* Benchmark Subtitle */}
                      {isEntityBenchmark && benchmarkTitle && feature?.schoolBenchmark && (
                        <span className="text-sm! font-normal! leading-5! text-muted-foreground!">
                          {benchmarkTitle} - {feature?.schoolBenchmark}
                        </span>
                      )}
                    </div>

                    {/* Data Source Section */}
                    <SchoolPopupDataSource entityType={entityType} />

                    {/* Action Button */}
                    {entityType && (feature?.id || schoolId) && (
                      <Button
                        className="go-to-school mt-1! h-10! w-full! cursor-pointer! justify-center! gap-2! rounded-full! border-0! bg-[#0066FF]! px-4! text-sm! font-medium! text-white! shadow-xs! transition-all! hover:bg-[#0055D6]! focus:outline-none! active:bg-[#0047B3]!"
                        onClick={() => {
                          const targetId = feature?.id ?? schoolId;
                          if (targetId && entityType) {
                            navigateToEntity(entityType, countryCode, targetId);
                            if (feature?.geopoint?.coordinates) {
                              setSchoolFocusLatLng(
                                feature.geopoint.coordinates as PointCoordinates,
                              );
                            }
                          }
                        }}
                        type="button"
                      >
                        <span>
                          {t('go-to-entity-page', {
                            entity: entityLabel,
                            defaultValue: `Go to ${entityLabel} page`,
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
      })}
    </>
  );
};
