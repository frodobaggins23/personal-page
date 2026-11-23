import { SectionLabel } from '@/components/sectionHeading/SectionLabel';

interface TradeOffColumn {
    label: string;
    items: readonly string[];
}

interface TradeOffProps {
    label: string;
    title: string;
    titleId: string;
    costs: TradeOffColumn;
    gets: TradeOffColumn;
}

const cellClasses = 'flex flex-col gap-1.5 bg-bg p-4 lg:gap-2.5 lg:p-7';
const termClasses =
    'mb-0.5 font-mono text-label tracking-[0.06em] uppercase lg:mb-1 lg:text-[0.8125rem]';
const definitionClasses = 'm-0 text-[0.90625rem] lg:text-lg';

/** "What it costs / What I get" as a two-column definition list; the 1 px gaps show `line`. */
export function TradeOff({ label, title, titleId, costs, gets }: TradeOffProps) {
    const columns = [
        { ...costs, termColor: 'text-fg-muted' },
        { ...gets, termColor: 'text-accent-ink' },
    ];

    return (
        <section
            aria-labelledby={titleId}
            className="flex flex-col gap-3.5 border-t border-line pt-8 pb-10 lg:flex-row lg:flex-wrap lg:gap-x-18 lg:gap-y-6 lg:border-t-0 lg:pt-14 lg:pb-26"
        >
            <div className="flex flex-col gap-3.5 lg:flex-[1_1_260px] lg:gap-3">
                <SectionLabel as="h2" className="m-0">
                    {label}
                </SectionLabel>
                <h3
                    id={titleId}
                    className="m-0 text-[1.625rem] leading-[1.15] font-bold tracking-[-0.015em] lg:text-[2.5rem] lg:leading-[1.05] lg:tracking-[-0.02em]"
                >
                    {title}
                </h3>
            </div>
            <dl className="m-0 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:max-w-180 lg:flex-[999_1_520px] lg:rounded-card">
                {columns.map((column) => (
                    <div key={column.label} className={cellClasses}>
                        <dt className={`${termClasses} ${column.termColor}`}>{column.label}</dt>
                        {column.items.map((item) => (
                            <dd key={item} className={definitionClasses}>
                                {item}
                            </dd>
                        ))}
                    </div>
                ))}
            </dl>
        </section>
    );
}
