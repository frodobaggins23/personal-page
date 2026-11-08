import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';

import { getSafeExternalUrl } from '@/utils/getSafeExternalUrl';

interface ExternalLinkProps {
    href: string;
    children: ReactNode;
    iconSize?: number;
    className?: string;
    iconClassName?: string;
}

/** Link to another site. Stays in the same tab; the arrow is decorative. */
export function ExternalLink({
    href,
    children,
    iconSize = 16,
    className = '',
    iconClassName = 'text-fg-subtle',
}: ExternalLinkProps) {
    return (
        <a href={getSafeExternalUrl(href)} className={className}>
            {children}
            <ArrowUpRight
                size={iconSize}
                strokeWidth={2.2}
                aria-hidden="true"
                className={iconClassName}
            />
        </a>
    );
}
