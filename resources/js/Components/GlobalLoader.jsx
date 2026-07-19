import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

let activeRequests = 0;
let routerLoading = false;

export function useGlobalLoading() {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const updateState = () => {
            setLoading(activeRequests > 0 || routerLoading);
        };

        const handleEvent = () => {
            updateState();
        };

        window.addEventListener('medisync-loading-changed', handleEvent);

        const removeStartListener = router.on('start', () => {
            routerLoading = true;
            updateState();
        });
        
        const removeFinishListener = router.on('finish', () => {
            routerLoading = false;
            updateState();
        });

        // Initialize state
        updateState();

        return () => {
            window.removeEventListener('medisync-loading-changed', handleEvent);
            removeStartListener();
            removeFinishListener();
        };
    }, []);

    return loading;
}

export default function GlobalLoader({ children }) {
    const loading = useGlobalLoading();

    return (
        <>
            {children}
            {loading && (
                <div 
                    className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-sm pointer-events-auto"
                    role="alert"
                    aria-busy="true"
                    aria-label="Loading"
                >
                    <div className="flex flex-col items-center p-8 rounded-3xl bg-surface/90 border border-ink/8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 dark:bg-canvas/90">
                        {/* Beautiful saffron loading spinner */}
                        <div className="relative flex items-center justify-center w-16 h-16">
                            <div className="absolute w-12 h-12 border-4 border-saffron/20 rounded-full"></div>
                            <div className="absolute w-12 h-12 border-4 border-t-saffron border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                            <div className="w-4 h-4 bg-saffron rounded-full animate-pulse shadow-[0_0_8px_var(--color-saffron)]"></div>
                        </div>
                        <p className="mt-5 text-xs font-bold text-ink/75 tracking-widest font-heading uppercase animate-pulse">
                            Memproses...
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}

// Global fetch interceptor setup helper
export function setupFetchInterceptor() {
    if (typeof window === 'undefined' || window.fetch.__medisync_intercepted) {
        return;
    }

    const originalFetch = window.fetch;
    const newFetch = async function (...args) {
        // Skip background synchronization requests to avoid blinking UI on load
        const url = typeof args[0] === 'string' ? args[0] : (args[0] instanceof URL ? args[0].href : '');
        const isBackground = url.includes('/auth/sync');

        if (!isBackground) {
            activeRequests++;
            window.dispatchEvent(new CustomEvent('medisync-loading-changed'));
        }

        try {
            return await originalFetch.apply(this, args);
        } finally {
            if (!isBackground) {
                activeRequests--;
                window.dispatchEvent(new CustomEvent('medisync-loading-changed'));
            }
        }
    };

    newFetch.__medisync_intercepted = true;
    window.fetch = newFetch;
}
