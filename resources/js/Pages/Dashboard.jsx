import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import Badge from '../Components/Badge';
import {
    Pill,
    Calendar,
    Stethoscope,
    Users,
    ShieldAlert,
    CheckCircle2,
    Clock,
    AlertCircle,
    ArrowRight,
    Sparkles,
    FileText,
    MapPin,
    PhoneCall,
    HeartPulse
} from 'lucide-react';

export default function Dashboard({ user, upcomingMeds, upcomingAppointments, caregiverSync, emergencySummary }) {
    const [medsState, setMedsState] = useState(upcomingMeds);

    const toggleMedication = (id) => {
        setMedsState(prev => prev.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
    };

    return (
        <AppLayout user={user}>
            <Head title="Papan Pemuka Kesihatan" />

            {/* Top Caregiver Sync Alert Banner */}
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-teal-950/80 via-slate-900 to-indigo-950/80 border border-teal-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500/30 shrink-0">
                        <Users className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">Caregiver Network Active</span>
                            <Badge variant="teal">2 Ahli Keluarga Connected</Badge>
                        </div>
                        <p className="text-xs text-slate-300">
                            Ahmad Azman (Anak) telah melihat log ubat anda 10 minit yang lalu.
                        </p>
                    </div>
                </div>
                <Link
                    href="/caregiver"
                    className="px-4 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-semibold flex items-center gap-2 transition-all shrink-0"
                >
                    Urus Caregiver <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            {/* Quick Action Feature Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Link href="/medications" className="glass-card glass-card-hover p-5 rounded-2xl flex flex-col justify-between group">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Pill className="w-5 h-5" />
                        </div>
                        <Badge variant="teal">Pagi / T'hari / Malam</Badge>
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-white mb-1">Ubat & Peringatan</h3>
                        <p className="text-xs text-slate-400">3 ubat perlu diambil hari ini.</p>
                    </div>
                </Link>

                <Link href="/appointments" className="glass-card glass-card-hover p-5 rounded-2xl flex flex-col justify-between group">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <Badge variant="indigo">6 Hari Lagi</Badge>
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-white mb-1">Temujanji Hospital</h3>
                        <p className="text-xs text-slate-400">Susulan Pakar Kardiologi HKL.</p>
                    </div>
                </Link>

                <Link href="/symptom-summariser" className="glass-card glass-card-hover p-5 rounded-2xl flex flex-col justify-between group border-emerald-500/30">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Stethoscope className="w-5 h-5" />
                        </div>
                        <Badge variant="emerald">Intake Doktor</Badge>
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-white mb-1">Symptom Summariser</h3>
                        <p className="text-xs text-slate-400">Ringkaskan simptom untuk doktor.</p>
                    </div>
                </Link>

                <Link href="/term-simplifier" className="glass-card glass-card-hover p-5 rounded-2xl flex flex-col justify-between group">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <Badge variant="amber">AI Explainer</Badge>
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-white mb-1">Mudahkan Istilah</h3>
                        <p className="text-xs text-slate-400">Terjemah laporan doktor mudah faham.</p>
                    </div>
                </Link>
            </div>

            {/* Main Grid Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (2 Cols): Medications + Appointments */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Today's Medications Schedule */}
                    <div className="glass-card p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Pill className="w-5 h-5 text-teal-400" />
                                    Jadual Ubat Hari Ini
                                </h3>
                                <p className="text-xs text-slate-400">Tanda sebagai telah diambil untuk mengemaskini status caregiver.</p>
                            </div>
                            <Link href="/medications" className="text-xs font-semibold text-teal-400 hover:underline">
                                Lihat Semua Ubat →
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {medsState.map((med) => (
                                <div
                                    key={med.id}
                                    className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                                        med.taken
                                            ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-300'
                                            : 'bg-slate-800/60 border-slate-700/60 text-white'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => toggleMedication(med.id)}
                                            className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                                                med.taken
                                                    ? 'bg-emerald-500 text-slate-950'
                                                    : 'border-2 border-slate-500 hover:border-teal-400'
                                            }`}
                                        >
                                            {med.taken && <CheckCircle2 className="w-4 h-4" />}
                                        </button>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className={`text-sm font-bold ${med.taken ? 'line-through text-slate-400' : 'text-white'}`}>
                                                    {med.name}
                                                </h4>
                                                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                                                    {med.dosage}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                                <Clock className="w-3.5 h-3.5 text-teal-400" />
                                                {med.timing}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => toggleMedication(med.id)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                            med.taken
                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                : 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-md'
                                        }`}
                                    >
                                        {med.taken ? 'Telah Dimakan' : 'Tanda Makan'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Hospital Appointments */}
                    <div className="glass-card p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-indigo-400" />
                                    Temujanji Hospital Terdekat
                                </h3>
                                <p className="text-xs text-slate-400">Peringatan automatik dihantar ke telefon anak/caregiver.</p>
                            </div>
                            <Link href="/appointments" className="text-xs font-semibold text-indigo-400 hover:underline">
                                Kalendar Temujanji →
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {upcomingAppointments.map((appt) => (
                                <div key={appt.id} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="indigo">{appt.daysLeft} Hari Lagi</Badge>
                                            <span className="text-xs text-slate-400">{appt.department}</span>
                                        </div>
                                        <h4 className="text-base font-bold text-white">{appt.title || appt.doctor}</h4>
                                        <p className="text-xs text-slate-300 flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                                            {appt.hospital}
                                        </p>
                                    </div>
                                    <div className="text-right flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 border-slate-700/50 pt-2 md:pt-0">
                                        <span className="text-sm font-bold text-teal-400">{appt.date}</span>
                                        <span className="text-xs text-slate-400">{appt.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column (1 Col): Emergency ICE & Quick Symptom Intake */}
                <div className="space-y-6">
                    {/* ICE Emergency Profile Snapshot Card */}
                    <div className="glass-card p-6 rounded-2xl border-rose-500/40 bg-gradient-to-b from-slate-900 to-rose-950/30">
                        <div className="flex items-center justify-between mb-4">
                            <span className="flex items-center gap-2 text-sm font-extrabold text-rose-400 uppercase tracking-wider">
                                <ShieldAlert className="w-5 h-5 text-rose-500" />
                                Profil Kecemasan (ICE)
                            </span>
                            <Badge variant="red">Lockscreen Ready</Badge>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div>
                                <span className="text-[11px] text-slate-400 uppercase tracking-wide">Penyakit Kronik:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {emergencySummary.conditions.map((cond, i) => (
                                        <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700 font-medium">
                                            {cond}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <span className="text-[11px] text-rose-400 uppercase tracking-wide">Alahan Ubat/Makanan (Strict):</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {emergencySummary.allergies.map((all, i) => (
                                        <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                                            ⚠️ {all}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-2 border-t border-slate-800">
                                <span className="text-[11px] text-slate-400 uppercase tracking-wide">Hubungi Jika Kecemasan:</span>
                                <p className="text-sm font-bold text-white mt-0.5">{emergencySummary.primaryICE}</p>
                            </div>
                        </div>

                        <Link
                            href="/ice"
                            className="block w-full py-2.5 text-center bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors"
                        >
                            Urus Maklumat Perubatan Kecemasan
                        </Link>
                    </div>

                    {/* Quick Doctor Consultation Symptom Summariser Promo */}
                    <div className="glass-card p-6 rounded-2xl border-emerald-500/30 bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/30">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-3">
                            <Stethoscope className="w-5 h-5" />
                        </div>
                        <h4 className="text-base font-bold text-white mb-1">Jumpa Doktor Hari Ini?</h4>
                        <p className="text-xs text-slate-300 leading-relaxed mb-4">
                            Isi apa yang anda rasa (tempoh, kesakitan, simptom) dan sistem akan menghasilkan ringkasan perenggan profesional untuk diserahkan terus kepada doktor.
                        </p>
                        <Link
                            href="/symptom-summariser"
                            className="block w-full py-2.5 text-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-colors"
                        >
                            Buat Ringkasan Simptom Doktor →
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
