import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Languages } from 'lucide-react';
import { useLanguage } from '../lib/language';

const options = [
    { value: 'en', label: 'english' },
    { value: 'ms', label: 'malay' },
];

export default function LanguageSelector() {
    const { language, setLanguage, t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(() => Math.max(0, options.findIndex((option) => option.value === language)));
    const containerRef = useRef(null);
    const triggerRef = useRef(null);
    const optionRefs = useRef([]);

    const selectedIndex = Math.max(0, options.findIndex((option) => option.value === language));

    useEffect(() => {
        setHighlightedIndex(selectedIndex);
    }, [selectedIndex]);

    useEffect(() => {
        const handlePointerDown = (event) => {
            if (!containerRef.current?.contains(event.target)) setIsOpen(false);
        };

        document.addEventListener('pointerdown', handlePointerDown);
        return () => document.removeEventListener('pointerdown', handlePointerDown);
    }, []);

    const focusOption = (index) => {
        const nextIndex = (index + options.length) % options.length;
        setHighlightedIndex(nextIndex);
        requestAnimationFrame(() => optionRefs.current[nextIndex]?.focus());
    };

    const openMenu = (index = selectedIndex) => {
        setHighlightedIndex(index);
        setIsOpen(true);
        requestAnimationFrame(() => optionRefs.current[index]?.focus());
    };

    const closeMenu = (returnFocus = true) => {
        setIsOpen(false);
        if (returnFocus) requestAnimationFrame(() => triggerRef.current?.focus());
    };

    const chooseLanguage = (value) => {
        setLanguage(value);
        closeMenu();
    };

    const handleTriggerKeyDown = (event) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            openMenu(event.key === 'ArrowDown' ? selectedIndex : selectedIndex - 1);
        } else if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            if (isOpen) chooseLanguage(options[highlightedIndex].value);
            else openMenu();
        } else if (event.key === 'Escape' && isOpen) {
            event.preventDefault();
            closeMenu();
        }
    };

    const handleOptionKeyDown = (event, index) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            focusOption(index + 1);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            focusOption(index - 1);
        } else if (event.key === 'Home') {
            event.preventDefault();
            focusOption(0);
        } else if (event.key === 'End') {
            event.preventDefault();
            focusOption(options.length - 1);
        } else if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            chooseLanguage(options[index].value);
        } else if (event.key === 'Escape') {
            event.preventDefault();
            closeMenu();
        } else if (event.key === 'Tab') {
            closeMenu(false);
        }
    };

    return (
        <div ref={containerRef} className="language-selector">
            <button
                ref={triggerRef}
                type="button"
                className="language-trigger"
                onClick={() => isOpen ? closeMenu(false) : openMenu()}
                onKeyDown={handleTriggerKeyDown}
                aria-label={t('language')}
                aria-controls="language-options"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                <Languages className="h-4 w-4" aria-hidden="true" />
                <span>{t(options[selectedIndex].label)}</span>
                <ChevronDown className={`language-chevron h-3.5 w-3.5 ${isOpen ? 'is-open' : ''}`} aria-hidden="true" />
            </button>

            {isOpen && (
                <div id="language-options" className="language-menu" role="listbox" aria-label={t('language')}>
                    {options.map((option, index) => {
                        const selected = option.value === language;
                        return (
                            <div
                                key={option.value}
                                ref={(element) => { optionRefs.current[index] = element; }}
                                className={`language-option ${selected ? 'is-selected' : ''} ${highlightedIndex === index ? 'is-highlighted' : ''}`}
                                role="option"
                                tabIndex={highlightedIndex === index ? 0 : -1}
                                aria-selected={selected}
                                onClick={() => chooseLanguage(option.value)}
                                onKeyDown={(event) => handleOptionKeyDown(event, index)}
                            >
                                <span>{t(option.label)}</span>
                                {selected && <Check className="h-4 w-4" aria-hidden="true" />}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
