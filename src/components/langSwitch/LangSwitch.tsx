import { useTranslation } from 'react-i18next';

import { commonContent } from '@/config/content';
import { useLanguage } from '@/hooks/useLanguage';
import type { Language } from '@/utils/setLanguage';

const languages: readonly Language[] = ['cs', 'en'];

export function LangSwitch() {
    const { t } = useTranslation();
    const { language, setLanguage } = useLanguage();

    return (
        <div
            role="group"
            aria-label={t('shared.navigation.languageLabel')}
            className="flex gap-0.5 rounded-full border border-line p-0.75 font-mono text-label"
        >
            {languages.map((code) => {
                const { label, name } = commonContent.languages[code];
                const isActive = code === language;
                return (
                    <button
                        key={code}
                        type="button"
                        lang={code}
                        aria-label={name}
                        aria-pressed={isActive}
                        onClick={() => setLanguage(code)}
                        className={`h-11 min-w-11 cursor-pointer rounded-full border-0 font-[inherit] ${
                            isActive ? 'bg-fg font-bold text-bg' : 'bg-transparent text-fg-muted'
                        }`}
                    >
                        <span aria-hidden="true">{label}</span>
                    </button>
                );
            })}
        </div>
    );
}
