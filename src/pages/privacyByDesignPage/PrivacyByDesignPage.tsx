import { Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { BackToProjectsLink } from '@/components/backToProjectsLink/BackToProjectsLink';
import { Container } from '@/components/container/Container';
import { Prompt } from '@/components/prompt/Prompt';
import { SectionLabel } from '@/components/sectionHeading/SectionLabel';
import { commonContent } from '@/config/content';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { PrivacyItem } from '@/pages/privacyByDesignPage/PrivacyItem';
import { TradeOff } from '@/pages/privacyByDesignPage/TradeOff';

const base = 'pages.privacyByDesignPage';

/** Privacy and security across all projects. Same shell as a project page, no facts or screens. */
export function PrivacyByDesignPage() {
    const { t } = useTranslation();
    useDocumentTitle(t('other.titles.privacyByDesign'));

    return (
        <Container>
            <BackToProjectsLink />
            <section
                aria-labelledby="privacy-title"
                className="flex flex-col gap-4 pt-9 pb-7 lg:flex-row lg:flex-wrap lg:items-end lg:gap-x-18 lg:gap-y-8 lg:pt-10 lg:pb-18"
            >
                <div className="flex min-w-0 flex-col gap-4 lg:flex-[999_1_560px] lg:gap-5 lg:self-center">
                    <Prompt
                        user={commonContent.brand.promptUser}
                        path={commonContent.brand.projectsPath}
                        command={commonContent.privacyByDesign.prompt}
                        className="text-fg-subtle lg:hidden"
                    />
                    <div className="hidden items-center gap-2.5 font-mono text-[0.8125rem] text-accent-ink lg:flex">
                        <Lock
                            aria-hidden="true"
                            strokeWidth={2.2}
                            className="size-3.75 flex-none"
                        />
                        <span>{t(`${base}.label`)}</span>
                    </div>
                    <h1
                        id="privacy-title"
                        tabIndex={-1}
                        className="m-0 text-[2.5rem] leading-[1.04] font-bold tracking-[-0.02em] lg:text-[clamp(2.875rem,6.4vw,5.5rem)] lg:leading-[0.95] lg:tracking-[-0.03em]"
                    >
                        {t(`${base}.title`)}
                    </h1>
                </div>
                <p className="m-0 text-[1.0625rem] text-fg-muted lg:max-w-130 lg:flex-[1_1_360px] lg:text-[1.375rem] lg:leading-[1.45]">
                    {t(`${base}.lead`)}
                </p>
            </section>
            <section
                aria-labelledby="privacy-where-title"
                className="flex flex-col pt-2 pb-6 lg:pt-0 lg:pb-10"
            >
                <SectionLabel as="h2" id="privacy-where-title" className="m-0 pb-2 lg:pb-4">
                    {t(`${base}.whereLabel`)}
                </SectionLabel>
                <ul className="m-0 flex list-none flex-col p-0 lg:border-b lg:border-line">
                    {commonContent.privacyByDesign.items.map((item, index) => (
                        <PrivacyItem
                            key={item.id}
                            index={String(index + 1).padStart(2, '0')}
                            title={t(`${base}.items.${item.id}.title`)}
                            href={item.projectSlug ? `/projects/${item.projectSlug}` : undefined}
                            what={t(`${base}.items.${item.id}.what`)}
                            body={t(`${base}.items.${item.id}.body`)}
                        />
                    ))}
                </ul>
            </section>
            <TradeOff
                titleId="privacy-tradeoff-title"
                label={t(`${base}.tradeoff.label`)}
                title={t(`${base}.tradeoff.title`)}
                costs={{
                    label: t(`${base}.tradeoff.costLabel`),
                    items: t(`${base}.tradeoff.costs`, { returnObjects: true }) as string[],
                }}
                gets={{
                    label: t(`${base}.tradeoff.getLabel`),
                    items: t(`${base}.tradeoff.gets`, { returnObjects: true }) as string[],
                }}
            />
        </Container>
    );
}
