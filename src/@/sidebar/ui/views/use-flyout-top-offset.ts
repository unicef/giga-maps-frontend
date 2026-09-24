import { type RefObject, useLayoutEffect } from 'react';

// Measured: the header height varies per device. On <html> for the map camera.
export const useFlyoutTopOffset = ({
  enabled,
  headerRef,
}: {
  enabled: boolean;
  headerRef: RefObject<HTMLElement | null>;
}) => {
  useLayoutEffect(() => {
    const header = headerRef.current;
    const root = document.documentElement;

    const clear = () => root.style.removeProperty('--flyout-top-offset');

    if (!enabled || !header || typeof ResizeObserver === 'undefined') {
      clear();
      return;
    }

    const sync = () => {
      root.style.setProperty(
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
  }, [enabled, headerRef]);
};
