// Enhanced animations and interactions
document.addEventListener('DOMContentLoaded', function() {
    // Staggered animation for service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Staggered animation for feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.style.animation = 'fadeInUp 0.6s ease-out both';
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });

    // Floating animation for icons
    const icons = document.querySelectorAll('.service-icon, .feature-icon, .info-icon');
    icons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            icon.style.animation = 'float 1s ease-in-out infinite';
        });
        icon.addEventListener('mouseleave', () => {
            icon.style.animation = '';
        });
    });

    // Add floating keyframes to CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        
        .service-card, .feature-card, .info-card {
            animation: fadeInUp 0.6s ease-out both;
        }
    `;
    document.head.appendChild(style);

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('.service-card, .feature-card, .info-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
});

// Enhanced form interactions
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Add focus ring effect
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.3s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
        
        // Add typing effect
        input.addEventListener('input', function() {
            this.style.boxShadow = '0 0 20px rgba(231, 76, 60, 0.3)';
            setTimeout(() => {
                this.style.boxShadow = '';
            }, 300);
        });
    });
});