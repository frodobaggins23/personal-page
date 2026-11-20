interface ProjectImageProps {
    src: string;
    /** Accessible name, from the locale files. */
    alt: string;
    /** Intrinsic size in px; lets the browser reserve space before the file loads. */
    width: number;
    height: number;
    className?: string;
}

/** A real screenshot; `ImagePlaceholder` stands in until the file exists. */
export function ProjectImage({ src, alt, width, height, className = '' }: ProjectImageProps) {
    return (
        <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading="lazy"
            decoding="async"
            className={className}
        />
    );
}
