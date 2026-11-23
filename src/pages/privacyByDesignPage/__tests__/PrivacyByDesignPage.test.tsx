import { screen, within } from '@testing-library/react';
import i18n from 'i18next';

import { commonContent } from '@/config/content';
import { PrivacyByDesignPage } from '@/pages/privacyByDesignPage/PrivacyByDesignPage';
import { renderWithProviders } from '@/test/renderWithProviders';

// Expected text is read from the locale files, so the tests survive copy changes.
const base = 'pages.privacyByDesignPage';
const route = '/privacy-by-design';

describe('PrivacyByDesignPage', () => {
    it('has one h1 and a localised document title', () => {
        renderWithProviders(<PrivacyByDesignPage />, { route });
        const t = i18n.getFixedT('en');

        expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
        expect(
            screen.getByRole('heading', { level: 1, name: t(`${base}.title`) }),
        ).toBeInTheDocument();
        expect(document.title).toBe(t('other.titles.privacyByDesign'));
    });

    it('links back to the project list', () => {
        renderWithProviders(<PrivacyByDesignPage />, { route });
        const t = i18n.getFixedT('en');

        expect(
            screen.getByRole('link', { name: t('shared.navigation.allProjects') }),
        ).toHaveAttribute('href', '/#projects');
    });

    it('lists its own items in the configured order, linking only those with a project page', () => {
        renderWithProviders(<PrivacyByDesignPage />, { route });
        const t = i18n.getFixedT('en');

        const where = within(screen.getByRole('region', { name: t(`${base}.whereLabel`) }));
        const { items } = commonContent.privacyByDesign;
        expect(where.getAllByRole('listitem')).toHaveLength(items.length);
        expect(where.queryAllByRole('link').map((link) => link.getAttribute('href'))).toEqual(
            items.flatMap((item) => (item.projectSlug ? [`/projects/${item.projectSlug}`] : [])),
        );
        const [firstItem] = items;
        expect(
            where.getByText(
                t(`${base}.protects`, { what: t(`${base}.items.${firstItem?.id}.what`) }),
            ),
        ).toBeInTheDocument();
    });

    it('shows the trade-off as what it costs and what it brings', () => {
        renderWithProviders(<PrivacyByDesignPage />, { route });
        const t = i18n.getFixedT('en');
        const costs = t(`${base}.tradeoff.costs`, { returnObjects: true }) as string[];
        const gets = t(`${base}.tradeoff.gets`, { returnObjects: true }) as string[];

        const tradeOff = within(screen.getByRole('region', { name: t(`${base}.tradeoff.title`) }));
        expect(tradeOff.getAllByRole('term').map((term) => term.textContent)).toEqual([
            t(`${base}.tradeoff.costLabel`),
            t(`${base}.tradeoff.getLabel`),
        ]);
        expect(
            tradeOff.getAllByRole('definition').map((definition) => definition.textContent),
        ).toEqual([...costs, ...gets]);
    });

    it('renders in Czech', () => {
        renderWithProviders(<PrivacyByDesignPage />, { route, language: 'cs' });
        const t = i18n.getFixedT('cs');
        const [firstItem] = commonContent.privacyByDesign.items;

        expect(
            screen.getByRole('heading', { level: 1, name: t(`${base}.title`) }),
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                t(`${base}.protects`, { what: t(`${base}.items.${firstItem?.id}.what`) }),
            ),
        ).toBeInTheDocument();
    });
});
