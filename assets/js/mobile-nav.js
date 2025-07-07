// Mobile navigation functionality
(function() {
    'use strict';

    // Create mobile navigation elements
    function createMobileElements() {
        // Create mobile nav toggle button
        const navToggle = document.createElement('button');
        navToggle.className = 'mobile-nav-toggle';
        navToggle.setAttribute('aria-label', 'Toggle navigation menu');
        navToggle.innerHTML = '<span></span><span></span><span></span>';

        // Create mobile sidebar toggle button for docs pages
        const sidebarToggle = document.createElement('button');
        sidebarToggle.className = 'mobile-sidebar-toggle';
        sidebarToggle.setAttribute('aria-label', 'Toggle documentation sidebar');
        sidebarToggle.innerHTML = '☰';

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'mobile-overlay';

        // Add elements to DOM
        document.body.appendChild(navToggle);
        
        // Only add sidebar toggle on docs pages
        if (document.querySelector('.docs-sidebar')) {
            document.body.appendChild(sidebarToggle);
        }
        
        document.body.appendChild(overlay);

        return { navToggle, sidebarToggle, overlay };
    }

    // Initialize mobile navigation
    function initMobileNav() {
        const { navToggle, sidebarToggle, overlay } = createMobileElements();
        const navLinks = document.querySelector('.nav-links');
        const sidebar = document.querySelector('.docs-sidebar');

        // Handle navigation toggle
        if (navToggle && navLinks) {
            navToggle.addEventListener('click', function() {
                const isActive = navLinks.classList.contains('active');
                
                if (isActive) {
                    closeNav();
                } else {
                    openNav();
                }
            });
        }

        // Handle sidebar toggle
        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', function() {
                const isActive = sidebar.classList.contains('active');
                
                if (isActive) {
                    closeSidebar();
                } else {
                    openSidebar();
                }
            });
        }

        // Handle overlay clicks
        overlay.addEventListener('click', function() {
            closeNav();
            closeSidebar();
        });

        // Close menus on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeNav();
                closeSidebar();
            }
        });

        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth > 768) {
                    closeNav();
                    closeSidebar();
                }
            }, 250);
        });

        // Navigation functions
        function openNav() {
            navLinks.classList.add('active');
            navToggle.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeNav() {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        function openSidebar() {
            sidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeSidebar() {
            if (sidebar) {
                sidebar.classList.remove('active');
            }
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Close navigation when clicking on a link
        if (navLinks) {
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', closeNav);
            });
        }

        // Handle swipe gestures
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        document.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            // Swipe left to open nav (from right edge)
            if (diff < -swipeThreshold && touchStartX > window.innerWidth - 50) {
                openNav();
            }
            
            // Swipe right to close nav
            if (diff > swipeThreshold && navLinks && navLinks.classList.contains('active')) {
                closeNav();
            }

            // Swipe right to open sidebar (from left edge)
            if (diff > swipeThreshold && touchStartX < 50 && sidebar) {
                openSidebar();
            }

            // Swipe left to close sidebar
            if (diff < -swipeThreshold && sidebar && sidebar.classList.contains('active')) {
                closeSidebar();
            }
        }
    }

    // Auto-hide header on scroll (mobile only)
    function initAutoHideHeader() {
        if (window.innerWidth > 768) return;

        const header = document.querySelector('.docs-header');
        if (!header) return;

        let lastScrollTop = 0;
        let isScrolling;

        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Clear timeout
            window.clearTimeout(isScrolling);

            // Scrolling down
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                header.style.transform = 'translateY(-100%)';
            } 
            // Scrolling up
            else {
                header.style.transform = 'translateY(0)';
            }

            // Set timeout to show header when scrolling stops
            isScrolling = setTimeout(function() {
                header.style.transform = 'translateY(0)';
            }, 1000);

            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }, { passive: true });

        // Add transition
        header.style.transition = 'transform 0.3s ease';
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initMobileNav();
            initAutoHideHeader();
        });
    } else {
        initMobileNav();
        initAutoHideHeader();
    }

    // Re-initialize on navigation (for turbo-nav compatibility)
    window.addEventListener('turbo:load', function() {
        initMobileNav();
        initAutoHideHeader();
    });
})();