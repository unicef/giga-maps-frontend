import { createEvent, restore } from 'effector';

export const setMapLoadingState = createEvent<boolean>();
export const $isMapLoading = restore(setMapLoadingState, true);
