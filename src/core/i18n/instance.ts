import i18next from "i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { appStarted } from "./store";
import { defaultLanguage, supportedLanguages } from "./constant";
import resources from "./resources";

i18next
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(I18nextBrowserLanguageDetector)
  .init({
    resources: Object.keys(resources).reduce((curr, key) => {
      curr[key] = { translation: resources[key] };
      return curr;
    }, {} as any),
    supportedLngs: supportedLanguages,
    detection: {
      order: ['localStorage', 'navigator'],
      excludeCacheFor: ['localStorage'],
    },
    fallbackLng: defaultLanguage,
    debug: false
  })

// start app;
appStarted();