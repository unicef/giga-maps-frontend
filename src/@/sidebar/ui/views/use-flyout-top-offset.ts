import { type RefObject, useLayoutEffect } from 'react';

// The header is fixed over the map and its height varies per device (safe
// areas, font scaling), so a hardcoded offset buried the drag handle under it.
export const useFlyoutTopOffset = ({
  enabled,
  headerRef,
  panelRef,
}: {
  enabled: boolean;
  headerRef: RefObject<HTMLElement | null>;
  panelRef: RefObject<HTMLElement | null>;
}) => {
  useLayoutEffect(() => {
    const header = headerRef.current;
    const panel = panelRef.current;
    if (!panel) return;

    const clear = () => panel.style.removeProperty('--flyout-top-offset');

    if (!enabled || !header || typeof ResizeObserver === 'undefined') {
      clear();
      return;
    }

    const sync = () => {
      panel.style.setProperty(
        '--flyout-top-offset',
        `${header.getBoundingClientRect().height}px`,
      );
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(header);

    return () => {
      observer.disconnect();
      clear();
    };
  }, [enabled, headerRef, panelRef]);
};
