/**
 * Simplified Theme Toggle System for PivotPHP
 * Manages light/dark theme switching with localStorage persistence
 */

(function() {
    'use strict';
    
    const THEME_KEY = 'pivotphp-theme';
    const DEFAULT_THEME = 'light';
    
    /**
     * Get theme from localStorage or system preference
     */
    function getTheme() {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved) return saved;
        
        // Check system preference
        if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        
        return DEFAULT_THEME;
    }
    
    /**
     * Apply theme to documentElement only
     */
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update toggle button aria-label
        document.querySelectorAll('[data-theme-toggle]').forEach(button => {
            button.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`);
        });
    }
    
    /**
     * Toggle theme
     */
    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || DEFAULT_THEME;
        const newTheme = current === 'light' ? 'dark' : 'light';
        
        applyTheme(newTheme);
        localStorage.setItem(THEME_KEY, newTheme);
        
        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme: newTheme } }));
    }
    
    /**
     * Initialize theme system
     */
    function init() {
        // Apply theme immediately
        applyTheme(getTheme());
        
        // Set up toggle button click handler
        document.addEventListener('click', e => {
            if (e.target.closest('[data-theme-toggle]')) {
                e.preventDefault();
                toggleTheme();
            }
        });
        
        // Listen for system preference changes (only if no saved preference)
        window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem(THEME_KEY)) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
    
    // Apply theme immediately to prevent flash
    applyTheme(getTheme());
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Export simple API
    window.PivotTheme = {
        toggle: toggleTheme,
        apply: applyTheme,
        current: () => document.documentElement.getAttribute('data-theme') || DEFAULT_THEME
    };
})();