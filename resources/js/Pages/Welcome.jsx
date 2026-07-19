import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, HeartPulse, Pill, ShieldCheck, Users } from 'lucide-react';
import LanguageSelector from '../Components/LanguageSelector';
import { useLanguage } from '../lib/language';

export default function Welcome() {
    const { t } = useLanguage();

    return (
        <>
            <Head title="Welcome - MediSync" />
            <main className="welcome-page min-h-screen px-4 py-5 sm:px-8 lg:px-12">
                <header className="welcome-header mx-auto flex w-full max-w-[1320px] items-center justify-between gap-4">
                    <Link href="/" className="brand-mark" aria-label="MediSync home">
                        <span className="brand-icon"><HeartPulse className="h-4 w-4" /></span>
                        <span className="brand-wordmark">Medi<span>Sync</span></span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <LanguageSelector />
                        <Link href="/login" className="secondary-button">{t('welcome.signIn')}</Link>
                    </div>
                </header>

                <section className="welcome-hero mx-auto grid w-full max-w-[1320px] items-center gap-8 py-16 lg:grid-cols-[1.15fr_.85fr] lg:py-24">
                    <div>
                        <p className="eyebrow">{t('welcome.eyebrow')}</p>
                        <h1 className="welcome-title">{t('welcome.title')}</h1>
                        <p className="welcome-description">{t('welcome.description')}</p>
                        <Link href="/login" className="primary-button mt-7 inline-flex">
                            {t('welcome.getStarted')} <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="welcome-showcase premium-card">
                        <div className="welcome-showcase-orb" />
                        <div className="welcome-showcase-icon"><HeartPulse className="h-8 w-8" /></div>
                        <p className="section-label">MediSync</p>
                        <h2 className="welcome-showcase-title">Care That Feels Clear</h2>
                        <p className="welcome-showcase-copy">One calm place for medicines, appointments, family support, and emergency readiness.</p>
                        <div className="welcome-showcase-line"><span /><span /><span /></div>
                    </div>
                </section>

                <section className="mx-auto grid w-full max-w-[1320px] gap-4 pb-10 sm:grid-cols-3">
                    <article className="premium-card welcome-feature-card"><span className="welcome-feature-icon"><Pill className="h-5 w-5" /></span><h2>{t('welcome.medication')}</h2><p>{t('welcome.medicationText')}</p></article>
                    <article className="premium-card welcome-feature-card"><span className="welcome-feature-icon"><Users className="h-5 w-5" /></span><h2>{t('welcome.family')}</h2><p>{t('welcome.familyText')}</p></article>
                    <article className="premium-card welcome-feature-card"><span className="welcome-feature-icon"><ShieldCheck className="h-5 w-5" /></span><h2>{t('welcome.safety')}</h2><p>{t('welcome.safetyText')}</p></article>
                </section>
            </main>
        </>
    );
}
