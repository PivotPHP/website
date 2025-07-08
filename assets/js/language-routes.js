// Centralized language route mappings with baseurl support
window.LanguageRoutes = {
    // Get the base URL from the current location
    baseUrl: '',

    // Initialize and detect base URL
    init: function() {
        // Get base URL from meta tag or detect from current location
        const metaBase = document.querySelector('meta[name="base-url"]');
        if (metaBase) {
            this.baseUrl = metaBase.content;
        } else {
            // Auto-detect baseUrl from current location
            const path = window.location.pathname;
            // Check if we're in a subdirectory (like /website)
            if (path.includes('/website/')) {
                this.baseUrl = '/website';
            } else if (path.startsWith('/website')) {
                this.baseUrl = '/website';
            } else {
                this.baseUrl = '';
            }
        }
    },

    // Convert URL from one language to another - Simplified
    convertUrl: function(url, fromLang, toLang) {
        // Create a clean working URL without baseUrl
        let workingUrl = url;
        
        // Remove multiple occurrences of baseUrl
        while (this.baseUrl && workingUrl.includes(this.baseUrl + this.baseUrl)) {
            workingUrl = workingUrl.replace(this.baseUrl + this.baseUrl, this.baseUrl);
        }
        
        // Remove single baseUrl to get relative path
        if (this.baseUrl && workingUrl.startsWith(this.baseUrl)) {
            workingUrl = workingUrl.substring(this.baseUrl.length);
        }
        
        // Ensure URL starts with /
        if (!workingUrl.startsWith('/')) {
            workingUrl = '/' + workingUrl;
        }
        
        // Clean the URL - ensure it ends with /
        workingUrl = workingUrl.replace(/\/$/, '') + '/';
        
        let resultUrl;
        
        // Convert between languages
        if (fromLang === 'pt' && toLang === 'en') {
            // Remove /pt/ prefix if present
            if (workingUrl.startsWith('/pt/')) {
                resultUrl = workingUrl.substring(3);
            } else {
                resultUrl = workingUrl;
            }
        } else if (fromLang === 'en' && toLang === 'pt') {
            // Add /pt/ prefix if not already present
            if (!workingUrl.startsWith('/pt/')) {
                if (workingUrl === '/') {
                    resultUrl = '/pt/';
                } else {
                    resultUrl = '/pt' + workingUrl;
                }
            } else {
                resultUrl = workingUrl;
            }
        } else {
            // For other language conversions
            resultUrl = workingUrl;
        }
        
        // Add baseUrl back ONLY ONCE
        const finalUrl = this.baseUrl + resultUrl;
        
        return finalUrl;
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
            '/docs/changelog/',
            '/docs/extensions/',
            '/docs/extensions/cycle-orm/'
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
            '/pt/docs/changelog/',
            '/pt/docs/extensions/',
            '/pt/docs/extensions/cycle-orm/'
        ]
    },

    // Check if a URL exists (for validation)
    urlExists: function(url, lang) {
        // Remove multiple baseUrls if present
        let checkUrl = url;
        while (this.baseUrl && checkUrl.includes(this.baseUrl + this.baseUrl)) {
            checkUrl = checkUrl.replace(this.baseUrl + this.baseUrl, this.baseUrl);
        }
        
        // Remove baseUrl for validation
        if (this.baseUrl && checkUrl.startsWith(this.baseUrl)) {
            checkUrl = checkUrl.substring(this.baseUrl.length);
        }

        // Ensure URL starts with /
        if (!checkUrl.startsWith('/')) {
            checkUrl = '/' + checkUrl;
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
