import i18next from "i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from './resources/en.json'
import fr from './resources/fr.json'
import { appStarted } from "./store";
import { defaultLanguage, supportedLanguages } from "./constant";

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
    supportedLngs: supportedLanguages,
    detection: {
      order: ['navigator', 'localStorage', 'cookie'],
    },
    fallbackLng: defaultLanguage,
    debug: true
  })

// start app;
appStarted();