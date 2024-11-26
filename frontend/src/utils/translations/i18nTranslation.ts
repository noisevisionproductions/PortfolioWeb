import i18next from "i18next";
import {initReactI18next} from "react-i18next";
import {translations} from "./translations";

i18next
    .use(initReactI18next)
    .init({
        resources: {
            pl: {
                translations: translations.pl
            },
            en: {
                translations: translations.en
            }
        },
        lng: 'pl',
        fallbackLng: 'pl',
        defaultNS: 'translations',
        interpolation: {
            escapeValue: false
        }
    });

export default i18next;