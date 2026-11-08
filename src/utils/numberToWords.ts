import type { Language } from '@/utils/setLanguage';

export type NumberForm = 'nominative' | 'afterPo';

const FIRST_SUPPORTED = 7;

const ENGLISH = [
    'seven',
    'eight',
    'nine',
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
    'twenty',
];

const CZECH_NOMINATIVE = [
    'sedm',
    'osm',
    'devět',
    'deset',
    'jedenáct',
    'dvanáct',
    'třináct',
    'čtrnáct',
    'patnáct',
    'šestnáct',
    'sedmnáct',
    'osmnáct',
    'devatenáct',
    'dvacet',
];

const CZECH_AFTER_PO = [
    'sedmi',
    'osmi',
    'devíti',
    'deseti',
    'jedenácti',
    'dvanácti',
    'třinácti',
    'čtrnácti',
    'patnácti',
    'šestnácti',
    'sedmnácti',
    'osmnácti',
    'devatenácti',
    'dvaceti',
];

/**
 * Spells out 7–20 for running text; other numbers come back as digits.
 * Czech has a separate form after the preposition "po" ("po sedmi letech").
 */
export function numberToWords(
    value: number,
    language: Language,
    form: NumberForm = 'nominative',
): string {
    const words =
        language === 'en' ? ENGLISH : form === 'afterPo' ? CZECH_AFTER_PO : CZECH_NOMINATIVE;

    return words[value - FIRST_SUPPORTED] ?? String(value);
}
