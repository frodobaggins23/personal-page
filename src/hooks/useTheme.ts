import { useCallback, useSyncExternalStore } from 'react';

import type { Theme } from '@/utils/setColorTheme';
import { applyTheme } from '@/utils/setColorTheme';

// <html data-theme> is the single source of truth (set by the no-flash script and applyTheme).
function subscribe(onChange: () => void): () => void {
    const observer = new MutationObserver(onChange);
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
}

function getSnapshot(): Theme {
    return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

function getServerSnapshot(): Theme {
    return 'dark';
}

interface UseTheme {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

export function useTheme(): UseTheme {
    const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    const setTheme = useCallback((next: Theme) => {
        applyTheme(next, { root: document.documentElement, storage: window.localStorage });
    }, []);

    return { theme, setTheme };
}
