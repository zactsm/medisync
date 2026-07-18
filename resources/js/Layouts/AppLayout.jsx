import React, { useState } from 'react';
import Sidebar from '../Components/Sidebar';
import Header from '../Components/Header';

export default function AppLayout({ children, user }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex">
            {/* Navigation Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content Area */}
            <div className="flex-1 md:pl-72 flex flex-col min-w-0">
                <Header onMenuClick={() => setSidebarOpen(true)} user={user} />

                <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
                    {children}
                </main>

                <footer className="py-6 px-8 text-center text-xs text-slate-500 border-t border-slate-900">
                    <p>© 2026 MediSync. Platform Pengurusan Kesihatan & Caregiver Keluarga.</p>
                </footer>
            </div>
        </div>
    );
}
