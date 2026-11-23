import { applyTheme, resolveTheme } from '@/utils/setColorTheme';

describe('resolveTheme', () => {
    it('prefers the saved theme', () => {
        expect(resolveTheme({ saved: 'dark', prefersLight: true })).toBe('dark');
        expect(resolveTheme({ saved: 'light', prefersLight: false })).toBe('light');
    });

    it('ignores an invalid saved value', () => {
        expect(resolveTheme({ saved: 'blue', prefersLight: true })).toBe('light');
    });

    it('follows prefers-color-scheme without a saved value', () => {
        expect(resolveTheme({ saved: null, prefersLight: true })).toBe('light');
    });

    it('defaults to dark', () => {
        expect(resolveTheme({ saved: null, prefersLight: false })).toBe('dark');
    });
});

describe('applyTheme', () => {
    const makeRoot = () => {
        const attributes = new Map<string, string>();
        return {
            attributes,
            setAttribute: (name: string, value: string) => attributes.set(name, value),
            removeAttribute: (name: string) => attributes.delete(name),
        };
    };

    it('sets data-theme="light" for light and persists', () => {
        const root = makeRoot();
        const storage = { setItem: vi.fn() };

        applyTheme('light', { root, storage });

        expect(root.attributes.get('data-theme')).toBe('light');
        expect(storage.setItem).toHaveBeenCalledWith('theme', 'light');
    });

    it('removes the attribute for dark', () => {
        const root = makeRoot();
        root.attributes.set('data-theme', 'light');

        applyTheme('dark', { root, storage: { setItem: vi.fn() } });

        expect(root.attributes.has('data-theme')).toBe(false);
    });

    it('survives storage that throws', () => {
        const storage = {
            setItem: () => {
                throw new Error('denied');
            },
        };
        // The warning is expected here; spying keeps it out of the test output.
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

        expect(() => applyTheme('light', { root: makeRoot(), storage })).not.toThrow();
        expect(warn).toHaveBeenCalledWith('Could not persist the theme choice.', expect.any(Error));
        warn.mockRestore();
    });
});
