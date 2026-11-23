import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { LangSwitch } from '@/components/langSwitch/LangSwitch';
import { commonContent } from '@/config/content';
import { renderWithProviders } from '@/test/renderWithProviders';

// Names are read from the locale files, so the tests survive copy changes.
const czechName = commonContent.languages.cs.name;
const englishName = commonContent.languages.en.name;

describe('LangSwitch', () => {
    afterEach(() => {
        localStorage.clear();
        document.documentElement.lang = '';
    });

    it('names buttons by language and marks the active one as pressed', () => {
        renderWithProviders(<LangSwitch />, { language: 'cs' });

        expect(screen.getByRole('button', { name: czechName })).toHaveAttribute(
            'aria-pressed',
            'true',
        );
        expect(screen.getByRole('button', { name: englishName })).toHaveAttribute(
            'aria-pressed',
            'false',
        );
        expect(screen.getByRole('button', { name: czechName })).toHaveAttribute('lang', 'cs');
    });

    it('switches language, remembers it and updates <html lang>', async () => {
        renderWithProviders(<LangSwitch />, { language: 'cs' });

        await userEvent.click(screen.getByRole('button', { name: englishName }));

        expect(screen.getByRole('button', { name: englishName })).toHaveAttribute(
            'aria-pressed',
            'true',
        );
        expect(localStorage.getItem('language')).toBe('en');
        expect(document.documentElement.lang).toBe('en');
    });
});
