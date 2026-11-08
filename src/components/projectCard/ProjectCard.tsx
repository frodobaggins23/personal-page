import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { ImagePlaceholder } from '@/components/imagePlaceholder/ImagePlaceholder';
import { TerminalBlock } from '@/components/terminalBlock/TerminalBlock';
import { findProject } from '@/config/content';
import type { ProjectSlug } from '@/types/content';

interface ProjectCardProps {
    slug: ProjectSlug;
}

/** Card for the main page. Text comes from `pages.projectPage.projects.<slug>.card`. */
export function ProjectCard({ slug }: ProjectCardProps) {
    const { t } = useTranslation();
    const project = findProject(slug);
    if (!project) {
        return null;
    }

    const base = `pages.projectPage.projects.${slug}.card`;
    const title = t(`${base}.title`);
    const mediaLabel = t(`${base}.mediaLabel`);
    const { media } = project;

    return (
        <article className="flex w-full flex-col overflow-hidden rounded-card border border-card-border bg-surface shadow-card lg:rounded-card-lg">
            {media.kind === 'image' ? (
                <ImagePlaceholder
                    label={mediaLabel}
                    caption={t(`${base}.mediaCaption`)}
                    className="aspect-16/10 border-b border-line lg:aspect-video"
                />
            ) : (
                <TerminalBlock
                    lines={media.lines}
                    tone={media.tone}
                    label={mediaLabel}
                    className="border-b border-line px-4.5 pt-4.5 pb-4 lg:aspect-video lg:p-7"
                />
            )}
            <div className="flex flex-1 flex-col gap-2.5 p-5 lg:gap-3 lg:p-7">
                <div className="font-mono text-label text-fg-subtle lg:text-[0.8125rem]">
                    {t(`${base}.kind`)}
                </div>
                <h3 className="m-0 text-2xl leading-[1.15] font-bold lg:text-[1.75rem]">{title}</h3>
                <p className="m-0 flex-1 text-[0.9375rem] text-fg-muted lg:text-base">
                    {t(`${base}.summary`)}
                </p>
                <Link
                    to={`/projects/${slug}`}
                    className="mt-1.5 flex min-h-12 items-center justify-between rounded-xl bg-surface-2 px-4 font-semibold text-fg no-underline hover:text-fg lg:mt-2 lg:gap-2.5 lg:self-start lg:px-4.5"
                >
                    <span>
                        {`${t('shared.components.projectCard.readMore')} `}
                        <span className="sr-only">
                            {t('shared.components.projectCard.readMoreAbout', { title })}
                        </span>
                    </span>
                    <ArrowRight
                        size={18}
                        strokeWidth={2.2}
                        aria-hidden="true"
                        className="text-accent-ink"
                    />
                </Link>
            </div>
        </article>
    );
}
