import React from 'react';
import { HeartPulse, PhoneCall } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function EmergencyLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 md:p-8">
            <header className="flex items-center justify-between py-4 border-b border-rose-500/30 max-w-4xl w-full mx-auto">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-lg glow-red">
                        <HeartPulse className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold text-white">MediSync <span className="text-rose-400">ICE EMERGENCY</span></h1>
                        <p className="text-xs text-rose-300 font-medium">Limited-Access Emergency Medical Profile</p>
                    </div>
                </div>

                <Link href="/" className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold">
                    ← Kembali ke Aplikasi
                </Link>
            </header>

            <main className="flex-1 my-6 max-w-4xl w-full mx-auto">
                {children}
            </main>

            <footer className="text-center py-4 text-xs text-slate-500 border-t border-slate-900 max-w-4xl w-full mx-auto">
                MediSync ICE - Mod Akses Terhad Kebenaran Khas Pegawai Perubatan / Kecemasan
            </footer>
        </div>
    );
}
