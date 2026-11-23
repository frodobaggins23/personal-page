import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

/** "All projects" link at the top of the pages opened from the project list. */
export function BackToProjectsLink() {
    const { t } = useTranslation();

    return (
        <div className="pt-4 lg:pt-8">
            <Link
                to={{ pathname: '/', hash: '#projects' }}
                className="inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold text-fg no-underline lg:font-normal lg:text-fg-muted"
            >
                <ArrowLeft size={16} strokeWidth={2.2} aria-hidden="true" />
                {t('shared.navigation.allProjects')}
            </Link>
        </div>
    );
}
