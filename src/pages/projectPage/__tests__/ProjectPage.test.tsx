import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router';

import { ProjectPage } from '@/pages/projectPage/ProjectPage';
import { renderWithProviders } from '@/test/renderWithProviders';

const renderRoute = (route: string, language: 'cs' | 'en' = 'en') =>
    renderWithProviders(
        <Routes>
            <Route path="/projects/:slug" element={<ProjectPage />} />
        </Routes>,
        { route, language },
    );

describe('ProjectPage', () => {
    it('renders the project with one h1 and the shared template sections', () => {
        renderRoute('/projects/moje-hory');

        expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
        expect(screen.getByRole('heading', { level: 1, name: 'Moje Hory' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 2, name: 'Who did what' })).toBeInTheDocument();
        expect(
            screen.getByRole('heading', { level: 2, name: 'What I learned' }),
        ).toBeInTheDocument();
    });

    it('links "Next" to the following project and wraps around after the last one', () => {
        renderRoute('/projects/moje-hory');
        expect(screen.getByRole('link', { name: /Next · 02 \/ 04/ })).toHaveAttribute(
            'href',
            '/projects/self-hosted',
        );
    });

    it('cycles from three-glasses back to moje-hory', () => {
        renderRoute('/projects/three-glasses');
        expect(screen.getByRole('link', { name: /Next · 01 \/ 04/ })).toHaveAttribute(
            'href',
            '/projects/moje-hory',
        );
    });

    it('spells out the years of experience in the lead', () => {
        renderRoute('/projects/moje-hory');
        expect(screen.getByText(/after \w+ years? of React/)).toBeInTheDocument();
    });

    it('uses the Czech "po" form in Czech', () => {
        renderRoute('/projects/moje-hory', 'cs');
        expect(screen.getByText(/po \S+ (letech|roce) s Reactem/)).toBeInTheDocument();
    });

    it('shows the 404 page for an unknown slug', () => {
        renderRoute('/projects/nope');
        expect(
            screen.getByRole('heading', { level: 1, name: 'Page not found' }),
        ).toBeInTheDocument();
    });
});
