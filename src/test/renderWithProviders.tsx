import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router';

import { initLocalization } from '@/services/localizationService';
import type { Language } from '@/utils/setLanguage';

interface Options {
    language?: Language;
    route?: string;
}

/** Renders with real translations and a memory router, so tests query by role and accessible name. */
export function renderWithProviders(
    ui: ReactElement,
    { language = 'en', route = '/' }: Options = {},
) {
    const i18n = initLocalization(language);
    void i18n.changeLanguage(language);
    return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
}
