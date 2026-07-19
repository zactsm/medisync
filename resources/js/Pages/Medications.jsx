import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import Badge from '../Components/Badge';
import Modal from '../Components/Modal';
import { useLanguage } from '../lib/language';
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
    Check,
    Sun,
    Moon,
    Info,
    Trash2
} from 'lucide-react';

export default function Medications({ user, medications: initialMedications, adherenceRate, streakDays }) {
    const { t } = useLanguage();
    const [meds, setMeds] = useState(initialMedications);
    const [filterTime, setFilterTime] = useState('All');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
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
        if (!newMed.name || submitting) return;
        setSubmitting(true);
        try {
            const response = await fetch('/api/medications', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content, 'Accept': 'application/json' }, body: JSON.stringify({ ...newMed, time: newMed.time }) });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                alert(`${t('medications.errorAdd')} ${errData.message || ''}`);
                return;
            }
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
        } catch (error) {
            console.error('Network error adding medication:', error);
            alert(t('medications.network'));
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteMedication = async (id) => {
        if (!confirm(t('medications.deleteConfirm'))) return;
        try {
            const response = await fetch(`/api/medications/${id}`, {
                method: 'DELETE',
                credentials: 'same-origin',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) {
                alert(t('medications.errorDelete'));
                return;
            }
            setMeds(prev => prev.filter(m => m.id !== id));
        } catch (error) {
            console.error('Error deleting medication:', error);
            alert(t('medications.network'));
        }
    };

    return (
        <AppLayout user={user}>
            <Head title={t('medications.title')} />

            {/* Top Stat Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
                    <div>
                        <span className="text-xs text-slate-400 font-semibold tracking-wider">{t('medications.adherence')}</span>
                        <div className="text-2xl font-black text-emerald-400 mt-1">{adherenceRate}%</div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{t('medications.adherenceText')}</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center glow-emerald">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                </div>

                <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
                    <div>
                        <span className="text-xs text-slate-400 font-semibold tracking-wider">{t('medications.streak')}</span>
                        <div className="text-2xl font-black text-amber-400 mt-1">{streakDays} Hari</div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{t('medications.streakText')}</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                        <Flame className="w-6 h-6" />
                    </div>
                </div>

                <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
                    <div>
                        <span className="text-xs text-slate-400 font-semibold tracking-wider">{t('medications.caregiverSync')}</span>
                        <div className="text-base font-bold text-teal-400 mt-1">{t('medications.synced')}</div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{t('medications.syncedText')}</p>
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
                        {t('medications.heading')}
                    </h1>
                    <p className="text-xs text-slate-400">{t('medications.subtitle')}</p>
                </div>

                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all self-start sm:self-auto"
                >
                    <Plus className="w-4 h-4" />
                    {t('medications.add')}
                </button>
            </div>

            {/* Time Filter Tabs */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                {['All', 'Morning', 'Afternoon', 'Night'].map((slot) => (
                    <button
                        key={slot}
                        onClick={() => setFilterTime(slot)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                            filterTime === slot
                                ? 'bg-teal-500 text-slate-950 shadow-md'
                                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
                        }`}
                    >
                        {slot === 'All' ? (
                            t('medications.all')
                        ) : slot === 'Morning' ? (
                            <span className="flex items-center gap-1.5"><Sun className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> {t('medications.morning')}</span>
                        ) : slot === 'Afternoon' ? (
                            <span className="flex items-center gap-1.5"><Sun className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> {t('medications.afternoon')}</span>
                        ) : (
                            <span className="flex items-center gap-1.5"><Moon className="w-3.5 h-3.5 text-indigo-400" /> {t('medications.night')}</span>
                        )}
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
                                <div className="flex flex-col items-end gap-2 shrink-0">
                                    <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                                        {med.time}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteMedication(med.id)}
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-700/60 hover:border-rose-500/20 transition-all transition-colors cursor-pointer"
                                        title={t('medications.delete')}
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            <p className="text-xs text-slate-300 mb-4 bg-slate-800/50 p-3 rounded-xl border border-slate-700/40 flex items-start gap-2">
                                <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                                <span><strong className="text-slate-200">{t('medications.instruction')}:</strong> {med.instructions}</span>
                            </p>

                            {/* Pill Supply Status */}
                            <div className="flex items-center justify-between text-xs mb-4">
                                <span className="text-slate-400">{t('medications.remaining')}:</span>
                                <span className={`font-bold font-mono flex items-center gap-1 ${med.pillsLeft <= med.refillThreshold ? 'text-rose-400' : 'text-slate-200'}`}>
                                    {med.pillsLeft} biji {med.pillsLeft <= med.refillThreshold && (
                                        <span className="flex items-center gap-1 text-[11px] font-bold text-rose-400 ml-1">
                                            <AlertTriangle className="w-3.5 h-3.5" /> (Perlu Re-preskripsi)
                                        </span>
                                    )}
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
                                        <Check className="w-4 h-4" /> {t('medications.taken')}
                                    </>
                                ) : (
                                    <>
                                        <Clock className="w-4 h-4" /> {t('medications.take')}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Add Medication */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={t('medications.addTitle')}>
                <form onSubmit={handleAddMedication} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">{t('medications.name')}</label>
                        <input
                            type="text"
                            required
                            placeholder="Contoh: Panadol Extend, Paracetamol"
                            value={newMed.name}
                            onChange={e => setNewMed({...newMed, name: e.target.value})}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">{t('medications.category')}</label>
                            <input
                                type="text"
                                placeholder="Tekanan Darah / Kencing Manis"
                                value={newMed.category}
                                onChange={e => setNewMed({...newMed, category: e.target.value})}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                            />
                        </div>
                        <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">{t('medications.dose')}</label>
                            <input
                                type="text"
                                placeholder="10mg / 1 Tablet"
                                value={newMed.dosage}
                                onChange={e => setNewMed({...newMed, dosage: e.target.value})}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('medications.time')}</label>
                            <select
                                value={newMed.timeOfDay}
                                onChange={e => setNewMed({...newMed, timeOfDay: e.target.value})}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                            >
                                <option value="Morning">{t('medications.morning')}</option>
                                <option value="Afternoon">{t('medications.afternoon')}</option>
                                <option value="Night">{t('medications.night')}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('medications.specificTime')}</label>
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
                        <label className="block text-xs font-semibold text-slate-300 mb-1">{t('medications.special')}</label>
                        <textarea
                            rows={2}
                            placeholder="Makan selepas makan / sebelum tidur"
                            value={newMed.instructions}
                            onChange={e => setNewMed({...newMed, instructions: e.target.value})}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                        />
                    </div>

                    <div className="modal-actions pt-3 border-t border-slate-700 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsAddModalOpen(false)}
                            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                        >
                            {t('medications.cancel')}
                        </button>
                         <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:bg-teal-500/50 disabled:text-slate-700 text-slate-950 font-extrabold text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                        >
                            {submitting ? 'Saving...' : t('medications.save')}
                        </button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
