import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import Badge from '../Components/Badge';
import { useLanguage } from '../lib/language';
import {
    ShieldAlert,
    UserCheck,
    AlertTriangle,
    Pill,
    PhoneCall,
    ExternalLink,
    Lock,
    Save,
    QrCode,
    Plus,
    Check
} from 'lucide-react';

export default function EmergencyICE({ user, patientICE }) {
    const { t } = useLanguage();
    const [iceData, setIceData] = useState(patientICE);
    const [saved, setSaved] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/medical-profile', {
                method: 'PUT',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    blood_type: iceData.blood_type,
                    organ_donor: iceData.organ_donor,
                    weight_kg: parseInt(iceData.weight_kg) || null,
                    height_cm: parseInt(iceData.height_cm) || null,
                    conditions: iceData.chronic_conditions,
                    allergies: iceData.allergies,
                    emergency_contacts: iceData.iceContacts
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                alert(`${t('emergency.error')} ${errData.message || response.statusText}`);
                return;
            }

            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(t('emergency.error'));
        }
    };

    return (
        <AppLayout user={user}>
            <Head title={t('emergency.iceTitle')} />

            {/* Top Banner */}
            <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-rose-950 via-slate-900 to-slate-900 border border-rose-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="red">{t('emergency.iceBadge')}</Badge>
                        <span className="text-xs text-slate-400 font-mono">ID Khas: {iceData.publicAccessCode}</span>
                    </div>
                    <h1 className="text-2xl font-black text-white">{t('emergency.iceHeading')}</h1>
                    <p className="text-xs text-slate-300 mt-1 max-w-xl">
                        Maklumat perubatan kritikal yang boleh diakses secara langsung oleh pegawai perubatan / orang awam sekiranya anda tidak sedarkan diri dalam kemalangan.
                    </p>
                </div>

                <Link
                    href={iceData.publicUrl}
                    target="_blank"
                    className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all shrink-0"
                >
                    <ExternalLink className="w-4 h-4" /> Buka Mod Lockscreen Awam
                </Link>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (2 Cols): Critical Medical Information */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Vital Medical Details */}
                    <div className="glass-card p-6 rounded-2xl border-slate-700/60 space-y-4">
                        <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                            <UserCheck className="w-5 h-5 text-teal-400" />
                            {t('emergency.blood')}
                        </h3>

                        <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:grid-cols-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1">{t('emergency.blood')}</label>
                                <input
                                    type="text"
                                    value={iceData.blood_type}
                                    onChange={e => setIceData({...iceData, blood_type: e.target.value})}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold font-mono text-xs focus:border-teal-400"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1">{t('emergency.donor')}</label>
                                <select
                                    value={iceData.organ_donor ? 'Ya' : 'Tidak'}
                                    onChange={e => setIceData({...iceData, organ_donor: e.target.value === 'Ya'})}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs focus:border-teal-400"
                                >
                                    <option value="Ya">{t('emergency.donorYes')}</option>
                                    <option value="Tidak">{t('emergency.donorNo')}</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1">{t('emergency.weight')}</label>
                                <input
                                    type="number"
                                    value={iceData.weight_kg}
                                    onChange={e => setIceData({...iceData, weight_kg: parseFloat(e.target.value)})}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-teal-400"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1">{t('emergency.height')}</label>
                                <input
                                    type="number"
                                    value={iceData.height_cm}
                                    onChange={e => setIceData({...iceData, height_cm: parseFloat(e.target.value)})}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-teal-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Chronic Conditions & Severe Allergies */}
                    <div className="glass-card p-6 rounded-2xl border-rose-500/30 space-y-4">
                        <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-rose-500" />
                            {t('emergency.chronic')}
                        </h3>

                        <div>
                            <label className="block text-xs font-semibold text-rose-400 mb-1 tracking-wide flex items-center gap-1.5">
                                <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" /> {t('emergency.allergy')}
                            </label>
                            <div className="space-y-2">
                                {iceData.allergies?.map((all, i) => (
                                    <div key={i} className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/40 flex items-center justify-between text-xs">
                                        <div>
                                            <span className="font-bold text-rose-300">{all.allergen}</span>
                                            <span className="text-slate-300 block text-[11px]">{all.reaction}</span>
                                        </div>
                                        <Badge variant="red">{all.severity}</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-2">
                            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('emergency.history')}</label>
                            <div className="space-y-1.5">
                                {iceData.chronic_conditions?.map((cond, i) => (
                                    <div key={i} className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200">
                                        • {cond}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Active Vital Medications */}
                    <div className="glass-card p-6 rounded-2xl border-slate-700/60 space-y-4">
                        <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                            <Pill className="w-5 h-5 text-teal-400" />
                            {t('emergency.medications')}
                        </h3>

                        <div className="space-y-2">
                            {iceData.vitalMedications?.map((med, i) => (
                                <div key={i} className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between text-xs">
                                    <div>
                                        <span className="font-bold text-white">{med.name} ({med.dose})</span>
                                        <span className="text-slate-400 block text-[11px]">{t('emergency.purpose')}: {med.purpose}</span>
                                    </div>
                                    <Badge variant="teal">{t('emergency.active')}</Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column (1 Col): Public Security Settings & Save Button */}
                <div className="space-y-6">
                    <div className="glass-card p-6 rounded-2xl border-slate-700/60 space-y-4">
                        <h4 className="text-sm font-bold text-white tracking-wider flex items-center gap-2">
                            <Lock className="w-4 h-4 text-teal-400" /> {t('emergency.publicAccess')}
                        </h4>

                        <p className="text-xs text-slate-300 leading-relaxed">
                            {t('emergency.publicText')}
                        </p>

                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                            <QrCode className="w-16 h-16 text-teal-400 mx-auto mb-2" />
                            <span className="text-[10px] text-slate-400 font-mono">{t('emergency.quickLink')}</span>
                            <div className="text-xs font-mono font-bold text-teal-300 break-all mt-1">
                                {iceData.publicUrl}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                        >
                            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                            {saved ? t('emergency.saved') : t('emergency.save')}
                        </button>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}
