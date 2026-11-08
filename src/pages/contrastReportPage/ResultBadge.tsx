import { Check, Minus, X } from 'lucide-react';

export type BadgeTone = 'pass' | 'fail' | 'notMet' | 'decorative';

const toneClasses: Record<BadgeTone, string> = {
    pass: 'bg-[color-mix(in_srgb,var(--success-ink)_12%,transparent)] text-success-ink',
    fail: 'bg-[color-mix(in_srgb,var(--danger-ink)_14%,transparent)] text-danger-ink',
    notMet: 'border border-line text-fg-muted',
    decorative: 'border border-dashed border-fg-muted text-fg-muted',
};

/** Pill with an icon and text, so pass / fail never rely on color alone. */
export function ResultBadge({ tone, label }: { tone: BadgeTone; label: string }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.25 py-1 font-mono text-[0.78125rem] whitespace-nowrap ${toneClasses[tone]}`}
        >
            {tone === 'pass' ? <Check size={12} strokeWidth={3} aria-hidden="true" /> : null}
            {tone === 'fail' ? <X size={12} strokeWidth={3} aria-hidden="true" /> : null}
            {tone === 'notMet' ? <Minus size={12} strokeWidth={3} aria-hidden="true" /> : null}
            {label}
        </span>
    );
}
