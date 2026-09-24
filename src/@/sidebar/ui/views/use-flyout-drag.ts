import {
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  useEffect,
  useRef,
} from 'react';

import {
  FLYOUT_STATES,
  FLYOUT_VISIBLE_HEIGHT,
} from '~/@/sidebar/sidebar.constant';
import { setSidebarFlyoutState } from '~/@/sidebar/sidebar.model';
import { SidebarFlyoutState } from '~/@/sidebar/types';

// Below this the gesture is a tap, and the handle's onClick cycles instead.
const TAP_SLOP_PX = 6;
// A release faster than this jumps to the next snap regardless of distance.
const FLICK_PX_PER_MS = 0.3;
const VELOCITY_WINDOW_MS = 120;
const RUBBER_BAND_RATIO = 1 / 4;

type SnapHeights = Record<SidebarFlyoutState, number>;

type DragSession = {
  pointerId: number;
  samples: { time: number; y: number }[];
  snapHeights: SnapHeights;
  startHeight: number;
  startY: number;
};

// The snap points are CSS lengths (dvh, env(), %), so let the browser resolve
// them; the probe is absolute so `100%` is the panel's own height.
const resolveSnapHeights = (panel: HTMLElement) => {
  const probe = document.createElement('div');
  probe.style.cssText =
    'position:absolute;top:0;left:0;width:0;visibility:hidden;pointer-events:none';
  panel.append(probe);

  const snapHeights = {} as SnapHeights;
  FLYOUT_STATES.forEach((state) => {
    probe.style.height = FLYOUT_VISIBLE_HEIGHT[state];
    snapHeights[state] = Math.min(
      probe.getBoundingClientRect().height,
      panel.clientHeight,
    );
  });

  probe.remove();
  return snapHeights;
};

// The computed `translate` stays an unresolved calc(), but offsetTop ignores
// transforms, so the rect gives the live offset even mid-transition.
const getVisibleHeight = (panel: HTMLElement) =>
  panel.clientHeight - (panel.getBoundingClientRect().top - panel.offsetTop);

const getNearestState = (snapHeights: SnapHeights, height: number) =>
  FLYOUT_STATES.reduce((nearest, state) =>
    Math.abs(snapHeights[state] - height) <
    Math.abs(snapHeights[nearest] - height)
      ? state
      : nearest,
  );

const getFlickState = (
  snapHeights: SnapHeights,
  height: number,
  goingUp: boolean,
) =>
  (goingUp
    ? FLYOUT_STATES.find((state) => snapHeights[state] > height)
    : [...FLYOUT_STATES]
        .reverse()
        .find((state) => snapHeights[state] < height)) ??
  getNearestState(snapHeights, height);

export const useFlyoutDrag = ({
  disabled,
  panelRef,
  state,
}: {
  disabled?: boolean;
  panelRef: RefObject<HTMLDivElement | null>;
  state: SidebarFlyoutState;
}) => {
  const session = useRef<DragSession | null>(null);
  const didDrag = useRef(false);

  // Outside full, the bottom of the content is off screen, so a list left
  // scrolled halfway would open there next time.
  useEffect(() => {
    if (disabled || state === 'expanded') return;
    panelRef.current?.querySelectorAll('*').forEach((element) => {
      if (element.scrollTop > 0) element.scrollTop = 0;
    });
  }, [disabled, panelRef, state]);

  const getHeight = (clientY: number) => {
    const { snapHeights, startHeight, startY } = session.current!;
    const height = startHeight + (startY - clientY);
    const min = snapHeights.collapsed;
    const max = snapHeights.expanded;

    if (height > max) return max + (height - max) * RUBBER_BAND_RATIO;
    if (height < min) return min - (min - height) * RUBBER_BAND_RATIO;
    return height;
  };

  const getReleaseState = (clientY: number, time: number) => {
    const { samples, snapHeights } = session.current!;
    const height = getHeight(clientY);
    const first = samples.find(
      (sample) => time - sample.time <= VELOCITY_WINDOW_MS,
    );
    const velocity =
      first && time > first.time
        ? (first.y - clientY) / (time - first.time)
        : 0;

    return Math.abs(velocity) > FLICK_PX_PER_MS
      ? getFlickState(snapHeights, height, velocity > 0)
      : getNearestState(snapHeights, height);
  };

  const endSession = (target?: SidebarFlyoutState) => {
    const panel = panelRef.current;
    session.current = null;

    if (!panel) return;
    panel.style.removeProperty('--flyout-drag-y');
    delete panel.dataset.dragging;

    if (target && didDrag.current) setSidebarFlyoutState(target);
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    const panel = panelRef.current;
    if (disabled || !event.isPrimary || !panel) return;

    didDrag.current = false;
    session.current = {
      pointerId: event.pointerId,
      samples: [{ time: event.timeStamp, y: event.clientY }],
      snapHeights: resolveSnapHeights(panel),
      startHeight: getVisibleHeight(panel),
      startY: event.clientY,
    };
    panel.dataset.dragging = 'true';
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const current = session.current;
    const panel = panelRef.current;
    if (current?.pointerId !== event.pointerId || !panel) return;

    if (Math.abs(current.startY - event.clientY) > TAP_SLOP_PX) {
      didDrag.current = true;
    }
    current.samples = [
      ...current.samples.filter(
        (sample) => event.timeStamp - sample.time <= VELOCITY_WINDOW_MS,
      ),
      { time: event.timeStamp, y: event.clientY },
    ];

    panel.style.setProperty(
      '--flyout-drag-y',
      `${panel.clientHeight - getHeight(event.clientY)}px`,
    );
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    if (session.current?.pointerId !== event.pointerId) return;
    endSession(getReleaseState(event.clientY, event.timeStamp));
  };

  const onPointerCancel = (event: ReactPointerEvent<HTMLElement>) => {
    if (session.current?.pointerId !== event.pointerId) return;
    // No click follows a cancelled gesture, so clear the tap guard here.
    didDrag.current = false;
    endSession();
  };

  return {
    dragHandlers: {
      onPointerCancel,
      onPointerDown,
      onPointerMove,
      onPointerUp,
    },
    // One-shot: it only suppresses the click that closes a drag. Without the
    // reset a keyboard activation after a drag would be swallowed too.
    wasDragged: () => {
      const dragged = didDrag.current;
      didDrag.current = false;
      return dragged;
    },
  };
};
