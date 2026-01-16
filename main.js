/**
 * MVN FinHub - Main Logic
 * Theme: Performance, Progressive Enhancement, Interaction
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // -- Configuration --
    const SELECTORS = {
        header: '.site-header',
        animatedElements: '[data-animate]',
        staggerParents: '[data-stagger-children="true"]',
        staggerItems: '.trust-item, .situation-pill', // Auto-stagger these lists
        heroItems: '.hero-content > *'
    };

    const CLASSES = {
        scrolled: 'is-scrolled',
        visible: 'is-visible'
    };

    // -- State --
    let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // -- Feature: Sticky Header State --
    const initHeaderScroll = () => {
        const header = document.querySelector(SELECTORS.header);
        if (!header) return;

        const handleScroll = () => {
            if (window.scrollY > 20) {
                header.classList.add(CLASSES.scrolled);
            } else {
                header.classList.remove(CLASSES.scrolled);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Check on load
    };

    // -- Feature: Scroll Reveal Animations (IntersectionObserver) --
    const initScrollAnimations = () => {
        if (isReducedMotion) return; // Skip setup if reduced motion

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -10% 0px', // Trigger when element is 10% from bottom
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(CLASSES.visible);
                    obs.unobserve(entry.target); // Run once
                }
            });
        }, observerOptions);

        // 1. Target explicit animate elements
        const elements = document.querySelectorAll(SELECTORS.animatedElements);
        elements.forEach(el => observer.observe(el));

        // 2. Target Stagger Parents
        const parents = document.querySelectorAll(SELECTORS.staggerParents);
        parents.forEach(el => observer.observe(el));
        
        // 3. Auto-stagger items in lists (Trust strip & Situation pills)
        // We observe the parent, then animate children via CSS delay injection
        const listsToStagger = document.querySelectorAll('.trust-list, .situation-grid, .checklist');
        
        listsToStagger.forEach(list => {
            // Assign transition delays to children via JS for dynamic lists
            Array.from(list.children).forEach((child, index) => {
                child.style.transitionDelay = `${index * 50}ms`; // Fast stagger
                observer.observe(child);
            });
        });
        
        // 4. Hero Stagger (Manual via data-delay in HTML or JS fallbacks)
        const heroItems = document.querySelectorAll(SELECTORS.heroItems);
        heroItems.forEach((item, index) => {
             // If data-delay exists (from HTML), use it, else calc
             if (!item.getAttribute('data-delay')) {
                 item.style.transitionDelay = `${100 + (index * 100)}ms`;
             }
             // Force add class immediately for Hero if it's top of fold
             item.classList.add(CLASSES.visible);
        });
    };

    // -- Feature: Mobile Menu Toggle (Basic Accessibility) --
    const initMobileMenu = () => {
        const btn = document.querySelector('.mobile-toggle');
        const nav = document.querySelector('.nav-list');
        const cta = document.querySelector('.header-cta');
        
        if (!btn || !nav) return;

        btn.addEventListener('click', () => {
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', !isExpanded);
            
            // Note: In a full implementation, we'd toggle a class on the body or nav
            // For this output, we'll simple toggle visibility styles inline for the demo
            // assuming CSS handles the "open" state logic if class was added.
            if (!isExpanded) {
                // Open
                nav.style.display = 'flex';
                nav.style.flexDirection = 'column';
                nav.style.position = 'absolute';
                nav.style.top = '100%';
                nav.style.left = '0';
                nav.style.right = '0';
                nav.style.background = '#fff';
                nav.style.padding = '2rem';
                nav.style.borderBottom = '1px solid #eee';
                nav.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)';
            } else {
                // Close
                nav.style.display = ''; // Revert to CSS
                nav.style.position = '';
            }
        });
    };

    // -- Init --
    initHeaderScroll();
    initScrollAnimations();
    initMobileMenu();
});
