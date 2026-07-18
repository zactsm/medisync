import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="premium-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md transition-opacity">
            <div className={`premium-modal relative w-full ${maxWidth} rounded-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col`}>
                <div className="premium-modal-header flex items-center justify-between pb-4">
                    <h3 className="premium-modal-title text-xl font-bold">{title}</h3>
                    <button
                        onClick={onClose}
                        className="premium-modal-close p-1.5 rounded-lg transition-colors"
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
