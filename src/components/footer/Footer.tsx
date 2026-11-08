import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { Container } from '@/components/container/Container';

export function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="border-t border-line">
            <Container className="flex flex-col gap-1.5 pt-6 pb-10 font-mono text-label text-fg-subtle lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-x-8 lg:gap-y-2 lg:pt-7 lg:pb-12 lg:text-[0.8125rem]">
                <span>{t('shared.components.footer.builtWith')}</span>
                <Link
                    to="/accessibility"
                    className="inline-flex min-h-11 items-center text-fg-muted underline underline-offset-[3px]"
                >
                    {t('shared.components.footer.accessibilityReport')}
                </Link>
                <span>
                    {t('shared.components.footer.copyright', { year: new Date().getFullYear() })}
                </span>
            </Container>
        </footer>
    );
}
