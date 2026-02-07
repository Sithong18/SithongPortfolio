// ======================================
// Mobile Menu Toggle
// ======================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ======================================
// Back to Top Button
// ======================================
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ======================================
// Portfolio Filter
// ======================================
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        portfolioCards.forEach(card => {
            // Show all cards if 'all' is selected
            if (filterValue === 'all') {
                card.classList.remove('hidden');
                card.style.animation = 'slideInUp 0.5s ease';
            } else {
                // Check if card's data-category matches filter
                if (card.getAttribute('data-category') === filterValue) {
                    card.classList.remove('hidden');
                    card.style.animation = 'slideInUp 0.5s ease';
                } else {
                    card.classList.add('hidden');
                }
            }
        });
    });
});

// ======================================
// Contact Form Validation & Submission
// ======================================
const contactForm = document.getElementById('contactForm');
const formMessage = document.querySelector('.form-message');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Prevent duplicate submissions
    if (window.isSubmitting) return;

    // Get form values
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');

    // Reset previous errors
    clearErrors();

    // Validate form
    let isValid = true;

    if (name.value.trim() === '') {
        showError(name, 'Name is required');
        isValid = false;
    }

    if (email.value.trim() === '' || !isValidEmail(email.value)) {
        showError(email, 'Valid email is required');
        isValid = false;
    }

    if (subject.value.trim() === '') {
        showError(subject, 'Subject is required');
        isValid = false;
    }

    if (message.value.trim() === '') {
        showError(message, 'Message is required');
        isValid = false;
    }

    // If valid, submit form
    if (isValid) {
        window.isSubmitting = true;
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.setAttribute('aria-disabled', 'true');
            submitBtn.style.opacity = '0.6';
            submitBtn.style.cursor = 'not-allowed';
        }

        // Simulate form submission (in real scenario, send to server)
        submitForm(name.value, email.value, subject.value, message.value);

        // Re-enable after a short cooldown
        setTimeout(() => {
            window.isSubmitting = false;
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.removeAttribute('aria-disabled');
                submitBtn.style.opacity = '1';
                submitBtn.style.cursor = 'pointer';
            }
        }, 1800);
    }
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(input, message) {
    const errorSpan = input.parentElement.querySelector('.error-message');
    input.style.borderColor = '#ef4444';
    errorSpan.textContent = message;
    errorSpan.classList.add('show');
}

function clearErrors() {
    const inputs = document.querySelectorAll('.form-group input, .form-group textarea');
    const errorSpans = document.querySelectorAll('.error-message');

    inputs.forEach(input => {
        input.style.borderColor = '';
    });

    errorSpans.forEach(span => {
        span.classList.remove('show');
        span.textContent = '';
    });
}

function submitForm(name, email, subject, message) {
    // Simulate sending data to server
    console.log('Form submitted:', { name, email, subject, message });

    // Show centered success modal instead of inline message
    showSuccessModal('✨ Thank you! Your message has been sent successfully. I\'ll get back to you soon!');

    // Reset form
    contactForm.reset();

    // In a real application, you would send this data to a server endpoint
    // Example: fetch('/api/contact', { method: 'POST', body: JSON.stringify(...) })
}

// ======================================
// Success modal helper (creates modal on first use)
// ======================================
let modalInitialized = false;
function initSuccessModal() {
    if (modalInitialized) return;
    modalInitialized = true;

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.style.display = 'none';

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `\n        <button class="close-btn" aria-label="Close">&times;</button>\n        <h3>Message Sent</h3>\n        <p class="modal-text"></p>\n        <div class="modal-actions">\n            <button class="btn btn-primary modal-ok">OK</button>\n        </div>\n    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Event listeners
    overlay.querySelector('.close-btn').addEventListener('click', hideModal);
    overlay.querySelector('.modal-ok').addEventListener('click', hideModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) hideModal();
    });
}

function showSuccessModal(message) {
    initSuccessModal();
    const overlay = document.querySelector('.modal-overlay');
    const text = overlay.querySelector('.modal-text');
    text.innerHTML = message;
    overlay.style.display = 'flex';
    // force reflow to allow transition
    requestAnimationFrame(() => overlay.classList.add('show'));

    // Auto close after 5s
    clearTimeout(overlay._timeout);
    overlay._timeout = setTimeout(hideModal, 5000);
}

function hideModal() {
    const overlay = document.querySelector('.modal-overlay');
    if (!overlay) return;
    overlay.classList.remove('show');
    clearTimeout(overlay._timeout);
    overlay._timeout = null;
    overlay.addEventListener('transitionend', function onEnd() {
        overlay.style.display = 'none';
        overlay.removeEventListener('transitionend', onEnd);
    });
}

// ======================================
// Smooth Scrolling for Navigation
// ======================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Skip if it's just '#'
        if (href !== '#') {
            e.preventDefault();

            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop;
                const navHeight = document.querySelector('.navbar').offsetHeight;

                window.scrollTo({
                    top: offsetTop - navHeight,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ======================================
// Scroll Animations (Intersection Observer)
// ======================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideInUp 0.7s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe portfolio cards and stat items
document.querySelectorAll('.portfolio-card, .stat-item, .skill-category').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ======================================
// Navbar Background on Scroll
// ======================================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }
});

// ======================================
// Skill Progress Animation
// ======================================
const skillProgressBars = document.querySelectorAll('.skill-progress');
let skillsAnimated = false;

const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !skillsAnimated) {
            skillProgressBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';

                setTimeout(() => {
                    bar.style.transition = 'width 1.5s ease';
                    bar.style.width = width;
                }, 100);
            });

            skillsAnimated = true;
            skillsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const skillsSection = document.getElementById('skills');
if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

// ======================================
// Active Navigation Link
// ======================================
window.addEventListener('scroll', () => {
    let current = '';

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        // remove active state
        link.classList.remove('active');
        link.removeAttribute('aria-current');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
});

// ======================================
// Smooth Number Counter Animation
// ======================================
const counters = document.querySelectorAll('.stat-item h3');

counters.forEach(counter => {
    const updateCounter = () => {
        const target = +counter.innerText.replace(/\D/g, '');
        const increment = target / 20;

        const updateCount = () => {
            const count = +counter.innerText.replace(/\D/g, '');

            if (count < target) {
                counter.innerText = Math.ceil(count + increment) + '+';
                setTimeout(updateCount, 50);
            } else {
                counter.innerText = target + '+';
            }
        };

        updateCount();
    };

    // Create intersection observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                updateCounter();
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counterObserver.observe(counter);
});

// ======================================
// Add Ripple Effect to Buttons
// ======================================
const buttons = document.querySelectorAll('.btn, .filter-btn, .social-icon');

buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        // Remove existing ripple if any
        const existingRipple = this.querySelector('.ripple');
        if (existingRipple) {
            existingRipple.remove();
        }

        this.appendChild(ripple);
    });
});

// ======================================
// Page Load Animation
// ======================================
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// ======================================
// Console Message (Optional)
// ======================================
console.log('%c👋 Welcome to my Portfolio!', 'color: #6366f1; font-size: 20px; font-weight: bold;');
console.log('%cLooking for a skilled web developer? Let\'s work together!', 'color: #ec4899; font-size: 14px;');
