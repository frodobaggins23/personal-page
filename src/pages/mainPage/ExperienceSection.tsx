import { useTranslation } from 'react-i18next';

import { SectionHeading } from '@/components/sectionHeading/SectionHeading';
import { Timeline } from '@/components/timeline/Timeline';
import { TimelineItem } from '@/components/timeline/TimelineItem';
import { TimelinePrequel } from '@/components/timeline/TimelinePrequel';
import { commonContent } from '@/config/content';
import { useYearsOfPraxis } from '@/hooks/useYearsOfPraxis';

const base = 'pages.mainPage.experience';

export function ExperienceSection() {
    const { t } = useTranslation();
    const years = useYearsOfPraxis();
    const { jobs, before } = commonContent.experience;

    return (
        <section
            id="experience"
            aria-labelledby="experience-title"
            className="flex scroll-mt-18 flex-col gap-7 border-t border-line py-12 lg:flex-row lg:flex-wrap lg:gap-x-18 lg:gap-y-10 lg:py-22"
        >
            <SectionHeading
                label={t(`${base}.label`)}
                title={t(`${base}.title`, years)}
                titleId="experience-title"
                className="lg:flex-[1_1_280px] lg:self-start"
            />
            <div className="min-w-0 lg:flex-[999_1_560px]">
                <Timeline>
                    {jobs.map((job, index) => (
                        <TimelineItem
                            key={job.id}
                            variant={index === 0 ? 'current' : 'past'}
                            period={`${job.from} — ${job.to ?? t(`${base}.now`)}`}
                            company={job.company}
                            url={job.url}
                            role={t(`${base}.jobs.${job.id}.role`)}
                            summary={t(`${base}.jobs.${job.id}.summary`)}
                            stack={job.stack}
                        />
                    ))}
                    <TimelinePrequel
                        period={t(`${base}.before.period`, { year: before.year })}
                        title={t(`${base}.before.title`)}
                        summary={t(`${base}.before.summary`)}
                        linkLabel={t(`${base}.before.link`)}
                        linkTo={{ pathname: '/', hash: '#about' }}
                    />
                </Timeline>
            </div>
        </section>
    );
}
