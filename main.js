// Astourist - Depot - Main JavaScript

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeCarousel();
    initializeBookingForm();
    initializeScrollReveal();
    initializeTypedText();
});

// Typed.js Hero Text Animation
function initializeTypedText() {
    if (document.getElementById('typed-text')) {
        new Typed('#typed-text', {
            strings: [
                'Discover the Himalayas',
                'Explore Shimla & Manali',
                'Your Mountain Adventure Awaits'
            ],
            typeSpeed: 60,
            backSpeed: 40,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }
}

// Initialize Animations
function initializeAnimations() {
    // Animate navigation on scroll
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('nav');
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
    });

    // Floating shapes animation
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        anime({
            targets: shape,
            translateY: [
                { value: -20, duration: 2000 },
                { value: 20, duration: 2000 }
            ],
            rotate: [
                { value: 5, duration: 2000 },
                { value: -5, duration: 2000 }
            ],
            delay: index * 500,
            loop: true,
            direction: 'alternate',
            easing: 'easeInOutSine'
        });
    });
}

// Initialize Splide Carousel
function initializeCarousel() {
    if (document.getElementById('destinations-carousel')) {
        new Splide('#destinations-carousel', {
            type: 'loop',
            perPage: 3,
            perMove: 1,
            gap: '2rem',
            autoplay: true,
            interval: 4000,
            pauseOnHover: true,
            breakpoints: {
                1024: {
                    perPage: 2,
                },
                768: {
                    perPage: 1,
                }
            }
        }).mount();
    }
}

// Booking Form Functionality
function initializeBookingForm() {
    const form = document.getElementById('booking-form');
    if (form) {
        form.addEventListener('submit', handleBookingSubmit);
    }
    
    // Set minimum date for date inputs
    const today = new Date().toISOString().split('T')[0];
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    
    if (checkinInput) checkinInput.min = today;
    if (checkoutInput) checkoutInput.min = today;
    
    // Update checkout min date when checkin changes
    if (checkinInput) {
        checkinInput.addEventListener('change', function() {
            if (checkoutInput) {
                checkoutInput.min = this.value;
                if (checkoutInput.value && checkoutInput.value < this.value) {
                    checkoutInput.value = this.value;
                }
            }
        });
    }
}

// Multi-step booking form navigation
function nextStep(currentStep) {
    const currentStepElement = document.getElementById(`booking-step-${currentStep}`);
    const nextStepElement = document.getElementById(`booking-step-${currentStep + 1}`);
    const currentStepIndicator = document.getElementById(`step-${currentStep}`);
    const nextStepIndicator = document.getElementById(`step-${currentStep + 1}`);
    const stepLine = document.getElementById(`line-${currentStep}`);
    
    // Validate current step
    if (!validateStep(currentStep)) {
        return;
    }
    
    // Hide current step
    if (currentStepElement) {
        anime({
            targets: currentStepElement,
            opacity: 0,
            translateX: -50,
            duration: 300,
            complete: function() {
                currentStepElement.classList.remove('active');
                currentStepElement.style.display = 'none';
            }
        });
    }
    
    // Show next step
    setTimeout(() => {
        if (nextStepElement) {
            nextStepElement.style.display = 'block';
            nextStepElement.classList.add('active');
            anime({
                targets: nextStepElement,
                opacity: [0, 1],
                translateX: [50, 0],
                duration: 300
            });
        }
    }, 300);
    
    // Update step indicators
    if (currentStepIndicator) {
        currentStepIndicator.classList.remove('active');
        currentStepIndicator.classList.add('completed');
    }
    
    if (nextStepIndicator) {
        nextStepIndicator.classList.add('active');
    }
    
    if (stepLine) {
        stepLine.classList.add('completed');
    }
}

function prevStep(currentStep) {
    const currentStepElement = document.getElementById(`booking-step-${currentStep}`);
    const prevStepElement = document.getElementById(`booking-step-${currentStep - 1}`);
    const currentStepIndicator = document.getElementById(`step-${currentStep}`);
    const prevStepIndicator = document.getElementById(`step-${currentStep - 1}`);
    const stepLine = document.getElementById(`line-${currentStep - 1}`);
    
    // Hide current step
    if (currentStepElement) {
        anime({
            targets: currentStepElement,
            opacity: 0,
            translateX: 50,
            duration: 300,
            complete: function() {
                currentStepElement.classList.remove('active');
                currentStepElement.style.display = 'none';
            }
        });
    }
    
    // Show previous step
    setTimeout(() => {
        if (prevStepElement) {
            prevStepElement.style.display = 'block';
            prevStepElement.classList.add('active');
            anime({
                targets: prevStepElement,
                opacity: [0, 1],
                translateX: [-50, 0],
                duration: 300
            });
        }
    }, 300);
    
    // Update step indicators
    if (currentStepIndicator) {
        currentStepIndicator.classList.remove('active');
    }
    
    if (prevStepIndicator) {
        prevStepIndicator.classList.remove('completed');
        prevStepIndicator.classList.add('active');
    }
    
    if (stepLine) {
        stepLine.classList.remove('completed');
    }
}

// Validate booking form steps
function validateStep(step) {
    switch(step) {
        case 1:
            const destination = document.getElementById('destination').value;
            if (!destination) {
                showNotification('Please select a destination', 'error');
                return false;
            }
            break;
        case 2:
            const checkin = document.getElementById('checkin').value;
            const checkout = document.getElementById('checkout').value;
            if (!checkin || !checkout) {
                showNotification('Please select both check-in and check-out dates', 'error');
                return false;
            }
            if (new Date(checkout) <= new Date(checkin)) {
                showNotification('Check-out date must be after check-in date', 'error');
                return false;
            }
            break;
    }
    return true;
}

// Handle booking form submission
function handleBookingSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        destination: document.getElementById('destination').value,
        checkin: document.getElementById('checkin').value,
        checkout: document.getElementById('checkout').value,
        adults: document.getElementById('adults').value,
        children: document.getElementById('children').value
    };
    
    // Store booking data in localStorage
    localStorage.setItem('bookingData', JSON.stringify(formData));
    
    // Show success animation
    anime({
        targets: '#booking-form',
        scale: [1, 0.95],
        duration: 200,
        complete: function() {
            // Redirect to destinations page
            window.location.href = 'destinations.html';
        }
    });
}

// Scroll Reveal Animation
function initializeScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Stagger animation for multiple elements
                const siblings = entry.target.parentElement.querySelectorAll('.reveal');
                siblings.forEach((sibling, index) => {
                    setTimeout(() => {
                        sibling.classList.add('active');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe all reveal elements
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
        type === 'error' ? 'bg-red-500 text-white' : 
        type === 'success' ? 'bg-green-500 text-white' : 
        'bg-blue-500 text-white'
    }`;
    notification.innerHTML = `
        <div class="flex items-center justify-between">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    anime({
        targets: notification,
        translateX: [300, 0],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutCubic'
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        anime({
            targets: notification,
            translateX: 300,
            opacity: 0,
            duration: 300,
            complete: function() {
                notification.remove();
            }
        });
    }, 5000);
}

// Package booking functions
function bookPackage(packageName, price) {
    const bookingData = {
        package: packageName,
        price: price,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('selectedPackage', JSON.stringify(bookingData));
    
    // Show loading animation
    showNotification('Redirecting to booking page...', 'info');
    
    setTimeout(() => {
        window.location.href = 'booking.html';
    }, 1000);
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function calculateNights(checkin, checkout) {
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    const diffTime = Math.abs(checkoutDate - checkinDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Mobile menu toggle
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Initialize payment gateway (for booking page)
function initializePaymentGateway() {
    const paymentMethods = document.querySelectorAll('.payment-method');
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            const methodType = this.dataset.method;
            switchPaymentMethod(methodType);
        });
    });
}

function switchPaymentMethod(method) {
    // Hide all payment forms
    document.querySelectorAll('.payment-form').forEach(form => {
        form.classList.add('hidden');
    });
    
    // Show selected payment form
    const selectedForm = document.getElementById(`${method}-form`);
    if (selectedForm) {
        selectedForm.classList.remove('hidden');
    }
    
    // Update active payment method
    document.querySelectorAll('.payment-method').forEach(methodEl => {
        methodEl.classList.remove('active');
    });
    
    const activeMethod = document.querySelector(`[data-method="${method}"]`);
    if (activeMethod) {
        activeMethod.classList.add('active');
    }
}

// Generate UPI QR Code (mock function)
function generateUPIQRCode(upiId, amount) {
    // In a real implementation, this would generate an actual QR code
    const qrContainer = document.getElementById('upi-qr-code');
    if (qrContainer) {
        qrContainer.innerHTML = `
            <div class="bg-white p-4 rounded-lg text-center">
                <div class="w-32 h-32 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span class="text-gray-500 text-sm">UPI QR Code</span>
                </div>
                <p class="text-sm text-gray-600">Scan to pay ₹${amount}</p>
                <p class="text-xs text-gray-500 mt-2">UPI ID: ${upiId}</p>
            </div>
        `;
    }
}

// Process payment (mock function)
function processPayment(paymentData) {
    showNotification('Processing payment...', 'info');
    
    // Simulate payment processing
    setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate
        if (success) {
            showNotification('Payment successful! Booking confirmed.', 'success');
            setTimeout(() => {
                window.location.href = 'booking.html?status=success';
            }, 2000);
        } else {
            showNotification('Payment failed. Please try again.', 'error');
        }
    }, 3000);
}

// Initialize page-specific functionality
function initializePage() {
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'destinations.html':
            initializeDestinationsPage();
            break;
        case 'booking.html':
            initializeBookingPage();
            break;
        case 'about.html':
            initializeAboutPage();
            break;
    }
}

// Call page initialization
document.addEventListener('DOMContentLoaded', initializePage);