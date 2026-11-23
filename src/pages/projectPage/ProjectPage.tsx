import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import { BackToProjectsLink } from '@/components/backToProjectsLink/BackToProjectsLink';
import { Container } from '@/components/container/Container';
import { ProjectHero } from '@/components/projectHero/ProjectHero';
import { ProjectOverview } from '@/components/projectOverview/ProjectOverview';
import { ProjectScreens } from '@/components/projectScreens/ProjectScreens';
import { commonContent, findProject } from '@/config/content';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { NotFoundPage } from '@/pages/notFoundPage/NotFoundPage';
import { NextProjectNav } from '@/pages/projectPage/NextProjectNav';

const base = 'pages.projectPage';

export function ProjectPage() {
    const { slug } = useParams();
    const project = findProject(slug);
    return project ? <ProjectContent slug={project.slug} /> : <NotFoundPage />;
}

function ProjectContent({ slug }: { slug: string }) {
    const { t } = useTranslation();
    const { projects } = commonContent;
    const index = projects.findIndex((project) => project.slug === slug);
    const project = projects[index];
    const next = projects[(index + 1) % projects.length];

    const detail = `${base}.projects.${slug}.detail`;
    const title = t(`${base}.projects.${slug}.card.title`);
    useDocumentTitle(t('other.titles.project', { title }));

    if (!project || !next) {
        return null;
    }

    const screens = (
        t(`${detail}.screens`, { returnObjects: true }) as { caption: string; label: string }[]
    ).map((screen, screenIndex) => ({ ...screen, src: project.screens?.[screenIndex] }));
    const learned = t(`${detail}.learned`, { returnObjects: true }) as string[];

    const linkItems = [
        { label: t(`${base}.labels.links.demo`), href: project.links.demo },
        { label: t(`${base}.labels.links.source`), href: project.links.source },
    ].filter((item): item is { label: string; href: string } => item.href !== undefined);

    return (
        <Container>
            <BackToProjectsLink />
            <ProjectHero
                titleId="project-title"
                prompt={{
                    user: commonContent.brand.promptUser,
                    path: commonContent.brand.projectsPath,
                    command: t(`${detail}.prompt`),
                }}
                title={title}
                lead={t(`${detail}.lead`)}
                facts={{
                    type: { label: t(`${base}.labels.fields.type`), value: t(`${detail}.type`) },
                    status: {
                        label: t(`${base}.labels.fields.status`),
                        tone: project.status === 'done' ? 'success' : 'warning',
                        value: t(`${base}.labels.status.${project.status}`),
                    },
                    stack: {
                        label: t(`${base}.labels.fields.stack`),
                        value: project.stack.join(' · '),
                    },
                    links: {
                        label: t(`${base}.labels.fields.links`),
                        items: linkItems,
                    },
                }}
            />
            <ProjectScreens screens={screens} groupLabel={t(`${base}.labels.screens`)} />
            <ProjectOverview
                idPrefix="overview"
                sections={[
                    {
                        id: 'what',
                        title: t(`${base}.labels.sections.whatItIs`),
                        text: t(`${detail}.whatItIs`),
                    },
                    {
                        id: 'focus',
                        title: t(`${base}.labels.sections.focus`),
                        text: t(`${detail}.focus`),
                    },
                    {
                        id: 'use',
                        title: t(`${base}.labels.sections.inUse`),
                        text: t(`${detail}.inUse`),
                    },
                ]}
                whoDidWhat={{
                    title: t(`${base}.labels.sections.whoDidWhat`),
                    ai: { label: t(`${base}.labels.roles.ai`), text: t(`${detail}.ai`) },
                    me: { label: t(`${base}.labels.roles.me`), text: t(`${detail}.me`) },
                }}
                learned={{ title: t(`${base}.labels.sections.learned`), items: learned }}
            />
            <NextProjectNav
                nextSlug={next.slug}
                position={{ current: ((index + 1) % projects.length) + 1, total: projects.length }}
            />
        </Container>
    );
}
