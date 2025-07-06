// Alternative: Simple Turbo-like navigation for docs
(function() {
    'use strict';
    
    // Cache for visited pages
    const pageCache = new Map();
    
    // Load page content via AJAX
    async function loadPage(url) {
        // Check cache first
        if (pageCache.has(url)) {
            return pageCache.get(url);
        }
        
        try {
            const response = await fetch(url);
            const html = await response.text();
            
            // Parse the HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Cache the result
            pageCache.set(url, doc);
            
            return doc;
        } catch (error) {
            console.error('Failed to load page:', error);
            return null;
        }
    }
    
    // Update page content
    function updatePage(newDoc) {
        // Get the new content
        const newMain = newDoc.querySelector('.docs-main');
        const newTitle = newDoc.querySelector('title').textContent;
        
        if (!newMain) return false;
        
        // Update title
        document.title = newTitle;
        
        // Replace main content with animation
        const currentMain = document.querySelector('.docs-main');
        
        // Fade out current content
        currentMain.style.opacity = '0';
        currentMain.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            // Replace content
            currentMain.innerHTML = newMain.innerHTML;
            
            // Update active nav
            updateActiveNav();
            
            // Re-run scripts
            reinitializeScripts();
            
            // Fade in new content
            currentMain.style.opacity = '1';
            currentMain.style.transform = 'translateY(0)';
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 200);
        
        return true;
    }
    
    // Update active navigation
    function updateActiveNav() {
        const currentPath = window.location.pathname;
        
        document.querySelectorAll('.docs-sidebar a').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && currentPath.endsWith(href)) {
                link.classList.add('active');
            }
        });
    }
    
    // Reinitialize any scripts needed for new content
    function reinitializeScripts() {
        // Re-attach smooth scroll to new anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
        
        // Syntax highlighting if using a library
        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
        }
    }
    
    // Handle navigation
    async function navigate(url) {
        // Show loading state
        document.body.classList.add('page-loading');
        
        // Load new page
        const newDoc = await loadPage(url);
        
        if (newDoc && updatePage(newDoc)) {
            // Update URL
            history.pushState(null, '', url);
        } else {
            // Fallback to normal navigation
            window.location.href = url;
        }
        
        // Remove loading state
        document.body.classList.remove('page-loading');
    }
    
    // Intercept link clicks
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        
        if (link && 
            link.href && 
            link.href.startsWith(window.location.origin) &&
            link.href.includes('/docs/') &&
            !link.hasAttribute('target') &&
            !link.href.includes('#') &&
            !e.ctrlKey && !e.shiftKey && !e.metaKey) {
            
            e.preventDefault();
            navigate(link.href);
        }
    });
    
    // Handle browser back/forward
    window.addEventListener('popstate', function() {
        loadPage(window.location.href).then(newDoc => {
            if (newDoc) {
                updatePage(newDoc);
            }
        });
    });
    
    // Initialize
    updateActiveNav();
    
    // Add transition styles
    const style = document.createElement('style');
    style.textContent = `
        .docs-main {
            transition: opacity 0.2s ease, transform 0.2s ease;
        }
        
        body.page-loading .docs-header::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: linear-gradient(90deg, 
                transparent 0%, 
                var(--primary) 50%, 
                transparent 100%);
            animation: loading 1s linear infinite;
        }
        
        @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
    `;
    document.head.appendChild(style);
})();