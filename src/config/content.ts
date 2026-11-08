import common from '@/locales/common.json';
import type { CommonContent, ProjectCommon, ProjectSlug } from '@/types/content';

export const commonContent = common as CommonContent;

export const projectSlugs: ProjectSlug[] = commonContent.projects.map((project) => project.slug);

export function findProject(slug: string | undefined): ProjectCommon | undefined {
    return commonContent.projects.find((project) => project.slug === slug);
}
