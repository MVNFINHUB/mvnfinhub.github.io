// js/app.js
// v1.0 - Main Application Logic
// Dependencies: Supabase SDK (via window.supabase)

import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

// Initialize Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- 1. MOBILE MENU LOGIC ---
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        // Close menu if clicking outside (optional polish)
    });
}

// --- 2. COOKIE BANNER LOGIC ---
const cookieBanner = document.getElementById('cookieBanner');
const acceptBtn = document.getElementById('cookieAccept');
const declineBtn = document.getElementById('cookieDecline');

if (!localStorage.getItem('cookieConsent')) {
    setTimeout(() => cookieBanner.classList.add('show'), 2000);
}

acceptBtn.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    cookieBanner.classList.remove('show');
});

declineBtn.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'declined');
    cookieBanner.classList.remove('show');
});

// --- 3. CONTACT FORM ENGINE ---
const contactForm = document.getElementById('contactForm');
const successCard = document.getElementById('successCard');
const resetLink = document.getElementById('resetForm');

if (contactForm) {
    // A. Auto-Save Draft
    const saveDraft = () => {
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        localStorage.setItem('formDraft', JSON.stringify(data));
    };
    contactForm.addEventListener('input', saveDraft);

    // Restore Draft
    const savedDraft = localStorage.getItem('formDraft');
    if (savedDraft) {
        const data = JSON.parse(savedDraft);
        Object.keys(data).forEach(key => {
            if (contactForm.elements[key]) contactForm.elements[key].value = data[key];
        });
    }

    // B. Submission Handler
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // 1. Offline Check
        if (!navigator.onLine) {
            alert("You are currently offline. Please check your connection.");
            return;
        }

        // 2. Honeypot Check (Spam Defense)
        const honeypot = new FormData(contactForm).get('website_url');
        if (honeypot) {
            console.log("Bot detected."); // Silent fail
            return; 
        }

        // 3. Rate Limiting (5 Minutes)
        const lastSent = localStorage.getItem('lastSentTime');
        const now = Date.now();
        if (lastSent && (now - lastSent < 300000)) {
            alert("Please wait a few minutes before sending another enquiry.");
            return;
        }

        // 4. Data Gathering
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerText;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = `Sending <span class="loading-spinner"></span>`;

        const formData = new FormData(contactForm);
        
        const payload = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            service_interest: formData.get('service'),
            message: formData.get('message')
        };

        try {
            // 5. Supabase Insert
            const { error } = await supabase
                .from('contact_messages')
                .insert([payload]);

            if (error) throw error;

            // 6. Success Handling
            localStorage.removeItem('formDraft'); // Clear draft
            localStorage.setItem('lastSentTime', Date.now()); // Set cooldown
            
            // Generate Ref ID
            const refId = new Date().toISOString().slice(0,10).replace(/-/g,'') + '-' + new Date().getHours() + new Date().getMinutes();
            document.getElementById('refIdDisplay').innerText = `Reference ID: ${refId}`;

            // UI Transition
            setTimeout(() => {
                contactForm.style.display = 'none';
                successCard.classList.add('active');
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            }, 1000);

        } catch (err) {
            console.error('Error:', err);
            alert("Something went wrong. Please try again.");
            submitBtn.disabled = false;
            submitBtn.innerText = originalBtnText;
        }
    });
}

// C. Send Another Message Loop
if (resetLink) {
    resetLink.addEventListener('click', () => {
        contactForm.reset();
        successCard.classList.remove('active');
        contactForm.style.display = 'block';
        // Note: We do not clear the rate limit here to prevent abuse
    });
}
