import React from 'react';
import Header from '../Components/Header';

export default function AppLayout({ children, user, surface = 'premium' }) {
    const surfaceClass = surface === 'dashboard' ? 'dashboard-surface' : 'standard-surface';

    return (
        <div className="medisync-app min-h-screen text-ink">
            <Header user={user} />

            <div className="mx-auto flex min-h-[calc(100vh-84px)] w-full max-w-[1540px] flex-col px-4 py-5 sm:px-6 lg:px-10 lg:py-8">
                <main className="flex-1 min-w-0">
                    <div className={`page-surface premium-surface ${surfaceClass}`}>
                        {children}
                    </div>
                </main>

                <footer className="pt-8 text-center text-xs text-ink/45">
                    <p>© 2026 MediSync · Smarter health coordination for every family.</p>
                </footer>
            </div>
        </div>
    );
}
