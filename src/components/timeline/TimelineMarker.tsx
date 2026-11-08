export type TimelineVariant = 'current' | 'past' | 'prequel';

const dotClasses: Record<TimelineVariant, string> = {
    current: 'mt-1.5 size-2.75 bg-accent lg:mt-1.75 lg:size-3',
    past: 'mt-1.5 size-2.75 box-border border-2 border-fg-muted lg:mt-1.75 lg:size-3',
    prequel:
        'mt-1.25 size-2.75 box-border border-[1.5px] border-dashed border-fg-subtle lg:mt-1.5 lg:size-3',
};

/** Dot and connecting line. Purely visual: the period text tells "now" vs "past". */
export function TimelineMarker({
    variant,
    hasLine,
}: {
    variant: TimelineVariant;
    hasLine: boolean;
}) {
    return (
        <div className="flex flex-col items-center [grid-area:marker]">
            <span aria-hidden="true" className={`rounded-full ${dotClasses[variant]}`} />
            {hasLine ? <span aria-hidden="true" className="mt-1.5 w-px flex-1 bg-line" /> : null}
        </div>
    );
}
