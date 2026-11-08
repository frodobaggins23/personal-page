interface WhoDidWhatProps {
    ai: { label: string; text: string };
    me: { label: string; text: string };
}

const rowClasses =
    'grid grid-cols-[3.25rem_minmax(0,1fr)] gap-3 p-4 lg:flex lg:flex-col lg:gap-2 lg:bg-inset lg:p-5.5';

/** AI / Me split. Stacked rows on mobile, two boxes from `lg`. No percentages on purpose. */
export function WhoDidWhat({ ai, me }: WhoDidWhatProps) {
    return (
        <dl className="m-0 flex flex-col divide-y divide-surface-2 overflow-hidden rounded-2xl border border-card-border bg-inset shadow-card lg:grid lg:max-w-190 lg:grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] lg:gap-px lg:divide-y-0 lg:rounded-[18px] lg:bg-surface-2 lg:shadow-none">
            <div className={rowClasses}>
                <dt className="pt-px font-mono text-[0.8125rem] text-path lg:pt-0 lg:text-sm">
                    {ai.label}
                </dt>
                <dd className="m-0 text-[0.9375rem] text-fg-muted lg:text-base">{ai.text}</dd>
            </div>
            <div className={rowClasses}>
                <dt className="pt-px font-mono text-[0.8125rem] text-accent-ink lg:pt-0 lg:text-sm">
                    {me.label}
                </dt>
                <dd className="m-0 text-[0.9375rem] lg:text-base">{me.text}</dd>
            </div>
        </dl>
    );
}
