// Centralized language route mappings with baseurl support
window.LanguageRoutes = {
    // Get the base URL from the current location
    baseUrl: '/website',

    // Bi-directional mappings between English and Portuguese (relative paths)
    // Mantendo URLs equivalentes para facilitar a troca de idiomas
    mappings: {
        '/': '/pt/',
        '/docs/': '/pt/docs/',
        '/docs/installation/': '/pt/docs/installation/',
        '/docs/quickstart/': '/pt/docs/quickstart/',
        '/docs/configuration/': '/pt/docs/configuration/',
        '/docs/routing/': '/pt/docs/routing/',
        '/docs/middleware/': '/pt/docs/middleware/',
        '/docs/requests-responses/': '/pt/docs/requests-responses/',
        '/docs/container/': '/pt/docs/container/',
        '/docs/security/': '/pt/docs/security/',
        '/docs/events/': '/pt/docs/events/',
        '/docs/validation/': '/pt/docs/validation/',
        '/docs/database/': '/pt/docs/database/',
        '/docs/providers/': '/pt/docs/providers/',
        '/docs/testing/': '/pt/docs/testing/',
        '/docs/deployment/': '/pt/docs/deployment/',
        '/docs/why-pivotphp/': '/pt/docs/why-pivotphp/'
    },

    // Get the reverse mapping (PT -> EN)
    reverseMappings: null,

    // Initialize reverse mappings and detect base URL
    init: function() {
        // Auto-detect baseUrl from current location
        const path = window.location.pathname;
        const match = path.match(/^(\/[^\/]+)?\/(pt|en|website)/);
        if (path.includes('/website')) {
            this.baseUrl = '/website';
        } else if (match && match[1]) {
            this.baseUrl = match[1];
        } else {
            this.baseUrl = '';
        }

        this.reverseMappings = {};
        for (const [en, pt] of Object.entries(this.mappings)) {
            this.reverseMappings[pt] = en;
        }
    },

    // Convert URL from one language to another
    convertUrl: function(url, fromLang, toLang) {
        // Remove baseUrl if present to work with relative paths
        let relativeUrl = url;
        if (this.baseUrl && url.startsWith(this.baseUrl)) {
            relativeUrl = url.substring(this.baseUrl.length);
        }

        // Clean the URL
        relativeUrl = relativeUrl.replace(/\/$/, '') + '/';

        // If converting from EN to PT
        if (fromLang === 'en' && toLang === 'pt') {
            // Direct mapping
            if (this.mappings[relativeUrl]) {
                return this.baseUrl + this.mappings[relativeUrl];
            }
            // If not found, add language prefix
            if (!relativeUrl.includes('/pt/')) {
                return this.baseUrl + '/pt' + relativeUrl;
            }
        }

        // If converting from PT to EN
        if (fromLang === 'pt' && toLang === 'en') {
            // Use reverse mapping
            if (this.reverseMappings[relativeUrl]) {
                return this.baseUrl + this.reverseMappings[relativeUrl];
            }
            // If not found, remove language prefix
            const cleanUrl = relativeUrl.replace(/^\/pt/, '');
            return this.baseUrl + cleanUrl;
        }

        // For other language conversions (future support)
        if (fromLang !== toLang) {
            // Remove old language prefix and add new one
            const cleanUrl = relativeUrl.replace(new RegExp(`^/${fromLang}`), '');
            const newUrl = toLang === 'en' ? cleanUrl : `/${toLang}${cleanUrl}`;
            return this.baseUrl + newUrl;
        }

        return url;
    },

    // Get current language from URL
    getCurrentLang: function() {
        const path = window.location.pathname;
        // Remove baseUrl if present
        const cleanPath = this.baseUrl ? path.replace(this.baseUrl, '') : path;
        const match = cleanPath.match(/^\/(pt|es|fr|de)\//);
        return match ? match[1] : 'en';
    },

    // List of valid URLs for each language (with baseUrl)
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
            '/docs/why-pivotphp/'
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
            '/pt/docs/why-pivotphp/'
        ]
    },

    // Check if a URL exists (for validation)
    urlExists: function(url, lang) {
        // Remove baseUrl for validation
        let checkUrl = url;
        if (this.baseUrl && url.startsWith(this.baseUrl)) {
            checkUrl = url.substring(this.baseUrl.length);
        }

        // Clean the URL
        checkUrl = checkUrl.replace(/\/$/, '') + '/';

        // Get the language-specific valid URLs
        const langUrls = this.validUrls[lang || this.getCurrentLang()];

        // Check if the URL exists in the valid URLs list
        return langUrls && langUrls.includes(checkUrl);
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
