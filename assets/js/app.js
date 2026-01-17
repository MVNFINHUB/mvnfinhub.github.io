/**
 * MVN FINHUB - APP CONTROLLER
 * Handles: Database, Mobile Menu, and Dark Mode Injection.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURATION ---
    const SUPABASE_URL = 'https://fviufivewglglnxhlmmf.supabase.co'; 
    const SUPABASE_KEY = 'sb_publishable_HYE7g0GyJbUfmldKTTAbeA_OUdc0Rah';
    // ----------------------

    // --- 1. DARK MODE LOGIC (AUTO-INJECT) ---
    // This creates the button without you touching HTML files.
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const navFlex = document.querySelector('.nav-flex');
    const mobileToggle = document.querySelector('.mobile-toggle');

    // Create the button
    const themeBtn = document.createElement('button');
    themeBtn.className = 'theme-btn';
    themeBtn.innerHTML = savedTheme === 'dark' ? '☀️' : '🌙';
    themeBtn.setAttribute('aria-label', 'Toggle Dark Mode');

    // Insert button before the mobile menu toggle
    if (navFlex && mobileToggle) {
        navFlex.insertBefore(themeBtn, mobileToggle);
    } else if (navFlex) {
        navFlex.appendChild(themeBtn);
    }

    // Toggle Function
    themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeBtn.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
    });


    // --- 2. MOBILE MENU ---
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const isExpanded = navLinks.classList.contains('active');
            menuToggle.textContent = isExpanded ? '✕' : '☰';
        });
    }

    // --- 3. DYNAMIC FOOTER ---
    const yearSpan = document.querySelector('.copyright-year');
    if(yearSpan) yearSpan.textContent = new Date().getFullYear();

    // --- 4. FORM SUBMISSION (DATABASE) ---
    const enquiryForm = document.getElementById('enquiryForm');
    const successMessage = document.getElementById('successMessage');
    const refIdDisplay = document.getElementById('refIdDisplay');

    if (enquiryForm) {
        enquiryForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validation
            if (!document.getElementById('consent').checked) {
                alert("Please agree to the Privacy Policy."); return;
            }

            const submitBtn = enquiryForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true; 
            submitBtn.textContent = 'Sending...';

            const refID = `MVN-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

            const formData = {
                full_name: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                service_type: document.getElementById('service').value,
                message: document.getElementById('message').value,
                reference_id: refID,
                status: 'New'
            };

            try {
                const response = await fetch(`${SUPABASE_URL}/rest/v1/enquiries`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`,
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) throw new Error('Server Error');

                enquiryForm.style.display = 'none';
                if(refIdDisplay) refIdDisplay.textContent = refID;
                if(successMessage) {
                    successMessage.style.display = 'block';
                    successMessage.scrollIntoView({ behavior: 'smooth' });
                }

            } catch (error) {
                console.error(error);
                alert("Connection Error. Please try again.");
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
});
