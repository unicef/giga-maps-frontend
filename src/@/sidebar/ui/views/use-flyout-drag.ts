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

const HANDLE_SELECTOR = '#mobile-view-slider';
const NO_DRAG_SELECTOR = '[data-flyout-no-drag]';

type SnapHeights = Record<SidebarFlyoutState, number>;

type DragSession = {
  samples: { time: number; y: number }[];
  snapHeights: SnapHeights;
  startHeight: number;
  startY: number;
};

type TouchGesture = {
  fromHandle: boolean;
  mode: 'drag' | 'ignore' | 'pending';
  scroller: Element | null;
  startTime: number;
  startX: number;
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

const findVerticalScroller = (target: Element | null, panel: HTMLElement) => {
  for (let node = target; node && node !== panel; node = node.parentElement) {
    const { overflowY } = getComputedStyle(node);
    if (
      (overflowY === 'auto' || overflowY === 'scroll') &&
      node.scrollHeight > node.clientHeight + 1
    ) {
      return node;
    }
  }
  return null;
};

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
  const pointerId = useRef<number | null>(null);
  const didDrag = useRef(false);
  const stateRef = useRef(state);
  stateRef.current = state;

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

  const startSession = (clientY: number, time: number) => {
    const panel = panelRef.current;
    if (!panel) return false;

    session.current = {
      samples: [{ time, y: clientY }],
      snapHeights: resolveSnapHeights(panel),
      startHeight: getVisibleHeight(panel),
      startY: clientY,
    };
    panel.dataset.dragging = 'true';
    return true;
  };

  const moveSession = (clientY: number, time: number) => {
    const current = session.current;
    const panel = panelRef.current;
    if (!current || !panel) return;

    current.samples = [
      ...current.samples.filter(
        (sample) => time - sample.time <= VELOCITY_WINDOW_MS,
      ),
      { time, y: clientY },
    ];
    panel.style.setProperty(
      '--flyout-drag-y',
      `${panel.clientHeight - getHeight(clientY)}px`,
    );
  };

  const endSession = (release?: { clientY: number; time: number }) => {
    const panel = panelRef.current;
    const target =
      release && session.current && didDrag.current
        ? getReleaseState(release.clientY, release.time)
        : undefined;
    session.current = null;
    pointerId.current = null;

    if (!panel) return;
    panel.style.removeProperty('--flyout-drag-y');
    delete panel.dataset.dragging;

    if (target) setSidebarFlyoutState(target);
  };

  // Touch drags from anywhere on the panel; content keeps the gesture when it
  // is horizontal, or when full and the list can still scroll that way.
  useEffect(() => {
    const panel = panelRef.current;
    if (disabled || !panel) return;

    let gesture: TouchGesture | null = null;

    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      const target = event.target instanceof Element ? event.target : null;
      if (session.current) endSession();
      if (
        event.touches.length > 1 ||
        !touch ||
        target?.closest(NO_DRAG_SELECTOR)
      ) {
        gesture = null;
        return;
      }

      didDrag.current = false;
      gesture = {
        fromHandle: Boolean(target?.closest(HANDLE_SELECTOR)),
        mode: 'pending',
        scroller: findVerticalScroller(target, panel),
        startTime: event.timeStamp,
        startX: touch.clientX,
        startY: touch.clientY,
      };
    };

    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!gesture || !touch || gesture.mode === 'ignore') return;

      if (gesture.mode === 'pending') {
        const dx = touch.clientX - gesture.startX;
        const dy = touch.clientY - gesture.startY;
        if (Math.max(Math.abs(dx), Math.abs(dy)) <= TAP_SLOP_PX) return;

        const contentKeepsIt =
          Math.abs(dx) > Math.abs(dy) ||
          (!gesture.fromHandle &&
            stateRef.current === 'expanded' &&
            gesture.scroller !== null &&
            (dy < 0 || gesture.scroller.scrollTop > 0));
        if (
          contentKeepsIt ||
          !startSession(gesture.startY, gesture.startTime)
        ) {
          gesture.mode = 'ignore';
          return;
        }
        gesture.mode = 'drag';
        didDrag.current = true;
      }

      if (event.cancelable) event.preventDefault();
      moveSession(touch.clientY, event.timeStamp);
    };

    const onTouchEnd = (event: TouchEvent) => {
      const touch = event.changedTouches[0];
      if (gesture?.mode === 'drag') {
        endSession(
          touch ? { clientY: touch.clientY, time: event.timeStamp } : undefined,
        );
      }
      gesture = null;
    };

    const onTouchCancel = () => {
      if (gesture?.mode === 'drag') endSession();
      gesture = null;
      didDrag.current = false;
    };

    panel.addEventListener('touchstart', onTouchStart, { passive: true });
    // Non-passive so a drag can stop the page and the list from scrolling.
    panel.addEventListener('touchmove', onTouchMove, { passive: false });
    panel.addEventListener('touchend', onTouchEnd);
    panel.addEventListener('touchcancel', onTouchCancel);

    return () => {
      panel.removeEventListener('touchstart', onTouchStart);
      panel.removeEventListener('touchmove', onTouchMove);
      panel.removeEventListener('touchend', onTouchEnd);
      panel.removeEventListener('touchcancel', onTouchCancel);
      if (gesture?.mode === 'drag') endSession();
    };
    // The helpers only read refs, so rebinding on every render buys nothing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, panelRef]);

  // Mouse drags on the handle only; touch goes through the listeners above.
  const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (disabled || event.pointerType === 'touch' || !event.isPrimary) return;
    if (!startSession(event.clientY, event.timeStamp)) return;

    didDrag.current = false;
    pointerId.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (pointerId.current !== event.pointerId || !session.current) return;

    if (Math.abs(session.current.startY - event.clientY) > TAP_SLOP_PX) {
      didDrag.current = true;
    }
    moveSession(event.clientY, event.timeStamp);
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    if (pointerId.current !== event.pointerId) return;
    endSession({ clientY: event.clientY, time: event.timeStamp });
  };

  const onPointerCancel = (event: ReactPointerEvent<HTMLElement>) => {
    if (pointerId.current !== event.pointerId) return;
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
