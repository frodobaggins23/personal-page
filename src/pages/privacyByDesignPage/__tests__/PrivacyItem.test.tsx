import { screen } from '@testing-library/react';

import { PrivacyItem } from '@/pages/privacyByDesignPage/PrivacyItem';
import { renderWithProviders } from '@/test/renderWithProviders';

const renderItem = (href?: string) =>
    renderWithProviders(
        <ul>
            <PrivacyItem
                index="01"
                title="Some item"
                href={href}
                what="Something"
                body="How it is protected."
            />
        </ul>,
    );

describe('PrivacyItem', () => {
    it('links the title when the item has a page', () => {
        renderItem('/projects/moje-hory');

        expect(screen.getByRole('link', { name: 'Some item' })).toHaveAttribute(
            'href',
            '/projects/moje-hory',
        );
    });

    it('shows the title as plain text when the item has no page', () => {
        renderItem();

        expect(screen.queryByRole('link')).not.toBeInTheDocument();
        expect(screen.getByText('Some item')).toBeInTheDocument();
    });

    it('says what the item protects', () => {
        renderItem();

        expect(screen.getByText('Protects: Something')).toBeInTheDocument();
    });
});
