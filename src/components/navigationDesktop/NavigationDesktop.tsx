import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';

import { LangSwitch } from '@/components/langSwitch/LangSwitch';
import { Logo } from '@/components/logo/Logo';
import { ThemeSwitch } from '@/components/themeSwitch/ThemeSwitch';
import { formatNavigationIndex, navigationItems } from '@/config/navigation';

/** Header from `lg` up: logo, numbered links, language switch and theme button. */
export function NavigationDesktop() {
    const { t } = useTranslation();
    const { pathname } = useLocation();
    const isProjectRoute = pathname.startsWith('/projects/');

    return (
        <nav
            aria-label={t('shared.navigation.ariaLabel')}
            className="mx-auto hidden min-h-18 w-full max-w-page flex-wrap items-center justify-between gap-x-8 gap-y-3 px-10 lg:flex"
        >
            <Logo />
            <ul className="m-0 flex list-none flex-wrap gap-x-7 gap-y-1 p-0 text-[0.9375rem]">
                {navigationItems.map((id, index) => {
                    const isCurrent = id === 'projects' && isProjectRoute;
                    return (
                        <li key={id}>
                            <Link
                                to={{ pathname: '/', hash: `#${id}` }}
                                aria-current={isCurrent ? 'page' : undefined}
                                className={`flex min-h-11 items-center gap-2 no-underline ${
                                    isCurrent ? 'nav-current' : ''
                                }`}
                            >
                                <span className="font-mono text-label text-accent-ink">
                                    {formatNavigationIndex(index)}
                                </span>
                                {t(`shared.navigation.items.${id}`)}
                            </Link>
                        </li>
                    );
                })}
            </ul>
            <div className="flex items-center gap-2.5">
                <LangSwitch />
                <ThemeSwitch variant="icon" />
            </div>
        </nav>
    );
}
