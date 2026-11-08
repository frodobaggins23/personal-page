import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface OverlayProps {
    isOpen: boolean;
    onClose: () => void;
    /** Accessible name of the dialog. */
    label: string;
    closeLabel: string;
    children: ReactNode;
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Generic modal dialog. Focus moves in on open, is trapped while open and returns to the opener
 * on close; Esc and the close button close it; background scroll is locked.
 */
export function Overlay({ isOpen, onClose, label, closeLabel, children }: OverlayProps) {
    const dialogRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const opener =
            document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        closeButtonRef.current?.focus();

        const onKeyDown = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onCloseRef.current();
                return;
            }
            if (event.key !== 'Tab' || !dialogRef.current) {
                return;
            }
            const focusable = Array.from(
                dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
            );
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (!first || !last) {
                return;
            }
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = previousOverflow;
            opener?.focus();
        };
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5"
            onClick={onClose}
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-label={label}
                onClick={(event) => event.stopPropagation()}
                className="relative max-h-full w-full max-w-md rounded-card-lg border border-card-border bg-surface p-5 shadow-card"
            >
                <button
                    ref={closeButtonRef}
                    type="button"
                    aria-label={closeLabel}
                    title={closeLabel}
                    onClick={onClose}
                    className="mb-3 ml-auto flex size-11 cursor-pointer items-center justify-center rounded-xl border border-line bg-transparent text-fg"
                >
                    <X size={20} strokeWidth={2} aria-hidden="true" />
                </button>
                {children}
            </div>
        </div>,
        document.body,
    );
}
