import { useTranslation } from 'react-i18next';

import { SectionLabel } from '@/components/sectionHeading/SectionLabel';
import type { Verdict } from '@/services/contrastReportService';

const base = 'pages.contrastReportPage';

/** The wording is chosen from the computed results, never hard-coded. */
export function VerdictSection({
    verdict,
    className = '',
}: {
    verdict: Verdict;
    className?: string;
}) {
    const { t } = useTranslation();

    const headline = [
        t(`${base}.verdict.${verdict.isAaMetEverywhere ? 'aaAllPass' : 'aaSomeFail'}`),
        t(`${base}.verdict.${verdict.isBodyTextAaa ? 'bodyAllAaa' : 'bodyNotAllAaa'}`),
    ].join(' ');

    const names = verdict.pairsMissingAaa.map((id) => t(`${base}.pairs.usage.${id}`));
    const detail =
        names.length > 0 ? `${t(`${base}.verdict.missesAaa`, { list: names.join('; ') })}` : null;

    return (
        <section
            aria-labelledby="verdict-title"
            className={`flex flex-col gap-3 lg:gap-3.5 ${className}`}
        >
            <SectionLabel as="h2" id="verdict-title">
                {t(`${base}.verdict.title`)}
            </SectionLabel>
            <p className="m-0 text-[1.0625rem] lg:text-[1.375rem] lg:leading-[1.4]">{headline}</p>
            {detail ? (
                <p className="m-0 text-base text-fg-muted lg:text-[1.0625rem]">{detail}</p>
            ) : null}
        </section>
    );
}
