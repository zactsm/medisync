import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';

export default function AppLayout({ children, user, surface = 'premium' }) {
    const surfaceClass = surface === 'dashboard' ? 'dashboard-surface' : 'standard-surface';
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        const removeStartListener = router.on('start', () => setIsNavigating(true));
        const removeFinishListener = router.on('finish', () => setIsNavigating(false));

        return () => {
            removeStartListener();
            removeFinishListener();
        };
    }, []);

    return (
        <div className={`medisync-app min-h-screen text-ink relative ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            <div
                className={`navigation-progress ${isNavigating ? 'is-active' : ''}`}
                role="progressbar"
                aria-label="Loading page"
                aria-valuetext={isNavigating ? 'Loading page' : 'Page loaded'}
            >
                <span />
            </div>
            <Sidebar
                collapsed={sidebarCollapsed}
                mobileOpen={mobileSidebarOpen}
                onClose={() => setMobileSidebarOpen(false)}
            />

            <div className="app-main-shell">
                <Header
                    user={user}
                    sidebarCollapsed={sidebarCollapsed}
                    onToggleSidebar={() => setSidebarCollapsed((current) => !current)}
                    onOpenSidebar={() => setMobileSidebarOpen(true)}
                />

                <div className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-[1540px] flex-col px-4 py-5 sm:px-6 lg:px-10 lg:py-8">
                    <main className="flex-1 min-w-0">
                        <div className={`page-surface premium-surface ${surfaceClass}`}>
                            {children}
                        </div>
                    </main>

                    <footer className="pt-8 text-center text-xs text-ink/45">
                        <p>2026 MediSync · Smarter health coordination for every family.</p>
                    </footer>
                </div>
            </div>

        </div>
    );
}
