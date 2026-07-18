import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import Badge from '../Components/Badge';
import Modal from '../Components/Modal';
import {
    Pill,
    Plus,
    Clock,
    CheckCircle2,
    AlertTriangle,
    Calendar,
    Flame,
    RotateCcw,
    Sparkles,
    UserCheck,
    Check
} from 'lucide-react';

export default function Medications({ user, medications: initialMedications, adherenceRate, streakDays }) {
    const [meds, setMeds] = useState(initialMedications);
    const [filterTime, setFilterTime] = useState('All');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newMed, setNewMed] = useState({
        name: '',
        category: 'Blood Pressure',
        dosage: '10mg',
        instructions: 'Take after meal',
        timeOfDay: 'Morning',
        time: '08:00 AM',
        pillsLeft: 30
    });

    const toggleTaken = async (id) => {
        const response = await fetch(`/api/medications/${id}/log`, { method: 'POST', credentials: 'same-origin', headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content, 'Accept': 'application/json' } });
        if (response.ok) setMeds(prev => prev.map(m => m.id === id ? { ...m, takenToday: !m.takenToday } : m));
    };

    const filteredMeds = meds.filter(m => filterTime === 'All' || m.timeOfDay === filterTime);

    const handleAddMedication = async (e) => {
        e.preventDefault();
        if (!newMed.name) return;
        const response = await fetch('/api/medications', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content, 'Accept': 'application/json' }, body: JSON.stringify({ ...newMed, time: newMed.time }) });
        if (!response.ok) return;
        const created = await response.json();
        setMeds([created, ...meds]);
        setIsAddModalOpen(false);
        setNewMed({
            name: '',
            category: 'Blood Pressure',
            dosage: '10mg',
            instructions: 'Take after meal',
            timeOfDay: 'Morning',
            time: '08:00 AM',
            pillsLeft: 30
        });
    };

    return (
        <AppLayout user={user}>
            <Head title="Pengurusan Ubat & Peringatan" />

            {/* Top Stat Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
                    <div>
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Kadar Pematuhan</span>
                        <div className="text-2xl font-black text-emerald-400 mt-1">{adherenceRate}%</div>
                        <p className="text-[11px] text-slate-400 mt-0.5">Ubat diambil mengikut jadual</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center glow-emerald">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                </div>

                <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
                    <div>
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Streak Konsisten</span>
                        <div className="text-2xl font-black text-amber-400 mt-1">{streakDays} Hari</div>
                        <p className="text-[11px] text-slate-400 mt-0.5">Berturut-turut tanpa tertinggal</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                        <Flame className="w-6 h-6" />
                    </div>
                </div>

                <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
                    <div>
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Sync Caregiver</span>
                        <div className="text-base font-bold text-teal-400 mt-1">Automatik Synced</div>
                        <p className="text-[11px] text-slate-400 mt-0.5">Anak menerima notifikasi live</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                        <UserCheck className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Header & Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-black text-white flex items-center gap-2">
                        <Pill className="w-7 h-7 text-teal-400" />
                        Senarai & Peringatan Ubat
                    </h1>
                    <p className="text-xs text-slate-400">Pengurusan dos harian dan rekod stok bekalan ubat.</p>
                </div>

                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all self-start sm:self-auto"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Ubat Baharu
                </button>
            </div>

            {/* Time Filter Tabs */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                {['All', 'Morning', 'Afternoon', 'Night'].map((t) => (
                    <button
                        key={t}
                        onClick={() => setFilterTime(t)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                            filterTime === t
                                ? 'bg-teal-500 text-slate-950 shadow-md'
                                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
                        }`}
                    >
                        {t === 'All' ? 'Semua Waktu' : t === 'Morning' ? '🌅 Pagi' : t === 'Afternoon' ? '☀️ Tengahari' : '🌙 Malam'}
                    </button>
                ))}
            </div>

            {/* Medication List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMeds.map((med) => (
                    <div
                        key={med.id}
                        className={`glass-card p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                            med.takenToday
                                ? 'border-emerald-500/40 bg-slate-900/90'
                                : 'border-slate-700/60'
                        }`}
                    >
                        <div>
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div>
                                    <Badge variant={med.takenToday ? 'emerald' : 'teal'}>{med.category}</Badge>
                                    <h3 className="text-lg font-bold text-white mt-1.5">{med.name}</h3>
                                    <p className="text-xs font-mono text-teal-300">Dos: {med.dosage}</p>
                                </div>
                                <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                                    {med.time}
                                </span>
                            </div>

                            <p className="text-xs text-slate-300 mb-4 bg-slate-800/50 p-3 rounded-xl border border-slate-700/40">
                                💡 <strong className="text-slate-200">Arahan:</strong> {med.instructions}
                            </p>

                            {/* Pill Supply Status */}
                            <div className="flex items-center justify-between text-xs mb-4">
                                <span className="text-slate-400">Baki Ubat Dalam Botol:</span>
                                <span className={`font-bold font-mono ${med.pillsLeft <= med.refillThreshold ? 'text-rose-400' : 'text-slate-200'}`}>
                                    {med.pillsLeft} biji {med.pillsLeft <= med.refillThreshold && '⚠️ (Perlu Preskripsi Semula)'}
                                </span>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                            <span className="text-[11px] text-slate-400">Pakar: {med.doctor}</span>
                            <button
                                onClick={() => toggleTaken(med.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                                    med.takenToday
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                        : 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-md'
                                }`}
                            >
                                {med.takenToday ? (
                                    <>
                                        <Check className="w-4 h-4" /> Dimakan Hari Ini
                                    </>
                                ) : (
                                    <>
                                        <Clock className="w-4 h-4" /> Tanda Makan Sekarang
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Add Medication */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Tambah Rekod Ubat Baharu">
                <form onSubmit={handleAddMedication} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Ubat / Generik</label>
                        <input
                            type="text"
                            required
                            placeholder="Contoh: Panadol Extend, Paracetamol"
                            value={newMed.name}
                            onChange={e => setNewMed({...newMed, name: e.target.value})}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Kategori Ubat</label>
                            <input
                                type="text"
                                placeholder="Tekanan Darah / Kencing Manis"
                                value={newMed.category}
                                onChange={e => setNewMed({...newMed, category: e.target.value})}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Dos (mg / tablet)</label>
                            <input
                                type="text"
                                placeholder="10mg / 1 Tablet"
                                value={newMed.dosage}
                                onChange={e => setNewMed({...newMed, dosage: e.target.value})}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Waktu Makan</label>
                            <select
                                value={newMed.timeOfDay}
                                onChange={e => setNewMed({...newMed, timeOfDay: e.target.value})}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                            >
                                <option value="Morning">🌅 Pagi</option>
                                <option value="Afternoon">☀️ Tengahari</option>
                                <option value="Night">🌙 Malam</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Masa Spesifik</label>
                            <input
                                type="text"
                                placeholder="08:00 AM"
                                value={newMed.time}
                                onChange={e => setNewMed({...newMed, time: e.target.value})}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Arahan Khas</label>
                        <textarea
                            rows={2}
                            placeholder="Makan selepas makan / sebelum tidur"
                            value={newMed.instructions}
                            onChange={e => setNewMed({...newMed, instructions: e.target.value})}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                        />
                    </div>

                    <div className="pt-3 border-t border-slate-700 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsAddModalOpen(false)}
                            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs shadow-md"
                        >
                            Simpan Rekod Ubat
                        </button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
