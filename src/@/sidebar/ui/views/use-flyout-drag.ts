import {
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  useRef,
} from 'react';

import { FLYOUT_HEIGHT, FLYOUT_STATES } from '~/@/sidebar/sidebar.constant';
import { setSidebarFlyoutState } from '~/@/sidebar/sidebar.model';
import { SidebarFlyoutState } from '~/@/sidebar/types';

// Below this the gesture is a tap, and the handle's onClick cycles instead.
const TAP_SLOP_PX = 8;

type DragSession = {
  pointerId: number;
  snapHeights: Record<SidebarFlyoutState, number>;
  startHeight: number;
  startY: number;
};

// The snap points are CSS lengths (vh, dvh, var()), so let the browser resolve
// them instead of recomputing the units here.
const resolveSnapHeights = (panel: HTMLElement) => {
  const probe = document.createElement('div');
  probe.style.cssText =
    'position:fixed;top:0;left:0;width:0;visibility:hidden;pointer-events:none';
  panel.append(probe);

  const snapHeights = {} as Record<SidebarFlyoutState, number>;
  FLYOUT_STATES.forEach((state) => {
    probe.style.height = FLYOUT_HEIGHT[state];
    snapHeights[state] = probe.getBoundingClientRect().height;
  });

  probe.remove();
  return snapHeights;
};

const getNearestState = (
  snapHeights: Record<SidebarFlyoutState, number>,
  height: number,
) =>
  FLYOUT_STATES.reduce((nearest, state) =>
    Math.abs(snapHeights[state] - height) <
    Math.abs(snapHeights[nearest] - height)
      ? state
      : nearest,
  );

export const useFlyoutDrag = ({
  disabled,
  panelRef,
}: {
  disabled?: boolean;
  panelRef: RefObject<HTMLDivElement | null>;
}) => {
  const session = useRef<DragSession | null>(null);
  const didDrag = useRef(false);

  const endSession = (height?: number) => {
    const panel = panelRef.current;
    const current = session.current;
    session.current = null;

    if (!panel) return;
    panel.style.removeProperty('--flyout-height');
    delete panel.dataset.dragging;

    if (current && height !== undefined && didDrag.current) {
      setSidebarFlyoutState(getNearestState(current.snapHeights, height));
    }
  };

  // The panel's own max-height caps the top, so only the floor needs clamping.
  const getHeight = (event: ReactPointerEvent<HTMLElement>) => {
    const current = session.current!;

    return Math.max(
      current.startHeight + (current.startY - event.clientY),
      current.snapHeights.collapsed,
    );
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    const panel = panelRef.current;
    if (disabled || !event.isPrimary || !panel) return;

    didDrag.current = false;
    session.current = {
      pointerId: event.pointerId,
      snapHeights: resolveSnapHeights(panel),
      startHeight: panel.getBoundingClientRect().height,
      startY: event.clientY,
    };
    panel.dataset.dragging = 'true';
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (session.current?.pointerId !== event.pointerId) return;

    if (Math.abs(session.current.startY - event.clientY) > TAP_SLOP_PX) {
      didDrag.current = true;
    }

    panelRef.current?.style.setProperty(
      '--flyout-height',
      `${getHeight(event)}px`,
    );
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    if (session.current?.pointerId !== event.pointerId) return;
    endSession(getHeight(event));
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
    wasDragged: () => didDrag.current,
  };
};
