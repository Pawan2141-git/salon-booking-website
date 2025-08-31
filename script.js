// Modern Barber Shop JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeSmoothScrolling();
    initializeAnimations();
    setCurrentYear();
});

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
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            if (hamburger) {
                hamburger.classList.remove('active');
            }
        });
    });

    // Update active link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
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

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
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
}

// Initialize animations and interactions
function initializeAnimations() {
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animate counters
                if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('.service-card, .stat-card, .barber-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    // Observe stat numbers for counter animation
    document.querySelectorAll('.stat-number').forEach(counter => {
        observer.observe(counter);
    });
}

// Animate counter numbers
function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Set current year in footer
function setCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Service booking functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('book-service-btn')) {
        const serviceCard = e.target.closest('.service-card');
        const serviceName = serviceCard.querySelector('h3').textContent;
        
        // Scroll to booking section
        const bookingSection = document.getElementById('booking');
        if (bookingSection) {
            bookingSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        
        // Show notification
        showNotification(`Selected: ${serviceName}. Please scroll to booking section.`, 'success');
    }
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#EF4444' : type === 'success' ? '#10B981' : '#3B82F6'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 8px 25px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

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
`;
document.head.appendChild(style);

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add loading animation to buttons
document.querySelectorAll('.glow-button, .book-service-btn').forEach(button => {
    button.addEventListener('click', function() {
        const originalText = this.textContent;
        this.style.pointerEvents = 'none';
        this.style.opacity = '0.7';
        
        setTimeout(() => {
            this.textContent = originalText;
            this.style.pointerEvents = 'auto';
            this.style.opacity = '1';
        }, 1000);
    });
});

// Booking Wizard Functionality
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

    if (!steps.length) return; // Exit if booking wizard not found

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
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
        dateInput.addEventListener('change', () => {
            bookingData.date = dateInput.value;
        });
    }

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
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                nextStep();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevStep();
        });
    }

    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            confirmBooking();
        });
    }

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
        if (progressFill) {
            const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
            progressFill.style.width = `${progress}%`;
        }

        // Update buttons
        if (prevBtn) prevBtn.style.display = currentStep === 1 ? 'none' : 'block';
        if (nextBtn) nextBtn.style.display = currentStep === totalSteps ? 'none' : 'block';
        if (confirmBtn) confirmBtn.style.display = currentStep === totalSteps ? 'block' : 'none';

        // Update summary on last step
        if (currentStep === totalSteps) {
            updateSummary();
        }
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
        const summaryService = document.getElementById('summary-service');
        const summaryBarber = document.getElementById('summary-barber');
        const summaryDatetime = document.getElementById('summary-datetime');
        const summaryTotal = document.getElementById('summary-total');

        if (summaryService) summaryService.textContent = bookingData.service || '-';
        if (summaryBarber) summaryBarber.textContent = bookingData.barber || '-';
        
        if (bookingData.date && bookingData.time && summaryDatetime) {
            const date = new Date(bookingData.date);
            const formattedDate = date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            const time = formatTime(bookingData.time);
            summaryDatetime.textContent = `${formattedDate} at ${time}`;
        }
        
        if (summaryTotal) summaryTotal.textContent = `$${bookingData.price || '0'}`;
    }

    function confirmBooking() {
        // Generate booking ID
        const bookingId = 'HCH' + Date.now().toString().slice(-6);
        
        // Show success modal
        const bookingIdElement = document.getElementById('booking-id');
        const successModal = document.getElementById('success-modal');
        
        if (bookingIdElement) bookingIdElement.textContent = bookingId;
        if (successModal) successModal.style.display = 'block';
        
        // Send email notification
        sendEmailNotification(bookingData, bookingId);
        
        // Reset wizard after delay
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

    // Initialize wizard
    updateWizard();
}

// Close modal function
function closeModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Enhanced hover effects for service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Smooth reveal animations for sections
function revealOnScroll() {
    const reveals = document.querySelectorAll('.section-header, .service-card, .stat-card, .barber-card');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('revealed');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);

// Add reveal animation styles
const revealStyle = document.createElement('style');
revealStyle.textContent = `
    .section-header,
    .service-card,
    .stat-card,
    .barber-card {
        opacity: 0;
        transform: translateY(50px);
        transition: all 0.6s ease-out;
    }
    
    .section-header.revealed,
    .service-card.revealed,
    .stat-card.revealed,
    .barber-card.revealed {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(revealStyle);

// Initialize reveal animation
revealOnScroll();

// Initialize booking wizard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeBookingWizard();
});