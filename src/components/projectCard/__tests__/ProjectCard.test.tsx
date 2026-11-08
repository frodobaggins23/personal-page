import { screen } from '@testing-library/react';

import { ProjectCard } from '@/components/projectCard/ProjectCard';
import { renderWithProviders } from '@/test/renderWithProviders';

describe('ProjectCard', () => {
    it('shows kind, title and summary from the locale file', () => {
        renderWithProviders(<ProjectCard slug="moje-hory" />);

        expect(screen.getByRole('heading', { level: 3, name: 'Moje Hory' })).toBeInTheDocument();
        expect(screen.getByText('01 · Angular app')).toBeInTheDocument();
    });

    it('has a "Read more" link whose name includes the project title', () => {
        renderWithProviders(<ProjectCard slug="moje-hory" />);

        const link = screen.getByRole('link', { name: 'Read more about Moje Hory' });
        expect(link).toHaveAttribute('href', '/projects/moje-hory');
    });

    it('translates the card', () => {
        renderWithProviders(<ProjectCard slug="three-glasses" />, { language: 'cs' });

        expect(
            screen.getByRole('link', { name: 'Více o projektu Three Glasses' }),
        ).toBeInTheDocument();
    });
});
