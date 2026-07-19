import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import Badge from '../Components/Badge';
import Modal from '../Components/Modal';
import { useLanguage } from '../lib/language';
import {
    Users,
    UserCheck,
    Heart,
    Shield,
    Activity,
    QrCode,
    Copy,
    Check,
    Plus,
    Clock,
    PhoneCall,
    Bell,
    Moon
} from 'lucide-react';

export default function CaregiverSync({ user, patient, connectedCaregivers, sharedLog }) {
    const { t } = useLanguage();
    const [copied, setCopied] = useState(false);
    const [isAddMemberModal, setIsAddMemberModal] = useState(false);
    const [inviteCode, setInviteCode] = useState(patient.syncCode);

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AppLayout user={user}>
            <Head title={t('caregiver.title')} />

            {/* Top Overview Banner */}
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 border border-teal-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="teal">{t('caregiver.connected')}</Badge>
                        <span className="text-xs text-slate-400 font-mono">ID: {patient.syncCode}</span>
                    </div>
                    <h1 className="text-2xl font-black text-white">{t('caregiver.title')}</h1>
                    <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                        {t('caregiver.description')}
                    </p>
                </div>

                {/* Pairing Code Card */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-center shrink-0 w-full md:w-auto">
                    <span className="text-[10px] font-bold text-slate-400 tracking-wider">{t('caregiver.code')}</span>
                    <div className="text-lg font-black font-mono text-teal-400 my-1">{inviteCode}</div>
                    <button
                        onClick={handleCopy}
                        className="w-full px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? t('caregiver.copied') : t('caregiver.copy')}
                    </button>
                </div>
            </div>

            {/* Main Section Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (2 Cols): Connected Family Members & Live Medication Status */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Patient Live Health Status Card (Caregiver View) */}
                    <div className="glass-card p-6 rounded-2xl border-teal-500/40">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                                {t('caregiver.health')}
                            </h3>
                            <Badge variant="emerald">{t('caregiver.live')}</Badge>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between mb-4">
                            <div>
                                <h4 className="text-base font-bold text-white">{patient.name} ({patient.age} Tahun)</h4>
                                <p className="text-xs text-slate-300 mt-0.5">{patient.lastActivity}</p>
                            </div>
                            <span className="w-3 h-3 rounded-full bg-emerald-400 ring-4 ring-emerald-500/20"></span>
                        </div>

                        <div className="grid grid-cols-1 gap-3 text-center sm:grid-cols-3">
                            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                                <span className="text-[10px] text-slate-400 font-semibold">{t('caregiver.morning')}</span>
                                <div className="text-sm font-bold text-emerald-400 mt-0.5 flex items-center justify-center gap-1.5">
                                    <Check className="w-4 h-4 text-emerald-400" /> {t('caregiver.taken')}
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                                <span className="text-[10px] text-slate-400 font-semibold">{t('caregiver.afternoon')}</span>
                                <div className="text-sm font-bold text-amber-400 mt-0.5 flex items-center justify-center gap-1.5">
                                    <Clock className="w-4 h-4 text-amber-400" /> {t('caregiver.waiting')}
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                                <span className="text-[10px] text-slate-400 font-semibold">{t('caregiver.evening')}</span>
                                <div className="text-sm font-bold text-slate-300 mt-0.5 flex items-center justify-center gap-1.5">
                                    <Moon className="w-4 h-4 text-indigo-400" /> 9:00 PM
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Connected Caregivers List */}
                    <div className="glass-card p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Users className="w-5 h-5 text-teal-400" />
                                    {t('caregiver.members')}
                                </h3>
                                <p className="text-xs text-slate-400">{t('caregiver.access')}</p>
                            </div>
                            <button
                                onClick={() => setIsAddMemberModal(true)}
                                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5"
                            >
                                <Plus className="w-4 h-4" /> {t('caregiver.invite')}
                            </button>
                        </div>

                        <div className="space-y-4">
                            {connectedCaregivers.map((cg) => (
                                <div key={cg.id} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-500 to-indigo-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-md">
                                            {cg.avatar}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-bold text-white">{cg.name}</h4>
                                                {cg.isPrimary && <Badge variant="teal">{t('caregiver.primary')}</Badge>}
                                            </div>
                                            <p className="text-xs text-slate-400">{cg.relation} • {cg.phone}</p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <span className="text-xs font-semibold text-slate-300 block">{cg.accessLevel}</span>
                                        <span className="text-[10px] text-slate-500">{t('caregiver.memberSince')} {cg.joinedDate}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column (1 Col): Shared Activity Log */}
                <div className="glass-card p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-400" />
                        {t('caregiver.activity')}
                    </h3>

                    <div className="space-y-4 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-800">
                        {sharedLog.map((log) => (
                            <div key={log.id} className="relative pl-7 space-y-1">
                                <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-teal-400 ring-4 ring-slate-900"></div>
                                <span className="text-[10px] font-mono text-slate-400 block">{log.time}</span>
                                <h5 className="text-xs font-bold text-white">{log.action}</h5>
                                <p className="text-[11px] text-slate-400">{t('caregiver.by')}: <span className="text-slate-300 font-semibold">{log.actor}</span></p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Invite Family Member Modal */}
            <Modal isOpen={isAddMemberModal} onClose={() => setIsAddMemberModal(false)} title={t('caregiver.inviteTitle')}>
                <div className="space-y-4 text-center py-2">
                    <div className="w-16 h-16 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto mb-2">
                        <QrCode className="w-8 h-8" />
                    </div>
                    <h4 className="text-base font-bold text-white">{t('caregiver.scan')}</h4>
                    <p className="text-xs text-slate-300 max-w-sm mx-auto">
                        {t('caregiver.inviteText')}
                    </p>

                    <div className="p-4 rounded-xl bg-slate-900 border border-teal-500/40 text-2xl font-black font-mono text-teal-400 tracking-wider">
                        {inviteCode}
                    </div>

                    <button
                        onClick={handleCopy}
                        className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs shadow-md transition-all"
                    >
                        {copied ? t('caregiver.copied') : t('caregiver.copySend')}
                    </button>
                </div>
            </Modal>
        </AppLayout>
    );
}
