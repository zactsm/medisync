import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import Badge from '../Components/Badge';
import { useLanguage } from '../lib/language';
import {
    Sparkles,
    Search,
    BookOpen,
    HelpCircle,
    ArrowRight,
    CheckCircle2,
    MessageSquare,
    Lightbulb,
    Stethoscope
} from 'lucide-react';

export default function TermSimplifier({ user, sampleSearches, dictionary }) {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeResult, setActiveResult] = useState(sampleSearches[0]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchTerm) return;
        const found = sampleSearches.find(s => s.term.toLowerCase().includes(searchTerm.toLowerCase()));
        if (found) {
            setActiveResult(found);
        } else {
            setActiveResult({
                term: searchTerm,
                category: t('terms.searchResult'),
                simpleExplanation: `${t('terms.generated')} (${searchTerm})`,
                analogy: t('terms.analogy'),
                keyTakeaways: [
                    t('terms.takeaways'),
                    t('terms.description')
                ],
                questionsForDoctor: [
                    t('terms.questionOne'),
                    t('terms.questionTwo')
                ]
            });
        }
    };

    const filteredDictionary = dictionary.filter(item =>
        item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.malay.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AppLayout user={user}>
            <Head title={t('terms.title')} />

            {/* Page Header */}
            <div className="mb-8 text-center max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold mb-3">
                    <Sparkles className="w-4 h-4" /> {t('terms.eyebrow')}
                </div>
                <h1 className="text-3xl font-black text-white">{t('terms.heading')}</h1>
                <p className="text-xs text-slate-400 mt-1">
                    {t('terms.description')}
                </p>

                {/* Search Input Box */}
                <form onSubmit={handleSearch} className="mt-6 flex items-center gap-2 bg-slate-900/90 p-2 rounded-2xl border border-slate-700/80 shadow-xl">
                    <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                    <input
                        type="text"
                        placeholder={t('terms.search')}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-transparent px-2 py-2 text-sm text-white focus:outline-none placeholder-slate-500"
                    />
                    <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition-all shrink-0"
                    >
                        {t('terms.translate')}
                    </button>
                </form>
            </div>

            {/* Active Simplification Result Card */}
            {activeResult && (
                <div className="glass-card p-6 md:p-8 rounded-2xl border-amber-500/30 bg-gradient-to-b from-slate-900 to-slate-900/95 mb-10 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                        <div>
                            <Badge variant="amber">{activeResult.category}</Badge>
                            <h2 className="text-2xl font-black text-white mt-1">{activeResult.term}</h2>
                        </div>
                        <span className="text-xs text-amber-400 font-semibold bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
                            {t('terms.easy')}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left: Simple Explanation */}
                        <div className="md:col-span-2 space-y-5">
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                                    <BookOpen className="w-4 h-4 text-amber-400" /> {t('terms.explanation')}
                                </h4>
                                <p className="text-base text-slate-200 leading-relaxed font-medium bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
                                    {activeResult.simpleExplanation}
                                </p>
                            </div>

                            {/* Everyday Analogy */}
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                                    <Lightbulb className="w-4 h-4 text-amber-400" /> {t('terms.analogy')}
                                </h4>
                                <p className="text-xs text-amber-200 bg-amber-950/20 p-4 rounded-xl border border-amber-500/30 leading-relaxed italic">
                                    "{activeResult.analogy}"
                                </p>
                            </div>

                            {/* Key Takeaways */}
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4 text-teal-400" /> {t('terms.takeaways')}
                                </h4>
                                <ul className="space-y-1.5">
                                    {activeResult.keyTakeaways?.map((point, i) => (
                                        <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                                            <span className="text-teal-400 font-bold">•</span>
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Right: Suggested Questions for Doctor */}
                        <div className="p-5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between">
                            <div>
                                <h4 className="text-xs font-bold text-slate-300 tracking-wider mb-3 flex items-center gap-1.5">
                                    <MessageSquare className="w-4 h-4 text-indigo-400" /> {t('terms.questions')}
                                </h4>
                                <div className="space-y-2">
                                    {activeResult.questionsForDoctor?.map((q, idx) => (
                                        <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 leading-snug">
                                            ❓ "{q}"
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow transition-colors flex items-center justify-center gap-1">
                                {t('terms.copyQuestions')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Dictionary of Common Terms */}
            <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-400" /> Glosari Istilah Perubatan Popular
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDictionary.map((item, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-amber-500/30 transition-colors">
                            <h4 className="text-sm font-bold text-white">{item.term}</h4>
                            <p className="text-xs font-semibold text-amber-400 mb-1">{item.malay}</p>
                            <p className="text-xs text-slate-300">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
