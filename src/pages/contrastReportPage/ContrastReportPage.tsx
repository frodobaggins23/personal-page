import { ArrowLeft } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { Container } from '@/components/container/Container';
import { Prompt } from '@/components/prompt/Prompt';
import { commonContent } from '@/config/content';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { PairsSection } from '@/pages/contrastReportPage/PairsSection';
import { SummaryStats } from '@/pages/contrastReportPage/SummaryStats';
import { ThresholdsSection } from '@/pages/contrastReportPage/ThresholdsSection';
import { VerdictSection } from '@/pages/contrastReportPage/VerdictSection';
import { deriveVerdict, generateContrastRows, summarize } from '@/services/contrastReportService';

const base = 'pages.contrastReportPage';
const sectionBorder = 'border-t border-line py-7 lg:py-12';

export function ContrastReportPage() {
    const { t, i18n } = useTranslation();
    useDocumentTitle(t('other.titles.contrastReport'));

    // Measured from the live stylesheet, so the report cannot drift from the design tokens.
    const rows = useMemo(() => generateContrastRows(), []);
    const summary = useMemo(() => summarize(rows), [rows]);
    const verdict = useMemo(() => deriveVerdict(rows), [rows]);

    const checkedOn = new Intl.DateTimeFormat(i18n.resolvedLanguage, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(__BUILD_DATE__));

    return (
        <Container>
            <div className="pt-4 lg:pt-8">
                <Link
                    to="/"
                    className="inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold text-fg no-underline lg:font-normal lg:text-fg-muted"
                >
                    <ArrowLeft size={16} strokeWidth={2.2} aria-hidden="true" />
                    {t('shared.navigation.backToHome')}
                </Link>
            </div>
            <section
                aria-labelledby="report-title"
                className="flex flex-col gap-4 pt-9 pb-7 lg:flex-row lg:flex-wrap lg:items-end lg:gap-x-18 lg:gap-y-10 lg:pt-10 lg:pb-14"
            >
                <div className="flex min-w-0 flex-col gap-4 lg:flex-[999_1_520px] lg:gap-5 lg:self-center">
                    <Prompt
                        user={commonContent.brand.promptUser}
                        path="~"
                        command={t(`${base}.prompt`)}
                        className="text-fg-muted lg:hidden"
                    />
                    <h1
                        id="report-title"
                        tabIndex={-1}
                        className="m-0 text-[2.5rem] leading-[1.05] font-bold tracking-[-0.02em] lg:text-[clamp(2.5rem,5.4vw,4.5rem)] lg:leading-none lg:tracking-tight"
                    >
                        {t(`${base}.title`)}
                    </h1>
                    <p className="m-0 text-[1.0625rem] text-fg-muted lg:max-w-160 lg:text-xl">
                        {t(`${base}.lead`)}
                    </p>
                </div>
                <div className="lg:flex-[1_1_380px]">
                    <SummaryStats summary={summary} checkedOn={checkedOn} />
                </div>
            </section>
            <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-x-18">
                <ThresholdsSection className={`${sectionBorder} lg:col-start-1 lg:row-start-1`} />
                <PairsSection
                    rows={rows}
                    className={`${sectionBorder} lg:col-span-2 lg:row-start-2 lg:pb-24`}
                />
                <VerdictSection
                    verdict={verdict}
                    className={`${sectionBorder} pb-10 lg:col-start-2 lg:row-start-1 lg:pb-12`}
                />
            </div>
            <p className="m-0 border-t border-line pt-6 pb-8 font-mono text-label text-fg-muted lg:text-[0.8125rem]">
                {t(`${base}.footer`)}
            </p>
        </Container>
    );
}
