import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import type { Language } from '@/utils/setLanguage';
import { applyLanguage, isLanguage } from '@/utils/setLanguage';

interface UseLanguage {
    language: Language;
    setLanguage: (language: Language) => void;
}

export function useLanguage(): UseLanguage {
    const { i18n } = useTranslation();
    const language = isLanguage(i18n.resolvedLanguage) ? i18n.resolvedLanguage : 'cs';

    const setLanguage = useCallback(
        (next: Language) => {
            applyLanguage(next, {
                storage: window.localStorage,
                changeLanguage: (value) => i18n.changeLanguage(value),
                root: document.documentElement,
            });
        },
        [i18n],
    );

    return { language, setLanguage };
}
