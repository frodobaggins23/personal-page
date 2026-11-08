import { Moon, Sun } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/hooks/useTheme';
import type { Theme } from '@/utils/setColorTheme';

interface ThemeSwitchProps {
    variant: 'segmented' | 'icon';
}

export function ThemeSwitch({ variant }: ThemeSwitchProps) {
    return variant === 'icon' ? <ThemeIconButton /> : <ThemeSegmentedControl />;
}

function ThemeIconButton() {
    const { t } = useTranslation();
    const { theme, setTheme } = useTheme();
    const isDark = theme === 'dark';
    const label = t(isDark ? 'shared.navigation.switchToLight' : 'shared.navigation.switchToDark');

    return (
        <button
            type="button"
            aria-label={label}
            title={label}
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="flex size-11 cursor-pointer items-center justify-center rounded-xl border border-line bg-transparent text-fg"
        >
            {isDark ? (
                <Sun size={18} strokeWidth={2} aria-hidden="true" />
            ) : (
                <Moon size={18} strokeWidth={2} aria-hidden="true" />
            )}
        </button>
    );
}

const options: readonly { theme: Theme; labelKey: string; Icon: typeof Sun }[] = [
    { theme: 'dark', labelKey: 'shared.navigation.themeDark', Icon: Moon },
    { theme: 'light', labelKey: 'shared.navigation.themeLight', Icon: Sun },
];

function ThemeSegmentedControl() {
    const { t } = useTranslation();
    const { theme, setTheme } = useTheme();
    const labelId = useId();

    return (
        <div className="flex items-center justify-between gap-3">
            <span
                id={labelId}
                className="font-mono text-label tracking-[0.08em] text-fg-muted uppercase"
            >
                {t('shared.navigation.themeLabel')}
            </span>
            <div
                role="group"
                aria-labelledby={labelId}
                className="flex gap-0.5 rounded-full border border-line p-0.75"
            >
                {options.map(({ theme: optionTheme, labelKey, Icon }) => {
                    const isActive = optionTheme === theme;
                    return (
                        <button
                            key={optionTheme}
                            type="button"
                            aria-pressed={isActive}
                            onClick={() => setTheme(optionTheme)}
                            className={`flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border-0 px-3.5 text-sm ${
                                isActive
                                    ? 'bg-fg font-bold text-bg'
                                    : 'bg-transparent font-medium text-fg-muted'
                            }`}
                        >
                            <Icon size={16} strokeWidth={2} aria-hidden="true" />
                            {t(labelKey)}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
