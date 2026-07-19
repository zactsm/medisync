import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { User, Users, ArrowRight, Heart, AlertCircle, ShieldAlert } from 'lucide-react';

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
            setError('Ralat rangkaian. Sila pastikan sambungan internet dan database anda aktif.');
        } finally {
            setBusy(false);
        }
    };

    const selectedUsers = activeTab === 'patient' ? patients : caregivers;

    return (
        <>
            <Head title="Log Masuk - MediSync" />
            <main className="min-h-screen bg-canvas flex items-center justify-center p-6 relative overflow-hidden">
                {/* Visual Background Elements - Saffron Glowing Accents */}
                <div className="absolute top-[-10%] right-[-10%] w-[45rem] h-[45rem] rounded-full bg-saffron/12 blur-3xl pointer-events-none" />
                <div className="absolute bottom-[-15%] left-[-15%] w-[40rem] h-[40rem] rounded-full bg-saffron/8 blur-3xl pointer-events-none" />

                <div className="w-full max-w-xl glass-card rounded-3xl p-8 md:p-10 shadow-2xl border border-ink/8 bg-surface/85 backdrop-blur-xl relative z-10">
                    {/* Header Brand */}
                    <div className="text-center mb-8 flex flex-col items-center">
                        <div className="flex items-center gap-2.5 mb-2">
                            <span className="inline-flex items-center justify-center w-10 h-10 text-slate-950 bg-saffron rounded-xl shadow-lg shadow-yellow-500/30">
                                <Heart className="w-5 h-5 fill-slate-950" />
                            </span>
                            <span className="text-2xl font-black text-ink tracking-tight font-heading">
                                Medi<span className="text-yellow-600">Sync</span>
                            </span>
                        </div>
                        <p className="text-[10px] md:text-xs text-ink/50 font-bold tracking-widest mt-1">
                            Sistem Pengurusan Kesihatan Pintar Keluarga
                        </p>
                        <div className="w-12 h-1 bg-saffron mx-auto mt-4 rounded-full shadow-sm" />
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-xl font-extrabold text-ink tracking-tight">Log Masuk Pantas (Quick Access)</h2>
                        <p className="text-xs md:text-sm text-ink/60 mt-1.5 leading-relaxed">
                            Pilih profil dari senarai di bawah untuk log masuk ke sistem MediSync anda.
                        </p>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex border-b border-ink/8 mb-6 gap-2">
                        <button
                            type="button"
                            onClick={() => { setActiveTab('patient'); setError(''); }}
                            className={`flex-1 pb-3 text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                activeTab === 'patient' 
                                    ? 'text-yellow-600 font-extrabold border-b-2 border-yellow-500' 
                                    : 'text-ink/50 hover:text-ink/80'
                            }`}
                        >
                            <Heart className={`w-4 h-4 ${activeTab === 'patient' ? 'fill-yellow-600' : ''}`} />
                            <span>Pesakit ({patients.length})</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => { setActiveTab('caregiver'); setError(''); }}
                            className={`flex-1 pb-3 text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                activeTab === 'caregiver' 
                                    ? 'text-yellow-600 font-extrabold border-b-2 border-yellow-500' 
                                    : 'text-ink/50 hover:text-ink/80'
                            }`}
                        >
                            <Users className="w-4 h-4" />
                            <span>Penjaga ({caregivers.length})</span>
                        </button>
                    </div>

                    {/* Users Selector list */}
                    {selectedUsers.length > 0 ? (
                        <div className="space-y-3.5 max-h-[340px] overflow-y-auto pr-1">
                            {selectedUsers.map((u) => (
                                <button
                                    key={u.id}
                                    disabled={busy}
                                    onClick={() => handleBypass(u.email)}
                                    className="w-full text-left p-4 rounded-2xl bg-surface/50 dark:bg-canvas/50 border border-ink/8 hover:border-yellow-500 hover:shadow-md hover:shadow-yellow-500/5 transition-all duration-200 group flex items-center justify-between cursor-pointer disabled:opacity-50"
                                >
                                    <div className="flex items-center gap-3.5 min-w-0">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-yellow-500/10 text-yellow-600 group-hover:bg-saffron group-hover:text-slate-950 transition-colors shadow-sm">
                                            <User className="w-4.5 h-4.5" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-sm font-extrabold text-ink truncate group-hover:text-yellow-600 transition-colors">
                                                {u.name}
                                            </h4>
                                            <p className="text-[11px] text-ink/50 truncate font-mono mt-0.5">
                                                {u.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center shrink-0 text-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                        <ArrowRight className="w-4.5 h-4.5" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 px-4 rounded-2xl bg-yellow-500/5 border border-yellow-500/15">
                            <AlertCircle className="w-10 h-10 text-yellow-600 mx-auto mb-3" />
                            <h3 className="text-sm font-bold text-ink mb-1">Tiada Pengguna Ditemui</h3>
                            <p className="text-xs text-ink/75 max-w-md mx-auto leading-relaxed">
                                Database anda kosong atau tidak dapat dihubungi. Sila pastikan database SQLite/PostgreSQL anda aktif, dan jalankan <strong>Query Seeding</strong> (seeder database) untuk menjana maklumat.
                            </p>
                        </div>
                    )}

                    {/* Error message */}
                    {error && (
                        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 text-center font-bold mt-6 flex items-center justify-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="text-center text-[10px] text-ink/40 font-bold tracking-widest mt-8 border-t border-ink/8 pt-4">
                        MediSync • Pilihan Pintar Penjagaan Kesihatan
                    </div>
                </div>
            </main>
        </>
    );
}
