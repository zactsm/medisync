import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import Badge from '../Components/Badge';
import { useLanguage } from '../lib/language';
import {
    PhoneCall,
    MapPin,
    Navigation,
    ShieldAlert,
    Clock,
    AlertTriangle,
    Radio,
    Building2,
    ExternalLink,
    CheckCircle2
} from 'lucide-react';

export default function EmergencySOS({ user, emergencyContacts, nearbyHospitals }) {
    const { t } = useLanguage();
    const [sosActive, setSosActive] = useState(false);
    const [alertSent, setAlertSent] = useState(false);

    const triggerSOS = () => {
        setSosActive(true);
        setTimeout(() => {
            setAlertSent(true);
        }, 1500);
    };

    return (
        <AppLayout user={user}>
            <Head title={t('emergency.sosTitle')} />

            {/* Top SOS Emergency Action Button Hero Card */}
            <div className="mb-8 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 border border-rose-500/50 glow-red shadow-2xl text-center relative overflow-hidden">
                <div className="max-w-xl mx-auto space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold tracking-wider">
                        <Radio className="w-4 h-4 animate-ping text-rose-400" /> {t('emergency.sosBadge')}
                    </div>

                    <h1 className="text-3xl md:text-4xl font-black text-white">{t('emergency.sosHeading')}</h1>
                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                        {t('emergency.sosText')}
                    </p>

                    <div className="pt-2 flex flex-col items-center justify-center">
                        {!sosActive ? (
                            <button
                                onClick={triggerSOS}
                                className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-black text-xl md:text-2xl shadow-2xl flex flex-col items-center justify-center gap-2 border-4 border-rose-400/40 transition-transform active:scale-95 pulse-sos cursor-pointer"
                            >
                                <PhoneCall className="w-10 h-10 md:w-12 md:h-12 animate-bounce" />
                                <span>{t('emergency.press')}</span>
                            </button>
                        ) : (
                            <div className="p-6 rounded-2xl bg-rose-900/80 border border-rose-500 text-center space-y-3 max-w-md w-full">
                                <AlertTriangle className="w-10 h-10 text-rose-300 mx-auto animate-bounce" />
                                <h3 className="text-xl font-bold text-white">{t('emergency.alert')}</h3>
                                {alertSent ? (
                                    <div className="space-y-1">
                                        <p className="text-xs text-rose-200 font-semibold flex items-center justify-center gap-1">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {t('emergency.sent')}
                                        </p>
                                        <p className="text-[11px] text-slate-300">{emergencyContacts?.find((contact) => contact.isPrimary)?.name || emergencyContacts?.[0]?.name || 'Primary caregiver'} ({emergencyContacts?.find((contact) => contact.isPrimary)?.phone || emergencyContacts?.[0]?.phone || '—'}) telah menerima koordinat GPS anda.</p>
                                    </div>
                                ) : (
                                    <p className="text-xs text-rose-200 animate-pulse">{t('emergency.sending')}</p>
                                )}
                                <button
                                    onClick={() => { setSosActive(false); setAlertSent(false); }}
                                    className="px-4 py-2 bg-slate-900 text-slate-300 hover:text-white rounded-xl text-xs font-bold"
                                >
                                    {t('emergency.cancel')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Grid: Emergency Contacts + Nearby Hospitals */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (1 Col): ICE Emergency Contacts Dialer */}
                <div className="glass-card p-6 rounded-2xl border-rose-500/30">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-rose-400" />
                        {t('emergency.contacts')}
                    </h3>

                    <div className="space-y-3">
                        {emergencyContacts.map((contact, idx) => (
                            <div key={idx} className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between gap-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-sm font-bold text-white">{contact.name}</h4>
                                        {contact.isPrimary && <Badge variant="red">{t('emergency.primary')}</Badge>}
                                    </div>
                                    <p className="text-xs text-slate-400">{contact.relation}</p>
                                    <span className="text-xs font-mono text-teal-300 font-bold block mt-0.5">{contact.phone}</span>
                                </div>

                                <a
                                    href={`tel:${contact.phone}`}
                                    className="p-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center"
                                >
                                    <PhoneCall className="w-4 h-4" />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column (2 Cols): Nearby Hospitals Finder with Distance */}
                <div className="lg:col-span-2 glass-card p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-teal-400" />
                                {t('emergency.hospitals')}
                            </h3>
                            <p className="text-xs text-slate-400">{t('emergency.hospitalText')}</p>
                        </div>
                        <Badge variant="teal">{t('emergency.locationActive')}</Badge>
                    </div>

                    <div className="space-y-4">
                        {nearbyHospitals.map((hosp) => (
                            <div key={hosp.id} className="p-5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Badge variant={hosp.hasEmergency24h ? 'red' : 'gray'}>
                                            {hosp.hasEmergency24h ? t('emergency.emergency24') : t('emergency.clinic')}
                                        </Badge>
                                        <span className="text-xs text-slate-400">{hosp.type}</span>
                                    </div>
                                    <h4 className="text-base font-bold text-white">{hosp.name}</h4>
                                    <p className="text-xs text-slate-300 flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                                        {hosp.address}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 border-t md:border-t-0 border-slate-700/50 pt-3 md:pt-0">
                                    <div className="text-right">
                                        <span className="text-base font-black text-teal-400 font-mono block">{hosp.distanceKm} km</span>
                                        <span className="text-xs text-slate-400 font-medium">{hosp.driveTime} {t('emergency.driving')}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <a
                                            href={`tel:${hosp.erPhone}`}
                                            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                                        >
                                            <PhoneCall className="w-3.5 h-3.5" /> {t('emergency.callER')}
                                        </a>
                                        <a
                                            href={hosp.googleMapUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs flex items-center gap-1.5"
                                        >
                                            <Navigation className="w-3.5 h-3.5 text-teal-400" /> {t('emergency.navigate')}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
