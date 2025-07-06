// Highlight active navigation item
(function() {
    'use strict';
    
    // Get current page path
    const currentPath = window.location.pathname;
    
    // Find all sidebar links
    const sidebarLinks = document.querySelectorAll('.docs-sidebar a');
    
    sidebarLinks.forEach(link => {
        // Get the href attribute
        const href = link.getAttribute('href');
        
        // Check if this is the current page
        if (href && currentPath.endsWith(href)) {
            link.classList.add('active');
            
            // Expand parent sections if nested
            let parent = link.parentElement;
            while (parent) {
                if (parent.classList.contains('docs-sidebar')) break;
                if (parent.tagName === 'DETAILS') {
                    parent.setAttribute('open', 'open');
                }
                parent = parent.parentElement;
            }
        }
    });
    
    // Smooth scroll to section if hash in URL
    if (window.location.hash) {
        setTimeout(() => {
            const element = document.querySelector(window.location.hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }
})();