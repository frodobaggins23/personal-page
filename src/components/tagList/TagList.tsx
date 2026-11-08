interface TagListProps {
    items: readonly string[];
    label: string;
    size: 'md' | 'sm';
}

const itemClasses = {
    md: 'rounded-tag border border-line px-2.5 py-1.5 text-[0.78125rem] lg:px-2.75 lg:text-[0.8125rem]',
    sm: 'rounded-[5px] bg-chip px-1.75 py-0.5 text-[0.71875rem] text-fg-muted lg:px-2 lg:py-0.75 lg:text-label',
} as const;

const listClasses = {
    md: 'gap-2',
    sm: 'mt-0.5 gap-1.25 lg:mt-1 lg:gap-1.5',
} as const;

export function TagList({ items, label, size }: TagListProps) {
    return (
        <ul
            aria-label={label}
            className={`m-0 flex list-none flex-wrap p-0 font-mono ${listClasses[size]}`}
        >
            {items.map((item, index) => (
                // Placeholder tags repeat ("[tech]"), so the index is part of the key.
                <li key={`${item}-${index}`} className={itemClasses[size]}>
                    {item}
                </li>
            ))}
        </ul>
    );
}
