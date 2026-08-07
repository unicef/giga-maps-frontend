import { createEvent, createStore } from 'effector';

import { getLocalStorage, setLocalStorage } from '~/lib/utils';

/** Hard stop: three months after release. Delete this model once it passes. */
export const WELCOME_TOAST_END_DATE = new Date('2026-11-06T00:00:00Z');

export const WELCOME_TOAST_STORAGE_KEY = 'welcome-toast-dismissed';

export const dismissWelcomeToast = createEvent();

export const $isWelcomeToastDismissed = createStore(
  getLocalStorage(WELCOME_TOAST_STORAGE_KEY) === true,
).on(dismissWelcomeToast, () => true);

dismissWelcomeToast.watch(() => {
  setLocalStorage(WELCOME_TOAST_STORAGE_KEY, true);
});

/** Evaluated once per session. */
const isExpired = Date.now() >= WELCOME_TOAST_END_DATE.getTime();

export const $isWelcomeToastVisible = $isWelcomeToastDismissed.map(
  (isDismissed) => !isExpired && !isDismissed,
);
