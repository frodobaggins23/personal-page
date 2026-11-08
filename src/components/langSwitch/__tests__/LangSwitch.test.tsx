import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { LangSwitch } from '@/components/langSwitch/LangSwitch';
import { renderWithProviders } from '@/test/renderWithProviders';

describe('LangSwitch', () => {
    afterEach(() => {
        localStorage.clear();
        document.documentElement.lang = '';
    });

    it('names buttons by language and marks the active one as pressed', () => {
        renderWithProviders(<LangSwitch />, { language: 'cs' });

        expect(screen.getByRole('button', { name: 'Čeština' })).toHaveAttribute(
            'aria-pressed',
            'true',
        );
        expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute(
            'aria-pressed',
            'false',
        );
        expect(screen.getByRole('button', { name: 'Čeština' })).toHaveAttribute('lang', 'cs');
    });

    it('switches language, remembers it and updates <html lang>', async () => {
        renderWithProviders(<LangSwitch />, { language: 'cs' });

        await userEvent.click(screen.getByRole('button', { name: 'English' }));

        expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute(
            'aria-pressed',
            'true',
        );
        expect(localStorage.getItem('language')).toBe('en');
        expect(document.documentElement.lang).toBe('en');
    });
});
