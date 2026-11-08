import { useTranslation } from 'react-i18next';

import { SectionLabel } from '@/components/sectionHeading/SectionLabel';
import type { PairKind } from '@/services/contrastReportService';
import { THRESHOLDS } from '@/services/contrastReportService';

const base = 'pages.contrastReportPage.thresholds';

// Success criteria are identical in every language, so they live in code with the thresholds.
const rows: readonly { kind: Exclude<PairKind, 'decorative'>; criterion: string }[] = [
    { kind: 'text', criterion: '1.4.3 / 1.4.6' },
    { kind: 'large', criterion: '1.4.3 / 1.4.6' },
    { kind: 'ui', criterion: '1.4.11' },
];

const headClasses = 'pb-2.5 font-normal lg:pb-2.5';
const numberClasses = 'py-2.5 text-right font-mono lg:py-3';

export function ThresholdsSection({ className = '' }: { className?: string }) {
    const { t } = useTranslation();
    const formatRatio = (ratio: number | null): string =>
        ratio === null ? t(`${base}.notApplicable`) : `${ratio}:1`;

    return (
        <section
            aria-labelledby="thresholds-title"
            className={`flex flex-col gap-3.5 lg:gap-4 ${className}`}
        >
            <SectionLabel as="h2" id="thresholds-title">
                {t(`${base}.title`)}
            </SectionLabel>
            <table className="w-full border-collapse text-[0.90625rem] lg:text-base">
                <caption className="sr-only">{t(`${base}.caption`)}</caption>
                <thead>
                    <tr className="text-left font-mono text-[0.71875rem] tracking-wider text-fg-muted uppercase lg:text-label">
                        <th scope="col" className={headClasses}>
                            {t(`${base}.columns.content`)}
                        </th>
                        <th scope="col" className={`${headClasses} hidden lg:table-cell`}>
                            {t(`${base}.columns.criterion`)}
                        </th>
                        <th scope="col" className={`${headClasses} text-right`}>
                            {t(`${base}.columns.aa`)}
                        </th>
                        <th scope="col" className={`${headClasses} text-right`}>
                            {t(`${base}.columns.aaa`)}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(({ kind, criterion }) => (
                        <tr key={kind} className="border-t border-line">
                            <th scope="row" className="py-2.5 text-left font-normal lg:py-3">
                                {t(`${base}.rows.${kind}.label`)}
                                {kind === 'large' ? (
                                    <>
                                        <br />
                                        <span className="font-mono text-[0.71875rem] text-fg-muted lg:text-label">
                                            {t(`${base}.rows.large.hint`)}
                                        </span>
                                    </>
                                ) : null}
                                <span className="block font-mono text-[0.71875rem] text-fg-muted lg:hidden">
                                    {t(`${base}.criterion`, { criterion })}
                                </span>
                            </th>
                            <td className="hidden py-3 font-mono text-[0.8125rem] text-fg-muted lg:table-cell">
                                {criterion}
                            </td>
                            <td className={numberClasses}>{formatRatio(THRESHOLDS[kind].aa)}</td>
                            <td
                                className={`${numberClasses} ${
                                    THRESHOLDS[kind].aaa === null ? 'text-fg-muted' : ''
                                }`}
                            >
                                {formatRatio(THRESHOLDS[kind].aaa)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}
