import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import detector from "i18next-browser-languagedetector";
import en from "./assets/i18n/en.json";
import vn from "./assets/i18n/vi.json";

// the translations
const resources = {
  en: {
    translation: en,
  },
  vn: {
    translation: vn,
  },
};

i18n
  .use(detector) // passes i18n down to react-i18next
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: Object.keys(resources),
    lng: "vn",
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
