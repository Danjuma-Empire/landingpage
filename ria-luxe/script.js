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
    if (orderForm) {
        orderForm.addEventListener('submit', function() {
            const submitBtn = this.querySelector('.btn-submit');
            if (submitBtn) {
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
            }
        });
    }
});
