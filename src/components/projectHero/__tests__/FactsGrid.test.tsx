import { render, screen } from '@testing-library/react';

import type { ProjectFacts } from '@/components/projectHero/FactsGrid';
import { FactsGrid } from '@/components/projectHero/FactsGrid';

const baseFacts: ProjectFacts = {
    type: { label: 'Type', value: 'Web' },
    status: { label: 'Status', tone: 'success', value: 'Live' },
    stack: { label: 'Stack', value: 'React' },
};

describe('FactsGrid', () => {
    it('renders the links when there are any', () => {
        render(
            <FactsGrid
                facts={{
                    ...baseFacts,
                    links: {
                        label: 'Links',
                        items: [{ label: 'Source', href: 'https://example.com' }],
                    },
                }}
            />,
        );

        expect(screen.getByText('Links')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Source/ })).toHaveAttribute(
            'href',
            'https://example.com',
        );
    });

    it('omits the links row when links are missing', () => {
        render(<FactsGrid facts={baseFacts} />);

        expect(screen.queryByRole('link')).not.toBeInTheDocument();
        expect(screen.queryByText('Links')).not.toBeInTheDocument();
    });

    it('omits the links row when the list is empty', () => {
        render(<FactsGrid facts={{ ...baseFacts, links: { label: 'Links', items: [] } }} />);

        expect(screen.queryByText('Links')).not.toBeInTheDocument();
    });
});
