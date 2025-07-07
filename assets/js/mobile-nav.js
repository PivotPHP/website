// Mobile navigation functionality - Atualizado para novo design
(function() {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        console.log('PivotPHP: Mobile navigation script loaded');

        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.navbar-nav');
        const overlay = createOverlay();

        console.log('Mobile toggle found:', !!mobileToggle);
        console.log('Nav menu found:', !!navMenu);

        if (mobileToggle && navMenu) {
            // Toggle mobile menu
            mobileToggle.addEventListener('click', function(e) {
                e.preventDefault();
                toggleMobileMenu();
            });

            // Close menu when clicking overlay
            overlay.addEventListener('click', function() {
                closeMobileMenu();
            });

            // Close menu when clicking on nav links
            const navLinks = navMenu.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    closeMobileMenu();
                });
            });

            // Close menu on window resize if open
            window.addEventListener('resize', function() {
                if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                    closeMobileMenu();
                }
            });

            // Handle escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                    closeMobileMenu();
                }
            });
        }

        function createOverlay() {
            let overlay = document.querySelector('.mobile-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'mobile-overlay';
                document.body.appendChild(overlay);
            }
            return overlay;
        }

        function toggleMobileMenu() {
            const isActive = navMenu.classList.contains('active');
            if (isActive) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        }

        function openMobileMenu() {
            navMenu.classList.add('active');
            overlay.classList.add('active');
            mobileToggle.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Animate hamburger icon
            const spans = mobileToggle.querySelectorAll('span');
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        }

        function closeMobileMenu() {
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
            mobileToggle.classList.remove('active');
            document.body.style.overflow = '';

            // Reset hamburger icon
            const spans = mobileToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });

    // Enhanced styles for mobile overlay
    const style = document.createElement('style');
    style.textContent = `
        .mobile-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            backdrop-filter: blur(4px);
        }

        .mobile-overlay.active {
            opacity: 1;
            visibility: visible;
        }

        .mobile-menu-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }

        .mobile-menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }

        .mobile-menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }

        @media (max-width: 768px) {
            .navbar-nav {
                transform: translateY(-20px);
                opacity: 0;
                transition: all 0.3s ease;
            }

            .navbar-nav.active {
                transform: translateY(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
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
