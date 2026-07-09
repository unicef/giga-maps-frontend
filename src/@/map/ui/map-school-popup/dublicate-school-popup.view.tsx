import { ArrowRight, Information } from '@carbon/icons-react';
import { Tooltip } from '@carbon/react';
import { useStore } from 'effector-react';
import { t } from 'i18next';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { setSchoolFocusLatLng } from '~/@/country/country.model';
import type { EntityType } from '~/@/entities/types/base-entity.type';
import { navigateToEntity } from '~/@/entities/utils/entity-navigation';
import { normalizeEntityLayerInfoList } from '~/@/entities/utils/entity-resolver';
import { $layerUtils, schoolStatsMap } from '~/@/sidebar/sidebar.model';
import { ConnectivityStatusNames } from '~/@/sidebar/ui/global-and-country-view-components/container/layer-view.constant';
import { fetchDublicateSchoolPopupDataFx } from '~/api/project-connect';
import { SchoolStatsType } from '~/api/types';
import { PointCoordinates } from '~/core/global-types';
import { $dublicateSchoolClickData, $stylePaintData, setSchoolIdsOnPopupClickDot } from '../../map.model';
import { UNKNOWN } from '../../map.types';
import EntityLegendIndicator from '~/@/entities/ui/entity-legend-indicator';
import DublicateSchoolLoader from './dublicate-school-popup-loader.view';
import {
  DublicateSchoolList,
  DublicateSchoolListWrapper,
  GoToSchoolInfo,
  ItemBottomSection,
  ItemTopSection,
  SchoolInternetSpeed,
  SchoolItemCount,
  SchoolListItem,
  SchoolName,
  TotalCountLabel
} from './dublicate-school-popup.style';
import { ConnectivityCircleWrapper, Label, LiveContent, LiveStatusRow, SchoolVerificationTag } from './school-popup.style';

type Props = {
  schoolIds: number[];
  entityType: EntityType;
  countryCode: string;
  /**
   * ID of the scroll container managed by the parent.
   * Example: parent must render a container with id="parentScrollContainer"
   * and pass scrollableTargetId="parentScrollContainer".
   */
  scrollableTargetId: string;
  batchSize?: number;
};

export function getStaticValue(staticValue: boolean | undefined | string | null) {
  if (typeof staticValue === 'boolean') {
    return staticValue ? 'yes' : 'no';
  }
  if (!staticValue || staticValue === 'unknown') {
    return t('unknown');
  }
  return String(staticValue);
}

export default function DublicateSchoolPopup({
  schoolIds,
  entityType,
  countryCode,
  scrollableTargetId,
  batchSize = 10,
}: Props) {
  const { t } = useTranslation();
  const total = schoolIds?.length ?? 0;
  const [visibleSchools, setVisibleSchools] = useState<ReturnType<typeof schoolStatsMap>[]>([]);
  const requestedCountRef = useRef<number>(0);
  const lastRequestedIdsRef = useRef<number[] | null>(null);
  const isLoadingRef = useRef<boolean>(false);
  const mountedRef = useRef<boolean>(true);
  const prevSchoolIdsRef = useRef<number[] | null>(null);

  // effector stores & flags
  const globalFetchStore = useStore($dublicateSchoolClickData) as any; // shape may vary
  const isPending = useStore(fetchDublicateSchoolPopupDataFx.pending);
  const stylePaintData = useStore($stylePaintData);
  const layerUtils = useStore($layerUtils);

  // derived from layer utils (kept from your code)
  const { currentLayerTypeUtils, selectedLayerData } = layerUtils ?? {};
  const { isLive = false, isStatic = false } = currentLayerTypeUtils ?? {};
  const { global_benchmark } = selectedLayerData ?? {};
  const unit = global_benchmark?.convert_unit ?? '';
  const formatConnectivityValue = (value: number, valueUnit?: string) => {
    if (!valueUnit) return String(value);
    return valueUnit === '%' ? `${value}${valueUnit}` : `${value} ${valueUnit}`;
  };

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // detect changes to incoming schoolIds (parent might pass new list)
  useEffect(() => {
    const prev = prevSchoolIdsRef.current;
    const changed =
      prev === null ||
      prev.length !== schoolIds.length ||
      (prev.length === schoolIds.length && prev.some((v, i) => v !== schoolIds[i]));

    if (changed) {
      prevSchoolIdsRef.current = [...schoolIds];
      // reset local UI state & refs
      setVisibleSchools([]);
      requestedCountRef.current = 0;
      lastRequestedIdsRef.current = null;
      isLoadingRef.current = false;

      // request initial batch immediately
      requestNextBatch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolIds]);

  function getNextSlice(): number[] {
    if (!schoolIds || requestedCountRef.current >= schoolIds.length) return [];
    const start = requestedCountRef.current;
    const end = Math.min(start + batchSize, schoolIds.length);
    return schoolIds.slice(start, end);
  }

  function requestNextBatch() {
    if (isLoadingRef.current) return;
    const nextIds = getNextSlice();
    if (!nextIds || nextIds.length === 0) return;
    isLoadingRef.current = true;
    lastRequestedIdsRef.current = nextIds;
    // increment requested count immediately so subsequent calls compute correctly
    requestedCountRef.current += nextIds.length;

    // dispatch to effector — other parts of app handle the effect
    setSchoolIdsOnPopupClickDot({
      ids: nextIds,
      entityType,
    });
  }

  const loadMore = () => {
    // Don't request if no more
    if (visibleSchools.length >= total) return;
    requestNextBatch();
  };

  useEffect(() => {
    if (!mountedRef.current) return;

    try {
      const payloadArr = normalizeEntityLayerInfoList<SchoolStatsType>(globalFetchStore, entityType);

      if (payloadArr.length === 0) {
        // if there's no payload and no pending request, clear loading trackers
        if (!isPending) {
          isLoadingRef.current = false;
          lastRequestedIdsRef.current = null;
        }
        return;
      }

      // Build set of currently visible IDs to avoid duplicates
      const existingIdsSet = new Set(visibleSchools.map((s) => Number((s as any).id)));

      // Filter payload for items not already in UI
      const newItemsRaw = payloadArr.filter((s) => !existingIdsSet.has(Number((s as any).id)));

      if (newItemsRaw.length === 0) {
        // nothing to add; clear loading if not pending
        if (!isPending) {
          isLoadingRef.current = false;
          lastRequestedIdsRef.current = null;
        }
        return;
      }

      // Map raw items via your mapping function then append only unique ones
      const mappedNew = newItemsRaw.map((item) => schoolStatsMap(item));

      setVisibleSchools((prev) => {
        const prevIds = new Set(prev.map((p) => Number((p as any).id)));
        const toAdd = mappedNew.filter((n) => !prevIds.has(Number((n as any).id)));
        return [...prev, ...toAdd];
      });

      // success => clear trackers
      lastRequestedIdsRef.current = null;
      isLoadingRef.current = false;
    } catch (err) {
      console.error('[DuplicatePopup] error processing globalFetchStore:', err);
      if (!isPending) {
        isLoadingRef.current = false;
        lastRequestedIdsRef.current = null;
      }
    }
    // intentionally depend on globalFetchStore & isPending & visibleSchools length
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalFetchStore, isPending]);

  function getStaticValue(staticValue: boolean | undefined | string | null) {
    if (typeof staticValue === 'boolean') {
      return staticValue ? 'yes' : 'no';
    }
    if (!staticValue || staticValue === 'unknown') {
      return t('unknown');
    }
    return String(staticValue);
  }

  if (!schoolIds || schoolIds.length === 0) return null;

  const hasMore = visibleSchools.length < total;

  return (
    <DublicateSchoolListWrapper>
      <TotalCountLabel>
        {`(${schoolIds.length}) ${t('school-location-duplicates')}`}{' '}
        <Tooltip className='info-icon' align="top" label={`(${schoolIds.length}) ${t('school-location-duplicates')}`}>
          <button className="sb-tooltip-trigger" type="button">
            <Information size={16} color={'#7e7e7e'} style={{ verticalAlign: 'middle' }} />
          </button>
        </Tooltip>
      </TotalCountLabel>

      {/* NOTE: parent must provide a scroll container with id={scrollableTargetId} */}
      <DublicateSchoolList id={scrollableTargetId}>
        <InfiniteScroll
          dataLength={visibleSchools.length}
          next={loadMore}
          hasMore={hasMore}
          loader={
            <DublicateSchoolLoader />
          }
          scrollableTarget={scrollableTargetId}
        >
          {visibleSchools.map((s, idx) => {
            const isLiveNotUnknown = isLive && s?.connectivityType !== UNKNOWN;
            const connectivityValue = isLiveNotUnknown ? formatConnectivityValue(s?.liveAvg ?? 0, unit) : t('unknown');
            const staticValue = getStaticValue(s?.staticValue);

            const connecitivityColor = stylePaintData[s?.connectivityType ?? UNKNOWN];
            const staticColor = stylePaintData[s?.staticType ?? UNKNOWN];
            const connecitivityStatusColor = stylePaintData[s?.connectivityStatus ?? UNKNOWN];

            return (
              <SchoolListItem key={String(s.id)} aria-label={`Open ${s.name}`}>
                <ItemTopSection>
                  <SchoolName title={s.name}>
                    <span>{s.name ?? s.id}</span>
                    {s?.isVerifiedSchool === false && <SchoolVerificationTag>Unverified</SchoolVerificationTag>}
                  </SchoolName>
                  <SchoolItemCount>{`${idx + 1} ${t('of')} (${total})`}</SchoolItemCount>
                </ItemTopSection>

                <ItemBottomSection>
                  <SchoolInternetSpeed>
                    <ConnectivityCircleWrapper className="map-school-status-circle flex! items-center!">
                      <EntityLegendIndicator
                        color={isStatic ? staticColor : connecitivityStatusColor}
                        entityType={entityType}
                        glowColor={
                          !isStatic && s?.isRealTime
                            ? `color-mix(in srgb, ${connecitivityColor} 42%, white)`
                            : undefined
                        }
                        size={16}
                      />
                    </ConnectivityCircleWrapper>
                    <LiveContent>
                      {isLive && s?.isRealTime && (
                        <LiveStatusRow>
                          <Label $color={connecitivityColor} style={{ whiteSpace: 'nowrap' }}>{connectivityValue}</Label>
                        </LiveStatusRow>
                      )}
                      {isStatic && <Label $color={staticColor}>{staticValue}</Label>}
                      {!isStatic && (!isLive || !s?.isRealTime) && (
                        <Label $color={connecitivityStatusColor} style={{ whiteSpace: 'nowrap' }}>{t(ConnectivityStatusNames[s?.connectivityStatus])}</Label>
                      )}
                    </LiveContent>
                  </SchoolInternetSpeed>
                  <GoToSchoolInfo
                    className="cds--btn cds--btn--primary"
                    onClick={() => {
                      navigateToEntity(entityType, countryCode, s.id);
                      setSchoolFocusLatLng(s.geopoint.coordinates as PointCoordinates);
                    }}
                    aria-label={`View ${s.name}`}
                    type="button"
                  >
                    <ArrowRight size={16} />
                  </GoToSchoolInfo>
                </ItemBottomSection>
              </SchoolListItem>
            );
          })}
        </InfiniteScroll>
      </DublicateSchoolList>
    </DublicateSchoolListWrapper>
  );
};
