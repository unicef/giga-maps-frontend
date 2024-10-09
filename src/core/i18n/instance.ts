import i18next from "i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from './resources/en.json'
import fr from './resources/fr.json'
import { appStarted } from "./store";
// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: en
  },
  fr: {
    translation: fr
  }
};

export const i18n = i18next
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(I18nextBrowserLanguageDetector)
  .init({
    resources,
    supportedLngs: ['de', 'en', 'fr'],
    detection: {
      order: ['navigator', 'localStorage', 'cookie'],
    },
    fallbackLng: 'en',
    debug: true
  })

// start app;
appStarted();