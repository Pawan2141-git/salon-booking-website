// Advanced Premium Barber Shop JavaScript

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeNavigation();
    initializeBookingWizard();
    initializeTestimonialSlider();
    initializeCounters();
    initializeParallax();
    setCurrentYear();
});

// Advanced Animations
function initializeAnimations() {
    // Hero animations
    gsap.timeline()
        .from('.hero-title .gradient-text', {
            duration: 1.2,
            y: 100,
            opacity: 0,
            stagger: 0.2,
            ease: 'power3.out'
        })
        .from('.hero-subtitle', {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: 'power2.out'
        }, '-=0.5')
        .from('.glow-button', {
            duration: 1,
            scale: 0,
            opacity: 0,
            ease: 'back.out(1.7)'
        }, '-=0.3');

    // Section animations on scroll
    gsap.utils.toArray('.service-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            },
            duration: 0.8,
            y: 100,
            opacity: 0,
            delay: index * 0.1,
            ease: 'power2.out'
        });
    });

    gsap.utils.toArray('.stat-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            },
            duration: 0.8,
            scale: 0,
            opacity: 0,
            delay: index * 0.1,
            ease: 'back.out(1.7)'
        });
    });

    gsap.utils.toArray('.barber-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            },
            duration: 0.8,
            x: index % 2 === 0 ? -100 : 100,
            opacity: 0,
            delay: index * 0.1,
            ease: 'power2.out'
        });
    });

    gsap.utils.toArray('.gallery-item').forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            },
            duration: 0.6,
            scale: 0,
            opacity: 0,
            delay: index * 0.05,
            ease: 'power2.out'
        });
    });
}

// Navigation functionality
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: targetSection,
                    ease: 'power2.inOut'
                });
            }

            // Close mobile menu
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');

            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Update active link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Booking Wizard
function initializeBookingWizard() {
    let currentStep = 1;
    const totalSteps = 5;
    let bookingData = {};

    const steps = document.querySelectorAll('.booking-step');
    const stepIndicators = document.querySelectorAll('.step');
    const progressFill = document.querySelector('.progress-fill');
    const prevBtn = document.getElementById('prev-step');
    const nextBtn = document.getElementById('next-step');
    const confirmBtn = document.getElementById('confirm-booking');

    // Service selection
    document.querySelectorAll('.service-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.service-option').forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            bookingData.service = option.dataset.service;
            bookingData.price = option.dataset.price;
        });
    });

    // Barber selection
    document.querySelectorAll('.barber-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.barber-option').forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            bookingData.barber = option.dataset.barber;
        });
    });

    // Date selection
    const dateInput = document.getElementById('booking-date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    dateInput.addEventListener('change', () => {
        bookingData.date = dateInput.value;
    });

    // Time slot selection
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.addEventListener('click', () => {
            document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
            bookingData.time = slot.dataset.time;
        });
    });

    // Customer details
    const customerInputs = ['customer-name', 'customer-phone', 'customer-email', 'customer-notes'];
    customerInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', () => {
                const key = inputId.replace('customer-', '');
                bookingData[key] = input.value;
            });
        }
    });

    // Navigation buttons
    nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            nextStep();
        }
    });

    prevBtn.addEventListener('click', () => {
        prevStep();
    });

    confirmBtn.addEventListener('click', () => {
        confirmBooking();
    });

    function nextStep() {
        if (currentStep < totalSteps) {
            currentStep++;
            updateWizard();
        }
    }

    function prevStep() {
        if (currentStep > 1) {
            currentStep--;
            updateWizard();
        }
    }

    function updateWizard() {
        // Update steps
        steps.forEach((step, index) => {
            step.classList.toggle('active', index + 1 === currentStep);
        });

        // Update step indicators
        stepIndicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index + 1 === currentStep);
            indicator.classList.toggle('completed', index + 1 < currentStep);
        });

        // Update progress bar
        const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progressFill.style.width = `${progress}%`;

        // Update buttons
        prevBtn.style.display = currentStep === 1 ? 'none' : 'block';
        nextBtn.style.display = currentStep === totalSteps ? 'none' : 'block';
        confirmBtn.style.display = currentStep === totalSteps ? 'block' : 'none';

        // Update summary on last step
        if (currentStep === totalSteps) {
            updateSummary();
        }

        // Animate step transition
        gsap.from('.booking-step.active', {
            duration: 0.5,
            x: 50,
            opacity: 0,
            ease: 'power2.out'
        });
    }

    function validateStep(step) {
        switch (step) {
            case 1:
                if (!bookingData.service) {
                    showNotification('Please select a service', 'error');
                    return false;
                }
                break;
            case 2:
                if (!bookingData.barber) {
                    showNotification('Please choose a barber', 'error');
                    return false;
                }
                break;
            case 3:
                if (!bookingData.date || !bookingData.time) {
                    showNotification('Please select date and time', 'error');
                    return false;
                }
                break;
            case 4:
                if (!bookingData.name || !bookingData.phone || !bookingData.email) {
                    showNotification('Please fill in all required fields', 'error');
                    return false;
                }
                break;
        }
        return true;
    }

    function updateSummary() {
        document.getElementById('summary-service').textContent = bookingData.service || '-';
        document.getElementById('summary-barber').textContent = bookingData.barber || '-';
        
        if (bookingData.date && bookingData.time) {
            const date = new Date(bookingData.date);
            const formattedDate = date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            const time = formatTime(bookingData.time);
            document.getElementById('summary-datetime').textContent = `${formattedDate} at ${time}`;
        }
        
        document.getElementById('summary-total').textContent = `$${bookingData.price || '0'}`;
    }

    function confirmBooking() {
        // Generate booking ID
        const bookingId = 'HCH' + Date.now().toString().slice(-6);
        
        // Show success modal
        document.getElementById('booking-id').textContent = bookingId;
        document.getElementById('success-modal').style.display = 'block';
        
        // Send email notification
        sendEmailNotification(bookingData, bookingId);
        
        // Reset wizard
        setTimeout(() => {
            resetWizard();
        }, 3000);
    }

    function resetWizard() {
        currentStep = 1;
        bookingData = {};
        updateWizard();
        
        // Clear all selections and inputs
        document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
        document.querySelectorAll('input, textarea').forEach(input => input.value = '');
    }

    function formatTime(time) {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    }
}

// Testimonial Slider
function initializeTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    let currentTestimonial = 0;

    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.toggle('active', i === index);
        });
    }

    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }

    function prevTestimonial() {
        currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentTestimonial);
    }

    nextBtn.addEventListener('click', nextTestimonial);
    prevBtn.addEventListener('click', prevTestimonial);

    // Auto-play slider
    setInterval(nextTestimonial, 5000);
}

// Animated Counters
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        
        ScrollTrigger.create({
            trigger: counter,
            start: 'top 80%',
            onEnter: () => {
                gsap.to(counter, {
                    duration: 2,
                    innerHTML: target,
                    snap: { innerHTML: 1 },
                    ease: 'power2.out'
                });
            }
        });
    });
}

// Parallax Effects
function initializeParallax() {
    gsap.to('.hero-bg', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        y: '50%',
        ease: 'none'
    });

    gsap.utils.toArray('.gallery-item').forEach(item => {
        gsap.to(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            },
            y: '-20%',
            ease: 'none'
        });
    });
}

// Email Notification
function sendEmailNotification(data, bookingId) {
    const subject = `New Booking Request - ${data.name}`;
    const body = `New booking request received:

Booking ID: ${bookingId}
Service: ${data.service}
Barber: ${data.barber}
Date: ${new Date(data.date).toLocaleDateString()}
Time: ${data.time}
Customer: ${data.name}
Phone: ${data.phone}
Email: ${data.email}
Notes: ${data.notes || 'None'}
Total: $${data.price}`;
    
    const mailtoLink = `mailto:barbershop@haircuttinghub.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#EF4444' : '#10B981'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function closeModal() {
    document.getElementById('success-modal').style.display = 'none';
}

function setCurrentYear() {
    document.getElementById('current-year').textContent = new Date().getFullYear();
}

// Service booking buttons
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('book-service-btn')) {
        const serviceCard = e.target.closest('.service-card');
        const serviceName = serviceCard.querySelector('h3').textContent;
        
        // Scroll to booking section
        gsap.to(window, {
            duration: 1,
            scrollTo: '#booking',
            ease: 'power2.inOut'
        });
        
        // Pre-select the service
        setTimeout(() => {
            const serviceOption = document.querySelector(`[data-service="${serviceName}"]`);
            if (serviceOption) {
                serviceOption.click();
            }
        }, 1000);
    }
});

// Gallery lightbox effect
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        // Create lightbox overlay
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            cursor: pointer;
        `;
        
        const img = item.cloneNode(true);
        img.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        `;
        
        lightbox.appendChild(img);
        document.body.appendChild(lightbox);
        
        // Animate in
        gsap.from(lightbox, { duration: 0.3, opacity: 0 });
        gsap.from(img, { duration: 0.5, scale: 0.5, ease: 'back.out(1.7)' });
        
        // Close on click
        lightbox.addEventListener('click', () => {
            gsap.to(lightbox, {
                duration: 0.3,
                opacity: 0,
                onComplete: () => lightbox.remove()
            });
        });
    });
});

// Smooth scroll for all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            gsap.to(window, {
                duration: 1,
                scrollTo: target,
                ease: 'power2.inOut'
            });
        }
    });
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;
document.head.appendChild(style);