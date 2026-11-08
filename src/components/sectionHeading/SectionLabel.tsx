import type { ElementType, ReactNode } from 'react';

interface SectionLabelProps {
    children: ReactNode;
    as?: ElementType;
    id?: string;
    className?: string;
}

/** Mono, uppercase, orange label such as "01 / Experience". */
export function SectionLabel({ children, as, id, className = '' }: SectionLabelProps) {
    const Component: ElementType = as ?? 'div';
    return (
        <Component
            id={id}
            className={`font-mono text-label font-normal tracking-[0.08em] text-accent-ink uppercase lg:text-[0.8125rem] ${className}`}
        >
            {children}
        </Component>
    );
}
