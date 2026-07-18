import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Menu, Bell, ShieldAlert, PhoneCall, UserCheck, ChevronDown } from 'lucide-react';

export default function Header({ onMenuClick, user }) {
    const [viewMode, setViewMode] = useState('Patient');

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-4 md:px-8 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
            {/* Mobile menu toggle button */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 text-slate-400 rounded-xl md:hidden hover:text-white hover:bg-slate-800 transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>

                <div>
                    <h2 className="text-lg font-bold text-slate-100 hidden sm:block">
                        Selamat Datang, <span className="text-teal-400">{user?.name || 'Hajah Fatimah'}</span>
                    </h2>
                    <p className="text-xs text-slate-400 hidden sm:block">
                        Kesihatan & Penjagaan Terkawal • Umur {user?.age || 64} tahun • Darah {user?.blood_type || 'O+'}
                    </p>
                </div>
            </div>

            {/* Right Quick Actions Header Bar */}
            <div className="flex items-center gap-3">
                {/* Caregiver Sync Switcher */}
                <div className="hidden lg:flex items-center gap-2 p-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    <button
                        onClick={() => setViewMode('Patient')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            viewMode === 'Patient'
                                ? 'bg-teal-500 text-slate-950 shadow-md font-bold'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        <UserCheck className="w-3.5 h-3.5" />
                        Mod Pesakit
                    </button>
                    <button
                        onClick={() => setViewMode('Caregiver')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            viewMode === 'Caregiver'
                                ? 'bg-indigo-500 text-white shadow-md font-bold'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        <UserCheck className="w-3.5 h-3.5" />
                        Mod Caregiver (Anak)
                    </button>
                </div>

                {/* Notifications badge */}
                <button className="relative p-2.5 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60 transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-teal-400 rounded-full ring-4 ring-slate-900"></span>
                </button>

                {/* One-Tap SOS Emergency Call */}
                <Link
                    href="/emergency-sos"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs tracking-wide shadow-lg shadow-rose-950/60 transition-all pulse-sos"
                >
                    <PhoneCall className="w-4 h-4 animate-bounce" />
                    <span className="hidden sm:inline">SOS KECEMASAN</span>
                    <span className="sm:hidden">SOS</span>
                </Link>
            </div>
        </header>
    );
}
