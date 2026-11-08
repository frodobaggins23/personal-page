import { useTranslation } from 'react-i18next';

import { ProjectCard } from '@/components/projectCard/ProjectCard';
import { SectionHeading } from '@/components/sectionHeading/SectionHeading';
import { projectSlugs } from '@/config/content';

const base = 'pages.mainPage.projects';

export function ProjectsSection() {
    const { t } = useTranslation();

    return (
        <section
            id="projects"
            aria-labelledby="projects-title"
            className="flex scroll-mt-18 flex-col gap-6 border-t border-line py-12 lg:gap-10 lg:py-22"
        >
            <div className="flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between lg:gap-x-12 lg:gap-y-4">
                <SectionHeading
                    label={t(`${base}.label`)}
                    title={t(`${base}.title`)}
                    titleId="projects-title"
                />
                <p className="m-0 text-[0.9375rem] text-fg-muted lg:max-w-95 lg:text-base">
                    {t(`${base}.intro`)}
                </p>
            </div>
            <ul className="m-0 grid list-none gap-6 p-0 grid-cols-[repeat(auto-fit,minmax(min(460px,100%),1fr))]">
                {projectSlugs.map((slug) => (
                    <li key={slug} className="flex">
                        <ProjectCard slug={slug} />
                    </li>
                ))}
            </ul>
        </section>
    );
}
