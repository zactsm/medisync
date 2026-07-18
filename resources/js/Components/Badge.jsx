import React from 'react';

export default function Badge({ children, variant = 'teal', className = '' }) {
    const variants = {
        teal: 'premium-badge premium-badge-accent',
        emerald: 'premium-badge premium-badge-success',
        amber: 'premium-badge premium-badge-warm',
        red: 'premium-badge premium-badge-danger',
        indigo: 'premium-badge premium-badge-neutral',
        gray: 'premium-badge premium-badge-muted',
    };

    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant] || variants.teal} ${className}`}>
            {children}
        </span>
    );
}
