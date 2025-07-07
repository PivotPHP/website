// Mobile sidebar toggle for documentation pages
document.addEventListener('DOMContentLoaded', function() {
    // Create mobile menu toggle button
    const menuToggle = document.createElement('button');
    menuToggle.className = 'docs-menu-toggle';
    menuToggle.innerHTML = `
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `;
    menuToggle.setAttribute('aria-label', 'Toggle documentation menu');
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'docs-overlay';
    
    // Only add to documentation pages
    const sidebar = document.querySelector('.docs-sidebar');
    if (sidebar) {
        document.body.appendChild(menuToggle);
        document.body.appendChild(overlay);
        
        // Toggle sidebar visibility
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close sidebar when clicking overlay
        overlay.addEventListener('click', function() {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Close sidebar when clicking a link (mobile only)
        const sidebarLinks = sidebar.querySelectorAll('a');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                    overlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });
        
        // Handle escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80; // Account for fixed header
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add active state to current section in sidebar
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                if (id) {
                    // Remove all active states
                    document.querySelectorAll('.docs-nav a').forEach(link => {
                        link.classList.remove('section-active');
                    });
                    
                    // Add active state to corresponding link
                    const activeLink = document.querySelector(`.docs-nav a[href*="#${id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('section-active');
                    }
                }
            }
        });
    }, observerOptions);
    
    // Observe all sections with IDs
    document.querySelectorAll('.docs-content [id]').forEach(section => {
        observer.observe(section);
    });
});