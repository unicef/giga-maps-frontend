import { createEvent, merge, sample } from 'effector';

import { fetchEntityGlobalStatsFx } from '~/api/project-connect';
import { aboutus } from '~/core/routes';

import { fetchLandingContentFx } from './landing.model';

// The router resolves `aboutus.visible` before this subscribes, so on a direct
// hit it never changes. A one-shot event covers that.
const onLoadPage = createEvent();

const onLandingVisible = sample({
  clock: merge([onLoadPage, aboutus.visible]),
  filter: Boolean,
  source: aboutus.visible,
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
