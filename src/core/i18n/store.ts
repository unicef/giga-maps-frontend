import i18next from 'i18next';
import { createStore, createEvent, fork, allSettled } from 'effector';
import { createI18nextIntegration } from '@withease/i18next';

// Event that should be called after application initialization
export const appStarted = createEvent();

// Create Store for i18next instance
const $i18nextInstance = createStore(i18next);

export const integration = createI18nextIntegration({
  // Pass Store with i18next instance to the integration
  instance: $i18nextInstance,
  setup: appStarted,
});

console.log(integration);