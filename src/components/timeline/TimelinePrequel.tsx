import { ArrowDown } from 'lucide-react';
import { Link } from 'react-router';

import { TimelineMarker } from '@/components/timeline/TimelineMarker';

interface TimelinePrequelProps {
    period: string;
    title: string;
    summary: string;
    linkLabel: string;
    linkTo: { pathname: string; hash: string };
}

/** The non-developer chapter before the first job: muted, dashed marker, no connecting line. */
export function TimelinePrequel({
    period,
    title,
    summary,
    linkLabel,
    linkTo,
}: TimelinePrequelProps) {
    return (
        <li className="grid grid-cols-[14px_minmax(0,1fr)] gap-x-4 gap-y-1.5 [grid-template-areas:'marker_period'_'marker_content'] lg:grid-cols-[130px_14px_minmax(0,1fr)] lg:gap-x-6 lg:gap-y-0 lg:[grid-template-areas:'period_marker_content']">
            <div className="font-mono text-label text-fg-subtle [grid-area:period] lg:pt-0.5 lg:text-right lg:text-[0.8125rem]">
                {period}
            </div>
            <TimelineMarker variant="prequel" hasLine={false} />
            <div className="flex flex-col gap-1.5 [grid-area:content]">
                <div className="text-base font-semibold text-fg-muted lg:text-lg">{title}</div>
                <p className="m-0 text-sm text-fg-subtle lg:text-[0.9375rem]">{summary}</p>
                <Link
                    to={linkTo}
                    className="inline-flex min-h-11 items-center gap-1.5 self-start text-sm text-fg-muted no-underline lg:text-[0.9375rem]"
                >
                    {linkLabel}
                    <ArrowDown
                        size={14}
                        strokeWidth={2.2}
                        aria-hidden="true"
                        className="text-accent-ink"
                    />
                </Link>
            </div>
        </li>
    );
}
