import { ExternalLink } from '@/components/externalLink/ExternalLink';
import { StatusBadge } from '@/components/statusBadge/StatusBadge';

export interface ProjectFacts {
    type: { label: string; value: string };
    status: { label: string; tone: 'success' | 'warning'; value: string };
    stack: { label: string; value: string };
    links?: { label: string; items: readonly { label: string; href: string }[] };
}

const termClasses =
    'font-mono text-[0.71875rem] tracking-[0.06em] text-fg-subtle uppercase lg:text-label';
const cellClasses = 'flex flex-col gap-1 bg-bg px-4 py-3.5 lg:px-4.5 lg:py-4';

/** Definition list drawn as a grid; the 1 px gaps show the `line` background. */
export function FactsGrid({ facts }: { facts: ProjectFacts }) {
    return (
        <dl className="m-0 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:rounded-[18px]">
            <div className={cellClasses}>
                <dt className={termClasses}>{facts.type.label}</dt>
                <dd className="m-0 text-[0.9375rem] lg:text-base">{facts.type.value}</dd>
            </div>
            <div className={cellClasses}>
                <dt className={termClasses}>{facts.status.label}</dt>
                <dd className="m-0 text-[0.9375rem] lg:text-base">
                    <StatusBadge
                        tone={facts.status.tone}
                        label={facts.status.value}
                        className="gap-2"
                    />
                </dd>
            </div>
            <div className={`${cellClasses} col-span-full`}>
                <dt className={termClasses}>{facts.stack.label}</dt>
                <dd className="m-0 text-[0.9375rem] lg:text-base">{facts.stack.value}</dd>
            </div>
            {facts.links && facts.links.items.length > 0 && (
                <div className="col-span-full flex flex-col bg-bg px-2 py-1.5 lg:px-2.5 lg:py-2">
                    <dt className={`${termClasses} px-2 pt-2 pb-1`}>{facts.links.label}</dt>
                    <dd className="m-0 grid grid-cols-2 gap-1.5 pb-1">
                        {facts.links.items.map((item) => (
                            <ExternalLink
                                key={item.label}
                                href={item.href}
                                iconClassName="text-accent-ink"
                                className="flex min-h-11 items-center justify-between rounded-[10px] px-2.5 text-[0.9375rem] font-semibold no-underline lg:text-base"
                            >
                                {item.label}
                            </ExternalLink>
                        ))}
                    </dd>
                </div>
            )}
        </dl>
    );
}
