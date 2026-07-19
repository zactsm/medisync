import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { supabase } from '../lib/supabase';
import LanguageSelector from './LanguageSelector';
import ThemeToggle from './ThemeToggle';
import { useLanguage } from '../lib/language';
import {
    Bell,
    ChevronDown,
    PanelLeftClose,
    PanelLeftOpen,
} from 'lucide-react';

export default function Header({ user, sidebarCollapsed, onToggleSidebar, onOpenSidebar }) {
    const { props } = usePage();
    const notifications = props.notifications || [];
    const { t } = useLanguage();
    const [activePanel, setActivePanel] = useState(null);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const initials = (user?.name || 'MediSync')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();

    const togglePanel = (panel) => setActivePanel((current) => current === panel ? null : panel);

    const handleSidebarControl = () => {
        if (typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches) {
            onOpenSidebar?.();
            return;
        }

        onToggleSidebar?.();
    };

    const handleSignOut = async () => {
        if (isSigningOut) return;

        setIsSigningOut(true);
        try {
            await supabase?.auth.signOut();
            const response = await fetch('/logout', {
                method: 'POST',
                credentials: 'same-origin',
                headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content },
            });

            if (!response.ok) throw new Error(`Logout failed with status ${response.status}`);
            window.location.href = '/login';
        } catch (error) {
            console.error('Sign out failed:', error);
            setIsSigningOut(false);
        }
    };

    return (
        <header className="premium-header sticky top-0 z-30 border-b border-ink/8 bg-canvas/85 px-4 backdrop-blur-xl sm:px-6 lg:px-10">
            <div className="header-inner mx-auto flex min-h-[72px] w-full max-w-[1540px] items-center gap-3">
                <button
                    type="button"
                    className="sidebar-toggle-button"
                    onClick={handleSidebarControl}
                    aria-label={sidebarCollapsed ? t('header.expandSidebar') : t('header.collapseSidebar')}
                    aria-expanded={!sidebarCollapsed}
                    title={sidebarCollapsed ? t('header.expandSidebar') : t('header.collapseSidebar')}
                >
                    {sidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                </button>

                <div className="ml-auto flex items-center gap-2">
                    <LanguageSelector />
                    <ThemeToggle />

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => togglePanel('notifications')}
                            className="icon-button"
                            aria-label={t('header.notifications')}
                            aria-expanded={activePanel === 'notifications'}
                        >
                            <Bell className="h-4 w-4" />
                            {notifications.some((item) => !item.read) && <span className="notification-dot" />}
                        </button>
                        {activePanel === 'notifications' && (
                            <div className="utility-popover right-0 w-72">
                                <p className="popover-kicker">{t('header.notifications')}</p>
                                {notifications.length ? notifications.map((item) => <div key={item.id} className="border-b border-ink/10 py-2 last:border-0"><p className="text-sm font-semibold text-ink">{item.title}</p><p className="mt-1 text-xs leading-5 text-ink/55">{item.body}</p><p className="mt-1 text-[10px] text-ink/40">{item.createdAt}</p></div>) : <p className="text-sm text-ink/55">{t('header.noNotifications')}</p>}
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => togglePanel('profile')}
                            className="profile-button"
                            aria-label={t('header.profile')}
                            aria-expanded={activePanel === 'profile'}
                        >
                            <span className="avatar avatar-small">{initials}</span>
                            <ChevronDown className="hidden h-3.5 w-3.5 text-ink/50 sm:block" />
                        </button>
                        {activePanel === 'profile' && (
                            <div className="utility-popover right-0 w-60">
                                <p className="popover-kicker">{t('header.profile')}</p>
                                <p className="text-sm font-semibold text-ink">{user?.name || 'MediSync patient'}</p>
                                <p className="mt-1 text-xs text-ink/55">{user?.role || 'Patient'} · {user?.blood_type || 'O+'}</p>
                                <Link href="/ice" className="popover-action mt-4">{t('header.viewEmergency')} <span>→</span></Link>
                                <button
                                    type="button"
                                    onClick={handleSignOut}
                                    className="profile-menu-action profile-signout"
                                    disabled={isSigningOut}
                                    aria-busy={isSigningOut}
                                >
                                    {isSigningOut ? t('header.signingOut') : t('header.signOut')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
