import { createEvent, merge, sample } from 'effector';

import { fetchEntityGlobalStatsFx } from '~/api/project-connect';
import { landing } from '~/core/routes';

import { fetchLandingContentFx } from './landing.model';

// The router resolves `landing.visible` before this subscribes, so on a direct
// hit it never changes. A one-shot event covers that.
const onLoadPage = createEvent();

const onLandingVisible = sample({
  clock: merge([onLoadPage, landing.visible]),
  filter: Boolean,
  source: landing.visible,
});

sample({
  clock: onLandingVisible,
  target: fetchLandingContentFx,
});

sample({
  clock: onLandingVisible,
  fn: () => ({ query: '' }),
  target: fetchEntityGlobalStatsFx,
});

onLoadPage();
