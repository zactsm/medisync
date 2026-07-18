import React from 'react';

export default function Badge({ children, variant = 'teal', className = '' }) {
    const variants = {
        teal: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
        emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        red: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
        gray: 'bg-slate-700/50 text-slate-300 border-slate-600/50',
    };

    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant] || variants.teal} ${className}`}>
            {children}
        </span>
    );
}
