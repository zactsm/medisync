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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-opacity">
            <div className={`relative w-full ${maxWidth} glass-card rounded-2xl border border-slate-700/60 shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col`}>
                <div className="flex items-center justify-between pb-4 border-b border-slate-700/50">
                    <h3 className="text-xl font-bold text-slate-100">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="py-4 overflow-y-auto flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
}
