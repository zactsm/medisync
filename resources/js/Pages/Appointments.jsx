import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import Badge from '../Components/Badge';
import Modal from '../Components/Modal';
import {
    Calendar as CalendarIcon,
    Plus,
    MapPin,
    Clock,
    UserCheck,
    FileCheck,
    ExternalLink,
    AlertCircle,
    Building2,
    Search,
    Trash2
} from 'lucide-react';

export default function Appointments({ user, appointments: initialAppointments }) {
    const [appts, setAppts] = useState(initialAppointments);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [newAppt, setNewAppt] = useState({
        title: '',
        doctor: '',
        hospital: 'Hospital Kuala Lumpur (HKL)',
        department: '',
        date: '',
        time: '10:00 AM',
        notes: ''
    });

    const handleAddAppointment = async (e) => {
        e.preventDefault();
        if (!newAppt.doctor || !newAppt.date || submitting) return;
        setSubmitting(true);
        try {
            const response = await fetch('/api/appointments', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content, 'Accept': 'application/json' }, body: JSON.stringify({ ...newAppt, starts_at: `${newAppt.date} ${newAppt.time}`, address: 'Alamat Klinik Pakar Hospital', documents_needed: ['Kad Temujanji', 'Kad Pengenalan'] }) });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                alert('Gagal menambah temujanji: ' + (errData.message || 'Sila semak input anda.'));
                return;
            }
            const created = await response.json();
            setAppts([created, ...appts]);
            setIsAddModalOpen(false);
            setNewAppt({
                title: '',
                doctor: '',
                hospital: 'Hospital Kuala Lumpur (HKL)',
                department: '',
                date: '',
                time: '10:00 AM',
                notes: ''
            });
        } catch (error) {
            console.error('Network error adding appointment:', error);
            alert('Ralat sambungan rangkaian semasa menambah temujanji.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteAppointment = async (id) => {
        if (!confirm('Adakah anda pasti mahu memadam temujanji ini? / Are you sure you want to delete this appointment?')) return;
        try {
            const response = await fetch(`/api/appointments/${id}`, {
                method: 'DELETE',
                credentials: 'same-origin',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) {
                alert('Gagal memadam temujanji.');
                return;
            }
            setAppts(prev => prev.filter(a => a.id !== id));
        } catch (error) {
            console.error('Error deleting appointment:', error);
            alert('Ralat sambungan rangkaian semasa memadam temujanji.');
        }
    };

    return (
        <AppLayout user={user}>
            <Head title="Temujanji Hospital & Klinik" />

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-black text-white flex items-center gap-2">
                        <CalendarIcon className="w-7 h-7 text-indigo-400" />
                        Peringatan Temujanji Hospital
                    </h1>
                    <p className="text-xs text-slate-400">Pakar kardiologi, endokrinologi, dan pemeriksaan kesihatan berkala.</p>
                </div>

                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-indigo-950/60 transition-all self-start sm:self-auto"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Temujanji
                </button>
            </div>

            {/* Appointments Grid */}
            <div className="space-y-6">
                {appts.map((appt) => (
                    <div key={appt.id} className="glass-card p-6 rounded-2xl border border-slate-700/60 flex flex-col lg:flex-row justify-between gap-6">
                        <div className="space-y-3 flex-1">
                            <div className="flex items-center gap-2">
                                <Badge variant={appt.status === 'Confirmed' ? 'indigo' : 'teal'}>
                                    {appt.status}
                                </Badge>
                                <span className="text-xs text-slate-400 font-medium">Jarak: ~{appt.distanceKm} km dari kediaman</span>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-white">{appt.title}</h3>
                                <p className="text-sm font-semibold text-indigo-300 flex items-center gap-1.5 mt-0.5">
                                    <UserCheck className="w-4 h-4 text-indigo-400" />
                                    {appt.doctor} ({appt.department})
                                </p>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 space-y-1.5 text-xs">
                                <p className="text-slate-300 flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                                    <strong>{appt.hospital}</strong> — {appt.address}
                                </p>
                                {appt.notes && (
                                    <p className="text-amber-300 flex items-start gap-2 pt-1 border-t border-slate-700/40">
                                        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                        <span><strong>Nota Penyediaan:</strong> {appt.notes}</span>
                                    </p>
                                )}
                            </div>

                            {/* Documents Needed Checklist */}
                            <div>
                                <span className="text-[11px] text-slate-400 uppercase tracking-wide font-semibold">Dokumen Perlu Dibawa:</span>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                    {appt.documentsNeeded?.map((doc, idx) => (
                                        <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1">
                                            <FileCheck className="w-3.5 h-3.5 text-teal-400" />
                                            {doc}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Date Card & Navigation */}
                        <div className="w-full lg:w-64 flex flex-col justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center relative pt-8">
                            <button
                                type="button"
                                onClick={() => handleDeleteAppointment(appt.id)}
                                className="absolute top-2 right-2 p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-700/50 hover:border-rose-500/20 transition-all transition-colors cursor-pointer"
                                title="Padam Temujanji"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <div>
                                <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">Tarikh & Masa</span>
                                <div className="text-2xl font-black text-white my-1">{appt.date}</div>
                                <div className="text-sm font-bold text-slate-300 flex items-center justify-center gap-1">
                                    <Clock className="w-4 h-4 text-teal-400" />
                                    {appt.time}
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                                <a
                                    href={`https://maps.google.com/?q=${encodeURIComponent(appt.hospital)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" /> Peta Lokasi Klinik
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Add Appointment */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Tambah Temujanji Hospital">
                <form onSubmit={handleAddAppointment} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Tajuk Temujanji / Tujuan</label>
                        <input
                            type="text"
                            required
                            placeholder="Contoh: Temujanji Susulan Darah Tinggi"
                            value={newAppt.title}
                            onChange={e => setNewAppt({...newAppt, title: e.target.value})}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-400"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Doktor Pakar</label>
                            <input
                                type="text"
                                required
                                placeholder="Dr. Arisya Zakaria"
                                value={newAppt.doctor}
                                onChange={e => setNewAppt({...newAppt, doctor: e.target.value})}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-400"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Klinik / Jabatan</label>
                            <input
                                type="text"
                                placeholder="Klinik Kardiologi Level 3"
                                value={newAppt.department}
                                onChange={e => setNewAppt({...newAppt, department: e.target.value})}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-400"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Tarikh</label>
                            <input
                                type="date"
                                required
                                value={newAppt.date}
                                onChange={e => setNewAppt({...newAppt, date: e.target.value})}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-400"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Masa Masa Temujanji</label>
                            <input
                                type="text"
                                placeholder="10:30 AM"
                                value={newAppt.time}
                                onChange={e => setNewAppt({...newAppt, time: e.target.value})}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-400"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Nota Arahan Peringatan</label>
                        <textarea
                            rows={2}
                            placeholder="Contoh: Perlu puasa 8 jam sebelum ujian darah"
                            value={newAppt.notes}
                            onChange={e => setNewAppt({...newAppt, notes: e.target.value})}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-400"
                        />
                    </div>

                    <div className="modal-actions pt-3 border-t border-slate-700 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsAddModalOpen(false)}
                            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:text-slate-200 text-white font-extrabold text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                        >
                            {submitting ? 'Menyimpan...' : 'Simpan Temujanji'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
