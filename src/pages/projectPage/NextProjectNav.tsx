import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import type { ProjectSlug } from '@/types/content';

interface NextProjectNavProps {
    nextSlug: ProjectSlug;
    position: { current: number; total: number };
}

const base = 'pages.projectPage';

/** Next project (cycles through all four) and a way back to the project list. */
export function NextProjectNav({ nextSlug, position }: NextProjectNavProps) {
    const { t } = useTranslation();
    const pad = (value: number): string => String(value).padStart(2, '0');

    return (
        <nav
            aria-label={t(`${base}.labels.moreProjects`)}
            className="flex flex-col gap-2.5 border-t border-line pt-8 pb-12 lg:flex-row lg:flex-wrap lg:gap-4 lg:border-t-0 lg:pt-8 lg:pb-24"
        >
            <Link
                to={`/projects/${nextSlug}`}
                className="flex flex-col gap-1.5 rounded-[18px] border border-card-border bg-surface p-5 text-fg no-underline shadow-card hover:text-fg lg:flex-[999_1_520px] lg:gap-2 lg:rounded-[22px] lg:px-8 lg:py-7"
            >
                <span className="font-mono text-label text-fg-subtle lg:text-[0.8125rem]">
                    {t(`${base}.labels.next`, {
                        current: pad(position.current),
                        total: pad(position.total),
                    })}
                </span>
                <span className="flex items-center justify-between gap-3 text-[1.375rem] font-bold lg:text-[2rem] lg:tracking-[-0.015em]">
                    {t(`${base}.projects.${nextSlug}.card.title`)}
                    <ArrowRight
                        strokeWidth={2.2}
                        aria-hidden="true"
                        className="size-5.5 flex-none text-accent-ink lg:size-7"
                    />
                </span>
            </Link>
            <Link
                to={{ pathname: '/', hash: '#projects' }}
                className="flex min-h-13 items-center justify-center rounded-btn border border-line font-semibold text-fg no-underline hover:text-fg lg:min-h-15 lg:flex-[1_1_240px] lg:rounded-[22px]"
            >
                {t(`${base}.labels.backToProjects`)}
            </Link>
        </nav>
    );
}
