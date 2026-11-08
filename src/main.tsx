import '@fontsource-variable/ubuntu-sans';
import '@fontsource-variable/ubuntu-sans-mono';
import '@/styles/theme.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/App';
import { initLocalization } from '@/services/localizationService';
import { readSavedLanguage, resolveLanguage } from '@/utils/setLanguage';

function getStorage(): Storage | null {
    try {
        return window.localStorage;
    } catch {
        return null;
    }
}

const storage = getStorage();
const language = resolveLanguage({
    saved: storage ? readSavedLanguage(storage) : null,
    browserLanguages: navigator.languages,
});

// Detected language is applied but not persisted: only an explicit switch is remembered.
initLocalization(language);
document.documentElement.lang = language;

const root = document.getElementById('root');
if (!root) {
    throw new Error('Missing #root element.');
}

createRoot(root).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
