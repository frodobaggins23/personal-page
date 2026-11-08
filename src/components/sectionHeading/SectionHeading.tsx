import type { ReactNode } from 'react';

import { SectionLabel } from '@/components/sectionHeading/SectionLabel';

interface SectionHeadingProps {
    label: string;
    title: string;
    titleId: string;
    /** Optional text under the title (mobile) / beside it (desktop layouts place it themselves). */
    children?: ReactNode;
    className?: string;
}

export function SectionHeading({
    label,
    title,
    titleId,
    children,
    className = '',
}: SectionHeadingProps) {
    return (
        <div className={`flex flex-col gap-2 lg:gap-3 ${className}`}>
            <SectionLabel>{label}</SectionLabel>
            <h2
                id={titleId}
                className="text-section m-0 font-bold tracking-[-0.015em] lg:tracking-[-0.02em]"
            >
                {title}
            </h2>
            {children}
        </div>
    );
}
