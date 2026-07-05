document.addEventListener('DOMContentLoaded', function() {
    const footerYear = document.getElementById('footer-year');
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }

    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function getNavOffset() {
        return navbar ? navbar.offsetHeight + 8 : 80;
    }

    function closeMobileMenu() {
        if (navMenu) {
            navMenu.classList.remove('active');
        }
        document.body.style.overflow = '';
    }

    function openMobileMenu() {
        if (navMenu) {
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        }
    }

    window.addEventListener('scroll', function() {
        if (!navbar) return;

        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        const scrollPos = window.scrollY + getNavOffset();
        let currentSection = 'home';

        sections.forEach(function(section) {
            if (section.offsetTop <= scrollPos) {
                currentSection = section.id;
            }
        });

        navLinks.forEach(function(link) {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === '#' + currentSection);
        });
    });

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', openMobileMenu);

        document.addEventListener('click', function(e) {
            if (!navMenu.classList.contains('active')) return;
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            closeMobileMenu();

            const top = target.getBoundingClientRect().top + window.scrollY - getNavOffset();
            window.scrollTo({ top: top, behavior: 'smooth' });
        });
    });

    const orderForm = document.querySelector('.order-form');
    const packageSelect = document.getElementById('package');
    const ringCheckbox = document.getElementById('ring-addon');
    const ringHidden = document.getElementById('include-ring-hidden');
    const ringHint = document.getElementById('ring-addon-hint');

    function syncRingAddon() {
        if (!packageSelect || !ringCheckbox || !ringHidden) return;

        const isPremium = packageSelect.value === 'premium';

        if (isPremium) {
            ringCheckbox.checked = true;
            ringCheckbox.disabled = true;
            ringHidden.value = 'Yes (included in Premium)';
            if (ringHint) {
                ringHint.textContent = 'Coordinated ring is included in the Premium package.';
            }
        } else {
            ringCheckbox.disabled = false;
            ringHidden.value = ringCheckbox.checked ? 'Yes (Standard add-on)' : 'No';
            if (ringHint) {
                ringHint.textContent = 'Optional add-on for Standard packages.';
            }
        }
    }

    if (packageSelect && ringCheckbox) {
        packageSelect.addEventListener('change', syncRingAddon);
        ringCheckbox.addEventListener('change', syncRingAddon);
        syncRingAddon();
    }

    function resetOrderForm() {
        if (!orderForm) return;

        orderForm.reset();

        const submitBtn = orderForm.querySelector('.btn-submit');
        if (submitBtn) {
            submitBtn.textContent = 'Submit Inquiry';
            submitBtn.disabled = false;
        }

        syncRingAddon();
    }

    function showFormStatus(message, type) {
        const formStatus = document.getElementById('form-status');
        if (!formStatus) return;

        formStatus.textContent = message;
        formStatus.hidden = false;
        formStatus.classList.remove('form-status--success', 'form-status--error');
        formStatus.classList.add(type === 'error' ? 'form-status--error' : 'form-status--success');
    }

    function clearFormStatus() {
        const formStatus = document.getElementById('form-status');
        if (!formStatus) return;

        formStatus.hidden = true;
        formStatus.textContent = '';
        formStatus.classList.remove('form-status--success', 'form-status--error');
    }

    if (orderForm) {
        orderForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            syncRingAddon();
            clearFormStatus();

            const submitBtn = this.querySelector('.btn-submit');
            const defaultLabel = 'Submit Inquiry';

            if (submitBtn) {
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
            }

            try {
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: new FormData(this),
                    headers: { Accept: 'application/json' }
                });

                if (!response.ok) {
                    throw new Error('Submission failed');
                }

                resetOrderForm();
                showFormStatus('Thank you. Your inquiry was sent successfully. We will contact you soon.', 'success');
            } catch (error) {
                if (submitBtn) {
                    submitBtn.textContent = defaultLabel;
                    submitBtn.disabled = false;
                }
                showFormStatus('Something went wrong. Please try again or email us at rialuxe01@gmail.com.', 'error');
            }
        });
    }

    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            resetOrderForm();
            clearFormStatus();
        }
    });
});
