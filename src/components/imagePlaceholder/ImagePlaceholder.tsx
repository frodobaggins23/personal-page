interface ImagePlaceholderProps {
    /** Accessible name. Replace with real `alt` text once the image exists. */
    label: string;
    caption: string;
    className?: string;
    captionClassName?: string;
}

/** Stands in for screenshots and the photo until the real files exist. */
export function ImagePlaceholder({
    label,
    caption,
    className = '',
    captionClassName = 'text-label lg:text-[0.8125rem]',
}: ImagePlaceholderProps) {
    return (
        <div
            role="img"
            aria-label={label}
            className={`placeholder-stripes flex items-center justify-center ${className}`}
        >
            <span aria-hidden="true" className={`font-mono text-fg-muted ${captionClassName}`}>
                {caption}
            </span>
        </div>
    );
}
