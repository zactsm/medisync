import React from 'react';
import { Head } from '@inertiajs/react';
import EmergencyLayout from '../Layouts/EmergencyLayout';
import Badge from '../Components/Badge';
import {
    ShieldAlert,
    PhoneCall,
    AlertTriangle,
    Pill,
    HeartPulse,
    UserCheck,
    CheckCircle2,
    Lock
} from 'lucide-react';

export default function PublicICE({ code, emergencyData }) {
    return (
        <EmergencyLayout>
            <Head title={`KECEMASAN ICE - ${emergencyData.name}`} />

            {/* Top Red Emergency Notice */}
            <div className="mb-6 p-4 rounded-2xl bg-rose-950/90 border border-rose-500 text-center glow-red">
                <div className="flex items-center justify-center gap-2 text-rose-400 font-extrabold text-xs uppercase tracking-wider mb-1">
                    <ShieldAlert className="w-5 h-5 animate-pulse" />
                    MAKLUMAT PERUBATAN KECEMASAN (ICE PROFILE)
                </div>
                <h2 className="text-2xl font-black text-white">{emergencyData.name}</h2>
                <p className="text-xs text-rose-200 mt-0.5 font-medium">
                    Umur: {emergencyData.age} Tahun • Kumpulan Darah: <strong className="text-white font-mono bg-rose-900 px-2 py-0.5 rounded text-sm">{emergencyData.blood_type}</strong> • Penderma Organ: {emergencyData.organ_donor ? 'BERIKRAR' : 'TIDAK'}
                </p>
            </div>

            {/* Direct Call ICE Contacts Buttons */}
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                    href={`tel:${emergencyData.emergencyContactPhone}`}
                    className="p-5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm flex items-center justify-between shadow-xl shadow-rose-950/80 transition-all border-2 border-rose-400/50"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-900 flex items-center justify-center">
                            <PhoneCall className="w-5 h-5 text-white animate-bounce" />
                        </div>
                        <div>
                            <span className="text-[10px] uppercase font-bold text-rose-200">HUBUNGI WARIS UTAMA</span>
                            <div className="text-base font-black">{emergencyData.emergencyContactName}</div>
                        </div>
                    </div>
                    <span className="text-xs font-mono bg-rose-900 px-3 py-1.5 rounded-lg border border-rose-400/40">
                        PANGGIL SEKARANG
                    </span>
                </a>

                <a
                    href={`tel:${emergencyData.secondaryContactPhone}`}
                    className="p-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-between shadow-lg transition-all border border-slate-700"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                            <PhoneCall className="w-5 h-5 text-teal-400" />
                        </div>
                        <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400">WARIS KEDUA</span>
                            <div className="text-sm font-bold text-white">{emergencyData.secondaryContactName}</div>
                        </div>
                    </div>
                    <span className="text-xs font-mono bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300">
                        {emergencyData.secondaryContactPhone}
                    </span>
                </a>
            </div>

            {/* Life-Saving Medical Data Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* STRICT ALLERGY WARNING CARD */}
                <div className="glass-card p-6 rounded-2xl border-rose-500/50 bg-slate-900/90">
                    <h3 className="text-sm font-extrabold text-rose-400 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-rose-500/30 pb-3">
                        <AlertTriangle className="w-5 h-5 text-rose-500" />
                        AMARAN ALAHAN STRUKTUR (STRICT ALLERGIES)
                    </h3>

                    <div className="space-y-2">
                        {emergencyData.severeAllergies?.map((all, i) => (
                            <div key={i} className="p-3 rounded-xl bg-rose-950/60 border border-rose-500 text-xs font-extrabold text-rose-200 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" /> {all}
                            </div>
                        ))}
                    </div>
                </div>

                {/* CRITICAL MEDICAL CONDITIONS & MEDICATIONS */}
                <div className="glass-card p-6 rounded-2xl border-slate-700/80 bg-slate-900/90 space-y-4">
                    <div>
                        <h3 className="text-sm font-extrabold text-teal-400 uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-slate-800 pb-3">
                            <HeartPulse className="w-5 h-5 text-teal-400" />
                            Penyakit Kronik & Sejarah Perubatan
                        </h3>
                        <div className="space-y-1.5">
                            {emergencyData.criticalConditions?.map((cond, i) => (
                                <div key={i} className="p-2.5 rounded-lg bg-slate-800 text-xs font-bold text-white border border-slate-700">
                                    • {cond}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-2">
                        <h4 className="text-xs uppercase font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                            <Pill className="w-4 h-4 text-teal-400" /> Ubat Aktif Yang Sedang Diambil:
                        </h4>
                        <div className="space-y-1.5">
                            {emergencyData.activeMedications?.map((med, i) => (
                                <div key={i} className="p-2 rounded-lg bg-slate-950 text-xs font-mono text-emerald-300 border border-slate-800">
                                    {med}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Privacy Shield Notice */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center flex items-center justify-center gap-2 text-xs text-slate-400">
                <Lock className="w-4 h-4 text-teal-400" />
                Mod Akses Terhad Kecemasan. Dokumen kewangan & peribadi disembunyikan bagi melindungi privasi pesakit.
            </div>
        </EmergencyLayout>
    );
}
