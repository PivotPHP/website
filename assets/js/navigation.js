// PivotPHP Website Navigation Enhancement Script
// Based on DESIGN_IDENTITY specifications

document.addEventListener('DOMContentLoaded', function() {
    // Add scroll behavior to navbar
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navbarNav = document.querySelector('.navbar-nav');

    if (mobileToggle && navbarNav) {
        mobileToggle.addEventListener('click', function() {
            navbarNav.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }

    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

    // Add fade-in animation to elements as they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeIn');
            }
        });
    }, observerOptions);

    // Observe cards and sections
    document.querySelectorAll('.card, .stat-card, .benchmark-chart').forEach(el => {
        observer.observe(el);
    });

    // Language switcher functionality
    window.switchLanguage = function(lang) {
        const currentPath = window.location.pathname;
        let newPath;

        if (lang === 'pt') {
            if (currentPath.startsWith('/pt/')) {
                return; // Already on Portuguese
            }
            newPath = '/pt' + currentPath;
        } else {
            if (currentPath.startsWith('/pt/')) {
                newPath = currentPath.replace('/pt', '');
            } else {
                return; // Already on English
            }
        }

        window.location.href = newPath;
    };

    // Add loading state to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.href && !this.href.startsWith('#')) {
                this.style.opacity = '0.7';
                this.style.pointerEvents = 'none';
            }
        });
    });

    // Copy code functionality
    document.querySelectorAll('pre code').forEach(block => {
        const button = document.createElement('button');
        button.innerText = 'Copy';
        button.className = 'copy-button';
        button.style.cssText = `
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: var(--pivot-primary);
            color: white;
            border: none;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.75rem;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const pre = block.parentElement;
        pre.style.position = 'relative';
        pre.appendChild(button);

        pre.addEventListener('mouseenter', () => {
            button.style.opacity = '1';
        });

        pre.addEventListener('mouseleave', () => {
            button.style.opacity = '0';
        });

        button.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(block.textContent);
                button.innerText = 'Copied!';
                setTimeout(() => {
                    button.innerText = 'Copy';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy: ', err);
            }
        });
    });
});

// Add CSS for mobile menu
const mobileMenuStyles = `
@media (max-width: 768px) {
    .navbar-nav {
        position: fixed;
        top: 80px;
        left: 0;
        right: 0;
        background: var(--pivot-white);
        box-shadow: var(--shadow-lg);
        border-radius: 0 0 var(--radius-lg) var(--radius-lg);
        padding: var(--space-lg);
        transform: translateY(-100%);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    }

    .navbar-nav.active {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
    }

    .navbar-nav li {
        margin: var(--space-sm) 0;
    }

    .navbar-nav a {
        display: block;
        padding: var(--space-md);
        border-radius: var(--radius-md);
        text-align: center;
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
}
`;

// Inject mobile menu styles
const styleSheet = document.createElement('style');
styleSheet.textContent = mobileMenuStyles;
document.head.appendChild(styleSheet);
