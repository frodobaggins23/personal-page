import { ArrowRight, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

interface PrivacyItemProps {
    /** Display number such as "01"; decorative, the list already conveys the position. */
    index: string;
    title: string;
    /** Project page to link to; items that are not a project render without a link. */
    href?: string;
    what: string;
    body: string;
}

const titleClasses =
    '-my-1.5 flex min-h-11 items-center text-xl font-bold no-underline lg:my-0 lg:flex-[1_1_260px] lg:items-start lg:self-start lg:text-2xl lg:leading-[1.2]';

/** One entry on the privacy by design page: what it protects and how. Two columns from `lg`. */
export function PrivacyItem({ index, title, href, what, body }: PrivacyItemProps) {
    const { t } = useTranslation();

    const titleContent = (
        <span className="flex flex-1 items-baseline gap-2.5 lg:gap-3">
            <span
                aria-hidden="true"
                className="font-mono text-label font-normal text-fg-subtle lg:text-[0.8125rem]"
            >
                {index}
            </span>
            <span className="flex flex-1 items-center justify-between gap-2.5 lg:flex-none lg:justify-start">
                {title}
                {href ? (
                    <ArrowRight
                        aria-hidden="true"
                        strokeWidth={2.2}
                        className="size-4 flex-none text-accent-ink lg:size-4.5"
                    />
                ) : null}
            </span>
        </span>
    );

    return (
        <li className="flex flex-col gap-2 border-t border-line py-5 lg:flex-row lg:flex-wrap lg:gap-x-18 lg:gap-y-3 lg:py-8">
            {/* The negative margin keeps the design's 32 px row on mobile with a 44 px touch target. */}
            {href ? (
                <Link to={href} className={titleClasses}>
                    {titleContent}
                </Link>
            ) : (
                <div className={titleClasses}>{titleContent}</div>
            )}
            <div className="flex flex-col gap-2 lg:max-w-180 lg:flex-[999_1_520px] lg:gap-2.5">
                <p className="m-0 flex items-center gap-2 font-mono text-[0.78125rem] text-accent-ink lg:text-[0.84375rem]">
                    <Lock
                        aria-hidden="true"
                        strokeWidth={2.2}
                        className="size-3.5 flex-none lg:size-3.75"
                    />
                    {t('pages.privacyByDesignPage.protects', { what })}
                </p>
                <p className="m-0 text-[0.96875rem] text-fg-muted lg:text-lg">{body}</p>
            </div>
        </li>
    );
}
