import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { commonContent } from '@/config/content';

export function Logo() {
    const { t } = useTranslation();

    return (
        <Link
            to="/"
            aria-label={t('shared.navigation.homeLabel')}
            className="flex min-h-11 items-center font-mono text-[0.9375rem] font-semibold text-fg no-underline lg:text-[1.0625rem]"
        >
            <span aria-hidden="true" className="text-accent-ink">
                ~/
            </span>
            <span aria-hidden="true">{commonContent.brand.handle}</span>
            <span
                aria-hidden="true"
                className="cursor-blink ml-0.75 h-4.25 w-2 bg-accent lg:h-4.75 lg:w-2.25"
            />
        </Link>
    );
}
