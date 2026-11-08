export type Language = 'cs' | 'en';

export const LANGUAGE_STORAGE_KEY = 'language';
export const DEFAULT_LANGUAGE: Language = 'cs';

const CZECH_SPEAKING_CODES = ['cs', 'sk'];

export function isLanguage(value: string | null | undefined): value is Language {
    return value === 'cs' || value === 'en';
}

interface ResolveLanguageInput {
    saved: string | null;
    browserLanguages: readonly string[];
}

/** Saved choice → browser language (cs/sk → cs, anything else → en) → cs. */
export function resolveLanguage({ saved, browserLanguages }: ResolveLanguageInput): Language {
    if (isLanguage(saved)) {
        return saved;
    }

    const [firstBrowserLanguage] = browserLanguages;
    if (!firstBrowserLanguage) {
        return DEFAULT_LANGUAGE;
    }

    const code = firstBrowserLanguage.toLowerCase().split('-')[0] ?? '';
    return CZECH_SPEAKING_CODES.includes(code) ? 'cs' : 'en';
}

interface ApplyLanguageDeps {
    storage: Pick<Storage, 'setItem'>;
    changeLanguage: (language: Language) => unknown;
    root: { lang: string };
}

export function applyLanguage(language: Language, deps: ApplyLanguageDeps): void {
    try {
        deps.storage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (error) {
        // Private mode or blocked storage: the choice just won't be remembered.
        console.warn('Could not persist the language choice.', error);
    }
    void deps.changeLanguage(language);
    deps.root.lang = language;
}

/** Reads the saved value, tolerating storage that throws. */
export function readSavedLanguage(storage: Pick<Storage, 'getItem'>): string | null {
    try {
        return storage.getItem(LANGUAGE_STORAGE_KEY);
    } catch {
        return null;
    }
}
