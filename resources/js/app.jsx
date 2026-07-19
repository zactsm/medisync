import '../css/app.css';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { supabase } from './lib/supabase';
import { LanguageProvider } from './lib/language';
import GlobalLoader, { setupFetchInterceptor } from './Components/GlobalLoader';

// Call the fetch interceptor setup
setupFetchInterceptor();

const appName = import.meta.env.VITE_APP_NAME || 'MediSync';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <LanguageProvider>
                <GlobalLoader>
                    <App {...props} />
                </GlobalLoader>
            </LanguageProvider>
        );
        supabase?.auth.getSession().then(async ({ data }) => {
            if (data.session) await fetch('/auth/sync', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${data.session.access_token}`, 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content }, body: JSON.stringify({ access_token: data.session.access_token }) });
        });
    },
    progress: false,
});
