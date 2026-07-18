import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Pill,
    Calendar,
    Sparkles,
    FileText,
    Users,
    Stethoscope,
    PhoneCall,
    ShieldAlert,
    X,
    HeartPulse
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
    const { url } = usePage();

    const navigation = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Ubat & Peringatan', href: '/medications', icon: Pill, badge: '3 Hari Ini' },
        { name: 'Temujanji Hospital', href: '/appointments', icon: Calendar, badge: '2 Mendatang' },
        { name: 'Symptom Summariser', href: '/symptom-summariser', icon: Stethoscope, highlight: true },
        { name: 'Mudahkan Istilah Perubatan', href: '/term-simplifier', icon: Sparkles },
        { name: 'Vault Dokumen & Insurans', href: '/documents', icon: FileText },
        { name: 'Caregiver / Family Sync', href: '/caregiver', icon: Users, badge: 'Synced' },
        { name: 'Talian Kecemasan & SOS', href: '/emergency-sos', icon: PhoneCall, sos: true },
        { name: 'Profil Kecemasan (ICE)', href: '/ice', icon: ShieldAlert },
    ];

    const isActive = (href) => {
        if (href === '/') return url === '/';
        return url.startsWith(href);
    };

    return (
        <>
            {/* Mobile backdrop overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm md:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-slate-900 border-r border-slate-800 transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col justify-between`}>
                <div>
                    {/* Brand Logo & Header */}
                    <div className="flex items-center justify-between h-20 px-6 border-b border-slate-800/80">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 font-black shadow-lg shadow-teal-500/25">
                                <HeartPulse className="w-6 h-6 stroke-[2.5]" />
                            </div>
                            <div>
                                <span className="text-xl font-extrabold tracking-tight text-white font-heading">
                                    Medi<span className="text-teal-400">Sync</span>
                                </span>
                                <span className="block text-[10px] uppercase font-bold text-teal-400 tracking-wider">Healthcare & Caregiver</span>
                            </div>
                        </Link>
                        <button
                            onClick={onClose}
                            className="p-1 text-slate-400 rounded-lg md:hidden hover:text-white hover:bg-slate-800"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-160px)]">
                        <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                            Utama & Penjagaan
                        </div>
                        {navigation.map((item) => {
                            const active = isActive(item.href);
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                                        active
                                            ? item.sos
                                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold shadow-lg shadow-rose-950/50'
                                                : 'bg-teal-500/15 text-teal-300 border border-teal-500/30 font-semibold shadow-lg shadow-teal-950/40'
                                            : item.sos
                                                ? 'text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 border border-rose-500/20'
                                                : item.highlight
                                                    ? 'text-emerald-300 hover:bg-emerald-500/10 border border-emerald-500/20'
                                                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className={`w-5 h-5 ${active ? (item.sos ? 'text-rose-400' : 'text-teal-400') : (item.sos ? 'text-rose-400' : 'text-slate-400')}`} />
                                        <span>{item.name}</span>
                                    </div>
                                    {item.badge && (
                                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                                            active
                                                ? 'bg-teal-400 text-slate-950'
                                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                                        }`}>
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Quick ICE Emergency Card Footer */}
                <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-slate-800/90 to-rose-950/40 border border-rose-500/30">
                    <div className="flex items-center justify-between mb-2">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-rose-400 uppercase tracking-wide">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                            Mod ICE Kecemasan
                        </span>
                        <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded font-mono">ICE-9821-MY</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mb-3 leading-snug">
                        Kad maklumat perubatan pantas sekiranya pengsan atau tidak sedarkan diri.
                    </p>
                    <Link
                        href="/ice/public/ICE-9821-MY"
                        className="block text-center w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors"
                    >
                        Buka Lockscreen ICE
                    </Link>
                </div>
            </aside>
        </>
    );
}
