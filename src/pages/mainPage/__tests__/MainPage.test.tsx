import { screen, within } from '@testing-library/react';

import { MainPage } from '@/pages/mainPage/MainPage';
import { renderWithProviders } from '@/test/renderWithProviders';

const mockConfig = vi.hoisted(() => ({ isOpenToWork: true }));

vi.mock('@/config/siteConfig', () => ({
    IT_START_DATE: '01-2019',
    get IS_OPEN_TO_WORK() {
        return mockConfig.isOpenToWork;
    },
}));

describe('MainPage', () => {
    afterEach(() => {
        mockConfig.isOpenToWork = true;
    });

    it('has one h1 that reads as one phrase and the four sections in order', () => {
        renderWithProviders(<MainPage />);

        const h1 = screen.getByRole('heading', { level: 1 });
        expect(h1).toHaveTextContent(/^\d+\s*years? of React\./);
        const sections = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
        expect(sections).toEqual([
            expect.stringMatching(/shipping React to production/),
            'What I build beyond the day job.',
            'Before code, there was marketing.',
            "Let's talk.",
        ]);
    });

    it('lists the four projects in card order', () => {
        renderWithProviders(<MainPage />);

        const titles = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);
        expect(titles.slice(-4)).toEqual([
            'Moje Hory',
            'This site, self-hosted',
            'Rules for AI agents',
            'Three Glasses',
        ]);
    });

    it('wraps the project cards in the privacy and security perimeter', () => {
        renderWithProviders(<MainPage />);

        const perimeter = within(
            screen.getByRole('group', { name: 'Privacy and security, across all projects' }),
        );
        expect(perimeter.getAllByRole('article')).toHaveLength(4);
        expect(perimeter.getByRole('link', { name: /^privacy & security/ })).toHaveAttribute(
            'href',
            '/privacy-by-design',
        );
        // Mobile and desktop variants of the footer link; CSS shows one of them.
        const footerLinks = perimeter.getAllByRole('link', {
            name: /How I build with privacy in mind/,
        });
        expect(footerLinks).toHaveLength(2);
        footerLinks.forEach((link) => expect(link).toHaveAttribute('href', '/privacy-by-design'));
    });

    it('shows the availability badge when open to work', () => {
        renderWithProviders(<MainPage />);
        expect(screen.getByText(/Open to new roles/)).toBeInTheDocument();
    });

    it('hides the availability badge when not open to work', () => {
        mockConfig.isOpenToWork = false;
        renderWithProviders(<MainPage />);
        expect(screen.queryByText(/Open to new roles/)).not.toBeInTheDocument();
    });

    it('opens the photo overlay from the photo button', async () => {
        const { default: userEvent } = await import('@testing-library/user-event');
        renderWithProviders(<MainPage />);

        await userEvent.click(screen.getByRole('button', { name: 'Enlarge photo' }));

        expect(screen.getByRole('dialog', { name: 'Photo of Franta' })).toBeInTheDocument();
    });
});
