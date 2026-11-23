import { screen, within } from '@testing-library/react';

import { commonContent } from '@/config/content';
import { PrivacyByDesignPage } from '@/pages/privacyByDesignPage/PrivacyByDesignPage';
import { renderWithProviders } from '@/test/renderWithProviders';

describe('PrivacyByDesignPage', () => {
    it('has one h1 and a localised document title', () => {
        renderWithProviders(<PrivacyByDesignPage />, { route: '/privacy-by-design' });

        expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
        expect(
            screen.getByRole('heading', { level: 1, name: 'Privacy & security' }),
        ).toBeInTheDocument();
        expect(document.title).toBe('Privacy & security · Franta');
    });

    it('links back to the project list', () => {
        renderWithProviders(<PrivacyByDesignPage />, { route: '/privacy-by-design' });

        expect(screen.getByRole('link', { name: 'All projects' })).toHaveAttribute(
            'href',
            '/#projects',
        );
    });

    it('lists its own items in the configured order, linking only those with a project page', () => {
        renderWithProviders(<PrivacyByDesignPage />, { route: '/privacy-by-design' });

        const where = within(screen.getByRole('region', { name: 'Where it shows up' }));
        const { items } = commonContent.privacyByDesign;
        expect(where.getAllByRole('listitem')).toHaveLength(items.length);
        expect(where.queryAllByRole('link').map((link) => link.getAttribute('href'))).toEqual(
            items.flatMap((item) => (item.projectSlug ? [`/projects/${item.projectSlug}`] : [])),
        );
        expect(where.getByText('Protects: My hiking photos')).toBeInTheDocument();
    });

    it('shows the trade-off as what it costs and what it brings', () => {
        renderWithProviders(<PrivacyByDesignPage />, { route: '/privacy-by-design' });

        const tradeOff = within(
            screen.getByRole('region', { name: "It's slower. It's worth it." }),
        );
        expect(tradeOff.getAllByRole('term').map((term) => term.textContent)).toEqual([
            'What it costs',
            'What I get',
        ]);
        expect(tradeOff.getAllByRole('definition')).toHaveLength(6);
        expect(tradeOff.getByText('Data I control')).toBeInTheDocument();
    });

    it('renders in Czech', () => {
        renderWithProviders(<PrivacyByDesignPage />, {
            route: '/privacy-by-design',
            language: 'cs',
        });

        expect(
            screen.getByRole('heading', { level: 1, name: 'Soukromí a bezpečnost' }),
        ).toBeInTheDocument();
        expect(screen.getByText('Chrání: Moje fotky z túr')).toBeInTheDocument();
    });
});
