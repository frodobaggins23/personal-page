import type { Theme } from '@/utils/setColorTheme';

/* ------------------------------------------------------------------ *
 * Pure math: parse, luminance, ratio, grading, summary, verdict.
 * ------------------------------------------------------------------ */

export interface Rgba {
    r: number;
    g: number;
    b: number;
    a: number;
}

export type PairKind = 'text' | 'large' | 'ui' | 'decorative';
export type AaGrade = 'pass' | 'fail' | 'exempt';
export type AaaGrade = 'pass' | 'fail' | 'notApplicable';

export type UsageId =
    | 'bodyText'
    | 'bodyTextOnCards'
    | 'buttonLabelsInCards'
    | 'secondaryText'
    | 'secondaryTextOnCards'
    | 'stackChips'
    | 'metaLabels'
    | 'metaLabelsOnCards'
    | 'placeholderLabels'
    | 'sectionLabels'
    | 'promptInTerminal'
    | 'pathInPrompt'
    | 'pathInTerminal'
    | 'terminalText'
    | 'terminalSecondary'
    | 'primaryButtonLabel'
    | 'activeLanguageToggle'
    | 'heroNumeral'
    | 'arrowIcons'
    | 'openToWorkDot'
    | 'statusDot'
    | 'borders'
    | 'cardBorders'
    | 'perimeter'
    | 'insetText'
    | 'insetSecondary'
    | 'roleAi'
    | 'roleMe';

export interface ContrastRow {
    id: UsageId;
    theme: Theme;
    kind: PairKind;
    foreground: string;
    background: string;
    ratio: number;
    aa: AaGrade;
    aaa: AaaGrade;
    isBodyText: boolean;
}

export interface Summary {
    total: number;
    aaPassed: number;
    aaaPassed: number;
    aaaEligible: number;
}

export interface Verdict {
    isAaMetEverywhere: boolean;
    isBodyTextAaa: boolean;
    pairsMissingAaa: UsageId[];
}

const HEX_PATTERN = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;
const RGB_PATTERN =
    /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/i;

export function parseColor(value: string): Rgba {
    const input = value.trim();

    const hex = HEX_PATTERN.exec(input);
    if (hex) {
        return {
            r: parseInt(hex[1] ?? '', 16),
            g: parseInt(hex[2] ?? '', 16),
            b: parseInt(hex[3] ?? '', 16),
            a: 1,
        };
    }

    const rgb = RGB_PATTERN.exec(input);
    if (rgb) {
        const alphaText = rgb[4];
        const alpha = alphaText === undefined ? 1 : parseAlpha(alphaText);
        return { r: Number(rgb[1]), g: Number(rgb[2]), b: Number(rgb[3]), a: alpha };
    }

    throw new Error(`Unsupported color "${value}".`);
}

function parseAlpha(text: string): number {
    return text.endsWith('%') ? Number(text.slice(0, -1)) / 100 : Number(text);
}

/** Blends a translucent color over an (opaque) background. */
export function compositeOver(foreground: Rgba, background: Rgba): Rgba {
    if (foreground.a >= 1) {
        return foreground;
    }
    const mix = (front: number, back: number): number =>
        Math.round(front * foreground.a + back * (1 - foreground.a));

    return {
        r: mix(foreground.r, background.r),
        g: mix(foreground.g, background.g),
        b: mix(foreground.b, background.b),
        a: 1,
    };
}

export function toHex({ r, g, b }: Rgba): string {
    const channel = (value: number): string =>
        Math.round(value).toString(16).padStart(2, '0').toUpperCase();
    return `#${channel(r)}${channel(g)}${channel(b)}`;
}

function relativeLuminance({ r, g, b }: Rgba): number {
    const linear = (channel: number): number => {
        const value = channel / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

type ColorInput = string | Rgba;

export function contrastRatio(first: ColorInput, second: ColorInput): number {
    const a = relativeLuminance(typeof first === 'string' ? parseColor(first) : first);
    const b = relativeLuminance(typeof second === 'string' ? parseColor(second) : second);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/** WCAG 2.2 thresholds: SC 1.4.3 / 1.4.6 (text) and 1.4.11 (UI parts). */
export const THRESHOLDS = {
    text: { aa: 4.5, aaa: 7 },
    large: { aa: 3, aaa: 4.5 },
    ui: { aa: 3, aaa: null },
} as const;

export function gradePair(ratio: number, kind: PairKind): { aa: AaGrade; aaa: AaaGrade } {
    if (kind === 'decorative') {
        return { aa: 'exempt', aaa: 'notApplicable' };
    }

    const threshold = THRESHOLDS[kind];
    return {
        aa: ratio >= threshold.aa ? 'pass' : 'fail',
        aaa: threshold.aaa === null ? 'notApplicable' : ratio >= threshold.aaa ? 'pass' : 'fail',
    };
}

export function summarize(rows: readonly ContrastRow[]): Summary {
    const counted = rows.filter((row) => row.aa !== 'exempt');
    const aaaEligible = counted.filter((row) => row.aaa !== 'notApplicable');

    return {
        total: counted.length,
        aaPassed: counted.filter((row) => row.aa === 'pass').length,
        aaaPassed: aaaEligible.filter((row) => row.aaa === 'pass').length,
        aaaEligible: aaaEligible.length,
    };
}

export function deriveVerdict(rows: readonly ContrastRow[]): Verdict {
    const counted = rows.filter((row) => row.aa !== 'exempt');
    const pairsMissingAaa: UsageId[] = [];

    for (const row of counted) {
        if (row.aaa === 'fail' && !pairsMissingAaa.includes(row.id)) {
            pairsMissingAaa.push(row.id);
        }
    }

    return {
        isAaMetEverywhere: counted.every((row) => row.aa === 'pass'),
        isBodyTextAaa: counted.filter((row) => row.isBodyText).every((row) => row.aaa === 'pass'),
        pairsMissingAaa,
    };
}

/* ------------------------------------------------------------------ *
 * Pair list: which token sits on which token. Keep in sync with
 * src/styles/theme.css (add / rename / remove tokens in both places).
 * ------------------------------------------------------------------ */

interface PairDefinition {
    id: UsageId;
    /** CSS custom property names without the leading "--". */
    foreground: string;
    background: string;
    kind: PairKind;
    /** Omit for pairs that exist in both themes. */
    themes?: readonly Theme[];
    isBodyText?: boolean;
}

export const PAIR_DEFINITIONS: readonly PairDefinition[] = [
    { id: 'bodyText', foreground: 'fg', background: 'bg', kind: 'text', isBodyText: true },
    {
        id: 'bodyTextOnCards',
        foreground: 'fg',
        background: 'surface',
        kind: 'text',
        isBodyText: true,
    },
    {
        id: 'buttonLabelsInCards',
        foreground: 'fg',
        background: 'surface-2',
        kind: 'text',
        isBodyText: true,
    },
    {
        id: 'secondaryText',
        foreground: 'fg-muted',
        background: 'bg',
        kind: 'text',
        isBodyText: true,
    },
    {
        id: 'secondaryTextOnCards',
        foreground: 'fg-muted',
        background: 'surface',
        kind: 'text',
        isBodyText: true,
    },
    {
        id: 'stackChips',
        foreground: 'fg-muted',
        background: 'chip',
        kind: 'text',
        themes: ['light'],
    },
    { id: 'metaLabels', foreground: 'fg-subtle', background: 'bg', kind: 'text' },
    { id: 'metaLabelsOnCards', foreground: 'fg-subtle', background: 'surface', kind: 'text' },
    {
        id: 'placeholderLabels',
        foreground: 'fg-muted',
        background: 'placeholder-a',
        kind: 'text',
        themes: ['dark'],
    },
    {
        id: 'placeholderLabels',
        foreground: 'fg-subtle',
        background: 'placeholder-a',
        kind: 'text',
        themes: ['light'],
    },
    { id: 'sectionLabels', foreground: 'accent-ink', background: 'bg', kind: 'text' },
    { id: 'promptInTerminal', foreground: 'term-prompt', background: 'term-bg', kind: 'text' },
    { id: 'pathInPrompt', foreground: 'path', background: 'bg', kind: 'text' },
    {
        id: 'pathInTerminal',
        foreground: 'term-path',
        background: 'term-bg',
        kind: 'text',
        themes: ['light'],
    },
    {
        id: 'terminalText',
        foreground: 'term-fg',
        background: 'term-bg',
        kind: 'text',
        isBodyText: true,
    },
    {
        id: 'terminalSecondary',
        foreground: 'term-muted',
        background: 'term-bg',
        kind: 'text',
        isBodyText: true,
    },
    { id: 'primaryButtonLabel', foreground: 'on-accent', background: 'accent', kind: 'text' },
    { id: 'activeLanguageToggle', foreground: 'bg', background: 'fg', kind: 'text' },
    {
        id: 'insetText',
        foreground: 'fg',
        background: 'inset',
        kind: 'text',
        isBodyText: true,
    },
    {
        id: 'insetSecondary',
        foreground: 'fg-muted',
        background: 'inset',
        kind: 'text',
        isBodyText: true,
    },
    { id: 'roleAi', foreground: 'path', background: 'inset', kind: 'text' },
    { id: 'roleMe', foreground: 'accent-ink', background: 'inset', kind: 'text' },
    { id: 'heroNumeral', foreground: 'accent', background: 'bg', kind: 'large' },
    { id: 'arrowIcons', foreground: 'accent-ink', background: 'surface-2', kind: 'ui' },
    { id: 'openToWorkDot', foreground: 'success', background: 'bg', kind: 'ui' },
    { id: 'statusDot', foreground: 'warning', background: 'bg', kind: 'ui' },
    {
        id: 'borders',
        foreground: 'line',
        background: 'bg',
        kind: 'decorative',
        themes: ['dark'],
    },
    {
        id: 'cardBorders',
        foreground: 'card-border',
        background: 'bg',
        kind: 'decorative',
        themes: ['light'],
    },
    { id: 'perimeter', foreground: 'perimeter', background: 'bg', kind: 'decorative' },
];

export const THEMES: readonly Theme[] = ['dark', 'light'];

/* ------------------------------------------------------------------ *
 * DOM probing: the only part that touches the document. Reads the
 * computed value of each token under a throw-away [data-theme] subtree,
 * so the report always reflects the current styles.
 * ------------------------------------------------------------------ */

function probeTokens(theme: Theme, tokens: readonly string[], doc: Document): Map<string, Rgba> {
    const container = doc.createElement('div');
    container.setAttribute('data-theme', theme);
    container.hidden = true;

    const probes = new Map<string, HTMLElement>();
    for (const token of tokens) {
        const probe = doc.createElement('span');
        probe.style.color = `var(--${token})`;
        container.appendChild(probe);
        probes.set(token, probe);
    }
    doc.body.appendChild(container);

    try {
        const view = doc.defaultView;
        if (!view) {
            throw new Error('Cannot read computed styles without a window.');
        }
        const colors = new Map<string, Rgba>();
        for (const [token, probe] of probes) {
            colors.set(token, parseColor(view.getComputedStyle(probe).color));
        }
        return colors;
    } finally {
        container.remove();
    }
}

export function generateContrastRows(doc: Document = document): ContrastRow[] {
    const tokens = [
        ...new Set(PAIR_DEFINITIONS.flatMap((pair) => [pair.foreground, pair.background])),
    ];
    const pageToken = 'bg';

    return THEMES.flatMap((theme) => {
        const colors = probeTokens(theme, [...tokens, pageToken], doc);
        const page = colors.get(pageToken);

        return PAIR_DEFINITIONS.filter((pair) => !pair.themes || pair.themes.includes(theme)).map(
            (pair): ContrastRow => {
                const rawBackground = colors.get(pair.background);
                const rawForeground = colors.get(pair.foreground);
                if (!rawBackground || !rawForeground || !page) {
                    throw new Error(`Missing color token for "${pair.id}".`);
                }
                // Translucent tokens (e.g. --header-bg) are flattened onto what is behind them.
                const background = compositeOver(rawBackground, page);
                const foreground = compositeOver(rawForeground, background);
                const ratio = contrastRatio(foreground, background);

                return {
                    id: pair.id,
                    theme,
                    kind: pair.kind,
                    foreground: toHex(foreground),
                    background: toHex(background),
                    ratio,
                    ...gradePair(ratio, pair.kind),
                    isBodyText: pair.isBodyText ?? false,
                };
            },
        );
    });
}
