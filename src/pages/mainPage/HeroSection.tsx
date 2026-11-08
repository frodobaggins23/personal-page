import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { ButtonLink } from '@/components/buttonLink/ButtonLink';
import { Prompt } from '@/components/prompt/Prompt';
import { StatusBadge } from '@/components/statusBadge/StatusBadge';
import { TagList } from '@/components/tagList/TagList';
import { commonContent } from '@/config/content';
import { IS_OPEN_TO_WORK } from '@/config/siteConfig';
import { useYearsOfPraxis } from '@/hooks/useYearsOfPraxis';

const base = 'pages.mainPage.hero';

export function HeroSection() {
    const { t } = useTranslation();
    const years = useYearsOfPraxis();

    return (
        <section
            aria-labelledby="hero-title"
            className="grid items-end gap-6 pt-10 pb-14 grid-cols-[repeat(auto-fit,minmax(min(460px,100%),1fr))] lg:gap-x-18 lg:gap-y-14 lg:pt-24 lg:pb-28"
        >
            <div className="flex flex-col gap-6 lg:gap-9 lg:self-center">
                <Prompt
                    user={commonContent.brand.promptUser}
                    path="~"
                    command={t(`${base}.prompt`)}
                    output={t(`${base}.promptOutput`)}
                    className="lg:hidden"
                />
                <h1
                    id="hero-title"
                    tabIndex={-1}
                    className="m-0 flex items-end gap-6 font-bold tracking-[-0.02em] lg:gap-[clamp(1.5rem,3vw,2.5rem)]"
                >
                    <span className="text-numeral flex-none font-extrabold tracking-[-0.06em] text-accent">
                        {years.count}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-2.5 pb-0.5 lg:gap-4 lg:pb-1">
                        <span className="text-hero">
                            {t(`${base}.titleLine1`, years)}
                            <br aria-hidden="true" /> {t(`${base}.titleLine2`)}
                        </span>
                        <span className="text-hero-sub font-medium tracking-[-0.005em] text-fg-muted">
                            {t(`${base}.subtitle`)}
                        </span>
                    </span>
                </h1>
                <p className="m-0 hidden items-center gap-3 font-mono text-[0.9375rem] text-fg-muted lg:flex">
                    <span aria-hidden="true" className="h-px w-8 bg-line" />
                    {t(`${base}.role`)}
                </p>
            </div>
            <div className="flex flex-col gap-6 lg:max-w-120">
                <p className="m-0 max-w-140 text-[1.0625rem] text-fg-muted lg:max-w-none lg:text-[1.1875rem]">
                    {t(`${base}.lead`)}
                </p>
                {IS_OPEN_TO_WORK ? (
                    <StatusBadge
                        tone="success"
                        label={t(`${base}.availability.openToWork`)}
                        className="font-mono text-[0.8125rem] lg:text-sm"
                    />
                ) : null}
                <ButtonLink
                    variant="primary"
                    to={{ pathname: '/', hash: '#contact' }}
                    className="min-h-13 rounded-btn px-5 text-base lg:min-h-13.5 lg:gap-2.5 lg:self-start lg:px-7"
                >
                    {t(`${base}.cta`)}
                    <ArrowRight
                        size={18}
                        strokeWidth={2.4}
                        aria-hidden="true"
                        className="hidden lg:block"
                    />
                </ButtonLink>
                <TagList
                    items={commonContent.hero.stack}
                    label={t(`${base}.stackLabel`)}
                    size="md"
                />
            </div>
        </section>
    );
}
