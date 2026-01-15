// js/app.js - v4.0 OBSIDIAN
// Dependencies: Supabase SDK

import config from './config.js';

// --- 0. INIT SUPABASE ---
const supabase = window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);

// --- 1. SPOTLIGHT EFFECT (Obsidian Core) ---
// Tracks mouse movement to update CSS variables for lighting
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.spotlight-card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// --- 2. TOAST SYSTEM ---
const showToast = (message, type = 'info') => {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    if (type === 'error') toast.style.borderLeftColor = '#ef4444'; // Red
    if (type === 'success') toast.style.borderLeftColor = '#22d3ee'; // Cyan
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
};

// --- 3. MOBILE MENU ---
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => mobileNav.classList.toggle('active'));
}

// --- 4. SECURE FORM HANDLING (Blueprint Logic) ---
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    // A. Auto-Save Draft
    contactForm.addEventListener('input', () => {
        const formData = new FormData(contactForm);
        localStorage.setItem('formDraft', JSON.stringify(Object.fromEntries(formData.entries())));
    });

    // Restore Draft
    const savedDraft = localStorage.getItem('formDraft');
    if (savedDraft) {
        const data = JSON.parse(savedDraft);
        Object.keys(data).forEach(key => {
            if (contactForm.elements[key]) contactForm.elements[key].value = data[key];
        });
    }

    // B. Submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Checks: Offline, Honeypot, Rate Limit
        if (!navigator.onLine) return showToast("Offline mode. Check connection.", 'error');
        if (new FormData(contactForm).get('website_url')) return; // Bot detected
        
        const lastSent = localStorage.getItem('lastSentTime');
        if (lastSent && (Date.now() - lastSent < 300000)) return showToast("Please wait 5 mins between messages.", 'error');

        // UI Loading
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = "ENCRYPTING & SENDING...";
        btn.disabled = true;

        const formData = new FormData(contactForm);
        const payload = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            service_interest: formData.get('service'),
            message: formData.get('message'),
            created_at: new Date().toISOString()
        };

        try {
            const { error } = await supabase.from('contact_messages').insert([payload]);
            if (error) throw error;

            localStorage.removeItem('formDraft');
            localStorage.setItem('lastSentTime', Date.now());
            const refId = Date.now().toString().slice(-6);

            showToast(`SECURE TRANSMISSION COMPLETE. REF: #${refId}`, 'success');
            contactForm.reset();
            
        } catch (err) {
            console.error(err);
            showToast("Transmission Failed. Try again.", 'error');
        } finally {
            btn.innerText = "MESSAGE SENT";
            setTimeout(() => { btn.disabled = false; btn.innerText = originalText; }, 3000);
        }
    });
}
