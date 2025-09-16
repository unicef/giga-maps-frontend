import { ArrowRight, Information } from '@carbon/icons-react';
import { Tooltip } from '@carbon/react';
import { useStore } from 'effector-react';
import { t } from 'i18next';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { setSchoolFocusLatLng } from '~/@/country/country.model';
import { $layerUtils, schoolStatsMap } from '~/@/sidebar/sidebar.model';
import { ConnectivityStatusNames } from '~/@/sidebar/ui/global-and-country-view-components/container/layer-view.constant';
import { fetchDublicateSchoolPopupDataFx } from '~/api/project-connect';
import { SchoolStatsType } from '~/api/types';
import { PointCoordinates } from '~/core/global-types';
import { router } from '~/core/routes';
import { $dublicateSchoolClickData, $stylePaintData, setSchoolIdsOnPopupClickDot } from '../../map.model';
import { UNKNOWN } from '../../map.types';
import { InnerCircle, InnerCircleConnectivity } from '../legend-info/legend-button.style';
import { DublicateSchoolList, DublicateSchoolListWrapper, GoToSchoolInfo, ItemBottomSection, ItemTopSection, SchoolInternetSpeed, SchoolItemCount, SchoolListItem, TotalCountLabel } from './dublicate-school-popup.style';
import { ConnectivityCircleWrapper, Label, LiveContent, LiveStatusRow, SchoolName } from './school-popup.style';

type Props = {
  schoolIds: number[];
  countryCode: string;
};

export default function DublicateSchoolPopup({
  schoolIds,
  countryCode,
}: Props) {
  const batchSize = 10;
  const [visibleSchools, setVisibleSchools] = useState<any[]>([]);
  const requestedCountRef = useRef<number>(0);
  const lastRequestedIdsRef = useRef<number[] | null>(null);
  const isLoadingRef = useRef<boolean>(false);

  // global store where the dispatcher populates fetched school objects
  const globalFetchStore = useStore($dublicateSchoolClickData) as SchoolStatsType[] | null;
  // pending flag from the fetch effect (effector effect)
  const isPending = useStore(fetchDublicateSchoolPopupDataFx.pending);
  const stylePaintData = useStore($stylePaintData);
  const layerUtils = useStore($layerUtils);

  const { currentLayerTypeUtils, selectedLayerData } = layerUtils;
  const { isLive, isStatic } = currentLayerTypeUtils
  const { global_benchmark } = selectedLayerData ?? {};
  const unit = global_benchmark?.convert_unit;

  // Helper: whether there are more ids left to request
  const total = schoolIds?.length ?? 0;
  const hasMore = visibleSchools.length < total;
  const prevSchoolIdsRef = useRef<number[] | null>(null);

  useEffect(() => {
    const prev = prevSchoolIdsRef.current;
    const changed =
      prev === null ||
      prev.length !== schoolIds.length ||
      (prev.length === schoolIds.length && prev.some((v, i) => v !== schoolIds[i]));

    if (changed) {
      prevSchoolIdsRef.current = [...schoolIds];
      setVisibleSchools([]);
      requestedCountRef.current = 0;
      lastRequestedIdsRef.current = null;
      isLoadingRef.current = false;

      // Immediately request the first batch on parent update / initial mount
      requestNextBatch();
    }
  }, [schoolIds]);

  // Compose next slice without mutating schoolIds
  function getNextSlice(): number[] {
    if (!schoolIds || requestedCountRef.current >= schoolIds.length) return [];
    const start = requestedCountRef.current;
    const end = Math.min(start + batchSize, schoolIds.length);
    return schoolIds.slice(start, end);
  }

  // Request next batch: sets lastRequestedIdsRef and dispatches the global setter.
  function requestNextBatch() {
    if (isLoadingRef.current) return; // guard: do not double-request
    const nextIds = getNextSlice();
    if (!nextIds || nextIds.length === 0) return;
    isLoadingRef.current = true;
    lastRequestedIdsRef.current = nextIds;
    // update requestedCount immediately so subsequent calls compute correctly
    requestedCountRef.current += nextIds.length;

    // dispatcher that the rest of the app listens to — only sending ids as requested
    setSchoolIdsOnPopupClickDot({
      ids: nextIds,
    });
  }

  // Called by InfiniteScroll when user reaches bottom
  const loadMore = () => {
    if (!hasMore) return;
    requestNextBatch();
  };

  // Watch the global store for responses. When a response matches the last requested ids,
  // append to visibleSchools and clear loading flag. This comparison assumes the global store
  // provides the result as an array of SchoolStatsType objects for the last requested ids.
  // Put this in place of your current useEffect([...globalFetchStore, isPending]) watcher
  useEffect(() => {
    try {
      if (!globalFetchStore) {
        if (!isPending) {
          isLoadingRef.current = false;
          lastRequestedIdsRef.current = null;
        }
        return;
      }

      // --- Normalize store payload into an array of SchoolStatsType ---
      let payloadArr: SchoolStatsType[] = [];

      if (Array.isArray(globalFetchStore)) {
        payloadArr = globalFetchStore;
      } else if (typeof globalFetchStore === 'object') {
        // If the store is an object map like { id1: {...}, id2: {...} } convert to array
        // Or it might be a single object representing one school
        const maybeArray = Object.values(globalFetchStore);
        // If values are primitives or not objects, fall back to treating the store as single item
        if (maybeArray.length > 0 && typeof maybeArray[0] === 'object') {
          payloadArr = maybeArray as unknown as SchoolStatsType[];
        } else {
          // fallback: single object
          payloadArr = [globalFetchStore as unknown as SchoolStatsType];
        }
      } else {
        // unexpected type
        console.warn('[DBG] unexpected globalFetchStore shape', typeof globalFetchStore);
        return;
      }

      // Determine which incoming items correspond to our lastRequested slice (if we still track it)
      // But even if lastRequested is null (or doesn't match), we will append any new items not already in visibleSchools.
      const existingIdsSet = new Set(visibleSchools.map((s) => Number((s as any).id)));

      // Filter out items already present in visibleSchools
      const newItems = payloadArr.filter((s) => !existingIdsSet.has(Number((s as any).id)));

      if (newItems.length === 0) {
        // If there was a pending request but we got no useful payload, clear flags when pending is false
        if (!isPending) {
          isLoadingRef.current = false;
          lastRequestedIdsRef.current = null;
        }
        return;
      }

      // Append the new items
      setVisibleSchools((prev) => {
        // double-guard uniqueness
        const prevIds = new Set(prev.map((p) => Number((p as any).id)));

        // apply mapping BEFORE uniqueness filter
        const mappedNewItems = newItems.map((item) => schoolStatsMap(item));

        // only add items not already in state
        const toAdd = mappedNewItems.filter(
          (n) => !prevIds.has(Number((n as any).id))
        );
        return [...prev, ...toAdd];
      });


      // Clear request-tracking state (we successfully processed this payload)
      lastRequestedIdsRef.current = null;
      isLoadingRef.current = false;
    } catch (err) {
      console.error('[DBG] error handling globalFetchStore change:', err);
      // ensure we don't stay stuck in loading state
      if (!isPending) {
        isLoadingRef.current = false;
        lastRequestedIdsRef.current = null;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalFetchStore, isPending]);


  // If user scrolls quickly and triggers loadMore while a request is pending,
  // requestNextBatch guard will prevent duplicate requests. Once response arrives,
  // subsequent loadMore will request the next slice.

  const getStaticValue = (staticValue: boolean | undefined | string) => {
    if (typeof staticValue === 'boolean') {
      staticValue = staticValue === true ? 'yes' : 'no';
    } else if (staticValue === 'unknown' || !staticValue) {
      staticValue = t('unknown');
    } else {
      staticValue = staticValue;
    }
  }

  if (!schoolIds || schoolIds.length === 0) return null;

  return (
    <DublicateSchoolListWrapper>
      <TotalCountLabel>
        {`(${total}) School location duplicates`}{' '}
        <Tooltip className="data-source-tooltip" align="top" label={'data-is-sourced-research-institutions'}>
          <button className="sb-tooltip-trigger" type="button">
            <Information size={16} color={'#7e7e7e'} style={{ verticalAlign: 'middle' }} />
          </button>
        </Tooltip>
      </TotalCountLabel>

      <DublicateSchoolList id="scrollableDiv">
        <InfiniteScroll
          dataLength={visibleSchools.length}
          next={loadMore}
          hasMore={hasMore}
          loader={
            <div style={{ textAlign: 'center', padding: '8px', color: '#aaa' }}>
              Loading...
            </div>
          }
          scrollableTarget="scrollableDiv"
        >
          {visibleSchools.map((s, idx) => {
            const isLiveNotUnknown = isLive && s?.connectivityType !== UNKNOWN;
            const connectivityValue = isLiveNotUnknown ? `${s?.liveAvg ?? 0} ${unit}` : t('unknown');
            const staticValue = getStaticValue(s?.staticValue) as boolean | undefined | string;

            const connecitivityColor = stylePaintData[s?.connectivityType ?? UNKNOWN];
            const staticColor = stylePaintData[s?.staticType ?? UNKNOWN]
            const connecitivityStatusColor = stylePaintData[s?.connectivity_status ?? UNKNOWN];
            return <SchoolListItem key={String(s.id)} aria-label={`Open ${s.name}`}>
              <ItemTopSection>
                <SchoolName title={s.name}>{s.name ?? s.id}</SchoolName>
                <SchoolItemCount>{`${idx + 1} of (${total})`}</SchoolItemCount>
              </ItemTopSection>

              <ItemBottomSection>
                <SchoolInternetSpeed>
                  <ConnectivityCircleWrapper className="map-school-status-circle">
                    {!isStatic && s?.isRealTime && (
                      <InnerCircleConnectivity className="outer-circle" $backColor={connecitivityColor} />
                    )}
                    <InnerCircle className="inner-circle" $margin="0.35rem 0 0 0" $backColor={isStatic ? staticColor : connecitivityStatusColor} />
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
                    router.navigate(`/map/schools?country=${countryCode.toLowerCase()}&school_ids=${s.id}`);
                    setSchoolFocusLatLng(s.geopoint.coordinates as PointCoordinates);
                  }}
                  aria-label={`View ${s.name}`}
                  type="button"
                >
                  <ArrowRight size={16} />
                </GoToSchoolInfo>
              </ItemBottomSection>
            </SchoolListItem>
          }
          )}
        </InfiniteScroll>
      </DublicateSchoolList>
    </DublicateSchoolListWrapper>
  );
}
