import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { Container } from '@/components/container/Container';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const base = 'pages.notFoundPage';

export function NotFoundPage() {
    const { t } = useTranslation();
    useDocumentTitle(t('other.titles.notFound'));

    return (
        <Container className="flex flex-col gap-4 py-16 lg:gap-5 lg:py-28">
            <h1
                tabIndex={-1}
                className="m-0 text-[2.875rem] leading-none font-bold tracking-tight lg:text-[clamp(2.875rem,6.4vw,5.5rem)] lg:leading-[0.95] lg:tracking-[-0.03em]"
            >
                {t(`${base}.title`)}
            </h1>
            <p className="m-0 max-w-155 text-lg leading-normal text-fg-muted lg:text-[1.375rem]">
                {t(`${base}.body`)}
            </p>
            <Link
                to="/"
                className="inline-flex min-h-12 items-center gap-2 self-start rounded-btn bg-accent px-5 font-bold text-on-accent no-underline hover:text-on-accent"
            >
                <ArrowLeft size={18} strokeWidth={2.4} aria-hidden="true" />
                {t(`${base}.home`)}
            </Link>
        </Container>
    );
}
