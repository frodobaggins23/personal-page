import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SectionLabel } from '@/components/sectionHeading/SectionLabel';
import { useTheme } from '@/hooks/useTheme';
import { ResultBadge } from '@/pages/contrastReportPage/ResultBadge';
import type { AaaGrade, AaGrade, ContrastRow } from '@/services/contrastReportService';
import { THEMES } from '@/services/contrastReportService';
import type { Theme } from '@/utils/setColorTheme';

const base = 'pages.contrastReportPage.pairs';

function Sample({ row, className }: { row: ContrastRow; className: string }) {
    const isShape = row.kind === 'ui' || row.kind === 'decorative';
    return (
        <div
            aria-hidden="true"
            className={`flex items-center justify-center rounded-lg border border-line font-bold ${className}`}
            style={{ background: row.background, color: row.foreground }}
        >
            {isShape ? '●' : 'Aa'}
        </div>
    );
}

function useGradeLabels() {
    const { t } = useTranslation();

    const aa = (grade: AaGrade, compact: boolean) => {
        if (grade === 'exempt') {
            return (
                <ResultBadge
                    tone="decorative"
                    label={t(`${base}.badges.${compact ? 'decorativeNotRequired' : 'decorative'}`)}
                />
            );
        }
        const level = t(`${base}.columns.aa`);
        return grade === 'pass' ? (
            <ResultBadge
                tone="pass"
                label={
                    compact ? t(`${base}.badges.levelPass`, { level }) : t(`${base}.badges.pass`)
                }
            />
        ) : (
            <ResultBadge
                tone="fail"
                label={
                    compact ? t(`${base}.badges.levelFail`, { level }) : t(`${base}.badges.fail`)
                }
            />
        );
    };

    const aaa = (grade: AaaGrade, compact: boolean) => {
        if (grade === 'notApplicable') {
            return compact ? null : (
                <span className="text-fg-muted">{t(`${base}.badges.notApplicable`)}</span>
            );
        }
        const level = t(`${base}.columns.aaa`);
        return grade === 'pass' ? (
            <ResultBadge
                tone="pass"
                label={
                    compact ? t(`${base}.badges.levelPass`, { level }) : t(`${base}.badges.pass`)
                }
            />
        ) : (
            <ResultBadge
                tone="notMet"
                label={
                    compact
                        ? t(`${base}.badges.levelNotMet`, { level })
                        : t(`${base}.badges.notMet`)
                }
            />
        );
    };

    return { aa, aaa };
}

const formatRatio = (ratio: number): string => `${ratio.toFixed(2)}:1`;

export function PairsSection({
    rows,
    className = '',
}: {
    rows: readonly ContrastRow[];
    className?: string;
}) {
    const { t } = useTranslation();
    const { theme: currentTheme } = useTheme();
    // Defaults to the theme the visitor is currently looking at, then switches independently.
    const [selectedTheme, setSelectedTheme] = useState<Theme>(currentTheme);
    const grades = useGradeLabels();

    const visibleRows = rows.filter((row) => row.theme === selectedTheme);
    const themeName = t(`${base}.${selectedTheme}Theme`);
    const colorsText = (row: ContrastRow): string =>
        t(`${base}.colors`, { foreground: row.foreground, background: row.background });

    return (
        <section
            aria-labelledby="pairs-title"
            className={`flex flex-col gap-4 lg:gap-5 ${className}`}
        >
            <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
                <SectionLabel as="h2" id="pairs-title">
                    {t(`${base}.title`)}
                </SectionLabel>
                <div
                    role="group"
                    aria-label={t('shared.navigation.themeLabel')}
                    className="grid grid-cols-2 gap-1 rounded-btn border border-line p-1 lg:flex"
                >
                    {THEMES.map((theme) => {
                        const isActive = theme === selectedTheme;
                        const count = rows.filter((row) => row.theme === theme).length;
                        return (
                            <button
                                key={theme}
                                type="button"
                                aria-pressed={isActive}
                                onClick={() => setSelectedTheme(theme)}
                                className={`min-h-11 cursor-pointer rounded-[10px] border-0 font-[inherit] lg:px-4.5 lg:text-[0.9375rem] ${
                                    isActive
                                        ? 'bg-fg font-bold text-bg'
                                        : 'bg-transparent text-fg-muted'
                                }`}
                            >
                                {t(`${base}.themeOption`, {
                                    name: t(`${base}.${theme}Theme`),
                                    count,
                                })}
                            </button>
                        );
                    })}
                </div>
            </div>

            <ul className="m-0 flex list-none flex-col gap-2.5 p-0 lg:hidden">
                {visibleRows.map((row) => (
                    <li
                        key={`${row.theme}-${row.id}-${row.foreground}`}
                        className="flex flex-col gap-3 rounded-2xl border border-card-border bg-surface p-3.5 shadow-card"
                    >
                        <div className="grid grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-3">
                            <Sample row={row} className="h-13 w-16 text-xl" />
                            <div className="flex min-w-0 flex-col gap-0.5">
                                <span className="text-[0.9375rem] leading-tight font-semibold">
                                    {t(`${base}.usage.${row.id}`)}
                                </span>
                                <span className="font-mono text-[0.71875rem] text-fg-muted">
                                    {colorsText(row)}
                                </span>
                                <span className="font-mono text-[0.71875rem] text-fg-muted">
                                    {t(
                                        `${base}.kinds.${row.kind === 'decorative' ? 'decorative' : row.kind}`,
                                    )}
                                </span>
                            </div>
                            <div className="text-right font-mono text-lg font-bold whitespace-nowrap">
                                {formatRatio(row.ratio)}
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {grades.aa(row.aa, true)}
                            {grades.aaa(row.aaa, true)}
                        </div>
                    </li>
                ))}
            </ul>

            <div
                role="region"
                aria-labelledby="pairs-title"
                tabIndex={0}
                className="hidden overflow-x-auto rounded-[18px] border border-card-border bg-surface shadow-card lg:block"
            >
                <table className="w-full min-w-225 border-collapse text-[0.96875rem]">
                    <caption className="sr-only">
                        {t(`${base}.caption`, { theme: themeName })}
                    </caption>
                    <thead>
                        <tr className="text-left font-mono text-label tracking-wider text-fg-muted uppercase">
                            <th scope="col" className="w-16 px-5 py-4 font-normal">
                                <span className="sr-only">{t(`${base}.columns.sample`)}</span>
                            </th>
                            <th scope="col" className="px-3 py-4 font-normal">
                                {t(`${base}.columns.usage`)}
                            </th>
                            <th scope="col" className="px-3 py-4 font-normal">
                                {t(`${base}.columns.colors`)}
                            </th>
                            <th scope="col" className="px-3 py-4 font-normal">
                                {t(`${base}.columns.type`)}
                            </th>
                            <th scope="col" className="px-3 py-4 text-right font-normal">
                                {t(`${base}.columns.ratio`)}
                            </th>
                            <th scope="col" className="px-3 py-4 font-normal">
                                {t(`${base}.columns.aa`)}
                            </th>
                            <th scope="col" className="py-4 pr-5 pl-3 font-normal">
                                {t(`${base}.columns.aaa`)}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleRows.map((row) => (
                            <tr
                                key={`${row.theme}-${row.id}-${row.foreground}`}
                                className="border-t border-line"
                            >
                                <td className="px-5 py-3">
                                    <Sample row={row} className="h-10 w-14 text-[1.0625rem]" />
                                </td>
                                <th scope="row" className="px-3 py-3 text-left font-semibold">
                                    {t(`${base}.usage.${row.id}`)}
                                </th>
                                <td className="px-3 py-3 font-mono text-[0.8125rem] whitespace-nowrap text-fg-muted">
                                    {colorsText(row)}
                                </td>
                                <td className="px-3 py-3 text-[0.90625rem] text-fg-muted">
                                    {t(`${base}.kinds.${row.kind}`)}
                                </td>
                                <td className="px-3 py-3 text-right font-mono text-base font-bold whitespace-nowrap">
                                    {formatRatio(row.ratio)}
                                </td>
                                <td className="px-3 py-3">{grades.aa(row.aa, false)}</td>
                                <td className="py-3 pr-5 pl-3">{grades.aaa(row.aaa, false)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
