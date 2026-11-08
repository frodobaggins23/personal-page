import { ImagePlaceholder } from '@/components/imagePlaceholder/ImagePlaceholder';

export interface ProjectScreen {
    caption: string;
    label: string;
}

interface ProjectScreensProps {
    screens: readonly ProjectScreen[];
    groupLabel: string;
}

const phoneClasses =
    'aspect-9/18 w-full rounded-[22px] border border-line p-3 text-center lg:aspect-9/19 lg:rounded-panel ' +
    'lg:bg-[repeating-linear-gradient(135deg,var(--placeholder-a)_0_10px,var(--bg)_10px_20px)]';

/** Two phone shots on mobile (second one offset), three in a panel from `lg`. */
export function ProjectScreens({ screens, groupLabel }: ProjectScreensProps) {
    return (
        <ul
            aria-label={groupLabel}
            className="m-0 grid list-none grid-cols-2 gap-3 p-0 pb-9 lg:flex lg:flex-wrap lg:justify-center lg:gap-8 lg:rounded-panel lg:border lg:border-card-border lg:bg-surface lg:px-10 lg:py-14"
        >
            {screens.map((screen, index) => (
                <li
                    key={screen.label}
                    className={`lg:flex-[0_1_260px] ${index === 1 ? 'mt-9 lg:mt-12' : ''} ${
                        index >= 2 ? 'hidden lg:block' : ''
                    }`}
                >
                    <ImagePlaceholder
                        label={screen.label}
                        caption={screen.caption}
                        captionClassName="text-[0.71875rem] lg:text-[0.78125rem]"
                        className={phoneClasses}
                    />
                </li>
            ))}
        </ul>
    );
}
