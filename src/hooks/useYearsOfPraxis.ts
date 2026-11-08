import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { IT_START_DATE } from '@/config/siteConfig';
import { calculateYearsOfPraxis } from '@/utils/calculateYearsOfPraxis';
import { numberToWords } from '@/utils/numberToWords';
import { isLanguage } from '@/utils/setLanguage';

// A type alias (not an interface) so it is assignable to i18next option objects.
type YearsOfPraxis = {
    /** Drives i18next plurals, and is the digit shown in the hero numeral. */
    count: number;
    yearsWord: string;
    yearsWordAfterPo: string;
};

/** Interpolation values for every string that mentions the years of experience. */
export function useYearsOfPraxis(): YearsOfPraxis {
    const { i18n } = useTranslation();
    const language = isLanguage(i18n.resolvedLanguage) ? i18n.resolvedLanguage : 'cs';

    return useMemo(() => {
        const count = calculateYearsOfPraxis(IT_START_DATE, new Date());
        return {
            count,
            yearsWord: numberToWords(count, language),
            yearsWordAfterPo: numberToWords(count, language, 'afterPo'),
        };
    }, [language]);
}
