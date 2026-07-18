import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) {
    const dialogRef = useRef(null);
    const closeButtonRef = useRef(null);
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (!isOpen) return undefined;

        const previousActiveElement = document.activeElement;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onCloseRef.current();
                return;
            }

            if (e.key !== 'Tab' || !dialogRef.current) return;
            const focusable = dialogRef.current.querySelectorAll(
                'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
            );
            if (!focusable.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);
        window.requestAnimationFrame(() => closeButtonRef.current?.focus());

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKeyDown);
            previousActiveElement?.focus?.();
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="premium-modal-backdrop fixed inset-0 z-50 overflow-y-auto overscroll-contain p-2 sm:p-4"
            onMouseDown={(event) => event.target === event.currentTarget && onCloseRef.current()}
        >
            <div
                ref={dialogRef}
                className={`premium-modal relative mx-auto my-2 flex w-full ${maxWidth} flex-col overflow-hidden rounded-2xl sm:my-6`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="medisync-modal-title"
            >
                <div className="premium-modal-header flex items-center justify-between pb-4">
                    <h3 id="medisync-modal-title" className="premium-modal-title text-xl font-bold">{title}</h3>
                    <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={() => onCloseRef.current()}
                        className="premium-modal-close p-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        aria-label="Close dialog"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="premium-modal-body py-4 overflow-y-auto flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
}
