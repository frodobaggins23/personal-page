import type { ReactNode } from 'react';

import { WhoDidWhat } from '@/components/projectOverview/WhoDidWhat';
import { SectionLabel } from '@/components/sectionHeading/SectionLabel';

interface OverviewTextSection {
    id: string;
    title: string;
    text: string;
}

interface ProjectOverviewProps {
    idPrefix: string;
    sections: readonly OverviewTextSection[];
    whoDidWhat: {
        title: string;
        ai: { label: string; text: string };
        me: { label: string; text: string };
    };
    learned: { title: string; items: readonly string[] };
}

function OverviewSection({
    id,
    title,
    children,
    isLast = false,
}: {
    id: string;
    title: string;
    children: ReactNode;
    isLast?: boolean;
}) {
    return (
        <section
            aria-labelledby={id}
            className={`flex flex-col gap-2.5 border-t border-line py-8 lg:flex-row lg:flex-wrap lg:gap-x-18 lg:gap-y-3 lg:border-t-0 lg:py-9 ${
                isLast ? '' : 'lg:border-b'
            }`}
        >
            <SectionLabel as="h2" id={id} className="lg:flex-[1_1_220px] lg:pt-1.5">
                {title}
            </SectionLabel>
            <div className="min-w-0 lg:max-w-190 lg:flex-[999_1_520px]">{children}</div>
        </section>
    );
}

/** The "what / focus / in use / who did what / learned" sections of a project page. */
export function ProjectOverview({ idPrefix, sections, whoDidWhat, learned }: ProjectOverviewProps) {
    return (
        <div className="lg:flex lg:flex-col lg:pt-12 lg:pb-6">
            {sections.map((section) => (
                <OverviewSection
                    key={section.id}
                    id={`${idPrefix}-${section.id}`}
                    title={section.title}
                >
                    <p className="m-0 text-[1.0625rem] lg:text-xl">{section.text}</p>
                </OverviewSection>
            ))}
            <OverviewSection id={`${idPrefix}-who`} title={whoDidWhat.title}>
                <WhoDidWhat ai={whoDidWhat.ai} me={whoDidWhat.me} />
            </OverviewSection>
            <OverviewSection id={`${idPrefix}-learned`} title={learned.title} isLast>
                <ul className="m-0 flex list-none flex-col gap-3 p-0 text-base lg:gap-3.5 lg:text-lg">
                    {learned.items.map((item) => (
                        <li
                            key={item}
                            className="grid grid-cols-[20px_minmax(0,1fr)] gap-2 lg:grid-cols-[24px_minmax(0,1fr)]"
                        >
                            <span aria-hidden="true" className="font-mono text-accent-ink">
                                ›
                            </span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </OverviewSection>
        </div>
    );
}
