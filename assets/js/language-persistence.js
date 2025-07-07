// Language persistence across navigation
(function() {
    'use strict';

    // Ensure LanguageRoutes is loaded
    if (typeof window.LanguageRoutes === 'undefined') {
        console.error('LanguageRoutes not loaded. Make sure language-routes.js is included before this script.');
        return;
    }

    // Get current language using the centralized system
    const currentLang = LanguageRoutes.getCurrentLang();
    
    // Store current language preference
    if (currentLang !== 'en') {
        localStorage.setItem('preferred-language', currentLang);
    }

    // Update all internal links to maintain language consistency
    function updateLinks() {
        const lang = LanguageRoutes.getCurrentLang();
        if (lang === 'en') return;

        // Get all internal links
        const links = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            
            // Skip if it's just an anchor link
            if (href === '#' || href.startsWith('#')) return;
            
            // Skip if already has the current language prefix
            if (href.includes('/' + lang + '/')) return;
            
            // Convert the URL to the current language
            const newHref = LanguageRoutes.convertUrl(href, 'en', lang);
            
            if (newHref !== href) {
                link.setAttribute('href', newHref);
            }
        });
    }

    // Run on page load
    updateLinks();

    // Run after any dynamic content changes
    const observer = new MutationObserver(function(mutations) {
        // Debounce to avoid excessive updates
        clearTimeout(observer.timeout);
        observer.timeout = setTimeout(updateLinks, 100);
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Handle automatic language redirection on homepage
    const path = window.location.pathname;
    const isHomepage = path === '/' || path === '/website/' || path === '/website';
    
    if (isHomepage) {
        const preferredLang = localStorage.getItem('preferred-language');
        
        // Only redirect if we have a preferred language that's not English
        if (preferredLang && preferredLang !== 'en') {
            // Validate that the language is supported
            const supportedLangs = ['pt', 'es', 'fr', 'de']; // Add more as needed
            
            if (supportedLangs.includes(preferredLang)) {
                const basePath = path.includes('/website') ? '/website/' : '/';
                const targetUrl = basePath + preferredLang + '/';
                
                // Avoid redirect loops
                if (window.location.pathname !== targetUrl) {
                    window.location.href = targetUrl;
                }
            }
        }
    }

    // Export updateLinks function for external use
    window.updateLanguageLinks = updateLinks;
})();