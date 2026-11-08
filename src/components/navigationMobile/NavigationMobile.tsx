import { Menu, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { LangSwitch } from '@/components/langSwitch/LangSwitch';
import { Logo } from '@/components/logo/Logo';
import { ThemeSwitch } from '@/components/themeSwitch/ThemeSwitch';
import { formatNavigationIndex, navigationItems } from '@/config/navigation';

const MENU_ID = 'mobile-menu';

/** Header for screens below `lg`: logo, language switch and a hamburger menu. */
export function NavigationMobile() {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const closeAndRestoreFocus = useCallback(() => {
        setIsOpen(false);
        triggerRef.current?.focus();
    }, []);

    useEffect(() => {
        if (!isOpen) {
            return;
        }
        const onKeyDown = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') {
                closeAndRestoreFocus();
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [isOpen, closeAndRestoreFocus]);

    return (
        <nav aria-label={t('shared.navigation.ariaLabel')} className="lg:hidden">
            <div className="mx-auto flex h-15 w-full max-w-page items-center justify-between gap-3 px-5">
                <Logo />
                <div className="flex items-center gap-2">
                    <LangSwitch />
                    <button
                        ref={triggerRef}
                        type="button"
                        aria-label={t(
                            isOpen ? 'shared.navigation.menu.close' : 'shared.navigation.menu.open',
                        )}
                        aria-expanded={isOpen}
                        aria-controls={MENU_ID}
                        onClick={() => setIsOpen((current) => !current)}
                        className="flex size-11 cursor-pointer items-center justify-center rounded-xl border border-line bg-transparent text-fg"
                    >
                        {isOpen ? (
                            <X size={20} strokeWidth={2} aria-hidden="true" />
                        ) : (
                            <Menu size={20} strokeWidth={2} aria-hidden="true" />
                        )}
                    </button>
                </div>
            </div>
            <div id={MENU_ID} hidden={!isOpen} className="border-t border-line px-5 pt-2 pb-5">
                <ul className="m-0 flex list-none flex-col p-0">
                    {navigationItems.map((id, index) => (
                        <li key={id} className="border-b border-line last:border-b-0">
                            <Link
                                to={{ pathname: '/', hash: `#${id}` }}
                                onClick={() => setIsOpen(false)}
                                className="flex min-h-13 items-center gap-3.5 text-[1.375rem] font-semibold no-underline"
                            >
                                <span className="font-mono text-label text-accent-ink">
                                    {formatNavigationIndex(index)}
                                </span>
                                {t(`shared.navigation.items.${id}`)}
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className="mt-4">
                    <ThemeSwitch variant="segmented" />
                </div>
            </div>
        </nav>
    );
}
