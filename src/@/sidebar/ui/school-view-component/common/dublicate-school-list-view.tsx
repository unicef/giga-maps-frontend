import { useStore } from 'effector-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { $countryCode, setSchoolFocusLatLng } from '~/@/country/country.model';
import { $dublicateSchoolClickData, $stylePaintData, setSchoolIdsOnPopupClickDot } from '~/@/map/map.model';
import { UNKNOWN } from '~/@/map/map.types';
import { InnerCircle, InnerCircleConnectivity } from '~/@/map/ui/legend-info/legend-button.style';
import DublicateSchoolLoader from '~/@/map/ui/map-school-popup/dublicate-school-popup-loader.view';
import { ConnectivityCircleWrapper, Label, LiveContent, LiveStatusRow } from '~/@/map/ui/map-school-popup/school-popup.style';
import { $layerUtils, $schoolStats, schoolStatsMap } from '~/@/sidebar/sidebar.model';
import { fetchDublicateSchoolPopupDataFx } from '~/api/project-connect';
import { SchoolStatsType } from '~/api/types';
import { PointCoordinates } from '~/core/global-types';
import { router } from '~/core/routes';
import { ConnectivityStatusNames } from '../../global-and-country-view-components/container/layer-view.constant';
import { DublicateSchoolList, SchoolInternetSpeed, SchoolItemCount, SchoolListItem, SchoolName, SidebarDublicateSchoolWrapper, ToggleLink, TotalCountLabel } from './dublicate-school-list.style';

type Props = {
  scrollableTargetId: string; // id of scroll container owned by parent
  pageSize?: number;
};

export default function SidebarDublicateSchoolList({
  scrollableTargetId,
  pageSize = 5,
}: Props) {
  const { t } = useTranslation();
  const [isShowMoreButton, setIsShowMoreButton] = useState(true);

  // --- read duplicate ids from store (same logic as your old parent) ---
  const schoolStats = useStore($schoolStats); // raw clicked school payload
  const selectedSchool = useMemo(() => schoolStats?.[0], [schoolStats]);

  const popupSchoolsFromStore = useStore($dublicateSchoolClickData) as SchoolStatsType[] | undefined;
  const fetchPending = useStore(fetchDublicateSchoolPopupDataFx.pending);

  // effector stores & flags
  const stylePaintData = useStore($stylePaintData);
  const layerUtils = useStore($layerUtils);
  const countryCode = useStore($countryCode);

  // derived from layer utils (kept from your code)
  const { currentLayerTypeUtils, selectedLayerData } = layerUtils ?? {};
  const { isLive = false, isStatic = false } = currentLayerTypeUtils ?? {};
  const { global_benchmark } = selectedLayerData ?? {};
  const unit = global_benchmark?.convert_unit ?? '';

  // derive duplicateIds from the first schoolClickData item (like your old logic)
  const duplicateIds: number[] = React.useMemo(() => {
    if (!selectedSchool) return [];
    const ids = selectedSchool?.schools_at_same_location?.school_ids;
    if (!Array.isArray(ids) || ids.length === 0) return [];
    return ids;
  }, [selectedSchool]);

  const totalIds = duplicateIds.length;
  const totalDublicateSchoolIdsCount = useMemo(() => selectedSchool?.schools_at_same_location?.count, [selectedSchool])

  // local state: accumulated fetched schools (mapped SchoolStatsType objects)
  const [accumulatedSchools, setAccumulatedSchools] = useState<ReturnType<typeof schoolStatsMap>[]>([]);
  const nextIndexRef = useRef<number>(0); // pointer to next id index to request
  const isFetchingRef = useRef<boolean>(false); // guard
  const lastRequestedRangeRef = useRef<{ from: number; to: number } | null>(null);

  // track which ids we have asked for (so we ignore stale payloads that belong to previous popup)
  const requestedIdsSetRef = useRef<Set<number>>(new Set());

  // When duplicateIds change (new popup click), reset local state and request first batch
  useEffect(() => {
    // reset everything local
    setAccumulatedSchools([]);
    nextIndexRef.current = 0;
    lastRequestedRangeRef.current = null;
    isFetchingRef.current = false;
    requestedIdsSetRef.current.clear();

    // show the manual Show more button again (the user asked this)
    setIsShowMoreButton(true);

    // scroll parent to top when a new school is selected
    const el = document.getElementById(scrollableTargetId);
    if (el) {
      // use instant scroll for immediate reset (feel free to change to smooth)
      el.scrollTo({ top: 0, behavior: 'auto' });
    }

    if (duplicateIds.length === 0) return;

    // auto request first batch (only first pageSize items)
    requestIdsChunk(0, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duplicateIds.join(',')]); // string join helps compare arrays

  // Request a chunk of ids: fromIndex inclusive, chunkSize
  function requestIdsChunk(fromIndex: number, chunkSize = pageSize) {
    if (isFetchingRef.current) return false;
    if (!duplicateIds || duplicateIds.length === 0) return false;

    const to = Math.min(duplicateIds.length, fromIndex + chunkSize);
    if (fromIndex >= to) return false;

    const idsToFetch = duplicateIds.slice(fromIndex, to);
    if (!idsToFetch.length) return false;

    // guard + record
    isFetchingRef.current = true;
    lastRequestedRangeRef.current = { from: fromIndex, to };

    // increment pointer immediately so we won't re-request same range
    nextIndexRef.current = to;

    // mark requested ids so that incoming global payloads that belong to previous popup are ignored
    idsToFetch.forEach((id) => requestedIdsSetRef.current.add(id));

    // dispatch to effector (app-level) to actually fetch details
    setSchoolIdsOnPopupClickDot({
      ids: idsToFetch,
      allowDublicateSchoolIds: false,
    });

    return true;
  }

  // load more called by InfiniteScroll
  const loadMore = useCallback(() => {
    // if show more button is visible we don't allow infinite scroll auto-load
    if (isShowMoreButton) return;
    if (nextIndexRef.current >= totalIds) return;
    requestIdsChunk(nextIndexRef.current, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalIds, pageSize, duplicateIds.length, isShowMoreButton]);

  // Watch global effector store responses and append only new items that were actually requested for the current popup
  useEffect(() => {
    if (!popupSchoolsFromStore || popupSchoolsFromStore.length === 0) {
      // clear fetching flag if no payload and not pending
      if (!fetchPending) isFetchingRef.current = false;
      return;
    }

    try {
      // deduplicate by id and only accept items that we requested for this popup
      const existingIds = new Set(accumulatedSchools.map((s) => (s as any).id));
      const relevantNewItems = popupSchoolsFromStore.filter((s) => {
        const id = (s as any).id;
        if (!requestedIdsSetRef.current.has(id)) return false; // ignore items we didn't ask for (stale)
        return !existingIds.has(id);
      });

      if (relevantNewItems.length > 0) {
        setAccumulatedSchools((prev) => {
          const normalized = relevantNewItems.map((item) => schoolStatsMap(item));
          const merged = [...prev, ...normalized];
          return merged;
        });
      }
    } finally {
      // allow next requests
      isFetchingRef.current = false;
      lastRequestedRangeRef.current = null;
    }
  }, [popupSchoolsFromStore?.length, fetchPending]);

  // If Show more button visible dont allow infinite scroll to show loader
  const hasMore = isShowMoreButton ? false : accumulatedSchools.length < totalIds;

  // UI click: Show more (when infinite disabled)
  const handleShowMoreClick = () => {
    // request next chunk; hide the show more button to allow infinite loading after this
    requestIdsChunk(nextIndexRef.current, pageSize);
    setIsShowMoreButton(false);
  };

  const handleGoTop = () => {
    const el = document.getElementById(scrollableTargetId);
    if (el) {
      el.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  function getStaticValue(staticValue: boolean | undefined | string | null) {
    if (typeof staticValue === 'boolean') {
      return staticValue ? 'yes' : 'no';
    }
    if (!staticValue || staticValue === 'unknown') {
      return t('unknown');
    }
    return String(staticValue);
  }

  // Render nothing if there's no duplicate ids
  if (!duplicateIds || duplicateIds.length === 0) return null;

  return (
    <SidebarDublicateSchoolWrapper>
      <TotalCountLabel>{`(${totalDublicateSchoolIdsCount}) ${t('school-duplicates')}`}</TotalCountLabel>

      <DublicateSchoolList>
        <InfiniteScroll
          dataLength={accumulatedSchools.length}
          next={loadMore}
          hasMore={hasMore}
          loader={<DublicateSchoolLoader />}
          scrollableTarget={scrollableTargetId}
        >
          {accumulatedSchools.map((s, idx) => {
            const isLiveNotUnknown = isLive && s?.connectivityType !== UNKNOWN;
            const connectivityValue = isLiveNotUnknown ? `${s?.liveAvg ?? 0} ${unit}` : t('unknown');
            const staticValue = getStaticValue(s?.staticValue);

            const connecitivityColor = stylePaintData[s?.connectivityType ?? UNKNOWN];
            const staticColor = stylePaintData[s?.staticType ?? UNKNOWN];
            const connecitivityStatusColor = stylePaintData[s?.connectivityStatus ?? UNKNOWN];

            return (
              <SchoolListItem key={s.id} aria-label={`Open ${s.name}`}>
                <SchoolName
                  onClick={() => {
                    handleGoTop();
                    router.navigate(`/map/schools?country=${countryCode.toLowerCase()}&school_ids=${s.id}`);
                    setSchoolFocusLatLng(s.geopoint.coordinates as PointCoordinates);
                  }}
                  aria-label={`Open ${s.name}`}
                  title={s.name}
                >
                  <SchoolItemCount>{`${idx + 1}.`}</SchoolItemCount>
                  {s.name}
                </SchoolName>
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
              </SchoolListItem>
            );
          })}
        </InfiniteScroll>

        {totalIds > 5 && isShowMoreButton && (
          <ToggleLink onClick={() => handleShowMoreClick()} aria-label={t("show-more")} type="button">
            {t("show-more")}
          </ToggleLink>
        )}
      </DublicateSchoolList>
    </SidebarDublicateSchoolWrapper>
  );
}