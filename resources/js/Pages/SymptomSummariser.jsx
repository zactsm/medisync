import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import Badge from '../Components/Badge';
import { useLanguage } from '../lib/language';
import {
    Stethoscope,
    Sparkles,
    Copy,
    Check,
    AlertCircle,
    Clock,
    Activity,
    FileText,
    ChevronRight,
    RotateCcw
} from 'lucide-react';

export default function SymptomSummariser({ user, commonSymptoms }) {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({ primarySymptom: '', onset: '', duration: '', severity: 1, triggers: '', accompanying: '', treatmentsTried: '' });

    const [copied, setCopied] = useState(false);
    const [saved, setSaved] = useState(false);

    const generatedSummary = `Skrin Perubatan Sebelum Konsultasi (History Taking Summary):
• Aduan Utama (Chief Complaint): ${formData.primarySymptom}
• Mula Berlaku (Onset): ${formData.onset}
• Tempoh & Kekerapan (Duration): ${formData.duration}
• Skala Kesusahan / Sakit (Severity): ${formData.severity}/10
• Faktor Pencetus (Triggers): ${formData.triggers}
• Simptom Sampingan (Associated Symptoms): ${formData.accompanying}
• Kawalan Sendiri (Pre-treatments Tried): ${formData.treatmentsTried}

Sejarah Perubatan Pesakit:
• Pesakit: ${user?.name || '—'}`;

    const localizedSummary = `${t('symptoms.history')}:\n• ${t('symptoms.complaint')}: ${formData.primarySymptom}\n• ${t('symptoms.onsetLabel')}: ${formData.onset}\n• ${t('symptoms.durationLabel')}: ${formData.duration}\n• ${t('symptoms.severityLabel')}: ${formData.severity}/10\n• ${t('symptoms.triggersLabel')}: ${formData.triggers}\n• ${t('symptoms.associated')}: ${formData.accompanying}\n• ${t('symptoms.pretreatments')}: ${formData.treatmentsTried}\n\n${t('symptoms.history')}:\n• ${t('symptoms.patient')}: ${user?.name || '—'}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(localizedSummary);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSave = async () => {
        const response = await fetch('/api/symptoms', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content }, body: JSON.stringify({ symptoms: formData.primarySymptom, onset: formData.onset, duration: formData.duration, severity: String(formData.severity), triggers: formData.triggers, other: `${formData.accompanying}; ${formData.treatmentsTried}` }) });
        if (response.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
    };

    return (
        <AppLayout user={user}>
            <Head title={t('symptoms.title')} />

            {/* Page Header */}
            <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold mb-2">
                    <Stethoscope className="w-4 h-4" /> {t('symptoms.eyebrow')}
                </div>
                <h1 className="text-3xl font-black text-white">{t('symptoms.title')}</h1>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                    {t('symptoms.description')}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Structured Form Input */}
                <div className="glass-card p-6 rounded-2xl border-emerald-500/30 space-y-5">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                        <Activity className="w-5 h-5 text-emerald-400" />
                        {t('symptoms.form')}
                    </h3>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">{t('symptoms.primary')}</label>
                        <input
                            type="text"
                            value={formData.primarySymptom}
                            onChange={e => setFormData({...formData, primarySymptom: e.target.value})}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-400"
                        />
                        <div className="flex flex-wrap gap-1 mt-2">
                            {commonSymptoms?.slice(0, 4).map((sym, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setFormData({...formData, primarySymptom: sym})}
                                    className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                                >
                                    + {sym}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('symptoms.onset')}</label>
                            <input
                                type="text"
                                value={formData.onset}
                                onChange={e => setFormData({...formData, onset: e.target.value})}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-400"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('symptoms.duration')}</label>
                            <input
                                type="text"
                                value={formData.duration}
                                onChange={e => setFormData({...formData, duration: e.target.value})}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-400"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="text-xs font-semibold text-slate-300">{t('symptoms.severity')}</label>
                            <span className="text-xs font-black text-emerald-400">{formData.severity} / 10</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={formData.severity}
                            onChange={e => setFormData({...formData, severity: parseInt(e.target.value)})}
                            className="w-full accent-yellow-400 cursor-pointer"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">{t('symptoms.triggers')}</label>
                        <input
                            type="text"
                            value={formData.triggers}
                            onChange={e => setFormData({...formData, triggers: e.target.value})}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-400"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">{t('symptoms.accompanying')}</label>
                        <input
                            type="text"
                            value={formData.accompanying}
                            onChange={e => setFormData({...formData, accompanying: e.target.value})}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-400"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">{t('symptoms.treatments')}</label>
                        <input
                            type="text"
                            value={formData.treatmentsTried}
                            onChange={e => setFormData({...formData, treatmentsTried: e.target.value})}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-400"
                        />
                    </div>
                </div>

                {/* Right Column: Live Clinical Summary Output for Doctor */}
                <div className="glass-card p-6 rounded-2xl border-emerald-500/40 bg-slate-900/90 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-emerald-400" />
                                {t('symptoms.report')}
                            </h3>
                            <Badge variant="emerald font-mono">{t('symptoms.format')}</Badge>
                        </div>

                        <p className="text-xs text-slate-300 mb-4">
                            {t('symptoms.reportHint')}
                        </p>

                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed">
                            {localizedSummary}
                        </div>
                    </div>

                    <div className="pt-4 mt-6 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleCopy}
                            className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? t('symptoms.copied') : t('symptoms.copy')}
                        </button>
                        <button onClick={handleSave} className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-200 font-extrabold text-xs">{saved ? t('symptoms.saved') : t('symptoms.save')}</button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
