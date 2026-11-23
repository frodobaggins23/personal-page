import { screen, within } from '@testing-library/react';
import i18n from 'i18next';
import { Route, Routes } from 'react-router';

import { ProjectPage } from '@/pages/projectPage/ProjectPage';
import { renderWithProviders } from '@/test/renderWithProviders';

// Expected text is read from the locale files, so the tests survive copy changes.
const base = 'pages.projectPage';

const renderRoute = (route: string) =>
    renderWithProviders(
        <Routes>
            <Route path="/projects/:slug" element={<ProjectPage />} />
        </Routes>,
        { route, language: 'en' },
    );

const nextLinkName = (current: string, total: string) => (name: string) =>
    name.includes(i18n.getFixedT('en')(`${base}.labels.next`, { current, total }));

describe('ProjectPage', () => {
    it('renders the project with one h1 and the shared template sections', () => {
        renderRoute('/projects/moje-hory');
        const t = i18n.getFixedT('en');

        expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
        expect(
            screen.getByRole('heading', {
                level: 1,
                name: t(`${base}.projects.moje-hory.card.title`),
            }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('heading', {
                level: 2,
                name: t(`${base}.labels.sections.whoDidWhat`),
            }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('heading', { level: 2, name: t(`${base}.labels.sections.learned`) }),
        ).toBeInTheDocument();
    });

    it('shows the Moje Hory screenshots as images', () => {
        renderRoute('/projects/moje-hory');
        const t = i18n.getFixedT('en');

        const screens = within(screen.getByRole('list', { name: t(`${base}.labels.screens`) }));
        const images = screens.getAllByRole('img');
        expect(images).toHaveLength(3);
        images.forEach((image) =>
            expect(image).toHaveAttribute(
                'src',
                expect.stringMatching(/^\/images\/projects\/moje_hory_0[1-3]\.webp$/),
            ),
        );
    });

    it('links "Next" to the following project and wraps around after the last one', () => {
        renderRoute('/projects/moje-hory');
        expect(screen.getByRole('link', { name: nextLinkName('02', '04') })).toHaveAttribute(
            'href',
            '/projects/self-hosted',
        );
    });

    it('cycles from three-glasses back to moje-hory', () => {
        renderRoute('/projects/three-glasses');
        expect(screen.getByRole('link', { name: nextLinkName('01', '04') })).toHaveAttribute(
            'href',
            '/projects/moje-hory',
        );
    });

    it('shows the 404 page for an unknown slug', () => {
        renderRoute('/projects/nope');
        const t = i18n.getFixedT('en');

        expect(
            screen.getByRole('heading', { level: 1, name: t('pages.notFoundPage.title') }),
        ).toBeInTheDocument();
    });
});
