import { ArrowRight, Lock } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { ButtonLink } from '@/components/buttonLink/ButtonLink';

const base = 'pages.mainPage.projects.perimeter';
const PRIVACY_BY_DESIGN_PATH = '/privacy-by-design';

/**
 * Dashed frame around the project cards: privacy and security run through all of them,
 * they are not a fifth project. A tab on the top edge and a footer link lead to the page.
 */
export function SecurityPerimeter({ children }: { children: ReactNode }) {
    const { t } = useTranslation();
    const linkTitle = t(`${base}.linkTitle`);

    return (
        <div
            role="group"
            aria-label={t(`${base}.groupLabel`)}
            className="mt-2.5 flex flex-col gap-4 rounded-perimeter border-[1.5px] border-dashed border-perimeter px-3.5 pt-6.5 pb-3.5 lg:mt-0 lg:gap-6 lg:rounded-perimeter-lg lg:px-7 lg:pt-9 lg:pb-7"
        >
            {/*
             * The tab stays in the flow (not absolute), so a label that wraps at narrow widths or
             * high zoom pushes the cards down instead of covering them. The negative margins centre
             * the 44 px tab on the dashed border; its page background masks the line behind it.
             */}
            <Link
                to={PRIVACY_BY_DESIGN_PATH}
                className="-mt-12.25 -mb-2.75 flex max-w-full items-center gap-2 self-start bg-bg p-2.5 font-mono text-label leading-6 text-accent-ink no-underline lg:-mt-14.75 lg:-mb-2.25 lg:gap-2.5 lg:px-3 lg:py-2.25 lg:text-[0.8125rem] lg:leading-6.5"
            >
                <Lock
                    aria-hidden="true"
                    strokeWidth={2.2}
                    className="size-3.5 flex-none lg:size-3.75"
                />
                <span className="underline decoration-dotted decoration-[1.5px] underline-offset-5">
                    {t(`${base}.label`)}
                </span>
                <span className="text-fg-muted lg:hidden">{t(`${base}.scope`)}</span>
                <span className="hidden text-fg-muted lg:inline">{t(`${base}.scopeLong`)}</span>
                <ArrowRight aria-hidden="true" strokeWidth={2.4} className="size-3.25 flex-none" />
            </Link>
            {children}
            <Link
                to={PRIVACY_BY_DESIGN_PATH}
                className="flex min-h-13 items-center justify-between gap-3 px-1 pt-1 text-fg no-underline lg:hidden"
            >
                <span className="flex flex-col gap-0.5">
                    <span className="text-[0.9375rem] font-semibold">{linkTitle}</span>
                    <span className="text-[0.84375rem] text-fg-muted">
                        {t(`${base}.linkSubtitle`)}
                    </span>
                </span>
                <ArrowRight
                    size={18}
                    strokeWidth={2.2}
                    aria-hidden="true"
                    className="flex-none text-accent-ink"
                />
            </Link>
            <div className="hidden flex-wrap items-center justify-between gap-x-8 gap-y-3 px-2 pt-1 lg:flex">
                <p className="m-0 max-w-160 text-base text-fg-muted">{t(`${base}.body`)}</p>
                <ButtonLink
                    variant="ghost-in-card"
                    to={PRIVACY_BY_DESIGN_PATH}
                    className="min-h-12 gap-2.5 rounded-xl px-4.5"
                >
                    {linkTitle}
                    <ArrowRight
                        size={18}
                        strokeWidth={2.2}
                        aria-hidden="true"
                        className="flex-none text-accent-ink"
                    />
                </ButtonLink>
            </div>
        </div>
    );
}
