import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { ButtonLink } from '@/components/buttonLink/ButtonLink';
import { SectionLabel } from '@/components/sectionHeading/SectionLabel';
import { commonContent } from '@/config/content';

const base = 'pages.mainPage.contact';

export function ContactSection() {
    const { t } = useTranslation();

    return (
        <section
            id="contact"
            aria-labelledby="contact-title"
            className="flex scroll-mt-18 flex-col gap-5 border-t border-line pt-14 pb-10 lg:grid lg:items-end lg:gap-x-18 lg:gap-y-8 lg:pt-26 lg:pb-24 lg:grid-cols-[repeat(auto-fit,minmax(min(420px,100%),1fr))]"
        >
            <div className="contents lg:flex lg:flex-col lg:gap-4">
                <SectionLabel>{t(`${base}.label`)}</SectionLabel>
                <h2
                    id="contact-title"
                    className="text-contact m-0 font-bold tracking-[-0.02em] lg:tracking-[-0.03em]"
                >
                    {t(`${base}.title`)}
                </h2>
                <p className="m-0 text-base text-fg-muted lg:text-[1.1875rem]">
                    {t(`${base}.body`)}
                </p>
            </div>
            <div className="flex flex-col gap-2.5 lg:flex-row lg:flex-wrap lg:gap-3">
                <ButtonLink
                    variant="primary"
                    href={commonContent.links.linkedin}
                    className="min-h-14 gap-2.5 rounded-btn px-5 text-base lg:min-h-15 lg:flex-[1_1_260px] lg:px-6 lg:text-[1.0625rem]"
                >
                    {t(`${base}.linkedin`)}
                    <ArrowUpRight size={16} strokeWidth={2.4} aria-hidden="true" />
                </ButtonLink>
                <ButtonLink
                    variant="secondary"
                    href={commonContent.links.github}
                    className="min-h-13 gap-2 rounded-btn lg:min-h-15 lg:flex-[1_1_160px] lg:px-6 lg:text-[1.0625rem]"
                >
                    {t(`${base}.github`)}
                    <ArrowUpRight
                        size={16}
                        strokeWidth={2.2}
                        aria-hidden="true"
                        className="text-fg-subtle"
                    />
                </ButtonLink>
            </div>
        </section>
    );
}
