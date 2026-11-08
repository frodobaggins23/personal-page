import { numberToWords } from '@/utils/numberToWords';

describe('numberToWords', () => {
    it('spells English numbers', () => {
        expect(numberToWords(7, 'en')).toBe('seven');
        expect(numberToWords(20, 'en')).toBe('twenty');
    });

    it('spells Czech nominative numbers', () => {
        expect(numberToWords(7, 'cs')).toBe('sedm');
        expect(numberToWords(9, 'cs')).toBe('devět');
    });

    it('spells the Czech form used after "po"', () => {
        expect(numberToWords(7, 'cs', 'afterPo')).toBe('sedmi');
        expect(numberToWords(20, 'cs', 'afterPo')).toBe('dvaceti');
    });

    it('ignores the Czech form for English', () => {
        expect(numberToWords(7, 'en', 'afterPo')).toBe('seven');
    });

    it('returns digits outside 7–20', () => {
        expect(numberToWords(6, 'en')).toBe('6');
        expect(numberToWords(21, 'en')).toBe('21');
        expect(numberToWords(21, 'cs', 'afterPo')).toBe('21');
    });
});
