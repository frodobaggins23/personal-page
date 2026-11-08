import type { ContrastRow } from '@/services/contrastReportService';
import {
    compositeOver,
    contrastRatio,
    deriveVerdict,
    gradePair,
    parseColor,
    summarize,
    toHex,
} from '@/services/contrastReportService';

describe('parseColor', () => {
    it('parses 6-digit hex', () => {
        expect(parseColor('#EEF1F6')).toEqual({ r: 238, g: 241, b: 246, a: 1 });
    });

    it('parses rgb() with commas and with spaces/slash alpha', () => {
        expect(parseColor('rgb(15, 18, 25)')).toEqual({ r: 15, g: 18, b: 25, a: 1 });
        expect(parseColor('rgb(15 18 25 / 0.92)')).toEqual({ r: 15, g: 18, b: 25, a: 0.92 });
        expect(parseColor('rgba(15, 18, 25, 0.5)')).toEqual({ r: 15, g: 18, b: 25, a: 0.5 });
    });

    it('throws for anything it cannot parse', () => {
        expect(() => parseColor('banana')).toThrow(/color/i);
    });
});

describe('contrastRatio', () => {
    it('matches the WCAG reference values', () => {
        expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
        expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 5);
    });

    it('matches the blueprint report for body text on the dark ground', () => {
        expect(contrastRatio('#EEF1F6', '#0F1219')).toBeCloseTo(16.55, 1);
    });

    it('is symmetric', () => {
        expect(contrastRatio('#E95420', '#0F1219')).toBeCloseTo(
            contrastRatio('#0F1219', '#E95420'),
            10,
        );
    });
});

describe('compositeOver', () => {
    it('blends a translucent color over an opaque background', () => {
        const result = compositeOver(
            { r: 255, g: 255, b: 255, a: 0.5 },
            { r: 0, g: 0, b: 0, a: 1 },
        );
        expect(result).toEqual({ r: 128, g: 128, b: 128, a: 1 });
    });

    it('returns an opaque color unchanged', () => {
        const color = { r: 1, g: 2, b: 3, a: 1 };
        expect(compositeOver(color, { r: 9, g: 9, b: 9, a: 1 })).toEqual(color);
    });
});

describe('toHex', () => {
    it('formats upper-case hex', () => {
        expect(toHex({ r: 15, g: 18, b: 25, a: 1 })).toBe('#0F1219');
    });
});

describe('gradePair', () => {
    it('uses 4.5 / 7 for normal text', () => {
        expect(gradePair(4.5, 'text')).toEqual({ aa: 'pass', aaa: 'fail' });
        expect(gradePair(7, 'text')).toEqual({ aa: 'pass', aaa: 'pass' });
        expect(gradePair(4.49, 'text')).toEqual({ aa: 'fail', aaa: 'fail' });
    });

    it('uses 3 / 4.5 for large text', () => {
        expect(gradePair(3, 'large')).toEqual({ aa: 'pass', aaa: 'fail' });
        expect(gradePair(4.5, 'large')).toEqual({ aa: 'pass', aaa: 'pass' });
    });

    it('uses 3 and no AAA for UI parts', () => {
        expect(gradePair(3, 'ui')).toEqual({ aa: 'pass', aaa: 'notApplicable' });
        expect(gradePair(2.9, 'ui')).toEqual({ aa: 'fail', aaa: 'notApplicable' });
    });

    it('exempts decorative pairs', () => {
        expect(gradePair(1.2, 'decorative')).toEqual({ aa: 'exempt', aaa: 'notApplicable' });
    });
});

const makeRow = (overrides: Partial<ContrastRow>): ContrastRow => ({
    id: 'bodyText',
    theme: 'dark',
    kind: 'text',
    foreground: '#000000',
    background: '#FFFFFF',
    ratio: 21,
    aa: 'pass',
    aaa: 'pass',
    isBodyText: false,
    ...overrides,
});

describe('summarize', () => {
    it('excludes decorative pairs from the totals', () => {
        const rows = [
            makeRow({}),
            makeRow({ aaa: 'fail' }),
            makeRow({ kind: 'ui', aaa: 'notApplicable' }),
            makeRow({ kind: 'decorative', aa: 'exempt', aaa: 'notApplicable' }),
        ];

        expect(summarize(rows)).toEqual({ total: 3, aaPassed: 3, aaaPassed: 1, aaaEligible: 2 });
    });
});

describe('deriveVerdict', () => {
    it('reports all-pass and body AAA', () => {
        expect(deriveVerdict([makeRow({ isBodyText: true })])).toEqual({
            isAaMetEverywhere: true,
            isBodyTextAaa: true,
            pairsMissingAaa: [],
        });
    });

    it('lists distinct usages that miss AAA, in order, and flags AA failures', () => {
        const rows = [
            makeRow({ id: 'sectionLabels', aaa: 'fail' }),
            makeRow({ id: 'sectionLabels', theme: 'light', aaa: 'fail' }),
            makeRow({ id: 'metaLabels', aa: 'fail', aaa: 'fail' }),
            makeRow({ id: 'bodyText', isBodyText: true, aaa: 'fail' }),
        ];

        expect(deriveVerdict(rows)).toEqual({
            isAaMetEverywhere: false,
            isBodyTextAaa: false,
            pairsMissingAaa: ['sectionLabels', 'metaLabels', 'bodyText'],
        });
    });
});
