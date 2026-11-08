import { useTranslation } from 'react-i18next';

import type { Summary } from '@/services/contrastReportService';

const base = 'pages.contrastReportPage.summary';

function Stat({
    label,
    value,
    isPass = false,
}: {
    label: string;
    value: string;
    isPass?: boolean;
}) {
    return (
        <div className="flex flex-col-reverse gap-0.5 bg-bg px-3 py-3.5 lg:gap-1 lg:px-4 lg:py-4.5">
            <dt className="font-mono text-[0.6875rem] tracking-wider text-fg-muted uppercase lg:text-[0.71875rem]">
                {label}
            </dt>
            <dd
                className={`m-0 text-[1.75rem] leading-[1.1] font-bold lg:text-4xl lg:leading-[1.05] ${
                    isPass ? 'text-success-ink' : ''
                }`}
            >
                {value}
            </dd>
        </div>
    );
}

export function SummaryStats({ summary, checkedOn }: { summary: Summary; checkedOn: string }) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-2.5">
            <dl className="m-0 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:rounded-[18px]">
                <Stat label={t(`${base}.pairsChecked`)} value={String(summary.total)} />
                <Stat
                    label={t(`${base}.passAA`)}
                    value={`${summary.aaPassed}/${summary.total}`}
                    isPass
                />
                <Stat
                    label={t(`${base}.passAAA`)}
                    value={`${summary.aaaPassed}/${summary.aaaEligible}`}
                />
            </dl>
            <p className="m-0 font-mono text-[0.78125rem] text-fg-muted lg:text-[0.8125rem]">
                {t(`${base}.checkedOn`, { date: checkedOn })}
            </p>
        </div>
    );
}
