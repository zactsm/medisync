import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useLanguage } from '../lib/language';

export default function ThemeToggle() {
    const { t } = useLanguage();
    const [theme, setTheme] = useState(() => (
        typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
            ? 'dark'
            : 'light'
    ));

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        document.documentElement.classList.toggle('dark', nextTheme === 'dark');

        try {
            window.localStorage.setItem('medisync-theme', nextTheme);
        } catch (error) {
            // Theme preference is optional; the current session still follows the toggle.
        }

        setTheme(nextTheme);
    };

    const isDark = theme === 'dark';

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="theme-button"
            aria-label={isDark ? t('header.lightMode') : t('header.darkMode')}
            aria-pressed={isDark}
            title={isDark ? t('header.lightMode') : t('header.darkMode')}
        >
            {isDark ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
        </button>
    );
}
