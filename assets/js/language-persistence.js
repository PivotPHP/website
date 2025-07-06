// Language persistence across navigation
(function() {
    'use strict';
    
    // Get current language from URL
    function getCurrentLang() {
        const path = window.location.pathname;
        const match = path.match(/^\/(pt|es|fr|de)\//);
        return match ? match[1] : 'en';
    }
    
    // Store current language
    const currentLang = getCurrentLang();
    if (currentLang !== 'en') {
        localStorage.setItem('preferred-language', currentLang);
    }
    
    // Update all internal links to maintain language
    function updateLinks() {
        const lang = getCurrentLang();
        if (lang === 'en') return;
        
        // Update all docs links
        document.querySelectorAll('a[href^="/docs/"], a[href^="{{ site.baseurl }}/docs/"]').forEach(link => {
            const href = link.getAttribute('href');
            if (!href.includes('/' + lang + '/')) {
                // Transform /docs/... to /pt/docs/...
                const newHref = href.replace(/^(.*?)(\/docs\/)/, '$1/' + lang + '$2');
                link.setAttribute('href', newHref);
            }
        });
    }
    
    // Run on page load
    updateLinks();
    
    // Run after any dynamic content changes
    const observer = new MutationObserver(updateLinks);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Redirect to preferred language on homepage
    if (window.location.pathname === '/' || window.location.pathname === '/website/') {
        const preferredLang = localStorage.getItem('preferred-language');
        if (preferredLang && preferredLang !== 'en') {
            window.location.href = '/' + preferredLang + '/';
        }
    }
})();