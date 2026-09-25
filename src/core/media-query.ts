import { getInverted } from '~/lib/effector-kit';
import { createMediaMatcher } from '~/lib/media-query';

const mobileMediaQuery = '(max-width: 768px)';
const tabletMediaQuery = '(max-width: 996px)';

export const $isMobile = createMediaMatcher(mobileMediaQuery);
export const $isTablet = createMediaMatcher(tabletMediaQuery);
export const $isDesktop = $isMobile.map(getInverted);

// $isMobile starts inverted until a setTimeout, so init-time defaults read this.
export const isMobileViewport = () =>
  window.matchMedia(mobileMediaQuery).matches;
