import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router';

import { Footer } from '@/components/footer/Footer';
import { NavigationDesktop } from '@/components/navigationDesktop/NavigationDesktop';
import { NavigationMobile } from '@/components/navigationMobile/NavigationMobile';

const MAIN_ID = 'main-content';

/** Skip link, sticky header, page outlet and footer, plus scroll / focus handling on navigation. */
export function SiteLayout() {
    const { t } = useTranslation();
    const { pathname, hash, key } = useLocation();
    const previousPathname = useRef<string | null>(null);

    useEffect(() => {
        const hasPageChanged =
            previousPathname.current !== null && previousPathname.current !== pathname;
        const isSamePage = previousPathname.current === pathname;
        previousPathname.current = pathname;

        if (hash) {
            // Smooth only for in-page jumps; arriving from another page should not animate.
            const prefersReducedMotion = window.matchMedia(
                '(prefers-reduced-motion: reduce)',
            ).matches;
            document.getElementById(hash.slice(1))?.scrollIntoView({
                behavior: isSamePage && !prefersReducedMotion ? 'smooth' : 'auto',
            });
            return;
        }

        window.scrollTo(0, 0);
        if (hasPageChanged) {
            // Lets screen reader users notice that the page changed.
            document.querySelector<HTMLElement>('main h1')?.focus();
        }
    }, [pathname, hash, key]);

    return (
        <>
            <a
                href={`#${MAIN_ID}`}
                onClick={(event) => {
                    event.preventDefault();
                    document.getElementById(MAIN_ID)?.focus();
                }}
                className="sr-only rounded-btn bg-accent px-4 py-3 font-bold text-on-accent focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50"
            >
                {t('shared.navigation.skipToContent')}
            </a>
            <header className="sticky top-0 z-10 border-b border-line bg-header backdrop-blur-[10px]">
                <NavigationMobile />
                <NavigationDesktop />
            </header>
            <main id={MAIN_ID} tabIndex={-1} className="outline-none">
                <Outlet />
            </main>
            <Footer />
        </>
    );
}
