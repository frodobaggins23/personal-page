import { ImagePlaceholder } from '@/components/imagePlaceholder/ImagePlaceholder';
import { ProjectImage } from '@/components/projectImage/ProjectImage';

export interface ProjectScreen {
    caption: string;
    label: string;
    /** Real screenshot; the striped placeholder is shown while this is missing. */
    src?: string;
}

interface ProjectScreensProps {
    screens: readonly ProjectScreen[];
    groupLabel: string;
}

const imageSize = { width: 396, height: 851 };

const frameClasses = 'w-full rounded-[22px] border border-line lg:rounded-panel';

// Dark gray (not black) bezel in both themes, like a real phone.
const bezelClasses =
    'h-auto w-full rounded-panel border-6 border-bezel shadow-card lg:rounded-bezel-lg lg:border-8';

const placeholderClasses =
    `${frameClasses} aspect-9/18 p-3 text-center lg:aspect-9/19 ` +
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
                    {screen.src ? (
                        <ProjectImage
                            src={screen.src}
                            alt={screen.label}
                            {...imageSize}
                            className={bezelClasses}
                        />
                    ) : (
                        <ImagePlaceholder
                            label={screen.label}
                            caption={screen.caption}
                            captionClassName="text-[0.71875rem] lg:text-[0.78125rem]"
                            className={placeholderClasses}
                        />
                    )}
                </li>
            ))}
        </ul>
    );
}
