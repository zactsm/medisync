import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { User, Users, ArrowRight, Heart, AlertCircle, RefreshCw } from 'lucide-react';

export default function Auth({ patients = [], caregivers = [] }) {
    const [activeTab, setActiveTab] = useState('patient');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const handleBypass = async (email) => {
        setBusy(true);
        setError('');
        try {
            const response = await fetch('/auth/bypass', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content
                },
                body: JSON.stringify({ email })
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.message || 'Gagal log masuk. Sila cuba lagi.');
            } else {
                window.location.href = '/';
            }
        } catch (err) {
            setError('Ralat rangkaian. Sila pastikan sambungan internet dan database (Supabase) anda aktif.');
        } finally {
            setBusy(false);
        }
    };

    const selectedUsers = activeTab === 'patient' ? patients : caregivers;

    return (
        <>
            <Head title="Log Masuk Pantas - MediSync" />
            <main className="min-h-screen bg-canvas flex items-center justify-center p-6 relative overflow-hidden">
                {/* Visual Background Elements */}
                <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-teal-500/5 blur-3xl pointer-events-none" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[35rem] h-[35rem] rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

                <div className="w-full max-w-2xl glass-card rounded-3xl p-6 md:p-10 shadow-2xl border border-ink/10 relative z-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-black text-ink tracking-tight">
                            Medi<span className="text-teal-600">Sync</span>
                        </h1>
                        <p className="mt-1.5 text-[10px] md:text-xs text-ink/60 font-semibold tracking-widest uppercase">
                            Sistem Pengurusan Kesihatan Pintar Keluarga
                        </p>
                        <div className="w-12 h-1 bg-teal-600 mx-auto mt-3 rounded-full" />
                    </div>

                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold text-ink">Log Masuk Pantas (Quick Access Selector)</h2>
                        <p className="text-xs md:text-sm text-ink/60 mt-1">
                            Pilih profil dari senarai di bawah untuk log masuk secara terus.
                        </p>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex border-b border-ink/10 mb-6 gap-2">
                        <button
                            type="button"
                            onClick={() => { setActiveTab('patient'); setError(''); }}
                            className={`flex-1 pb-3 text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                                activeTab === 'patient' 
                                    ? 'text-teal-600 font-extrabold border-b-2 border-teal-600' 
                                    : 'text-ink/50 hover:text-ink/80'
                            }`}
                        >
                            <Heart className="w-4 h-4" />
                            <span>Pesakit ({patients.length})</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => { setActiveTab('caregiver'); setError(''); }}
                            className={`flex-1 pb-3 text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                                activeTab === 'caregiver' 
                                    ? 'text-indigo-600 font-extrabold border-b-2 border-indigo-600' 
                                    : 'text-ink/50 hover:text-ink/80'
                            }`}
                        >
                            <Users className="w-4 h-4" />
                            <span>Penjaga ({caregivers.length})</span>
                        </button>
                    </div>

                    {/* Users Selector list */}
                    {selectedUsers.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                            {selectedUsers.map((u) => (
                                <button
                                    key={u.id}
                                    disabled={busy}
                                    onClick={() => handleBypass(u.email)}
                                    className={`text-left p-4 rounded-xl bg-surface/50 dark:bg-canvas/50 border border-ink/10 hover:shadow-md transition-all duration-200 group flex items-center justify-between cursor-pointer disabled:opacity-50 ${
                                        activeTab === 'patient' ? 'hover:border-teal-500/50' : 'hover:border-indigo-500/50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                                            activeTab === 'patient' ? 'bg-teal-500/10 text-teal-600' : 'bg-indigo-500/10 text-indigo-600'
                                        }`}>
                                            <User className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-sm font-bold text-ink truncate group-hover:text-teal-600 transition-colors">
                                                {u.name}
                                            </h4>
                                            <p className="text-[10px] text-ink/55 truncate">
                                                {u.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`flex items-center shrink-0 ${
                                        activeTab === 'patient' ? 'text-teal-600' : 'text-indigo-600'
                                    } opacity-0 group-hover:opacity-100 transition-opacity ml-2`}>
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 px-4 rounded-2xl bg-amber-500/5 border border-amber-500/15">
                            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                            <h3 className="text-sm font-bold text-ink mb-1">Tiada Pengguna Ditemui</h3>
                            <p className="text-xs text-ink/75 max-w-md mx-auto leading-relaxed">
                                Database anda kosong atau tidak dapat dihubungi. Sila pastikan server database Supabase anda berjalan, dan jalankan <strong>Query Seeding</strong> yang diberikan di chat.
                            </p>
                        </div>
                    )}

                    {/* Error message */}
                    {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 text-center font-semibold mt-6 flex items-center justify-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="text-center text-[10px] text-ink/40 font-bold uppercase tracking-wider mt-8 border-t border-ink/5 pt-4">
                        MediSync • Pilihan Pintar Penjagaan Kesihatan
                    </div>
                </div>
            </main>
        </>
    );
}
