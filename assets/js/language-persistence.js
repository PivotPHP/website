// Language persistence across navigation
(function() {
    'use strict';
    
    // Get current language from URL
    function getCurrentLang() {
        const path = window.location.pathname;
        // Support both /pt/ and /website/pt/ patterns
        const match = path.match(/^\/(?:website\/)?(pt|es|fr|de)\//);
        return match ? match[1] : 'en';
    }
    
    // Store current language
    const currentLang = getCurrentLang();
    if (currentLang !== 'en') {
        localStorage.setItem('preferred-language', currentLang);
    }
    
    // URL slug mappings
    const urlMappings = {
        'pt': {
            '/docs/installation/': '/docs/instalacao/',
            '/docs/quickstart/': '/docs/inicio-rapido/',
            '/docs/configuration/': '/docs/configuracao/',
            '/docs/routing/': '/docs/roteamento/',
            '/docs/requests-responses/': '/docs/requisicoes-respostas/',
            '/docs/security/': '/docs/seguranca/',
            '/docs/events/': '/docs/eventos/',
            '/docs/validation/': '/docs/validacao/',
            '/docs/database/': '/docs/banco-de-dados/',
            '/docs/providers/': '/docs/provedores/',
            '/docs/testing/': '/docs/testes/',
            '/docs/deployment/': '/docs/deploy/'
        }
    };
    
    // Update all internal links to maintain language
    function updateLinks() {
        const lang = getCurrentLang();
        if (lang === 'en') return;
        
        // Update all docs links
        document.querySelectorAll('a[href*="/docs/"]').forEach(link => {
            const href = link.getAttribute('href');
            
            // Skip if already has language prefix
            if (href.includes('/' + lang + '/')) return;
            
            let newHref = href;
            
            // Add language prefix
            if (href.startsWith('/docs/')) {
                newHref = '/' + lang + href;
            } else if (href.includes('/docs/')) {
                newHref = href.replace('/docs/', '/' + lang + '/docs/');
            }
            
            // Apply slug mappings for the language
            if (urlMappings[lang]) {
                Object.keys(urlMappings[lang]).forEach(englishSlug => {
                    const targetSlug = urlMappings[lang][englishSlug];
                    newHref = newHref.replace(englishSlug, targetSlug);
                });
            }
            
            link.setAttribute('href', newHref);
        });
        
        // Update home links to docs
        document.querySelectorAll('a[href="/docs/"], a[href="./docs/"]').forEach(link => {
            if (lang !== 'en') {
                link.setAttribute('href', '/' + lang + '/docs/');
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
    const path = window.location.pathname;
    if (path === '/' || path === '/website/' || path === '/website') {
        const preferredLang = localStorage.getItem('preferred-language');
        if (preferredLang && preferredLang !== 'en') {
            const basePath = path.includes('/website') ? '/website/' : '/';
            window.location.href = basePath + preferredLang + '/';
        }
    }
})();