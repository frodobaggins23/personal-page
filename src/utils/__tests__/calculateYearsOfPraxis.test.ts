import { calculateYearsOfPraxis } from '@/utils/calculateYearsOfPraxis';

const now = new Date('2026-11-08');

describe('calculateYearsOfPraxis', () => {
    it('counts full years since the start month', () => {
        expect(calculateYearsOfPraxis('01-2019', now)).toBe(7);
    });

    it('does not count a year that is not complete yet', () => {
        expect(calculateYearsOfPraxis('12-2019', now)).toBe(6);
    });

    it('counts the anniversary month as a full year', () => {
        expect(calculateYearsOfPraxis('11-2019', now)).toBe(7);
    });

    it('returns 0 within the first year', () => {
        expect(calculateYearsOfPraxis('03-2026', now)).toBe(0);
    });

    it.each(['13-2019', '00-2019', '2019', '1-2019', 'abc', ''])('throws for "%s"', (input) => {
        expect(() => calculateYearsOfPraxis(input, now)).toThrow(/mm-yyyy/i);
    });

    it('throws for a start date in the future', () => {
        expect(() => calculateYearsOfPraxis('12-2026', now)).toThrow(/future/i);
    });
});
