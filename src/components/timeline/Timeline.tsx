import type { ReactNode } from 'react';

export function Timeline({ children }: { children: ReactNode }) {
    return <ol className="m-0 flex list-none flex-col p-0">{children}</ol>;
}
