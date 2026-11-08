interface StatusBadgeProps {
    tone: 'success' | 'warning';
    label: string;
    className?: string;
}

/** Colored dot plus text. The text always carries the meaning; the dot is decoration. */
export function StatusBadge({ tone, label, className = '' }: StatusBadgeProps) {
    const dotClasses =
        tone === 'success'
            ? 'bg-success shadow-[0_0_0_4px_color-mix(in_srgb,var(--success)_15%,transparent)]'
            : 'bg-warning';

    return (
        <span className={`flex items-center gap-2.5 ${className}`}>
            <span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${dotClasses}`} />
            <span>{label}</span>
        </span>
    );
}
