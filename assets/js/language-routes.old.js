// Centralized language route mappings
window.LanguageRoutes = {
    // Bi-directional mappings between English and Portuguese
    mappings: {
        '/': '/pt/',
        '/docs/': '/pt/docs/',
        '/docs/installation/': '/pt/docs/instalacao/',
        '/docs/quickstart/': '/pt/docs/inicio-rapido/',
        '/docs/configuration/': '/pt/docs/configuracao/',
        '/docs/routing/': '/pt/docs/roteamento/',
        '/docs/middleware/': '/pt/docs/middleware/',
        '/docs/requests-responses/': '/pt/docs/requisicoes-respostas/',
        '/docs/container/': '/pt/docs/container/',
        '/docs/security/': '/pt/docs/seguranca/',
        '/docs/events/': '/pt/docs/eventos/',
        '/docs/validation/': '/pt/docs/validacao/',
        '/docs/database/': '/pt/docs/banco-de-dados/',
        '/docs/providers/': '/pt/docs/provedores/',
        '/docs/testing/': '/pt/docs/testes/',
        '/docs/deployment/': '/pt/docs/deploy/',
        '/docs/why-helix/': '/pt/docs/why-helix/'
    },

    // Get the reverse mapping (PT -> EN)
    reverseMappings: null,

    // Initialize reverse mappings
    init: function() {
        this.reverseMappings = {};
        for (const [en, pt] of Object.entries(this.mappings)) {
            this.reverseMappings[pt] = en;
        }
    },

    // Convert URL from one language to another
    convertUrl: function(url, fromLang, toLang) {
        // Clean the URL
        url = url.replace(/\/$/, '') + '/';
        
        // If converting from EN to PT
        if (fromLang === 'en' && toLang === 'pt') {
            // Direct mapping
            if (this.mappings[url]) {
                return this.mappings[url];
            }
            // If not found, add language prefix
            if (!url.includes('/pt/')) {
                return '/pt' + url;
            }
        }
        
        // If converting from PT to EN
        if (fromLang === 'pt' && toLang === 'en') {
            // Use reverse mapping
            if (this.reverseMappings[url]) {
                return this.reverseMappings[url];
            }
            // If not found, remove language prefix
            return url.replace(/^\/pt/, '');
        }
        
        // For other language conversions (future support)
        if (fromLang !== toLang) {
            // Remove old language prefix and add new one
            const cleanUrl = url.replace(new RegExp(`^/${fromLang}`), '');
            return toLang === 'en' ? cleanUrl : `/${toLang}${cleanUrl}`;
        }
        
        return url;
    },

    // Get current language from URL
    getCurrentLang: function() {
        const path = window.location.pathname;
        const match = path.match(/^\/(?:website\/)?(pt|es|fr|de)\//);
        return match ? match[1] : 'en';
    },

    // List of valid URLs for each language
    validUrls: {
        en: [
            '/',
            '/docs/',
            '/docs/installation/',
            '/docs/quickstart/',
            '/docs/configuration/',
            '/docs/routing/',
            '/docs/middleware/',
            '/docs/requests-responses/',
            '/docs/container/',
            '/docs/security/',
            '/docs/events/',
            '/docs/validation/',
            '/docs/database/',
            '/docs/providers/',
            '/docs/testing/',
            '/docs/deployment/',
            '/docs/why-helix/'
        ],
        pt: [
            '/pt/',
            '/pt/docs/',
            '/pt/docs/instalacao/',
            '/pt/docs/inicio-rapido/',
            '/pt/docs/configuracao/',
            '/pt/docs/roteamento/',
            '/pt/docs/middleware/',
            '/pt/docs/requisicoes-respostas/',
            '/pt/docs/container/',
            '/pt/docs/seguranca/',
            '/pt/docs/eventos/',
            '/pt/docs/validacao/',
            '/pt/docs/banco-de-dados/',
            '/pt/docs/provedores/',
            '/pt/docs/testes/',
            '/pt/docs/deploy/',
            '/pt/docs/why-helix/'
        ]
    },

    // Check if a URL exists (for validation)
    urlExists: function(url, lang) {
        // Clean the URL
        url = url.replace(/\/$/, '') + '/';
        
        // Get the language-specific valid URLs
        const langUrls = this.validUrls[lang || this.getCurrentLang()];
        
        // Check if the URL exists in the valid URLs list
        return langUrls && langUrls.includes(url);
    },

    // Update a single link element
    updateLink: function(link, targetLang) {
        const currentLang = this.getCurrentLang();
        if (currentLang === targetLang) return;

        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('http')) return;

        const newHref = this.convertUrl(href, currentLang, targetLang);
        if (newHref !== href) {
            link.setAttribute('href', newHref);
        }
    },

    // Update all links on the page
    updateAllLinks: function(targetLang) {
        const links = document.querySelectorAll('a[href]');
        links.forEach(link => this.updateLink(link, targetLang));
    }
};

// Initialize on load
LanguageRoutes.init();