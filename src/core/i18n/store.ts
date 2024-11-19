import i18next from 'i18next';
import { createStore, createEvent } from 'effector';
import { createI18nextIntegration } from '@withease/i18next';
import { languages } from './constant';

// Event that should be called after application initialization
export const appStarted = createEvent();

// Create Store for i18next instance
const $i18nextInstance = createStore(i18next);

export const languageStore = createI18nextIntegration({
  // Pass Store with i18next instance to the integration
  instance: $i18nextInstance,
  setup: appStarted,
});

export const $SelectedLngObj = languageStore.$language.map((lng) => languages.find((l) => l.code === lng));
export const onLanguageChange = languageStore.changeLanguageFx;