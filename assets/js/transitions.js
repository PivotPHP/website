// Smooth page transitions for documentation
(function() {
    'use strict';
    
    // Check if we're on a docs page
    if (!document.querySelector('.docs-main')) return;
    
    // Create transition overlay
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    document.body.appendChild(overlay);
    
    // Handle link clicks
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        
        // Check if it's an internal docs link
        if (link && 
            link.href && 
            link.href.includes('/docs/') && 
            !link.hasAttribute('target') &&
            !link.href.includes('#')) {
            
            e.preventDefault();
            
            // Add loading class
            document.body.classList.add('page-transitioning');
            
            // Navigate after animation starts
            setTimeout(() => {
                window.location.href = link.href;
            }, 200);
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Handle browser back/forward
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            document.body.classList.remove('page-transitioning');
        }
    });
    
    // Prefetch links on hover for faster navigation
    let prefetchTimer;
    document.addEventListener('mouseover', function(e) {
        const link = e.target.closest('a');
        
        if (link && 
            link.href && 
            link.href.includes('/docs/') && 
            !link.hasAttribute('data-prefetched')) {
            
            clearTimeout(prefetchTimer);
            prefetchTimer = setTimeout(() => {
                const prefetchLink = document.createElement('link');
                prefetchLink.rel = 'prefetch';
                prefetchLink.href = link.href;
                document.head.appendChild(prefetchLink);
                link.setAttribute('data-prefetched', 'true');
            }, 100);
        }
    });
    
    document.addEventListener('mouseout', function(e) {
        if (e.target.closest('a')) {
            clearTimeout(prefetchTimer);
        }
    });
})();