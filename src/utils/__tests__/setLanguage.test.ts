import { applyLanguage, resolveLanguage } from '@/utils/setLanguage';

describe('resolveLanguage', () => {
    it('prefers the saved language', () => {
        expect(resolveLanguage({ saved: 'en', browserLanguages: ['cs'] })).toBe('en');
    });

    it('ignores an unsupported saved value', () => {
        expect(resolveLanguage({ saved: 'de', browserLanguages: ['en-US'] })).toBe('en');
    });

    it('maps Czech and Slovak browsers to cs', () => {
        expect(resolveLanguage({ saved: null, browserLanguages: ['sk'] })).toBe('cs');
        expect(resolveLanguage({ saved: null, browserLanguages: ['cs-CZ'] })).toBe('cs');
    });

    it('maps any other browser language to en', () => {
        expect(resolveLanguage({ saved: null, browserLanguages: ['de-DE'] })).toBe('en');
    });

    it('uses the first browser language only', () => {
        expect(resolveLanguage({ saved: null, browserLanguages: ['de', 'cs'] })).toBe('en');
    });

    it('falls back to cs when nothing is known', () => {
        expect(resolveLanguage({ saved: null, browserLanguages: [] })).toBe('cs');
    });
});

describe('applyLanguage', () => {
    it('persists the choice, changes i18n and sets <html lang>', () => {
        const storage = { setItem: vi.fn() };
        const changeLanguage = vi.fn();
        const root = { lang: '' };

        applyLanguage('en', { storage, changeLanguage, root });

        expect(storage.setItem).toHaveBeenCalledWith('language', 'en');
        expect(changeLanguage).toHaveBeenCalledWith('en');
        expect(root.lang).toBe('en');
    });

    it('survives storage that throws', () => {
        const storage = {
            setItem: vi.fn(() => {
                throw new Error('denied');
            }),
        };
        const root = { lang: '' };

        expect(() => applyLanguage('cs', { storage, changeLanguage: vi.fn(), root })).not.toThrow();
        expect(root.lang).toBe('cs');
    });
});
