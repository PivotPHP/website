// Mobile navigation functionality - PivotPHP
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
                e.stopPropagation();
                console.log('Mobile toggle clicked');
                toggleMobileMenu();
            });

            // Close menu when clicking overlay
            overlay.addEventListener('click', function() {
                console.log('Overlay clicked');
                closeMobileMenu();
            });

            // Close menu when clicking on nav links
            const navLinks = navMenu.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    console.log('Nav link clicked');
                    closeMobileMenu();
                });
            });

            // Close menu on window resize if open
            window.addEventListener('resize', function() {
                if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                    console.log('Window resized, closing mobile menu');
                    closeMobileMenu();
                }
            });

            // Handle escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                    console.log('Escape key pressed');
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
                console.log('Mobile overlay created');
            }
            return overlay;
        }

        function toggleMobileMenu() {
            const isActive = navMenu.classList.contains('active');
            console.log('Toggle mobile menu - currently active:', isActive);

            if (isActive) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        }

        function openMobileMenu() {
            console.log('Opening mobile menu');
            navMenu.classList.add('active');
            overlay.classList.add('active');
            mobileToggle.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Animate hamburger icon
            const spans = mobileToggle.querySelectorAll('span');
            if (spans.length >= 3) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            }
        }

        function closeMobileMenu() {
            console.log('Closing mobile menu');
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
            mobileToggle.classList.remove('active');
            document.body.style.overflow = '';

            // Reset hamburger icon
            const spans = mobileToggle.querySelectorAll('span');
            if (spans.length >= 3) {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
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
            transform: rotate(45deg) translate(5px, 5px) !important;
        }

        .mobile-menu-toggle.active span:nth-child(2) {
            opacity: 0 !important;
        }

        .mobile-menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px) !important;
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

    console.log('PivotPHP: Mobile navigation styles injected');
})();
