import React, { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    CalendarDays,
    FileText,
    HeartPulse,
    LayoutDashboard,
    Pill,
    ShieldAlert,
    Stethoscope,
    Users,
} from 'lucide-react';
import { useLanguage } from '../lib/language';

const navigation = [
    { name: 'Dashboard', malay: 'Papan utama', href: '/', icon: LayoutDashboard },
    { name: 'Medications', malay: 'Ubat', href: '/medications', icon: Pill },
    { name: 'Appointments', malay: 'Temujanji', href: '/appointments', icon: CalendarDays },
    { name: 'Caregiver', malay: 'Penjaga', href: '/caregiver', icon: Users },
    { name: 'Documents', malay: 'Dokumen', href: '/documents', icon: FileText },
    { name: 'Health tools', malay: 'Alat kesihatan', href: '/symptom-summariser', icon: Stethoscope },
    { name: 'Emergency', malay: 'Kecemasan', href: '/ice', icon: ShieldAlert, danger: true },
];

export default function Sidebar({ collapsed, mobileOpen, onClose }) {
    const { url } = usePage();
    const { language, t } = useLanguage();
    const [tooltip, setTooltip] = useState(null);

    const isActive = (href) => href === '/' ? url === '/' : url.startsWith(href);
    const label = (item) => language === 'ms' ? item.malay : item.name;
    const secondaryLabel = (item) => language === 'ms' ? item.name : item.malay;

    useEffect(() => {
        if (!collapsed || mobileOpen) setTooltip(null);
    }, [collapsed, mobileOpen]);

    const showTooltip = (event, item) => {
        if (!collapsed || mobileOpen) return;

        const linkRect = event.currentTarget.getBoundingClientRect();
        const sidebarRect = event.currentTarget.closest('.app-sidebar')?.getBoundingClientRect();
        if (!sidebarRect) return;

        setTooltip({
            label: label(item),
            top: linkRect.top - sidebarRect.top + linkRect.height / 2,
        });
    };

    const clearTooltip = (event) => {
        if (!event || !event.currentTarget.contains(event.relatedTarget)) setTooltip(null);
    };

    return (
        <>
            {mobileOpen && <button type="button" className="sidebar-backdrop" onClick={onClose} aria-label={t('header.closeSidebar')} />}
            <aside className={`app-sidebar ${collapsed ? 'is-collapsed' : ''} ${mobileOpen ? 'is-mobile-open' : ''}`} aria-label={t('header.navigation')}>
                <div className="sidebar-top">
                    <Link href="/" className="sidebar-brand" onClick={onClose} aria-label="MediSync home">
                        <span className="brand-icon"><HeartPulse className="h-4 w-4" /></span>
                        <span className="sidebar-brand-copy">
                            <span className="brand-wordmark">Medi<span>Sync</span></span>
                            <small>{language === 'ms' ? 'Penjagaan keluarga' : 'Family health'}</small>
                        </span>
                    </Link>
                </div>

                <nav className="sidebar-nav">
                    <p className="sidebar-section-label">{language === 'ms' ? 'Navigasi utama' : 'Main navigation'}</p>
                    {navigation.map((item) => {
                        const active = isActive(item.href);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={`sidebar-link ${active ? 'is-active' : ''} ${item.danger ? 'is-danger' : ''}`}
                                aria-current={active ? 'page' : undefined}
                                title={collapsed ? `${label(item)} · ${secondaryLabel(item)}` : undefined}
                                onMouseEnter={(event) => showTooltip(event, item)}
                                onMouseLeave={() => setTooltip(null)}
                                onFocus={(event) => showTooltip(event, item)}
                                onBlur={clearTooltip}
                            >
                                <Icon className="sidebar-link-icon h-[1.1rem] w-[1.1rem]" />
                                <span className="sidebar-link-copy">
                                    <span>{label(item)}</span>
                                    <small>{secondaryLabel(item)}</small>
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {collapsed && !mobileOpen && tooltip && (
                    <div className="sidebar-tooltip" style={{ '--sidebar-tooltip-top': `${tooltip.top}px` }} role="tooltip">
                        {tooltip.label}
                    </div>
                )}

                <div className="sidebar-footer">
                    <Link href="/ice" onClick={onClose} className="sidebar-safety-link" title={language === 'ms' ? 'Profil ICE' : 'ICE profile'}>
                        <ShieldAlert className="h-4 w-4" />
                        <span>{language === 'ms' ? 'Profil ICE sedia' : 'ICE profile ready'}</span>
                    </Link>
                </div>
            </aside>
        </>
    );
}
