import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

import { Overlay } from '@/components/overlay/Overlay';

function Harness() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <button type="button" onClick={() => setIsOpen(true)}>
                Open
            </button>
            <Overlay
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                label="Photo"
                closeLabel="Close"
            >
                <p>Content</p>
            </Overlay>
        </>
    );
}

describe('Overlay', () => {
    it('renders nothing while closed', () => {
        render(<Harness />);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('opens as a named modal dialog with focus on the close button', async () => {
        render(<Harness />);
        await userEvent.click(screen.getByRole('button', { name: 'Open' }));

        const dialog = screen.getByRole('dialog', { name: 'Photo' });
        expect(dialog).toHaveAttribute('aria-modal', 'true');
        expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
    });

    it('closes on Escape and returns focus to the opener', async () => {
        render(<Harness />);
        const opener = screen.getByRole('button', { name: 'Open' });
        await userEvent.click(opener);
        await userEvent.keyboard('{Escape}');

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(opener).toHaveFocus();
    });

    it('keeps focus inside while open and locks background scroll', async () => {
        render(<Harness />);
        await userEvent.click(screen.getByRole('button', { name: 'Open' }));
        expect(document.body.style.overflow).toBe('hidden');

        await userEvent.tab();
        expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();

        await userEvent.keyboard('{Escape}');
        expect(document.body.style.overflow).toBe('');
    });
});
