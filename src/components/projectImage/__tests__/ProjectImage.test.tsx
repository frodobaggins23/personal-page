import { render, screen } from '@testing-library/react';

import { ProjectImage } from '@/components/projectImage/ProjectImage';

describe('ProjectImage', () => {
    it('renders an image with its accessible name and intrinsic size', () => {
        render(<ProjectImage src="/images/a.webp" alt="Home screen" width={396} height={851} />);

        const image = screen.getByRole('img', { name: 'Home screen' });
        expect(image).toHaveAttribute('src', '/images/a.webp');
        expect(image).toHaveAttribute('width', '396');
        expect(image).toHaveAttribute('height', '851');
    });

    it('loads lazily and decodes asynchronously', () => {
        render(<ProjectImage src="/images/a.webp" alt="Home screen" width={396} height={851} />);

        const image = screen.getByRole('img', { name: 'Home screen' });
        expect(image).toHaveAttribute('loading', 'lazy');
        expect(image).toHaveAttribute('decoding', 'async');
    });

    it('applies the given class name', () => {
        render(
            <ProjectImage
                src="/images/a.webp"
                alt="Home screen"
                width={396}
                height={851}
                className="rounded-panel"
            />,
        );

        expect(screen.getByRole('img', { name: 'Home screen' })).toHaveClass('rounded-panel');
    });
});
