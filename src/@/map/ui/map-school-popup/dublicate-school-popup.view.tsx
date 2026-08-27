import { useStore } from 'effector-react';
import { ArrowRight, Info } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { setSchoolFocusLatLng } from '~/@/country/country.model';
import type { EntityType } from '~/@/entities/types/base-entity.type';
import EntityLegendIndicator from '~/@/entities/ui/entity-legend-indicator';
import { navigateToEntity } from '~/@/entities/utils/entity-navigation';
import { normalizeEntityLayerInfoList } from '~/@/entities/utils/entity-resolver';
import { $layerUtils, schoolStatsMap } from '~/@/sidebar/sidebar.model';
import { ConnectivityStatusNames } from '~/@/sidebar/ui/global-and-country-view-components/container/layer-view.constant';
import { fetchDublicateSchoolPopupDataFx } from '~/api/project-connect';
import { SchoolStatsType } from '~/api/types';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Scroll } from '~/@/scroll';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import { PointCoordinates } from '~/core/global-types';
import {
  $dublicateSchoolClickData,
  $stylePaintData,
  setSchoolIdsOnPopupClickDot,
} from '../../map.model';
import { UNKNOWN } from '../../map.types';
import DublicateSchoolLoader from './dublicate-school-popup-loader.view';

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

export default function DublicateSchoolPopup({
  schoolIds,
  entityType,
  countryCode,
  scrollableTargetId,
  batchSize = 10,
}: Props) {
  const { t } = useTranslation();
  const total = schoolIds?.length ?? 0;
  const [visibleSchools, setVisibleSchools] = useState<
    ReturnType<typeof schoolStatsMap>[]
  >([]);
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
  const currentLayerTypeUtils =
    layerUtils.currentLayerTypeUtilsByEntity[entityType];
  const selectedLayerData = layerUtils.selectedLayerDataByEntity[entityType];
  const isLive = currentLayerTypeUtils?.isLive ?? false;
  const isStatic = currentLayerTypeUtils?.isStatic ?? false;
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
      (prev.length === schoolIds.length &&
        prev.some((v, i) => v !== schoolIds[i]));

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
      const payloadArr = normalizeEntityLayerInfoList<SchoolStatsType>(
        globalFetchStore,
        entityType,
      );

      if (payloadArr.length === 0) {
        // if there's no payload and no pending request, clear loading trackers
        if (!isPending) {
          isLoadingRef.current = false;
          lastRequestedIdsRef.current = null;
        }
        return;
      }

      // Build set of currently visible IDs to avoid duplicates
      const existingIdsSet = new Set(
        visibleSchools.map((s) => Number((s as any).id)),
      );

      // Filter payload for items not already in UI
      const newItemsRaw = payloadArr.filter(
        (s) => !existingIdsSet.has(Number((s as any).id)),
      );

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
        const toAdd = mappedNew.filter(
          (n) => !prevIds.has(Number((n as any).id)),
        );
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
    <div className="relative! flex! w-[300px]! flex-col! rounded-xl! border! border-border! bg-popover! p-4! text-foreground! shadow-xl! dark:border-gray-800! dark:bg-gray-900!">
      {/* Header: Total Count with Info Tooltip */}
      <div className="flex! items-center! justify-between! gap-2! border-b! border-border! pb-3! dark:border-gray-800!">
        <div className="flex! items-center! gap-1.5!">
          <span className="text-[14px]! font-medium! text-black! dark:text-foreground!">
            {`(${schoolIds.length}) ${t('school-location-duplicates')}`}
          </span>
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="inline-flex! cursor-pointer! text-gray-700! transition-colors! hover:text-black! focus:outline-none! dark:text-white/80! dark:hover:text-white!"
                  aria-label={`(${schoolIds.length}) ${t('school-location-duplicates')}`}
                >
                  <Info className="size-3.5!" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs! text-xs!">
                {`(${schoolIds.length}) ${t('school-location-duplicates')}`}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Scrollable Duplicate List with custom scrollbar */}
      <Scroll
        id={scrollableTargetId}
        className="max-h-[50vh]! -mr-3! pr-3!"
        options={{ suppressScrollX: true }}
      >
        <InfiniteScroll
          dataLength={visibleSchools.length}
          next={loadMore}
          hasMore={hasMore}
          loader={<DublicateSchoolLoader />}
          scrollableTarget={scrollableTargetId}
        >
          {visibleSchools.map((s, idx) => {
            const isLiveNotUnknown = isLive && s?.connectivityType !== UNKNOWN;
            const connectivityValue = isLiveNotUnknown
              ? formatConnectivityValue(s?.liveAvg ?? 0, unit)
              : t('unknown');
            const staticValue = getStaticValue(s?.staticValue);

            const connecitivityColor =
              stylePaintData[s?.connectivityType ?? UNKNOWN];
            const staticColor = stylePaintData[s?.staticType ?? UNKNOWN];
            const connecitivityStatusColor =
              stylePaintData[s?.connectivityStatus ?? UNKNOWN];

            return (
              <div
                key={String(s.id)}
                aria-label={`Open ${s.name}`}
                className="flex! flex-col! gap-2! border-b! border-border/60! py-3.5! last:border-b-0! dark:border-gray-800!"
              >
                {/* Line 1: School Name & Verification Tag */}
                <div className="flex! min-w-0! flex-1! flex-wrap! items-center! gap-1.5!">
                  <h6
                    title={s.name}
                    className="text-[20px]! font-normal! not-italic! leading-[30px]! text-black! dark:text-foreground! capitalize! line-clamp-2! break-words!"
                  >
                    {s.name?.toLocaleLowerCase() ?? s.id}
                  </h6>
                  {s?.isVerifiedSchool === false && (
                    <Badge
                      variant="outline"
                      className="min-h-5! rounded-md! border-transparent! bg-warning/15! px-2! py-0.5! text-xs! font-normal! leading-4! text-warning! hover:bg-warning/15!"
                    >
                      Unverified
                    </Badge>
                  )}
                </div>

                {/* Line 2: Status Indicator & Value */}
                <div className="flex! items-center! gap-2!">
                  <div className="map-school-status-circle flex! items-center!">
                    <EntityLegendIndicator
                      color={
                        (isStatic ? staticColor : connecitivityStatusColor) ?? ''
                      }
                      entityType={entityType}
                      glowColor={
                        !isStatic && s?.isRealTime
                          ? connecitivityColor
                            ? `color-mix(in srgb, ${connecitivityColor} 42%, white)`
                            : undefined
                          : undefined
                      }
                      size={14}
                    />
                  </div>

                  {isLive && s?.isRealTime ? (
                    <span
                      className="text-[14px]! font-normal! not-italic! leading-[20px]! capitalize!"
                      style={{ color: connecitivityColor }}
                    >
                      {connectivityValue}
                    </span>
                  ) : isStatic ? (
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
                        s?.connectivityStatus ?? UNKNOWN
                        ] ?? UNKNOWN,
                      )}
                    </span>
                  )}
                </div>

                {/* Line 3: Counter (Left) & Circular Action Button (Right, 40px) */}
                <div className="flex! items-center! justify-between! gap-2! pt-0.5!">
                  <span className="text-[14px]! font-normal! not-italic! leading-[20px]! text-gray-700! dark:text-gray-400!">
                    {`${idx + 1} ${t('of')} ${total}`}
                  </span>

                  <Button
                    size="icon"
                    className="size-10! shrink-0! cursor-pointer! rounded-full! border-0! bg-primary! text-primary-foreground! shadow-xs! transition-all! hover:bg-primary/90! focus:outline-none! active:bg-primary/80!"
                    onClick={() => {
                      navigateToEntity(entityType, countryCode, s.id);
                      if (s?.geopoint?.coordinates) {
                        setSchoolFocusLatLng(
                          s.geopoint.coordinates as PointCoordinates,
                        );
                      }
                    }}
                    aria-label={`View ${s.name}`}
                    type="button"
                  >
                    <ArrowRight className="size-5!" />
                  </Button>
                </div>
              </div>
            );
          })}
        </InfiniteScroll>
      </Scroll>
    </div>
  );
}
