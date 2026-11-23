import { screen } from '@testing-library/react';
import i18n from 'i18next';

import { ProjectCard } from '@/components/projectCard/ProjectCard';
import { renderWithProviders } from '@/test/renderWithProviders';

// Expected text is read from the locale files, so the tests survive copy changes.
const base = 'pages.projectPage.projects.moje-hory.card';

describe('ProjectCard', () => {
    it('shows kind, title and summary from the locale file', () => {
        renderWithProviders(<ProjectCard slug="moje-hory" />);
        const t = i18n.getFixedT('en');

        expect(
            screen.getByRole('heading', { level: 3, name: t(`${base}.title`) }),
        ).toBeInTheDocument();
        expect(screen.getByText(t(`${base}.kind`))).toBeInTheDocument();
        expect(screen.getByText(t(`${base}.summary`))).toBeInTheDocument();
    });

    it('has a "Read more" link whose name includes the project title', () => {
        renderWithProviders(<ProjectCard slug="moje-hory" />);
        const t = i18n.getFixedT('en');
        const title = t(`${base}.title`);

        const link = screen.getByRole('link', {
            name: (name) =>
                name.includes(t('shared.components.projectCard.readMoreAbout', { title })),
        });
        expect(link).toHaveAttribute('href', '/projects/moje-hory');
        expect(link).toHaveAccessibleName(expect.stringContaining(title));
    });

    it('translates the card', () => {
        renderWithProviders(<ProjectCard slug="three-glasses" />, { language: 'cs' });
        const t = i18n.getFixedT('cs');
        const title = t('pages.projectPage.projects.three-glasses.card.title');

        expect(
            screen.getByRole('link', {
                name: (name) =>
                    name.includes(t('shared.components.projectCard.readMoreAbout', { title })),
            }),
        ).toBeInTheDocument();
    });
});
