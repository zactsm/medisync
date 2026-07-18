import React, { useState, useEffect } from 'react';
import Header from '../Components/Header';
import { router } from '@inertiajs/react';

export default function AppLayout({ children, user, surface = 'premium' }) {
    const surfaceClass = surface === 'dashboard' ? 'dashboard-surface' : 'standard-surface';
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        let timer = null;

        const startListener = () => {
            setLoading(true);
            setPercentage(0);

            // Smooth progress incremental simulation in case request has no direct progress events
            timer = setInterval(() => {
                setPercentage((prev) => {
                    if (prev >= 90) return prev;
                    return prev + Math.floor(Math.random() * 8) + 2;
                });
            }, 120);
        };

        const progressListener = (event) => {
            if (event.detail.progress && event.detail.progress.percentage !== undefined) {
                setPercentage(Math.round(event.detail.progress.percentage));
            }
        };

        const finishListener = () => {
            if (timer) clearInterval(timer);
            setPercentage(100);
            setTimeout(() => {
                setLoading(false);
                setPercentage(0);
            }, 150);
        };

        const unregisterStart = router.on('start', startListener);
        const unregisterProgress = router.on('progress', progressListener);
        const unregisterFinish = router.on('finish', finishListener);

        return () => {
            if (timer) clearInterval(timer);
            unregisterStart();
            unregisterProgress();
            unregisterFinish();
        };
    }, []);

    return (
        <div className="medisync-app min-h-screen text-ink relative">
            <Header user={user} />

            <div className="mx-auto flex min-h-[calc(100vh-84px)] w-full max-w-[1540px] flex-col px-4 py-5 sm:px-6 lg:px-10 lg:py-8">
                <main className="flex-1 min-w-0">
                    <div className={`page-surface premium-surface ${surfaceClass}`}>
                        {children}
                    </div>
                </main>

                <footer className="pt-8 text-center text-xs text-ink/45">
                    <p>© 2026 MediSync · Smarter health coordination for every family.</p>
                </footer>
            </div>

            {/* Custom Loading Popup with Percentage & Blurred Background */}
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity duration-300 animate-fadeIn">
                    <div className="rounded-2xl border border-white/10 bg-slate-950/90 p-8 shadow-2xl flex flex-col items-center gap-5 text-center max-w-[280px] w-full mx-4 border-teal-500/20">
                        <div className="relative flex items-center justify-center w-20 h-20">
                            {/* Circular progress bar effect */}
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="40"
                                    cy="40"
                                    r="36"
                                    stroke="rgba(255, 255, 255, 0.05)"
                                    strokeWidth="4"
                                    fill="transparent"
                                />
                                <circle
                                    cx="40"
                                    cy="40"
                                    r="36"
                                    stroke="#ffc738"
                                    strokeWidth="4"
                                    fill="transparent"
                                    strokeDasharray="226.2"
                                    strokeDashoffset={226.2 - (226.2 * percentage) / 100}
                                    className="transition-all duration-150 ease-out"
                                />
                            </svg>
                            <span className="absolute text-base font-black text-white font-mono">{percentage}%</span>
                        </div>
                        <div>
                            <p className="font-bold text-white text-sm">Memuatkan Halaman...</p>
                            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">Loading Page</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
