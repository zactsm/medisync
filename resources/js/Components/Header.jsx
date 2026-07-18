import React, { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { supabase } from '../lib/supabase';
import {
    Bell,
    ChevronDown,
    FileText,
    HeartPulse,
    LayoutDashboard,
    Menu,
    Moon,
    Pill,
    Settings,
    ShieldAlert,
    Stethoscope,
    Sun,
    Users,
    X,
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', malay: 'Papan utama', href: '/', icon: LayoutDashboard },
    { name: 'Medications', malay: 'Ubat', href: '/medications', icon: Pill },
    { name: 'Appointments', malay: 'Temujanji', href: '/appointments', icon: Stethoscope },
    { name: 'Caregiver', malay: 'Penjaga', href: '/caregiver', icon: Users },
    { name: 'Documents', malay: 'Dokumen', href: '/documents', icon: FileText },
    { name: 'Health tools', malay: 'Alat kesihatan', href: '/symptom-summariser', icon: HeartPulse },
    { name: 'Emergency', malay: 'Kecemasan', href: '/ice', icon: ShieldAlert },
];

export default function Header({ user }) {
    const { props } = usePage();
    const notifications = props.notifications || [];
    const { url } = usePage();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [activePanel, setActivePanel] = useState(null);
    const [theme, setTheme] = useState(() => {
        if (typeof window === 'undefined') return 'light';
        try {
            return window.localStorage.getItem('medisync-theme') === 'dark' ? 'dark' : 'light';
        } catch (error) {
            return 'light';
        }
    });

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        try {
            window.localStorage.setItem('medisync-theme', theme);
        } catch (error) {
            // Theme preference is optional; the current session still follows the toggle.
        }
    }, [theme]);

    const isActive = (href) => href === '/' ? url === '/' : url.startsWith(href);
    const initials = (user?.name || 'MediSync')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();

    const togglePanel = (panel) => setActivePanel((current) => current === panel ? null : panel);

    return (
        <header className="premium-header sticky top-0 z-40 border-b border-ink/8 bg-canvas/85 px-4 backdrop-blur-xl sm:px-6 lg:px-10">
            <div className="mx-auto flex min-h-[84px] w-full max-w-[1540px] items-center gap-4">
                <Link href="/" className="brand-mark shrink-0" aria-label="MediSync home">
                    <span className="brand-icon"><HeartPulse className="h-4 w-4" /></span>
                    <span className="brand-wordmark">Medi<span>Sync</span></span>
                </Link>

                <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 xl:flex" aria-label="Primary navigation">
                    {navigation.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`nav-pill ${active ? 'nav-pill-active' : ''}`}
                                aria-current={active ? 'page' : undefined}
                            >
                                <span>{item.name}</span>
                                <small>{item.malay}</small>
                            </Link>
                        );
                    })}
                </nav>

                <div className="ml-auto flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
                        className="theme-button"
                        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        aria-pressed={theme === 'dark'}
                        title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
                    >
                        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </button>

                    <div className="relative hidden sm:block">
                        <button
                            type="button"
                            onClick={() => togglePanel('settings')}
                            className="utility-button"
                            aria-label="Open settings"
                            aria-expanded={activePanel === 'settings'}
                        >
                            <Settings className="h-4 w-4" />
                            <span className="hidden 2xl:inline">Settings</span>
                        </button>
                        {activePanel === 'settings' && (
                            <div className="utility-popover right-0 w-64">
                                <p className="popover-kicker">Preferences / Keutamaan</p>
                                <div className="popover-row"><span>Premium canvas</span><span className="status-dot" /></div>
                                <div className="popover-row"><span>Notifications</span><span className="text-xs text-ink/45">On</span></div>
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => togglePanel('notifications')}
                            className="icon-button"
                            aria-label="Open notifications"
                            aria-expanded={activePanel === 'notifications'}
                        >
                            <Bell className="h-4 w-4" />
                            {notifications.some((item) => !item.read) && <span className="notification-dot" />}
                        </button>
                        {activePanel === 'notifications' && (
                            <div className="utility-popover right-0 w-72">
                                <p className="popover-kicker">Notifications / Pemberitahuan</p>
                                {notifications.length ? notifications.map((item) => <div key={item.id} className="border-b border-ink/10 py-2 last:border-0"><p className="text-sm font-semibold text-ink">{item.title}</p><p className="mt-1 text-xs leading-5 text-ink/55">{item.body}</p><p className="mt-1 text-[10px] text-ink/40">{item.createdAt}</p></div>) : <p className="text-sm text-ink/55">No notifications yet.</p>}
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => togglePanel('profile')}
                            className="profile-button"
                            aria-label="Open profile menu"
                            aria-expanded={activePanel === 'profile'}
                        >
                            <span className="avatar avatar-small">{initials}</span>
                            <ChevronDown className="hidden h-3.5 w-3.5 text-ink/50 sm:block" />
                        </button>
                        {activePanel === 'profile' && (
                            <div className="utility-popover right-0 w-60">
                                <p className="popover-kicker">Profile / Profil</p>
                                <p className="text-sm font-semibold text-ink">{user?.name || 'MediSync patient'}</p>
                                <p className="mt-1 text-xs text-ink/55">{user?.role || 'Patient'} · {user?.blood_type || 'O+'}</p>
                                <Link href="/ice" className="popover-action mt-4">View emergency profile <span>→</span></Link>
                                <button type="button" onClick={async () => { await supabase?.auth.signOut(); await fetch('/logout', { method: 'POST', credentials: 'same-origin', headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content } }); window.location.href = '/login'; }} className="mt-3 w-full rounded-lg border border-red-200 px-3 py-2 text-left text-xs font-bold text-red-600">Sign out</button>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => setMobileNavOpen((open) => !open)}
                        className="icon-button xl:hidden"
                        aria-label={mobileNavOpen ? 'Close navigation' : 'Open navigation'}
                        aria-expanded={mobileNavOpen}
                    >
                        {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            {mobileNavOpen && (
                <nav className="mobile-nav xl:hidden" aria-label="Mobile navigation">
                    {navigation.map((item) => {
                        const active = isActive(item.href);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileNavOpen(false)}
                                className={`mobile-nav-link ${active ? 'mobile-nav-link-active' : ''}`}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{item.name}</span>
                                <small>{item.malay}</small>
                            </Link>
                        );
                    })}
                </nav>
            )}
        </header>
    );
}
