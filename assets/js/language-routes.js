// Centralized language route mappings with baseurl support
window.LanguageRoutes = {
    // Get the base URL from the current location
    baseUrl: '/website',

    // Initialize and detect base URL
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
    },

    // Convert URL from one language to another - Simplified
    convertUrl: function(url, fromLang, toLang) {
        // Remove baseUrl if present to work with relative paths
        let relativeUrl = url;
        if (this.baseUrl && url.startsWith(this.baseUrl)) {
            relativeUrl = url.substring(this.baseUrl.length);
        }

        // Clean the URL
        relativeUrl = relativeUrl.replace(/\/$/, '') + '/';

        // For consistent routes, conversion is simple
        if (fromLang === 'en' && toLang === 'pt') {
            // Add /pt prefix if not already present
            if (!relativeUrl.startsWith('/pt/')) {
                // If it's the home page
                if (relativeUrl === '/') {
                    return this.baseUrl + '/pt/';
                }
                // For other pages, insert /pt after the base
                return this.baseUrl + '/pt' + relativeUrl;
            }
            return this.baseUrl + relativeUrl;
        } else if (fromLang === 'pt' && toLang === 'en') {
            // Remove /pt prefix if present
            if (relativeUrl.startsWith('/pt/')) {
                return this.baseUrl + relativeUrl.substring(3);
            }
            return this.baseUrl + relativeUrl;
        } else if (fromLang !== toLang) {
            // Generic conversion for future languages
            const cleanUrl = relativeUrl.replace(new RegExp(`^/${fromLang}/`), '/');
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
            '/docs/why-pivotphp/',
            '/docs/benchmarks/',
            '/docs/authentication/',
            '/docs/orm/',
            '/docs/api-reference/',
            '/docs/changelog/'
        ],
        pt: [
            '/pt/',
            '/pt/docs/',
            '/pt/docs/installation/',
            '/pt/docs/quickstart/',
            '/pt/docs/configuration/',
            '/pt/docs/routing/',
            '/pt/docs/middleware/',
            '/pt/docs/requests-responses/',
            '/pt/docs/container/',
            '/pt/docs/security/',
            '/pt/docs/events/',
            '/pt/docs/validation/',
            '/pt/docs/database/',
            '/pt/docs/providers/',
            '/pt/docs/testing/',
            '/pt/docs/deployment/',
            '/pt/docs/why-pivotphp/',
            '/pt/docs/benchmarks/',
            '/pt/docs/authentication/',
            '/pt/docs/orm/',
            '/pt/docs/api-reference/',
            '/pt/docs/changelog/'
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
