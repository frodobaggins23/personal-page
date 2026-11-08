import { useTranslation } from 'react-i18next';

import { ExternalLink } from '@/components/externalLink/ExternalLink';
import { TagList } from '@/components/tagList/TagList';
import type { TimelineVariant } from '@/components/timeline/TimelineMarker';
import { TimelineMarker } from '@/components/timeline/TimelineMarker';

const itemGrid =
    "grid grid-cols-[14px_minmax(0,1fr)] gap-x-4 gap-y-2 [grid-template-areas:'marker_period'_'marker_content'] " +
    "lg:grid-cols-[130px_14px_minmax(0,1fr)] lg:gap-x-6 lg:gap-y-0 lg:[grid-template-areas:'period_marker_content']";

interface TimelineItemProps {
    period: string;
    company: string;
    url: string;
    role: string;
    summary: string;
    stack: readonly string[];
    variant: Exclude<TimelineVariant, 'prequel'>;
}

export function TimelineItem({
    period,
    company,
    url,
    role,
    summary,
    stack,
    variant,
}: TimelineItemProps) {
    const { t } = useTranslation();

    return (
        <li className={`${itemGrid} pb-7.5 lg:pb-10`}>
            <div className="font-mono text-[0.78125rem] text-fg-subtle [grid-area:period] lg:pt-0.75 lg:text-right lg:text-[0.84375rem]">
                {period}
            </div>
            <TimelineMarker variant={variant} hasLine />
            <div className="flex flex-col gap-2 [grid-area:content]">
                <h3 className="m-0 text-xl leading-[1.2] font-bold lg:text-2xl">
                    <ExternalLink
                        href={url}
                        iconSize={15}
                        className="inline-flex items-center gap-1.5 no-underline lg:gap-2"
                    >
                        {company}
                    </ExternalLink>
                </h3>
                <div className="text-[0.9375rem] lg:text-base">{role}</div>
                <p className="m-0 text-[0.9375rem] text-fg-muted lg:max-w-155 lg:text-base">
                    {summary}
                </p>
                <TagList
                    items={stack}
                    label={t('shared.components.timeline.stackLabel')}
                    size="sm"
                />
            </div>
        </li>
    );
}
