interface PromptProps {
    user: string;
    path: string;
    command: string;
    /** Real information (e.g. the role line) stays readable for assistive tech. */
    output?: string;
    className?: string;
}

/** Terminal-style `user@host:path$ command` line. The prompt itself is decoration. */
export function Prompt({ user, path, command, output, className = '' }: PromptProps) {
    return (
        <div className={`flex flex-col font-mono text-[0.8125rem] leading-[1.7] ${className}`}>
            <span aria-hidden="true" className="text-fg-subtle">
                <span className="text-accent-ink">{user}</span>:
                <span className="text-path">{path}</span>$ {command}
            </span>
            {output ? <span className="text-fg">{output}</span> : null}
        </div>
    );
}
