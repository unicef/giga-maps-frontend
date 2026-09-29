import { useEffect } from 'react';

import { flyoutSettled } from '~/@/sidebar/sidebar.model';
import { SidebarFlyoutState } from '~/@/sidebar/types';

// Shorter than the 500ms flyout transition: its easing leaves a few px after this.
const FLYOUT_SETTLE_MS = 300;

export const useFlyoutSettled = (state: SidebarFlyoutState) => {
  useEffect(() => {
    const timeout = window.setTimeout(flyoutSettled, FLYOUT_SETTLE_MS);
    return () => window.clearTimeout(timeout);
  }, [state]);
};
