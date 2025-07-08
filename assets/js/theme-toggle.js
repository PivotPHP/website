/**
 * Theme Toggle System for PivotPHP
 * Manages light/dark theme switching with localStorage persistence
 */

(function() {
    'use strict';
    
    // Constants
    const THEME_KEY = 'pivotphp-theme';
    const DEFAULT_THEME = 'light';
    const THEMES = ['light', 'dark'];
    
    /**
     * Get the saved theme from localStorage or return default
     */
    function getSavedTheme() {
        const saved = localStorage.getItem(THEME_KEY);
        return THEMES.includes(saved) ? saved : DEFAULT_THEME;
    }
    
    /**
     * Apply theme to the document
     */
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update any theme toggle buttons
        const toggleButtons = document.querySelectorAll('[data-theme-toggle]');
        toggleButtons.forEach(button => {
            button.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`);
            button.setAttribute('data-current-theme', theme);
        });
    }
    
    /**
     * Save theme preference to localStorage
     */
    function saveTheme(theme) {
        localStorage.setItem(THEME_KEY, theme);
    }
    
    /**
     * Toggle between light and dark themes
     */
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || DEFAULT_THEME;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        applyTheme(newTheme);
        saveTheme(newTheme);
        
        // Dispatch custom event for other components to react
        window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme: newTheme } }));
    }
    
    /**
     * Initialize theme system
     */
    function initTheme() {
        // Apply saved theme immediately to prevent flash
        const savedTheme = getSavedTheme();
        applyTheme(savedTheme);
        
        // Set up click handlers for all theme toggle buttons
        document.addEventListener('click', function(e) {
            if (e.target.closest('[data-theme-toggle]')) {
                e.preventDefault();
                toggleTheme();
            }
        });
        
        // Listen for system preference changes
        if (window.matchMedia) {
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            // Check if user hasn't set a preference yet
            if (!localStorage.getItem(THEME_KEY)) {
                // Use system preference
                const systemTheme = darkModeQuery.matches ? 'dark' : 'light';
                applyTheme(systemTheme);
            }
            
            // Listen for system preference changes
            darkModeQuery.addEventListener('change', function(e) {
                // Only apply if user hasn't set a manual preference
                if (!localStorage.getItem(THEME_KEY)) {
                    const systemTheme = e.matches ? 'dark' : 'light';
                    applyTheme(systemTheme);
                }
            });
        }
    }
    
    // Initialize as soon as possible to prevent flash
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
    
    // Also apply theme immediately to prevent flash (before DOMContentLoaded)
    const immediateTheme = getSavedTheme();
    if (document.documentElement) {
        document.documentElement.setAttribute('data-theme', immediateTheme);
    }
    
    // Export functions for global use
    window.PivotTheme = {
        toggle: toggleTheme,
        apply: applyTheme,
        getCurrent: () => document.documentElement.getAttribute('data-theme') || DEFAULT_THEME
    };
})();