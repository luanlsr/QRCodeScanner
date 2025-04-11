import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./en.json";
import pt from "./pt.json";
import es from "./es.json";
import fr from "./fr.json";
import de from "./de.json";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            pt: { translation: pt },
            es: { translation: es },
            fr: { translation: fr },
            de: { translation: de },
        },
        fallbackLng: "pt",
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
