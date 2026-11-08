import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import common from '@/locales/common.json';
import cs from '@/locales/cs.json';
import en from '@/locales/en.json';
import type { Language } from '@/utils/setLanguage';

/** Sets up i18next with the bundled resources. Synchronous, so the first render is translated. */
export function initLocalization(language: Language): typeof i18n {
    void i18n.use(initReactI18next).init({
        lng: language,
        fallbackLng: 'cs',
        supportedLngs: ['cs', 'en'],
        ns: ['translation', 'common'],
        defaultNS: 'translation',
        resources: {
            cs: { translation: cs, common },
            en: { translation: en, common },
        },
        interpolation: { escapeValue: false },
        initAsync: false,
        returnNull: false,
    });

    // Used as {{value, capitalize}} when a spelled-out number starts a sentence.
    i18n.services.formatter?.add('capitalize', (value: unknown) => {
        const text = String(value);
        return text.charAt(0).toLocaleUpperCase() + text.slice(1);
    });

    return i18n;
}
