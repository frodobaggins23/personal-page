import type { ProjectFacts } from '@/components/projectHero/FactsGrid';
import { FactsGrid } from '@/components/projectHero/FactsGrid';
import { Prompt } from '@/components/prompt/Prompt';

interface ProjectHeroProps {
    titleId: string;
    prompt: { user: string; path: string; command: string };
    title: string;
    lead: string;
    facts: ProjectFacts;
}

/** Title block and facts for a project page. Same API for every project. */
export function ProjectHero({ titleId, prompt, title, lead, facts }: ProjectHeroProps) {
    return (
        <section
            aria-labelledby={titleId}
            className="flex flex-col gap-4 pt-9 pb-7 lg:flex-row lg:flex-wrap lg:items-end lg:gap-x-18 lg:gap-y-10 lg:pt-10 lg:pb-16"
        >
            <div className="flex min-w-0 flex-col gap-4 lg:flex-[999_1_520px] lg:gap-5 lg:self-center">
                <Prompt {...prompt} className="text-fg-subtle lg:hidden" />
                <h1
                    id={titleId}
                    tabIndex={-1}
                    className="m-0 text-[2.875rem] leading-none font-bold tracking-tight lg:text-[clamp(2.875rem,6.4vw,5.5rem)] lg:leading-[0.95] lg:tracking-[-0.03em]"
                >
                    {title}
                </h1>
                <p className="m-0 text-lg leading-normal text-fg-muted lg:max-w-155 lg:text-[1.375rem] lg:leading-[1.45]">
                    {lead}
                </p>
            </div>
            <div className="mt-1 lg:mt-0 lg:flex-[1_1_380px]">
                <FactsGrid facts={facts} />
            </div>
        </section>
    );
}
