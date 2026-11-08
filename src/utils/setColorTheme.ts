export type Theme = 'dark' | 'light';

// Must match the key used by the no-flash inline script in index.html.
export const THEME_STORAGE_KEY = 'theme';

export function isTheme(value: string | null | undefined): value is Theme {
    return value === 'dark' || value === 'light';
}

interface ResolveThemeInput {
    saved: string | null;
    prefersLight: boolean;
}

/** Saved choice → prefers-color-scheme → dark. */
export function resolveTheme({ saved, prefersLight }: ResolveThemeInput): Theme {
    if (isTheme(saved)) {
        return saved;
    }
    return prefersLight ? 'light' : 'dark';
}

interface ApplyThemeDeps {
    root: Pick<Element, 'setAttribute' | 'removeAttribute'>;
    storage: Pick<Storage, 'setItem'>;
}

/** Light = `data-theme="light"` on <html>; dark = no attribute. */
export function applyTheme(theme: Theme, { root, storage }: ApplyThemeDeps): void {
    if (theme === 'light') {
        root.setAttribute('data-theme', 'light');
    } else {
        root.removeAttribute('data-theme');
    }

    try {
        storage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
        console.warn('Could not persist the theme choice.', error);
    }
}

export function readSavedTheme(storage: Pick<Storage, 'getItem'>): string | null {
    try {
        return storage.getItem(THEME_STORAGE_KEY);
    } catch {
        return null;
    }
}
