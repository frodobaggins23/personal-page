import type { ReactNode } from 'react';
import type { To } from 'react-router';
import { Link } from 'react-router';

import { getSafeExternalUrl } from '@/utils/getSafeExternalUrl';

type ButtonVariant = 'primary' | 'secondary' | 'ghost-in-card';

const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-accent font-bold text-on-accent hover:text-on-accent',
    secondary: 'border border-line font-semibold text-fg hover:text-fg',
    'ghost-in-card': 'bg-surface-2 font-semibold text-fg hover:text-fg',
};

interface ButtonLinkProps {
    variant: ButtonVariant;
    children: ReactNode;
    /** Internal navigation (router). */
    to?: To;
    /** External url; `[placeholder]` values render as "#". */
    href?: string;
    className?: string;
}

/** Link styled as a button. Every call to action on the site navigates, so it is an <a>. */
export function ButtonLink({ variant, children, to, href, className = '' }: ButtonLinkProps) {
    const classes = `flex items-center justify-center no-underline ${variantClasses[variant]} ${className}`;

    if (to !== undefined) {
        return (
            <Link to={to} className={classes}>
                {children}
            </Link>
        );
    }
    return (
        <a href={getSafeExternalUrl(href ?? '')} className={classes}>
            {children}
        </a>
    );
}
