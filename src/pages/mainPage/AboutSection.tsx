import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { ImagePlaceholder } from '@/components/imagePlaceholder/ImagePlaceholder';
import { Overlay } from '@/components/overlay/Overlay';
import { SectionHeading } from '@/components/sectionHeading/SectionHeading';

const base = 'pages.mainPage.about';
const factIds = ['linux', 'learning', 'offTheClock', 'languages'] as const;

export function AboutSection() {
    const { t } = useTranslation();
    const [isPhotoOpen, setIsPhotoOpen] = useState(false);

    return (
        <section
            id="about"
            aria-labelledby="about-title"
            className="flex scroll-mt-18 flex-col gap-5.5 border-t border-line py-12 lg:flex-row lg:flex-wrap lg:gap-x-18 lg:gap-y-10 lg:py-22"
        >
            <SectionHeading
                label={t(`${base}.label`)}
                title={t(`${base}.title`)}
                titleId="about-title"
                className="lg:flex-[1_1_280px] lg:self-start"
            />
            <div className="flex min-w-0 flex-col gap-5.5 lg:flex-[999_1_560px] lg:gap-7">
                <p className="m-0 text-base text-fg-muted lg:max-w-170 lg:text-[1.1875rem]">
                    <Trans
                        i18nKey={`${base}.body`}
                        components={{ em: <em className="text-fg not-italic" /> }}
                    />
                </p>
                <dl className="m-0 flex flex-col border-t border-line">
                    {factIds.map((id) => (
                        <div
                            key={id}
                            className="grid grid-cols-[104px_minmax(0,1fr)] gap-3 border-b border-line py-3.5 lg:grid-cols-[160px_minmax(0,1fr)] lg:gap-6 lg:py-4.5"
                        >
                            <dt className="pt-0.5 font-mono text-[0.78125rem] text-fg-subtle lg:text-[0.84375rem]">
                                {t(`${base}.facts.${id}.label`)}
                            </dt>
                            <dd className="m-0 text-[0.9375rem] lg:text-base">
                                {t(`${base}.facts.${id}.value`)}
                            </dd>
                        </div>
                    ))}
                </dl>
                <figure className="m-0 mt-1 flex items-center gap-3.5 lg:mt-0 lg:gap-4">
                    <button
                        type="button"
                        aria-haspopup="dialog"
                        aria-label={t(`${base}.photo.enlarge`)}
                        onClick={() => setIsPhotoOpen(true)}
                        className="size-16 flex-none cursor-zoom-in rounded-2xl border border-line bg-transparent p-0 lg:size-18 lg:rounded-[18px]"
                    >
                        <ImagePlaceholder
                            label={t(`${base}.photo.alt`)}
                            caption={t(`${base}.photo.placeholderLabel`)}
                            className="size-full rounded-[15px] lg:rounded-[17px]"
                            captionClassName="text-[0.625rem]"
                        />
                    </button>
                    <figcaption className="text-sm text-fg-subtle lg:text-[0.9375rem]">
                        {t(`${base}.photo.caption`)}
                    </figcaption>
                </figure>
            </div>
            <Overlay
                isOpen={isPhotoOpen}
                onClose={() => setIsPhotoOpen(false)}
                label={t(`${base}.photo.dialogLabel`)}
                closeLabel={t('shared.components.overlay.close')}
            >
                <ImagePlaceholder
                    label={t(`${base}.photo.alt`)}
                    caption={t(`${base}.photo.placeholderLabel`)}
                    className="aspect-square w-full rounded-card border border-line"
                />
            </Overlay>
        </section>
    );
}
