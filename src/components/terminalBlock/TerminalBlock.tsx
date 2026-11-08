import type { TerminalLine } from '@/types/content';

interface TerminalBlockProps {
    lines: readonly TerminalLine[];
    label: string;
    tone?: 'default' | 'muted';
    className?: string;
}

/** Always-dark terminal output. Keyboard focusable because it may scroll horizontally. */
export function TerminalBlock({
    lines,
    label,
    tone = 'default',
    className = '',
}: TerminalBlockProps) {
    return (
        <pre
            tabIndex={0}
            role="group"
            aria-label={label}
            className={`m-0 overflow-x-auto bg-term-bg font-mono text-[0.78125rem] leading-[1.75] whitespace-pre-wrap lg:text-sm lg:leading-[1.8] ${
                tone === 'muted' ? 'text-term-muted' : 'text-term-fg'
            } ${className}`}
        >
            {lines.map((line, index) => (
                <TerminalLineView key={index} line={line} />
            ))}
        </pre>
    );
}

function TerminalLineView({ line }: { line: TerminalLine }) {
    if (line.type === 'prompt') {
        return (
            <span className={line.isDesktopOnly ? 'hidden lg:block' : 'block'}>
                <span className="text-term-prompt">{line.user}</span>:
                <span className="text-term-path">{line.path}</span>$ {line.command}
                {line.hasCursor ? (
                    <span
                        aria-hidden="true"
                        className="cursor-blink inline-block h-4 w-2 bg-term-fg align-[-2px]"
                    />
                ) : null}
            </span>
        );
    }
    if (line.type === 'tree') {
        return (
            <span className="block">
                {line.prefix}
                <span className="text-term-prompt">{line.highlight}</span>
                {line.suffix}
            </span>
        );
    }
    return <span className="block">{line.text}</span>;
}
