import { screen, within } from '@testing-library/react';
import i18n from 'i18next';

import { projectSlugs } from '@/config/content';
import { MainPage } from '@/pages/mainPage/MainPage';
import { renderWithProviders } from '@/test/renderWithProviders';
import { calculateYearsOfPraxis } from '@/utils/calculateYearsOfPraxis';
import { numberToWords } from '@/utils/numberToWords';

const mockConfig = vi.hoisted(() => ({ isOpenToWork: true }));

vi.mock('@/config/siteConfig', () => ({
    IT_START_DATE: '01-2019',
    get IS_OPEN_TO_WORK() {
        return mockConfig.isOpenToWork;
    },
}));

// Expected text is read from the locale files, so the tests survive copy changes.
const base = 'pages.mainPage';
const NOW = new Date('2026-06-15T12:00:00Z');

const yearsOfPraxis = () => {
    const count = calculateYearsOfPraxis('01-2019', NOW);
    return {
        count,
        yearsWord: numberToWords(count, 'en'),
        yearsWordAfterPo: numberToWords(count, 'en', 'afterPo'),
    };
};

describe('MainPage', () => {
    beforeEach(() => {
        // Only Date is faked: the years of praxis read the clock, user-event still needs timers.
        vi.useFakeTimers({ toFake: ['Date'] });
        vi.setSystemTime(NOW);
    });

    afterEach(() => {
        vi.useRealTimers();
        mockConfig.isOpenToWork = true;
    });

    it('has one h1 that reads as one phrase and the four sections in order', () => {
        renderWithProviders(<MainPage />);
        const t = i18n.getFixedT('en');
        const years = yearsOfPraxis();

        const h1 = screen.getByRole('heading', { level: 1 });
        expect(h1).toHaveTextContent(new RegExp(`^${years.count}\\D`));
        expect(h1).toHaveTextContent(
            `${t(`${base}.hero.titleLine1`, years)} ${t(`${base}.hero.titleLine2`)}`,
        );
        const sections = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
        expect(sections).toEqual([
            t(`${base}.experience.title`, years),
            t(`${base}.projects.title`),
            t(`${base}.about.title`),
            t(`${base}.contact.title`),
        ]);
    });

    it('lists the four projects in card order', () => {
        renderWithProviders(<MainPage />);
        const t = i18n.getFixedT('en');

        const titles = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);
        expect(projectSlugs).toEqual(['moje-hory', 'self-hosted', 'agent-rules', 'three-glasses']);
        expect(titles.slice(-4)).toEqual(
            projectSlugs.map((slug) => t(`pages.projectPage.projects.${slug}.card.title`)),
        );
    });

    it('wraps the project cards in the privacy and security perimeter', () => {
        renderWithProviders(<MainPage />);
        const t = i18n.getFixedT('en');
        const perimeterBase = `${base}.projects.perimeter`;

        const perimeter = within(
            screen.getByRole('group', { name: t(`${perimeterBase}.groupLabel`) }),
        );
        expect(perimeter.getAllByRole('article')).toHaveLength(4);
        expect(
            perimeter.getByRole('link', {
                name: (name) => name.startsWith(t(`${perimeterBase}.label`)),
            }),
        ).toHaveAttribute('href', '/privacy-by-design');
        // Mobile and desktop variants of the footer link; CSS shows one of them.
        const footerLinks = perimeter.getAllByRole('link', {
            name: (name) => name.includes(t(`${perimeterBase}.linkTitle`)),
        });
        expect(footerLinks).toHaveLength(2);
        footerLinks.forEach((link) => expect(link).toHaveAttribute('href', '/privacy-by-design'));
    });

    it('shows the availability badge when open to work', () => {
        renderWithProviders(<MainPage />);
        const t = i18n.getFixedT('en');

        expect(screen.getByText(t(`${base}.hero.availability.openToWork`))).toBeInTheDocument();
    });

    it('hides the availability badge when not open to work', () => {
        mockConfig.isOpenToWork = false;
        renderWithProviders(<MainPage />);
        const t = i18n.getFixedT('en');

        expect(
            screen.queryByText(t(`${base}.hero.availability.openToWork`)),
        ).not.toBeInTheDocument();
    });

    it('opens the photo overlay from the photo button', async () => {
        const { default: userEvent } = await import('@testing-library/user-event');
        renderWithProviders(<MainPage />);
        const t = i18n.getFixedT('en');

        await userEvent.click(
            screen.getByRole('button', { name: t(`${base}.about.photo.enlarge`) }),
        );

        expect(
            screen.getByRole('dialog', { name: t(`${base}.about.photo.dialogLabel`) }),
        ).toBeInTheDocument();
    });
});
